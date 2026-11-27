# Régi Perem — PHASE 1 NPC gameplay specification

**Status:** PHASE 1 / STAGE 2 — SPECIFICATION IN PROGRESS  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Baseline branch:** main  
**District branch:** `old-edge/phase-1-specification`  
**Related GitHub issue:** #8  
**Scope NPCs:** Eldra (eldra), Siven (siven), Maela (maela)  

> This is a gameplay specification deliverable, not an implementation. No source code changes are authorized in this stage.

## 0. Working contract and evidence labels

Each proposal must be tagged as exactly one of:
- **LOCAL PROPOSAL** — district-local behavior that does not create or modify a shared system.
- **SHARED ARCHITECTURE DEPENDENCY** — uses a shared contract already documented centrally.
- **CENTRAL DECISION REQUIRED** — changes or extends a shared contract, balance rule, save schema, or cross-district policy.
- **BLOCKED** — cannot be specified safely until a named central decision or missing source fact is resolved.

Do not repeat PHASE 0. Use its completed audit plus the alpha.26 source and the six central Phase 1 documents:
- `OUTSKIRTS_PHASE1_SHARED_ARCHITECTURE.md`
- `OUTSKIRTS_NPC_FUNCTION_MATRIX.md`
- `OUTSKIRTS_PROGRESSION_MAP.md`
- `OUTSKIRTS_ECONOMY_DEPENDENCY_MATRIX.md`
- `OUTSKIRTS_FILE_OWNERSHIP_AND_INTEGRATION_PLAN.md`
- `OUTSKIRTS_PHASE1_IMPLEMENTATION_ORDER.md`

Preserve Canon and existing authored content. Do not invent unknown runtime facts: mark them **VERIFY IN SOURCE** and cite exact paths/functions/IDs where possible. Do not make unilateral shared architecture decisions.

## 1. District gameplay objectives

District identity and priority: **alkímiai kutatás, expedíciók, dungeonök, logikai feladványok, csapdák, relikviák, A Szem szabályozott felfedezése**.

Define the district's gameplay promise, player-facing outcomes, intended session length, repeatability limits, progression role, and how it remains distinct from the other five districts.

## 2. Per-NPC specifications

Create one complete subsection per assigned NPC. No NPC may be covered only by a summary table.

For each NPC, fill every subsection below with concrete, deterministic rules:

### [NPC name / canonical ID]

1. **Canon and identity:** authored role, voice, motivations, relationships, immutable facts.
2. **Current technical function and runtime:** exact alpha.26 source path, function/handler, data IDs, current behavior, save effects; distinguish implemented behavior from intended behavior.
3. **Development goal:** specific player-facing function and measurable outcome.
4. **Complete player loop:** unlock → approach → choices → action resolution → reward/cost → follow-up; include repeat and exit conditions.
5. **Player decisions and routes:** every choice, prerequisites, alternative strategies, cancellation and failure recovery.
6. **Resolution rules:** numerical formulas, thresholds, tie-breakers, random ranges/seeds where applicable; define success, partial success, failure and critical edge cases. Avoid opaque randomness.
7. **Required stats, items and access:** exact stat names/IDs only when verified; item IDs, quantity, condition, permissions, flags and district unlocks.
8. **Economy:** all entry fees, costs, sinks, rewards and expected value assumptions; identify inflation/farming risks. Use shared currencies and rarity only.
9. **Relationships and reputation:** exact triggers, deltas or bounded values, caps, decay (if any), visibility and downstream effects. Do not create a parallel reputation system.
10. **Progression and unlocks:** concrete XP/threshold/rank rules, mastery interactions and unlock table. Shared mastery changes are central decisions.
11. **UI/interaction:** screen states, controls, feedback, errors, accessibility, mobile behavior and navigation.
12. **Persistence/state machine:** state fields, transitions, idempotency, reload/re-entry behavior, migration implications. Shared save schema changes are central decisions.
13. **Abuse/exploit controls:** replay, duplicate claims, cancellation, reload, client tampering, timing, resource duplication and edge cases.
14. **Automated tests:** named test cases with setup, action, expected result; include success/partial/failure, boundaries, save/reload and exploit cases.
15. **Cross-district dependencies:** producer/consumer relationships, shared items/flags/NPC handoffs, ordering and fallback if another district is unavailable.
16. **Acceptance criteria:** independently testable, observable statements.

## 3. District-level gameplay and interfaces

Specify district-wide rules that connect NPCs without duplicating global systems. Include:
- the exact end-to-end player journey across assigned NPCs;
- shared district unlocks and how they are earned;
- routing between NPC services and prevention of dead ends;
- input/output contracts and item/material flow;
- UI navigation and accessibility;
- failure recovery and non-mandatory alternatives.

## 4. Minigame / specialized mechanic full rules

For every minigame or bespoke interactive mechanic, include:
- board/state definition and all legal actions;
- turn/round sequence and termination;
- deterministic resolution formula and randomness boundaries;
- scoring, success bands, tie rules and failure outcomes;
- difficulty progression and how it is earned;
- rewards, entry cost, repeat limits and anti-farming;
- UI states, controls, tutorial and accessibility;
- at least 12 automated test cases including edge cases.

Do not write “add a minigame” or “player improves skill” without a complete playable specification.

## 5. Shared architecture boundary register

