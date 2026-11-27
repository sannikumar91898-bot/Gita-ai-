import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

import { getUser } from "@/auth";
import { db } from "@/index";
import { birthDetails, charts } from "@/schema";
import { computeChart, type KundliChart } from "@/vedic";

import { getKundliError } from "./messages";
import {
  SUPPORTED_LANGUAGES,
  type ChargeKind,
  type SupportedLanguage,
  calculatedReport,
  chargeForKundli,
  isRecord,
  jsonError,
  publicChart,
  refundKundli,
  resolvePlace,
  validDate,
  validTime,
  writeInterpretation,
} from "./helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- GET: Existing Kundli ----------
export async function GET() {
  const userRow = await getUser();

  if (!userRow || userRow.isGuest) {
    return NextResponse.json(
      { birth: null, chart: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const [birthRows, chartRows] = await Promise.all([
    db
      .select()
      .from(birthDetails)
      .where(eq(birthDetails.userId, userRow.id))
      .limit(1),

    db
      .select()
      .from(charts)
      .where(eq(charts.userId, userRow.id))
      .orderBy(desc(charts.createdAt))
      .limit(1),
  ]);

  const birth = birthRows[0]
    ? {
        name: birthRows[0].name,
        dob: birthRows[0].dob,
        birthTime: birthRows[0].birthTime,
        birthPlace: birthRows[0].birthPlace,
        gender: birthRows[0].gender,
        isBirthTimeUnknown: birthRows[0].isBirthTimeUnknown,
      }
    : null;

  const stored =
    birthRows[0] && chartRows[0] ? (chartRows[0].data as KundliChart) : null;

  return NextResponse.json(
    {
      birth,
      chart: stored && stored.lagna ? publicChart(stored) : null,
      calculatedReport:
        stored && stored.lagna
          ? calculatedReport(birth?.name || "", stored)
          : null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

// ---------- POST: Generate Kundli ----------
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError(getKundliError("hi", "invalid_req"), 400);
  }

  if (!isRecord(body)) {
    return jsonError(getKundliError("hi", "invalid_req"), 400);
  }

  const requestedLanguage =
    typeof body.language === "string" ? body.language : "hi";

  const language: SupportedLanguage = SUPPORTED_LANGUAGES.includes(
    requestedLanguage as SupportedLanguage
  )
    ? (requestedLanguage as SupportedLanguage)
    : "hi";

  const consent = body.consent === true;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const dateOfBirth =
    typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";
  const timeOfBirth =
    typeof body.timeOfBirth === "string" ? body.timeOfBirth : "12:00";
  const placeOfBirth =
    typeof body.placeOfBirth === "string" ? body.placeOfBirth.trim() : "";
  const gender = typeof body.gender === "string" ? body.gender : "other";
  const isBirthTimeUnknown = body.isBirthTimeUnknown === true;

  if (!consent) {
    return jsonError(getKundliError(language, "consent"), 400);
  }

  if (!name || !dateOfBirth || !placeOfBirth) {
    return jsonError(getKundliError(language, "missing_fields"), 400);
  }

  if (!validDate(dateOfBirth) || !validTime(timeOfBirth)) {
    return jsonError(getKundliError(language, "bad_details"), 400);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  if (dateOfBirth > todayStr) {
    return jsonError(getKundliError(language, "future_date"), 400);
  }

  let userRow;

  try {
    userRow = await getUser();
  } catch (error) {
    console.error("Kundli authentication error:", error);
    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  // 🔥 YEH 3 LINES ADD KI GAYI HAIN (Null Guard Fix)
  if (!userRow) {
    return jsonError(getKundliError(language, "calc_failed"), 401);
  }

  const place = await resolvePlace(placeOfBirth);

  if (!place) {
    return jsonError(getKundliError(language, "place_not_found"), 400);
  }

  let chart: KundliChart;

  try {
    chart = computeChart({
      dob: dateOfBirth,
      time: timeOfBirth,
      lat: place.lat,
      lng: place.lng,
      timeZone: place.timeZone,
    });
  } catch (error) {
    console.error("Kundli calculation error:", error);
    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  if (!chart || !chart.lagna) {
    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  let charged: ChargeKind;

  try {
    charged = await chargeForKundli(userRow.id);
  } catch (error) {
    console.error("Kundli billing error:", error);
    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  if (charged === "none") {
    return jsonError(getKundliError(language, "wallet_recharge"), 402);
  }

  try {
    await db
      .insert(birthDetails)
      .values({
        userId: userRow.id,
        name,
        gender,
        isBirthTimeUnknown,
        dob: dateOfBirth,
        birthTime: timeOfBirth,
        birthPlace: placeOfBirth,
        lat: place.lat,
        lng: place.lng,
        timeZone: place.timeZone,
        consent: true,
      })
      .onConflictDoUpdate({
        target: birthDetails.userId,
        set: {
          name,
          gender,
          isBirthTimeUnknown,
          dob: dateOfBirth,
          birthTime: timeOfBirth,
          birthPlace: placeOfBirth,
          lat: place.lat,
          lng: place.lng,
          timeZone: place.timeZone,
          consent: true,
          updatedAt: new Date(),
        },
      });

    await db.insert(charts).values({
      userId: userRow.id,
      data: chart,
    });
  } catch (error) {
    console.error("Kundli save error:", error);
    await refundKundli(userRow.id, charged);
    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  const interpretation = await writeInterpretation({
    name,
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    chart,
    language,
  });

  return NextResponse.json(
    {
      chart: publicChart(chart),
      calculatedReport: calculatedReport(name, chart),
      interpretation: interpretation.text,
      interpretationStatus: interpretation.status,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}