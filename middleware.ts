// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'hi', 'hinglish', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'ml'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // अगर भाषा नहीं है, तो डिफ़ॉल्ट रूप से /en जोड़ें
  if (pathnameIsMissingLocale) {
    // लेकिन इन मुख्य पेजों (main group) को रीडायरेक्ट न करें
    const isMainPage = ['/login', '/chat', '/wallet', '/profile', '/career', '/daily'].some(
      (path) => pathname.startsWith(path)
    );

    if (!isMainPage && pathname !== '/') {
      return NextResponse.redirect(
        new URL(`/en${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url)
      );
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};