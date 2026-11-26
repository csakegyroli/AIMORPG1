# Kapuváros — PHASE 1 NPC gameplay specification

**Status:** PHASE 1 / STAGE 2 — SPECIFICATION IN PROGRESS  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Baseline branch:** main  
**District branch:** `gate-city/phase-1-specification`  
**Related GitHub issue:** #3  
**Scope NPCs:** Damar, Alma Varg, Petar, Vera Noll, Jarek  

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

District identity and priority: **logisztika, szállítás, raktár, térképezés**.

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


## 10. Központi tervezési pass — NPC-szintű konkrét játékmenet (v0.2)

**Állapot:** mind az öt NPC **IN PROGRESS**. Az alábbi számértékek LOCAL PROPOSAL-k, balansz-jóváhagyásra várnak; nem meglévő runtime-funkciók.

### Damar — Raktári árumozgás
**Forrásállapot:** `NPC_FUNCTIONS: fn-damar`, kind `warehouse`; NPC Canon: raktárőr a Rakparti mérlegházban. A jelenlegi függvény leírása jogosultsághoz kötött raktári árumozgást ígér, nem bizonyít teljes készletkezelő minijátékot.
**Játékosciklus:** Damar → „Raktári ellenőrzés” → játékos kiválaszt egy aktív szállítmányt/átvételi megbízást → ellenőrzi a plombát, a tételszámot és a mérlegelt mennyiséget → egyeztet vagy eltérést jelent → kap egy hitelesített raktári eseményt.
**Döntések:** gyors vizsgálat (1 ellenőrzési pont, nincs fogyóeszköz); teljes audit (3 ellenőrzési pont, több adat); vitatott tétel zárolása (nem vihető tovább, de megőrzi a bizonyítékot); hibás adat elfogadása (gyors továbbhaladás, későbbi bizalmi kockázat).
**Szabály:** minden fuvarhoz 3 adatmező tartozik: seal, manifestCount, measuredCount. Egyező seal + azonos mennyiség = siker. Egyetlen eltérés = részleges siker, ha a játékos zárolja és jegyzőkönyvezi; ha átveszi, kudarc és későbbi Cador/Rovan ügyjelző. Két vagy több eltérés = teljes kudarc, a rakomány nem írható jóvá. Nincs random dobás.
**Erőforrás/gazdaság:** a raktári szolgáltatás alapdíja 5 gold / tétel csak akkor, ha a játékos önként teljes auditot kér; nincs jutalom pusztán az ellenőrzésért. Sikeres szerződés jutalmát a szerződés adja, Damar nem generálhat végtelen goldot vagy árut.
**Kapcsolat/fejlődés:** dokumentált, helyes eltérésjelentés +1 Damar-bizalom (javasolt cap 10); hamis vagy gondatlan átvétel −2. A logistics stat ellenőrzési küszöböt csökkenthet: 5–7 = 1 mező ingyenes előzetes megtekintése, 8+ = mindhárom mező teljes audit előtt látható. Új globális mastery nincs.
**UI/állapot:** shipmentId → draft inspection → submitted → accepted / disputed / rejected; az eredményhez seal/count diff és reason code tartozik. Megszakítás a submit előtt ingyenes; utána ugyanaz az inspectionId nem küldhető be újra.
**Exploit/test:** reload és duplakatt nem adhat második jutalmat; manipulált manifestId, negatív mennyiség, már lezárt fuvar, idegen szállítmány mind elutasítandó. Tesztek: exact match; seal mismatch; count mismatch; 2+ discrepancy; dispute locks cargo; accept mismatch triggers flag; cancel before submit; duplicate submit; reload after submit; unauthorized shipment; missing shipment; no gold reward for inspection-only.

### Alma Varg — Fogadó és szállás
**Forrásállapot:** `fn-alma`, kind `inn`; jelenlegi leírás: 60 goldért egy óra alvás a max HP 10%-át tölti vissza; étel is kapható (`heartyStew`, `gateRations`). Ezt a már létező szabályt nem írjuk felül.
**Loop/döntés:** szoba kiválasztása → ár és várható gyógyulás előnézete → fizetés és pihenés; alternatíva az ételvásárlás, illetve távozás. Nincs kötelező időzár vagy offline várakozás.
**Feloldás és eredmény:** 60 gold, csak ha HP hiányzik; heal = min(hiányzó HP, floor(maxHP×0.10)). Ha teljes HP-n van a játékos, a pihenés nem vonhat le pénzt. Az étel az item saját effect mezőjét használja; a leírt `heartyStew` 20% gyógyítást ad.
**Kapcsolat:** tisztességes fizetés és visszatérő látogatás csak narratív relationship eventet indíthat, nem adhat automatikus statot. **SHARED DEPENDENCY:** világóra (12 real hours = 1 in-game day), HP, item effect, tranzakció.
**UI/mentés/teszt:** ár/gyógyulás előnézet; confirm/cancel; tranzakció egyszeri. Tesztek: exact 10% heal; HP cap; full HP no charge; insufficient gold; stew effect; double click; reload; cancel; item stock; save round-trip. Alma: **IN PROGRESS**, mert a jelenlegi runtime és a szállás-állapot pontos save hatása még ellenőrzendő.

