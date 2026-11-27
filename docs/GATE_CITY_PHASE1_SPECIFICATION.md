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
**Feloldás és eredmény:** 60 gold, csak ha HP hiányzik; heal = min(hiányzó HP, ceil(maxHP×0.10)). Ha teljes HP-n van a játékos, a pihenés nem vonhat le pénzt. Az étel az item saját effect mezőjét használja; a leírt `heartyStew` 20% gyógyítást ad.
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


## 11. Alpha.26 runtime verification — central review

**Verified source:** `src/lib/content.ts` blob `27206c65e37c5cc3b47d0257d91b1654f8971b95`; `src/lib/store.ts` blob `60fc472f8eeefd940aa25e226e3a1aa3a20b1aba`.

NPC_FUNCTIONS contains `fn-damar/warehouse`, `fn-alma/inn`, `fn-petar/transport`, `fn-vera/currency`, `fn-jarek/map`. The store groups warehouse, transport, currency and map into a generic item/service purchase branch (selected item, cost, inventory add or gold debit), not a shipment ledger, transport route resolver, coin-authentication minigame or discovery graph. Alma's authored function explicitly describes 60 gold / one hour / 10% max HP and `heartyStew` / `gateRations`; the exact runtime handler must be inspected in full before final acceptance. This is why the new mechanics remain proposals, not claims about existing behavior.

**Required follow-up:** source-map each NPC's complete runtime branch; identify existing route/discovery/document state before freezing persistence. All five NPCs remain IN PROGRESS.
## 12. PHASE 2 előkészítési csomagok — forrásalapú részletezés (v0.3)

**Státusz:** Alma fejlesztése külön PHASE 2 ágon aktív; Damar, Petar, Vera és Jarek továbbra is **IN PROGRESS / SPECIFICATION ONLY**. A jelen fejezet nem engedélyez kódmódosítást ezen a négy NPC-nél.

### 12.1 Damar — raktári árumozgás és ellenőrzés
**Canon:** Damar, raktárőr; Rakparti mérlegház; NPCS.id=damar, NPC_FUNCTIONS.id=fn-damar, kind=warehouse. A szerep raktári hozzáférést és árumozgás-ismeretet ad, nem hatalmazza fel a játékost szabad készletmozgatásra.

**VERIFIED runtime (alpha.26):**
- src/lib/content.ts: fn-damar, warehouse; nincs cost és nincs itemIds.
- src/lib/store.ts: a warehouse a generikus szolgáltatás/vásárlás case-csoportba kerül. targetId alapján csak fn.itemIds allow-listből lehet tárgyat választani; Damar funkciójánál ilyen lista nincs. Így a jelenlegi hívás nem olvas le szállítmányt, nem vizsgál plombát és nem vezet készletet; a generikus used() naplózza a funkciót és meglévő kapcsolat/aktivitás értékeket módosít.
- src/lib/store.ts: useGameStore localStorage mentést végez a aimorpg-final-demo-v1-29 kulccsal; payload saveVersion: 6. A normalizáló útvonal nem tartalmaz raktári manifest/custody objektumot.
- **Nincs VERIFIED szállítmány-, mérleg-, plomba- vagy raktárkészlet-adatmodell.**

**Célélmény és teljes loop (LOCAL GAMEPLAY PROPOSAL):**
1. Damar szolgáltatásának megnyitása.
2. A játékos a számára már engedélyezett, authored átvételi megbízások közül választ.
3. A rendszer megmutatja a megbízás azonosítóját, a rakomány megnevezését, a plombajelzést, a dokumentált darabszámot és a dokumentált tömeget.
4. A játékos vizsgálati módot választ: gyors szemrevételezés, teljes ellenőrzés, vagy eltérés miatti zárolási javaslat.
5. Az ellenőrzés mezőnként felfedi a hiteles adatot; a játékos egyezteti a dokumentumot a rögzített megfigyeléssel.
6. A játékos dönt: átveszi, vitatja/zárolja, vagy elutasítja a tételt.
7. A rendszer visszaadja az eredményt és a következő jogszerű lépést; a játékos kiléphet anélkül, hogy bármilyen állapotot megváltoztatna.

