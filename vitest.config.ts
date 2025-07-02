import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    alias: {
      '@src': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@test': resolve(__dirname, './test'),
    },
    root: './',
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@test': resolve(__dirname, './test'),
    },
  },
  plugins: [swc.vite()],
});
