import { defineCollection, reference, z } from "astro:content";

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedAt: z.date(),
    tags: z.array(z.string()).default([]),
    relatedPosts: z.array(reference('posts')).default([]),
  }),
});

export const collections = { posts };
