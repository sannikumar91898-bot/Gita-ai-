// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/index";
import { users, payments } from "@/schema"; // Payments table import kiya
import { eq, sql, and } from "drizzle-orm";
import { getUser } from "@/auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Frontend se sirf IDs aayengi, amount NAHI aayega
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // 2. Razorpay Signature Verify karein
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 3. 🔥 DATABASE SE ORDER CHECK KAREIN 🔥
    // Hum wahi order dhundh rahe hain jo 'created' state mein hai
    const paymentRecord = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.orderId, razorpay_order_id),
          eq(payments.userId, user.id),
          eq(payments.status, "created") // Sirf naya order process hoga
        )
      )
      .limit(1);

    const payment = paymentRecord[0];

    if (!payment) {
      return NextResponse.json(
        { error: "Order not found or already processed." },
        { status: 400 }
      );
    }

    // 4. Amount Database se uthaya (Bina kisi hacker ke interference ke)
    let verifiedAmountPaise = payment.amountPaise;
    
    // 🔥 BONUS LOGIC (Agar ₹51 ya usse zyada hai, toh 10% extra)
    const amountInRupees = verifiedAmountPaise / 100;
    if (amountInRupees >= 51) {
      const bonusPaise = Math.floor(amountInRupees * 0.1) * 100;
      verifiedAmountPaise += bonusPaise;
    }

    // 5. 🔥 ATOMIC TRANSACTION 🔥
    // Ek hi baar mein payment ko 'paid' mark karo aur wallet mein balance badhao
    await db.transaction(async (tx) => {
      // Payment status update karein
      await tx
        .update(payments)
        .set({
          paymentId: razorpay_payment_id,
          status: "paid",
          paidAt: new Date(),
        })
        .where(eq(payments.id, payment.id));

      // User ke wallet mein actual amount add karein
      await tx
        .update(users)
        .set({
          walletBalancePaise: sql`${users.walletBalancePaise} + ${verifiedAmountPaise}`,
        })
        .where(eq(users.id, user.id));
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and wallet updated successfully.",
      addedAmount: verifiedAmountPaise / 100, // Frontend ko bata sakte hain kitna add hua
    });

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}