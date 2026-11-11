// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db } from "@/index";
import { users, payments } from "@/schema";
import { eq, sql, and } from "drizzle-orm";
import { getUser } from "@/auth";

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

    // 2. Database se order dhundo (🔥 Yahan se status: "created" hataya hai)
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

    // 🔥 MAIN FIX: Agar Webhook pehle hi isko 'paid' kar chuka hai, toh error mat do, Success bolo!
    if (payment.status === "paid") {
      return NextResponse.json({ success: true, message: "Payment already processed by webhook." }, { status: 200 });
    }

    if (payment.status !== "created") {
      return NextResponse.json({ error: "Invalid payment state." }, { status: 400 });
    }

    // 3. Razorpay API se actual status check karein
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpPayment: any = await razorpay.payments.fetch(razorpay_payment_id);

    if (rzpPayment.status !== "captured") {
      return NextResponse.json({ error: "Payment is not captured yet." }, { status: 400 });
    }

    if (rzpPayment.currency !== "INR" || rzpPayment.order_id !== razorpay_order_id || rzpPayment.amount !== payment.amountPaise) {
      return NextResponse.json({ error: "Payment details mismatch." }, { status: 400 });
    }

    // 4. Bonus Logic
    let finalAmountToAdd = payment.amountPaise;
    const amountInRupees = payment.amountPaise / 100;
    if (amountInRupees >= 51) {
      finalAmountToAdd += Math.floor(amountInRupees * 0.1) * 100;
    }

    // 5. Atomic Transaction
    await db.transaction(async (tx) => {
      // Update status to paid
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

      // Agar koi aur parallel request isko pehle hi update kar chuki hai
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
    console.error("Verify Error:", error.message);
    if (error.message === "PAYMENT_ALREADY_PROCESSED") {
      // Agar transaction fail hua kyunki webhook bhi same time par chala, toh frontend ko 200 de do
      return NextResponse.json({ success: true, message: "Already processed" }, { status: 200 }); 
    }
    return NextResponse.json({ error: "Verification failed. Please contact support." }, { status: 500 });
  }
}