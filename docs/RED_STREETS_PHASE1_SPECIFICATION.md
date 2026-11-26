# Vörös Utcák — PHASE 1 NPC gameplay specification

**Status:** PHASE 1 / STAGE 2 — SPECIFICATION IN PROGRESS  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Baseline branch:** main  
**District branch:** `red-streets/phase-1-specification`  
**Related GitHub issue:** #6  
**Scope NPCs:** Miri, Havel, Brenka, Silas, Tosk  

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

District identity and priority: **stratégiai kártyajáték, információs hálózat, fogadások, kapcsolatok, titkos hozzáférés**.

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


## 10. Központi tervezési pass — Vörös Utcák (v0.2)

**Státusz:** mind az öt NPC **IN PROGRESS**. Minden tét pénzkezelése, nagy értékű kimenetele és mentett meccsállapota **CENTRAL DECISION REQUIRED**, mert a jelenlegi store kliensoldali.

### Havel — eredeti stratégiai kártyajáték: „Három Kapu”
**Forrás:** NPC Canon: fogadós és kártyaklub-házigazda, Vörös Lámpás Fogadó; `fn-havel`, kind `gamble`, 35 gold belépő. A jelenlegi generikus gamble handler nem tekinthető a játék szabályrendszerének.
**Játék célja:** a játékos és Havel három fordulón át három „kapu” közül választ; a cél a legmagasabb összesített taktikai pontszám, nem a véletlen lapérték.
**Pakli:** 12 egyedi akciólap, négy család, családonként három lap: Olvasás (Előrejelzés, Kivárás, Visszakérdezés), Nyomás (Blöff, Szorítás, Kockáztatás), Védekezés (Őrzés, Elterelés, Visszalépés), Fordítás (Csere, Tükör, Megakasztás). Minden körben a játékos 3 lapot kap, Havel 3 lapot tart nyíltan látható „stílus” jelzéssel, de pontos lapját nem.
**Kör:** (1) játékos titokban kiválaszt egy lapot; (2) Havel determinisztikus AI-policy választ az előző játékosi lépések és a nyílt stílus alapján; (3) mindkét lap felfedése; (4) interakciós táblázat alapján pontozás; (5) eldobott lap pótlása a saját 12-es pakliból; (6) három kör után összegzés. A pakli sorrendjét a meccs session seedje rögzíti, nem kliensoldali újrarandomizálás.
**Pontozás:** minden lap alappontja 1. Taktikai matchup: Olvasás legyőzi Nyomást (+2); Nyomás legyőzi Védekezést (+2); Védekezés legyőzi Fordítást (+2); Fordítás legyőzi Olvasást (+2). Azonos család: nincs bónusz. A családi kör egyenrangú, ezért a döntetlenekben a játékos által választott „tét nélküli fókusz” (Olvasás/Erő/Védelem) ad +1, ha az adott lap családjával egyezik. Havel azonos szabály szerint játszik.
**Speciális lapok:** Előrejelzés: ha a következő Havel-lap családját helyesen tippeli a játékos, +1; Kivárás: matchup bónuszt nulláz, de döntetlenben +1; Blöff: Nyomásként számít, de ha Havel Fordítást játszik, −1; Őrzés: Nyomás bónusz ellen immunis; Csere: a játékos és Havel családját megfordítja a matchuphoz; Tükör: az előző forduló Havel-lap családját másolja; Visszalépés: a kör döntetlen és mindkét fél 0 pontot kap; Megakasztás: Havel következő körében a matchup bónusz −1. A többi lap családja szerinti alap szabályt követi. **Ezek a speciális szabályok local design proposal-k**, Havel canonhoz nem nyúlnak.
**Eredmény:** 3 kör után 2+ pont különbség = győzelem; 0–1 pont különbség = döntetlen; negatív különbség = vereség. Győzelem: klubjelző/relationship event és előre meghatározott, maximum 1.2× belépődíj értékű jutalom; döntetlen: belépődíj vissza, jutalom nincs; vereség: 35 gold elveszik. **CENTRAL DECISION REQUIRED:** pénznyeremény, maximum stake és kliensoldali manipuláció miatt első fázisban csak tét nélküli practice mode javasolt.
**Döntések:** practice vagy pénzes meccs; kezdő fókusz; minden körben lapválasztás; meccs előtt kilépés. Meccs indulása után nincs visszatérítés, de a session állapot folytatható.
**UI:** lapok képpel és szöveges szabállyal, keyboard fókusz, mobil tap target, választás lock, reveal animáció, forduló pontszám, meccs history. Reduced motion opció. Kártyahatás szövegesen is.
**Exploit/test:** seed session-bound; reload ugyanazt a lapot mutatja; duplicate submit idempotens; stake levonása csak meccs nyitásakor; no second reward; tampered card ID rejected. Legalább tesztek: 4 matchup irány; azonos család; fókusz bónusz; 6 speciális lap; három kör; win/draw/loss; disconnect/reload; duplicate; invalid card; practice no currency; stake bounds; reward cap.

