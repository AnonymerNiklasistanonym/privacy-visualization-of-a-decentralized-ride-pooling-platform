'use client';

// Local imports
// > Components
import TranslationWrapper from '@components/TranslationWrapper';
// Type imports
import type {PropsWithChildren} from 'react';
import type {ReactPropsI18n} from '@misc/react';

export default function SearchAppBarContainer({
  locale,
  messages,
  children,
}: PropsWithChildren<ReactPropsI18n>) {
  return (
    <TranslationWrapper locale={locale} messages={messages}>
      {children}
    </TranslationWrapper>
  );
}
