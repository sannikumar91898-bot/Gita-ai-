export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";

import { db } from "@/index";
import { remedies } from "@/schema";
import { getUser } from "@/auth";

const createSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(""),
  category: z.string().trim().max(40).default("general"),
});

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const rows = await db
    .select()
    .from(remedies)
    .where(eq(remedies.userId, user.id))
    .orderBy(desc(remedies.createdAt));

  return NextResponse.json({ remedies: rows });
}

export async function POST(req: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const parsed = createSchema.safeParse(
    await req.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid remedy" },
      { status: 400 }
    );
  }

  const [row] = await db
    .insert(remedies)
    .values({ userId: user.id, ...parsed.data })
    .returning();

  return NextResponse.json({ remedy: row });
}

export async function PATCH(req: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;

  if (!id) {
    return NextResponse.json(
      { error: "Invalid id" },
      { status: 400 }
    );
  }

  const rows = await db
    .select()
    .from(remedies)
    .where(
      and(eq(remedies.id, id), eq(remedies.userId, user.id))
    )
    .limit(1);

  const row = rows[0];

  if (!row) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const dates = row.completedDates.includes(today)
    ? row.completedDates.filter((date) => date !== today)
    : [...row.completedDates, today];

  const [updated] = await db
    .update(remedies)
    .set({ completedDates: dates })
    .where(
      and(eq(remedies.id, id), eq(remedies.userId, user.id))
    )
    .returning();

  return NextResponse.json({ remedy: updated });
}

export async function DELETE(req: NextRequest) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not signed in" },
      { status: 401 }
    );
  }

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

  await db
    .delete(remedies)
    .where(
      and(eq(remedies.id, id), eq(remedies.userId, user.id))
    );

  return NextResponse.json({ ok: true });
}
