import {getIntl} from '../../services/intl';
import styles from '@styles/page.module.css';

import Buttons from '@components/Buttons/Buttons';

import MapTestDynamic from '@components/Map/MapTestDynamic';

type HomeProps = {
  params: {locale: string};
};

export default async function Home({params: {locale}}: HomeProps) {
  const intl = await getIntl(locale);

  const serverValue = 'serverValue';

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {intl.formatMessage(
            {id: 'page.home.title'},
            // Replace b chunks with actual JSX element
            {b: chunks => <b key="bold">{chunks}</b>}
          )}
        </h1>

        <p className={styles.description}>
          {intl.formatMessage({id: 'page.home.description'})}
        </p>

        <Buttons test={serverValue} />

        <MapTestDynamic />
      </main>
    </div>
  );
}
