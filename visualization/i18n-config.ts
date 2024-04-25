export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ar', 'de'],
};

export type I18nConfig = typeof i18n;
export type Locale = I18nConfig['locales'][number];
