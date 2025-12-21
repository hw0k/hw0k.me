// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://hw0k.me',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      lastmod: new Date(),
      // xslURL: '/sitemap.xsl',
    }),
  ],
  prefetch: {
    prefetchAll: false,
  },
  image: {
  },
});
