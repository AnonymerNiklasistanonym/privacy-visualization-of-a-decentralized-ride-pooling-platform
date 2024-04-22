'use client';

import {FormattedMessage} from 'react-intl';
import FooterContainer from './FooterContainer';
// Type imports
import type {ReactPropsI18n} from '@misc/react';

export default function Footer({locale, messages}: ReactPropsI18n) {
  return (
    <FooterContainer locale={locale} messages={messages}>
      <FormattedMessage tagName="p" id="common.footer" />
    </FooterContainer>
  );
}
