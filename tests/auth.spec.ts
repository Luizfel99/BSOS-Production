import { describe, it, expect } from "vitest";
import { readTokenFromHeaders, verifyJwt } from "@/lib/auth";
import jwt from "jsonwebtoken";

describe("auth helpers", () => {
  it("reads token from cookie", () => {
    const req = new Request("http://x", {
      headers: { cookie: "foo=1; auth_token=abc; bar=2" } as any,
    });
    expect(readTokenFromHeaders(req)).toBe("abc");
  });

  it("reads token from bearer", () => {
    const req = new Request("http://x", {
      headers: { authorization: "Bearer xyz" } as any,
    });
    expect(readTokenFromHeaders(req)).toBe("xyz");
  });

  it("prefers cookie over bearer", () => {
    const req = new Request("http://x", {
      headers: {
        cookie: "auth_token=cookie-token",
        authorization: "Bearer bearer-token",
      } as any,
    });
    expect(readTokenFromHeaders(req)).toBe("cookie-token");
  });

  it("verifies jwt", () => {
    process.env.JWT_SECRET = "testsecret";
    const token = jwt.sign(
      { id: "1", email: "a@a", role: "admin" },
      process.env.JWT_SECRET
    );
    const payload = verifyJwt(token);
    expect(payload.id).toBe("1");
    expect(payload.email).toBe("a@a");
    expect(payload.role).toBe("admin");
  });

  it("throws on missing JWT_SECRET", () => {
    delete process.env.JWT_SECRET;
    expect(() => verifyJwt("any-token")).toThrow("JWT_SECRET not set");
  });
});
