import { z } from "zod";

/**
 * Zod schema for user settings validation
 * 
 * Why: Type-safe validation for user preferences (dark mode, language, notifications)
 */
export const SettingsSchema = z.object({
  darkMode: z.boolean().optional(),
  language: z.enum(["en", "pt", "es"]).optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
    })
    .partial()
    .optional(),
});

export type SettingsInput = z.infer<typeof SettingsSchema>;

/**
 * Default settings applied when user has no preferences
 */
export const DEFAULT_SETTINGS: Required<SettingsInput> = {
  darkMode: false,
  language: "en",
  notifications: { email: true, push: false },
};
