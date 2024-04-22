'use server';

// Style imports
import '@styles/globals.css';
// > MUI roboto font (https://mui.com/material-ui/getting-started/installation/#roboto-font)
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Local imports
// > Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// > Middleware
import {getDirection, getIntl} from '../../services/intl';
// Type imports
import type {PropsWithChildren} from 'react';
import type {ReactI18nMessages, ReactPropsI18nHome} from '@misc/react';

export default async function PageLayout({
  params: {locale},
  children,
}: PropsWithChildren<ReactPropsI18nHome>) {
  // Server translations
  const intl = await getIntl(locale);
  // Client translations
  const messages = JSON.parse(
    JSON.stringify(intl.messages)
  ) as ReactI18nMessages;

  const dir = getDirection(locale);
  return (
    <html lang={locale} dir={dir}>
      <body>
        <Header />
        {children}
        <Footer locale={locale} messages={messages} />
      </body>
    </html>
  );
}
