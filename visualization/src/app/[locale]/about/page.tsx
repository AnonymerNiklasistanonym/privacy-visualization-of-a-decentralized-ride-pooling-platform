'use server';

// Local imports

import {getIntl} from '@/services/intl';
import styles from '@styles/page.module.css';

type HomeProps = {
  params: {locale: string};
};

export default async function About({params: {locale}}: HomeProps) {
  const intl = await getIntl(locale);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {intl.formatMessage({id: 'page.about.title'})}
        </h1>
      </main>
    </div>
  );
}
