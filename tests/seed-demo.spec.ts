import { describe, it, expect, vi, beforeEach } from "vitest";
import * as PrismaMod from "@/lib/prisma";
import { ensureDemoUsers } from "@/app/api/auth/seed-demo/route";

describe("ensureDemoUsers", () => {
  const fakeDb = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.spyOn(PrismaMod, "db", "get").mockReturnValue(fakeDb as any);
    fakeDb.user.findUnique.mockReset();
    fakeDb.user.create.mockReset();
    process.env.NEXT_PUBLIC_DEMO_PWD = "demo123";
  });

  it("creates missing users", async () => {
    // Mock: admin and manager exist, others don't
    fakeDb.user.findUnique.mockResolvedValueOnce(null); // admin - doesn't exist
    fakeDb.user.findUnique.mockResolvedValueOnce(null); // manager - doesn't exist
    fakeDb.user.findUnique.mockResolvedValueOnce({ id: "x" }); // supervisor - exists
    fakeDb.user.findUnique.mockResolvedValueOnce(null); // cleaner - doesn't exist
    fakeDb.user.findUnique.mockResolvedValueOnce(null); // client - doesn't exist

    const res = await ensureDemoUsers();

    // Should have attempted to create 4 users
    expect(res.filter((r) => r.created).length).toBe(4);
    expect(res.filter((r) => !r.created).length).toBe(1);
    expect(fakeDb.user.create).toHaveBeenCalledTimes(4);
  });

  it("skips existing users", async () => {
    // All users exist
    fakeDb.user.findUnique.mockResolvedValue({ id: "exists" });

    const res = await ensureDemoUsers();

    expect(res.filter((r) => r.created).length).toBe(0);
    expect(res.length).toBe(5); // all 5 demo users
    expect(fakeDb.user.create).not.toHaveBeenCalled();
  });
});
