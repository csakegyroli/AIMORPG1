# AIMORPG v2.0 — Visual Integration Register (alpha.3)

**Source of truth for this release:** `AIMORPG-v2.0.0-alpha.2-Capital-Map-Expansion.zip`, version recorded in `package.json` and `package-lock.json` as `2.0.0-alpha.2` before release bump. This package is a continuation of alpha.2, not a reconstruction of an unavailable local working tree.

## Status meanings
- **FELTÁRKÉPEZVE** — file and intended surface identified.
- **INTEGRÁLÁSRA VÁR** — target documented but not wired into the game.
- **INTEGRÁCIÓ FOLYAMATBAN** — work started, needs follow-up.
- **INTEGRÁLVA** — referenced by a live UI surface or data-to-art mapping.
- **ELLENŐRIZVE** — actual functional and visual behavior checked in a running app.
- **BLOKKOLT** — specific dependency or missing access prevents verification.

## New crops from `AIMORPG-Fekete-Erme-koncepciotabla.png`
The original board is not used as a single background. Cropped derivatives live in `public/assets/world/`; the untouched original remains in `docs/artwork-sources/original-concepts/`.

| Derived asset | Planned/actual surface | Status | Notes |
|---|---|---|---|
| `capital-dawn.webp` | Overall capital mood, main Overview illustration, background texture | INTEGRÁLVA | Art crop; not a replacement for the clickable runtime map. |
| `market-evening.webp` | Commercial Center / market hero lighting and catalog ambience | INTEGRÁLVA | Art-only market crop. |
| `old-streets-night.webp` | Outskirts / inner-city mood background | INTEGRÁLVA | Art-only city street crop. |
| `tavern-interior.webp` | Future tavern/interior view | FELTÁRKÉPEZVE | Asset ready; not yet an interactive location-specific interior. |
| `royal-sanctuary.webp` | Palace/temple architectural atmosphere | INTEGRÁLVA | Used as the Palace overview hero atmosphere; district interiors continue to use their existing district art. |
| `equipment-stilllife.webp` | Inventory and equipment styling | INTEGRÁLVA | Used as a backdrop texture behind live inventory/equipment elements; not an item image source. |
| `crafting-forge.webp` | Crafting and dismantle screen | FELTÁRKÉPEZVE | Crop extracted; dedicated crafting-screen art wiring still pending. |
| `combat-arena.webp` | Arena and combat-related UI | INTEGRÁLVA | Used for arena mood; does not add or modify combat mechanics. |
| `dialogue-scene.webp` | Chronicle/story surfaces and dialogue art reference | INTEGRÁLVA | Background use; existing dialogue choices/state preserved. |
| `world-chart.webp` | Atlas/world-map visual reference | FELTÁRKÉPEZVE | Not used to replace the actual clickable `capital-map-v3.webp`. |
| `forest-exploration.webp` | Forest/exploration surfaces | FELTÁRKÉPEZVE | Extracted and ready; regional use needs targeted QA. |
| `alpine-frontier.webp` | Future frontier/region scene | FELTÁRKÉPEZVE | Reference image only until matching runtime location is verified. |
| `dungeon-depths.webp` | Dungeon/exploration content | FELTÁRKÉPEZVE | No new dungeon feature created. |
| `eye-observation.webp` | The Eye / Chronicle visual identity | INTEGRÁLVA | Decorative backdrop only; the existing AI request/validation path is untouched. |
| `character-codex.webp` | NPC directory visual framing | INTEGRÁLVA | Generic directory atmosphere only; never assigned as an individual NPC portrait. |

