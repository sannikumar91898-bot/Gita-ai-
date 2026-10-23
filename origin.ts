import type { NextRequest } from "next/server";

/** Public origin: NEXT_PUBLIC_APP_URL if set, else derived from proxy headers. */
export function appOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (env) return env.replace(/\/$/, "");
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0].trim() || "http";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}
