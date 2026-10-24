/**
 * Set the session cookie.
 */
export async function setSessionCookie(
  token: string,
  expires: Date
): Promise<void> {
  const store = await cookies();
  const requestHeaders = await headers();

  const proto = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();

  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase();

  const isLocal =
    /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/.test(
      host
    );

  const viaHttpsPage = /^https:\/\//i.test(
    requestHeaders.get("origin") ??
      requestHeaders.get("referer") ??
      ""
  );

  // यदि लोकलहोस्ट (Localhost) नहीं है, तो हमेशा इसे true ही रखें ताकि Render पर कभी फेल न हो
  const https = isLocal ? false : true;

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    // Render (HTTPS) पर हमेशा 'none' और लोकल पर 'lax'
    sameSite: https ? "none" : "lax",
    // Render पर हमेशा true और लोकल पर false
    secure: https,
    ...(https ? { partitioned: true } : {}),
    path: "/",
    expires,
  });
}
