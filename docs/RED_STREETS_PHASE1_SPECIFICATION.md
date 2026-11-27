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


## 11. Alpha.26 runtime verification — central review

**Verified source:** `src/lib/content.ts` blob `27206c65e37c5cc3b47d0257d91b1654f8971b95`; `src/lib/store.ts` blob `60fc472f8eeefd940aa25e226e3a1aa3a20b1aba`.

Verified functions: `fn-havel/gamble` (35 gold), `fn-brenka/odds` (25 gold), `fn-silas/information` (30 gold), `fn-tosk/doorGuard` (20 gold), `fn-miri/rumor`. Store's `gamble/odds` handler debits the cost, uses `Math.random()<0.45`, and on win credits `cost*2`; this is not Havel's authored strategy game and is not acceptable as a final odds contract. Other named kinds are currently routed through a generic service/item purchase branch. The store is client-side, so cash stakes and payouts are blocked pending authority/idempotency design.

**Required follow-up:** define Havel's card interaction as a pure deterministic session resolver; separate Brenka odds from Havel gameplay; do not reuse the generic 45% gamble outcome. All five NPCs remain IN PROGRESS.

---

## 12. TARGETED GAP CLOSURE — Havel és Brenka (v0.3)

**Munkamód:** dokumentáció és forrásellenőrzés kizárólag.  
**Célbranch:** `red-streets/phase-1-specification`  
**Baseline:** alpha.26, a közös architektúra-dokumentum által rögzített kliensoldali store-modell.  
**Státusz:** Havel **BLOCKED — practice-only specification ready**; Brenka **BLOCKED — no monetary settlement**.  
**Jóváhagyás:** az alábbi számszerű értékek és szabályok LOCAL PROPOSAL / CENTRAL DECISION REQUIRED címkével szerepelnek. Nem tekinthetők elfogadott gazdasági vagy szerverarchitekturális döntésnek.

### 12.1. Forrásellenőrzés és változatlan határok

**VERIFY IN SOURCE — alpha.26 `main`:**
- `src/lib/content.ts`: `fn-havel`, NPC `havel`, kind `gamble`, konfigurált költség 35 gold; `fn-brenka`, NPC `brenka`, kind `odds`, konfigurált költség 25 gold.
- `src/lib/store.ts`: a `useNpcFunction` jelenlegi `gamble` és `odds` ága ugyanazt a generikus feloldást használja: `Math.random()<0.45`; siker esetén a költség kétszeresét írja jóvá, vereségnél a költséget vonja le. Ez nem Havel-stratégia és nem odds/settlement modell.
- `src/lib/store.ts`: `SAVE_KEY = "aimorpg-final-demo-v1-29"`, a friss állapot `saveVersion: 6`; a játékállapot kliensoldali React store-ban él.
- A forrásban nem igazolt szerveroldali, hitelesített kártyajáték- vagy fogadási elszámoló végpont. A kliensoldali ellenőrzés nem pénzügyi biztonsági határ.

**Következmény:** a jelen specifikáció csak tét nélküli Havel-practice-t és Brenka odds-előnézetet enged tervezési szinten. Gold levonás, gold jóváírás, nyeremény, relationship/XP jutalom, illetve fogadás elfogadása implementációs és központi jóváhagyási kapu nélkül TILOS. A meglévő 35/25 gold konfiguráció nem alkalmazható automatikusan az új játékmenetre.

---

# A. HAVEL — „HÁROM KAPU” TELJES SZABÁLYRENDSZER

**Besorolás:** LOCAL PROPOSAL a tét nélküli játékszabályra; CENTRAL DECISION REQUIRED minden tartós mentésre, jutalomra vagy pénzes játékra.  
**Alapelv:** teljesen determinisztikus, nyílt szabályú taktikai párbaj. Nincs rejtett RNG, százalékos nyerési esély vagy véletlen kimenet.

### A1. Játékmódok és cél

| Mód | Funkció | Gold / jutalom | Mentés |
|---|---|---|---|
| Practice | A játékos megtanulja és játssza a teljes szabályrendszert Havel ellen | Nincs belépő, tét, payout, XP vagy relationship-delta | Az aktuális próba helyben folytatható; nincs gazdasági hatás |
| Tét nélküli teszt | QA-mód rögzített forgatókönyvvel, kézzel kiválasztott kezdőkezekkel | Nincs | Tesztfixture; nem játékosprogresszió |
| Pénzes játék | Jelen specifikáció nem engedélyezi | Nincs | BLOCKED központi szerveres tranzakciós döntésig |

A meccs célja a három forduló alatt több taktikai pontot szerezni Haveltől. Egy meccs három fordulóból áll. Minden játékosnak három különböző lapja van, minden lap pontosan egyszer játszható ki. A le nem játszott lapok a meccs végén kiesnek.

### A2. Pakli és lapdefiníció

A teljes, kanonikus játékkészlet 12 egyedi lapból áll. A család a lap alapvető matchup-címkéje; a speciális szöveg ezt kizárólag az alábbi A4 prioritási sorrend szerint módosíthatja.