| Topic | Classification | Exact dependency / proposed contract | Decision owner | Blocker / fallback |
|---|---|---|---|---|
| Item instance model | SHARED ARCHITECTURE DEPENDENCY | One canonical item-instance model only | Central Meta-GPT | No district-local instance fields |
| Economy and currencies | SHARED ARCHITECTURE DEPENDENCY | One shared economy and currency ledger | Central Meta-GPT | No district currency |
| Rarity | SHARED ARCHITECTURE DEPENDENCY | Existing global rarity taxonomy | Central Meta-GPT | No local rarity tiers |
| Character progression | SHARED ARCHITECTURE DEPENDENCY | One shared progression model | Central Meta-GPT | No parallel levels |
| Profession mastery | CENTRAL DECISION REQUIRED where applicable | Shared mastery contract; district may propose track-specific actions | Central Meta-GPT | Do not implement a local mastery store |
| NPC action/transaction protocol | SHARED ARCHITECTURE DEPENDENCY | Shared action/result and transaction/idempotency contract | Central Meta-GPT | No local transaction protocol |
| Save/migration | SHARED ARCHITECTURE DEPENDENCY | Shared save versioning and migration policy | Central Meta-GPT | No uncoordinated schema change |
| Other cross-district systems | classify individually | Name producer, consumer and data contract | Central Meta-GPT | BLOCKED until resolved |

## 6. File ownership and implementation handoff

Use the central file ownership document. Do not create or edit source files in Stage 2. List proposed future files only as proposals, with owner, API boundary and dependencies. Shared files remain centrally owned.

## 7. Open decisions and blockers

List each as **CENTRAL DECISION REQUIRED** or **BLOCKED**, with:
- precise question;
- why it matters;
- options and trade-offs;
- affected NPCs/districts/files/save;
- safe provisional behavior.

## 8. District test plan and acceptance checklist

Provide a complete district-level test matrix, deterministic fixtures, cross-NPC integration cases, economy invariants, persistence/reload tests, abuse cases, and UI/device coverage. Include explicit pass/fail criteria.

## 9. Completion declaration

State:
- NPCs fully specified / incomplete;
- unresolved central decisions;
- shared contract dependencies;
- exact source evidence checked;
- acceptance criteria met / not met;
- confirmation that no source code, shared documents, or other district branches were modified.

**Stage 2 exit rule:** all assigned NPC sections are complete and testable; no Canon changes; no parallel global systems; shared conflicts are explicitly raised; no implementation has begun.


## 10. Központi tervezési pass — Régi Perem (v0.2)

**Státusz:** Eldra, Siven, Maela: **IN PROGRESS**. A Szem megfigyelési réteg; nem oldhat meg feladványt, nem választhat eredményt, nem generálhat autonóm dungeon-tartalmat és nem írhat önállóan világállapotot.

### Eldra — alkímiai labor
**Forrás:** `fn-eldra`, kind `alchemy`; jelenlegi itemek között `moonleaf`, `emberRoot`, `strengthTonic`, `runeInfusion`. A tonic hatásai időlegesek és nem halmozhatók; rune infusion egy itemen egyszerre egy.
**Loop:** összetevő kiválasztása → azonosítás → recept kiválasztása → mennyiségek ellenőrzése → keverési sorrend → főzet elkészítése → naplóbejegyzés.
**Minijáték:** 3 lépéses laborprotokoll: alapoldószer → aktív összetevő → stabilizáló. A játékos három összetevőből választ sorrendet; a recept authored sorrendű. 3/3 helyes = siker; 2/3 = instabil, de nem jön létre consumable; 0–1 = kudarc, input elhasználódik csak akkor, ha a játékos a végső „reakció indítása” gombot megerősítette. Nincs random.
**Erőforrás/jutalom:** csak meglévő vagy central-approved item output. A `strengthTonic` egy órára +1 strength, nem stackel; újabb adag az expiry-t frissíti. `runeInfusion` egy órára +1 stat egy felszerelt itemhez, itemenként egy buff. A receptek ára a közös itemSystem receptből és központi gold fee-ből jön. Nincs új rarity vagy helyi potion tier.
**Fejlődés:** alchemy stat 5–7 esetén egy összetevő eredete látható; 8–9 esetén két összetevő; 10+ mindhárom. Ez csak információs előny, nem módosítja a statot vagy a recipe outputot. Mastery central.
**Teszt:** all 6 permutations; 3/3; 2/3; 1/3; no consume before confirm; insufficient ingredients; duplicate craft; buff nonstack; refresh expiry; second rune infusion blocked; wrong equipped instance; reload; no Eye outcome generation.

### Siven — romkutatás és expedíció
**Forrás:** `fn-siven`, kind `ruins`, 40 gold; romkutatást és kockázatos expedíciót vezet.
**Loop:** célpont kiválasztása → térkép/hozzáférés ellenőrzése → felkészülési csomag (étel, fényforrás, szerszám) → útvonal választása → két expedíciós szakasz → visszatérés és leltár.
**Javasolt expedíció-állapot:** expeditionId, routeId, stageIndex, carriedInstanceIds, clueFlags, trapState, outcome, rewardClaimed. Ez új shared save state, ezért **CENTRAL DECISION REQUIRED**.
**Útvonal:** biztonságos (több előkészítés, kisebb anyagjutalom); feltáró (egy extra elágazás); rövid (kevesebb előfeltétel, magasabb authored trap complexity). Minden útvonal előre jelzett veszélycímkét mutat.
**Siker:** mindkét szakasz célfeladványa teljesítve és a játékos visszatér; részleges: egyik szakasz teljesült, a másikból biztonságosan visszavonul; kudarc: rossz csapdakezelés miatt egy nem-quest consumable elveszhet, de felszerelés/quest item soha. Random halál vagy tárgytörés nincs.
**Gazdaság:** 40 gold vezetési díj; fogyóeszközök valódi inputok; jutalom egyszeri dungeon reward source-onként, központi `rewardEconomy` útvonalon. No infinite farm.
**Teszt:** all routes; missing map; missing tool; cancel before depart; retreat stage1; full success; partial; trap failure; quest item protection; duplicate reward; reload mid-stage; tampered route; no forced wait.

