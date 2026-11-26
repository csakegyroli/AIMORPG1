# Őrségi Negyed — PHASE 1 NPC gameplay specification

**Status:** PHASE 1 / STAGE 2 — SPECIFICATION IN PROGRESS  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Baseline branch:** main  
**District branch:** `watch-district/phase-1-specification`  
**Related GitHub issue:** #7  
**Scope NPCs:** Rovan (rovan), Lena (lena), Bran (bran), Orren (orren)  

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

District identity and priority: **bizonyítékgyűjtés, nyomozás, dokumentumhitelesítés, vallomások, járőrözés**.

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


## 10. Központi tervezési pass — Őrségi Negyed (v0.2)

**Státusz:** mind a négy NPC **IN PROGRESS**. A rendszer opcionális eseteket oldhat meg, a 60 main questet, azok sorrendjét, eredményét és Canon szereplőit nem módosíthatja.

### Rovan — hivatalos nyomozás
**Forrás:** `fn-rovan`, kind `security`; NPC Canon: városi őrkapitány, az eltűnt adószállítmány ügye foglalkoztatja.
**Loop:** opcionális case kiválasztása → bizonyítékok áttekintése → hipotézis felállítása → bizonyítékok összekapcsolása → jelentés → ügy lezárása / további vizsgálat.
**Bizonyítéklánc:** minden evidence record mezői: evidenceId, sourceId, acquiredAtWorldTime, custodyOwner, sealStatus, linkedCaseId. Ezek **PROPOSED shared evidence contract**, central decision required. Bizonyíték eredet nélkül nem használható hiteles bizonyítékként.
**Döntések:** formális út (csak hitelesített iratok); tanúvallomás út (két egymástól független forrás); tárgyi út (Damar raktárjegyzék + Vera vizsgálat). A játékos legalább két külön típusú bizonyítékot kapcsoljon össze.
**Siker:** legalább 2 független evidence source, nincs custody break, a következtetés megfelel az authored case key-nek. Részleges: jó következtetés, de egy bizonyíték lánca hiányos → további nyom kérhető. Kudarc: ellentmondó vagy manipulált bizonyíték alapján vád → ügy nem zárul, relationship −1, a bizonyíték nem semmisül meg.
**Jutalom:** csak egyszeri optional case XP / access flag; nincs pénzbírság vagy új item, amely main questet módosít. Tesztek: custody intact; broken seal; duplicate source; false testimony; two independent sources; one source repeated; wrong conclusion; partial; reload; duplicate report; main quest immutable; evidence cannot be sold.

### Lena Varr — dokumentumhitelesítés
**Forrás:** `fn-lena`, kind `documents`, 20 gold; hiteles másolat és városi bejegyzés.
**Loop:** irat kiválasztása → kiállító/pecsét/dátum összevetése → hiteles másolat vagy eltérésjegyzék kérése → dokumentum státusz.
**Mechanika:** 3 ellenőrző mező: issuer, seal, registryEntry. 3/3 egyezés = authenticated; 2/3 = provisional copy, csak leadként használható; 0–1 = rejected. Lena nem gyárt hamis pecsétet és nem tesz hitelessé egy ismeretlen eredetű tárgyat.
**Költség:** 20 gold csak hiteles másolatnál; elutasított ellenőrzés ingyenes. A másolat nem új jogot ad, csak az eredeti irat állapotát tükrözi. **SHARED DEPENDENCY:** document/evidence instance schema.
**Teszt:** 3/3, 2/3, 1/3, wrong issuer, forged seal, duplicate copy, no source doc, cost only on success, reload, no quest flag overwrite.

### Bran — fogdai nyilvántartás és kihallgatási hozzáférés
**Forrás:** `fn-bran`, kind `jail`; fogdaőr, hivatalos információ csak jogosultsággal.
**Loop:** ügyhivatkozás → hozzáférési jog bemutatása → nyilvántartás kiválasztása → kérdés (jelenlét / időpont / átadás) → anonimizált vagy hitelesített válasz.
**Szabály:** Bran nem adhat ki olyan információt, amely nincs authored case-ben engedélyezve. Három kérdés/ügy; minden kérdés külön clueId; ismétlés nem ad új clue-t. Megfélemlítés vagy fizetség nem írhatja felül a jogi hozzáférést.
**Következmény:** szabályos lekérdezés +1 Bran bizalom; jogtalan nyomás −2. Jutalom információ/flag, nem gold.
**Teszt:** no access; valid warrant; three question cap; duplicate clue; unauthorized coercion; reload; invalid case; no protected NPC secret; source reference preserved.

### Orren — járőrözés és helyszíni jelentés
**Forrás:** `fn-orren`, kind `guardPatrol`; járőrparancsnok, útvonal- és biztonsági információ.
**Loop:** patrol board → 3 útvonal összevetése → választás (rövid / biztonságos / bizonyítékra fókuszáló) → 2 állomásos járőr → eseményjelentés.
**Szabály:** mindkét állomáson egy megfigyelési választás; perception/survival stat ≥7 esetén egy extra részlet látható, de a helyes megoldást nem adja meg. 2 helyes megfigyelés = teljes siker; 1 = részleges; 0 = kudarc. Nincs random encounter és nincs kötelező időzár.
**Jutalom:** teljes siker új optional patrol report flag és központi XP egyszer; részleges clue, XP nélkül; ismétlés csak gyakorló szöveg. Nincs loot farm.
**Teszt:** all routes; stat 6/7 boundary; 2/2; 1/2; 0/2; duplicate report; reload mid-patrol; route unavailable; no forced wait; no main quest mutation; no repeated XP.


## 11. Alpha.26 runtime verification — central review

**Verified source:** `src/lib/content.ts` blob `27206c65e37c5cc3b47d0257d91b1654f8971b95`; `src/lib/store.ts` blob `60fc472f8eeefd940aa25e226e3a1aa3a20b1aba`.

Verified functions: `fn-rovan/security`, `fn-lena/documents` (20 gold), `fn-bran/jail`, `fn-orren/guardPatrol`. These kinds are currently grouped into the generic service/item branch in the client store; a complete evidence chain, document authenticity verifier, jail record access or patrol route resolver was not confirmed by this check. No source evidence permits modifying the 60-node main quest.

**Required follow-up:** inspect exact case/quest flags and document items; ensure evidence records do not expose protected story data; add immutable-main-quest regression cases. All four NPCs remain IN PROGRESS.