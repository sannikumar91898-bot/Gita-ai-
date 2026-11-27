
// middleware.ts
// Project root — app/ folder ke bahar, package.json ke saath

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = [
  'en',
  'hi',
  'hinglish',
  'te',
  'ta',
  'kn',
  'bn',
  'mr',
  'gu',
  'ml',
];

const defaultLocale = 'en';

// Main routes — inhe locale prefix kabhi nahi milega
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

  // 0) Static files ko locale redirect se exclude karo
  // Examples: jpg, jpeg, png, svg, webp, ico, js, css, txt, xml
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // 1) URL me pehle se locale hai? → kuch mat karo
  const hasLocale = locales.some(
    (locale) =>
      pathname === `/${locale}` ||
      pathname.startsWith(`/${locale}/`)
  );

  if (hasLocale) {
    return NextResponse.next();
  }

  // 2) Main route hai? → locale prefix mat lagao
  const isMainRoute = MAIN_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (isMainRoute) {
    return NextResponse.next();
  }

  // 3) Baaki routes ko /en par redirect karo
  // Query parameters bhi preserve rahenge
  const url = request.nextUrl.clone();

  url.pathname = `/${defaultLocale}${
    pathname === '/' ? '' : pathname
  }`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
