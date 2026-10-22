import { describe, expect, it, vi } from "vitest";
import { app } from "../src/app.js";

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

app.get("/__test/throw", () => {
  throw new Error("boom");
});

function withId(id: string) {
  return app.request("/health", { headers: { "X-Request-Id": id } });
}

describe("X-Request-Id on every response", () => {
  it("is set on a 200 response", async () => {
    const res = await app.request("/health");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
    expect(res.headers.get("X-Request-Id")).toMatch(UUID_V4);
  });

  it("is set on a 404 response", async () => {
    const res = await app.request("/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.headers.get("X-Request-Id")).toMatch(UUID_V4);
  });

  it("is set on a 500 response", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const res = await app.request("/__test/throw");

      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: "Internal server error" });
      expect(res.headers.get("X-Request-Id")).toMatch(UUID_V4);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("generated IDs", () => {
  it("differ between requests", async () => {
    const a = await app.request("/health");
    const b = await app.request("/health");

    expect(a.headers.get("X-Request-Id")).not.toBe(b.headers.get("X-Request-Id"));
  });
});

describe("reused IDs", () => {
  it.each(["abc-123_DEF=", "3f1c2b9e-8a4d-4c6e-9f0a-1b2c3d4e5f60", "a".repeat(255)])(
    "reuses a valid incoming ID %#",
    async (id) => {
      const res = await withId(id);

      expect(res.headers.get("X-Request-Id")).toBe(id);
    },
  );
});

describe("rejected IDs", () => {
  it.each(["a".repeat(256), "abc def", "abc;rm", "<script>", ""])(
    "replaces an invalid incoming ID %# with a UUID",
    async (id) => {
      const res = await withId(id);
      const header = res.headers.get("X-Request-Id");

      expect(header).toMatch(UUID_V4);
      expect(header).not.toBe(id);
    },
  );
});