### Petar — Személyes fuvar
**Forrásállapot:** `fn-petar`, kind `transport`, 25 gold alapköltség. A leírás csomag/személy/tárgy városon belüli mozgatását ígéri.
**Loop:** célpont kiválasztása a már feloldott városi helyszínekből → fuvar típus (személy/csomag/tárgy) → kapacitás és díj előnézete → elfogadás → célállomásra érkezés és kézbesítési bizonylat.
**Döntések:** normál út (25 gold, alapidő); óvatos út (35 gold, alacsonyabb eseménykockázat); saját gyaloglás (ingyenes, nincs Petar szolgáltatás). Javasolt fuvar-kapacitás 1 küldemény / fuvar, quest item nem adható fel, ha a quest nem engedi.
**Feloldás/siker:** mindkét végpontnak elérhetőnek kell lennie. A normál fuvar akkor sikeres, ha a célpont feloldott és az item továbbra is a játékos tulajdona. Nincs random elvesztés; a kockázat csak előre jelzett, authored route flagből jöhet. Sikertelen célvalidáció esetén díj nem vonható le.
**Gazdaság:** 25/35 gold sink; kézbesítési jutalom kizárólag megbízásból. **CENTRAL DECISION REQUIRED:** tárgy-instance custody átadás és world travel state.
**Állapot/teszt:** quoted → confirmed → inTransit → delivered / cancelled / failed; tranzakcióazonosító, nincs duplikált cargo. Tesztek: locked endpoint; insufficient funds; ownership changed; quest item; duplicate request; reload inTransit; deliver once; route flag; cancel pre-confirm; cancel after departure; no free teleport bypass.

### Vera Noll — Érmevizsgálat
**Forrásállapot:** `fn-vera`, kind `currency`; a leírás eredet/megbízhatóság vizsgálatát ígéri. Nem hozhat létre új pénznemet és nem írhatja át a Black Coin Canonját.
**Loop:** játékos kiválaszt egy coin/document instance-t → Vera megmutatja a vizsgálható jegyeket → a játékos kiválasztja a két összevetendő jellemzőt → eredmény: egyező / gyanús / nem elegendő adat.
**Szabály:** csak authored item metadata (origin, legalStatus, tags, quest/evidence flag) használható. Ha a játékos mindkét ellenőrzött jellemzőt helyesen választja, siker; egy helyes = részleges, további vizsgálatot kérhet; nulla helyes = sikertelen vizsgálat, de a tárgy nem semmisül meg. Nincs valódi coin item nélkül.
**Költség/jutalom:** első alapvizsgálat ingyenes; hitelesített szakvélemény 10 gold (javaslat), de csak ha van vizsgálható instance. Nincs coin vagy gold reward. Appraisal 8+ esetén a lehetséges jegyek előre megjelennek, nem az eredmény.
**Kapcsolat/függőség:** hiteles jelentés segíti Cador könyvelését és Rovan ügyét; hamis vád −2 bizalom. **CENTRAL DECISION REQUIRED:** evidence object és Black Coin story protection.
**Teszt:** legal coin; restricted coin; evidence coin; no item; forged metadata; repeat same instance; no false Black Coin reveal; reload; duplicate report; correct/partial/failed selection; no item mutation.

### Jarek — Térképműhely
**Forrásállapot:** `fn-jarek`, kind `map`, 20 gold. A leírás térképfelfrissítést és rövidítések bemutatását ígéri.
**Loop:** elérhető útvonalak áttekintése → játékos kiválaszt egy még nem ismert útvonalat → Jarek megmutatja a térkép hiányzó szakaszait → 20 goldért jegyzetelt térképlap / vagy ingyenes meglévő útvonal-olvasás → discovery flag.
**Mechanika:** útvonal csak akkor nyílik meg, ha mindkét végpont Canon szerint elérhető. A térkép három információt mutat: távolságkategória, ismert akadály, szükséges hozzáférés. A játékos által még fel nem fedezett veszélyt nem fedi fel automatikusan.
**Jutalom:** nincs XP pusztán vásárlásért; új útvonal felfedezése egyszeri exploration XP-t kaphat a központi jutalomrendszeren keresztül. 20 gold sink. **SHARED DEPENDENCY:** discovery flags, map item, navigation stat, world routing.
**Teszt:** már ismert útvonal; locked endpoint; 20 gold; insufficient funds; repeat purchase; no duplicate discovery XP; hidden danger remains hidden; reload; map item consumed/retained per approved contract; invalid route; cancel.
