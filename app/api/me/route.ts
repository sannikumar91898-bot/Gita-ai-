// app/api/me/route.ts
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getUser } from "@/auth";
import { db } from "@/index";
import { users, birthDetails, charts } from "@/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessionUser = await getUser();
    if (!sessionUser) return NextResponse.json({ user: null });

    const [userRow] = await db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1);
    if (!userRow) return NextResponse.json({ user: null });

    const [birthRow] = await db.select().from(birthDetails).where(eq(birthDetails.userId, sessionUser.id)).limit(1);
    const [chartRow] = await db.select().from(charts).where(eq(charts.userId, sessionUser.id)).orderBy(desc(charts.createdAt)).limit(1);

    const birth = birthRow ? {
      name: birthRow.name,
      dob: birthRow.dob,
      birthTime: birthRow.birthTime,
      birthPlace: birthRow.birthPlace,
      gender: birthRow.gender, // 🔥 NEW
      isBirthTimeUnknown: birthRow.isBirthTimeUnknown, // 🔥 NEW
    } : null;

    return NextResponse.json({
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        language: userRow.language,
        isGuest: userRow.isGuest,
        walletBalancePaise: userRow.walletBalancePaise,
        freeMessagesUsed: userRow.freeMessagesUsed,
        premiumUntil: userRow.premiumUntil,
      },
      birth,
      hasChart: !!chartRow,
      googleAuthConfigured: true,
    }, { headers: { "Cache-Control": "no-store" } });

  } catch (error) {
    console.error("API /me error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}