| ID | Lap | Család | Hatás |
|---|---|---|---|
| `havel-read-predict` | Előrejelzés | Olvasás | A kijátszó a felfedés előtt megjelöl egy családot. Ha az ellenfél effektív családja egyezik, +1 saját pont. A tipp nem módosítja a matchupot. |
| `havel-read-wait` | Kivárás | Olvasás | A forduló matchup-bónuszát mindkét félnél 0-ra állítja. Ha a forduló így döntetlen, a Kivárás kijátszója +1 pontot kap. |
| `havel-read-question` | Visszakérdezés | Olvasás | Nincs különleges módosító; az Olvasás család normál matchup-szabályát használja. |
| `havel-pressure-bluff` | Blöff | Nyomás | Nyomásként számít. Ha az ellenfél effektív családja Fordítás, a Blöff kijátszója −1 pontot kap a forduló végén. |
| `havel-pressure-push` | Szorítás | Nyomás | Nincs különleges módosító; a Nyomás család normál matchup-szabályát használja. |
| `havel-pressure-risk` | Kockáztatás | Nyomás | Nincs különleges módosító; a Nyomás család normál matchup-szabályát használja. |
| `havel-defense-guard` | Őrzés | Védekezés | Ha az ellenfél effektív családja Nyomás, a Nyomás család +2 matchup-bónusza 0. Az Őrzés ettől még a normál családja szerint pontozódik. |
| `havel-defense-divert` | Elterelés | Védekezés | Nincs különleges módosító; a Védekezés család normál matchup-szabályát használja. |
| `havel-defense-withdraw` | Visszalépés | Védekezés | Azonnali semleges forduló: mindkét fél 0 pontot kap, nincs matchup-bónusz és más lapmódosító sem ad pontot. |
| `havel-turn-swap` | Csere | Fordítás | A matchup kiszámításához a két lap effektív családját felcseréli. Az eredeti család az előrejelzés és a fókusz ellenőrzéséhez is az effektív, cserélt család. |
| `havel-turn-mirror` | Tükör | Fordítás | A kijátszó effektív családja az előző forduló ellenfél-lapjának effektív családja. Az első fordulóban nincs előzmény, ezért a Tükör saját Fordítás családja marad. |
| `havel-turn-disrupt` | Megakasztás | Fordítás | A következő fordulóban az ellenfél által megszerzett pozitív matchup-bónuszt 1 ponttal csökkenti, minimum 0-ra. Ha nincs következő forduló, nincs további hatása. |

**Lapazonosító-védelem:** kizárólag a fenti 12 stabil ID érvényes. A megjelenített lapnév nem hiteles azonosító. Ismeretlen ID, másik játékos kezéből származó ID vagy már kijátszott lap ID esetén az akció elutasítandó, a forduló és a kéz változatlan marad.

### A3. Kiosztás, információ és nyílt állapot

A practice mód nem használ véletlen keverést. A tesztforgatókönyv egy rögzített `dealIndex` értéket ad meg 0–11 között. A kanonikus laplista A2 sorrendje szerint 0-indexelt. A kiosztás:

1. A listát `dealIndex` pozícióval balra rotáljuk.
2. Az első három lap a játékos kezébe kerül.
3. A következő három lap Havel kezébe kerül.
4. A maradék hat lap ebben a meccsben nem játszható.
5. A játékos és Havel keze a meccs elejétől látható. A már kijátszott lapok külön, nyilvános dobóhalomba kerülnek.

A játékos ismeri:
- mindkét fél aktuális kezét;
- az összes lapcsaládot és speciális hatást;
- a fókuszokat;
- az eddigi kijátszott lapokat, pontokat és állapothatásokat;
- Havel nyílt policy-jét.

Havel ismeri ugyanezt. Nincs rejtett kéz, titkos dobás, titkos módosító vagy nem közölt szabály. A lapválasztás a fordulóban egyszerre zárolt: a játékos nem változtathatja meg a választását Havel választásának megtekintése után.

### A4. Család-matchup és teljes feloldási sorrend

Alap családi kör:

- Olvasás legyőzi Nyomást.
- Nyomás legyőzi Védekezést.
- Védekezés legyőzi Fordítást.
- Fordítás legyőzi Olvasást.
- Azonos család esetén nincs matchup-győztes.

A 4×4 családi mátrix a sorban álló játékos családjának eredményét mutatja Havel oszlopban szereplő családjával szemben:

| Játékos \ Havel | Olvasás | Nyomás | Védekezés | Fordítás |
|---|---|---|---|---|
| Olvasás | Döntetlen | Játékos +2 | Havel +2 | Játékos +2 |
| Nyomás | Havel +2 | Döntetlen | Játékos +2 | Havel +2 |
| Védekezés | Játékos +2 | Havel +2 | Döntetlen | Játékos +2 |
| Fordítás | Havel +2 | Játékos +2 | Havel +2 | Döntetlen |

**Kötelező feloldási sorrend minden fordulóban:**

1. Validáld, hogy mindkét lap az adott fél kezében van és még nem használt.
2. Alkalmazd a Csere családcseréjét.
3. Alkalmazd a Tükör effektív családját (ha az adott lap Tükör és van előző forduló).
4. Ha bármelyik fél Visszalépést játszott, a forduló 0–0 ponttal lezárul; a további matchup- és pontmódosítók nem futnak le.
5. Ha bármelyik fél Kivárást játszott, a családi matchup-bónusz 0 mindkét oldalon.
6. Egyébként számítsd ki a családi matchupot a fenti 4×4 táblából.
7. Ha az ellenfél Őrzést játszott és az effektív családja Védekezés, a vele szembeni Nyomás matchup-bónuszt nullázd.
8. Ha az előző forduló Megakasztás-hatása aktív, a célzott fél pozitív matchup-bónuszát 1-gyel csökkentsd, minimum 0-ra.
9. Add hozzá a lapok előrejelzés-bónuszát, ha a megjelölt család egyezik az ellenfél effektív családjával.
10. Ha a forduló a 5–8. lépés után matchup szempontból döntetlen, a Kivárás kijátszója +1 pontot kap. Ha mindkét fél Kivárást játszik, mindkettő +1 pontot kap.
11. Alkalmazd a Blöff −1 pontját, ha a Blöff effektív családja Nyomás és az ellenfél effektív családja Fordítás. A Blöff pontja nem csökkenthető 0 alá a forduló szintjén: a forduló végső pontszáma minimum 0.
12. A Megakasztás a következő fordulóra állít be hatást, nem az aktuálisra.
13. A két fél fordulópontját add hozzá az összpontszámhoz, a lapokat távolítsd el a kézből, majd léptesd a fordulót.

