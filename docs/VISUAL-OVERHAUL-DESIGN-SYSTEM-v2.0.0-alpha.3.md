# AIMORPG Visual World System — alpha.3

## Direction

A living dark-fantasy capital, not a generic dashboard: deep ink and dark-stone surfaces, worn timber and iron, restrained bronze/gold highlights, parchment-toned readable text, and wide cinematic paintings. Art is layered into the live interface; it is not presented as a baked screenshot or substitute for functioning controls.

## Token set (in `src/app/globals.css`)

| Token | Purpose |
|---|---|
| `--world-void`, `--world-ink` | outer void and deepest surfaces |
| `--world-stone`, `--world-raised` | panels, cards and raised surfaces |
| `--world-parchment`, `--world-muted`, `--world-dim` | primary, secondary and low-priority text |
| `--world-bronze`, `--world-gold`, `--world-gold-hot` | frames, primary actions and emphasis |
| `--world-line`, `--world-line-bright` | quiet and strong panel dividers |
| `--region-outskirts`, `--region-arena`, `--region-market`, `--region-inner`, `--region-palace`, `--region-harbor` | semantic regional accents |

## Shared interaction system

Buttons use one shape language and clear hover/focus/disabled states. Inventory, equipment, quests, NPC directory, market, messages, Chronicle and The Eye share the material palette while retaining their distinct content structures and existing event handlers. `prefers-reduced-motion` reduces animations and transitions. On narrow screens, the current navigation becomes a bottom rail rather than being removed; it remains the same navigation state and uses the existing `go()` action.

## Screen map

| Screen | Visual treatment | Runtime source preserved |
|---|---|---|
| Capital map | Dominant illustrated atlas, readable labels, separate current/quest/locked states | `REGIONS`, `game.regionAccess`, `game.currentRegion`, tracked quest and existing region selection handlers |
| Overview | Cinematic capital banner and compact world/event cards | Existing world calendar, events, journal and quest status |
| Character | Large avatar composition, readable effective stat bars, equipment and skill branches | Existing effective stats and game store actions |
| Inventory / equipment | Item-first grid, rarity borders, selected item details, paper-doll slots | Existing item IDs, tooltips, equip/use/sell handlers, central stat logic |
| Quest log | Ledger and story-node styling | Existing quest statuses, requirements and choices |
| NPC directory | Portrait-led resident index and relation/history detail | Existing discovered/access-controlled listing, relation state and location information |
| Market | Local trade catalogue with clear prices/categories | Existing local market price, demand and purchase handlers |
| Messages / Chronicle | Warmly framed notes and timeline cards | Existing message-seen state and journal entries |
| The Eye | Restrained observer artwork plus distinct AI result/error/loading region | Existing `/api/ai/eye` call and current response validation in UI; server service unchanged |
| Region and district views | Environment imagery, story ledger and local NPC panels with region accents | Existing district data, NPC schedule/presence, travel action |

## Artwork extraction

Fifteen image-only crops were extracted from `AIMORPG-Fekete-Erme-koncepciotabla.png` into `public/assets/world/`. Their source coordinates and target purposes are documented in the visual register. The original nine boards are copied unchanged into `docs/artwork-sources/original-concepts/`. The contact sheet is `docs/artwork-sources/cropped-artwork-contact-sheet.jpg`.

## Visual QA truthfulness

This execution environment cannot currently render the Next.js application because `npm ci` failed on registry resolution (`EAI_AGAIN`) and the `next` binary/types are not installed. The CSS parser, TS/TSX syntax transpilation, and all no-dependency smoke tests passed. Browser screenshots, layout overflow checks and visual verification remain **not run**; a successful syntax or asset test is not evidence of a rendered screen.
