// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];
const defaultLocale = 'en';

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

  // Static files (png, jpg, jpeg, webp, svg, ico...) mat touch karo
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Locale already hai?
  const hasLocale = locales.some(
    (locale) => pathname === `/\( {locale}` || pathname.startsWith(`/ \){locale}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  // Main route hai?
  const isMainRoute = MAIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isMainRoute) {
    return NextResponse.next();
  }

  // Baaki ko /en pe bhejo
  const url = request.nextUrl.clone();
  url.pathname = `/\( {defaultLocale} \){pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
