import { z } from "zod";
import {
  contentStatusSchema,
  optionalDate,
  optionalText,
  optionalUrl,
  optionalUuid,
  slugSchema,
} from "./common";

/** Create/update payload for an event (parsed from the admin form). */
export const eventInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(240),
  slug: slugSchema.optional(),
  societyId: optionalUuid,
  description: z.string().trim().max(20000).default(""),
  startAt: z.coerce.date(),
  endAt: optionalDate,
  venue: optionalText(240),
  imageUrl: optionalUrl,
  registrationUrl: optionalUrl,
  eventType: optionalText(60),
  status: contentStatusSchema.default("draft"),
});

export type EventInput = z.infer<typeof eventInputSchema>;
