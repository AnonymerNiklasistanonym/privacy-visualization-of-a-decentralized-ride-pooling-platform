// Local imports
import {getIntl} from '../../services/intl';
// > Components
import CollectionHomeError from '@components/Collections/CollectionHomeError';
import TranslationWrapper from '@components/TranslationWrapper';
// > Logging
import {createLoggerSection} from '@services/logging';
// Type imports
import type {ReactI18nMessages, ReactPropsI18nHome} from '@misc/react';
import type {Metadata} from 'next';

const logger = createLoggerSection('Home');

export default async function Home({params: {locale}}: ReactPropsI18nHome) {
  logger.debug(`GET / locale='${locale}'`);

  // Server Side translations
  const intl = await getIntl(locale);
  const messages = JSON.parse(
    JSON.stringify(intl.messages)
  ) as ReactI18nMessages;

  return (
    <TranslationWrapper locale={locale} messages={messages}>
      <CollectionHomeError />
    </TranslationWrapper>
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
    description: intl.formatMessage({id: 'page.home.description'}),
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
    title: intl.formatMessage({id: 'page.home.title'}),
  };
}
