// app/api/wallet/reconcile/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { db } from "@/index";
import { users, payments } from "@/schema";
import { eq, sql, and } from "drizzle-orm";
import { getUser } from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. User ke saare 'created' (pending) payments nikalein
    const pendingPayments = await db.select().from(payments)
      .where(and(eq(payments.userId, user.id), eq(payments.status, "created")));

    if (pendingPayments.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No pending payments found.",
        recoveredCount: 0 
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    let recoveredCount = 0;
    let totalRecoveredPaise = 0;

    // 2. Har pending payment ko Razorpay se check karein
    for (const payment of pendingPayments) {
      try {
        // Razorpay par is order ke payments fetch karein
        const rzpOrders: any = await razorpay.orders.fetchPayments(payment.orderId);
        
        // Agar koi captured payment milta hai
        const capturedPayment = rzpOrders.items?.find((p: any) => p.status === "captured");

        if (capturedPayment) {
          // 3. Bonus Logic (₹51+ par 10%)
          let finalAmountToAdd = payment.amountPaise;
          const amountInRupees = payment.amountPaise / 100;
          if (amountInRupees >= 51) {
            finalAmountToAdd += Math.floor(amountInRupees * 0.1) * 100;
          }

          // 4. Atomic Transaction: Wallet + Payment Status update
          await db.transaction(async (tx) => {
            const updated = await tx.update(payments)
              .set({ 
                paymentId: capturedPayment.id, 
                status: "paid", 
                paidAt: new Date() 
              })
              .where(and(
                eq(payments.id, payment.id), 
                eq(payments.status, "created")
              ))
              .returning();

            if (updated.length > 0) {
              await tx.update(users)
                .set({ walletBalancePaise: sql`${users.walletBalancePaise} + ${finalAmountToAdd}` })
                .where(eq(users.id, user.id));
              
              recoveredCount++;
              totalRecoveredPaise += finalAmountToAdd;
            }
          });

          console.log(`[Reconcile] Recovered payment ${payment.orderId} for user ${user.id}, amount: ₹${finalAmountToAdd / 100}`);
        }
      } catch (err: any) {
        console.error(`[Reconcile] Failed for order ${payment.orderId}:`, err.message);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Recovered ${recoveredCount} payments.`,
      recoveredCount,
      totalRecoveredRupees: totalRecoveredPaise / 100
    });

  } catch (error: any) {
    console.error("[Reconcile] Error:", error.message);
    return NextResponse.json({ error: "Reconciliation failed" }, { status: 500 });
  }
}