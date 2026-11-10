// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getUser } from "@/auth";
import { db } from "@/index";
import { users } from "@/schema";

// 🔥 10 languages update ki gayi hain
const SUPPORTED_LANGUAGES = ["en", "hi", "hinglish", "te", "ta", "kn", "bn", "mr", "gu", "ml"];

export async function PATCH(request: Request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { language } = body;

    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return NextResponse.json({ error: "Invalid language" }, { status: 400 });
    }

    await db.update(users).set({ language }).where(eq(users.id, user.id));

    return NextResponse.json({ success: true, language });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}