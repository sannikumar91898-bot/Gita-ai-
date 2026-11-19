import { sql, eq, and, gte, lt } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  // ---------- Parse request ----------
  try {
    body = await request.json();
  } catch {
    return jsonError(getKundliError("hi", "invalid_req"), 400);
  }

  if (!isRecord(body)) {
    return jsonError(getKundliError("hi", "invalid_req"), 400);
  }

  // ---------- Input fields ----------
  const language = typeof body.language === "string" ? body.language : "hi";
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

  // ---------- Validation ----------
  if (!consent) {
    return jsonError(getKundliError(language, "consent"), 400);
  }

  if (!name || !dateOfBirth || !placeOfBirth) {
    return jsonError(getKundliError(language, "missing_fields"), 400);
  }

  if (!validDate(dateOfBirth)) {
    return jsonError(getKundliError(language, "bad_details"), 400);
  }

  if (!validTime(timeOfBirth)) {
    return jsonError(getKundliError(language, "bad_details"), 400);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  if (dateOfBirth > todayStr) {
    return jsonError(getKundliError(language, "future_date"), 400);
  }

  // ---------- Authentication ----------
  let userRow;

  try {
    userRow = await getUser();
  } catch (error) {
    console.error("Kundli authentication error:", error);
    return jsonError(getKundliError(language, "calc_failed"), 500);
  }

  if (!userRow || userRow.isGuest) {
    return jsonError(getKundliError(language, "guest_blocked"), 401);
  }

  const freeUsed = userRow.freeKundliUsed ?? 0;
  const walletBalance = userRow.walletBalancePaise ?? 0;

  const isFreeKundli = freeUsed < FREE_KUNDLI_LIMIT;
  const needsWalletCharge = !isFreeKundli;

  // ---------- Wallet pre-check ----------
  if (
    needsWalletCharge &&
    walletBalance < COST_PER_KUNDLI_PAISE
  ) {
    return jsonError(getKundliError(language, "wallet_recharge"), 402);
  }

  // ---------- Resolve birthplace ----------
  let place;

  try {
    place = await resolvePlace(placeOfBirth);
  } catch (error) {
    console.error("Place resolution error:", error);
    return jsonError(getKundliError(language, "place_not_found"), 400);
  }

  if (!place) {
    return jsonError(getKundliError(language, "place_not_found"), 400);
  }

  // ---------- Calculate Kundli ----------
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
    return jsonError(getKundliError(language, "calc_failed"), 400);
  }

  // ---------- Save / update birth details ----------
  try {
    const existing = await db
      .select()
      .from(birthDetails)
      .where(eq(birthDetails.userId, userRow.id))
      .limit(1);

    if (existing[0]) {
      await db
        .update(birthDetails)
        .set({
          name,
          dob: dateOfBirth,
          birthTime: timeOfBirth,
          birthPlace: placeOfBirth,
          gender,
          isBirthTimeUnknown,
        })
        .where(eq(birthDetails.userId, userRow.id));
    } else {
      await db.insert(birthDetails).values({
        id: crypto.randomUUID(),
        userId: userRow.id,
        name,
        dob: dateOfBirth,
        birthTime: timeOfBirth,
        birthPlace: placeOfBirth,
        gender,
        isBirthTimeUnknown,
      });
    }
  } catch (error) {
    console.error("Birth details save error:", error);
    // Non-fatal
  }

  // ---------- Save chart history ----------
  try {
    await db.insert(charts).values({
      id: crypto.randomUUID(),
      userId: userRow.id,
      data: chart as unknown as Record<string, unknown>,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Chart history save error:", error);
    // Non-fatal
  }

  // ---------- Charge wallet / increment free usage ----------
  let chargedPaise = 0;

  try {
    if (needsWalletCharge) {
      // Atomic wallet deduction.
      // RETURNING confirms whether deduction actually happened.
      const [charged] = await db
        .update(users)
        .set({
          walletBalancePaise: sql`${users.walletBalancePaise} - ${COST_PER_KUNDLI_PAISE}`,
        })
        .where(
          and(
            eq(users.id, userRow.id),
            gte(users.walletBalancePaise, COST_PER_KUNDLI_PAISE)
          )
        )
        .returning({
          walletBalancePaise: users.walletBalancePaise,
        });

      if (!charged) {
        return jsonError(
          getKundliError(language, "wallet_recharge"),
          402
        );
      }

      chargedPaise = COST_PER_KUNDLI_PAISE;
    } else {
      // Atomic free Kundli counter increment.
      // RETURNING confirms whether quota was consumed.
      const [updated] = await db
        .update(users)
        .set({
          freeKundliUsed: sql`${users.freeKundliUsed} + 1`,
        })
        .where(
          and(
            eq(users.id, userRow.id),
            lt(users.freeKundliUsed, FREE_KUNDLI_LIMIT)
          )
        )
        .returning({
          freeKundliUsed: users.freeKundliUsed,
        });

      if (!updated) {
        return jsonError(
          getKundliError(language, "wallet_recharge"),
          402
        );
      }
    }
  } catch (error) {
    console.error("Kundli payment/quota error:", error);

    return jsonError(
      getKundliError(language, "calc_failed"),
      500
    );
  }

  // ---------- AI interpretation ----------
  let interpretation: Awaited<ReturnType<typeof writeInterpretation>>;

  try {
    interpretation = await writeInterpretation({
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      chart,
      language,
    });
  } catch (error) {
    console.error("Kundli AI interpretation error:", error);

    // NOTE:
    // If a paid Kundli was charged above and AI fails,
    // refund logic should be implemented here.
    return jsonError(
      getKundliError(language, "calc_failed"),
      500
    );
  }

  // ---------- Success response ----------
  return NextResponse.json(
    {
      birth: {
        name,
        dob: dateOfBirth,
        birthTime: timeOfBirth,
        birthPlace: placeOfBirth,
        gender,
        isBirthTimeUnknown,
      },

      chart: publicChart(chart),

      calculatedReport: calculatedReport(name, chart),

      interpretation: interpretation.text,

      interpretationStatus: interpretation.status,

      isFreeKundli,

      chargedPaise,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}