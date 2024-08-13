'use server';

// Local imports
import {getIntl} from '@services/intl';
// > Logging
import {createLoggerSection} from '@services/logging';
// > Globals
import {confidentialityVisualizer, getacar} from '@globals/defaults/urls';
// > Styles
import styles from '@styles/page.about.module.css';
// Type imports
import type {Metadata} from 'next/types';
import type {ReactPropsI18nHome} from '@misc/react';

const logger = createLoggerSection('About');

interface AboutProps {
  params: {locale: string};
}

export default async function About({params: {locale}}: AboutProps) {
  logger.debug(`GET /about locale='${locale}'`);
  const intl = await getIntl(locale);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          {intl.formatMessage({id: 'page.about.title'})}
        </h1>
        <p>
          {intl.formatMessage(
            {id: 'page.about.content'},
            {
              CONFIDENTIALITY_VISUALIZER: (
                <a href={confidentialityVisualizer}>
                  {intl.formatMessage({id: 'confidentialityVisualizer.name'})}
                </a>
              ),
              GETACAR: (
                <a href={getacar}>{intl.formatMessage({id: 'getacar.name'})}</a>
              ),
            }
          )}
        </p>
      </main>
    </div>
  );
}

/**
 * Generate Website Metadata dynamically (title, etc.)
 */
export async function generateMetadata({
  params: {locale},
}: ReactPropsI18nHome): Promise<Metadata> {
  logger.debug(`generateMetadata / locale='${locale}'`);
  // Server translations
  const intl = await getIntl(locale);
  // return an object
  return {
    description: intl.formatMessage({id: 'page.about.description'}),
    icons: [
      {
        sizes: 'any',
        type: 'image/svg+xml',
        url: '/icons/main.svg',
      },
      {
        sizes: 'any',
        type: 'image/x-icon',
        url: '/icons/main.ico',
      },
    ],
    title: intl.formatMessage({id: 'page.about.title'}),
  };
}
