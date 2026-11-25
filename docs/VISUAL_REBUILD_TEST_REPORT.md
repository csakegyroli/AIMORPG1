# Visual rebuild test report — v2.0.0-alpha.10

Date: 2026-10-18. Worktree: alpha.9 checkpoint source extracted separately and modified as alpha.10.

## Current results

- **PASS — `npm test`:** core gameplay/content smoke, password-hashing runtime smoke, visual asset smoke and visual UI source-wiring smoke passed after alpha.10 modifications. The UI smoke includes the live player-state HUD, the existing panorama source, the quest shortcut, responsive CSS, safe image loading, seven region-art files, and preserved gate/travel wiring.
- **PASS — syntax checks for Node test scripts:** `node --check scripts/smoke-test.cjs` and `node --check scripts/visual-ui-smoke.cjs` returned successfully.
- **PASS — TypeScript/TSX syntax transpilation:** the modified `src/components/GameClient.tsx` transpiled without syntactic diagnostics using globally available TypeScript 5.8.3. This is syntax validation only, not a semantic type-check.
- **PASS — package/lock root alignment:** both root versions are `2.0.0-alpha.10`; dependencies and resolved package versions were not upgraded.
- **PASS — project asset/manifest source checks:** the tested catalog remains 187 items, 18 sets, 69 NPCs, 60 quests and 28 districts; mappings remain 58 unique ID-mapped item images, 29 explicit family fallbacks, 100 equipment-slot fallbacks, 61 explicit portrait map entries, 7 region mappings and 28 district mappings. These counts and source checks do not prove live browser rendering.
- **PASS — npm cache inspection:** no cached `next` or `react` package entries were available to install offline.
- **BLOCKED — npm registry probe:** `npm ping --fetch-retries=0 --fetch-timeout=8000` failed with `EAI_AGAIN` resolving `registry.npmjs.org`. A second install attempt was not launched under unchanged network conditions.
- **BLOCKED — `npm run lint`:** latest execution exit 1. Missing modules/types include `next`, `react`, `react/jsx-runtime`, React JSX types and Node globals/types; the output contains many cascading JSX/implicit-any errors. This is not treated as proof that all such cascaded messages are separate source defects.
- **BLOCKED — `npm run build`:** exit 127, exact error `sh: 1: next: not found`.
- **NOT RUN — live Next.js browser QA:** application startup is unavailable without the pinned dependencies; no screenshots of the live app are claimed.
- **NOT RUN — Windows PowerShell runtime validation:** neither `powershell` nor `pwsh` is installed. The PowerShell runner was updated and statically asserted by the Node smoke test but not executed in a PowerShell runtime.
- **NOT RUN — live AI, database, save/restore runtime tests:** no live model calls or database migrations were part of this UI-only change.

## Changes included in alpha.10

- Added a responsive player-state HUD to the existing panoramic capital-map hero: player avatar/name/level, actual current/max health, live gold/diamonds, and current tracked main quest. Values are read from the existing `GameState`; no demo values are hardcoded.
- The quest shortcut uses the existing `setView("quests")` navigation and does not mutate a quest. Region selection remains separate from the explicit `game.travel` action.
- Added dark bronze/gold HUD styling for desktop/tablet/mobile and reused the already present capital panorama and Eye emblem.
- Improved the local QA runner's dev-server readiness probe to require HTTP response plus recognizable Next.js evidence, not TCP port availability alone. Process-tree stop guidance now uses `taskkill /PID <PID> /T /F`.
- Updated the manifest rows for the reused player avatar, Eye emblem and capital panorama to source-wired status while keeping live render and visual QA status `NOT_RUN`.

## Important limitations

This remains a Stage 2 development checkpoint, not a release. The actual app has not started because `next` and `react` are not installed, the registry is inaccessible, and no Windows/PowerShell runtime is present. Source-level tests and asset existence do not establish live UI render correctness. On a network-enabled Node.js 22+ environment, run `npm ci --no-audit --no-fund`, then rerun `npm test`, `npm run lint`, `npm run build`, start the actual app and capture real browser screenshots at desktop and mobile sizes.

---

## Previous alpha.8 test report (historical)