A speciális hatások kölcsönhatása tehát nem sorrendfüggő a kliens UI eseményeitől: kizárólag a fenti resolver-sorrend érvényes. Ha egy hatás semlegesíti a matchup-bónuszt, a bónusz nem kerülhet vissza későbbi lépésben.

### A5. Fókusz, körstruktúra és legális akciók

A meccs előtt mindkét fél egy fókuszt választ, amely a teljes meccsre rögzül:
- **Olvasás fókusz:** Olvasás családhoz +1 pont csak akkor, ha a forduló matchupja a módosítók után döntetlen.
- **Erő fókusz:** Nyomás családhoz ugyanez.
- **Védelem fókusz:** Védekezés családhoz ugyanez.
- Fordítás családhoz nincs fókusz-bónusz.

A fókusz-bónusz nem adható, ha a forduló Visszalépéssel semlegesült. Ha mindkét félnek jár fókusz-bónusz, mindketten megkapják. A fókusz nem módosítja a családi matchupot.

**Forduló:**
1. Állapotellenőrzés és legális lapok megjelenítése.
2. A játékos kiválaszt egy saját, még kézben lévő lapot, és megadja az opcionális Előrejelzés-családot.
3. A játékos megerősíti a választást; ezután a választás zárolt.
4. Havel policy-je választ egy saját, még kézben lévő lapot.
5. A két lap felfedése és az A4 szerinti feloldás.
6. Pontok, dobóhalom, előző forduló és állapothatások frissítése.
7. A következő forduló vagy a meccs vége.

**Legális játékos-akciók:** `chooseFocus` (csak meccs előtt), `playCard(cardId, predictionFamily?)`, `concede`, `resumePractice`. A `playCard` csak akkor fogadható el, ha a session aktív, a forduló játékosválasztásra vár, a lap a játékos kezében van, még nem használt, és az Előrejelzés paraméterei érvényesek. Más állapotban minden akció tiltott.

**Ismételt akció:** ugyanazon forduló azonos, már elfogadott akcióazonosítója ugyanazt a korábbi eredményt adja vissza, és nem old fel újabb fordulót. Másik lap beküldése a már zárolt fordulóban elutasítandó.

### A6. Determinisztikus Havel-opponent policy

Havel nem dob kockát és nem hív RNG-t. Minden forduló elején a játékos aktuális választása még nem ismert számára; a nyílt állapot és a saját kezében lévő lapok alapján választ.

**Policy:**
1. Sorban vizsgálja saját összes még legális lapját.
2. Minden saját jelölt laphoz kiszámítja az A4 resolverrel az eredményt a játékos minden még legális lapja ellen.
3. A jelölt lap értéke az így kapott Havel-fordulópontok minimuma (minimax: a játékos számára legkedvezőbb válasz ellen is a lehető legjobb eredmény).
4. A legnagyobb minimumértékű lapot választja.
5. Azonos érték esetén a tie-break sorrend: Őrzés → Kivárás → Megakasztás → Előrejelzés → Visszakérdezés → Szorítás → Elterelés → Csere → Tükör → Kockáztatás → Blöff → Visszalépés.
6. Ha az összes jelölt lap értéke azonos, ugyanez a tie-break sorrend dönt.

Az Előrejelzésnél Havel a játékos még kézben lévő effektív családjai közül azt a családot jelöli meg, amely a legtöbbször szerepel; azonos darabszámnál a családi sorrend: Olvasás, Nyomás, Védekezés, Fordítás. A policy bemenete, a jelölt pontok és a kiválasztott lap tesztben naplózható. Ugyanarra az állapotra mindig ugyanazt az akciót kell visszaadnia.

### A7. Meccsvég, döntetlen, feladás és megszakítás

Három forduló után:
- játékos összpontszáma nagyobb: **győzelem**;
- kisebb: **vereség**;
- azonos: **döntetlen**.

A győzelem/vereség/döntetlen kizárólag practice eredmény. Nem ad goldot, itemet, XP-t, relationship- vagy reputation-deltát. A 35 gold meglévő konfigurációs érték nem belépődíj ebben a módban.

**Feladás:** a játékos bármikor feladhat. A meccs `conceded` terminális státuszt kap, az eredmény vereség, további lap nem játszható ki. Nincs büntetés vagy jutalom.

**Megszakítás / reload:** practice módban az aktuális session helyi mentése visszaállítható. A visszaállított állapotot validálni kell: rulesetVersion, dealIndex, fordulószám, kéz, dobóhalom, pontok, előző lapok, aktív hatások és állapotkonzisztencia. Hibás vagy ellentmondásos állapot nem folytatható; új practice session indítható, gazdasági hatás nélkül. Pénzes session reload/folytatás nincs engedélyezve, amíg a központi session- és settlement-szabály nincs elfogadva.

### A8. Tesztmód és teljes kombinációs tesztmátrix

**Tesztmód:** a QA választhat `dealIndex` 0–11 között, rögzítheti a játékos és Havel fókuszát, majd előre megadott lapakciókat futtathat. Minden futás ugyanarra az állapotra ugyanazt a kimenetet adja. Tesztmódban nincs store-módosítás, gold, XP, kapcsolat vagy journal jutalom.

**Teljes 12×12 lapkombinációs mátrix:** minden cella egy kötelező külön resolver-tesztet jelent. A TC teszt elvárása: a két lap effektív családjának, speciális hatásának és az A4 sorrendnek megfelelő determinisztikus kimenet. A 144 kombináció mindegyikére rögzíteni kell a két fél fordulópontját és a következő állapotot.

