export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de'],
};

export const i18nGetLanguageName = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'English';
    case 'de':
      return 'Deutsch';
    default:
      throw Error(`Unsupported locale '${locale}'!`);
  }
};

export type I18nConfig = typeof i18n;
export type Locale = I18nConfig['locales'][number];
