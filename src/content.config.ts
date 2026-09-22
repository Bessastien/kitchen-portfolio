import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    description: z.string().optional(),
    descriptionEn: z.string().optional(),
    publishDate: z.coerce.date(),
    mainImage: z.union([z.string(), image()]),
    gallery: z.array(
      z.union([
        z.string(),
        z.object({ image: z.string() }),
      ]),
    ).optional(),
    tags: z.array(z.string()).default([]),
    origin: z.enum(["campus120", "cheval-blanc", "personal", "other"]).optional(),
  }),
});

export const collections = { projects };
