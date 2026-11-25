# Visual rebuild changelog — Stage 2 continuation through v2.0.0-alpha.10

- Bumped package and lockfile root version from `2.0.0-alpha.3` to `2.0.0-alpha.5` for the Stage 2 continuation checkpoint.
- Updated the smoke-test version expectation and README version marker to match.
- Fixed the visual asset smoke test's stale expectation: the preserved legacy world-art directory contains 19 files, not 15. Test output now reports 19.
- Added a test report documenting actual PASS/BLOCKED/NOT RUN results and the difference between code integration and browser-verified rendering.
- No intentional changes to AI/server/API/database/gameplay contracts or world canon.

## v2.0.0-alpha.8 — five additional unique item crops and portrait error handling
- Continued from the actual alpha.7 checkpoint in a separate worktree. The original alpha.7 archive and older checkpoints were not overwritten.
- Cropped five semantically selected illustrations from existing, preserved item boards: `rustedKey` (iron key), `navigatorChart` (navigation map), `sailorsStew` (stew bowl), `shipRepairKit` (repair tools), and `diplomaticToken` (heraldic medallion). New images are 512×512 WebP. Original boards remain unchanged.
- Recorded source SHA-256, exact crop rectangles, output asset paths, target IDs and intended use in `crop-receipts.json`; refreshed the corresponding canonical manifest rows and added `alpha8-new-item-art-contact.jpg` for source review.
- Increased unique stable-ID item art from 53 to 58. Reduced explicit item-family fallbacks from 33 to 29 and equipment-slot fallbacks from 101 to 100; the five unique assets were not counted as fallback images.
- Replaced additional raw NPC portrait `<img>` elements in three regional/district people lists and the NPC directory modal with the existing `SafeArtImage` component, and expanded source wiring tests for the modal.
- Updated the app version label, package and lockfile root versions, README, smoke-test expectations, visual UI assertions, manifest, crop receipts, test report and progress document to alpha.8.
- `npm test`: PASS. `npm run lint`: BLOCKED, TypeScript `TS2688` missing definitions. `npm run build`: BLOCKED, `next: not found`. `npm ci --ignore-scripts --no-audit --no-fund`: BLOCKED by npm registry DNS errors `EAI_AGAIN`; the install did not complete. Full live Next.js browser QA remains NOT RUN.
- No intentional changes to gameplay data, travel rules, world clock model, NPC schedule, AI/API, database schema, or save/persistence logic.

## v2.0.0-alpha.5 — item artwork fallback hardening
- Added explicit semantic category fallback art for equipment, consumables, materials, trade goods, upgrades, quest items, keys, luxury goods, contraband, documents, relics and currency.
- Extended `itemArtFor` / `itemArtKindFor` to accept the real item category, while preserving the precedence of unique ID art, item-specific family art and equipment-slot art.
- Wired `ItemArtwork` to pass `item.category` and added a visibly distinct category-fallback treatment and tooltip so generic category art is not represented as unique art.
- Extended the smoke suite to assert fallback resolution for unknown consumable/document examples and zero unresolved items in the current 187-item catalog.
- No item statistics, rarity, prices, gameplay rules, server code, AI integration, database schema, world-time model or travel behavior changed.


## v2.0.0-alpha.6 — map imagery and image-failure handling
- Wired each existing `REGION_ART` illustration into the corresponding interactive capital-map hotspot and region-list row, in addition to its existing region detail hero. All seven region image targets are covered by the new UI smoke test.
- Wired `ItemArtwork` into NPC forge/craft, dismantling, trader, alchemy, temporary infusion and food/inn workbench grids and their selected-item detail surfaces, replacing Unicode-only item icons with the existing ID-resolved artwork or visibly labelled fallback.
- Added responsive circular image crops, a distinct current-location ring, and subdued locked-region art treatment. Existing select/gate/travel logic was kept intact; selecting a hotspot does not auto-travel.
- Added `SafeArtImage` for NPC portrait surfaces and load-error handling in `ItemArtwork`, where a failed mapped image is visibly identified as `broken` and the item icon is shown instead of a broken image.
- Updated the visible application label to alpha.6, bumped package/lockfile versions, and added `scripts/visual-ui-smoke.cjs` to `npm test`.
- No new gameplay content or image files were generated in this checkpoint. Existing source art is reused; no changes to game rules, canonical data, server, database schema, or AI service were intended.
- Validation: `npm test` PASS. Dependency installation exceeded the tool execution window; lint/build remain blocked and actual browser render QA is not run.

