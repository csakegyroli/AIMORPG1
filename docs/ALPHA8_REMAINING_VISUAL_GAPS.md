# Alpha.10 — remaining visual gaps (continued from alpha.9)

This list is source-grounded. It distinguishes missing unique art from existing fallback assets, and it does not claim browser-rendered verification.

## Alpha.10 continuation — current status

- The existing panoramic capital hero now overlays a live character-state panel with player avatar/name/level, health fraction, gold, diamonds and tracked main quest, all bound to existing game state. The quest action navigates to the current quest view and does not trigger travel.
- The existing Windows QA script now requires HTTP/Next.js evidence when checking whether the development server is ready. PowerShell runtime validation remains NOT RUN because the environment does not contain Windows PowerShell or `pwsh`.
- The ten unique item-art gaps and the eight NPCs without explicit `NPC_PORTRAIT_ART` map entries listed below remain to be semantically reviewed; no new item art was created in alpha.10. Legacy `avatarSrc` paths are not equivalent to explicit, semantically verified portrait mappings.
- The new alpha.10 player/avatar and capital image usages are recorded as SOURCE_WIRED in the manifest; live render status is deliberately NOT RUN because the actual Next.js app remains blocked by missing dependencies and npm DNS error.



## Alpha.9 continuation — local QA package and main gameplay hero

- Added `scripts/windows-local-qa.ps1` and `docs/WINDOWS_LOCAL_QA_GUIDE.md`. The script checks the frontend root, Node/npm, lockfile/version alignment, dependency presence, registry reachability (one probe), and optionally runs the declared tests/lint/build or starts the actual dev server. Dependency installation is opt-in via `-InstallDependencies`; it does not auto-install or delete files.
- Added a panoramic main-map hero using the pre-existing `/assets/world/capital-dawn.webp`. Its status rows bind to the real current region, world time, and live NPC presence count. The two buttons open the actual current-region detail view and existing quest view; they do not call `game.travel`.
- Source wiring is asserted by `visual-ui-smoke.cjs`, but live rendering remains NOT RUN until the Next.js dependencies can be installed and the app started. The local PowerShell script itself also remains NOT RUN here because neither Windows PowerShell nor `pwsh` is installed in this environment.

## Item IDs still lacking unique ID-based artwork

These ten catalog IDs do not currently have an explicit `ITEM_ART` entry or an explicit item-family artwork entry. They currently resolve through slot or category fallback, which remains usable but is not unique item art:

- `brokenSealRing` — Törött pecsétgyűrű
- `canalKnife` — Csatornaőrök keskeny kése
- `caravanCompass` — Karavániránytű
- `championRibbon` — Bajnoki szalag
- `duelistCape` — Párbajhős köpönyege
- `firstWitnessLens` — Az Első Tanú lencséje
- `quietBell` — Néma harang
- `sailorsKnife` — Tengerészkés
- `stormKnot` — Viharkötél csomója
- `stormglassBow` — Vihartükör íj

The existing archived source boards reviewed in alpha.8 did not contain a sufficiently unambiguous, unused isolated illustration for each of these objects. Do not assign an unrelated image merely to increase the count; continue searching the complete preserved archive and create new art only for true gaps.

## NPCs without explicit `NPC_PORTRAIT_ART` entries

The following eight NPCs still use their existing `avatarSrc`/legacy portrait path instead of an explicit entry in `NPC_PORTRAIT_ART`:

- `miri` — `/assets/npc-miri.webp`
- `rovan` — `/assets/npc-rovan.webp`
- `damar` — `/assets/npc-damar.webp`
- `ilren` — `/assets/npc-ilren.webp`
- `garran` — `/assets/npc-borin.webp` (the NPC UI also has the existing `npc-borin-clean.webp` special handling)
- `eldra` — `/assets/npc-eldra.webp`
- `serin` — `/assets/npc-serin.webp`
- `velka` — `/assets/npc-velka.webp`

These are not currently missing all imagery: an existing image path is present. They still need semantic review and confirmation that the portrait corresponds to the right NPC. Do not treat the explicit map count of 61 as evidence that only these eight portraits require checking.

## Regions and districts

The current source contains seven region mappings and 28 district mappings, all with file paths checked by the asset smoke test. Full live-app rendering and per-location semantic confirmation remain **NOT RUN** because the Next.js dependency install is blocked. Keep their manifest `render_status`/`visual_status` unverified until the real app is tested.

## UI/runtime QA still required

- Start the actual Next.js app after a successful lockfile-based dependency install.
- Check the capital map, every accessible region and district, item artwork in inventory/equipment/shops/rewards, NPC portrait contexts, quest/dialogue screens, market and The Eye.
- Verify map selection is separate from the authoritative travel action and that the world clock continues to use the existing game-time model.
- Capture real desktop and mobile browser screenshots. The alpha.8 item crop contact sheet is an asset-review aid, not an in-app screenshot.

## Environment blocker

`npm ci --no-audit --no-fund` did not complete because requests to `registry.npmjs.org` failed with `EAI_AGAIN`. In a network-enabled Node.js 22+ shell at the project root, run:

```bash
npm ci --no-audit --no-fund
npm run lint
npm run build
npm run dev
```

Do not change dependency versions or the lockfile to mask the DNS/network failure.