**Játékosi döntések és determinisztikus szabályok (LOCAL PROPOSAL):**
- Szemrevételezés: csak a plombajel és a látható sérülés státusza látszik.
- Teljes audit: a plombajel, a dokumentált darabszám és tömeg összevethető.
- Átvétel: csak akkor lehet teljes siker, ha minden ellenőrzött mező egyezik.
- Zárolás: legalább egy eltérés esetén a játékos megőrizheti a vitatott tétel változatlan állapotát és jelentést kérhet.
- Elutasítás: a tétel nem kerülhet a játékos inventoryjába; a döntés a megbízás eredményét zárja le.
- Nincs kockadobás, nincs rejtett százalékos siker. A hibás adat elfogadása nem alakítható jutalmazott sikerré.
- A darabszám és tömeg toleranciája csak akkor állítható be, ha a központi content owner authored mértékegységet és toleranciát ad. Alapértelmezésben pontos egyezés szükséges.

**Erőforrás és gazdaság:**
- A jelenlegi fn-damar ingyenes; az alpha.26 nem határoz meg auditdíjat.
- A korábbi v0.2-ben szereplő 5 gold / tétel auditdíj **NEM JÓVÁHAGYOTT**, nem tekinthető követelménynek.
- Nincs arany- vagy tárgyjutalom pusztán ellenőrzésért. Jutalom csak meglévő, egyszeri authored quest/contract forrásból érkezhet.
- Készlet nem másolható, és a raktárból semmilyen item nem kerülhet a játékoshoz pusztán egy ellenőrzési eredmény miatt.

**Állapotok és mentés:**
- Tervezett UI állapotok: idle → selected → inspecting → decision → resolved; megszakítás: selected/inspecting → cancelled.
- **CENTRAL DECISION REQUIRED:** létezik-e és hogyan tárolható a szállítmány-azonosító, manifest, plombastátusz, tömegmérés, custody és lezárt átvételi eredmény.
- A jelenlegi save v6-ba nem írható be saját, körzeti shipment store. Addig Damar csak statikus, nem jutalmazó UI-prototípusként vagy meglévő quest-állapothoz kötött, központilag jóváhagyott tartalomként specifikálható.
- A mainQuestAudit 60 csomópontját és a Black Coin raktári nyomait ez a funkció nem írhatja át.

**UI és hibakezelés:** megbízáslista; részletes manifest-panel; eltérés kiemelése; három egyértelmű döntési gomb; megerősítő dialógus átvétel/elutasítás előtt; üres lista, jogosulatlan manifest, lezárt ügy, hiányzó mező, hibás mértékegység és már beküldött döntés esetére külön hibaállapot. Mobilon a döntési gombok egymás alatt, az eltérések szövegesen is jelenjenek meg.

**Exploitvédelem:** idegen manifest ID nem fogadható el; lezárt ügy nem küldhető újra; negatív vagy nem véges mennyiség elutasítandó; ugyanaz a manifest nem adhat kétszer jutalmat; újratöltés után a lezárt állapot nem nyílhat újra; quest item vagy más NPC custody alatt álló tárgy nem mozgatható.

**Tesztelhető elfogadás:** exact match; seal mismatch; darabszám-eltérés; tömeg-eltérés; több eltérés; zárolás; elutasítás; hibás elfogadás blokkolása; jogosulatlan manifest; lezárt manifest; duplicate submit; reload; hiányzó mező; invalid number; quest item védelem; nulla jutalom puszta vizsgálatért. A teszt fixture és a tartós állapot-szerződés a központi döntés után véglegesíthető.

**Függőségek:** központi tranzakció/idempotency szerződés; raktári custody adatmodell; authored szállítmánytartalom; későbbi Cador (könyvelés), Vera (hitelesítés) és Rovan (nyomozás) csak jóváhagyott, közös dokumentum-/bizonyíték-azonosítón keresztül kapcsolódhat.

**Státusz: IN PROGRESS — CENTRAL DECISION REQUIRED a tartós shipment/manifest/custody állapotra. Következő Gate City előkészítési prioritás.**

