// app/api/chat/history/route.ts
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { getUser } from "@/auth";
import { db } from "@/index";
import { conversations } from "@/schema";

// Node.js runtime ensure karein
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. User Authentication Check
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Session not found. Please login." }, { status: 401 });
    }

    // 2. Database se User ki Saari Conversations Fetch Karein
    // Hum sirf zaroori fields select kar rahe hain taaki response fast ho
    const history = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        persona: conversations.persona,
        topic: conversations.topic,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .where(eq(conversations.userId, user.id)) // 🔥 Security: Sirf apni chats dikhein
      .orderBy(desc(conversations.updatedAt)) // 🔥 Latest chat sabse upar
      .limit(50); // 🔥 Max 50 chats load karein (Pagination baad me laga sakte hain)

    // 3. Success Response
    return NextResponse.json({
      success: true,
      history: history,
    });

  } catch (error: any) {
    console.error("CHAT HISTORY API ERROR:", error);
    
    return NextResponse.json(
      { success: false, error: "Chat history load nahi ho payi. Kripya thodi der baad try karein." },
      { status: 500 }
    );
  }
}