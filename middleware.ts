// middleware.ts  (project root — app/ ke bahar, package.json ke saath)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];
const defaultLocale = 'en';

// (main) group ke routes — inhe locale prefix kabhi nahi milega
const MAIN_ROUTES = ['/login', '/chat', '/wallet', '/profile', '/career', '/daily'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) URL me pehle se locale hai? → kuch mat karo
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  // 2) Main route hai? (exact ya /route/... — lekin /login-fake NAHI)
  const isMainRoute = MAIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isMainRoute) {
    return NextResponse.next();
  }

  // 3) Baaki sab ko /en par bhejo — query params (utm etc) bhi bache rahein
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};