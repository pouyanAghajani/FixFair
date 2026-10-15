import { z } from "zod";

export const parseQueryResultSchema = z.object({
  service: z.string().nullable(),
  carBrand: z.string().nullable(),
  carModel: z.string().nullable(),
  city: z.string().nullable(),
  intent: z.enum(["cheapest", "nearest", "best_rated", "best_value"]),
  confidence: z.number().min(0).max(1),
});

export type ParseQueryResult = z.infer<typeof parseQueryResultSchema>;

export const normalizeOfferResultSchema = z.object({
  service: z.string().nullable(),
  carModel: z.string().nullable(),
  priceMin: z.number().nullable(),
  priceMax: z.number().nullable(),
  currency: z.literal("IRR"),
  includesPaint: z.boolean(),
  notes: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

export type NormalizeOfferResult = z.infer<typeof normalizeOfferResultSchema>;

export const explainResultSchema = z.object({
  shopId: z.string(),
  summary: z.string(),
  reasons: z.array(z.string()),
  warnings: z.array(z.string()),
});

export type ExplainResult = z.infer<typeof explainResultSchema>;
