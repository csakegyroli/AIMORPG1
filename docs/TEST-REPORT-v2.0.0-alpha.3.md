# AIMORPG v2.0.0-alpha.3 — Test Report

Environment: Node.js `v22.16.0`, npm `10.9.2`. Source was extracted from the available alpha.2 release ZIP.

| Check | Result | Evidence / limitation |
|---|---|---|
| `npm test` | **PASS** | Runs three no-dependency scripts. Content smoke: 187 items, 18 sets, 69 NPCs, 60 quests, 28 districts, 34 asset references. Password-hashing smoke PASS. Visual asset smoke PASS: 15 crops and 9 preserved concept boards. |
| TypeScript/TSX syntax transpilation | **PASS — syntax only** | Global TypeScript transpiled 40 `.ts`/`.tsx` files with no syntax diagnostics. This is not a full typecheck. |
| CSS parse | **PASS** | Global PostCSS parser successfully parsed `src/app/globals.css`. |
| `npm run lint` | **BLOCKED** | Local type package folders are incomplete. `tsc --noEmit` reports missing type definitions for `chai`, `deep-eql`, `estree`, `node`, `react`, and `react-dom`. |
| `npm run build` | **BLOCKED** | `next: not found`. `npm ci` could not complete because package registry requests returned `EAI_AGAIN` in the environment. |
| Browser runtime and actual screenshots | **NOT RUN** | Next.js could not be started without dependencies. No actual UI screenshot is claimed. The crop contact sheet is artwork evidence only, not an application screenshot. |
| Live backend / AI / authentication / save round trip | **NOT RUN** | Requires the configured local environment, database and server credentials. Code comparison confirms `server/`, `src/lib/`, `src/lib/clientApi.ts`, `server/src/ai/ai.service.ts`, auth, schema and migrations are unchanged from alpha.2. |

## Notes

The successful smoke tests verify static source contracts and asset presence; they do not prove rendering or live service availability. Run `npm ci`, `npm test`, `npm run lint`, `npm run build`, then the live API/AI/save tests in the owner-configured environment before treating this as runtime-verified.