- Reused the preserved contact-sheet source `a_dark_moody_high_detail_fantasy_item_icon_grid.png` to create 10 separately cropped WebP illustrations: `courtInvitation`, `blackCoin`, `royalTransitPass`, `rareAmber`, `blackSalt`, `guildWaxSet`, `echoThreadCloak`, `harborCoat`, `dockHook`, and `watchLantern`. The source is copied into `docs/artwork-sources/integration-sources/`; source SHA-256, row/column, semantic subject, and output path are recorded in `crop-receipts.json`. The original archive remains unchanged.
- Revised coverage to 53 unique ID-based item images, 33 explicitly mapped family fallback items, and 101 equipment-slot fallbacks (187 total item records, zero unresolved). The item manifest rows were promoted from family/slot fallback to unique mapping for those 10 IDs; `RENDERED`/`VISUALLY_VERIFIED` remain `NOT RUN` because browser QA is blocked.


## v2.0.0-alpha.9 — local Windows QA runner and immersive capital hero
- Added `scripts/windows-local-qa.ps1`, a non-destructive PowerShell QA runner with project-root detection, Node/npm and lockfile checks, a single npm registry probe, opt-in `npm ci`, declared test/lint/build execution, log capture, JSON summary, and optional dev-server startup/port check. It does not expose the full environment or mutate the lockfile.
- Added `docs/WINDOWS_LOCAL_QA_GUIDE.md` with Hungarian PowerShell usage, local install steps, log locations, status meanings and DNS-failure handling. Windows PowerShell execution could not be tested in the current Linux environment; it is explicitly NOT RUN.
- Added an immersive capital-panorama hero to the real map landing using the pre-existing `capital-dawn.webp`; live region, world-time and present-NPC data feed the display. Existing quest navigation and region detail actions are reused; selection does not trigger travel. Added responsive desktop/mobile styling.
- Promoted the existing `capital-dawn.webp` manifest row from AVAILABLE to source-integrated, while keeping render status SOURCE_WIRED and visual verification NOT RUN pending live Next.js QA.
- Updated package and lockfile root version, visible UI label, README and smoke-test expectation to alpha.9.
- `npm test`: PASS after the changes. `npm ping --fetch-retries=0 --fetch-timeout=8000`: BLOCKED by `EAI_AGAIN`; no repeat `npm ci` was attempted in the unchanged network environment. `npm run lint`: BLOCKED, exit 1 because Next.js/React and React JSX types are missing; `npm run build`: BLOCKED, exit 127 (`next: not found`). Live browser QA: NOT RUN; PowerShell runtime test: NOT RUN because no PowerShell executable is installed here.
- Initial checkpoint archive passed ZIP integrity and forbidden-file checks; its extracted working copy also passed the full `npm test` suite and version/required-file checks. The final archive is revalidated after this changelog update.
- No intentional changes to the game rules, NPC schedules, world-time model, region gates, authoritative travel call, server/API/database contracts, save system or active AI integrations.


