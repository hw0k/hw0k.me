import { defineCollection, z } from "astro:content";

const markdownSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  publishedAt: z.date(),
  tags: z.array(z.string()).default([]),
});

const posts = defineCollection({
  type: 'content',
  schema: markdownSchema,
});

const customContents = defineCollection({
  type: 'content',
  schema: markdownSchema,
})

export const collections = { posts, 'custom-contents': customContents };
