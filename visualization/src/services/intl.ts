// Package imports
import {createIntl} from 'react-intl';
// Local imports
import {i18n} from '../../i18n-config';
// Type imports
import type {Locale} from '../../i18n-config';

export async function getMessages(locale: Locale) {
  return (await import(`../lang/${locale}.json`)).default as Record<
    string,
    string
  >;
}

export async function getIntl(locale: Locale) {
  const {defaultLocale} = i18n;
  const messagesLocale = await getMessages(locale);
  const messagesDefaultLocale = await getMessages(defaultLocale);
  // Include default locale in development for less errors
  for (const [key, value] of Object.entries(messagesDefaultLocale)) {
    if (messagesLocale[key] === undefined) {
      console.warn(
        `The key '${key}' (${value}) was not found in messages of locale '${locale}'`
      );
    }
  }
  for (const [key, value] of Object.entries(messagesLocale)) {
    if (messagesDefaultLocale[key] === undefined) {
      console.warn(
        `The key '${key}' (${value}) does not exist in the default locale '${defaultLocale}'`
      );
    }
  }
  return createIntl({
    locale: locale,
    messages: {...messagesDefaultLocale, ...messagesLocale},
  });
}

export function getDirection(locale: Locale) {
  switch (locale) {
    // Use this path for languages that are being read right to left
    //case 'ar':
    //  return 'rtl';
    case 'de':
    case 'en':
    default:
      return 'ltr';
  }
}