### 12.2 Petar — személyes fuvar és kézbesítés
**Canon:** Petar, fuvarosmester; Külső kapu szekérállása; fn-petar, kind=transport, cost=25.

**VERIFIED runtime (alpha.26):**
- src/lib/content.ts: fn-petar 25 gold költséggel, itemIds nélkül.
- src/lib/store.ts: a transport generikus szolgáltatáságon fut; a jelenlegi hívás a 25 goldot levonja és lefuttatja a közös used() mellékhatásait. Nem találtam célállomás-választást, route resolver-t, kézbesítési eseményt, cargo custody-t vagy fuvarállapotot.
- src/lib/store.ts: save v6 normalizálásban nincs Petar fuvar-/kézbesítési rekord.

**Cél és loop (LOCAL GAMEPLAY PROPOSAL):** elérhető célpont kiválasztása → fuvar céljának meghatározása (játékos / csomag / tárgy) → útvonal és 25 gold díj előnézete → indulás megerősítése → fuvar állapotának követése → kézbesítés vagy biztonságos visszavonás → bizonylat és eredmény. A gyalogos alternatíva mindig elérhető, ha a helyszín már normál módon elérhető.

**Döntések és szabályok:**
- Normál fuvar: meglévő 25 gold alapköltség; további expressz/óvatos felár nincs jóváhagyva.
- Csak már feloldott, authored célpont választható; zárt régió vagy quest gate nem kerülhető meg.
- A szolgáltatás nem teleportálhat a régiók között, ha a meglévő travel rendszer ezt nem engedi.
- Siker: a célpont elérhető és a kézbesítés a megbízás szabályai szerint igazolható.
- Részleges: csak akkor definiálható, ha authored útvonal-esemény létezik; nincs random veszteség.
- Kudarc: invalid destination, hozzáférésvesztés vagy hiányzó jogosultság esetén a díj levonása előtt elutasítás; indulás utáni kudarc csak jóváhagyott útvonalállapot esetén.
- Quest item, evidence vagy más NPC-hez kötött tárgy nem adható át automatikusan.

**Erőforrás/gazdaság:** 25 gold jelenlegi díj; további költség vagy jutalom nincs forrásban. Kézbesítési jutalom kizárólag meglévő quest/contract jutalom lehet, egyszeri claimmel. A fuvar önmagában nem teremthet goldot vagy itemet.

**Állapot/UI:** quote → confirmed → inTransit → delivered vagy cancelled/failed; minden állapotnál cél, költség és következő lépés látszik. A játékos megerősítés előtt díjmentesen visszaléphet. A fuvar közben újratöltés után ugyanazt az állapotot kell visszaállítani, nem indíthat új díjfizetést.

**CENTRAL DECISION REQUIRED:** route graph / destination IDs, world travel integration, delivery receipt, item custody/transfer, save-state, idempotency. A jelenlegi currentRegion és regionAccess nem bizonyít városon belüli útvonalhálót; nem készülhet helyi route-state vagy teleport logika.

**Exploitvédelem:** egyetlen díjlevonás fuvaronként; ugyanaz a csomag nem kézbesíthető kétszer; item ownership és quest flags ellenőrzése; célpont nem manipulálható kliensoldali szöveggel; cancel indulás után csak authored szabály szerint.

**Tesztelhető elfogadás:** 25 gold quote; insufficient gold; locked destination; valid destination; confirm/cancel; duplicate confirm; reload in transit; deliver once; duplicate receipt; ownership changed; quest item; invalid destination; failed validation no charge; no region gate bypass; no currency/item duplication.

**Függőségek:** központi route/travel szerződés, item custody, transaction idempotency, quest reward claim. Csomag- és szállítmánykezelés Damarhoz csak közös, központilag jóváhagyott azonosítóval kapcsolódhat.

**Státusz: IN PROGRESS — CENTRAL DECISION REQUIRED route graph, delivery és custody állapotra.**

### 12.3 Vera Noll — érmevizsgálat és hiteles bizonyíték
**Canon:** Vera Noll, pénzváltó; Kapu melletti pénzváltó; fn-vera, kind=currency, nincs authored díj és nincs itemIds.