| Játékos \\ Havel | EL | KI | VK | BL | SZ | KO | ŐR | ELT | VL | CS | TÜ | MEG |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| EL | 2:2 | 2:2 | 2:1 | 4:1 | 4:1 | 4:1 | 2:1 | 2:1 | 0:0 | 4:1 | 2:3 | 2:3 |
| KI | 2:2 | 2:2 | 2:1 | 2:1 | 2:1 | 2:1 | 2:1 | 2:1 | 0:0 | 2:1 | 2:1 | 2:1 |
| VK | 1:2 | 1:2 | 1:1 | 3:1 | 3:1 | 3:1 | 1:1 | 1:1 | 0:0 | 3:1 | 1:3 | 1:3 |
| BL | 1:4 | 1:2 | 1:3 | 1:1 | 1:1 | 1:1 | 1:1 | 3:1 | 0:0 | 1:1 | 0:1 | 0:1 |
| SZ | 1:4 | 1:2 | 1:3 | 1:1 | 1:1 | 1:1 | 1:1 | 3:1 | 0:0 | 1:1 | 1:1 | 1:1 |
| KO | 1:4 | 1:2 | 1:3 | 1:1 | 1:1 | 1:1 | 1:1 | 3:1 | 0:0 | 1:1 | 1:1 | 1:1 |
| ŐR | 1:2 | 1:2 | 1:1 | 1:1 | 1:1 | 1:1 | 1:1 | 1:1 | 0:0 | 1:3 | 3:1 | 3:1 |
| ELT | 1:2 | 1:2 | 1:1 | 1:3 | 1:3 | 1:3 | 1:1 | 1:1 | 0:0 | 1:3 | 3:1 | 3:1 |
| VL | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 | 0:0 |
| CS | 1:4 | 1:2 | 1:3 | 1:1 | 1:1 | 1:1 | 3:1 | 3:1 | 0:0 | 1:1 | 1:1 | 1:1 |
| TÜ | 3:2 | 1:2 | 3:1 | 1:0 | 1:1 | 1:1 | 1:3 | 1:3 | 0:0 | 1:1 | 1:1 | 1:1 |
| MEG | 3:2 | 1:2 | 3:1 | 1:0 | 1:1 | 1:1 | 1:3 | 1:3 | 0:0 | 1:1 | 1:1 | 1:1 |

<sub>Cell format: játékos pont : Havel pont. Fixture-alapállapot: 1. forduló, nincs fókuszbónusz és nincs előző fordulóból aktív Megakasztás; az Előrejelzés tesztje helyes tippet ad. A Tükör az első fordulóban saját Fordítás család marad. A mátrix a 144 lappár mindegyikének konkrét elsőfordulós kimenetét rögzíti; a későbbi fordulófüggő speciális állapotokat a H-S tesztek fedik le.</sub>

Kombinációs fixture-azonosítók:** `H-COMB-<playerCardId>-<havelCardId>`. A fenti 144 cella mindegyikéhez pontosan egy fixture tartozik. A 4×4 családpár-mátrix külön aggregált ellenőrzése kötelező, hogy a speciális lapok ne fedjék el a családszintű hibákat.

**Speciális interakciós tesztek:**

| Teszt ID | Interakció | Elvárt eredmény |
|---|---|---|
| H-S01 | Előrejelzés helyes / hibás / hiányzó családdal | Helyesnél +1; hibásnál 0; hiányzó vagy invalid paraméter esetén elutasítás |
| H-S02 | Kivárás vs mind a négy család | Mindkét fél matchup-bónusza 0; döntetlennél Kivárás +1 |
| H-S03 | Blöff vs Fordítás | Blöff kijátszója −1-et kap, fordulópont minimum 0 |
| H-S04 | Blöff vs nem Fordítás | Nincs Blöff-levonás |
| H-S05 | Őrzés vs Nyomás | Nyomás +2 bónusza 0 |
| H-S06 | Őrzés vs Olvasás/Védekezés/Fordítás | Őrzés nem ad általános immunitást, normál matchup érvényes |
| H-S07 | Csere vs mind a négy család | Effektív családok felcserélődnek, a 4×4 mátrix alapján |
| H-S08 | Csere + Előrejelzés | A tipp az A4 szerinti effektív családot ellenőrzi |
| H-S09 | Tükör az első fordulóban | Saját Fordítás család marad |
| H-S10 | Tükör a 2–3. fordulóban | Az előző ellenfél-lap effektív családját másolja |
| H-S11 | Visszalépés bármely lap ellen | 0–0 forduló; minden további módosító elmarad |
| H-S12 | Megakasztás a következő fordulóban | Az ellenfél pozitív matchup-bónusza 1-gyel csökken, minimum 0 |
| H-S13 | Megakasztás a harmadik fordulóban | Nem keletkezik későbbi hatás |
| H-S14 | Két Kivárás egy fordulóban | Matchup 0; mindkét fél +1, ha fókusz nem ad további bónuszt |
| H-S15 | Két Megakasztás egymás után | Mindkét aktív hatás a saját célzott következő fordulóra érvényes; nincs összevonás vagy visszamenőleges módosítás |
| H-S16 | Fókusz és döntetlen matchup | Csak a fókusznak megfelelő effektív család kap +1-et |
| H-S17 | Visszalépés + fókusz | Nincs fókuszpont |
| H-S18 | Lap újraküldése azonos actionId-val | Az eredeti eredmény tér vissza, nincs új pont vagy kör |
| H-S19 | Másik lap beküldése zárolás után | Elutasítás, állapotváltozás nélkül |
| H-S20 | Üres/hibás/idegen lap ID | Elutasítás, a kéz és pontok változatlanok |

**Kör- és állapottesztek:**

