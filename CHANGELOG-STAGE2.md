# Changelog — Stage 2 visual integration checkpoint

## Added / updated
- Added `src/lib/visualAssets.ts` stable-ID presentation registry for item artwork, NPC portraits, region art, and district art.
- Added extracted, separately named world and district images while preserving original concept boards and crop receipts.
- Wired ID-based item and NPC artwork through `ItemArtwork` and `npcAvatar`; region/district scenes use registry lookups.
- Preserved the clickable capital map and explicit travel confirmation; choosing a map target is not itself travel.
- Kept the shared `ServerTowerClock` tied to existing `getWorldTime`.
- Added canonical `docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv` and `VISUAL_REBUILD_PROGRESS.md`.

## Validation
- `node scripts/smoke-test.cjs`: PASS
- `node scripts/security-smoke.cjs`: PASS
- `node scripts/visual-assets-smoke.cjs`: PASS
- Frontend/backend build and lint: BLOCKED/NOT RUN due unavailable installed dependencies in the working environment.

## Explicit non-goals
No AI/server replacement, gameplay-rule rewrite, database/schema change, final release build, or final release ZIP in Stage 2.


## v2.0.0-alpha.13 — ten additional unique item-art mappings (2026-10-19)
- Continued from an isolated alpha.12 work copy; original alpha.12 and earlier archives remain unchanged.
- Added ten unique stable-ID `ITEM_ART` mappings and 512×512 WebP outputs. Sources and hashes are recorded in `crop-receipts.json` and the visual asset manifest.
- Expanded asset smoke coverage to validate alpha.13 source hashes, receipt uniqueness, target mappings, output existence and output metadata.
- Kept gameplay/rules/economy/quest/NPC/world-time/server/database/AI logic unchanged.
- Live browser/render verification remains NOT RUN pending dependency-complete application startup.
