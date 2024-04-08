import {MetadataRoute} from 'next';
import {info} from './info';

// Generate Web Manifest:
// mdn docs: https://developer.mozilla.org/en-US/docs/Web/Manifest
// next.js docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: info.projectName,
    short_name: info.projectNameShort,
    description: info.projectDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#07cf',
    icons: [
      {
        src: '/main.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/main.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
