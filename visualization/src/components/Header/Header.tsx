'use client';

// Package imports
import Link from 'next/link';
import {usePathname} from 'next/navigation';
// Local imports
import {i18n} from '../../../i18n-config';

export default function Header() {
  const {locales, defaultLocale} = i18n;
  const currentPage = usePathname()
    .split('/')
    .filter(a => a.length > 0);
  if (currentPage.length > 0 && locales.some(a => currentPage[0].includes(a))) {
    currentPage.shift();
  }
  return (
    <header>
      <div dir="ltr" className="languages">
        {[...locales].sort().map(locale => (
          <Link
            key={locale}
            href={`${
              locale === defaultLocale ? '/' : `/${locale}/`
            }${currentPage.join('/')}`}
          >
            {locale}
          </Link>
        ))}
      </div>
    </header>
  );
}
