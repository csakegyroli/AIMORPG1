# AIMORPG v2.0 Visual Integration Register — alpha.2

**Scope:** first implementation slice, capital map command surface. **Baseline:** `AIMORPG-v2.0.0-alpha.1-Living-City-Foundation.zip` only. This is not a merge of the owner's unuploaded `D:\demo\uj` working tree.

## Status key
- FELTÁRKÉPEZVE — found and identified.
- INTEGRÁLÁSRA VÁR — target is documented, not integrated yet.
- INTEGRÁCIÓ FOLYAMATBAN — actively being connected.
- INTEGRÁLVA — used by the target game surface.
- ELLENŐRIZVE — integration and runtime/visual behaviour both verified.
- BLOKKOLT — concrete missing dependency or access limitation.

## Existing in-game artwork
| Asset | Intended surface/function | Status in alpha.2 | Verification |
|---|---|---|---|
| `capital-map.webp` | legacy capital map / fallback reference | FELTÁRKÉPEZVE | File present; not selected by new main map surface |
| `capital-map-v2.webp` | alternate capital map composition | FELTÁRKÉPEZVE | File present; compare visually before future replacement |
| `capital-map-v3.webp` | primary clickable capital map, seven region hit areas | INTEGRÁLVA | Source wiring and region IDs checked; live browser visual check BLOCKED by unavailable build dependencies |
| `city-panorama.webp` | outskirts / exterior location view | INTEGRÁLVA | Existing `REGION_ART` mapping |
| `inner-city.webp` | inner city location view | INTEGRÁLVA | Existing `REGION_ART` mapping |
| `market-center.webp` | market region / market district fallback | INTEGRÁLVA | Existing region and district references |
| `market-art-v3.webp` | overview/prologue hero art | INTEGRÁLVA | Existing overview reference |
| `eye-emblem-v2.webp` | capital map observer mark | INTEGRÁLVA | Existing map component reference |
| `arena.webp`, `harbor.webp`, `palace.webp`, `forest.webp`, `outskirts.webp` | respective region scenes | INTEGRÁLVA | Existing `REGION_ART` mappings; not runtime visually verified in this environment |
| `avatar-vagabond.webp`, `avatar-ranger.webp` | avatar selection/character surfaces | INTEGRÁLVA | Existing avatar definitions |
| `item-*.webp` | item artwork | INTEGRÁLVA, PARTIAL COVERAGE | Existing ID-to-art map only covers a subset; audit missing item IDs before broadening |
| `npc-*.webp`, `borin*.webp` | NPC portrait/content surfaces | INTEGRÁLVA, PARTIAL COVERAGE | Some NPCs use dedicated portraits; remaining portrait coverage needs an ID-based audit |

## Nine previously identified concept boards
These are multi-panel reference boards, not individual production-ready background assets. Keep original files intact. Crop/extract panels only into new files after visual review; never use a whole board as a scene background.

| Original concept filename | Intended integration target | Status |
|---|---|---|
| `AIMORPG-Fekete-Erme-elofantasy.png` | visual language / city, interface and story references | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `AIMORPG-Fekete-Erme-koncepciotabla.png` | UI composition references / layout study | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `Fekete-Erme-Elo-Fantaziavaros.png` | city and district scene references | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `AImorpg-Fekete-Erme-vilaga.png` | overall world, UI and story direction | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `AIMORPG-Fekete-Erme-vilaga-1.png` | scene/character/item concept references | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `AIMORPG-Fekete-Erme-vilaga-2.png` | scene/character/item concept references | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `AIMORPG-Arenthal-elo-vilaga.png` | capital/world scenes and live-world tone | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `AIMORPG-Arendel-elo-vilaga.png` | alternate city/world composition references | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |
| `AImorpg-tesztelesi-utmutato-es-latvanytervek.png` | QA/visual acceptance references | FELTÁRKÉPEZVE; panel-level mapping INTEGRÁLÁSRA VÁR |

**Access note:** the nine concept boards were available in the conversation's prior artifact library during audit, but are not part of the alpha.1 source ZIP. They are therefore not copied into this release archive and cannot be panel-cropped into production assets from this source tree alone.

## Alpha.2 implementation notes
- The map now presents a capital command surface with labels for the seven known regions, current-location emphasis, quest target emphasis, and locked-region state.
- A companion panel reports the runtime current region, world clock, present NPC count, tracked story NPC, and per-region access state from existing game data.
- Selecting a region opens its existing scene. It does not call `game.travel`; travel remains a separate action in the location view.
- No database schema/migration changes, API keys, external AI calls, or AI activation were introduced.
- Runtime visual verification remains outstanding because dependencies did not install completely in this environment.
