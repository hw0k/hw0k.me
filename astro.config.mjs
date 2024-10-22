// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://hw0k.me',
  output: 'static',
  integrations: [tailwind()],
  prefetch: {
    prefetchAll: false,
  },
});
