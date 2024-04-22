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
import type {ReactNode} from 'react';

export default async function Home({params: {locale}}: ReactPropsI18nHome) {
  // Server translations
  const intl = await getIntl(locale);
  // Client translations
  const messages = JSON.parse(
    JSON.stringify(intl.messages)
  ) as ReactI18nMessages;

  return (
    <>
      <SearchAppBar />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            {intl.formatMessage(
              {id: 'page.home.title'},
              // Replace b chunks with actual JSX element
              {b: (chunks: ReactNode[]) => <strong>{chunks}</strong>}
            )}
          </h1>

          <p className={styles.description}>
            {intl.formatMessage({id: 'page.home.description'})}
          </p>

          <TabPanel locale={locale} messages={messages} />

          <SpeedDialTooltipOpen />
        </main>
      </div>
    </>
  );
}
