import {Metadata} from 'next';
import {getIntl} from '../../services/intl';
import {FC} from 'react';

// TODO: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

interface GenerateMetadata {
  locale: string;
}

export const generateMetadata: FC<GenerateMetadata> = async ({
  locale,
}): Promise<Metadata> => {
  const intl = await getIntl(locale);

  return {
    title: intl.formatMessage({id: 'page.home.head.title'}),
    description: intl.formatMessage({
      id: 'page.home.head.meta.description',
    }),
    alternates: {
      canonical: 'https://example.com',
      languages: {
        ar: 'http://example.com/ar',
        en: 'http://example.com',
        fr: 'http://example.com/fr',
        'nl-NL': 'http://example.com/nl-NL',
        'x-default': 'http://example.com',
      },
    },
  };
};
