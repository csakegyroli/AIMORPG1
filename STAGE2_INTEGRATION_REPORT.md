# Stage 2 integration report — v2.0.0-alpha.6 checkpoint

- Base source: Stage 1 verified project backup, v2.0.0-alpha.3. The original backup and original visual archive were left untouched.
- Working source: current Stage 2 integration copy; version bumped to `2.0.0-alpha.6` for this checkpoint.
- Catalog baseline smoke-test reports: 187 items, 18 equipment sets, 69 NPCs, 60 quests, and 28 district records.
- Stable ID registry: 43 item art mappings, 61 NPC portrait mappings, 7 region mappings, 28 district mappings.
- Clean world artwork: 19 files; original concept boards preserved: 9; legacy pre-integration world files archived: 19.
- The visual smoke test previously had a stale assertion expecting 15 archived legacy images. The actual preserved directory contains 19, matching the 19 documented source images. The assertion and summary were corrected to 19.

## Status distinctions
- `INTEGRATED` in the manifest means the code/data registry connects an asset to a real target surface; it does **not** mean the asset has been visually confirmed in a running browser.
- File-open checks confirm basic image integrity only, not semantic identity of every NPC/item illustration.
- This is a Stage 2 development checkpoint, not a final release candidate.

## Not verified
- Full frontend build and TypeScript lint: blocked by incomplete/unavailable installed dependencies. `next` is not present in `node_modules/.bin`; `tsc --noEmit` reports missing type definitions (`chai`, `deep-eql`, `estree`, `node`, `react`, `react-dom`).
- Dependency installation: attempted with `npm ci --ignore-scripts --no-audit --no-fund`, but the process did not complete within the available execution window and was stopped; no lockfile dependency versions were changed.
- Browser-rendered visual QA, desktop/mobile screenshots, live database/session/save restore, and live AI request were not run. Do not infer runtime success from source inspection or smoke tests.

## Alpha.5 continuation
The item artwork resolver now supports explicit category fallback illustrations in addition to unique ID art, item-specific family art and equipment-slot art. `ItemArtwork` passes the item's category, and fallback states remain visibly and textually labelled. The 187-item smoke check and targeted fallback assertions pass. Dependency restoration is still blocked by npm registry DNS errors, so lint/build/browser QA remain unverified; this remains a development checkpoint, not a release.


## Alpha.6 addendum
- The main capital-map hotspots and adjacent region-list entries now render the existing, matching `REGION_ART` images. Region details continue to use the existing region hero. This is source-level UI wiring; the manifest does not claim browser verification.
- NPC portrait rendering uses a resilient fallback component at the profile and dialogue presentation points. Item artwork now visibly degrades to a symbol placeholder and `data-art-kind="broken"` on image-load failure.
- NPC shop/forge/alchemy/food workbench grids now use the actual `ItemArtwork` resolver instead of symbol-only item icons; item manifest targets were expanded to reflect those source integrations.
- `npm test` passes, including the new visual UI smoke. Dependency restoration is still blocked in this environment; lint/build and live browser QA remain unverified.

- Alpha.6 follow-up: added 10 unique item-ID artwork files cropped from an existing archived art grid, updated their crop receipts and manifest rows, and adjusted smoke tests to check provenance. The current mapping counts are 53 unique ID-based item images, 33 explicit family fallbacks, and 101 equipment-slot fallbacks across 187 catalog items. Live browser render remains unverified.
