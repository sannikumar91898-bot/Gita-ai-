/** 
 * Simple in-memory sliding-window rate limiter (per server instance). 
 * Upgraded to support multi-window evaluation (12/min and 120/hr fair-use policy).
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  
  if (arr.length >= limit) {
    buckets.set(key, arr);
    return false;
  }
  
  arr.push(now);
  buckets.set(key, arr);
  
  // Memory leak protection to clean stale buckets
  if (buckets.size > 10000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

/**
 * High-level orchestration check specifically mapped to the Gita AI fair-use rules.
 * Evaluates both 12 messages/min and 120 messages/hour sequentially.
 * 
 * @param userId - Authenticated user identifier
 * @returns { allowed: boolean, reason?: string }
 */
export function checkAILimit(userId: string): { allowed: boolean; reason?: string } {
  const ONE_MINUTE_MS = 60 * 1000;
  const ONE_HOUR_MS = 60 * 60 * 1000;

  // 1. Check Minutely Window (Max 12 messages per minute)
  const minuteAllowed = rateLimit(`${userId}:min`, 12, ONE_MINUTE_MS);
  if (!minuteAllowed) {
    return {
      allowed: false,
      reason: "Too many requests per minute (Max 12 msgs/min). Please wait a few seconds.",
    };
  }

  // 2. Check Hourly Window (Max 120 messages per hour)
  const hourAllowed = rateLimit(`${userId}:hr`, 120, ONE_HOUR_MS);
  if (!hourAllowed) {
    return {
      allowed: false,
      reason: "Hourly fair-use limit reached (Max 120 messages/hour). Cooldown active.",
    };
  }

  return { allowed: true };
}
