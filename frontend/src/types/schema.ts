import { z } from 'zod';

export const InsightSchema = z.object({
  type: z.enum(['umowa', 'faktura', 'oferta', 'raport', 'inne']),
  document: z.object({
    fileName: z.string(),
    pages: z.number().int().positive(),
    language: z.string(),
    title: z.string(),
    date: z.string().nullable(),
  }),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  entities: z.object({
    organizations: z.array(z.string()),
    people: z.array(z.string()),
  }),
  amounts: z.array(
    z.object({
      value: z.number(),
      currency: z.string(),
      context: z.string(),
    })
  ),
  dates: z.array(
    z.object({
      date: z.string(),
      context: z.string(),
    })
  ),
  keywords: z.array(z.string()),
});

export type InsightData = z.infer<typeof InsightSchema>;