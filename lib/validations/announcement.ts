import { z } from "zod";
import {
  contentStatusSchema,
  optionalDate,
  optionalText,
  optionalUrl,
  optionalUuid,
} from "./common";

/** Create/update payload for an announcement / achievement. */
export const announcementInputSchema = z.object({
  kind: z.enum(["announcement", "achievement"]).default("announcement"),
  title: z.string().trim().min(1, "Title is required").max(240),
  body: optionalText(10000),
  imageUrl: optionalUrl,
  societyId: optionalUuid,
  status: contentStatusSchema.default("draft"),
  publishedAt: optionalDate,
});

export type AnnouncementInput = z.infer<typeof announcementInputSchema>;
