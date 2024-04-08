import React from 'react';
import {IntlProvider} from 'react-intl';
// Type imports
import type {FC} from 'react';
import type {DefaultPropsI18n} from '@/types/reactProps';

const getMessages = async (locale: string) => {
  return await import(`../../lang/${locale}.json`);
};

const FooterContainer: FC<DefaultPropsI18n> = async ({locale, children}) => {
  const messages = await getMessages(locale);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <div className="footer">{children}</div>
    </IntlProvider>
  );
};

export default FooterContainer;