# Visual rebuild test report — v2.0.0-alpha.8

Date: 2026-10-18. Working copy: exact alpha.7 checkpoint extracted to a separate alpha.8 worktree. The source alpha.7 ZIP and earlier checkpoints remain unchanged.

## Alpha.8 results

- **PASS — `npm test`**: content/economy smoke passed (187 items, 18 sets, 69 NPCs, 60 quests, 28 districts); password-hashing runtime test passed; visual asset smoke passed; visual UI smoke passed.
- **PASS — unique item art and fallbacks**: 58 unique ID-based item illustrations, 29 explicit item-family illustrations, 100 equipment-slot fallbacks, 0 current-catalog category fallbacks required and 0 unresolved item art records. The twelve-category generic fallback resolver remains covered by targeted tests for unknown-category examples.
- **PASS — lineage checks**: all five alpha.8 item crops match their preserved source file hashes, exact output paths and manifest links. The asset test validates 58 unique item files without byte-identical duplicates.
- **PASS — raster file integrity**: all `public/assets` raster images were opened and checked after alpha.8 edits; no corrupt/unreadable image was found.
- **BLOCKED — `npm ci --ignore-scripts --no-audit --no-fund`**: registry downloads failed with DNS error `EAI_AGAIN` (examples from npm log: `https://registry.npmjs.org/next/-/next-16.3.0.tgz` and several transitive tarballs). The install did not complete and no successful dependency installation is claimed. The lockfile was not otherwise rewritten.
- **BLOCKED — `npm run lint`**: exit code 2, `TS2688` missing type-definition packages `chai`, `deep-eql`, `estree`, `node`, `react` and `react-dom` in the incomplete dependency tree.
- **BLOCKED — `npm run build`**: exit code 127; `sh: 1: next: not found`.
- **BLOCKED — `npm run dev`**: exit code 127; `sh: 1: next: not found`, so the Next.js server could not start.
- **NOT RUN — live Next.js browser QA**: the actual Next.js application could not start without dependencies. No alpha.8 screenshots are represented as screenshots from the running app. Isolated source-board previews are not live-app QA.
- **NOT RUN — live database/session/save restore or AI/API calls**: no live model calls were made and no database migration was run.

## Alpha.8 implementation

- Added unique 512×512 WebP item art derived from the original preserved contact boards for `rustedKey`, `navigatorChart`, `sailorsStew`, `shipRepairKit` and `diplomaticToken`.
- Stored each crop’s source filename, source SHA-256, crop pixel rectangle, output path and target ID in `docs/artwork-sources/integration-sources/crop-receipts.json`.
- Updated the canonical `ITEM_ART` map and removed the superseded family fallback entries for `rustedKey`, `navigatorChart`, `sailorsStew` and `shipRepairKit`. The existing `diplomaticToken` slot fallback was replaced by its unique ID-based image. Family and slot fallback totals were recalculated separately.
- Changed the remaining direct NPC image elements in district/region people strips and the NPC directory modal to `SafeArtImage`, so those visible portraits share the actual image-load failure fallback.
- Updated alpha.8 version indicators, manifest rows, smoke assertions, changelog and progress document.
- No changes were intended to gameplay rules, world time, travel gates, AI/server integrations, database schema, persistence, NPC schedules or canon.

## Remaining blockers and next action

