import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

describe("GET /version", () => {
  it("returns the version from package.json", async () => {
    const res = await app.request("/version");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ version: pkg.version });
  });

  it("rejects other methods with a JSON 404", async () => {
    const res = await app.request("/version", { method: "POST" });

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });
});
