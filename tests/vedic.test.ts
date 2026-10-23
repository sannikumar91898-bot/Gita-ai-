import { test } from "node:test";
import assert from "node:assert/strict";
import { computeChart, lahiriAyanamsa, birthToUtc, currentMoonSign } from "../src/lib/vedic";

// Reference: 15 Aug 1990, 08:30 IST, New Delhi
const params = { dob: "1990-08-15", time: "08:30", lat: 28.6139, lng: 77.209, timeZone: "Asia/Kolkata" };

test("birth time converts to UTC with correct IST offset", () => {
  const utc = birthToUtc(params.dob, params.time, params.timeZone);
  assert.equal(utc.toISOString(), "1990-08-15T03:00:00.000Z");
});

test("Lahiri ayanamsa is in the expected modern range", () => {
  const ay = lahiriAyanamsa(new Date("2026-01-01T00:00:00Z"));
  assert.ok(ay > 23.9 && ay < 24.4, `ayanamsa ${ay} out of range`);
});

test("chart computes all 9 grahas with valid sidereal positions", () => {
  const chart = computeChart(params);
  assert.equal(chart.planets.length, 9);
  for (const p of chart.planets) {
    assert.ok(p.longitude >= 0 && p.longitude < 360);
    assert.ok(p.rashi >= 0 && p.rashi <= 11);
    assert.ok(p.house >= 1 && p.house <= 12);
    assert.ok(p.degreeInSign >= 0 && p.degreeInSign < 30);
  }
});

test("Sun is in Cancer/Leo for mid-August 1990 (sidereal)", () => {
  const chart = computeChart(params);
  const sun = chart.planets.find((p) => p.planet === "Sun")!;
  // Sidereal Sun on 15 Aug 1990 ≈ 28° Cancer
  assert.equal(sun.rashi, 3, `expected Cancer, got ${sun.rashiName}`);
});

test("Rahu and Ketu are exactly opposite", () => {
  const chart = computeChart(params);
  const rahu = chart.planets.find((p) => p.planet === "Rahu")!;
  const ketu = chart.planets.find((p) => p.planet === "Ketu")!;
  const diff = Math.abs(((rahu.longitude - ketu.longitude) % 360 + 360) % 360);
  assert.ok(Math.abs(diff - 180) < 0.02);
});

test("twelve whole-sign houses follow from lagna", () => {
  const chart = computeChart(params);
  assert.equal(chart.houses.length, 12);
  assert.equal(chart.houses[0].rashi, chart.lagna.rashi);
  for (let i = 0; i < 12; i++) {
    assert.equal(chart.houses[i].rashi, (chart.lagna.rashi + i) % 12);
  }
});

test("Vimshottari dasha timeline is continuous and covers current date", () => {
  const chart = computeChart(params);
  assert.ok(chart.dashas.length >= 9);
  for (let i = 1; i < chart.dashas.length; i++) {
    assert.equal(chart.dashas[i].start, chart.dashas[i - 1].end);
  }
  assert.ok(chart.currentDasha, "current dasha should exist");
});

test("nakshatra pada is between 1 and 4", () => {
  const chart = computeChart(params);
  assert.ok(chart.nakshatra.pada >= 1 && chart.nakshatra.pada <= 4);
  assert.ok(chart.nakshatra.index >= 0 && chart.nakshatra.index <= 26);
});

test("current transit moon sign is valid", () => {
  const m = currentMoonSign(new Date("2026-01-01T00:00:00Z"));
  assert.ok(m.rashi >= 0 && m.rashi <= 11);
});