| Teszt ID | Eset | Elvárt eredmény |
|---|---|---|
| H-T01 | 1. forduló érvényes választás | Egy-egy lap kikerül a kézből, pontok egyszer frissülnek |
| H-T02 | 2. forduló | Csak a megmaradt lapok játszhatók |
| H-T03 | 3. forduló | Meccs lezárul, negyedik forduló nincs |
| H-T04 | Mindhárom forduló játékosgyőzelem | Meccs győzelem |
| H-T05 | Mindhárom forduló Havel-győzelem | Meccs vereség |
| H-T06 | Összesített pontazonosság | Meccs döntetlen |
| H-T07 | Feladás az 1., 2. és 3. forduló előtt | `conceded`, vereség, további akció nincs |
| H-T08 | Reload forduló közben | Azonos practice állapot folytatódik vagy hibás állapotnál tiszta újrakezdés |
| H-T09 | Manipulált pontszám vagy kéz | Állapotvalidáció elutasítja; nincs jutalom |
| H-T10 | Negyedik akció / forduló | Elutasítás |
| H-T11 | Kijátszott lap ismételt használata | Elutasítás |
| H-T12 | Havel policy azonos állapoton kétszer | Azonos lap és tipp |
| H-T13 | Havel policy tie-break | A dokumentált prioritási sorrend dönt |
| H-T14 | Practice eredmény | Gold, XP, relationship, reputation, item és journal gazdasági jutalom nem változik |
| H-T15 | Tesztmód ismételt futtatása | Ugyanazon fixture ugyanazt az eredményt adja |
| H-T16 | `dealIndex` 0 és 11 határérték | Érvényes, determinisztikus kiosztás |
| H-T17 | `dealIndex` −1, 12 vagy nem egész szám | Elutasítás |
| H-T18 | Ismeretlen rulesetVersion | Session nem folytatható, nincs gazdasági hatás |
| H-T19 | Tiltott akció nem megfelelő fázisban | Elutasítás állapotváltozás nélkül |
| H-T20 | Két párhuzamos beküldés ugyanarra a fordulóra | Practice-ben egy eredmény; pénzes módban csak szerveres idempotencia után lehetne elfogadni |

**Elfogadási feltétel:** mind a 144 lapkombináció és a fenti célzott tesztek determinisztikusan zöldek; nincs `Math.random`-függő kimenet; a Havel policy teljesen reprodukálható; a practice módnak nincs gazdasági mellékhatása.

---

# B. BRENKA — KÜLÖNÁLLÓ ODDS / BET / SETTLEMENT MODELL

**Besorolás:** a matematikai modell és az állapotgép LOCAL PROPOSAL; a pénzügyi paraméterek és a szerveres tranzakciós szerződés CENTRAL DECISION REQUIRED.  
**Szigorú szeparáció:** Brenka saját event/bet/settlement modellje nem olvashatja, nem írhatja és nem használhatja Havel kártyajátékának session state-jét, handjét, lapjait, fordulóját, pontjait vagy rulesetjét. A két NPC között nincs közös minijáték-session.

### B1. Fogalmak és adatszerződés

| Entitás | Kötelező mezők / jelentés |
|---|---|
| Event | `eventId`, típus, résztvevők, kezdési idő, `status`, elfogadási határidő, eredményforrás, eredményazonosító |
| Odds | `eventId`, `outcomeId`, decimális odds, verzió, közzétételi idő, érvényességi idő; elfogadott fogadásnál változtathatatlan snapshot |
| Stake | Egész, pozitív gold összeg; a fogadás elfogadásakor ellenőrzött és egyszer levont összeg |
| Accepted bet | `betId`, `playerId`, `eventId`, `outcomeId`, `stake`, `acceptedOdds`, `acceptedAt`, `idempotencyKey`, `status` |
| Event result | Hiteles eredményforrásból származó `resultId`, `eventId`, győztes/kimenetel, véglegességi állapot, időbélyeg |
| Payout | A fogadás elfogadásakor rögzített stake és odds alapján számolt egész gold jóváírás; nyeréskor tartalmazza a tétet |
| Settlement | `settlementId`, `betId`, `resultId`, `payout`, `net`, `status`, végrehajtási idő; egy bethez legfeljebb egy végleges settlement |
| Void / cancellation | Esemény érvénytelen vagy törölt státusza; elfogadott fogadás tétjének egyszeri visszatérítése, nyeremény nélkül |

Ezek javasolt domain-entitások, nem alpha.26-ban igazolt TypeScript-típusok.

### B2. Eseményállapotok és fogadási életciklus

Event állapotgép:

`DRAFT → OPEN → SUSPENDED → OPEN` vagy `CLOSED → RESULT_PENDING → SETTLED`

Alternatív terminális út: `OPEN/SUSPENDED/CLOSED → CANCELLED → VOIDED`.

- **DRAFT:** még nem látható fogadásra.
- **OPEN:** új fogadás elfogadható a határidőig.
- **SUSPENDED:** új fogadás nem fogadható el; a korábbi fogadások változatlanok.
- **CLOSED:** nincs új fogadás vagy módosítás; a korábban elfogadott tétek eredményre várnak.
- **RESULT_PENDING:** eredmény érkezett, de még nem végleges/hitelesített; nincs payout.
- **SETTLED:** a végleges eredmény alapján minden elfogadott fogadás egyszer elszámolt.
- **CANCELLED:** az esemény nem kerül szabályosan megrendezésre.
- **VOIDED:** az elfogadott tétek visszatérítése lezárult.

Fogadási életciklus:

`DRAFT → ACCEPTED → WON/LOST` vagy `ACCEPTED → VOID_PENDING → VOIDED`.

A fogadás elfogadása csak akkor lehetséges, ha az event `OPEN`, az elfogadási határidő még nem telt le, az odds snapshot érvényes, a stake pozitív egész, a játékosnak elegendő goldja van, és az event/player limit nem sérül. A `CLOSED`, `SUSPENDED`, `RESULT_PENDING`, `SETTLED`, `CANCELLED` vagy `VOIDED` állapotú eseményre új fogadás tilos.

