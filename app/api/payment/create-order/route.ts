// app/api/payment/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getUser } from "@/auth";
import { db } from "@/index";
import { payments } from "@/schema"; // 🔥 Database schema import kiya

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount } = await req.json(); // Amount rupees mein aayega (e.g., 11)

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Razorpay initialize karo
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100, // Razorpay paise leta hai
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 🔥 SABSE ZAROORI STEP: Order ko database mein save karo 🔥
    await db.insert(payments).values({
      userId: user.id,
      orderId: order.id,
      amountPaise: order.amount, // Razorpay ne jo paise mein amount diya (e.g., 1100)
      status: "created",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}