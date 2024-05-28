'use server';

// > MUI roboto font (https://mui.com/material-ui/getting-started/installation/#roboto-font)
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Local imports
// > Components
import Footer from '../../components/Footer';
// > Middleware
import {getDirection, getIntl} from '../../services/intl';
// > Styles
import '@styles/globals.css';
// Type imports
import type {ReactI18nMessages, ReactPropsI18nHome} from '@misc/react';
import type {PropsWithChildren} from 'react';

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
        {children}
        <Footer locale={locale} messages={messages} />
      </body>
    </html>
  );
}
