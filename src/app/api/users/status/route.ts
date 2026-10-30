import { NextResponse } from "next/server";
import { db } from "@/db"; // आपका Drizzle DB इंस्टेंस पाथ
import { users } from "@/db/schema"; // आपका स्कीमा पाथ
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // URL से userId पैरामीटर निकालें (उदा: /api/users/status?userId=your-id)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId पैरामीटर अनिवार्य है।" },
        { status: 400 }
      );
    }

    // Drizzle ORM से यूज़र का रिकॉर्ड निकालें
    const [userRecord] = await db
      .select({
        isGuest: users.isGuest,
        premiumUntil: users.premiumUntil,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json(
        { error: "यूज़र रिकॉर्ड नहीं मिला।" },
        { status: 404 }
      );
    }

    // फ्रंटएंड को यूज़र का प्रीमियम स्टेटस और एक्सपायरी डेट भेजें
    return NextResponse.json({
      isGuest: userRecord.isGuest,
      premiumUntil: userRecord.premiumUntil, // यह null हो सकता है या ISO Date स्ट्रिंग
    });

  } catch (error) {
    console.error("Error fetching user status API:", error);
    return NextResponse.json(
      { error: "यूज़र स्टेटस फेच करने में सर्वर एरर आया।" },
      { status: 500 }
    );
  }
}