### Maela — Néma kút, logikai feladvány és relikvia-nyom
**Forrás:** `fn-maela`, kind `well`; vizet ad és hozzáférést biztosít a kút körüli régi nyomokhoz; item `silentWellVial`.
**Loop:** víz húzása → a játékos választ: csak víz, nyomvizsgálat, vagy relikvia-nyom elemzése → három jelből álló kút-rejtvény → eredmény.
**Rejtvény:** 3 kőlap jelképeit kell párosítani három rövid, authored leírással (víz útja, régi őrség, csillagállás). A játékos három párt állít be; mindhárom helyes = teljes siker; kettő = részleges, egy újabb nyomot kap; 0–1 = sikertelen, de a feladvány resetelhető díj nélkül. Nincs időlimit, nincs random.
**Szem-szabály:** A Szem kizárólag korábban authored megfigyelést jeleníthet meg a helyszínről; nem adhatja meg a helyes párosítást, nem generálhat új relikvia-állapotot és nem állíthatja, hogy a kút beszél.
**Költség/jutalom:** víz ára 0 vagy a meglévő itemár; `silentWellVial` csak jóváhagyott, egyszeri discovery rewardként adható. A rejtvény jutalma discovery flag, nem ismételhető gold/item. **CENTRAL DECISION REQUIRED:** relic discovery state és Eye event schema.
**Teszt:** 6 permutáció; 3/3; 2/3; 0/3; reset; no time pressure; repeated puzzle no reward; vial once; no Eye solution leak; reload; invalid symbol; main quest unaffected.


## 11. Alpha.26 runtime verification — central review

**Verified source:** `src/lib/content.ts` blob `27206c65e37c5cc3b47d0257d91b1654f8971b95`; `src/lib/store.ts` blob `60fc472f8eeefd940aa25e226e3a1aa3a20b1aba`.

Verified functions: `fn-eldra/alchemy` (items `moonleaf`, `emberRoot`, `strengthTonic`, `runeInfusion`), `fn-siven/ruins` (40 gold), `fn-maela/well` (`silentWellVial`). Eldra has a dedicated alchemy handler; its runtime uses temporary buffs and prevents a second active infusion on the same equipped instance. Siven and Maela are grouped in the generic service/item branch in the store; a persistent expedition or puzzle state was not confirmed. The Eye must remain an authored observation layer, not an autonomous solver or state writer.

**Required follow-up:** inspect complete alchemy handler, buff expiry/save behavior and Eye event contract; expedition state remains a central schema decision. All three NPCs remain IN PROGRESS.

## 12. Targeted gap closure — alchemy, expedition, discovery & The Eye

**Addendum status:** TARGETED SOURCE VERIFICATION COMPLETE · NEW STATE CONTRACTS: **CENTRAL DECISION REQUIRED**  
**Source baseline:** `main` at alpha.26 (baseline commit `9c3c654208580d7895889f879f5bbcc913dc504a`, 2026-11-25).  
**Scope:** documentation and source verification only. This addendum does not authorize implementation, schema changes, Canon edits, merges, or changes to the 60 main quests.

Evidence labels:
- **VERIFIED** — directly present in alpha.26 source.
- **GAP / INCONSISTENCY** — source behavior differs from authored description or expected contract.
- **PROPOSAL — CENTRAL DECISION REQUIRED** — proposed state/API contract, not existing implementation.

### 12.1 Eldra — complete alpha.26 alchemy runtime/source map

#### Definition and current action path

**VERIFIED**
- `src/lib/content.ts:463`: `fn-eldra`, `npcId: "eldra"`, `kind: "alchemy"`; the configured `itemIds` are exactly `moonleaf`, `emberRoot`, `strengthTonic`, `runeInfusion`.
- `src/lib/types.ts:57-59`: `InventoryItem = { instanceId, itemId }`; `TemporaryStatBuff` stores `id/stat/amount/expiresAt/source`; `TemporaryItemBuff` stores `instanceId/stat/amount/expiresAt/source`. There is no recipe-instance or potion-batch type here.
- `src/lib/store.ts:568-669` (handler starts at the `useNpcFunction` callback; alchemy branch at 626): NPC ID, function ID, current region and NPC presence are checked before the switch. The `alchemy` case has two paths:
  1. `buy:<itemId>`: validates the selected ID against `fn.itemIds`, checks gold and inventory capacity, deducts `item.basePrice`, adds `makeInventoryItem(item.id)`, then records the generic activity.
  2. `infuse:<instanceId>`: resolves the ID against currently equipped items, checks for an active item buff, finds one `runeInfusion` in inventory, consumes that item and attaches a temporary buff to the equipped instance.
- `src/lib/itemSystem.ts:114-132`: `craftRecipeForItem` is a gear recipe helper. It requires a gear slot and returns workshop iron plus a region/synergy secondary material. It is not an alchemy recipe catalogue and does not define a `moonleaf`/`emberRoot` potion recipe.
- `src/lib/store.ts:646-648` and `src/lib/itemSystem.ts:114-132`: the alchemy handler does not call `craftRecipeForItem`, does not count or deduct `moonleaf`/ `emberRoot`, and does not create a crafted potion output. Those two items are currently buyable inputs/materials only; no recipe-input quantity contract is implemented.
- `src/lib/content.ts:54-56`: `moonleaf` base price 22, `emberRoot` 36, `strengthTonic` 95, `runeInfusion` 120. Both materials are sellable and market-eligible; both active-effect items are also sellable and market-eligible in the current definitions.

