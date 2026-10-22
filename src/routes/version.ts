import { readFileSync } from "node:fs";
import { Hono } from "hono";

// Resolves to the repo root from both src/routes/ and dist/routes/.
const packageJsonUrl = new URL("../../package.json", import.meta.url);

function readPackageVersion(): string {
  const pkg: unknown = JSON.parse(readFileSync(packageJsonUrl, "utf8"));
  if (
    typeof pkg !== "object" ||
    pkg === null ||
    !("version" in pkg) ||
    typeof pkg.version !== "string"
  ) {
    throw new Error("package.json has no string version field");
  }
  return pkg.version;
}

// Read once at startup so the endpoint reports the deployed version.
const packageVersion = readPackageVersion();

export const version = new Hono();

version.get("/", (c) => c.json({ appVersion: packageVersion }));
