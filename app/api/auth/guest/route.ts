
import { NextResponse } from "next/server";
import {
  createGuestUser,
  createSession,
  setSessionCookie,
} from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const guest = await createGuestUser("en");
    const session = await createSession(guest.id);

    await setSessionCookie(session.token, session.expires);

    return NextResponse.json(
      {
        user: {
          id: guest.id,
          name: guest.name,
          email: guest.email,
          language: guest.language,
          isGuest: guest.isGuest,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Guest session creation failed:", error);

    return NextResponse.json(
      { error: "Unable to start guest session" },
      { status: 500 }
    );
  }
}
