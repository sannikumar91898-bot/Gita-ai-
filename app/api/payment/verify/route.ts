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
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // 1. Signature Verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Database se order dhundo (status must be 'created')
    const paymentRecord = await db.select().from(payments)
      .where(and(eq(payments.orderId, razorpay_order_id), eq(payments.userId, user.id), eq(payments.status, "created")))
      .limit(1);

    const payment = paymentRecord[0];
    if (!payment) {
      return NextResponse.json({ error: "Order not found or already processed." }, { status: 400 });
    }

    // 3. 🔥 RAZORPAY API SE ACTUAL STATUS CHECK KAREIN 🔥
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpPayment: any = await razorpay.payments.fetch(razorpay_payment_id);

    // Kya Razorpay kehta hai ki paisa aaya?
    if (rzpPayment.status !== "captured" && rzpPayment.status !== "authorized") {
      return NextResponse.json({ error: "Payment not captured by Razorpay." }, { status: 400 });
    }

    // Kya amount match kar raha hai?
    if (rzpPayment.amount !== payment.amountPaise) {
      return NextResponse.json({ error: "Amount mismatch." }, { status: 400 });
    }

    // 4. Bonus Logic (₹51 ya zyada par 10% extra)
    let finalAmountToAdd = payment.amountPaise;
    const amountInRupees = payment.amountPaise / 100;
    if (amountInRupees >= 51) {
      finalAmountToAdd += Math.floor(amountInRupees * 0.1) * 100;
    }

    // 5. 🔥 ATOMIC TRANSACTION & DUPLICATE PROTECTION 🔥
    await db.transaction(async (tx) => {
      // Update payment status from 'created' to 'paid'
      // Agar yeh return empty array hua, matlab koi aur process ne isko pehle hi 'paid' kar diya hai.
      const updatedPayment = await tx.update(payments)
        .set({ paymentId: razorpay_payment_id, status: "paid", paidAt: new Date() })
        .where(and(eq(payments.id, payment.id), eq(payments.status, "created")))
        .returning();

      if (updatedPayment.length === 0) {
        throw new Error("Payment already processed"); // Rokein taaki double paisa na mile
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
    return NextResponse.json({ error: "Verification failed or payment already processed." }, { status: 500 });
  }
}