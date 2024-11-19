import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('posts');
  return rss({
    title: 'hw0k.me',
    description: '남현욱 블로그',
    site: context.site!,
    items: posts.map(it => ({
      title: it.data.title,
      pubDate: it.data.publishedAt,
      description: it.data.description,
      link: `/posts/${it.slug}`,
    })),
    stylesheet: '/feed-style.xsl',
  });
};
