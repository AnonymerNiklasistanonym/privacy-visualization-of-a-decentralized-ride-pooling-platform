// Local imports
import {getIntl} from '../../services/intl';
// Type imports
import type {MetadataRoute} from 'next';
import type {ReactPropsI18nHome} from '@misc/react';

// Generate Web Manifest:
// mdn docs: https://developer.mozilla.org/en-US/docs/Web/Manifest
// next.js docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest

export default async function manifest({
  params: {locale},
}: ReactPropsI18nHome): Promise<MetadataRoute.Manifest> {
  // Server translations
  const intl = await getIntl(locale);
  return {
    background_color: '#fff',
    description: intl.formatMessage({id: 'project.description'}),
    display: 'standalone',
    icons: [
      {
        sizes: 'any',
        src: '/icons/main.svg',
        type: 'image/svg+xml',
      },
      {
        sizes: 'any',
        src: '/icons/main.ico',
        type: 'image/x-icon',
      },
    ],
    name: intl.formatMessage({id: 'project.name'}),
    short_name: intl.formatMessage({id: 'project.name.short'}),
    start_url: '/',
    theme_color: '#07cf',
  };
}