**VERIFIED runtime (alpha.26):**
- src/lib/content.ts: fn-vera leírása az érme eredetét és megbízhatóságát említi.
- src/lib/store.ts: currency generikus szolgáltatáság; a jelenlegi hívás nem kér be érme-instance-t, nem vizsgál metaadatot és nem állít elő hitelesítési eredményt. A used() általános NPC-funkció mellékhatásai futnak.
- A globális item shape tartalmaz origin, legalStatus, tags, questItem mezőket, de nincs önálló érme- vagy hitelesítési rekord. A Black Coin történeti tartalma védett.

**Cél és loop (LOCAL PROPOSAL):** vizsgálható, játékosnál lévő item kiválasztása → Vera megmutatja a ténylegesen létező itemdefiníció vizsgálható mezőit → a játékos kiválasztja, mely jegyeket szeretné ellenőrizni → a rendszer csak a forrásban szereplő adatot hasonlítja össze → eredmény: „adatok egyeznek”, „ellentmondás látható”, „nincs elegendő adat”. A vizsgálat nem módosítja az itemet.

**Szabályok:**
- Nincs olyan eredet/érmejellemző kitalálva, amely nem szerepel az item definícióban.
- Nincs aranyváltás vagy új pénznem; a gold nem reprezentál vizsgálható inventory itemet.
- legalStatus, origin, tags csak megjelenített forrásadat, nem bizonyíték arra, hogy a tárgy történetileg hamis/valódi, hacsak authored tartalom ezt explicit nem rögzíti.
- Alap adatlap olvasása ingyenes. Szakvéleménydíj nincs jóváhagyva.
- Nincs siker/kudarc RNG. Ha a forrás nem elegendő, az eredmény „nem eldönthető”.

**Hiteles bizonyíték:** a vizsgálat eredményének hiteles, más NPC által elfogadható bizonyítékká alakítása **CENTRAL DECISION REQUIRED**. Közös evidence ID, eredet, custody, hitelességi szint és ügyhöz kapcsolás nélkül Vera nem bocsáthat ki új bizonyíték-itemet és nem írhat Rovan/Cador ügyállapotot.

**UI/állapot:** itemSelected → fieldsReviewed → resultShown → closed; megszakítás bármikor, item és pénz nem változik. Üres inventory, nem vizsgálható tárgy, quest/evidence item és hiányzó metaadat külön állapotot kap.

**Exploitvédelem:** csak meglévő inventory instance választható; másolt ID és nem birtokolt item elutasítandó; a vizsgálat nem módosítja a legalStatus-t; ismételt vizsgálat nem ad XP-t/aranyat/evidence itemet; Black Coin quest item és Canon szöveg nem tárható fel új flag nélkül.

**Tesztelhető elfogadás:** item ownership; invalid instance; legal/restricted/evidence metadata megjelenítés; missing origin; missing tags; insufficient metadata; no mutation; no gold mint; no new currency; duplicate inspection no reward; reload; Black Coin guard; quest item preserved; fabricated metadata rejection.

**Függőségek:** központi evidence/document szerződés; Cador ledger input; Rovan case evidence; Black Coin Canon védelem.

**Státusz: IN PROGRESS — read-only appraisal lokálisan specifikálható; hiteles evidence kiadása CENTRAL DECISION REQUIRED.**

### 12.4 Jarek — térképek és útvonal-felfedezés
**Canon:** Jarek, térképkészítő; Kapuváros térképműhelye; fn-jarek, kind=map, cost=20.

**VERIFIED runtime (alpha.26):**
- src/lib/content.ts: fn-jarek 20 gold költséggel, item allow-list nélkül.
- src/lib/store.ts: map generikus szolgáltatáság; a jelenlegi hívás 20 goldot levon és a generikus used() mellékhatásokat futtatja. Nem módosít útvonalat, nem nyit discovery flaget és nem frissít térkép-instance-t.
- src/lib/types.ts: léteznek régió- és körzetdefiníciók; a GameData tartalmaz currentRegion és regionAccess adatokat. Per-route discovery state nem igazolt.
- Save v6: nincs térkép-felfedezési rekord.