### B3. Matematikai szabályok

Minden odds decimális odds, amely a visszafizetett teljes összeget tartalmazza.

- **Implied probability:** `p = 1 / O`, ahol `O` az elfogadott decimális odds.
- **Többkimenetelű esemény könyvösszege:** `overround = Σ(1 / O_i) − 1`. Ez csak az összes kölcsönösen kizáró és teljes kimenetelt lefedő odds esetén értelmezhető.
- **Bruttó payout nyeréskor:** `P = floor(S × O)`.
- **Nettó nyereség:** `N = P − S`.
- **Veszteség:** `N = −S`, payout = 0.
- **Void/cancel:** `P = S`, `N = 0`.
- **Rounding:** lefelé kerekítés a legközelebbi egész goldra; nincs lebegőpontos pénzösszeg tárolás. A számításhoz rögzített pontosságú odds-reprezentáció szükséges (javaslat: odds ezredrészekben tárolva), majd egész aritmetikával számított `floor(S × oddsMilli / 1000)`.

Az implied probability nem azonos a tényleges valószínűséggel és nem garantál nyerési esélyt. Az odds megjelenítése nem jogosítja fel a klienst arra, hogy elfogadáskor vagy settlementkor saját oddsot küldjön hiteles értékként. A settlement mindig az elfogadott odds snapshotot használja.

### B4. Korlátok — ideiglenes balance proposal

| Paraméter | Javasolt érték | Státusz |
|---|---:|---|
| Minimum stake | 1 gold | CENTRAL DECISION REQUIRED |
| Maximum stake / fogadás | 100 gold | CENTRAL DECISION REQUIRED |
| Fogadások száma játékosonként / event | 1 | CENTRAL DECISION REQUIRED |
| Maximum játékosveszteség / event | 100 gold | CENTRAL DECISION REQUIRED |
| Maximum összes nyitott játékos-exposure | 300 gold | CENTRAL DECISION REQUIRED |
| Odds minimum | 1.10 | CENTRAL DECISION REQUIRED |
| Odds maximum | 10.00 | CENTRAL DECISION REQUIRED |
| Odds precision | 0.001 | CENTRAL DECISION REQUIRED |
| Payout rounding | lefelé, egész goldra | CENTRAL DECISION REQUIRED |
| Void | teljes stake refund, egyszer | CENTRAL DECISION REQUIRED |

Az exposure definíciója: a játékos összes még el nem dőlt fogadásán kockáztatott stake összege. A javasolt egy fogadás/event korláttal az eventenkénti maximális veszteség 100 gold. A 300 gold globális nyitott exposure legfeljebb három 100 goldos nyitott tétet engedne; a limitet a központi gazdasági tulajdonosnak kell jóváhagynia.

A `fn-brenka` meglévő 25 gold költsége **nem** kezelhető fogadási díjként vagy automatikus tétként. Az odds megtekintése practice/preview módban ingyenes. Nincs díj a fogadás megtekintéséért.

### B5. Elfogadás, eredmény és settlement

**Bet acceptance (egy atomikus műveletként):**
1. szerver ellenőrzi a játékost, eventet, event státuszt és határidőt;
2. betölti a szerveroldali aktuális oddsot, nem a kliens által küldött értéket;
3. ellenőrzi a stake egész, pozitív és a limiteken belüli értékét;
4. ellenőrzi a játékos aktuális goldját és teljes nyitott exposure-jét;
5. ellenőrzi az egy bet/event szabályt;
6. létrehoz egy egyedi `betId`-t és idempotency kulcsot;
7. ugyanabban az atomikus tranzakcióban levonja a stake-et és rögzíti az `ACCEPTED` fogadást az odds snapshot-pal;
8. csak a sikeres commit után jelzi a kliensnek az elfogadást.

Bármely validációs vagy tranzakciós hiba esetén sem a stake, sem a bet rekord nem maradhat félkész állapotban.

**Event result:** csak központilag jóváhagyott, hiteles eredményforrásból származhat. Brenka, a kliens és a Havel-session nem állíthat elő eredményt. A result `RESULT_PENDING` állapotban nem fizet.

**Settlement:**
1. ellenőrzi az event végleges, hiteles `resultId`-ját;
2. kiválasztja az adott event még el nem számolt ACCEPTED fogadásait;
3. az accepted bet odds snapshotját és stake-jét használja;
4. kiszámítja a payoutot;
5. egyedi `settlementId`-t és betenkénti egyedi settlement-kulcsot rögzít;
6. ugyanabban az atomikus tranzakcióban jóváírja a payoutot és a fogadást lezárja WON/LOST státuszra;
7. az ismételt kérés ugyanazt a korábbi settlement eredményt adja vissza, további jóváírás nélkül.

**Cancelled / void event:** minden elfogadott stake pontosan egyszer visszajár; nincs nyereség és nincs külön díj. A void refund ugyanazzal az idempotens elszámolási mechanizmussal működik. A már SETTLED event nem válthat át automatikusan VOIDED státuszra; eredménykorrekció csak külön, központilag jóváhagyott kompenzációs tranzakcióval történhet.

### B6. Brenka tesztmátrix

