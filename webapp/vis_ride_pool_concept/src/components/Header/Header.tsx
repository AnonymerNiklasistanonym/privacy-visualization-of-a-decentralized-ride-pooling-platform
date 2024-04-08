import Link from 'next/link';
import {i18n} from '../../../i18n-config';
// Type imports
import type {FC} from 'react';

const Header: FC = () => {
  const {locales, defaultLocale} = i18n;

  return (
    <header>
      {
        // Create link list of supported languages
      }
      <div dir="ltr" className="languages">
        {[...locales].sort().map(locale => (
          <Link
            key={locale}
            href={locale === defaultLocale ? '/' : `/${locale}`}
          >
            {locale}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
