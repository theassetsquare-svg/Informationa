import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hh.nolcool.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
});
