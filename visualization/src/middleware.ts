// Middleware to fix locale routing

// Package imports
import Negotiator from 'negotiator';
import {NextResponse} from 'next/server';
import {i18n} from '../i18n-config';
import {match} from '@formatjs/intl-localematcher';
// Type imports
import type {I18nConfig} from '../i18n-config';
import type {NextRequest} from 'next/server';

function getLocale(request: NextRequest, i18nConfig: I18nConfig): string {
  const {locales, defaultLocale} = i18nConfig;

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({headers: negotiatorHeaders}).languages(
    locales
  );

  console.debug('request1', request.url, i18nConfig);

  return match(languages, locales, defaultLocale);
}

/**
 * Redirect web requests without a locale to the right route.
 *
 * @param request Current web request
 * @returns response Fixed response
 */
export function middleware(request: NextRequest) {
  let response;

  const {locales, defaultLocale} = i18n;
  const {basePath, pathname} = request.nextUrl;

  if (pathname.startsWith('/static/')) {
    return request;
  }

  // Get the locale of the supplied path (either undefined or a supported locale)
  const pathLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  console.debug('request2', {
    locale: pathLocale,
    url: request.url,
  });

  let nextLocale = defaultLocale;
  if (pathLocale) {
    // Redirect all requests with default locale to no locale URLs
    if (pathLocale === defaultLocale) {
      // > Remove the defaultLocale from the path
      let pathWithoutLocale = pathname.slice(`/${pathLocale}`.length) || '/';
      if (request.nextUrl.search) {
        pathWithoutLocale += request.nextUrl.search;
      }
      // Redirect user to path without defaultLocale
      const urlWithoutDefaultLocale = new URL(
        basePath + pathWithoutLocale,
        request.url
      );
      response = NextResponse.redirect(urlWithoutDefaultLocale);

      console.debug('request redirect to path without default locale', {
        requestUrl: request.nextUrl.href,
        responseUrl: urlWithoutDefaultLocale.href,
      });
    }

    nextLocale = pathLocale;
  } else {
    const isFirstVisit = !request.cookies.has('NEXT_LOCALE');

    const locale = isFirstVisit ? getLocale(request, i18n) : defaultLocale;

    let newPath = `/${locale}${pathname}`;
    if (request.nextUrl.search) newPath += request.nextUrl.search;

    const url = basePath + newPath;

    if (locale === defaultLocale) {
      response = NextResponse.rewrite(new URL(url, request.url).toString());
      console.debug(
        'request rewrite url',
        request.url,
        new URL(url, request.url)
      );
    } else {
      response = NextResponse.redirect(new URL(url, request.url).toString());
      console.debug(
        'request redirect url',
        request.url,
        new URL(url, request.url)
      );
    }
    nextLocale = locale;
    console.debug('request deduce nextLocale', nextLocale);
  }

  if (!response) {
    console.debug('request had no response, go next');
    response = NextResponse.next();
  }

  response.cookies.set('NEXT_LOCALE', nextLocale);
  return response;
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|img/|favicon.ico).*)',
};
