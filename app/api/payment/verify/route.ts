import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/index";
import { users, payments } from "@/schema";
import { eq, sql } from "drizzle-orm";
import { getUser } from "@/auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      amount 
    } = await req.json();

    // Signature verify karo
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // 🔥 Payment Sach mein Successful hai, Wallet mein paisa add karo 🔥
      await db.update(users)
        .set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${amount * 100}` })
        .where(eq(users.id, user.id));

      // Payment record save karo
      await db.insert(payments).values({
        userId: user.id,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amountPaise: amount * 100,
        status: "paid",
        paidAt: new Date(),
      });

      return NextResponse.json({ success: true, message: "Wallet updated" });
    } else {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Verification failed:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}