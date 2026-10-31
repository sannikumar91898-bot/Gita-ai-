import { NextResponse } from "next/server";
import {
  createGuestUser,
  createSession,
  setSessionCookie,
  getUser, // 🔥 Import kiya taaki pehle session check kar sakein
} from "@/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 🔥 FIX: Agar user ka session pehle se hai, toh naya guest mat banao
    const existingUser = await getUser();
    if (existingUser) {
      return NextResponse.json(
        {
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            language: existingUser.language,
            isGuest: existingUser.isGuest,
          },
        },
        { status: 200 }
      );
    }

    // Agar naya user hai, toh guest create karo
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