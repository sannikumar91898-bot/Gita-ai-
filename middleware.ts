// middleware.ts  (project root — app/ ke bahar)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];
const defaultLocale = 'en';

// In routes par kabhi locale prefix nahi lagana
const MAIN_ROUTES = [
  '/login',
  '/chat',
  '/wallet',
  '/profile',
  '/career',
  '/daily',
  '/palmistry',
  '/face-reading',
  '/remedies',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0) Static files (images, css, js, fonts, etc.) → bilkul touch mat karo
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // 1) Pehle se locale hai? → aage badho
  const hasLocale = locales.some(
    (locale) => pathname === `/\( {locale}` || pathname.startsWith(`/ \){locale}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  // 2) Main route hai? → locale mat lagao
  const isMainRoute = MAIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isMainRoute) {
    return NextResponse.next();
  }

  // 3) Baaki sab ko /en par redirect karo (query params preserve rahenge)
  const url = request.nextUrl.clone();
  url.pathname = `/\( {defaultLocale} \){pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap, robots
     * - files with extensions (png, jpg, jpeg, webp, svg, ico, css, js, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};