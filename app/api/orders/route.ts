// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/index";
import { payments } from "@/schema";
import { getUser } from "@/auth";
import { eq, desc } from "drizzle-orm";

// 🔥 Force dynamic taaki Next.js isko cache na kare, hamesha naya data fetch ho
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Check karo ki user login hai ya nahi
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Database se user ke saare payments fetch karo
    // (Latest order sabse pehle aayega)
    const userOrders = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, user.id))
      .orderBy(desc(payments.createdAt));

    // 3. Data return karo
    return NextResponse.json({ orders: userOrders });

  } catch (error: any) {
    // Agar database mein koi error aaye toh log karo aur 500 error bhejo
    console.error("Fetch Orders Error:", error);
    
    return NextResponse.json({ 
      error: "Failed to fetch orders", 
      details: error.message 
    }, { status: 500 });
  }
}