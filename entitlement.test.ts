import { test } from "node:test";
import assert from "node:assert/strict";
import { computeEntitlement, extendPremium, TRIAL_SECONDS } from "../src/lib/entitlement";

const NOW = new Date("2026-01-01T12:00:00Z");

test("fresh user has a full 20-second trial available", () => {
  const e = computeEntitlement({ trialStartedAt: null, premiumUntil: null }, NOW);
  assert.equal(e.state, "trial");
  assert.equal(e.hasAccess, true);
  assert.equal(e.trialSecondsLeft, TRIAL_SECONDS);
});

test("trial is active within 20 seconds of server start", () => {
  const started = new Date(NOW.getTime() - 5000);
  const e = computeEntitlement({ trialStartedAt: started, premiumUntil: null }, NOW);
  assert.equal(e.state, "trial_active");
  assert.equal(e.hasAccess, true);
  assert.equal(e.trialSecondsLeft, 15);
});

test("trial expires exactly at 20 seconds and denies access", () => {
  const started = new Date(NOW.getTime() - 20000);
  const e = computeEntitlement({ trialStartedAt: started, premiumUntil: null }, NOW);
  assert.equal(e.state, "expired");
  assert.equal(e.hasAccess, false);
  assert.equal(e.trialSecondsLeft, 0);
});

test("expired trial stays expired even after long time", () => {
  const started = new Date(NOW.getTime() - 86400000);
  const e = computeEntitlement({ trialStartedAt: started, premiumUntil: null }, NOW);
  assert.equal(e.hasAccess, false);
});

test("active premium grants access even with expired trial", () => {
  const e = computeEntitlement(
    { trialStartedAt: new Date(NOW.getTime() - 999999), premiumUntil: new Date(NOW.getTime() + 86400000) },
    NOW
  );
  assert.equal(e.state, "premium");
  assert.equal(e.hasAccess, true);
});

test("expired premium falls back to trial state", () => {
  const e = computeEntitlement(
    { trialStartedAt: new Date(NOW.getTime() - 60000), premiumUntil: new Date(NOW.getTime() - 1000) },
    NOW
  );
  assert.equal(e.state, "expired");
  assert.equal(e.hasAccess, false);
});

test("renewal extends from current expiry, not from now", () => {
  const current = new Date(NOW.getTime() + 3 * 86400000);
  const next = extendPremium(current, NOW);
  assert.equal(next.getTime(), current.getTime() + 7 * 86400000);
});

test("first purchase extends 7 days from now", () => {
  const next = extendPremium(null, NOW);
  assert.equal(next.getTime(), NOW.getTime() + 7 * 86400000);
});