## Existing production assets and data mapping
| Source asset or family | Target | Status | Evidence/limitation |
|---|---|---|---|
| `capital-map-v3.webp` | Capital click-map | INTEGRÁLVA | Existing map component still uses the asset and actual `game.regionAccess`, `currentRegion`, tracked quest and lock state. Browser visual QA is not confirmed in this runtime. |
| `capital-map.webp`, `capital-map-v2.webp` | Alternate maps / art direction references | FELTÁRKÉPEZVE | Retained without overwriting; not arbitrarily swapped into the active map. |
| `city-panorama.webp`, `outskirts.webp`, `inner-city.webp`, `forest.webp`, `arena.webp`, `palace.webp`, `harbor.webp`, `market-center.webp`, `market-art-v3.webp` | Region and district environment art | INTEGRÁLVA | Existing region/district mappings retained; exact runtime crop/lighting still requires browser QA. |
| `avatar-vagabond.webp`, `avatar-ranger.webp` | Character selection/profile | INTEGRÁLVA | Existing avatar selection and profile binding retained. |
| `item-*.webp` | Items and equipment | INTEGRÁLVA — PARTIAL COVERAGE | Existing ID-to-art map only maps selected IDs. No guessed assignments added. Expand after auditing all `ItemDefinition.id`s against actual catalog. |
| `npc-*.webp`, `borin*.webp` | NPC portraits and dialogue | INTEGRÁLVA — PARTIAL COVERAGE | Existing `avatarSrc` and special Borin mapping retained. No generic concept character crop assigned to a named NPC. |
| `eye-emblem-v2.webp`, `eye-emblem.webp`, `eye.webp` | The Eye interface | INTEGRÁLVA | Existing emblem references and AI button retained. |

## Nine original concept boards
All nine originals have been copied unchanged to `docs/artwork-sources/original-concepts/`:

| Original board | Intended target | Status |
|---|---|---|
| `AIMORPG-Fekete-Erme-elofantasy.png` | Whole-game art direction / city | FELTÁRKÉPEZVE; panel-by-panel mapping pending |
| `AIMORPG-Fekete-Erme-koncepciotabla.png` | UI concepts; first crop source | INTEGRÁLVA — PARTIAL; 15 crops extracted |
| `Fekete-Erme-Elo-Fantaziavaros.png` | Capital and district scenes | FELTÁRKÉPEZVE; panel mapping pending |
| `AImorpg-Fekete-Erme-vilaga.png` | Whole world / game pitch | FELTÁRKÉPEZVE; panel mapping pending |
| `AIMORPG-Fekete-Erme-vilaga-1.png` | Characters/items/scenes | FELTÁRKÉPEZVE; panel mapping pending |
| `AIMORPG-Fekete-Erme-vilaga-2.png` | Characters/items/scenes | FELTÁRKÉPEZVE; panel mapping pending |
| `AIMORPG-Arenthal-elo-vilaga.png` | City and live-world atmosphere | FELTÁRKÉPEZVE; panel mapping pending |
| `AIMORPG-Arendel-elo-vilaga.png` | Alternate city/world compositions | FELTÁRKÉPEZVE; panel mapping pending |
| `AImorpg-tesztelesi-utmutato-es-latvanytervek.png` | QA/style references | FELTÁRKÉPEZVE; panel mapping pending |

## Functional boundaries retained
- AI endpoint/request: `src/components/GameClient.tsx` → `apiJson('/api/ai/eye')` → existing NestJS AI controller/service.
- Server-side AI key/config is kept out of the client; AI model calls are not made by these visual changes.
- Store logic, auth, `clientApi.ts`, backend controllers, DTOs, Prisma schema, migrations, content catalogs and game rules are unchanged.
- `game.travel` remains an explicit action from an opened location screen. Region selection alone does not trigger travel.

## Remaining work
1. Panel-by-panel mapping for the other eight original boards.
2. Full item-id ↔ image coverage audit; keep missing items explicit rather than inventing art.
3. NPC portrait coverage audit for all 69 NPCs.
4. Individual visual QA on desktop/tablet/mobile for every primary screen.
5. Build/lint and real server/API/auth/persistence checks once complete dependencies and a configured runtime are available.
