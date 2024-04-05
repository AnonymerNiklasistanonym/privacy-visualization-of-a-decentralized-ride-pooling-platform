import {Metadata} from 'next';
import {getIntl} from '../../services/intl';

type RouteProps = {
  params: {locale: string};
  searchParams: {[key: string]: string | string[] | undefined};
};

export const generateMetadata = async (
  props: RouteProps
): Promise<Metadata> => {
  const intl = await getIntl(props.params.locale);

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
