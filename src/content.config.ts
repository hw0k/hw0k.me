import { defineCollection, z, type ImageFunction, type SchemaContext } from "astro:content";
import { glob } from 'astro/loaders';

const markdownSchemaFields = ({ image }: { image: ImageFunction }) => ({
  title: z.string(),
  description: z.string().optional(),
  publishedAt: z.date(),
  updatedAt: z.date().optional(),
  tags: z.array(z.string()).default([]),
  thumbnail: image().optional(),
  thumbnailAlt: z.string().optional(),
});

const markdownSchema = (context: SchemaContext) => z.object(markdownSchemaFields(context));

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/contents/posts" }),
  schema: markdownSchema,
});

const customContents = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/contents/custom-contents" }),
  schema: markdownSchema,
});

export const collections = { posts, 'custom-contents': customContents };
