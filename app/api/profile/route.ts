
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getUser } from "@/auth";
import { db } from "@/index";
import { users } from "@/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SUPPORTED_LANGUAGES = ["en", "hi", "hinglish"] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export async function PATCH(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json().catch(() => null);

    if (
      typeof body !== "object" ||
      body === null ||
      !("language" in body)
    ) {
      return NextResponse.json(
        { error: "Language is required" },
        { status: 400 }
      );
    }

    const language = body.language;

    if (
      typeof language !== "string" ||
      !SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
    ) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    const [updatedUser] = await db
      .update(users)
      .set({ language })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        language: users.language,
      });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/profile failed:", error);

    return NextResponse.json(
      { error: "Unable to update profile" },
      { status: 500 }
    );
  }
}
