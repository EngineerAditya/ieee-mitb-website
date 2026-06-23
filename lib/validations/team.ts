import { z } from "zod";
import { optionalText, optionalUrl } from "./common";

/** Create/update payload for an organisation leadership member. */
export const teamMemberInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  position: z.string().trim().min(1, "Position is required").max(120),
  photoUrl: optionalUrl,
  email: optionalText(160),
  linkedin: optionalUrl,
  term: optionalText(20),
  // HTML checkbox: present ("on"/"true") = true, absent = false.
  isCurrent: z.preprocess(
    (v) => v === "on" || v === "true" || v === true,
    z.boolean(),
  ),
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export type TeamMemberInput = z.infer<typeof teamMemberInputSchema>;
