import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request);
  
  if (supabaseResponse instanceof NextResponse) {
    const intlResponse = intlMiddleware(request);
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
  
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/(fi|en|sv)/:path*'
  ]
};
