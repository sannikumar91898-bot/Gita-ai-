import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

import { getUser } from "@/auth";
import { db } from "@/index";
import { birthDetails, charts } from "@/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({
        user: null,
        entitlement: null,
        birth: null,
        hasChart: false,
        googleAuthConfigured: Boolean(
          process.env.GOOGLE_CLIENT_ID &&
          process.env.GOOGLE_CLIENT_SECRET
        ),
      });
    }

    const [birthRows, chartRows] = await Promise.all([
      db
        .select()
        .from(birthDetails)
        .where(eq(birthDetails.userId, user.id))
        .limit(1),

      db
        .select()
        .from(charts)
        .where(eq(charts.userId, user.id))
        .orderBy(desc(charts.createdAt))
        .limit(1),
    ]);

    const birthRecord = birthRows[0] ?? null;

    const birth = birthRecord
      ? {
          name: birthRecord.name,
          dob: birthRecord.dob,
          birthTime: birthRecord.birthTime,
          birthPlace: birthRecord.birthPlace,
        }
      : null;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        language: user.language,
        isGuest: user.isGuest,
      },
      entitlement: {
        trialStartedAt: user.trialStartedAt,
        premiumUntil: user.premiumUntil,
      },
      birth,
      hasChart: chartRows.length > 0,
      googleAuthConfigured: Boolean(
        process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_SECRET
      ),
    });
  } catch (error) {
    console.error("GET /api/me failed:", error);

    return NextResponse.json(
      { error: "Unable to load session" },
      { status: 500 }
    );
  }
}
