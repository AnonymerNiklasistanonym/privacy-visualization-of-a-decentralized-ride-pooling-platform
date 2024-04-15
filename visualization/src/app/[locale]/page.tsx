import {getIntl} from '../../services/intl';
import styles from '@styles/page.module.css';

import OldMap from '@components/OldMap/OldMap';
// Type imports
import type {FC} from 'react';
import type {DefaultPropsI18nHome} from '@/types/reactProps';
import Navigation1 from '@components/Test/Navigation1';
import Navigation3 from '@components/Test/Navigation3';
import SpeedDialTooltipOpen from '@components/Test/SpeedDial';
import SearchAppBar from '@components/Test/SearchBar';

const Home: FC<DefaultPropsI18nHome> = async ({params: {locale}}) => {
  const intl = await getIntl(locale);

  return (
    <>
      <SearchAppBar />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            {
              // @ts-ignore
              intl.formatMessage(
                {id: 'page.home.title'},
                // Replace b chunks with actual JSX element
                {b: chunks => <b key="bold">{chunks}</b>}
              )
            }
          </h1>

          <p className={styles.description}>
            {intl.formatMessage({id: 'page.home.description'})}
          </p>

          <Navigation1 />

          <Navigation3 />

          <OldMap locale={locale} />

          <SpeedDialTooltipOpen />
        </main>
      </div>
    </>
  );
};

export default Home;
