import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { normalizeRouteSegment } from '@/lib/route-translations';

const intlMiddleware = createMiddleware(routing);

function translateRoute(request: NextRequest): NextRequest | null {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null;
  }

  let localeIndex = 0;
  let locale = pathSegments[0];
  const isLocaleSegment = routing.locales.includes(locale as any);

  if (!isLocaleSegment) {
    locale = routing.defaultLocale;
    localeIndex = -1;
  }

  const routeSegmentIndex = isLocaleSegment ? 1 : 0;

  if (pathSegments.length <= routeSegmentIndex) {
    return null;
  }

  const routeSegment = pathSegments[routeSegmentIndex];
  const normalizedSegment = normalizeRouteSegment(routeSegment);

  if (normalizedSegment === routeSegment) {
    return null;
  }

  pathSegments[routeSegmentIndex] = normalizedSegment;
  url.pathname = '/' + pathSegments.join('/');

  return new NextRequest(url, request);
}

export async function middleware(request: NextRequest) {
  const translatedRequest = translateRoute(request);
  const requestToUse = translatedRequest || request;

  const supabaseResponse = await updateSession(requestToUse);

  if (supabaseResponse instanceof NextResponse) {
    const intlResponse = intlMiddleware(requestToUse);
    if (intlResponse instanceof NextResponse) {
      supabaseResponse.headers.forEach((value, key) => {
        intlResponse.headers.set(key, value);
      });
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return intlResponse;
    }
    return supabaseResponse;
  }

  return intlMiddleware(requestToUse);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/(fi|en|sv)/:path*'
  ]
};
