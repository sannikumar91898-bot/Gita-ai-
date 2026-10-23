/**
 * Server-controlled trial & premium entitlement logic.
 * Never trust a client-supplied premium flag — everything derives from DB timestamps.
 */
export const TRIAL_SECONDS = 20;
export const PREMIUM_PRICE_PAISE = 4900; // ₹49
export const PREMIUM_PERIOD_DAYS = 7;

export type Entitlement = {
  state: "premium" | "trial" | "trial_active" | "expired";
  trialStartedAt: string | null;
  trialSecondsLeft: number;
  premiumUntil: string | null;
  hasAccess: boolean;
};

export function computeEntitlement(
  user: { trialStartedAt: Date | null; premiumUntil: Date | null },
  now: Date = new Date()
): Entitlement {
  const premiumActive = !!user.premiumUntil && user.premiumUntil.getTime() > now.getTime();
  if (premiumActive) {
    return {
      state: "premium",
      trialStartedAt: user.trialStartedAt?.toISOString() ?? null,
      trialSecondsLeft: 0,
      premiumUntil: user.premiumUntil!.toISOString(),
      hasAccess: true,
    };
  }
  if (!user.trialStartedAt) {
    return {
      state: "trial",
      trialStartedAt: null,
      trialSecondsLeft: TRIAL_SECONDS,
      premiumUntil: user.premiumUntil?.toISOString() ?? null,
      hasAccess: true,
    };
  }
  const elapsedMs = now.getTime() - user.trialStartedAt.getTime();
  const secondsLeft = Math.max(0, Math.ceil((TRIAL_SECONDS * 1000 - elapsedMs) / 1000));
  return {
    state: secondsLeft > 0 ? "trial_active" : "expired",
    trialStartedAt: user.trialStartedAt.toISOString(),
    trialSecondsLeft: secondsLeft,
    premiumUntil: user.premiumUntil?.toISOString() ?? null,
    hasAccess: secondsLeft > 0,
  };
}

/** Extend premium from max(now, current expiry) so renewals stack correctly. */
export function extendPremium(
  currentPremiumUntil: Date | null,
  now: Date = new Date(),
  days: number = PREMIUM_PERIOD_DAYS
): Date {
  const base =
    currentPremiumUntil && currentPremiumUntil.getTime() > now.getTime()
      ? currentPremiumUntil
      : now;
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}