#### Buff application, duration, stack behavior and item-instance binding

**VERIFIED**
- `src/lib/store.ts:502-519`: `consumeItem(instanceId)` first resolves a real inventory instance. For `tempStrength`, it creates a `TemporaryStatBuff` with stable ID `alchemy-strength`, `expiresAt = Date.now() + tempHours × 60 minutes`, removes the consumed inventory instance and replaces any existing buff with the same ID. Therefore the strength buff does **not stack**; another tonic replaces/refreshes the same buff and sets a new expiry from the time of use.
- `src/lib/content.ts:56`: `strengthTonic.effects.tempStrength = 1`, `tempHours = 1`; expected effect is +1 Strength for one hour.
- `src/lib/store.ts:626-641`: rune infusion requires the target `instanceId` to match an item in `equipment`; it does not apply to an inventory-only item. The active-buff block is exact: an infusion is rejected only when a `temporaryItemBuffs` entry has the same `instanceId` **and** `expiresAt > Date.now()`. A buff for another item does not block it. Once the existing buff expires, a new infusion on that same equipped instance is allowed.
- The infusion consumes the first inventory entry whose `itemId === "runeInfusion"`; the buff itself is bound to the equipped item's `instanceId`, not to the consumed potion's instance ID. It adds +1 Strength.
- `src/lib/rules.ts` effective-stat calculation is called through `src/lib/store.ts:301-303` with both temporary buff arrays and the equipment state. The item buff therefore has an item-instance reference; it is not a global item-definition mutation.
- `src/components/GameClient.tsx:798-805`: the alchemy UI displays the four configured item choices, purchase action, and equipped item selection for rune infusion. It labels the infusion as +1 Strength for one hour and disables a currently active target in the UI. The store still performs the authoritative-in-this-client validation; UI disabling is not a substitute for it.

**GAP / INCONSISTENCY — MUST NOT BE SILENTLY FIXED IN THIS TASK**
- `src/lib/content.ts:56` describes `runeInfusion` as a one-hour effect.
- `src/lib/store.ts:634` actually sets `expiresAt: Date.now() + 30 * 60 * 1000` (30 minutes).
- The same handler's success message at `src/lib/store.ts:635` says “egy órára”.
- The UI at `src/components/GameClient.tsx:805` also says “+1 Erő · 1 óra”.
- Thus the actual rune infusion expires after **30 real-world minutes**, while item description, UI and success feedback promise **one hour**. This is a verified inconsistency, not a decision made here.

#### Buff expiry, save/load, interruption and duplicate protection

**VERIFIED**
- `src/lib/store.ts:16`: save key `aimorpg-final-demo-v1-29`; legacy keys are listed alongside it.
- `src/lib/store.ts:229-230`: load sanitization accepts temporary buffs only when their required fields have the expected primitive types.
- `src/lib/store.ts:272-273`: load retains only buffs whose `expiresAt > Date.now()`. The timestamp is an absolute runtime timestamp, not an in-world clock duration.
- `src/lib/store.ts:310-311`: after hydration, the full `data` object is serialized to localStorage whenever it changes. Buff arrays are part of that object. Therefore an unexpired buff survives reload in the current browser save; an expired buff is filtered out during load. Time continues to elapse while the game is closed because expiry uses wall-clock `Date.now()`.
- `src/lib/store.ts:514-519`: using a second strength tonic replaces the existing `alchemy-strength` entry, consumes the second potion and refreshes expiry. It is refresh, not additive stacking.
- `src/lib/store.ts:630-641`: duplicate active infusion is blocked by target item instance and unexpired timestamp. An expired buff does not block re-infusion.
- `src/lib/store.ts:568-669`: the handler has no operation/session ID, idempotency token, duplicate-request ledger or transaction boundary. The `used()` helper awards the generic NPC-function XP/memory only once per function tag, but that does **not** prevent repeated purchases or repeated infusion actions after expiry.
- **Interruption:** there is no multi-stage alchemy session or in-progress recipe to interrupt. A purchase is a single store update. A buff application is a single store update. There is no separate cancel/rollback flow after the click has committed.
- **Capacity:** purchase checks `inventory.length >= 80` before adding the item. The rune infusion path consumes one infusion item and updates the buff in the same returned state object.

#### Eldra conclusions / status

| Audit question | Alpha.26 finding |
|---|---|
| Recipe inputs and quantities | No alchemy recipe exists in this handler; no material quantities are checked or deducted |
| Output | Purchases create the selected existing item instance; no crafted output is produced |
| Temporary stat buff | +1 Strength, one-hour duration for tonic; same buff ID replaces prior buff |
| Rune infusion | +1 Strength attached to equipped item instance |
| Actual infusion expiry | 30 minutes, despite one-hour content/UI/message |
| Stack behavior | Tonic refreshes; infusion blocks same item instance only while unexpired |
| Item-instance relation | Tonic consumption uses inventory instance; infusion uses equipped target instance |
| Save/load | Buff timestamps are saved and reloaded if still in the future |
| UI | Purchase list and equipped-target infusion picker exist |
| Cancellation | No in-progress action to cancel; no rollback after committed state update |
| Duplicate craft | Not applicable: no alchemy craft operation exists |
| Duplicate purchase / request | No idempotency protection verified; repeated purchase can create repeated instances |

