import { z } from "zod";

/**
 * Zod schemas guard every boundary where external data enters the app
 * (speech providers, understanding providers, user input, backend rows).
 */

export const knowledgeTypeSchema = z.enum([
  "crop_practice",
  "pest_management",
  "seed_practice",
  "soil_practice",
  "irrigation_practice",
  "livestock_practice",
  "storage_practice",
  "seasonal_practice",
]);

export const safetyStatusSchema = z.enum(["not_assessed", "caution", "restricted"]);

export const outcomeSchema = z.enum(["positive", "neutral", "negative"]);

export const speechTranscriptionSchema = z.object({
  transcript: z.string().min(1),
  language: z.string().min(1),
  dialect: z.string().nullable(),
  durationSeconds: z.number().nonnegative(),
  provider: z.enum(["demo", "sarvam"]),
});

export const knowledgeStructureSchema = z.object({
  title: z.string().min(3),
  knowledgeType: knowledgeTypeSchema,
  crop: z.string().nullable(),
  animal: z.string().nullable(),
  problem: z.string().nullable(),
  practice: z.string().nullable(),
  method: z.string().nullable(),
  season: z.string().nullable(),
  region: z.string().min(1),
  context: z.string().nullable(),
  safetyStatus: safetyStatusSchema,
  provider: z.enum(["demo", "gemini"]),
});

export const createKnowledgeInputSchema = z.object({
  transcript: z.string().min(5, "A transcript is required."),
  originalLanguage: z.string().min(1),
  dialect: z.string().nullable(),
  structure: knowledgeStructureSchema,
  audioUrl: z.string().nullable(),
  contributorId: z.string().min(1),
  consentConfirmed: z
    .boolean()
    .refine((value) => value, "Consent confirmation is required before saving."),
});

export const outcomeReportInputSchema = z.object({
  knowledgeRecordId: z.string().min(1),
  outcome: outcomeSchema,
  notes: z.string().max(600).nullable().optional(),
  location: z.string().min(1, "A location helps other people read this report."),
  audioUrl: z.string().nullable().optional(),
});

export const searchFiltersSchema = z.object({
  crop: z.string().optional(),
  animal: z.string().optional(),
  region: z.string().optional(),
  practice: z.string().optional(),
  evidence: z
    .enum([
      "direct_support",
      "partial_support",
      "limited_evidence",
      "no_direct_evidence",
      "conflicting_evidence",
      "expert_reviewed",
      "community_only",
    ])
    .optional(),
  language: z.string().optional(),
});
