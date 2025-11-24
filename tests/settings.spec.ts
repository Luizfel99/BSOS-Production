import { describe, it, expect } from "vitest";
import { SettingsSchema, DEFAULT_SETTINGS } from "@/lib/validation/settings";

describe("SettingsSchema", () => {
  it("accepts partial payload", () => {
    const p = SettingsSchema.safeParse({
      darkMode: true,
      notifications: { push: true },
    });
    expect(p.success).toBe(true);
  });

  it("rejects invalid language", () => {
    // @ts-expect-error - Testing invalid input
    const p = SettingsSchema.safeParse({ language: "fr" });
    expect(p.success).toBe(false);
  });

  it("accepts valid language", () => {
    const p = SettingsSchema.safeParse({ language: "pt" });
    expect(p.success).toBe(true);
  });

  it("accepts empty object", () => {
    const p = SettingsSchema.safeParse({});
    expect(p.success).toBe(true);
  });

  it("defaults are sane", () => {
    expect(DEFAULT_SETTINGS.language).toBe("en");
    expect(DEFAULT_SETTINGS.darkMode).toBe(false);
    expect(Object.keys(DEFAULT_SETTINGS.notifications)).toContain("email");
    expect(DEFAULT_SETTINGS.notifications.email).toBe(true);
    expect(DEFAULT_SETTINGS.notifications.push).toBe(false);
  });
});
