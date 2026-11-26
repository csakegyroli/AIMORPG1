# Műhelynegyed — PHASE 1 NPC gameplay specification

**Status:** PHASE 1 / STAGE 2 — SPECIFICATION IN PROGRESS  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Baseline branch:** main  
**District branch:** `workshop/phase-1-npc-specification`  
**Related GitHub issue:** #4  
**Scope NPCs:** Borin Vasmarok (garran), Velka (velka), Nara Bőrös (nara), Tomen (tomen)  

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

District identity and priority: **specializált mesterségek, crafting, javítás, +1–+9 tárgyfejlesztés, profession mastery**.

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


## 10. Központi tervezési pass — a négy szakmai NPC konkrét rendszere (v0.2)

**Státusz:** Borin, Velka, Nara, Tomen: **IN PROGRESS**. A meglévő `workshop/phase-1-crafting-specialization` ág 11 commitja külön BRANCH CANDIDATE; nem tekintjük elfogadottnak és nem olvasztjuk be. A javasolt értékek central review-t igényelnek.

### Közös műhely-szerződés
**SHARED ARCHITECTURE DEPENDENCY:** a közös `InventoryItem(instanceId,itemId)` modell marad; recipe input itemId/count szerint fogy, output új instance-t kap. Crafting/dismantling helper létezik (`craftRecipeForItem`, `dismantleYieldsForItem`), de a jelenlegi recept-helper régiófüggő általános receptet ad, nem teljes NPC-specializációt. A műhely NPC-k ugyanazt a recipe/transaction API-t használják; nincs külön műhelypénz vagy item instance.
**CENTRAL DECISION REQUIRED:** durability/repair, +1…+9 enhancement tárolása, sikerkockázat, anyagköltség, mastery interface, save migration és szerver-authoritative művelet.

### Borin Vasmarok (ID: garran) — fegyverkovács
**Forrás:** `fn-garran`, kind `forge`; szétszerelés és fegyver/pajzs/vért/csizma kovácsolás. A branch candidate specialty filtert ad a fegyveres szakág felé.
**Loop:** fegyver kiválasztása → kompatibilitás és recept megtekintése → anyagok ellenőrzése → kovácsolási módszer (biztonságos / precíz) → megerősítés → output és minőségi jegyzőkönyv. Dismantle külön tab, előnézeti yield-del.
**Javasolt szabály:** fegyver recept = a központi helper által visszaadott anyagok + 10 gold munkadíj; nincs helyi recept-override. Biztonságos módszer garantált normál output; precíz módszer +1 extra crafting-quality tag csak akkor, ha smithing ≥8, egyébként normál output és nincs bónusz. Random kimenet nincs.
**+1…+9 javaslat:** minden enhancement szint külön művelet; költség = alapanyagcsomag szintenként (level n: n+1 workshopIron, ceil(n/2) regionális secondary) + gold (20×n). Szint 1–3 garantált, 4–6 success chance 90/80/70%, 7–9 60/50/40%; kudarc nem törli a szintet, de az alapanyag és díj elfogy. Ez csak **CENTRAL DECISION REQUIRED**, nem elfogadott. Biztonságosabb alternatíva: deterministic, no item destruction, növekvő fix költség. Jelenleg item modelben nincs enhancement field, tehát BLOCKED a tényleges implementálhatóság.
**Siker/kudarc:** hiányzó input vagy funds esetén nincs levonás; tranzakciós hiba esetén teljes rollback; a játékos nem vesztheti el az alap tárgyat. Dismantle előnézet után végleges, visszavonhatatlan, de csak explicit confirmmal.
**Kapcsolat/fejlődés:** helyes fegyver-recept teljesítése javasolt 1 craft-practice point; globális smithing stat marad a karakter statja. Profession mastery csak közös döntés után adható.
**UI/teszt:** recipe, input ownership, output, fee, enhancement current→target preview; confirm modal; busy/failed/success states. Tesztek: all weapon slots; insufficient material; wrong region; quest item blocked; dismantle yield; cancel; double submit; reload; level 3/4 boundary; failure retains item; save migration; client tamper.

