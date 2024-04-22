import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: [
      {
        find: '@styles',
        replacement: resolve(__dirname, 'src', 'styles'),
      },
      {
        find: '@components',
        replacement: resolve(__dirname, 'src', 'components'),
      },
      {
        find: '@globals',
        replacement: resolve(__dirname, 'src', 'globals'),
      },
      {
        find: '@misc',
        replacement: resolve(__dirname, 'src', 'misc'),
      },
      {
        find: '@',
        replacement: resolve(__dirname, 'src', '@/'),
      },
    ],
  },
});
