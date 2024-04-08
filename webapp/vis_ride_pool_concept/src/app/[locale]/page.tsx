import {getIntl} from '../../services/intl';
import styles from '@styles/page.module.css';

import OldMap from '@components/OldMap/OldMap';
// Type imports
import type {FC} from 'react';
import type {DefaultPropsI18nRoot} from '@/types/react';

const Home: FC<DefaultPropsI18nRoot> = async ({params: {locale}}) => {
  const intl = await getIntl(locale);

  const serverValue = 'serverValue';

  return (
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

        <OldMap test={serverValue} />
      </main>
    </div>
  );
};

export default Home;