| Teszt ID | Eset | Elvárt eredmény |
|---|---|---|
| B-01 | Implied probability 1.5 oddsnál | 0.666… |
| B-02 | Implied probability 2.0 oddsnál | 0.5 |
| B-03 | Kölcsönösen kizáró kimenetelek overround számítása | Σ(1/O)−1 képlet |
| B-04 | Stake 1, odds 1.10 | payout 1, nettó 0 |
| B-05 | Stake 100, odds 1.50 | payout 150, nettó +50 |
| B-06 | Stake 100, odds 3.00 | payout 300, nettó +200 |
| B-07 | Vesztes fogadás | payout 0, nettó −stake |
| B-08 | Void event | stake pontosan egyszer visszatér |
| B-09 | Stake 0 / negatív / tört / NaN / végtelen | elutasítás |
| B-10 | Stake 101 | elutasítás a javasolt limit szerint |
| B-11 | Odds 1.099 / 10.001 / nem numerikus | elutasítás a javasolt tartomány szerint |
| B-12 | Odds módosul fogadás elfogadása után | accepted snapshot változatlan |
| B-13 | Fogadás event CLOSED után | elutasítás |
| B-14 | Fogadás SUSPENDED vagy RESULT_PENDING alatt | elutasítás |
| B-15 | Két fogadás ugyanarra az eventre ugyanattól a játékostól | második elutasítva |
| B-16 | Ugyanazon acceptance kérés ismétlése | azonos betId/eredmény, egyetlen stake-debit |
| B-17 | Settlement kétszer fut | egyetlen payout |
| B-18 | Két settlement worker párhuzamosan fut | egyetlen végleges settlement és jóváírás |
| B-19 | Ismeretlen vagy nem végleges resultId | nincs payout |
| B-20 | Event törlése elfogadott fogadás után | egyszeri teljes refund |
| B-21 | Gold hiányzik vagy közben elköltötték | acceptance atomikusan elutasítva |
| B-22 | Globális 300 gold exposure limit túllépése | acceptance elutasítva |
| B-23 | Kliens odds értéket manipulál | szerveroldali odds használata |
| B-24 | Kliens payout értéket manipulál | szerveroldali payout újraszámítás |
| B-25 | Két kliens egy időben ugyanarra az eventre fogad | szerveroldali egyedi korlát és tranzakciós zárolás érvényesül |
| B-26 | Havel session ID átadása Brenka bet kérésnek | elutasítás; nincs közös session |
| B-27 | Havel eredménypontszám beküldése event resultként | elutasítás |
| B-28 | Már elszámolt bet ismételt feldolgozása | nincs újabb payout/refund |
| B-29 | Settlement közbeni hiba | teljes rollback vagy biztonságos újrapróbálható tranzakció |
| B-30 | Payout integer rounding határeset | dokumentált lefelé kerekítés |

---

# C. KLIENSOLDALI PÉNZÜGYI ÉS SESSION KOCKÁZATI JEGYZÉK

A jelenlegi kliensoldali store nem biztosít szerveroldali hitelességet. A localStorage vagy kliensállapot módosítása, a UI elrejtése, a callback újrahívása vagy a hálózati kérés ismétlése nem tekinthető megbízható tranzakciós kontrollnak.

| Kockázat | Hiba/abúzus | Kötelező védelem a valódi gold előtt |
|---|---|---|
| Kliensoldali state módosítás | gold, pontszám, odds, stake, event státusz vagy payout átírása | szerveroldali authoritative state; a kliens csak kér és megjelenít |
| Duplikált hívás | dupla stake-debit, dupla lapfeloldás vagy dupla payout | idempotency key + egyedi adatbázis-korlát + tranzakció |
| Újratöltés | session visszajátszása, eredmény újraküldése, elveszett/dupla állapot | szerveroldali session/bet státusz és biztonságos resume |
| Event lezárás utáni fogadás | késői fogadás az eredmény ismeretében | szerveridő, atomikus OPEN→CLOSED határ, acceptance deadline |
| Ismételt payout | ugyanazon bet többszöri jóváírása | betId-nként egyedi settlement; tranzakciós egyediség |
| Odds manipuláció | kedvezőbb kliensoldali odds beküldése | szerver által rögzített odds snapshot |
| Session replay | régi Havel akció vagy Brenka bet request újrajátszása | sessionVersion, action sequence, nonce/idempotency és terminális státusz |
| Negatív stake / overflow | negatív levonás, túl nagy szorzás, egész túlcsordulás | egész típusú tartományellenőrzés, felső korlát, biztonságos egész aritmetika |
| Több kliens párhuzamos használata | két böngésző ugyanazt az egyenleget vagy fogadási limitet használja | szerveroldali locking/optimistic concurrency, egyedi constraint, atomic commit |
| Kliensóra manipulálása | fogadás határidejének megkerülése | szerveróra; kliensóra nem autoritás |
| Manipulált event eredmény | saját kliensből győztes/outcome megadása | hiteles eredményforrás és eredmény-azonosító |
| Practice/pénzes mód keverése | tét nélküli session jutalmat vagy pénzt vált ki | elkülönített mode flag és szerveroldali jogosultság; practice soha nem küld settlementet |
| Részleges commit | stake levonva, bet nem rögzítve vagy payout rögzítve, gold nem jóváírva | atomikus tranzakció, rollback, audit ledger |
| Mentés visszaállítása | korábbi gold- vagy session-állapot visszatöltése | szerveroldali ledger és monoton verzió/sequence |

**Kötelező invariánsok:**
1. Egy bethez legfeljebb egy elfogadási debit tartozhat.
2. Egy bethez legfeljebb egy végleges settlement tartozhat.
3. Egy void refund nem ismételhető.
4. A bet elfogadott oddsát utólag nem lehet módosítani.
5. A kliens nem határozhatja meg az event eredményét, payoutját vagy saját egyenlegét.
6. Havel practice nem módosíthatja Brenka betet vagy settlementet.
7. Brenka nem olvashat Havel sessionből eredményt.
8. Minden pénzmozgásnak visszakövethető, egyedi tranzakcióazonosítója van.
9. A tranzakciók atomikusak és újrapróbáláskor idempotensek.
10. A gold/diamonds közös gazdasági tulajdonosi szabályait a kerületi specifikáció nem írhatja felül.

---

# D. KÜLÖN FEJLESZTÉSI KAPU

