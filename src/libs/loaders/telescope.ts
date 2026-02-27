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

export function telescopeLoader(): Loader {
  return {
    name: 'telescope-loader',
    schema: telescopeSchema,
    async load({ store, logger }) {
      store.clear();

      const results = await Promise.allSettled([
        (async () => {
          const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
          const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
          const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;
          if (!clientId || !clientSecret || !refreshToken) {
            logger.warn('Spotify env vars missing, skipping');
            return [];
          }
          return fetchSpotifyLikedTracks(clientId, clientSecret, refreshToken);
        })(),
        (async () => {
          const token = import.meta.env.GITHUB_TOKEN;
          if (!token) {
            logger.warn('GITHUB_TOKEN missing, skipping');
            return [];
          }
          return fetchGitHubStarredRepos(token);
        })(),
        (async () => {
          const token = import.meta.env.RAINDROP_TOKEN;
          if (!token) {
            logger.warn('RAINDROP_TOKEN missing, skipping');
            return [];
          }
          return fetchRaindropBookmarks(token);
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

      const spotifyItems = spotifyResult.status === 'fulfilled' ? spotifyResult.value : [];
      const githubItems = githubResult.status === 'fulfilled' ? githubResult.value : [];
      const raindropItems = raindropResult.status === 'fulfilled' ? raindropResult.value : [];

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
