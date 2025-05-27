// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hw0k.me',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      lastmod: new Date(),
      // xslURL: '/sitemap.xsl',
    }),
  ],
  prefetch: {
    prefetchAll: false,
  },
  image: {
    domains: ['cdn.hw0k.me'],
  },
});
