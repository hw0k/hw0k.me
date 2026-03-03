import type { Loader } from 'astro/loaders';
import { z } from 'astro:content';
import { fetchSpotifyLikedTracks } from './spotify';
import { fetchGitHubStarredRepos } from './github';
import { fetchRaindropBookmarks } from './raindrop';

export const telescopeSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  source: z.enum(['spotify', 'github', 'raindrop']),
  savedAt: z.coerce.date(),
  description: z.string().nullish(),
  thumbnailUrl: z.string().nullish(),
  meta: z.record(z.unknown()).optional(),
});

const MAX_ITEMS_PER_SOURCE = 100;

function limitItems<T extends { savedAt: Date }>(items: T[]): T[] {
  // 이미 최신순 정렬된 상태 - 100개 초과 시 오래된 것(뒤쪽)부터 제거
  return items.slice(0, MAX_ITEMS_PER_SOURCE);
}

export function telescopeLoader(): Loader {
  return {
    name: 'telescope-loader',
    schema: telescopeSchema,
    async load({ store, logger }) {
      store.clear();

      const since = new Date();
      since.setMonth(since.getMonth() - 1);

      const results = await Promise.allSettled([
        (async () => {
          const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
          const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
          const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;
          if (!clientId || !clientSecret || !refreshToken) {
            logger.warn('Spotify env vars missing, skipping');
            return [];
          }
          return fetchSpotifyLikedTracks(clientId, clientSecret, refreshToken, since);
        })(),
        (async () => {
          const token = import.meta.env.GH_TOKEN;
          if (!token) {
            logger.warn('GH_TOKEN missing, skipping');
            return [];
          }
          return fetchGitHubStarredRepos(token, since);
        })(),
        (async () => {
          const token = import.meta.env.RAINDROP_TOKEN;
          if (!token) {
            logger.warn('RAINDROP_TOKEN missing, skipping');
            return [];
          }
          return fetchRaindropBookmarks(token, since);
        })(),
      ]);

      const [spotifyResult, githubResult, raindropResult] = results;

      if (spotifyResult.status === 'rejected') {
        logger.error(`Spotify fetch failed: ${spotifyResult.reason}`);
      }
      if (githubResult.status === 'rejected') {
        logger.error(`GitHub fetch failed: ${githubResult.reason}`);
      }
      if (raindropResult.status === 'rejected') {
        logger.error(`Raindrop fetch failed: ${raindropResult.reason}`);
      }

      const spotifyItems = limitItems(spotifyResult.status === 'fulfilled' ? spotifyResult.value : []);
      const githubItems = limitItems(githubResult.status === 'fulfilled' ? githubResult.value : []);
      const raindropItems = limitItems(raindropResult.status === 'fulfilled' ? raindropResult.value : []);

      for (const item of spotifyItems) {
        store.set({
          id: item.id,
          data: {
            title: item.title,
            url: item.url,
            source: 'spotify' as const,
            savedAt: item.savedAt,
            description: item.description,
            thumbnailUrl: item.thumbnailUrl,
            meta: item.meta,
          },
        });
      }

      for (const item of githubItems) {
        store.set({
          id: item.id,
          data: {
            title: item.title,
            url: item.url,
            source: 'github' as const,
            savedAt: item.savedAt,
            description: item.description,
            thumbnailUrl: item.thumbnailUrl,
            meta: item.meta,
          },
        });
      }

      for (const item of raindropItems) {
        store.set({
          id: item.id,
          data: {
            title: item.title,
            url: item.url,
            source: 'raindrop' as const,
            savedAt: item.savedAt,
            description: item.description,
            thumbnailUrl: item.thumbnailUrl,
            meta: item.meta,
          },
        });
      }

      logger.info(
        `Telescope: loaded ${spotifyItems.length} Spotify, ${githubItems.length} GitHub, ${raindropItems.length} Raindrop items`,
      );
    },
  };
}
