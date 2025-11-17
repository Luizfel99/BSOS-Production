import { describe, it, expect } from "vitest";
import { ProfileUpdateSchema } from "@/lib/validation/profile";

describe("ProfileUpdateSchema", () => {
  it("accepts valid payload", () => {
    const parsed = ProfileUpdateSchema.safeParse({ name: "John Doe", locale: "en" });
    expect(parsed.success).toBe(true);
  });

  it("rejects empty name", () => {
    const parsed = ProfileUpdateSchema.safeParse({ name: "" });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid locale", () => {
    // @ts-expect-error - Testing invalid input
    const parsed = ProfileUpdateSchema.safeParse({ name: "Ok", locale: "fr" });
    expect(parsed.success).toBe(false);
  });

  it("accepts name without locale", () => {
    const parsed = ProfileUpdateSchema.safeParse({ name: "Valid Name" });
    expect(parsed.success).toBe(true);
  });
});
