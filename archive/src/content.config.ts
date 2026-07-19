import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const signal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/signal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    label: z.string().default('SIGNAL DISPATCH'),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    type: z.enum(['convening', 'lecture', 'workshop', 'gathering']).default('gathering'),
    rsvpUrl: z.string().optional(),
    memberOnly: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { signal, events };
