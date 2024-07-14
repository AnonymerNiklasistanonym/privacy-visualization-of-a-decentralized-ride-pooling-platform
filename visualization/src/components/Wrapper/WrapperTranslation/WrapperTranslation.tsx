'use client';

// Package imports
import React from 'react';
// > Components
import {IntlProvider} from 'react-intl';
// Type imports
import type {PropsWithChildren} from 'react';
import type {ReactPropsI18n} from '@misc/react';

/**
 * All children inside this wrapper support using the intl client hook
 */
export default function WrapperTranslation({
  locale,
  messages,
  children,
}: PropsWithChildren<ReactPropsI18n>) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
