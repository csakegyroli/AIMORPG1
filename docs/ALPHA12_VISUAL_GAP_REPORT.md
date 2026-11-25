# AIMORPG v2.0.0-alpha.12 — current visual gap report

Date: 2026-10-19. Source: isolated alpha.12 worktree derived from the verified alpha.11 ZIP. Counts below were read from the current repository/smoke suite; semantic correctness for all images has not been visually established.

## Current catalog and asset counts

| Area | Current measured state | What it means |
|---|---:|---|
| Item records | 187 | Current authored item catalog |
| Unique item-ID artwork | 58 | Dedicated stable-ID image mappings; not all have browser visual QA |
| Item-specific family fallback | 29 | Distinct from unique artwork |
| Equipment-slot fallback | 100 | Generic slot-family art; distinct from unique artwork |
| Catalogue category fallback use | 0 | Current resolution coverage does not require this fallback class for listed items |
| Category fallback art options | 12 | Available fallback options, not 12 unique item images |
| NPC records | 69 | Current NPC data records |
| Explicit NPC portrait mappings | 61 | Stable-ID portrait map entries |
| Direct avatar source paths | 10 distinct paths | Authored `avatarSrc` paths; the eight NPCs without explicit portrait-map entries retain existing authored sources, while some other direct paths may overlap mapped NPCs |
| Region art mappings | 7 | Source mappings; live browser render is unverified |
| District art mappings | 28 | Source mappings; live browser render is unverified |
| Clean world paintings | 19 | Files validated by source-level asset tests |
| Manifest records | 336 | Data rows; not proof of live rendering |

The 187-item catalogue is currently partitioned across 58 unique ID images, 29 item-family images and 100 equipment-slot fallbacks. These categories must not be combined into a claim of 187 unique illustrations.

## Concrete remaining item-art gaps

The current manifest shows the following items still use an equipment-slot fallback rather than dedicated unique art. These mappings currently exist and their image files are present, but the mapping's `content_status` explicitly says `GENERIC_SLOT_ART_BY_DESIGN; NOT_UNIQUE_ITEM_ART`:

- `brokenSealRing` → `/assets/items/lurkerGloves.webp`
- `canalKnife` → `/assets/items/militiaBlade.webp`
- `caravanCompass` → `/assets/items/lurkerGloves.webp`
- `championRibbon` → `/assets/items/lurkerGloves.webp`
- `duelistCape` → `/assets/items/paddedArmor.webp`
- `firstWitnessLens` → `/assets/items/lurkerGloves.webp`
- `quietBell` → `/assets/items/lurkerGloves.webp`
- `sailorsKnife` → `/assets/items/militiaBlade.webp`
- `stormKnot` → `/assets/items/lurkerGloves.webp`
- `stormglassBow` → `/assets/items/militiaBlade.webp`

These 10 are concrete unique-art priorities. Do not count their fallbacks as dedicated art. Review the existing asset archives and crop sheets before generating anything new.

## NPC picture status and limits

The current smoke test checks all 69 NPC records, verifies 61 explicit portrait map entries, and checks that the directly-authored `avatarSrc` file paths exist and are non-empty. Eight named NPCs without explicit map entries—`miri`, `rovan`, `damar`, `ilren`, `garran`, `eldra`, `serin`, `velka`—retain authored `avatarSrc` paths. This is source/file validation only; the semantic correspondence of all 69 portraits has not been reviewed in a live UI.

## Alpha.12 UI areas changed

- `src/components/GameClient.tsx`: real capital-map quick command rail linking to existing views; inventory capacity and equipment summary; quest completion/active/open summary; NPC directory availability/presence/memory summary; market local-stock/listing and balance summary. The summaries consume existing game state and do not implement new gameplay systems.
- `src/app/globals.css`: coherent dark fantasy brass/bronze visual treatment and responsive layouts for the new modules.
- `scripts/visual-ui-smoke.cjs`: source assertions for the new UI areas and Windows QA port handling.
- `scripts/visual-assets-smoke.cjs`: avatar-source existence checks across the authored NPC records.
- `scripts/smoke-test.cjs`: TSX syntax/transpile smoke checks for four UI files.

## Runtime/test gaps

- **Registry: BLOCKED.** `npm ping --fetch-retries=0 --fetch-timeout=5000` failed with `EAI_AGAIN` for `registry.npmjs.org`. The same network condition was not retried with another install attempt.
- **Lint: BLOCKED.** The run fails initially because `next`, `react`, `react/jsx-runtime` and their type declarations are not installed. Cascading JSX/type errors prevent a semantic typecheck verdict.
- **Production build: BLOCKED.** `next: not found` (exit 127).
- **Live app and browser QA: NOT RUN.** No actual Next.js app screenshots were captured. Static source tests and asset checks do not prove correct live rendering or interaction.
- **PowerShell runtime: NOT RUN.** No `pwsh` or `powershell` executable is present in this environment; the local QA script has not been tested in a real Windows PowerShell session.

## Prioritized next steps

1. On a network-enabled Windows/Node.js 22+ machine, extract this checkpoint and run `npm ci --no-audit --no-fund`, then `npm test`, `npm run lint`, and `npm run build`. Do not delete or regenerate the lockfile.
2. Use `scripts/windows-local-qa.ps1` according to `docs/WINDOWS_LOCAL_QA_GUIDE.md`, then start the actual app and capture genuine browser screenshots at desktop, laptop and mobile widths.
3. Fix runtime/type/build errors revealed by the real dependency-complete run and rerun affected tests.
4. Review the ten fallback item mappings above against preserved art archives; create only semantically verified unique crops.
5. Review all NPC portraits visually against stable NPC identities and update manifest render statuses only after a live UI check.
6. Check the panorama, map/district selection, inventory, character sheet, quests, NPC profile/dialogue, market and Eye/Chronicle modules in the real app; document what actually renders.