### Miri — utcai hírszerzés
**Forrás:** `fn-miri`, kind `rumor`; hírvivő, Keskeny Udvar, 16–2 óra.
**Loop:** témakör választása → Miri forrásának megbízhatósága → információ megvásárlása vagy ingyenes általános pletyka → a játékos eldönti, keresztellenőrzi-e Vera/Cador/Rovan irányában. Minden lead egyedi leadId-t kap; ismételt kérés csak már ismert szöveget ad, új jutalmat nem.
**Minőség:** forrásminőség 0–2 authored szint; 0 = rumor, 1 = corroborated, 2 = verified. Egy másik NPC dokumentuma vagy független forrás emelheti, nem a játékos ismételt kattintása. Költség 10/20/30 gold a minőség szerint (javaslat).
**Kapcsolat:** Miri bizalma +1 ha a játékos visszajelez a forrás veszélyeztetése nélkül; −1 ha kiadja a forrást. Tesztek: duplicate lead, false rumor, corroboration, source privacy, reload, no quest leak.

### Brenka — fogadási vonal
**Forrás:** `fn-brenka`, kind `odds`, 25 gold díj; a korábbi audit szerint a store generic gamble handler `Math.random()<0.45`-öt használ, ez nem elfogadható odds-modell.
**Loop:** esemény kiválasztása → odds és implied probability megtekintése → stake és maximum payout preview → confirm → single settlement. Minden event odds authored, nem manipulálható játékosoldali random.
**Szabály:** implied probability = 1/decimalOdds. Payout = floor(stake×decimalOdds); nettó eredmény payout−stake. Javasolt decimal odds 1.5–3.0; max stake 100 gold; eventenként egy fogadás; event lezárás után nincs új fogadás. A fogadás expected value-ját a central economy owner hagyja jóvá; nincs biztos profit.
**Kockázat:** kliensoldali store miatt pénzes fogadás **BLOCKED** szerver-authoritative settlementig. Addig csak odds-olvasó és practice calculator.
**Teszt:** odds boundary; max stake; duplicate bet; event closed; payout rounding; negative stake; insufficient gold; reload; altered odds; no random 0.45; one bet/event; no payout twice.

### Silas — utcai közvetítő
**Forrás:** `fn-silas`, kind `information`, 30 gold; kapcsolatot közvetít, bizalom vagy arany szükséges.
**Loop:** cél/kapcsolattípus megadása → előfeltétel ellenőrzése → közvetítői díj preview → kapcsolatfelvétel → intro flag vagy elutasítás. Három út: fizetett közvetítés (30 gold), bizalmi ajánlás (relationship threshold 6, nincs díj), saját nyom felmutatása (releváns lead/document, díj nélkül).
**Siker:** csak olyan NPC-hez adhat bevezetést, aki már létezik a Canonban és hozzáférhető. Részleges: intro csak egyszeri párbeszédet ad; teljes: intro + optional service unlock. Fail: pénz nem vonható le, ha nincs érvényes cél vagy feltétel.
**Exploit:** intro flag once per target; nem váltható goldra; nem írhat felül zárt district access. Tesztek: all three routes, trust boundary, missing target, duplicate intro, insufficient funds, reload, locked target, consumed lead, no new currency.

### Tosk — éjszakai beléptetés
**Forrás:** `fn-tosk`, kind `doorGuard`, 20 gold; zárt helyek beléptetése.
**Loop:** célajtó megtekintése → jogosultság (credential/intro/relationship) ellenőrzése → kérés → beengedés / feltételes beengedés / elutasítás. 20 gold csak akkor fizetendő, ha a kapu díjköteles és az access flag nem áll fenn.
**Szabály:** a gold nem vásárolhat quest/Canon tiltást felülíró hozzáférést. Siker = valid flag; partial = időben korlátozott, authored visit flag; failure = elutasítás, díj nélkül. A Tosk által adott belépő nem lehet átruházható item.
**Teszt:** no credential; valid intro; fee; duplicate access; locked story gate; reload; expired visit; invalid target; payment rollback; no tradable access token.
