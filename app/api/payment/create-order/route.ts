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
    // 1. Check User Login
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please login again." }, { status: 401 });
    }

    // 2. Check Environment Variables (Asli issue yahan hota hai aksar)
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("❌ ERROR: Razorpay Keys missing in Render Environment Variables");
      return NextResponse.json({ error: "Payment gateway config missing." }, { status: 500 });
    }

    // 3. Parse and Validate Amount
    const { amount } = await req.json();
    if (!amount || !ALLOWED_AMOUNTS.includes(Number(amount))) {
      return NextResponse.json({ error: "Invalid amount. Please select from available packages." }, { status: 400 });
    }

    // 4. Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Number(amount) * 100, // Convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    // 5. Create Order on Razorpay (Alag Try-Catch taaki exact error mile)
    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (razorpayError: any) {
      console.error("❌ RAZORPAY API ERROR:", razorpayError);
      return NextResponse.json({ 
        error: "Razorpay API failed. Check KYC or Keys.",
        details: razorpayError?.error?.description || razorpayError.message 
      }, { status: 502 });
    }

    // 6. Save to Database (Alag Try-Catch taaki pata chale table bani hai ya nahi)
    try {
      await db.insert(payments).values({
        userId: user.id,
        orderId: order.id,
        amountPaise: Number(order.amount),
        status: "created",
      });
    } catch (dbError: any) {
      console.error("❌ DATABASE INSERT ERROR:", dbError);
      return NextResponse.json({ 
        error: "Database error. Did you run npx drizzle-kit push?",
        details: dbError.message 
      }, { status: 500 });
    }

    // 7. Success Response
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      key: keyId,
    });

  } catch (error: any) {
    // 8. Fallback Catch
    console.error("❌ UNEXPECTED SERVER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}