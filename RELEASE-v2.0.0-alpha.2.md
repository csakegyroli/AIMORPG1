# AIMORPG v2.0.0-alpha.2 — Capital Map Expansion

## Included
- Reworked capital map page into a map-led command surface using the existing `capital-map-v3.webp` asset.
- Added named hotspot labels for the seven known regions, with visual states for current location, tracked story target, and locked destinations.
- Added a runtime-driven sidebar showing current location, world time, present NPC count, tracked story NPC, and region access list.
- Region selection still opens the existing location screen; travel is not automatic and remains a separate player action.
- Added responsive styling for desktop, tablet and narrow mobile layouts.
- Added `docs/VISUAL-INTEGRATION-REGISTER-v2.0.0-alpha.2.md`.

## Preserved boundaries
- Existing world/game logic and authoritative travel action retained; no schema or migration changes.
- AI remains off for this visual work. No keys or external AI calls added.
- Original art files not overwritten.

## Tests
- `node scripts/smoke-test.cjs`: PASS — 187 items, 18 sets, 69 NPCs, 60 quests, 28 districts, 33 asset references.
- `node scripts/security-smoke.cjs`: PASS — password-hashing runtime test.
- `npm run lint`: BLOCKED/FAIL — dependencies are incomplete in this environment; TypeScript reports missing type definitions (`chai`, `deep-eql`, `estree`, `node`, `react`, `react-dom`).
- `npm run build`: BLOCKED — `next: not found` after incomplete dependency installation.
- Browser visual check: NOT RUN — build/runtime unavailable in this environment.

## Known limitations
- This archive is based on the available `2.0.0-alpha.1` source ZIP, not the owner's local `D:\demo\uj` working tree. Unuploaded manual changes are not represented.
- The nine multi-panel concept boards were inventoried in the audit but are not bundled in the source ZIP; panel-level production integration remains pending until source image files are available in the project workspace.
- Full item/NPC art coverage and remaining region/district screens remain follow-up work.
