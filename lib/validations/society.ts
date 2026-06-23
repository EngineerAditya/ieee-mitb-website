import { z } from "zod";
import { optionalText, optionalUrl, slugSchema } from "./common";

/** Create/update payload for a society / affinity group. */
export const societyInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(1, "Name is required").max(160),
  shortName: optionalText(32),
  type: z.enum(["society", "affinity"]).default("society"),
  about: z.string().trim().max(5000).default(""),
  tagline: optionalText(240),
  logoUrl: optionalUrl,
  themeColor: z
    .union([z.string().regex(/^#([0-9a-fA-F]{3,8})$/), z.literal("")])
    .nullish()
    .transform((v) => (v ? v : null)),
  email: optionalText(160),
  instagram: optionalUrl,
  linkedin: optionalUrl,
  displayOrder: z.coerce.number().int().min(0).default(0),
});
export type SocietyInput = z.infer<typeof societyInputSchema>;

/** Create/update payload for a society member (student or faculty). */
export const societyMemberInputSchema = z.object({
  societyId: z.uuid(),
  memberType: z.enum(["student", "faculty"]),
  name: z.string().trim().min(1, "Name is required").max(160),
  roleTitle: optionalText(120),
  photoUrl: optionalUrl,
  email: optionalText(160),
  linkedin: optionalUrl,
  displayOrder: z.coerce.number().int().min(0).default(0),
});
export type SocietyMemberInput = z.infer<typeof societyMemberInputSchema>;