**Cél és loop (LOCAL GAMEPLAY PROPOSAL):** térkép megnyitása → a játékos kiválaszt egy már ismert/feloldott helyet → Jarek megmutatja az oda vezető, már authored és engedélyezett útvonal információit → a játékos térképlapot vásárol 20 goldért vagy kilép → térkép megjelenik a játékos térképnézetében, amennyiben a meglévő UI ezt már támogatja.

**Döntések és szabályok:**
- A 20 gold a jelenlegi authored szolgáltatási díj; a vásárlás csak tényleges térképszolgáltatás esetén terhelhető.
- A Jarek panel nem nyithat meg zárt régiót és nem írhatja át a regionAccess értékét.
- A térkép csak a már ismert, authored adatot jelenítheti meg; ismeretlen útvonal/veszély nem generálható.
- Navigation stat adhat részletesebb leírást csak akkor, ha ezt a központi stat-szabály jóváhagyja; jelenleg nincs hozzá Jarek-specifikus küszöb.

**CENTRAL DECISION REQUIRED:** route graph és destination ID; discovery flag tulajdonosa; map item/instance vagy UI-only térkép; mentési séma; navigation stat hatása; cross-district map handoff Siven expedícióihoz. Új discoveredRoutes mező nem vezethető be lokálisan.

**UI/állapot:** mapHome → destinationSelected → routePreview → purchaseConfirmed → mapUpdated; cancelled minden megerősítés előtti pontból. Előnézetben útvonal, hozzáférés, költség, ismert akadály és adatforrás látható. Ha nincs érvényes útvonal, nincs vásárlási gomb és nincs díjlevonás.

**Exploitvédelem:** csak ismert célpont; nincs region gate bypass; 20 gold csak egyszer kerül levonásra; ugyanaz a térkép nem ad ismételt discovery XP-t; kliens által beküldött célpontot a canonical region/district listával kell validálni.

**Tesztelhető elfogadás:** known route; unknown route; locked region; invalid destination; price 20; insufficient gold; cancel no charge; duplicate purchase; reload; map visibility; no discovery mutation; no XP farm; navigation threshold only if approved; route data missing; no Siven dungeon gate bypass.

**Függőségek:** központi route graph/discovery; térkép UI; save contract; Siven expedíciók és a meglévő regionAccess rendszer.

**Státusz: IN PROGRESS — read-only térképnézet részben specifikálható; persistent route discovery CENTRAL DECISION REQUIRED.**

### 12.5 Kapuvárosi közös integrációs sorrend és stop gate
1. Alma PR review és tulajdonosi elfogadás — implementációs stop gate.
2. Damar részletes specifikáció véglegesítése, de shipment/custody modell nélkül nincs kódolás.
3. Központi döntés a shipment/manifest és dokumentum/bizonyíték szerződésről.
4. Petar fuvarállapot és Jarek route graph csak azonos központi útvonal- és custody szerződés alapján tervezhető tovább.
5. Vera read-only item appraisal önállóan megvalósítható lehet, de hiteles bizonyíték nem.
6. Minden NPC külön PR, külön review; közös store, types, save és quest fájlok módosítása csak explicit central change approval alapján.

**NPC státuszok:**
- Alma Varg — IMPLEMENTED ON gate-city/phase-2-alma BRANCH / PENDING CENTRAL REVIEW; nem ACCEPTED.
- Damar — IN PROGRESS; CENTRAL DECISION REQUIRED: shipment/manifest/custody.
- Petar — IN PROGRESS; CENTRAL DECISION REQUIRED: route/delivery/custody.
- Vera Noll — IN PROGRESS; read-only appraisal proposal; evidence issuance CENTRAL DECISION REQUIRED.
- Jarek — IN PROGRESS; CENTRAL DECISION REQUIRED: route graph/discovery/save.

No source implementation for Damar, Petar, Vera or Jarek is authorized by this document.


## 13. Alma Varg — PHASE 2 branch implementation source map

**Status: IMPLEMENTED ON WORKING BRANCH / PENDING CENTRAL REVIEW. Not ACCEPTED.**

Working branch: gate-city/phase-2-alma  
Active issue: #9  
Central tracker: #10

