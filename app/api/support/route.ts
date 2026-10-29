import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

import { getUser } from "@/auth";
import { db } from "@/index";
import { supportTickets } from "@/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES = [
  "login",
  "registration",
  "chat",
  "kundli",
  "payment",
  "bug",
  "feedback",
  "other",
] as const;

function jsonError(error: string, status: number) {
  return NextResponse.json(
    { error },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

async function sendSupportEmail(ticket: {
  id: string;
  email: string | null;
  category: string;
  subject: string;
  message: string;
  userId: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUPPORT_EMAIL || "micsal91898@gmail.com";
  const from = process.env.SUPPORT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error(
      "Support email not configured. Ticket is still saved in database.",
    );
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[Gita AI Support] ${ticket.category}: ${ticket.subject}`,
      text: [
        "New Gita AI support ticket",
        "",
        `Ticket ID: ${ticket.id}`,
        `Category: ${ticket.category}`,
        `Customer email: ${ticket.email || "Not provided"}`,
        `Customer reference: ${ticket.userId || "Unavailable"}`,
        "",
        "Customer message:",
        ticket.message,
        "",
        "Reply through your configured support workflow. Do not share private account data.",
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    console.error("Support email provider failed:", response.status, details);
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const user = await getUser();

    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return jsonError("Invalid request.", 400);
    }

    const data = body as Record<string, unknown>;

    // Hidden honeypot field: bots that fill it are rejected.
    if (
      typeof data.website === "string" &&
      data.website.trim().length > 0
    ) {
      return NextResponse.json({ success: true });
    }

    const category =
      typeof data.category === "string" ? data.category : "";
    const subject =
      typeof data.subject === "string" ? data.subject.trim() : "";
    const message =
      typeof data.message === "string" ? data.message.trim() : "";
    const suppliedEmail =
      typeof data.email === "string"
        ? data.email.trim().toLowerCase()
        : "";

    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      return jsonError("Please select a valid issue category.", 400);
    }

    if (subject.length < 3 || subject.length > 120) {
      return jsonError("Subject must be between 3 and 120 characters.", 400);
    }

    if (message.length < 10 || message.length > 4000) {
      return jsonError("Message must be between 10 and 4000 characters.", 400);
    }

    if (
      suppliedEmail.length > 254 ||
      (suppliedEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suppliedEmail))
    ) {
      return jsonError("Please enter a valid email address.", 400);
    }

    // Prefer the email already associated with the session.
    const email = user?.email || suppliedEmail || null;

    const [ticket] = await db
      .insert(supportTickets)
      .values({
        userId: user?.id ?? null,
        email,
        category,
        subject,
        message,
        status: "open",
      })
      .returning({
        id: supportTickets.id,
        userId: supportTickets.userId,
        email: supportTickets.email,
        category: supportTickets.category,
        subject: supportTickets.subject,
        message: supportTickets.message,
      });

    if (!ticket) {
      return jsonError("Unable to save your support request.", 500);
    }

    // Database save succeeds independently of email delivery.
    const emailSent = await sendSupportEmail(ticket);

    return NextResponse.json(
      {
        success: true,
        ticketId: ticket.id,
        notificationSent: emailSent,
        message: emailSent
          ? "Your request has been sent to support."
          : "Your request has been saved. Email notification is not configured or temporarily unavailable.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/support failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return jsonError("Unable to submit your request right now.", 500);
  }
}

export async function GET() {
  try {
    const user = await getUser();
    const adminEmail = process.env.SUPPORT_ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    if (
      !user ||
      user.isGuest ||
      !user.email ||
      !adminEmail ||
      user.email.toLowerCase() !== adminEmail
    ) {
      return jsonError("Forbidden.", 403);
    }

    const tickets = await db
      .select({
        id: supportTickets.id,
        userId: supportTickets.userId,
        email: supportTickets.email,
        category: supportTickets.category,
        subject: supportTickets.subject,
        message: supportTickets.message,
        status: supportTickets.status,
        createdAt: supportTickets.createdAt,
      })
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt))
      .limit(100);

    return NextResponse.json(
      { tickets },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error(
      "GET /api/support failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return jsonError("Unable to load support requests.", 500);
  }
}