import { z } from "zod";

/**
 * Zod schema for profile update validation
 *
 * Why: Type-safe validation for user profile updates
 */
export const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  locale: z.enum(["en", "pt", "es"]).optional(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
