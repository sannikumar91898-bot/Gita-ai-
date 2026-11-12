// app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/index";
import { users, payments } from "@/schema";
import { eq, sql, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // 1. Razorpay signature header aur raw body nikalein
    const signature = req.headers.get("x-razorpay-signature");
    const rawBody = await req.text(); // Webhook me raw body chahiye hoti hai

    if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook secret or signature missing" }, { status: 400 });
    }

    // 2. Signature Verify Karein (Security ke liye)
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    // 🔥 CRITICAL FIX: Length check (Server crash se bachne ke liye) 🔥
    if (expectedSignature.length !== signature.length) {
      return NextResponse.json({ error: "Invalid webhook signature length" }, { status: 400 });
    }

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );

    if (!isSignatureValid) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    // 3. Body ko parse karein
    const body = JSON.parse(rawBody);
    
    // Sirf 'payment.captured' event ko handle karein
    if (body.event !== "payment.captured") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const paymentEntity = body.payload.payment.entity;
    const razorpay_order_id = paymentEntity.order_id;
    const razorpay_payment_id = paymentEntity.id;
    const amountPaise = paymentEntity.amount;

    // 🔥 NEW FIX: Currency Validation 🔥
    if (paymentEntity.currency !== "INR") {
      console.error("Webhook currency mismatch");
      return NextResponse.json({ error: "Currency mismatch" }, { status: 400 });
    }

    // 4. Database mein order dhundein (Sirf orderId se, status se nahi)
    const paymentRecord = await db.select().from(payments)
      .where(eq(payments.orderId, razorpay_order_id))
      .limit(1);

    const payment = paymentRecord[0];
    
    // 🔥 FIX 1: Agar order database me hi nahi mila, toh 404 do (Razorpay retry karega)
    if (!payment) {
      console.error(`Webhook Error: Order ${razorpay_order_id} not found in DB.`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🔥 FIX 2: Agar order pehle se 'paid' hai, toh kuch mat karein (Idempotency)
    if (payment.status === "paid") {
      return NextResponse.json({ status: "already_processed" }, { status: 200 });
    }

    // Check karein ki amount match ho raha hai ya nahi
    if (amountPaise !== payment.amountPaise) {
      console.error("Webhook amount mismatch");
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // 5. Bonus Logic (₹51 ya zyada par 10% extra)
    let finalAmountToAdd = payment.amountPaise;
    const amountInRupees = payment.amountPaise / 100;
    if (amountInRupees >= 51) {
      finalAmountToAdd += Math.floor(amountInRupees * 0.1) * 100;
    }

    // 6. 🔥 ATOMIC TRANSACTION (Double spending se bachne ke liye) 🔥
    await db.transaction(async (tx) => {
      const updatedPayment = await tx.update(payments)
        .set({ 
          paymentId: razorpay_payment_id, 
          status: "paid", 
          paidAt: new Date() 
        })
        .where(and(
          eq(payments.id, payment.id), 
          eq(payments.status, "created") // Safety check
        ))
        .returning();

      if (updatedPayment.length === 0) {
        throw new Error("PAYMENT_ALREADY_PROCESSED");
      }

      // User ke wallet me paise add karein
      await tx.update(users)
        .set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${finalAmountToAdd}` })
        .where(eq(users.id, payment.userId)); 
    });

    return NextResponse.json({ status: "success" }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    
    if (error.message === "PAYMENT_ALREADY_PROCESSED") {
      return NextResponse.json({ status: "already_processed" }, { status: 200 });
    }
    
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}