**CENTRAL DECISION REQUIRED**
1. Whether Eldra remains a vendor of existing alchemy items or receives a real recipe/crafting contract.
2. If recipes are approved: canonical recipe IDs, exact input item IDs and quantities, output IDs/quantity, atomic debit/output, cancel-before-confirm semantics and idempotency key.
3. Resolve the 30-minute vs one-hour rune infusion discrepancy. This task does not select which value is canonical.
4. Whether the client-only localStorage runtime is acceptable for these effects or a server-authoritative action endpoint is required. Alpha.26 source review found no server-authoritative alchemy endpoint.

### 12.2 Siven — expedition state machine proposal

**VERIFIED CURRENT BASELINE**
- `src/lib/content.ts:339`: Siven is the Old Edge NPC at the Régi raktárudvar.
- `src/lib/content.ts:481`: `fn-siven`, kind `ruins`, cost 40 gold.
- `src/lib/store.ts:663-669`: `ruins` is included in the generic service/item handler, not a dedicated expedition handler. With no item list, it deducts the configured fee and returns the generic function description; no expedition route, stage, carried-instance set, trap state, clue record or return settlement is written.
- `src/lib/narrative.ts:35-49`: existing Dynamic Layer has generic flags, bounded dynamic events, NPC overrides and discovered Canon hints. `NarrativeState` owns Canon (read-only), Dynamic Layer, director and runtime.
- `src/lib/narrative.ts:749-800`: dynamic events are appended with generated IDs and bounded to 200; save sanitization retains typed flags/events and bounded discovered-hint strings.
- `src/lib/store.ts:16,229-273,310-311`: save schema is currently localStorage key `aimorpg-final-demo-v1-29`, payload saveVersion 6 in fresh state, and the existing save/load pipeline has no expedition field.

**PROPOSAL — CENTRAL DECISION REQUIRED: expedition aggregate**

This is a proposed logical contract only. It is not an alpha.26 type or an implementation instruction.

| Field | Meaning | Persistence class | Rule |
|---|---|---|---|
| `expeditionId` | Unique identity for one expedition attempt | Persistent | Generated once when departure is confirmed; reused on reload/re-entry; never reused for another attempt |
| `routeId` | Stable authored route key | Persistent reference | Must resolve against authored route content; not free-form player text |
| `stageIndex` | Current authored stage position | Persistent | Integer bounded by the selected route's stage count |
| `carriedItemInstanceRefs` | References to player-owned item instances committed as expedition loadout | Persistent | References existing `InventoryItem.instanceId`; no copied item definitions or parallel inventory |
| `clueFlags` | Set of clues actually discovered by this player in this expedition | Persistent | Only set by successful authored clue interactions; no Eye-generated clues |
| `trapState` | Current trap encounter status and resolved choice key | Persistent | Authored trap ID + state such as unseen/active/disarmed/triggered; never trust client-supplied result |
| `outcome` | Terminal or resumable expedition result | Persistent | Pending / success / partial / failure / retreated / abandoned, with terminal transitions one-way |
| `rewardClaimed` | Whether this expedition's settlement has been applied | Persistent | False until settlement; set atomically with reward grant; a second claim must return already-settled without granting again |

#### State classes kept separate

- **Persistent player state:** the fields above, current expedition status, and a compact settlement record sufficient to reject replay. Save migration and retention policy require central approval.
- **Recomputable UI preview:** route danger labels, estimated requirements, stage summary, possible clue locations, projected reward band and current legal-action buttons. Recompute from authored route data + current player state; never save as truth.
- **Authored world data:** route definitions, stage order, trap definitions, clue text/IDs, fixed resolution rules, prerequisite declarations and reward source IDs. These are content, not player save state.
- **Player-modifiable choices:** selected route, loadout selection before departure, each legal stage action, continue/retreat choice and final return confirmation. A choice is recorded only after explicit player confirmation.

#### Proposed transition graph

`idle → preparing → departed(stageIndex=0) → in_stage → (next stage | retreated | terminal outcome) → returned → settled`

- `idle → preparing`: Siven interaction opens preview; no fee or item is consumed.
- `preparing → departed`: validate region/access, route ID, all selected item instance refs, inventory/equipment ownership, item eligibility, fee and capacity; show final confirmation; only then debit the 40-gold fee and commit the expedition ID/loadout.
- `departed/in_stage → in_stage`: load the exact persisted stage; legal actions are derived from the authored stage definition.
- `in_stage → next stage`: only the stage resolver can advance `stageIndex`; repeated submissions with the same expedition/stage/action key must not resolve twice.
- `in_stage → retreated`: player explicitly chooses retreat; preserve carried item ownership and record only authored retreat consequences.
- `in_stage → terminal outcome`: success/partial/failure is resolved by deterministic authored rules (or a centrally approved RNG contract); client UI cannot submit its own outcome.
- `terminal outcome → returned`: return action is idempotent; it does not re-run the stage resolver.
- `returned → settled`: apply one reward settlement. The reward claim marker and reward effects must be committed as one atomic operation.

#### Quest-item and reward invariants

1. Quest/evidence/unique protected items are never eligible for the carried loadout unless a central shared contract explicitly whitelists them; default is reject.
2. Quest items are never consumed, dropped, destroyed or removed by trap/failure/retreat.
3. For ordinary loadout items, prefer references that remain owned in inventory/equipment; if a future design requires escrow, it must use a reversible, centrally approved escrow mechanism. Do not silently remove them at departure.
4. Every reward has a stable source key derived from the expedition settlement, not merely from the route name. One expedition attempt can settle at most once.
5. The `rewardClaimed` check and reward grant must be atomic. A client-only boolean alone is not a secure anti-cheat boundary; server-authoritative settlement is a central architecture decision.
6. Inventory capacity must be checked before settlement. If reward cannot fit, keep the expedition in returned/unsettled state and allow retry after space is made; do not mark claimed.
7. A new attempt receives a new `expeditionId`; it must not reset or replay a previously settled attempt.

