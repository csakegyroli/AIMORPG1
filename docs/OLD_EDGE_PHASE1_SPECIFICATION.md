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