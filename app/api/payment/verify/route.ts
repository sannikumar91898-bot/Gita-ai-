import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/index";
import { users } from "@/schema";
import { eq, sql } from "drizzle-orm";
import { getUser } from "@/auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    
    // 1. Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 🔥 SECURITY: Client se amount MAT lo. Razorpay se fetch karo ya apne order database se check karo.
    // Abhi ke liye hum maan rahe hain ki aapne Razorpay order create karte waqt DB mein save kiya hoga (ya API se fetch karenge).
    // Dummy amount for this example (Replace with actual DB fetch):
    const verifiedAmountPaise = 50000; // 500 INR

    // 2. Atomically update wallet balance
    await db.update(users)
      .set({ 
        walletBalancePaise: sql`${users.walletBalancePaise} + ${verifiedAmountPaise}` 
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true, message: "Payment verified and wallet updated." });
    
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}