### Velka — páncélkovács
**Forrás:** `fn-velka`, kind `forge`; páncél szétszerelése/újraillesztése és védelmi felszerelés craftja.
**Loop:** armor/shield kiválasztás → slot és stat ellenőrzés → recept → illesztési próba → kész páncél. Három választható illesztés: könnyű (agility-orientált, meglévő item statot nem írhatja felül), kiegyensúlyozott, megerősített (defense-orientált csak jóváhagyott item definition alapján).
**Szabály:** az output csak létező `ItemDefinition` lehet; Velka nem generálhat új statot dinamikusan. A játékos azonos recipe költséget fizet, 12 gold munkadíj javasolt. Javítás csak durability döntés után specifikálható; jelenleg durability nincs az `InventoryItem` shape-ben.
**Fejlődés:** endurance/defense ≥8 csak alternatív párbeszédet és magasabb szintű recept megtekintést nyithat, nem stat bónuszt. Mastery contract central.
**Teszt:** armor/shield kompatibilitás; fegyver elutasítás; item ownership; recipe shortage; duplicate action; invalid output ID; no dynamic stat injection; repair blocked without durability schema; reload; rollback.

### Nara Bőrös — bőrműves
**Forrás:** `fn-nara`, kind `leatherwork`; kesztyű és csizma készítés, sérült bőrfelszerelés bontása. Branch candidate már használja a meglévő `tannersWax` alapanyagot.
**Loop:** bőrtermék kiválasztása → bőrviasz és fémalkatrész ellenőrzése → szabásminta → varrási út választása → kész termék / dismantle. Két módszer: gyors szabás (alap recipe), takarékos szabás (smithing? nem megfelelő; ezért agility stat check javasolt, nem mastery).
**Szabály:** csak a `craftRecipeForItem` által engedett output; a leather recipe secondary inputja `tannersWax`, mennyiség a receptből. Javasolt 8 gold munkadíj. A takarékos út sikeres agility ≥8 esetén egy secondary inputot megtakarít, sikertelenül normál költség és output; nem lehet negatív input.
**Gazdaság:** nincs új bőr currency; a hiányzó leather-specific material BLOCKED, amíg a content owner nem ad jóváhagyott item ID-t. A tannersWax használata a jelenlegi branch candidate bizonyítéka, de az egész branch nem elfogadott.
**Teszt:** tannersWax count; insufficient wax; non-leather item; no market eligibility for relic; dismantle; cancel; double click; agility threshold 7/8; output uniqueness; reload; rollback.

### Tomen — tanonc és szakmai oktató
**Forrás:** `fn-tomen`, kind `apprentice`, 15 gold; leírás szerint kis kockázatú gyakorlati feladatok.
**Loop:** feladat kiválasztása (anyagfelismerés / receptsorrend / minőségellenőrzés) → szabályok megtekintése → 3 lépéses próba → eredmény és oktatói visszajelzés.
**Minijáték:** három alkatrészt kell helyes sorrendbe rakni egy megadott recepthez. Minden feladat 3 slotból és 3 alkatrészből áll; 3! = 6 lehetséges sorrend. Egy próbálkozásban 3 tipp engedett; minden tipp után a UI megmutatja a pontos helyen lévő alkatrészek számát és a helyes alkatrészek rossz helyen lévő számát. 3/3 pontos hely = siker; 2/3 = részleges; 0–1 = kudarc. Nincs időlimit, nincs random.
**Költség/jutalom:** 15 gold belépő javaslat; siker: 1 practice mark; részleges: 0 mark, ingyenes újratanulási tipp; kudarc: nincs mark, de a díj nem térül vissza. Naponta korlát helyett ismétlési jutalomcsökkenés: ugyanazon feladat első siker ad markot, további siker csak gyakorló visszajelzés, jutalom nélkül. Nincs XP, amíg a központi progression nem engedélyezi.
**Mastery:** practice mark nem külön pénznem; csak ideiglenes specifikációs bizonyíték. **CENTRAL DECISION REQUIRED**, hogy a közös profession mastery trackbe konvertálható-e.
**Teszt:** 6 permutáció; 3/3; 2/3; 0/3; 3 tipp limit; replay reward cap; insufficient gold; duplicate submit; reload mid-task; no XP; correct task unlock; invalid recipe.

## Műhelyszintű elfogadás
A négy NPC külön funkciójú, de ugyanazt az item/recipe/transaction szerződést használja. Durability, repair, +1…+9 és mastery nem tekinthető implementálhatónak a közös adatmodell és save migration központi jóváhagyása nélkül.
