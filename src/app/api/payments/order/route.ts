import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments } from "@/db/schema";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { userId, amountInINR } = await request.json();

    if (!userId || !amountInINR) {
      return NextResponse.json({ error: "userId और amount अनिवार्य हैं।" }, { status: 400 });
    }

    // अमाउंट को पैसे (Paise) में बदलें (जैसे: ₹499 = 49900 पैसे)
    const amountPaise = amountInINR * 100;

    // 1. Razorpay पर ऑर्डर जनरेट करें
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_u_${userId}_${Date.now()}`,
    });

    // 2. अपनी Drizzle DB की payments टेबल में एंट्री लॉग करें
    await db.insert(payments).values({
      userId: userId,
      orderId: order.id,
      amountPaise: amountPaise,
      currency: "INR",
      status: "created",
    });

    // फ्रंटएंड को Razorpay Order Details भेजें
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json({ error: "पेमेंट ऑर्डर जनरेट करने में विफलता।" }, { status: 500 });
  }
}
