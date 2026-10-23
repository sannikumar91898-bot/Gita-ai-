# ✦ Gita AI — Your Personal AI Astrologer

A premium, mobile-first AI astrology platform: personalised Vedic kundli, trilingual AI chat
(Hindi / Hinglish / English), daily horoscope, palm reading, remedy tracking, a server-controlled
20-second trial and verified ₹49/week Premium — built with Next.js, TypeScript, Drizzle ORM,
PostgreSQL and the Gemini API. Installable as a PWA; Android APK packaging workflow included.

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js App Router, Tailwind CSS v4, Lucide icons |
| Database | PostgreSQL + Drizzle ORM (works with local PG, Supabase PG, Neon, etc.) |
| Auth | HTTP-only session cookies; guest accounts + optional Google OAuth |
| AI | Gemini API — server-side only (`GEMINI_API_KEY` never reaches the browser) |
| Charts | `astronomy-engine` ephemeris + Lahiri ayanāṁśa, whole-sign houses, Vimshottari dasha |
| Payments | Razorpay orders + HMAC signature verification + idempotent webhooks |
| PWA / Android | Web manifest + service worker; Bubblewrap TWA GitHub Actions workflow |

> **Architecture note:** the spec suggested Supabase Auth/DB. This build uses first-party
> cookie-session auth + Drizzle/Postgres, which deploys identically on Vercel with any managed
> Postgres (including Supabase's). All privileged operations are server-side and every query
> is scoped to the authenticated user.

## Setup

```bash
npm install
cp .env.example .env        # fill in values (see below)
npx drizzle-kit push        # create tables
npm run dev
```

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string |
| `GEMINI_API_KEY` | for live AI | Server-only. Without it, chat shows clearly-labelled offline chart-based guidance; palm reading is disabled with an honest message |
| `GEMINI_MODEL` | optional | Defaults to `gemini-2.0-flash`. Verify current model availability & free-tier quotas at https://ai.google.dev — free access is **not** unlimited |
| `NEXT_PUBLIC_APP_URL` | ✅ in prod | Public origin, used for OAuth redirects |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | Enables "Continue with Google". Redirect URI: `{APP_URL}/api/auth/google/callback` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | for payments | Until set, the paywall shows: "Payment verification is not configured yet. Please try again later." No simulated payments, ever |
| `RAZORPAY_WEBHOOK_SECRET` | for webhooks | Webhook endpoint: `{APP_URL}/api/payments/webhook` |
| `NEXT_PUBLIC_APK_URL` | optional | Set only after a signed APK release exists; the /download page then shows the real link |

**Never commit real secrets.** `.env` is git-ignored; `.env.example` contains placeholder names only.

## Tests

```bash
npx tsx --test tests/*.test.ts
```

Covers trial start/expiry boundaries, premium extension/renewal stacking, Razorpay checkout &
webhook signature verification (valid, tampered, wrong-secret, swapped IDs), and the Vedic
engine (UTC conversion, ayanāṁśa range, sidereal Sun sign for a reference birth, Rahu–Ketu
opposition, whole-sign houses, dasha continuity). Auth & entitlement enforcement live in the
API routes (`getUser()` + `computeEntitlement()` on every privileged request; the client can
never assert its own premium status).

## Business rules

- **Trial:** 20 seconds of AI chat, started server-side on the first AI request and persisted
  in `users.trialStartedAt`. Expiry is computed on the server on every request.
- **Premium:** ₹49/week (`4900` paise). Granted **only** after HMAC-SHA256 verification of
  `order_id|payment_id` or an authenticated, deduplicated `payment.captured` webhook.
  Renewals stack from the current expiry. Access expires automatically after 7 days.
- **Fair use:** 12 messages/min, 120/hour (disclosed in the UI).

## Deploying (GitHub → Vercel)

1. Push this repo to GitHub (secrets excluded).
2. Import into Vercel; add the environment variables above.
3. Point `DATABASE_URL` at a managed Postgres and run `npx drizzle-kit push` once against it.
4. Configure Google OAuth redirect URI and Razorpay webhook for your production domain.

## Android APK

See `.github/workflows/android.yml`. It packages the deployed PWA as a Trusted Web Activity
with Bubblewrap and signs it with a keystore provided via repository secrets
(`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`, `TWA_HOST`).
Signing keys are documented in the workflow and never committed. After a successful build,
publish the artifact as a GitHub Release and set `NEXT_PUBLIC_APK_URL` — the /download page
only shows a download button when a real artifact URL is configured.

## Troubleshooting

- **Chat says "offline guidance mode"** — `GEMINI_API_KEY` is missing/invalid or the API is
  unreachable/quota-exhausted. Check the key, model name and your quota at ai.google.dev.
- **"Payment verification is not configured yet"** — Razorpay keys are not set. This is the
  intended safe state; no entitlement is granted.
- **Google button missing** — set `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` and the redirect URI.
- **Place search empty** — the free Open-Meteo geocoding API may be rate-limited; retry.
- **Schema errors** — run `npx drizzle-kit push` after pulling schema changes.

## Known limitations / later phases

- Voice responses & lip-synced talking avatar are deliberately **not** faked; planned for a later phase.
- Ayanāṁśa uses a linear Lahiri model (accurate to arc-minutes for modern dates).
- Rate limiting is per server instance (in-memory); use a shared store for multi-instance scale.
- Compatibility readings are interpretive reflections from available chart data, not a full guna-milan engine.