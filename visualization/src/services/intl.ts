// Package imports
import {createIntl} from 'react-intl';
// Type imports
import type {Locale} from '../../i18n-config';

export async function getIntl(locale: Locale) {
  // TODO: Throw 404 if the user is requesting an unsupported locale/route
  return createIntl({
    locale: locale,
    messages: (await import(`../lang/${locale}.json`)).default,
  });
}

export function getDirection(locale: Locale) {
  switch (locale) {
    case 'ar':
      return 'rtl';
    case 'en':
    case 'fr':
    case 'nl-NL':
      return 'ltr';
  }
}
