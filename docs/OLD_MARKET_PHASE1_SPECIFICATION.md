# Régi Piac — PHASE 1 NPC gameplay specification

**Status:** PHASE 1 / STAGE 2 — SPECIFICATION IN PROGRESS  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Baseline branch:** main  
**District branch:** `old-market/phase-1-specification`  
**Related GitHub issue:** #5  
**Scope NPCs:** Zora Fűszeres, Cador, Pell; Ilren csak központi döntés után  

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

District identity and priority: **kereskedelem, minőségfelismerés, tárgykombinációk, alkudozás, könyvelés, alapanyag-gazdaság**.

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


## 10. Központi tervezési pass — három piaci NPC (v0.2)

**Státusz:** Zora, Cador, Pell: **IN PROGRESS**. Ilren nem része a kiosztott specifikációnak, besorolása változatlanul **CENTRAL DECISION REQUIRED**.

### Zora Fűszeres — fűszerkeverék és minőségismeret
**Forrás:** `fn-zora`, kind `spiceTrade`, 18 gold alapdíj; régiós fűszerkeveréket kínál. A pontos item outputok és recipe inputok forrásban ellenőrzendők.
**Loop:** cél kiválasztása (étel / főzet / kereskedelmi keverék) → recept és allergén/hatás előnézet → összetevők minőség szerinti vizsgálata → keverési sorrend kiválasztása → elkészítés vagy vásárlás.
**Minijáték:** 3 összetevő, 3 hozzáadási fázis. A recept megadja a helyes sorrendet és két kompatibilis alternatívát. Minden fázisban a játékos kiválaszt egy még fel nem használt összetevőt. Mindhárom helyes sorrendben = siker; két helyes pozíció = részleges minőség; 0–1 = hibás keverék, de nem kap új itemet. Nincs random; az alacsony minőségű input csökkenti az eredmény minőségi osztályát.
**Erőforrás:** recipe által meghatározott ingredient item/count, 18 gold szolgáltatási díj; output csak előre jóváhagyott ItemDefinition lehet. Nincs helyi rarity/quality tier; minőségi eredmény csak központilag jóváhagyott tag vagy recipe variant lehet.
**Kapcsolat/progression:** appraisal/alchemy stat ≥7 esetén a játékos előre láthatja egy összetevő eredetét; ≥9 esetén mindháromét. Zora bizalma a hibás keverék okának őszinte elfogadásával +1, receptszándék elhallgatásával −1. Mastery központi.
**Teszt:** sorrend 6 permutációja; 3/3; 2/3; 1/3; hiányzó ingredient; item instance duplikáció; repeat output cap; insufficient gold; reload; invalid recipe; no new rarity; output item whitelist.

### Cador — pénzügyi vizsgálat és könyvelési egyeztetés
**Forrás:** `fn-cador`, kind `ledger`, 25 gold; hivatalos számla/adóslevél/tranzakciós okirat készítése. A meglévő funkció nem bizonyít teljes pénzügyi vizsgálati rendszert.
**Loop:** ügy kiválasztása (szállítmány / piaci ügylet / magánkölcsön) → forrásdokumentumok áttekintése → tranzakciós tételek egyeztetése → eltérés besorolása → hitelesített jegyzőkönyv.
**Minijáték:** három oszlopos ledger (dátum, összeg, partner). A játékos négy sorból kiválasztja az egyetlen olyan sort, amelynél legalább két mező eltér a kapcsolódó bizonylattól. Minden ügy 4 sor; pontos találat = siker, helyes sor + helyes eltéréskategória = teljes siker; helyes sor, rossz kategória = részleges; rossz sor = kudarc. Ügyenként egy beküldés; nincs újragörgetés.
**Költség/jutalom:** 25 gold okiratkészítés; pénzügyi vizsgálat első olvasása ingyenes, hitelesített jegyzőkönyv további 10 gold javaslat. Jutalom nem a talált pénz, hanem a hozzáférés/quest flag és központi XP, ha egy authored case engedi. Soha nem adhat hozzáférést más játékos vagy NPC pénzéhez.
**Kapcsolat:** helyes bizonyítéklánc Cador bizalmát növeli; manipulált könyvelés −2. Kapcsolódik Damar fuvarjegyzékéhez, Vera coin opinionjához, Lena okirataihoz és Rovan opcionális ügyeihez.
**Állapot/teszt:** caseId + documentIds + selectedRow + classification; submitted ügy lezárt. Tesztek: 4 sor/1 anomaly; több eltérés; helyes sor rossz kategória; rossz sor; duplikált dokumentum; forged seal; no source docs; duplicate submit; reload; transaction amount zero/negative; no currency mint; evidence chain integrity.

### Pell — élelmiszer- és alapanyaggazdaság
**Forrás:** `fn-pell`, kind `foodTrade`, 14 gold; friss gyümölcs és gyorsan fogyasztható étel, `gateRations` megnevezett item.
**Loop:** napi (világóra szerinti) készlet megtekintése → termék/állapot ellenőrzése → vásárlás vagy beszállítási ajánlat → fogyasztás / későbbi Zora recept input.
**Minőség:** három állapotjelző: friss, érett, romlásközeli; ezek nem új rarityk, hanem NPC-kereskedelmi készletállapotok. A világóra 12 real hours = 1 in-game day; készletváltás csak a közös világóra napi határán történhet. Nincs valós idejű kötelező várakozás.
**Szabály:** Pell készlete fix, authored készletlista; a játékos saját itemet csak akkor adhat el neki, ha sellable és marketEligible. Ajánlati ár = `tradeValue` (ha hiányzik, basePrice) × állapot szorzó (friss 1.0, érett 0.85, romlásközeli 0.5), lefelé kerekítve; a szorzók **LOCAL PROPOSAL**, központi economy approval szükséges. Nincs végtelen NPC buyback.
**Jutalom/kapcsolat:** készletfeltöltés csak előre limitált szerződésből, legfeljebb 3 tétel/contract; nincs végtelen eladás. Pell bizalma +1, ha a játékos nem próbál romlott árut frissként eladni; −2 csalásnál. Zora fűszerreceptjei Pell által árult összetevőket használhatnak.
**Teszt:** stock cap; daily rollover; no forced wait; freshness multiplier; sellable false; quest item blocked; marketEligible false; buyback cap; duplicate sale; reload; no negative price; tradeValue fallback.

### Ilren — központi döntés
**BLOCKED / CENTRAL DECISION REQUIRED:** `NpcId=ilren`, `region=market`, `district=exchangeSquare`, miközben korábbi district assignment más körzethez kötötte. Nem készül NPC-specifikáció és nem módosítjuk a besorolást, amíg a Canon owner nem dönt.


## 11. Alpha.26 runtime verification — central review

**Verified source:** `src/lib/content.ts` blob `27206c65e37c5cc3b47d0257d91b1654f8971b95`; `src/lib/store.ts` blob `60fc472f8eeefd940aa25e226e3a1aa3a20b1aba`.

Verified functions: `fn-zora/spiceTrade` (18 gold), `fn-cador/ledger` (25 gold), `fn-pell/foodTrade` (14 gold, `gateRations`). The store currently routes these kinds through a generic buy/service branch; this is not yet a recipe research, accounting investigation or stock-quality simulation. The NPC master data shows Ilren as `id=ilren`, `region=market`, `district=exchangeSquare`; no assignment change is authorized.

**Required follow-up:** enumerate actual item IDs and prices for Zora/Pell; establish Cador's authored document inputs; Ilren remains excluded pending central owner decision. All three assigned NPCs remain IN PROGRESS.