import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sign } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing on the server" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://googleapis.com{apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Gita AI, an expert Vedic Astrologer. Generate a detailed daily horoscope predictions for the zodiac sign: ${sign || "General"}. Provide insights on Career, Health, Love, and Lucky Number/Color in Hindi language. Keep the tone very warm and positive.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "API Error", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Horoscope currently unavailable";

    return NextResponse.json({ prediction: textOutput }, { status: 200 });

  } catch (error: any) {
    console.error("Daily Horoscope API System Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
