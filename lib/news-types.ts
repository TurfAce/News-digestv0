import { z } from "zod";
export const newsSchema = z.object({
  id: z.string().min(1).max(200),
  title: z.string().min(1).max(1000),
  summary: z.string().max(20000),
  publishedAt: z.string().datetime().nullable(),
  category: z.string().max(100),
  sourceName: z.string().max(200),
  url: z
    .string()
    .url()
    .refine((v) => /^https?:\/\//.test(v)),
  demo: z.boolean().optional(),
});
export type NewsItem = z.infer<typeof newsSchema>;
export const insightSchema = z
  .object({
    summary: z.string().min(1).max(1800),
    opinionPositive: z.string().max(1200),
    opinionCritical: z.string().max(1200),
    question: z.string().min(1).max(600),
    evidence: z.array(z.string().min(1).max(600)).max(3),
    insufficient: z.boolean(),
  })
  .strict();
export type Insight = z.infer<typeof insightSchema> & {
  generatedAt: string;
  model: string;
  basis: string;
};

export function validateInsight(value: unknown, summary: string) {
  const parsed = insightSchema.parse(value);
  if (
    !parsed.insufficient &&
    (!parsed.evidence.length ||
      parsed.evidence.some((e) => !summary.includes(e)))
  )
    throw new Error("INVALID_EVIDENCE");
  return parsed;
}