#### Jarek map compatibility and route discovery

- `src/lib/content.ts:468-469`: `fn-jarek` is a 20-gold map service whose authored description says Jarek updates the route map and reveals shortcuts.
- Alpha.26 generic handler does not verify a persistent route-discovery record for `fn-jarek`; the current `map` kind is routed through the generic service branch (`src/lib/store.ts:663-669`).
- **PROPOSAL — CENTRAL DECISION REQUIRED:** use one canonical stable `routeId` namespace shared by Jarek's map content and Siven's expedition routes. Jarek may reveal/mark only route IDs that are authored and eligible; Siven may offer only route IDs already unlocked by the approved access rule. Do not create a second map graph inside Siven.
- Discovery record should reference `routeId` and its source event; the UI route preview is recomputed. Whether the existing `dynamic.flags` or a shared map-discovery contract owns this flag is an open central decision.

### 12.3 Maela — Néma Kút discovery state proposal

**VERIFIED CURRENT BASELINE**
- `src/lib/content.ts:340`: Maela is the Néma Kút gondnoka in Old Edge.
- `src/lib/content.ts:482`: `fn-maela`, kind `well`, with `itemIds: ["silentWellVial"]`.
- `src/lib/store.ts:663-669`: `well` is in the generic item/service branch. Since the function has one item ID, the generic action can sell the vial; there is no puzzle evaluator or persistent discovery completion check in this handler.
- `src/lib/content.ts:66`: `silentWellVial` is a 34-gold relic-category consumable, but it is currently `sellable: true` and `marketEligible: true`.
- `src/lib/content.ts:430`: Niven's `fn-niven` rare-trade list also contains `silentWellVial`.
- `src/lib/itemSystem.ts` regional explicit pool includes `silentWellVial` in the Outskirts pool; `isMarketEligible` and `isSellable` rely on the item flags and quest-item category, and `relic` is not automatically a quest-item category.
- `src/lib/narrative.ts:35-49,208-224,749-800`: existing Dynamic Layer has boolean/string/number flags, bounded events, discoveredCanonHints and narrative runtime; Canon remains read-only.

#### Proposed discovery record

**PROPOSAL — CENTRAL DECISION REQUIRED**
- Preferred existing container: `narrativeState.dynamic.flags` for a compact player-specific discovery marker, plus `dynamic.events` / `worldMemories` for the historical evidence and source. Do not create a relic inventory, a parallel quest registry or a separate puzzle-save object.
- Candidate key (not yet approved): `oldEdge.silentWell.discovery.v1`.
- Candidate values: absent = not discovered; `"partial"` = at least one authored clue recorded but puzzle not solved; `"solved"` = puzzle successfully resolved and confirmed by player. If central chooses boolean-only semantics, partial clue history must be represented by the existing event/memory layer instead.
- Authored clue definitions and correct associations remain static content. The player's submitted associations are transient UI input until the final confirmation and resolver accepts them.
- **Completion condition:** all required authored clue associations are correct in the same confirmed submission, and the resolver commits the discovery marker. Partial correctness may reveal only an authored additional clue if approved; it must not set completion or grant the final reward.
- **Repeatability:** clue inspection and puzzle attempts may be repeatable; discovery completion is one-time per player save. After completion, show the recorded discovery and do not reissue its unique reward.
- **Reward anti-duplication:** grant reward only on the atomic transition from not-solved to solved. If the marker is already solved, repeated interaction, reload or replay must not grant again. A reward ledger/source ID may be required if central architecture cannot guarantee atomic state + inventory update.
- **Quest/narrative relationship:** do not add or change any of the 60 main quests. A discovery may record a Dynamic Layer event and world memory. It may become a side-quest prerequisite only if an authored side-quest blueprint explicitly names the flag and the central narrative contract approves that dependency. Discovery itself is not automatically a quest completion.
- `silentWellVial` is **not currently a one-time discovery reward**: it is purchasable from Maela's generic service and appears in Niven's trade list and the Outskirts market pool. Therefore the earlier Phase 1 proposal “vial only once as discovery reward” conflicts with alpha.26 item distribution. Central must choose between retaining it as a tradeable item and using a different approved discovery reward, or restricting its sources in a separate item/economy decision. No choice is made here.

### 12.4 A Szem — bounded observation event contract

**VERIFIED RULES**
- `src/lib/eye.ts:1-32`: The Eye is an authored observation layer; its stated observation domains are meaningful choices, quest outcomes, first region arrival, material NPC relationship changes, repeated behavior patterns and major world-state changes. It must not reveal hidden scores, force/undo decisions, teleport, invent non-Canon facts, punish offline players or speak after trivial actions.
- `src/lib/eye.ts:61-108`: existing observation functions produce authored `title/body/tone` messages for identity, relationship, quest and first-travel events.
- `src/lib/narrative.ts:35-49,749-800`: Dynamic Layer event records are bounded historical data; Canon is readonly.
- `src/components/GameClient.tsx:1101`: the Eye view states that visions are displayed only when explicitly tagged in Dynamic Layer; empty data is not filled with invented content.
- `src/components/GameClient.tsx:1101+`: the AI observation panel describes the result as observation rather than instruction and exposes an optional “possible direction”; this output must remain non-binding.

#### Contract proposal

Each observation is emitted only after the underlying gameplay action has committed successfully. It is a read/interpretation result, not an action command.

