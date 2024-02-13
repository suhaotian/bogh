import { NextRequest, NextResponse } from 'next/server';

import {
  AvailableLanguageTag,
  availableLanguageTags,
  sourceLanguageTag,
} from './src/paraglide/runtime';

/**
 * Sets the request headers to resolve the language tag in RSC.
 *
 * https://nextjs.org/docs/pages/building-your-application/routing/middleware#setting-headers
 */
export function middleware(request: NextRequest) {
  //Get's the first segment of the URL path
  const maybeLocale = request.nextUrl.pathname.split('/')[1];

  //If it's not a valid language tag, redirect to the source language
  if (!availableLanguageTags.includes(maybeLocale as any)) {
    const redirectUrl = `/${sourceLanguageTag}${request.nextUrl.pathname}`;
    request.nextUrl.pathname = redirectUrl;
    return NextResponse.redirect(request.nextUrl);
  }

  //it _IS_ a valid language tag, so set the language tag header
  const locale = maybeLocale as AvailableLanguageTag;

  const headers = new Headers(request.headers);
  headers.set('x-language-tag', locale);

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