The dependency registry must be reachable for `npm ci` to complete. In a network-enabled Node.js 22+ environment, run:

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run lint
npm run build
npm run dev
```

Then open the real app in Chromium/Playwright and test the main map, each region/district, item surfaces, NPC lists/modal/dialogue, quest and marketplace views at desktop and mobile sizes. Capture screenshots from the live application and only then update relevant manifest statuses from `NOT RUN` to `RENDERED` / `VISUALLY_VERIFIED`. Do not infer live visual verification from source-level smoke tests.

---

## Historical test report — v2.0.0-alpha.7

Date: 2026-10-18. Worktree: alpha.6 checkpoint extracted into a separate alpha.7 development copy.

## Results

- **PASS — `npm test`**: content/economy smoke passed (187 items, 18 sets, 69 NPCs, 60 quests, 28 districts); password hashing runtime test passed; visual asset smoke passed; visual UI smoke passed. The UI smoke confirms seven mapped region-art files are wired to map hotspots, travel/gate wiring remains present, responsive art styling exists, and 336 manifest records are readable.
- **PASS — static asset checks included in smoke suite**: existing test validates 53 unique item ID mappings, 33 item-family fallback mappings, 101 equipment-slot fallback mappings, 61 explicit NPC portrait mappings, 28 district mappings, 9 preserved concept boards and 19 archived legacy world files. Counts are separate categories and do not prove semantic correctness of every image.
- **BLOCKED — `npm run lint`**: TypeScript cannot resolve `next`, `react`, `react/jsx-runtime`, React JSX types, and Node globals/types because the pinned dependencies are unavailable. This causes cascading JSX/implicit-any errors; these are not treated as independently confirmed source errors until dependencies are installed.
- **BLOCKED — `npm run build`**: exit 127, `sh: 1: next: not found`.
- **NOT RUN — live Next.js browser QA**: app cannot start without Next.js/React dependencies. The previous alpha.6 isolated HTML/CSS preview is not a live-app screenshot and is not promoted to a render/visual verification claim for alpha.7.
- **NOT RUN — live database/session/save restore/AI calls**: not required for this presentation-only change; no live model calls were made.

## Alpha.7 source changes

- `src/app/globals.css`: keyboard focus rings, existing panel and interactive-control visual hierarchy, hover feedback and reduced-motion handling. Presentation-only.
- `package.json`, `package-lock.json` root, `README.md`, `scripts/smoke-test.cjs`: version aligned to `2.0.0-alpha.7`.
- `VISUAL_REBUILD_PROGRESS.md`: continuation checkpoint updated.

## Art status

Retained from alpha.6: 53 unique item images, 33 item-family illustrations, 101 equipment-slot fallbacks, 61 explicit NPC portrait mappings, 7 region mappings and 28 district mappings. The ten alpha.6 crop receipts remain under `docs/artwork-sources/integration-sources/crop-receipts.json`. No new image assets were generated in alpha.7. Render status remains unverified for live application UI.

## Next step

Install dependencies from the unchanged lockfile in a network-enabled Node.js >=22 environment, then run lint/build and start the actual app for desktop/mobile browser QA. Audit remaining item/NPC imagery semantically; do not count fallback images as unique art.


## Alpha.11 test run — 2026-10-19

- **PASS** `node scripts/smoke-test.cjs` — 187 items; 58 unique item images, 29 explicit family illustrations, 100 equipment-slot fallbacks; 18 sets; 69 NPCs; 60 quests; 28 districts.
- **PASS** `node scripts/security-smoke.cjs` — password hashing runtime test.
- **PASS** `node scripts/visual-assets-smoke.cjs` — preserved art files, unique mappings and fallback categories.
- **PASS** `node scripts/visual-ui-smoke.cjs` — alpha.11 visible version, capital hero/live HUD, asset paths, travel/gate wiring, responsive styling, shared design-system marker and reduced-motion rule.
- **BLOCKED** `npm run lint` — TypeScript reports missing `next`, `react`, `react/jsx-runtime` and type declarations because dependencies are not installed; not treated as a source-code verdict.
- **BLOCKED** `npm run build` — exit 127, `next: not found`.
- **BLOCKED** registry check — `npm ping --fetch-retries=0 --fetch-timeout=8000` failed with `EAI_AGAIN` resolving `registry.npmjs.org`.
- **NOT RUN** browser QA/screenshots — actual Next.js app could not be started.
- **NOT RUN** PowerShell script on Windows — neither `powershell` nor `pwsh` exists in this environment.


## Alpha.12 actual execution results — 2026-10-19

Worktree: `v2.0.0-alpha.12`, created by extracting the verified alpha.11 checkpoint to an isolated work directory. The checkpoint archives were not overwritten.

### Actual test results

- **PASS — `npm test`** after the alpha.12 implementation and smoke assertion correction. Core gameplay/content test validated 187 items, 18 equipment sets, 69 NPCs, 60 quests and 28 districts. TypeScript's `transpileModule` syntax/transpile smoke passed for `GameClient.tsx`, `AccountPanel.tsx`, `src/app/page.tsx`, and `src/app/layout.tsx`; this is not a full semantic typecheck. Password hashing runtime test passed. Visual asset test passed: 19 world paintings, 58 unique item-ID art mappings, 29 item-family fallback mappings, 100 equipment-slot fallback mappings, 61 explicit NPC portrait mappings, 10 distinct authored `avatarSrc` paths and 69 NPC records; all checked source paths exist. Visual UI smoke passed and reports 336 manifest records.
- **BLOCKED — `npm run lint`**: exit code 1. Initial errors show missing `next`, `react`, and `react/jsx-runtime` modules/types plus JSX intrinsic element definitions. The many resulting JSX and implicit-any errors are cascading from absent dependencies; no complete semantic TypeScript result can be claimed.
- **BLOCKED — `npm run build`**: exit code 127; exact error `sh: 1: next: not found`.
- **BLOCKED — registry probe**: `npm ping --fetch-retries=0 --fetch-timeout=5000` failed with `EAI_AGAIN` resolving `registry.npmjs.org`. No repeat install was started under unchanged DNS failure. No usable `next` package was found in the local npm cache; no `node_modules` directory is installed in the frontend worktree.
- **NOT RUN — live Next.js/browser QA**: the actual application could not be started without its dependencies; no screenshots from the live alpha.12 app exist. `/usr/bin/chromium` is present, but that does not substitute for an installed/running application.
- **NOT RUN — PowerShell runtime**: neither `pwsh` nor `powershell` is installed here. The script was source-reviewed and tested by the UI smoke assertions, not executed on Windows.
- **PASS — CSS syntax parser**: `src/app/globals.css` parsed with the available `tinycss2` parser; 2,361 top-level rules, zero nested parse errors. This is syntax parsing, not a browser-render test.
- **PASS — evidence records**: `docs/QA_EVIDENCE/alpha12-npm-test.log` and `docs/QA_EVIDENCE/alpha12-environment-results.txt` preserve the actual smoke output and environment blockers.
- **PASS — final archive verification**: after creating the checkpoint, its ZIP structure/integrity is checked with `unzip -t`, the extracted version and required files are verified, and `npm test` is run against the extracted copy; the exact final status and SHA-256 are provided with the delivered archive.

### Alpha.12 implementation changes

- `src/components/GameClient.tsx`: added a data-driven quick-navigation command rail to the capital map view, with labels and status values from current game state; added inventory capacity/equipment summaries, quest status summary, NPC directory live-state summary and market listing/balance summary.
- `src/app/globals.css`: added coordinated bronze/gold visual styling and desktop/tablet/mobile layouts for these new UI areas.
- `scripts/visual-ui-smoke.cjs`: checks the new UI source bindings, responsive styling and the local QA script's selected-port handling.
- `scripts/visual-assets-smoke.cjs`: verifies directly authored NPC avatar source paths across the 69 authored NPC records.
- `scripts/smoke-test.cjs`: added TSX syntax/transpile smoke coverage for four UI entry files.
- `scripts/windows-local-qa.ps1`: avoids an occupied port, passes the selected free port to the Next.js dev command, and does not stop unrelated local processes.
- Package root and lockfile versions, visible UI label, README, progress and changelog are aligned to alpha.12.

### Remaining visual QA limitation

The new UI source paths and state bindings pass automated source-level tests, but no `RENDERED` or `VISUALLY_VERIFIED` claim is made for the actual app. The main capital view, inventory, quest view, NPC directory, market and other modules still need review in a running Next.js application at desktop and mobile sizes.


## Checkpoint packaging verification

The release candidate is built from this alpha.12 worktree into a separate `AIMORPG-v2.0.0-alpha.12-Stage2-Visual-Integration-Checkpoint.zip`, excluding regenerated output (`node_modules`, `.next`, `dist`, `coverage`, `.git`, `*.tsbuildinfo`) and secret environment files. The final handoff independently checks ZIP integrity, extracted required files, version/lockfile consistency and `npm test` on the extracted tree. The SHA-256 sidecar is stored beside the ZIP; the ZIP does not include its own final hash.