| Event | Trigger | Source data (read-only) | Allowed output | Forbidden inference | Player confirmation |
|---|---|---|---|---|---|
| `player_choice_committed` | A meaningful player choice has resolved | Existing choice/quest result, journal and world memory IDs | Short authored observation quoting the recorded consequence | Hidden motive, unrecorded intention, future certainty | Required before any follow-on gameplay action; observation itself needs no confirmation |
| `quest_outcome_committed` | Existing quest resolver commits success/failure | Quest ID, result, authored consequence, recorded memory/event | Restate outcome and its known consequence | Reopen/complete another quest; infer missing quest flags | Required for any quest navigation/action; Eye cannot invoke it |
| `region_discovery_committed` | First-visit travel memory/event is committed | Region ID, first-visit marker, timestamp | Identify the newly recorded region visit | Reveal hidden routes, rooms, traps or future regions | Required before travel; travel itself remains a player action |
| `relationship_threshold_crossed` | Existing relationship resolver crosses a defined threshold | Before/after relationship facets and NPC ID | Describe the observed change in ordinary language | Assert unrecorded feelings, secret allegiance or NPC actions | Required before starting dialogue, quest or NPC action |
| `expedition_stage_committed` | An approved expedition stage resolver commits a stage | Expedition ID, route/stage IDs, resolved clue/trap result | Quote the exact clue or result already stored for this player | Solve the next puzzle, choose route, infer unvisited trap contents or claim reward | Required before continue/retreat/claim; player chooses |
| `well_discovery_committed` | Approved Maela puzzle resolver commits discovery | Discovery flag, authored clue IDs, result event and memory | Confirm that the player has recorded this discovery; cite the source | Provide the answer before solve, invent relic meaning, assert hidden Canon | Required before any reward collection or follow-up action |
| `route_discovery_committed` | Approved Jarek/map resolver records an authored route unlock | Stable route ID, unlock source and map record | Show the already-unlocked route and source | Unlock route, select route or begin expedition | Required before selecting/starting route |
| `world_event_recorded` | Existing Dynamic Layer event is appended | Event ID/type/summary/tags/region | Retrieve or quote the event with source attribution | Promote a dynamic event into Canon or assert causation not recorded | Required before acting on the event |

#### Output envelope and separation rules

**PROPOSAL — CENTRAL DECISION REQUIRED**
- Observation envelope: `observationId`, `eventId/sourceRefs[]`, `trigger`, `title`, `body`, `tone`, `createdAt`, and optional `inferenceLabel = "possible_connection"`.
- Every factual clause must point to a source event, memory, quest result or authored content ID. A possible connection must be labelled as a hypothesis and list the evidence it joins.
- The observation pipeline is read-only. It may append an observation/message to the player's observation history only through the approved observation write path; it may not call gameplay mutation functions.
- Gameplay mutation is a separate player-initiated command with its own precondition checks, confirmation and result. The Eye cannot call or synthesize that command.
- The Eye may observe, retrieve, quote and suggest a source-grounded possible connection. It may not solve Maela's puzzle, initiate Siven's expedition, choose a route or reward, change quest state, create Canon, mutate inventory/stats/NPC state, or autonomously modify world state.
- Missing source evidence means “not known / no recorded observation”; it must never be filled with generated lore.
- An AI-generated sentence is not itself a Dynamic Layer fact. Only an approved gameplay resolver may record a world-state event.

### 12.5 Cross-district dependency matrix

| Producer / owner | Consumer | Existing alpha.26 connection | Required contract / gap | Status |
|---|---|---|---|---|
| Jarek — Gate City | Siven — Old Edge | `fn-jarek` map service costs 20 gold; `fn-siven` ruins service costs 40 gold (`content.ts:468-469,481`) | One stable route ID and one shared route-discovery record; Jarek reveals authored routes, Siven consumes unlocked route IDs | **CENTRAL DECISION REQUIRED**; neither persistent route unlock nor expedition state is implemented |
| Borin/Garran — Workshop | Eldra — Old Edge | `fn-garran` forge; `fn-eldra` alchemy (`content.ts:462-464`); shared `InventoryItem` and item definitions | Any future alchemy material contract must use the one shared item inventory/instance model; no duplicate material registry; recipe inputs/outputs must be centrally defined | **CENTRAL DECISION REQUIRED** for alchemy recipe contract |
| Nara — Workshop | Eldra — Old Edge | `fn-nara` leatherwork; current generic handler shares the workshop craft/dismantle path only by kind (`content.ts:469-470`, `store.ts:648+`) | Do not assume Nara currently produces alchemy ingredients. Any cross-profession ingredient must be authored and balanced in shared item/economy content | **PROPOSAL / NOT IMPLEMENTED** |
| Tomen — Workshop | Eldra — Old Edge | `fn-tomen` apprentice service, 15 gold (`content.ts:469-470`) | No current alchemy mastery progression contract; Tomen must not grant a district-local alchemy level or bypass Eldra recipe unlocks | **CENTRAL DECISION REQUIRED** if shared mastery is introduced |
| Jarek — Gate City | Maela — Old Edge | Route/map service is authored; no current well-discovery dependency in source | If the well site is ever represented as a route/discovery node, it must use the same map/discovery contract and not a separate route graph | **PROPOSAL** |
| Damar — Gate City | Siven — Old Edge | `fn-damar` is a warehouse/official cargo inspection service (`content.ts:425`); no expedition cargo/loadout contract exists | Any cargo inspection must read the same item instance refs and protected-item rules; no second inventory or silent removal | **CENTRAL DECISION REQUIRED** |
| Maela — Old Edge | The Eye / narrative layer | Existing `dynamic.flags`, `dynamic.events`, `worldMemories` are available (`narrative.ts:35-49,749-800`) | One player-specific discovery marker plus source event; no parallel quest/relic system | **CENTRAL DECISION REQUIRED** |

