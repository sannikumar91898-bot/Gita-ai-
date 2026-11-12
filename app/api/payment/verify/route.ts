// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/index";
import { users, payments } from "@/schema";
import { eq, sql, and } from "drizzle-orm";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    // 1. HMAC Signature Verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    // Length check (Server crash se bachne ke liye)
    if (expectedSignature.length !== razorpay_signature.length) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(razorpay_signature, "utf-8")
    );

    if (!isSignatureValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Database se order dhundo 
    // 🔥 FIX: Status 'created' ki condition yahan se hata di hai taaki Webhook conflict na kare
    const paymentRecord = await db.select().from(payments)
      .where(and(
        eq(payments.orderId, razorpay_order_id), 
        eq(payments.userId, user.id)
      ))
      .limit(1);

    const payment = paymentRecord[0];
    if (!payment) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // 🔥 MAIN FIX: Agar Webhook ne pehle hi isko 'paid' kar diya hai, toh seedha Success bhejo
    if (payment.status === "paid") {
      return NextResponse.json({
        success: true,
        message: "Payment already verified by webhook.",
      });
    }

    // 3. Razorpay API SE ACTUAL STATUS CHECK KAREIN
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpPayment: any = await razorpay.payments.fetch(razorpay_payment_id);

    if (rzpPayment.status !== "captured") {
      return NextResponse.json({ error: "Payment is not captured yet." }, { status: 400 });
    }

    if (rzpPayment.currency !== "INR") {
      return NextResponse.json({ error: "Currency mismatch." }, { status: 400 });
    }

    if (rzpPayment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: "Order ID mismatch." }, { status: 400 });
    }

    if (rzpPayment.amount !== payment.amountPaise) {
      return NextResponse.json({ error: "Amount mismatch." }, { status: 400 });
    }

    // 4. Bonus Logic (₹51 ya zyada par 10% extra)
    let finalAmountToAdd = payment.amountPaise;
    const amountInRupees = payment.amountPaise / 100;
    if (amountInRupees >= 51) {
      finalAmountToAdd += Math.floor(amountInRupees * 0.1) * 100;
    }

    // 5. ATOMIC TRANSACTION (Double spending se bachne ke liye)
    await db.transaction(async (tx) => {
      const updatedPayment = await tx.update(payments)
        .set({ 
          paymentId: razorpay_payment_id, 
          status: "paid", 
          paidAt: new Date() 
        })
        .where(and(
          eq(payments.id, payment.id), 
          eq(payments.status, "created")
        ))
        .returning();

      // Agar updatedPayment khali aaya, matlab kisi aur process (webhook) ne pehle hi isko process kar diya hai
      if (updatedPayment.length === 0) {
        throw new Error("PAYMENT_ALREADY_PROCESSED");
      }

      // Add to Wallet
      await tx.update(users)
        .set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${finalAmountToAdd}` })
        .where(eq(users.id, user.id));
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified. Wallet updated.",
      addedAmount: finalAmountToAdd / 100,
    });

  } catch (error: any) {
    console.error("Verify Error:", error?.message);
    
    if (error?.message === "PAYMENT_ALREADY_PROCESSED") {
      // Agar yahan aaya matlab DB update hone ki koshish mein race lagi, par process ho chuka hai
      return NextResponse.json({ success: true, message: "Already processed." }, { status: 200 }); 
    }
    
    return NextResponse.json({ error: "Verification failed. Please contact support." }, { status: 500 });
  }
}