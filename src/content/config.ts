import { defineCollection, z, type ImageFunction } from "astro:content";

const markdownSchema = ({ image }: { image: ImageFunction }) => z.object({
  title: z.string(),
  description: z.string().optional(),
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  tags: z.array(z.string()).default([]),
  thumbnail: image().optional(),
  thumbnailAlt: z.string().optional(),
});

const posts = defineCollection({
  type: 'content',
  schema: markdownSchema,
});

const customContents = defineCollection({
  type: 'content',
  schema: markdownSchema,
});

export const collections = { posts, 'custom-contents': customContents };
