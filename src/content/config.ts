import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    mainImage: image(), // Helper for relative images
    gallery: z.array(z.object({
      image: image()
    })).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  projects,
};