## v2.0.0-alpha.10 — live character/resource/quest HUD and HTTP QA readiness
- Added a live player-state HUD to the existing capital panorama in `src/components/GameClient.tsx`. It displays the persisted player avatar/name/level, computed HP fraction, current gold and diamonds, and the tracked main quest. It is data-bound to the existing store and does not modify state. The quest shortcut opens the existing quest view; region selection and explicit travel logic remain separate.
- Added responsive CSS for the HUD in `src/app/globals.css`; reused the existing `capital-dawn.webp`, player avatar and Eye emblem. No new graphic files were created in this pass.
- Improved the local Windows QA runner's `-StartDevServer` readiness probe to require an HTTP response with recognizable Next.js evidence, instead of considering an open TCP port sufficient. Updated guide's process-tree stop command to `taskkill /PID <PID> /T /F`. The PowerShell script remains runtime-unverified on this system because PowerShell is unavailable.
- Updated manifest rows for the actual avatar, Eye emblem and capital panorama UI usages while keeping `render_status=SOURCE_WIRED` and `visual_status=NOT_RUN`; source assertions are not mislabeled as live rendering.
- Version is synchronized to alpha.10 in `package.json`, the lockfile root, app header, README and smoke tests; dependency graph package versions were not upgraded.
- `npm test`: PASS after the source/UI/QA script changes. `npm ping --fetch-retries=0 --fetch-timeout=8000`: BLOCKED by `EAI_AGAIN` resolving `registry.npmjs.org`; no repeated install was attempted. `npm run lint`: BLOCKED, latest execution exit 1 due missing Next.js/React modules and types (with cascading type errors). `npm run build`: BLOCKED, exit 127, `next: not found`. Live Next.js browser QA: NOT RUN.


## v2.0.0-alpha.11 — shared UI design continuation

- Bumped package, lockfile root, visible app version and smoke-test expectation to `2.0.0-alpha.11`.
- Added shared dark-fantasy bronze/gold visual tokens and consistent panel framing across existing overview, character/equipment, inventory, quest, NPC, market, map/place, Chronicle and Eye modules.
- Improved keyboard focus visibility, selected/hover states, responsive layouts and reduced-motion handling. Existing functionality and authoritative state wiring were preserved.
- Added smoke-test assertions for the cross-module design-system continuation and reduced-motion support.
- Environment evidence: `npm test` PASS; lint BLOCKED by absent installed dependencies; build BLOCKED because `next` is unavailable; npm registry check returned EAI_AGAIN; browser QA and PowerShell execution NOT RUN.


## v2.0.0-alpha.12 — data-driven UI module integration (2026-10-19)

- Updated `package.json`, `package-lock.json` root and visible game version to `2.0.0-alpha.12`.
- `GameClient.tsx`: added seven working quick-navigation cards to the capital map view, wired to existing `ViewId` destinations and real current-state labels; no gameplay, travel, world-time or save behavior was changed.
- `GameClient.tsx`: added an inventory status/capacity strip with an ARIA progressbar and equipped-slot count.
- `GameClient.tsx`: added main/side quest status cards, NPC directory live-state summaries and a live regional-market/offer summary.
- `globals.css`: added a shared alpha.12 visual layer for the new components with widescreen, tablet and mobile layouts; reduced-motion handling is included.
- `visual-ui-smoke.cjs`: covers live source bindings and responsive UI selectors.
- `visual-assets-smoke.cjs`: validates all authored NPC `avatarSrc` assets from the catalog records, alongside explicit portrait mapping checks.
- `smoke-test.cjs`: transpiles the edited UI TSX files to catch syntax issues independently of missing React/Next dependencies.
- `windows-local-qa.ps1`: avoids occupied ports, passes a selected free port to Next.js and does not stop unrelated processes.
- No new image assets were created in alpha.12; existing assets and ID mappings were preserved. Asset counts are unchanged.
- `npm test`: PASS. Lint/build: BLOCKED by unavailable Next.js/React dependencies and registry DNS `EAI_AGAIN`. Live Next.js/browser QA and Windows PowerShell runtime: NOT RUN.


## v2.0.0-alpha.13 — unique item-art integration (2026-10-19)
- Added dedicated art paths for `brokenSealRing`, `canalKnife`, `caravanCompass`, `championRibbon`, `duelistCape`, `firstWitnessLens`, `quietBell`, `sailorsKnife`, `stormKnot`, and `stormglassBow`.
- Kept source contact sheets and a deterministic authored SVG for `quietBell`; crop lineage and SHA-256 source hashes are recorded in `crop-receipts.json`.
- Increased unique stable-ID mapping count from 58 to 68; family fallbacks remain at 29 and equipment-slot fallbacks decrease from 100 to 90.
- Added source-level assertions for all ten alpha.13 receipts and aligned package, lockfile root, visible app version, README and smoke tests to alpha.13.
- Live UI/browser verification remains NOT RUN; lint/build status is reported in `docs/ALPHA13_ITEM_ART_INTEGRATION_REPORT.md`.
