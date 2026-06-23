import { z } from "zod";
import {
  contentStatusSchema,
  optionalDate,
  optionalText,
  optionalUrl,
  optionalUuid,
  slugSchema,
} from "./common";

/** Create/update payload for an article. */
export const articleInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(240),
  slug: slugSchema.optional(),
  societyId: optionalUuid,
  author: optionalText(160),
  publication: optionalText(200),
  publicationDate: optionalDate,
  externalUrl: optionalUrl,
  imageUrl: optionalUrl,
  excerpt: optionalText(2000),
  body: optionalText(50000),
  status: contentStatusSchema.default("draft"),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
