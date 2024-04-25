// eslint-disable-next-line node/no-unpublished-import
import {defineConfig} from 'vitest/config';
// eslint-disable-next-line node/no-unpublished-import
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      ...['styles', 'components', 'globals', 'misc', 'services'].map(a => ({
        find: `@${a}`,
        replacement: resolve(__dirname, 'src', a),
      })),
      {
        find: '@',
        replacement: resolve(__dirname, 'src', '@/'),
      },
    ],
  },
  test: {
    environment: 'jsdom',
  },
});
