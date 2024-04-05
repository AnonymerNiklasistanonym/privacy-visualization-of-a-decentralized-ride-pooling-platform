//import type {Metadata} from 'next';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {getDirection} from '../../services/intl';
//import {info} from './info';
import '@styles/globals.css';

type LayoutProps = {
  params: {locale: string};
  children: React.ReactNode;
};

export default function RootLayout({params, children}: LayoutProps) {
  const {locale} = params;

  const dir = getDirection(locale);

  return (
    <html lang={locale} dir={dir}>
      <body>
        <Header />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
