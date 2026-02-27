interface SpotifyTokenResponse {
  access_token: string;
}

interface SpotifyTrack {
  added_at: string;
  track: {
    id: string;
    name: string;
    external_urls: { spotify: string };
    artists: { name: string }[];
    album: {
      images: { url: string; width: number; height: number }[];
    };
  };
}

interface SpotifyTracksResponse {
  items: SpotifyTrack[];
  next: string | null;
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed: ${response.status}`);
  }

  const data = await response.json() as SpotifyTokenResponse;
  return data.access_token;
}

export interface SpotifyLikedTrack {
  id: string;
  title: string;
  url: string;
  savedAt: Date;
  description: string | null;
  thumbnailUrl: string | null;
  meta: Record<string, unknown>;
}

export async function fetchSpotifyLikedTracks(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<SpotifyLikedTrack[]> {
  const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

  const tracks: SpotifyLikedTrack[] = [];
  let url: string | null = 'https://api.spotify.com/v1/me/tracks?limit=50';

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Spotify tracks fetch failed: ${response.status}`);
    }

    const data = await response.json() as SpotifyTracksResponse;

    for (const item of data.items) {
      const { track } = item;
      const artists = track.artists.map((a) => a.name).join(', ');
      const thumbnail = track.album.images[0]?.url ?? null;

      tracks.push({
        id: `spotify-${track.id}`,
        title: track.name,
        url: track.external_urls.spotify,
        savedAt: new Date(item.added_at),
        description: artists || null,
        thumbnailUrl: thumbnail,
        meta: { artists: track.artists.map((a) => a.name) },
      });
    }

    url = data.next;
  }

  return tracks;
}
