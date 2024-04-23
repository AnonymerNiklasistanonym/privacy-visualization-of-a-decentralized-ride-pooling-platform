'use server';

// Local imports
import {getIntl} from '../../services/intl';
// > Components
import SpeedDialTooltipOpen from '@components/Sort/SpeedDial';
import SearchAppBar from '@components/SearchAppBar';
import TabPanel from '@components/TabPanel';
// > Styles
import styles from '@styles/page.module.css';
// Type imports
import type {ReactI18nMessages, ReactPropsI18nHome} from '@misc/react';

export default async function Home({params: {locale}}: ReactPropsI18nHome) {
  // Server translations
  const intl = await getIntl(locale);
  // Client translations
  const messages = JSON.parse(
    JSON.stringify(intl.messages)
  ) as ReactI18nMessages;

  return (
    <>
      <SearchAppBar locale={locale} messages={messages} />
      <div className={styles.container}>
        <main className={styles.main}>
          <TabPanel locale={locale} messages={messages} />
          <SpeedDialTooltipOpen />
        </main>
      </div>
    </>
  );
}
