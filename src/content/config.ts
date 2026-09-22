import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
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
        z.object({ image: z.string() })
      ])
    ).optional(),
    tags: z.array(z.string()).default([]),
    origin: z.enum(['campus120', 'cheval-blanc', 'personal', 'other']).optional(),
  }),
});

export const collections = {
  projects,
};