| Fázis | Engedélyezett | Tiltott | Kilépési feltétel |
|---|---|---|---|
| **1. Practice / preview** | Havel tét nélküli, determinisztikus kártyajátéka; Brenka odds megtekintése és matematikai kalkulátora rögzített tesztadatokon | Gold debit/credit, fogadás elfogadása, payout, XP/relationship jutalom, valódi eventre kötött tét | A Havel 144 kombinációs és célzott tesztje zöld; Brenka preview nem módosít state-et; Central Meta-GPT jóváhagyja a practice scope-ot |
| **2. Valódi gold settlement** | Csak külön jóváhagyott Havel/Brenka pénzügyi funkció, szerver-authoritative tranzakcióval | Kliensoldali payout; nem hitelesített event; nem jóváhagyott stake/odds; ismételt settlement | Központi settlement-szerződés, szerveres authority, idempotencia, ledger, concurrency, audit, rollback, migráció és biztonsági tesztek elfogadva |

**A második fázis nem automatikus folytatása az elsőnek.** Külön projektgazdai és központi architektúra-jóváhagyás szükséges.

---

# E. KÖZPONTI DÖNTÉSI LISTA — MIND PENDING

| ID | Döntés | Javasolt alap | Miért központi? | Érintett terület |
|---|---|---|---|---|
| RD-HB-01 | Havel practice mód engedélyezése | Tét nélküli, determinisztikus, nincs jutalom | NPC action és UI integráció | Havel, store, GameClient |
| RD-HB-02 | Havel ruleset elfogadása | Jelen A1–A8 szabályverzió | A játék egyensúlya és végrehajthatósága | Havel, tesztek |
| RD-HB-03 | Havel kéz/session mentése | Első fázisban csak helyi, nem gazdasági practice resume | Save schema és replay védelem | store, save migration |
| RD-HB-04 | Havel pénzes mód engedélyezése | Nincs, amíg szerver-authoritative settlement nincs | Közös economy és tranzakció | Havel, economy |
| RD-HB-05 | Havel bármilyen jutalma | Első fázisban nincs | XP, relationship, reputation és reward budget | simulation, progression |
| RD-HB-06 | Brenka event source | Központilag hitelesített event/result provider | Nincs most igazolt autoritatív eseményforrás | Brenka, event service |
| RD-HB-07 | Brenka odds authority | Szerveroldali, verziózott odds snapshot | Kliens odds manipulálható | Brenka, event service |
| RD-HB-08 | Brenka stake/odds limitek | B4 táblázat mint balance proposal | Gold sink/risk/exposure | rewardEconomy, store |
| RD-HB-09 | Settlement/void szerződés | Atomikus, betId-nként egyszeri, auditált | Közös pénzmozgás | transaction service, ledger |
| RD-HB-10 | Közös idempotencia és concurrency | Egyedi kulcs, DB constraint, tranzakciós zárolás | Több kliens és ismételt kérések | backend, store/API |
| RD-HB-11 | Szerver-authoritative architektúra | Minden pénzes kimenetel szerveroldali | Kliensoldali store nem biztonsági határ | teljes gazdaság |
| RD-HB-12 | Save/session migráció | Központi verziózás és kompatibilitási teszt | Régi mentések és visszajátszás | types, store |
| RD-HB-13 | Gold ledger és audit | Minden debit/credit egyedi tranzakciórekord | Visszakövethetőség és rollback | economy |
| RD-HB-14 | Practice és éles mód szeparációja | Külön mód, külön jogosultság, nincs átváltás | Jutalom- és session-exploit megelőzés | Havel, Brenka, UI |

**Döntési szabály:** amíg a RD-HB-04 és RD-HB-06–RD-HB-14 döntések nincsenek elfogadva, Havel pénzes meccs és Brenka valódi fogadás BLOCKED marad. A jelen appendix semmilyen gazdasági paramétert nem emel elfogadott státuszba.

### 12.2. Kiegészítés elfogadási ellenőrzőlista

- [x] Havel 12 lapja stabil ID-val, családdal és konkrét hatással definiálva.
- [x] Minden családpár eredménye definiálva 4×4 mátrixban.
- [x] Minden lapkombinációhoz 12×12 tesztmátrix tartozik (144 kombináció).
- [x] Speciális lapok feloldási sorrendje és kölcsönhatásai definiálva.
- [x] Legális/tiltott akciók, ismétlés, döntetlen, feladás, reload és tesztmód definiálva.
- [x] Havel opponent policy determinisztikus és tie-breakelt.
- [x] Brenka event, odds, stake, accepted bet, result, payout, settlement és void külön modellezve.
- [x] Matematikai képletek, rounding és ideiglenes limitek rögzítve.
- [x] Kliensoldali pénzügyi kockázatok és védelmi követelmények dokumentálva.
- [x] Kétfázisú fejlesztési kapu és központi döntési lista elkészült.
- [ ] Central Meta-GPT jóváhagyás.
- [ ] Szerveroldali settlement architektúra jóváhagyás és implementáció.
- [ ] Havel/Brenka éles pénzes funkció tesztelt és engedélyezett.

### 12.3. Változtatási nyilatkozat

Ez a célzott kiegészítés kizárólag a dokumentum 12. fejezetét adja hozzá. A korábbi Miri, Silas és Tosk specifikációk tartalma nem került átírásra. Nem történt forráskód-, közös economy-, Canon-, Dynamic Layer-, main quest- vagy másik kerületi dokumentummódosítás. Nem történt merge.

**Végső státusz:** Havel — **BLOCKED** (practice szabály specifikálva; bármilyen gazdasági jutalom/pénzes mód központi döntésre vár). Brenka — **BLOCKED** (odds/settlement specifikálva; valós fogadás hiteles eventforrás és szerver-authoritative settlement nélkül tiltott).
