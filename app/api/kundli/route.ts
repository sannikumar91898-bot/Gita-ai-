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

  if (!consent) return jsonError(getKundliError(language, "consent"), 400);
  if (!name || !dateOfBirth || !placeOfBirth) {
    return jsonError(getKundliError(language, "missing_fields"), 400);
  }
  if (!validDate(dateOfBirth)) {
    return jsonError(getKundliError(language, "bad_details"), 400);
  }
  if (!validTime(timeOfBirth)) {
    return jsonError(getKundliError(language, "bad_details"), 400);
  }

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  if (dateOfBirth > todayStr) {
    return jsonError(getKundliError(language, "future_date"), 400);
  }

  const userRow = await getUser();

  if (!userRow || userRow.isGuest) {
    return jsonError(getKundliError(language, "guest_blocked"), 401);
  }

  const freeUsed = userRow.freeKundliUsed ?? 0;
  const walletBalance = userRow.walletBalancePaise ?? 0;

  const isFreeKundli = freeUsed < FREE_KUNDLI_LIMIT;
  const needsWalletCharge = !isFreeKundli;

  if (needsWalletCharge && walletBalance < COST_PER_KUNDLI_PAISE) {
    return jsonError(getKundliError(language, "wallet_recharge"), 402);
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
  } catch {
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
  } catch {
    // non-fatal
  }

  // ---------- Save chart history ----------
  try {
    await db.insert(charts).values({
      id: crypto.randomUUID(),
      userId: userRow.id,
      data: chart as unknown as Record<string, unknown>,
      createdAt: new Date(),
    });
  } catch {
    // non-fatal
  }

  // ---------- Charge wallet or increment free counter ----------
  try {
    if (needsWalletCharge) {
      await db
        .update(users)
        .set({ walletBalancePaise: walletBalance - COST_PER_KUNDLI_PAISE })
        .where(eq(users.id, userRow.id));
    } else {
      await db
        .update(users)
        .set({ freeKundliUsed: freeUsed + 1 })
        .where(eq(users.id, userRow.id));
    }
  } catch {
    // non-fatal
  }

  // ---------- AI interpretation ----------
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
      chargedPaise: needsWalletCharge ? COST_PER_KUNDLI_PAISE : 0,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}