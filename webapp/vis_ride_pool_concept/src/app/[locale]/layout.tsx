// Local imports
// > Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
// > Middleware
import {getDirection} from '../../services/intl';
// Type imports
import type {FC} from 'react';
import type {DefaultPropsI18nRoot} from '@/types/react';

//import {info} from './info';

// Include global styles
import '@styles/globals.css';

// Include roboto font (https://mui.com/material-ui/getting-started/installation/#roboto-font)
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const RootLayout: FC<DefaultPropsI18nRoot> = ({params, children}) => {
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
};

export default RootLayout;
