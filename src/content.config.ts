import { defineCollection, z, type ImageFunction } from "astro:content";
import { glob } from 'astro/loaders';

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
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/posts" }),
  schema: markdownSchema,
});

const customContents = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/custom-contents" }),
  schema: markdownSchema,
});

export const collections = { posts, 'custom-contents': customContents };
