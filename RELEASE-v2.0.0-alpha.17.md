# AIMORPG v2.0.0-alpha.17 — Item Art Integration Checkpoint

## Release summary

- 187 runtime catalog items remain intact.
- Unique item-ID art mappings: 73 → **74**; semantic family fallbacks: 24 → **23**; the 90 generated equipment slot fallbacks are unchanged.
- New unique item mapping: `sealedLedger` → `/assets/items/sealedLedger.webp` from Pack01 `concept01_item_11`.
- Two existing family fallbacks now use closer existing art: `heartyStew` → `sailorsStew`, `stormSalt` → `blackSalt`.
- All gameplay data and the ten alpha.13 highlight mappings remain unchanged.

## Validation

- `npm test`: PASS in the working copy; core/content, security, visual asset and visual UI smoke tests passed.
- `npm run lint`: BLOCKED/inconclusive because Next.js/React/type dependencies are absent; exit 2. See `docs/QA_EVIDENCE/alpha17-npm-lint.log`.
- `npm run build`: BLOCKED; `next: not found`, exit 127. See `docs/QA_EVIDENCE/alpha17-npm-build.log`.
- Live browser desktop/mobile QA: NOT RUN.
- Original alpha.12–alpha.16 checkpoint ZIPs and Pack01–03 ZIPs are unchanged; their hashes and ZIP integrity tests are in `docs/ALPHA17_SOURCE_ARCHIVE_PRESERVATION_HU.json`.

## Remaining work

The 187-item audit records 4 `NEEDS_NEW_ART` items (`arenaWhetstone`, `merchantInk`, `memoryMoss`, `silverEyeShard`), 3 `NEEDS_REVIEW` candidates (`arenaProtein`, `saltFish`, `captainsLogPage`), and preserves 90 intentional slot fallbacks. Twenty priority-sorted backlog items define the next engineering and art tasks. Thirteen active NPC portrait rows remain under review; no uncertain portrait mapping was changed in alpha.17.

Read `docs/ALPHA17_CHANGELOG_HU.md`, `docs/ALPHA17_ITEM_ART_AUDIT_HU.md`, `docs/ALPHA17_CONCEPT_REVIEW_HU.md`, `docs/ALPHA17_NPC_PORTRAIT_REVIEW_AND_ART_HANDOFF_HU.md`, `docs/ALPHA17_DEVELOPMENT_BACKLOG_HU.md`, and `docs/ALPHA17_CONTINUATION_STATE_HU.md` for details.