### 12.6 Central decision register — additions

| ID | Decision | Why required | Affected surface | Safe interim rule |
|---|---|---|---|---|
| OE-ALC-01 | Does Eldra gain a true recipe engine or remain a vendor? | No recipe/input consumption exists in alpha.26 | `content.ts`, `store.ts`, item/economy contract | Keep existing vendor behavior; do not claim ingredients are consumed |
| OE-ALC-02 | Canonical rune infusion duration: 30 or 60 minutes | Content/UI/message disagree with runtime | item definition, store, UI, tests | Record mismatch; do not silently choose |
| OE-ALC-03 | Alchemy transaction/idempotency and authority | Repeated purchase has no operation-level duplicate guard; client store only | shared action protocol, persistence, server boundary | No new craft/session until approved |
| OE-EXP-01 | Expedition aggregate, save migration and authoritative resolver | No expedition state exists | shared save schema, Siven, Jarek, Damar, reward economy | Keep Siven generic service; do not claim expedition progress is saved |
| OE-EXP-02 | Shared route IDs and discovery ownership | Jarek map and Siven route must reference the same routes | Gate City + Old Edge map contracts | No separate Siven route graph |
| OE-EXP-03 | Loadout escrow vs reference-only model | Prevent quest item loss and duplication | item instances, inventory, expedition settlement | Default reject protected items; never remove quest items |
| OE-MAE-01 | Discovery flag key/value semantics and one-time settlement | No well puzzle/discovery state exists | narrative dynamic flags/events, Maela, save | No reward until resolver and idempotency are approved |
| OE-MAE-02 | `silentWellVial` tradeability/source policy | Current item is market-eligible and appears at Niven and in regional pool | item definition, market, Maela, Niven | Preserve current distribution until central item decision |
| OE-EYE-01 | Observation envelope, source refs and write separation | Existing Eye helpers are simple authored messages; new event types are not a generic event bus | eye.ts, narrative.ts, UI/AI boundary | Eye remains read-only and source-attributed |

### 12.7 Targeted test plan (specification only — not executed)

**Eldra**
1. Verify each of the four `fn-eldra.itemIds` can be selected and only the configured ID can be purchased.
2. Insufficient gold leaves gold and inventory unchanged.
3. Full inventory rejects purchase without gold debit.
4. Repeated purchase demonstrates current behavior and must not be mistaken for idempotency.
5. Use tonic consumes exactly the selected inventory instance.
6. Second tonic replaces the same buff ID rather than adding another stack.
7. Tonic reload before expiry preserves remaining absolute expiry; reload after expiry removes it.
8. Infusion rejects an item not currently equipped.
9. Infusion rejects when no `runeInfusion` exists.
10. Active infusion blocks only the same equipped instance.
11. Active infusion on another equipped instance does not block the selected instance.
12. Expired infusion allows reapplication.
13. Verify the actual 30-minute expiry against the one-hour UI/content/message discrepancy.
14. Verify no alchemy material is consumed by the current runtime.

**Siven**
1. No expedition state is falsely reported as persisted in current alpha.26.
2. Departure validates route ID, access, fee and all item instance refs.
3. Duplicate departure confirmation cannot debit the fee twice.
4. Reload mid-stage restores the exact committed stage after future implementation.
5. Invalid/tampered route ID is rejected.
6. Quest/evidence item is rejected from loadout by default.
7. Retreat preserves all protected items.
8. Trap failure cannot remove quest/evidence items.
9. Repeated stage action cannot advance twice.
10. Reward settlement can occur once per expedition ID.
11. Full inventory leaves reward unclaimed and retryable.
12. Jarek's route unlock and Siven's route selection resolve the same stable route ID.

**Maela / The Eye**
1. Current Maela interaction is verified as generic vial service, not puzzle completion.
2. Discovery marker absent → partial → solved follows only approved transitions.
3. Partial puzzle answer grants no final reward.
4. Solved discovery cannot grant the reward again after reload.
5. Maela and Niven vial purchases remain governed by the approved item distribution decision.
6. Main quest status for all 60 entries remains unchanged.
7. Eye observation is emitted only after a committed source event.
8. Eye output includes source refs for factual claims.
9. Eye cannot submit puzzle answers or reveal the solution before completion.
10. Eye cannot select a route, launch expedition or claim rewards.
11. AI output without source evidence is omitted or explicitly marked unknown.
12. A Dynamic Layer event never changes Canon or becomes a main quest result.

**Execution status:** no tests were run in this documentation-only pass. The cases above are proposed acceptance tests, not reported passes.

### 12.8 Targeted gap closure completion

- Eldra runtime/buff/save/UI/instance/expiry/stack/input-consumption behavior: **SOURCE VERIFIED**; recipe engine is absent; rune expiry inconsistency recorded.
- Siven expedition state contract: **PROPOSED**; all new state and route contracts remain **CENTRAL DECISION REQUIRED**.
- Maela discovery contract: **PROPOSED**; existing Dynamic Layer is the only candidate shared container; new puzzle/discovery semantics remain **CENTRAL DECISION REQUIRED**.
- The Eye event contract: **PROPOSED**; read-only/source-attributed boundary retained.
- Jarek / Workshop cross-district matrix: **DOCUMENTED**; no cross-district runtime integration claimed.
- Source code changes: **NONE**.
- Canon / main quest changes: **NONE**.
- Merge: **NONE**.
- Branch changes outside this document: **NONE**.