### Verified implementation references
- src/lib/content.ts — Alma NPC identity; fn-alma (kind inn, cost 60, item allow-list heartyStew and gateRations).
- src/lib/store.ts — useNpcFunction / inn handler. Rest is restricted to one hour; invalid rest duration is rejected. Food selection is validated against fn.itemIds and consumable type. Price, inventory capacity and current gold are checked before state mutation.
- src/lib/innService.ts — pure rest and food preview calculations. Rest restores ceil(10% max HP), capped to missing HP. Food preview reads the existing ItemDefinition effects.
- src/components/GameClient.tsx — NpcFunctionPanel. Shows one-hour rest price and HP preview; food cards and selected-food preview; pending action lock; disabled invalid purchase/rest controls; cancellation and aria-live result feedback.
- scripts/alma-inn-smoke.cjs — focused helper/source contract tests added and wired into npm test.
- package.json — test script now runs the focused Alma test before the existing smoke suites.

### Preserved content and persistence
- Rest: 60 gold, one hour, 10% maximum HP; no charge at full HP or when funds are insufficient.
- heartyStew: original healPercent 20 retained.
- gateRations: no healing effect exists in the current item definition; no effect was invented. UI states that it has no direct HP effect.
- InventoryItem remains instanceId/itemId.
- Save key remains aimorpg-final-demo-v1-29; saveVersion remains 6. No new persisted fields or migration added.
- 60 main quests and NPC Canon were not edited.

### Review caveats
- UI double-submit protection is a short-lived in-flight lock for the current client interaction. The existing store remains client-side and is not server-authoritative.
- Focused test file is committed but not executed in this environment because the repository could not be cloned into the local runtime (GitHub host DNS resolution failed). Full npm test, npm run lint and npm run build are therefore **NOT RUN**; no pass is claimed.
- Central review must inspect the diff and run checks in a dependency-complete checkout before accepting Alma.


## 14. PHASE 2 — project-owner decision update (2026-11-27)

This section supersedes earlier Damar statements that the choice of Shipment architecture model itself is pending. The project owner has approved:

- Shipment model A: one Shipment aggregate plus Shipment-scoped custody event log.
- Item/manifest-line-level partial receipt.
- Hybrid NPC transaction protection: client-side stable transaction ID and duplicate-execution guard for the initial single-player demo; this is not server security. Future server-authority transition must be documented.
- Risk-tiered authority: ordinary low-risk single-player demo may remain client-side initially; high-value, chance-based, competitive or future multiplayer-affecting economic settlement requires server authority before trusted release.
- A separate versioned migration plan before each new persistent domain state; no general save redesign.

### Damar status correction

**APPROVED ARCHITECTURAL DIRECTION — SPECIFICATION DETAIL IN PROGRESS.**

Damar's Shipment architecture choice is no longer a pending central decision. Continue the detailed domain/source specification using docs/GATE_CITY_DAMAR_PHASE2_ARCHITECTURE_DECISIONS.md.

Still unresolved and must remain explicitly open:
- quantity semantics against the existing instance-based InventoryItem model;
- whether a line may split quantities or must map one-to-one to item instances;
- exact custody transfer timing and permitted transitions;
- shipment terminal-state and hold-release rules;
- transaction ID scope/retention and same-ID/different-payload behavior;
- high-value transaction threshold and server deployment boundary.

The Shipment event log is shipment-scoped only. Do not create a universal event bus, parallel inventory or cargo stock registry.

### Independent Gate City work continues

- Petar route/delivery source verification and local specification continue; route graph and delivery custody details remain open only where they depend on missing shared contracts.
- Vera read-only appraisal/source verification continues; trusted evidence issuance and admissibility remain separate open contracts.
- Jarek map/route source verification continues; persistent discovery requires its own versioned migration plan.
- Alma remains on the separate PHASE 2 implementation branch and is NOT OWNER-ACCEPTED until the project owner explicitly accepts PR #11.

### Implementation gate

This update changes documentation status only. It does not authorize Damar, Petar, Vera or Jarek source implementation. Alma PR #11 remains draft/unmerged; no next NPC implementation may start before Alma owner acceptance and separate authorization.
