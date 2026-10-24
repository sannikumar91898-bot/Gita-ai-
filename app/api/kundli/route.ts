import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing on the server" },
        { status: 500 }
      );
    }

    // 1. यहाँ Gemini API के सही URL फॉर्मेट का इस्तेमाल किया गया है
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
                  text: `You are Gita AI, a precise Vedic Astrologer. Generate a detailed Vedic Kundli summary chart readings for:
                  Name: ${name}
                  Date of Birth: ${dateOfBirth}
                  Time of Birth: ${timeOfBirth}
                  Place of Birth: ${placeOfBirth}
                  
                  Provide Lagna overview, Planetary positions insights, major current Dasha effects, and spiritual remedies in clean Hindi language.`,
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
    
    // 2. यहाँ सिंथैक्स एरर को ठीक कर दिया गया है (डबल ?.?. को हटाकर सही एरे इंडेक्स [0] लगाया है)
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Kundli generation failed";

    return NextResponse.json({ kundliReport: textOutput }, { status: 200 });

  } catch (error: any) {
    console.error("Kundli API System Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
