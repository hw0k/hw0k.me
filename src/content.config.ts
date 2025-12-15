import { defineCollection, z, type ImageFunction, type SchemaContext } from "astro:content";
import { glob } from 'astro/loaders';

const markdownSchemaFields = ({ image }: { image: ImageFunction }) => ({
  title: z.string(),
  description: z.string().nullish(),
  publishedAt: z.date(),
  updatedAt: z.date().nullish(),
  tags: z.array(z.string()).default([]),
  thumbnail: image().nullish(),
  thumbnailAlt: z.string().nullish(),
});

const markdownSchema = (context: SchemaContext) => z.object(markdownSchemaFields(context));

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/contents/posts" }),
  schema: markdownSchema,
});

const shorts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/contents/shorts" }),
  schema: markdownSchema,
});

const customContents = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/contents/custom-contents" }),
  schema: markdownSchema,
});

export const collections = { posts, shorts, 'custom-contents': customContents };
