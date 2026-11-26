# AIMORPG — Műhelynegyed
## PHASE 0 audit closure and PHASE 1 implementation log

- Baseline: `2.0.0-alpha.26`
- Baseline commit: `9c3c654208580d7895889f879f5bbcc913dc504a`
- Working branch: `workshop/phase-1-crafting-specialization`
- Scope: Műhelynegyed NPC specialization and crafting workbench only
- Main branch: unchanged

## PHASE 0 — READ-ONLY AUDIT CLOSURE

### Repository and runtime
- The alpha.26 canonical baseline is the repository's imported starting point.
- Frontend: Next.js 16.3 / React 19.2; Node.js >=22 declared in package.json.
- Gameplay state currently lives in the client-side React store and is persisted in localStorage under `aimorpg-final-demo-v1-29`; save payload version is 6.
- The shared API helper exists, but no server-authoritative crafting/enhancement endpoint was verified in this audit.
- The alpha.26 release note records `npm test: PASS` for that checkpoint. It also records lint, production build, dependency installation and browser QA as blocked by missing dependencies and npm registry DNS (`EAI_AGAIN`).

### NPC identity and content
| NPC | ID | Existing service |
|---|---|---|
| Borin Vasmarok | `garran` | `forge` |
| Velka | `velka` | `forge` |
| Nara Bőrös | `nara` | `leatherwork` |
| Tomen | `tomen` | `apprentice` |

All four NPC definitions, districts, service descriptions and narrative story profiles are present in `src/lib/content.ts`.

### Existing gameplay systems
- `src/lib/itemSystem.ts` already provides regional `craftRecipeForItem()`, `dismantleYieldsForItem()`, item legality and market eligibility helpers.
- `src/lib/store.ts` already executes forge crafting and dismantling through `useNpcFunction()`.
- `InventoryItem` currently contains only `instanceId` and `itemId`; no item durability or permanent enhancement state is present.
- The existing `smithingKit` is an inventory item, not an implemented +1–+9 upgrade system.
- Tomen's current apprentice action increments the global `smithing` base stat by one for gold; it is not a separate profession progression track.
- No independent profession XP, recipe mastery, repair durability, enhancement protection or upgrade history model was verified.

### UI and visual assets
- `GameClient.tsx` already contains a reusable NPC workbench panel with craft selection, material counts and dismantling.
- NPC portraits are mapped for `garran`, `velka` (via `npc-velka.webp`), `nara` and `tomen`.
- Unique item artwork exists for `militiaBlade`, `oakShield`, `paddedArmor`, `travelerBoots`, `lurkerGloves`, `workshopIron` and `tannersWax`.
- The Műhelynegyed district artwork `public/assets/districts/workshops.webp` exists.
- The visual asset manifest marks artwork as source-wired / live rendering not tested. The UI smoke test checks the source wiring and asset files; it is not browser visual QA.

### Test infrastructure and limitations
- `npm test` runs gameplay/content smoke tests, security smoke tests, visual asset smoke tests and visual UI smoke tests.
- `npm run lint` runs `tsc --noEmit`; `npm run build` runs the production build.
- No local repository checkout with installed dependencies was available to execute these commands in this session. No new test result is claimed.
- The Phase 0 audit is closed at source-review level. Runtime/browser verification remains explicitly outstanding.

## PHASE 0 — CONCLUSIONS

1. The district already has a functioning generic crafting foundation; it must be specialized rather than replaced.
2. Item instance data is not yet rich enough for durability or permanent +1–+9 progression.
3. Crafting currently mutates client-side state; authoritative enhancement outcomes require a separately approved server-side design.
4. Tomen's global-stat training should not be mistaken for profession mastery.
5. Existing save compatibility must be preserved in any future item-instance expansion.

## PHASE 1 — STARTED

### Implemented on this branch

#### 1. NPC crafting boundaries
A new helper, `canNpcCraftItem(npcId, item)`, enforces:
- Borin (`garran`): weapons and shields.
- Velka (`velka`): armor.
- Nara (`nara`): leather-related boots, armor and accessories.
- Other existing forge NPCs: retain the previous generic behavior.

The restriction is enforced in both the UI and the store action. A forged request that bypasses the UI is rejected by the store.

#### 2. Nara-specific leatherwork recipes
- Boots: 2 × `tannersWax`
- Leather armor: 3 × `tannersWax`
- Leather accessories: 2 × `tannersWax`
- Dismantling returns half the recipe quantity, rounded down but at least one unit.
- Nara's recipes do not consume `workshopIron`; this keeps the first leatherwork slice distinct from metal forging.

This is a deliberately small initial material model using an existing canonical item. It does not introduce a new hide/leather item or change the global item catalogue.

#### 3. Workbench UI
- Nara's `leatherwork` function now opens the same established workbench interaction surface.
- Craft and dismantle lists are filtered by the NPC's specialty.
- Common baseline equipment without explicit region metadata is visible in the outskirts workshops, so the baseline sword, shield, padded armor and boots can be selected by the appropriate specialist.
- The workbench uses the existing item artwork resolver.

#### 4. Regression checks added
- Crafting specialty assertions for Borin, Velka and Nara.
- Guard that unrelated accessories are not craftable by Nara.
- Guard that other forge NPCs preserve their existing generic behavior.
- Nara recipe and dismantling-yield assertions.
- UI smoke assertions for the leatherwork workbench and specialty filtering.

### Explicitly out of scope for this first slice
- Permanent item enhancement +1–+9.
- Durability and repair.
- Profession XP / mastery / unlock progression.
- Minigames.
- New material IDs or changes to item prices / drop rates.
- Server-authoritative crafting or enhancement.
- Any changes to Canon, global economy, save schema or unrelated districts.

## PHASE 1 — NEXT WORK ITEMS

1. Verify the branch with `npm test`, `npm run lint` and `npm run build` in a dependency-complete local environment.
2. Review the four NPC workbench flows manually in the browser, including unavailable NPC hours and region validation.
3. Add distinct craft/dismantle result messaging and empty-state copy for each specialist.
4. Design a profession progression proposal for Central Meta-GPT review; do not implement it before approval.
5. Produce a separate item-instance / enhancement architecture proposal only after the server-authority and save-migration decisions are made.

## Safety and governance
- No changes were made to `main`.
- No existing item stats, prices, drop rates, quests or save fields were changed.
- No durability, permanent enhancement or new progression system was silently introduced.
- This branch is an implementation candidate and requires review before merge.
