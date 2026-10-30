import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, users, webhookEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

    // 1. Razorpay सिग्नेचर को वेरीफाई करें (सुरक्षा के लिए अत्यंत आवश्यक)
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "अमान्य वेबहुक सिग्नेचर।" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const orderId = event.data.payload.payment.entity.order_id;
    const paymentId = event.data.payload.payment.entity.id;

    // केवल 'payment.captured' इवेंट्स को प्रोसेस करें
    if (event.event === "payment.captured") {
      
      // 2. Idempotency Check: जांचें कि यह इवेंट पहले ही प्रोसेस तो नहीं हो चुका
      const [existingEvent] = await db
        .select()
        .from(webhookEvents)
        .where(eq(webhookEvents.eventId, event.id))
        .limit(1);

      if (existingEvent) {
        return NextResponse.json({ status: "already_processed" });
      }

      // 3. पेमेंट रिकॉर्ड ढूंढें और अपडेट करें
      const [paymentRecord] = await db
        .select()
        .from(payments)
        .where(eq(payments.orderId, orderId))
        .limit(1);

      if (paymentRecord) {
        await db.transaction(async (tx) => {
          // क) पेमेंट स्टेटस को 'paid' अपडेट करें
          await tx
            .update(payments)
            .set({
              status: "paid",
              paymentId: paymentId,
              paidAt: new Date(),
            })
            .where(eq(payments.orderId, orderId));

          // ख) यूज़र को 30 दिनों के लिए प्रीमियम एक्सेस दें (Premium Until Time-lock)
          const premiumUntilDate = new Date();
          premiumUntilDate.setDate(premiumUntilDate.getDate() + 30);

          await tx
            .update(users)
            .set({
              isGuest: false,
              premiumUntil: premiumUntilDate,
            })
            .where(eq(users.id, paymentRecord.userId));

          // ग) वेबहुक इवेंट्स लॉग टेबल में इस आईडी को लॉक करें
          await tx.insert(webhookEvents).values({
            eventId: event.id,
            processedAt: new Date(),
          });
        });
      }
    }

    return NextResponse.json({ status: "success" });

  } catch (error) {
    console.error("Webhook Processing Error:", error);
    return NextResponse.json({ error: "वेबहुक हैंडल करने में गड़बड़ हुई।" }, { status: 500 });
  }
}
