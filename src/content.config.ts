import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const poems = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/poems" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string().optional(),
    collection: z.string().optional(),
    chapter: z.string().optional(),
    order: z.number().optional(),
    mood: z.string().optional(),
    showInBook: z.boolean().default(false),
    published: z.boolean().default(true),
  }),
});

export const collections = {
  poems,
};