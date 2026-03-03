interface RaindropItem {
  _id: number;
  title: string;
  link: string;
  created: string;
  excerpt: string;
  cover: string;
  tags: string[];
}

interface RaindropResponse {
  result: boolean;
  items: RaindropItem[];
  count: number;
}

export interface RaindropBookmark {
  id: string;
  title: string;
  url: string;
  savedAt: Date;
  description: string | null;
  thumbnailUrl: string | null;
  meta: Record<string, unknown>;
}

export async function fetchRaindropBookmarks(token: string, since: Date): Promise<RaindropBookmark[]> {
  const bookmarks: RaindropBookmark[] = [];
  const raindropCollectionId = '67462921';
  let page = 0;

  while (true) {
    const response = await fetch(
      `https://api.raindrop.io/rest/v1/raindrops/${raindropCollectionId}?perpage=50&page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) {
      throw new Error(`Raindrop bookmarks fetch failed: ${response.status}`);
    }

    const data = await response.json() as RaindropResponse;

    if (!data.result || data.items.length === 0) break;

    let reachedCutoff = false;
    for (const item of data.items) {
      if (new Date(item.created) < since) {
        reachedCutoff = true;
        break;
      }
      bookmarks.push({
        id: `raindrop-${item._id}`,
        title: item.title,
        url: item.link,
        savedAt: new Date(item.created),
        description: item.excerpt || null,
        thumbnailUrl: item.cover || null,
        meta: { tags: item.tags },
      });
    }

    if (reachedCutoff || data.items.length < 50) break;
    page++;
  }

  return bookmarks;
}
