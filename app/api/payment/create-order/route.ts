// app/api/payment/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getUser } from "@/auth";
import { db } from "@/index";
import { payments } from "@/schema";

// 🔥 Allowed Packages 🔥
const ALLOWED_AMOUNTS = [11, 21, 51, 101, 121, 151];

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { amount } = await req.json();

    // 🔥 Security Check: Kya amount allowed list mein hai? 🔥
    if (!amount || !ALLOWED_AMOUNTS.includes(Number(amount))) {
      return NextResponse.json({ error: "Invalid amount. Please select from available packages." }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Number(amount) * 100, // 🔥 FIX: Number me convert kiya
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await db.insert(payments).values({
      userId: user.id,
      orderId: order.id,
      amountPaise: Number(order.amount), // 🔥 FIX: Yahan Number() laga diya taaki Type Error khatam ho
      status: "created",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Payment gateway error. Please try again." }, { status: 500 });
  }
}