# AIMORPG v2.0.0-alpha.3 — Total Visual Overhaul / Living Fantasy World

## Release scope
A presentation-layer overhaul based on the accessible `AIMORPG-v2.0.0-alpha.2-Capital-Map-Expansion.zip` source package. This is a visual iteration, not a replacement of the gameplay codebase.

## Implemented
- Made the map-led `regions` surface the first view when the game client mounts; the existing Overview remains available from the existing navigation.
- Added a unified visual token layer for dark stone/ink surfaces, worn bronze, parchment text, region accents, focus and hover states.
- Restyled the global shell, top status rail, left navigation, side character panel, headings, buttons, notification surfaces and modal frames.
- Expanded the capital map into a high-priority visual surface with more legible named regions, active-location emphasis, quest-target state, and a responsive region list. Existing region access and travel actions remain the source of gameplay behavior.
- Overhauled the visual hierarchy of the Overview, Character, Inventory/Equipment, Quest Log, NPC Directory/dialogue-related panels, Market, Messages, Chronicle and The Eye panels via shared styles.
- Added an adaptive, horizontally scrollable mobile bottom navigation using the existing navigation controls (no duplicate route system).
- Added reduced-motion handling and clearer keyboard-focus states.
- Extracted 15 artwork crops from the provided multi-panel AIMORPG concept board and connected them to live UI backgrounds/presentation surfaces where appropriate. The original concept art files are retained under `docs/artwork-sources/original-concepts/` and are never overwritten.
- Added `scripts/visual-assets-smoke.cjs` and included it in `npm test`.

## Architecture and gameplay preservation
- `src/lib/store.ts`, game rules, content catalogs, region gate logic, NPC schedule logic and `game.travel` are unchanged.
- `src/lib/clientApi.ts`, `server/src/ai/ai.service.ts`, AI DTO/controller, auth, Prisma schema and migrations are unchanged.
- The existing Eye AI path remains a server-side request to `/api/ai/eye` using the configured server environment; no API key was added to the client and no provider/model setting was changed.
- No database migration or schema change was made.
- The map remains a selection/navigation surface; opening a place does not itself call the travel mutation. Travel still requires the existing explicit in-world travel button.

## Changed files
- `src/components/GameClient.tsx` — default view and visible release identifier only.
- `src/app/globals.css` — shared `alpha.3` visual overhaul layer.
- `package.json`, `package-lock.json` — version and visual asset test script.
- `scripts/visual-assets-smoke.cjs` — checks static asset paths, required crops, and retained original concept boards.
- `public/assets/world/*.webp` — 15 derived crops from supplied concept board.
- `docs/artwork-sources/original-concepts/*.png` — nine preserved original concept boards.
- `docs/VISUAL-INTEGRATION-REGISTER-v2.0.0-alpha.3.md` — status register and mapping.

## Tests
- `npm test`: PASS — includes `smoke-test.cjs`, `security-smoke.cjs` and `visual-assets-smoke.cjs`. Content smoke validated 187 items, 18 sets, 69 NPCs, 60 quests, 28 districts and 34 asset references; security smoke PASS; visual asset smoke validated 15 crops and 9 original boards.
- `npm run lint`: BLOCKED — TypeScript cannot find incomplete local type package contents (`chai`, `deep-eql`, `estree`, `node`, `react`, `react-dom`).
- `npm run build`: BLOCKED — `next: not found`; `npm ci` could not complete because npm registry requests failed with `EAI_AGAIN`.
- Browser rendering/screenshots: NOT RUN because the Next.js runtime could not be installed.
- Server/API/AI runtime, auth/session, and database persistence: NOT RUN; no configured project runtime or credentials are part of this archive. The server and AI source files were not modified.

## Known limitations
- The release is based on the accessible alpha.2 ZIP, not the owner's unuploaded local working directory. Unuploaded local edits are not represented.
- Visual changes are broad and shared across the first-priority screens, but not every one of the eleven surfaces has been individually browser-QA-verified. Follow-up visual QA is still required.
- The nine concept boards are preserved as originals. The first crop pass uses panels from `AIMORPG-Fekete-Erme-koncepciotabla.png`; the other eight boards remain available as retained art references and still need a panel-by-panel mapping review.
- No claim is made that live AI service availability or production server connectivity was tested; those require the actual configured environment and credentials.
