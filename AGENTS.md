# Agent instructions

These rules apply to every AI agent working in this repository (implementer and reviewer alike) and to humans.

## Project

A Hono HTTP API on Node.js, written in strict TypeScript (ES modules).
- `src/app.ts` builds the Hono app and mounts routers. It must not start a server, so tests can import it.
- `src/index.ts` starts the Node server. Keep it tiny.
- `src/routes/<name>.ts` holds one `Hono` router per resource, mounted in `app.ts`.
- `tests/*.test.ts` are Vitest tests that call `app.request()`; no real network or ports.

## Commands

| Purpose   | Command             |
| --------- | ------------------- |
| Install   | `npm ci`            |
| Lint      | `npm run lint`      |
| Format    | `npm run format`    |
| Typecheck | `npm run typecheck` |
| Test      | `npm test`          |
| Build     | `npm run build`     |

All four checks (lint, typecheck, test, build) must pass before work is considered done. Lint is [Biome](https://biomejs.dev) (`biome check`: lint rules, formatting and import order); `npm run format` applies its safe fixes.

## Conventions

- Import local files with the `.js` extension (`./routes/health.js`), as NodeNext requires.
- Responses are JSON. Errors use `{ "error": "<message>" }` with a matching status code.
- Validate request input at the route boundary; never trust request bodies or params.
- Every new route or behavior gets a test covering the success path and at least one failure path.
- Prefer small, focused modules. No new runtime dependency without a clear reason stated in the PR.
- No `any`, no `@ts-ignore`, no disabled lint rules without an explaining comment.

## Constraints

- Never commit secrets, tokens or real credentials. Configuration comes from environment variables documented in `.env.example`.
- Never weaken, skip or delete tests to make a check pass.
- Do not change unrelated code, formatting or files.
- Do not edit `.github/`, `factory.yaml` or `.factory/` unless the task explicitly asks for it.

## Definition of done

1. The acceptance criteria in the issue are met.
2. Tests cover the change.
3. Lint, typecheck, test and build pass locally.
4. The change is summarized with any remaining risks or follow-ups.
