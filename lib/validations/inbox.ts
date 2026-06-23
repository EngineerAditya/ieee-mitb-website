import { z } from "zod";
import { optionalText } from "./common";

/** Public contact form submission. */
export const contactMessageInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  email: z.email("A valid email is required").max(160),
  subject: optionalText(200),
  message: z.string().trim().min(1, "Message is required").max(5000),
});
export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>;

/** Public newsletter signup. */
export const newsletterInputSchema = z.object({
  email: z.email("A valid email is required").max(160),
});
export type NewsletterInput = z.infer<typeof newsletterInputSchema>;

export const messageStatusSchema = z.enum(["new", "read", "archived"]);
