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

---

## 12. TARGETED GAP CLOSURE — EVIDENCE & MAIN QUEST PROTECTION (v0.3)

**Státusz:** SOURCE-VERIFIED SPECIFICATION ADDENDUM — NO IMPLEMENTATION.  
**Alpha.26 baseline:** main commit 2190291a6a58fe907f5aa737e4c466a6f334a08c.  
**Target document branch:** watch-district/phase-1-specification.  
**Scope:** kizárólag quest/case source map, dokumentum-item katalógus, közös evidence/provenance javaslat és a 60 főquest regressziós védelme. A 10. fejezet négy NPC-specifikációját ez a kiegészítés nem írja újra.

### 12.1 Source map — Canon, authored quest és runtime elkülönítése

#### A. A négy NPC azonosítása és tényleges funkciója

| NPC | Alpha.26 Canon-adat | NPC function | Tényleges runtime |
|---|---|---|---|
| Rovan | Városi őrkapitány; Külváros / Watch; Jelentőterem; 05:00–21:00. NPC_STORIES motivációja a rend és vak engedelmesség közötti különbség; eltűnt adószállítmány foglalkoztatja. | fn-rovan / security | A store közös NPC-service ágában fut. Nincs Rovan-specifikus case- vagy evidence-kezelő. |
| Lena Varr | Jegyző; Külváros / Watch; Pecsételő iroda; 07:00–17:00. A város hivatalos emlékezetét akarja tisztán tartani. | fn-lena / documents / cost 20 | A közös service ágban fut. A 20 gold levonódik; nincs dokumentumválasztás, másolatgenerálás, mezőellenőrzés vagy hitelesítési állapot. |
| Bran | Fogdaőr; Külváros / Watch; Kisfogda; 18:00–06:00. Canon szerint a fogda ne legyen bosszú eszköze. | fn-bran / jail | A közös service ágban fut. Nincs fogdai rekordlekérdezés, warrant/permission ellenőrzés vagy adatmező-szűrés. |
| Orren | Járőrparancsnok; Külváros / Watch; Őrkapu-udvar; 06:00–18:00. Canon szerint felismeri a város ismétlődő mintáit; a hatperces rés a főquest történetének része. | fn-orren / guardPatrol | A közös service ágban fut. Nincs útvonal-, járőr-session-, megfigyelési vagy jelentésrekord-runtime. |

**Közös jelenlegi viselkedés — store.ts / useNpcFunction():**
1. Ellenőrzi az NPC és az NPC-function létezését.
2. Ellenőrzi az aktuális régiót és az NPC jelenlétét a világóra alapján.
3. A security, documents, jail és guardPatrol mind ugyanabba a generic switch ágba esik.
4. Az ág a function itemIds listájából választana tárgyat, majd a tárgy vagy a function cost alapján számol. Rovan, Bran és Orren esetén nincs itemIds és nincs költség; Lena esetén 20 gold költség van.
5. Az ág nem ellenőriz bizonyíték-eredetet, custody-t, dokumentum-hitelességet, fogdai engedélyt vagy patrol route-ot. A sikeres generic használat naplóbejegyzést és általános aktivitás/kapcsolati előrelépést rögzít; az NPC leírását adja vissza.
6. A useNpcFunction ezen a ponton nem hív külön case-, evidence-, permission- vagy patrol-resolver függvényt. A régió-hozzáférés explicit ellenőrzése az interactNpc/travel/main-quest útvonalakban is megjelenik; ezt nem szabad összetéveszteni a fogdai jogosultsággal.

**Tervezett jövőbeli kiterjesztés — nem engedélyezett:** a négy funkció a központilag jóváhagyott közös contractokat fogyasztaná. Egyik NPC sem kap saját, párhuzamos case/evidence/permission/time/simulation modellt.

#### B. Authored quest-hookok és choice ID-k

A 60 authored main quest a mainStory.ts R blueprint tömbjéből kerül a content.ts QUESTS tartalmába. A QuestDefinition szerződésben choices tömb van; külön step/stepId mező nincs. A fő küldetés lépéseit a jelenlegi forrásban a quest node ID, a követelmények, a choices és a sorrend/chapter adatok képviselik. A questDesign.ts DRAMA és uniqueBeats tömbjei szöveges dramaturgiai anyagok, nem runtime case-step rekordok.

**A négy Watch NPC-hez kapcsolódó védett hook:**

| Quest node | Giver / core hook | Support hook | Item hook |
|---|---|---|---|
| main_outskirts_02 — Pecsét a jelentőteremben | rovan / fn-rovan | lena / fn-lena | nincs |
| main_outskirts_20 — A hiányzó pecsét | lena / fn-lena | cador / fn-cador | watchSeal / document |
| main_outskirts_21 — A csendes fogda | bran / fn-bran | rovan / fn-rovan | nincs |
| main_outskirts_22 — A hatperces rés | orren / fn-orren | rovan / fn-rovan | nincs |

**A négy node tényleges követelményei és jutalmai a mainStory.ts alapján:**
- main_outskirts_02: 1 × watchSeal, consume=true; jutalom 1 × rustedKey.
- main_outskirts_20: 1 × watchSeal, consume=true; jutalom 1 × royalTransitPass.
- main_outskirts_21: 1 × royalTransitPass, consume=false; jutalom 1 × captainsLogPage.
- main_outskirts_22: 1 × captainsLogPage, consume=false; jutalom 1 × blackCoinCargoTag.

**A négy node choice ID-i** (a mainStory.ts A() helperének jelenlegi auto-ID képzése alapján; nem újonnan kiosztott ID-k):
- **main_outskirts_02:** auto_hivatalosan_jelzem, auto_el_bb_mag_nban_ellen_rz_, auto_k_rdez_sk_d_m_a_folyos_n, auto_megfigyelem_ki_f_l, auto_elteszem_a_m_solatot
- **main_outskirts_20:** auto_hivatalosan_hiteles_tek, auto_a_pap_r_eredet_t_keresem, auto_elrejtem_a_m_solatot, auto_megk_rdezem_ki_k_rte, auto_kifinomult_alkut_aj_nlok
- **main_outskirts_21:** auto_az_iratokb_l_indulok, auto_embert_k_rdezek, auto_kihaszn_lom_az_jszak_t, auto_nyom_st_gyakorlok, auto_brannal_alkuszom
- **main_outskirts_22:** auto_percre_pontosan_dolgozom, auto_a_j_r_r_ket_k_rdezem, auto_a_r_sben_mozogok, auto_a_rakjegyet_k_vetem, auto_orrent_rsul_sra_p_tek

A mainQuestAudit.ts auditbejegyzéseiben a fenti hookok szerepe és narratív használata rögzített. A narrativeUse mezők leíró audit-szövegek; nem külön futtatható case flag-ek.

#### C. Mind a 60 jelenlegi főquest node ID

A mainStory.ts alpha.26 R tömbjének forrásból kiolvasott 60 ID-ja:
- **Külváros (24):** main_outskirts_01, main_outskirts_02, main_outskirts_03, main_outskirts_04, main_outskirts_05, main_outskirts_06, main_outskirts_07, main_outskirts_08, main_outskirts_09, main_outskirts_10, main_outskirts_11, main_outskirts_12, main_outskirts_13, main_outskirts_14, main_outskirts_15, main_outskirts_16, main_outskirts_17, main_outskirts_18, main_outskirts_19, main_outskirts_20, main_outskirts_21, main_outskirts_22, main_outskirts_23, main_outskirts_24
- **Aréna (8):** main_arena_01, main_arena_02, main_arena_03, main_arena_04, main_arena_05, main_arena_06, main_arena_07, main_arena_08
- **Kereskedelmi Központ (10):** main_market_01, main_market_02, main_market_03, main_market_04, main_market_05, main_market_06, main_market_07, main_market_08, main_market_09, main_market_10
- **Belváros (7):** main_inner_01, main_inner_02, main_inner_03, main_inner_04, main_inner_05, main_inner_06, main_inner_07
- **Palota (5):** main_palace_01, main_palace_02, main_palace_03, main_palace_04, main_palace_05
- **Kikötő (6):** main_harbor_01, main_harbor_02, main_harbor_03, main_harbor_04, main_harbor_05, main_harbor_06

**Forrásból ellenőrzött darabszám:** mainStory.ts = 60 authored blueprint; mainQuestAudit.ts = 60 auditkulcs. A QuestDefinition nem definiál külön quest step listát vagy step ID mezőt. A fenti négy quest choice ID-ja a konkrét NPC-hookokhoz került külön felsorolásra.

#### D. Case flag-ek, side quest állapotok és narrative tagek

**Canon case ≠ runtime case.** Rovan eltűnt adószállítmány-ügye, a fogoly, a hatperces járőr-rés, illetve az NPC_STORIES háttértörténete authored Canon/történeti tartalom. A forrásban nem találtam ezekhez dedikált, tartós Case aggregate-et vagy CaseDefinition/CaseRuntime modellt.

A jelenlegi, ténylegesen létező narrative/runtime szerkezet:
- DynamicWorldLayer.flags: általános Record<string, string | number | boolean>; az inicializált érték üres objektum. A sanitizer típushelyességet ellenőriz, de nem definiál Watch case flag namespace-t vagy case lifecycle-t.
- DynamicNarrativeEvent: event ID, type, at, opcionális questId/npcId/region, tags, summary és importance. A type enum tartalmazza a world_flag értéket, de ez nem önmagában bizonyítékrekord vagy case aggregate.
- SideQuestBlueprint: dynamicOnly=true, source/opportunity/giver/region/objective/choiceSpace/consequencePlan/canonReferences. A consequencePlan megengedett típusa lehet world_flag; ez tervezett következmény-leírás, nem automatikusan létrehozott globális evidence vagy authored case.
- RuntimeSideQuest: id, opportunityId, blueprint, status, createdAt, updatedAt, opcionális expiresAt és sourceSignature. A státusz offered/active/completed/failed/expired/declined. Ez dinamikus melléktörténet-állapot, nem a négy Watch NPC Canon-ügyeinek runtime reprezentációja.
- A NarrativeRuntimeState sideQuests, dialogue és worldEvents részekből áll; nincs case/evidence/custody/permission mező.
- A narrative memory és event tagek szabad string-listák (például quest/main/chapter, success/failure, consequenceTag, relationship, night, memory, world-reaction). Nem létezik központi, típusos evidence tag taxonómia.

**Tervezett kiterjesztés:** egy opcionális Watch case később hivatkozhat jóváhagyott authored quest/case azonosítóra, evidence reference-re vagy sidequest rekordra. Ezek egymással nem felcserélhetők. SideQuestRuntime ID nem nevezhető át caseId-vé, és egy Canonban említett eset nem tekinthető automatikusan futó runtime case-nek.

### 12.2 Dokumentum- és bizonyítékjellegű item katalógus

A következő lista a BASE_ITEMS alpha.26 definícióit rögzíti. A tags mező hiánya azt jelenti, hogy a definíció nem deklarál tags tömböt; nem jelenti azt, hogy üres vagy hitelesített. A questItem mező hiánya nem azonos a true értékkel.

#### A. Authored document kategória

| Item ID | Origin | legalStatus | tags | questItem | sellable / marketEligible | Besorolás |
|---|---|---|---|---|---|---|
| streetMap | Külváros · Régi Piac | legal | nincs deklarálva | nincs deklarálva | true / true | authored dokumentum/térkép; main_outskirts_10 tool hook |
| watchSeal | Külváros · Őrségi Negyed | restricted | nincs deklarálva | nincs deklarálva | true / true | authored dokumentum; main_outskirts_01 jutalom, main_outskirts_02 és 20 fogyasztott követelmény, main_outskirts_20 document hook |
| matchLedger | Aréna · Nézők Negyede | restricted | nincs deklarálva | nincs deklarálva | true / true | authored dokumentum; potenciális forrás, de nincs Watch hitelesítési hook |
| sealedLedger | Kereskedelmi Központ · Raktárgyűrű | restricted | nincs deklarálva | true | false / false | authored quest document; main_outskirts_14 evidence hook |
| guildPermit | Kereskedelmi Központ · Céhesor | restricted | nincs deklarálva | nincs deklarálva | true / true | authored engedély-dokumentum; nincs Watch permission contract |
| promissoryNote | Belváros · Főkönyv Udvar | restricted | nincs deklarálva | nincs deklarálva | true / true | authored pénzügyi dokumentum |
| patronInvitation | Belváros · Mecénások Negyede | restricted | nincs deklarálva | true | false / false | authored quest document |
| debtMarker | Belváros · Elefántcsont Árkádsor | evidence | nincs deklarálva | true | false / false | potenciális bizonyíték; dokumentum kategória, de nincs példányszintű hitelesség |
| courtInvitation | Palota · Üveggaléria | restricted | nincs deklarálva | true | false / false | authored quest document |
| royalArchiveCopy | Palota · Királyi Archívum | restricted | nincs deklarálva | nincs deklarálva | true / true | authored dokumentummásolat; main_outskirts_23 clue hook |
| navigatorChart | Kikötő · Szabad Kikötő | legal | nincs deklarálva | nincs deklarálva | true / true | authored navigációs dokumentum/térkép |
| royalTransitPass | Királyi hivatal | restricted | nincs deklarálva | true | false / false | authored quest/access document; main_outskirts_21 nem fogyasztott követelménye |

#### B. Egyéb quest/evidence-jellegű itemek

| Item ID | category | origin | legalStatus | tags | questItem | sellable / marketEligible | Megjegyzés |
|---|---|---|---|---|---|---|---|
| sealedLetter | quest | Ismeretlen | evidence | nincs deklarálva | true | false / false | authored quest item; main_outskirts_03 jutalom |
| blackCoinLedgerFragment | quest | Kereskedelmi Központ · rejtett raktár | evidence | nincs deklarálva | true | false / false | authored quest item; main_outskirts_05 jutalom |
| blackCoin | relic | Ismeretlen | evidence | nincs deklarálva | true | false / false | fő történeti tárgy; main_outskirts_09 evidence hook |
| silentWellVial | relic | Külváros · Régi Perem | legal | nincs deklarálva | nincs deklarálva | true / true | authored tárgy; main_outskirts_05 material/evidence-szerű vizsgálati input, de legalStatus nem evidence |
| arenaBlackToken | contraband | Aréna · rejtett fogadások | illegal | nincs deklarálva | nincs deklarálva | true / true | item hook szerepel a main_outskirts_17-ben; nem hitelesített bizonyíték |
| captainsLogPage | quest | Kikötő · Vasrakpart | evidence | nincs deklarálva | true | false / false | authored quest item; main_outskirts_21 jutalma és main_outskirts_22 nem fogyasztott követelménye |
| blackCoinCargoTag | quest | Kikötő · Éjjeli Raktárak | evidence | nincs deklarálva | true | false / false | authored quest item; main_outskirts_22 jutalma |

**Hitelesített bizonyíték státusz: GAP.** Az alpha.26 ItemDefinition mezői között nincs authenticityStatus, issuer, signature/seal verification, registry reference, acquiredAt, custody history vagy per-instance provenance. Az InventoryItem csak instanceId és itemId. A legalStatus="evidence" jogi/tartalmi kategória, nem hitelességi vizsgálat eredménye. A document category és az origin szöveg önmagában nem bizonyít eredetet vagy sértetlenséget.

**watchSeal kockázat — változatlanul hagyandó:** a főquesthez kötött item jelenleg sellable=true és marketEligible=true, questItem nincs true-ra állítva. Az itemSystem isQuestItem() csak questItem vagy category="quest" alapján tekinti quest itemnek; ezért a jelenlegi helper-szabályok szerint a watchSeal eladható/piacképes. Ez forrásból igazolt kockázat, de ebben a munkában nem módosítható. Központi döntés és külön regressziós védelem szükséges.

### 12.3 Egyetlen közös Evidence/Provenance javaslat — Damar Shipment modellhez illesztve

**Kiinduló központi döntés:** a Gate City Damar döntési csomagja és az OUTSKIRTS shared architecture ADR-P2-002/003 jóváhagyta az egy Shipment aggregate + Shipment-scoped custody event log modellt, a manifest-line szintű eredményekkel. Ez nem univerzális event bus, nem új inventory és nem általános event-sourcing rendszer.

**Javaslat: közös Evidence Reference / Evidence Envelope**, amely egyetlen hivatkozási rétegként kapcsolhat különböző forrásokat:
- shipment;
- manifest / manifest line;
- inspection;
- document / document item instance;
- NPC statement;
- item instance;
- authored quest / authored case.

**Kizárólag javasolt, nem jóváhagyott fogalmak/mezők:**

| Javasolt mező | Jelentés | Forrás / tulajdonos | Állapot |
|---|---|---|---|
| evidenceId | stabil evidence reference ID | közös Evidence contract | CENTRAL DECISION REQUIRED |
| evidenceType | a bizonyíték szerepe/típusa | közös taxonomy | CENTRAL DECISION REQUIRED |
| sourceType | shipment / manifest / inspection / document / npc_statement / item_instance / authored_quest / authored_case | source registry | CENTRAL DECISION REQUIRED |
| sourceId | a forrás stabil ID-ja | a forrás-domain tulajdonosa | CENTRAL DECISION REQUIRED |
| acquiredAtWorldTime | a megszerzés világidő-pillanata | közös worldTime API és evidence contract | CENTRAL DECISION REQUIRED |
| custodyEventRefs | a releváns custody események referenciái | shipment esetén a Shipment saját custody logja; más domain csak jóváhagyott logja | CENTRAL DECISION REQUIRED |
| sealStatus | a forrás pecsétjének/lezárásának állapota | source-domain validáció | CENTRAL DECISION REQUIRED |
| authenticityStatus | ellenőrzés eredménye, külön a custody állapottól | közös hitelességi szabály | CENTRAL DECISION REQUIRED |
| linkedCaseId | opcionális kapcsolat egy explicit case-hez | authored case registry vagy jóváhagyott runtime case owner | CENTRAL DECISION REQUIRED |

**Damar-integrációs invariánsok:**
1. Ha sourceType shipment/manifest/inspection, a sourceId a Damar Shipment aggregate, manifest line vagy inspection rekord stabil azonosítójára mutat.
2. A custodyEventRefs a Shipment-scoped custody log eseményeire mutat. Az Evidence Reference nem másolja át és nem birtokolja újra a custody történetet.
3. A shipment/manifest/inspection custody esemény nem bizonyít automatikusan dokumentumhitelességet, bűnösséget, quest teljesítést vagy bizonyíték elfogadhatóságot.
4. A részleges átvétel/hold/reject a Damar manifest line eredménye marad; a Watch csak referenciát fogyaszt.
5. NPC statement, document vagy item instance forrás esetén a jelenlegi alpha.26-ban nincs megfelelő per-instance provenance/custody rekord. Ilyen forrás csak központilag jóváhagyott source adapter után válhat hiteles Evidence Reference-é.
6. Authored quest ID, authored case ID, sideQuest runtime ID és evidenceId külön fogalmak; egyik sem használható a másik helyett.
7. Nincs párhuzamos Watch custody log, globális evidence event bus vagy új inventory.

**Nyitott központi döntések:** mezőnevek és kötelező/opcionális szabályok; evidenceType taxonomy; source registry és referenciák élettartama; világidő reprezentáció; custody és authenticity külön állapotgépe; statement hitelesítése; item-instance provenance tárolása; linkedCaseId referált entitásának tulajdonosa; duplikációs kulcs és deduplikáció; save/migration; szerveroldali authority határ.

**Biztonságos ideiglenes szabály:** ha a source eredete vagy a custody hiányos/ismeretlen, az adat „ismeretlen / nem ellenőrzött” marad; nem emelhető automatikusan hiteles bizonyítékká. A Rovan UI megjelenítheti a forrás és hiányosság tényét, de nem állíthat be új globális státuszt.

### 12.4 60 főquest regressziós védelmi kritériumok

#### A. Védett invariánsok

1. QUESTS node count pontosan 60; MAIN_QUEST_AUDIT kulcsok száma pontosan 60.
2. A fenti 60 quest ID készlet pontosan egyezzen a baseline készlettel; nincs átnevezés, törlés, duplikálás vagy új főquest node.
3. Minden quest teljes authored definíciója változatlan: giver, region, chapter, sequence, requires, requirements (itemId/count/consume/gold/reputation/stat/NPC relationship), minReputation, entryCost, unlocks, nextQuest, choices ID/label/text/stat/requirement/reward/reputation/relation/consequenceTag, rewards és dramaturgy.
4. A négy Watch hook, a core/support szerepek és a mainQuestAudit narratív használata változatlan.
5. A main_outskirts_20 watchSeal item hook változatlan.
6. A négy NPC ID, NPC_FUNCTIONS ID/kind/cost/itemIds és a Canon-definíció nem változhat a Watch opcionális fejlesztés miatt.
7. Opcionális Watch progression hiányában vagy teljes kikapcsolásakor a 60 főquest a meglévő feltételek és a meglévő runtime szerint elindítható és teljesíthető marad.
8. Egyetlen főquest sem kaphat opcionális case/evidence/permission/patrol flaget új prerequisite-ként.
9. Watch opcionális action nem hívhatja a main quest start/resolve útvonalat, nem módosíthat questStatus-t, mainQuestFollowing-ot, trackedQuestId-t, rewardRolls-ot, főquest itemet vagy quest sorrendet.
10. A 60 questhez tartozó Canon és Dynamic Layer tartalom nem írható át csendben; a narrative event/memory csak a jóváhagyott opcionális domainhez kapcsolódhat.

#### B. Kötelező automatizált tesztek

| Test ID | Setup / művelet | Elvárt eredmény |
|---|---|---|
| MQ-01 | QUESTS és MAIN_QUEST_AUDIT betöltése | mindkét darabszám 60 |
| MQ-02 | teljes quest ID lista baseline-hoz hasonlítása | pontos egyezés |
| MQ-03 | minden quest normalizált snapshotja | mélyegyezés, minden mező |
| MQ-04 | négy NPC hook snapshot | hét function hook pontosan egyezik |
| MQ-05 | main_outskirts_20 item hook | watchSeal/document változatlan |
| MQ-06 | opcionális Watch state üres/nem létezik; meglévő quest prerequisite-ek teljesítve | főquest start és resolve működik |
| MQ-07 | opcionális Watch state aktív/lezárt | a főquest státusz és eredmény nem változik |
| MQ-08 | hiányzó evidence | opcionális case nem fogadja el; főquest state nem változik |
| MQ-09 | hamis vagy ismeretlen dokumentum | nem hitelesíthető; főquest state nem változik |
| MQ-10 | custody break | bizonyíték elfogadása blokkolt vagy központi szabály szerinti felülvizsgálat; nincs main quest mutation |
| MQ-11 | duplikált evidence reference / azonos sourceId | deduplikáció vagy determinisztikus elutasítás; nincs dupla reward |
| MQ-12 | idegen linkedCaseId | másik ügyhöz tartozó bizonyíték nem fogadható el |
| MQ-13 | jogosulatlan access Bran funkción keresztül | adatkiadás elutasítva; nincs state leak |
| MQ-14 | opcionális funkció reload/replay | nincs duplikált evidence/custody/reward |
| MQ-15 | watchSeal eladás/piac | a baseline item-szabályt snapshot védi; eltérés csak külön központi döntéssel |
| MQ-16 | 60 quest regresszió opcionális narrative runtime nélkül | a főquest lánc változatlanul végigjátszható |

A tesztek itt követelmények; ebben a dokumentációs munkában nem futottak le. Implementáció előtt determinisztikus fixture-ökkel és baseline snapshotból kell őket automatizálni.

#### C. Opcionális progression elkülönítése — explicit szabály

A főquest elérhetőség jelenlegi forrása a QUESTS státusz, regionAccess, giver jelenlét, q.requires, minReputation és entryCost ellenőrzése a store startQuest/nextMainQuestId útvonalain. A melléktörténet runtime külön narrativeState.runtime.sideQuests alatt él.

Ezért a Watch opcionális progression jövőbeli feltétele nem kerülhet be a QuestDefinition.requires vagy requirements mezőbe. A Watch rendszer hiánya, üres állapota, lejárata, visszautasítása vagy sikertelensége nem akadályozhatja a main quest indítását, teljesítését vagy fail-forward kimenetét.

### 12.5 Pontos alpha.26 forrás- és commit hivatkozások

**Baseline main commit:** 2190291a6a58fe907f5aa737e4c466a6f334a08c.  
**Watch branch a kiegészítés előtt:** ad3f76e21d35bb9fbbae70682f337de18dbec494.  
**Watch branch compare:** main ↔ watch-district/phase-1-specification = diverged; 4 ahead / 2 behind. A kiegészítés kizárólag a Watch branch dokumentumát módosíthatja.

| Forrás | Pontos azonosító / függvény | Blob SHA |
|---|---|---|
| src/lib/mainStory.ts | R blueprint, 60 quest node; négy Watch node és choice ID-k | 9f0b8f5dbd55f4952b0be08ba8c63fc782584b20 |
| src/lib/content.ts | NPCS, NPC_FUNCTIONS, NPC_STORIES, BASE_ITEMS, QUESTS export | 27206c65e37c5cc3b47d0257d91b1654f8971b95 |
| src/lib/mainQuestAudit.ts | MAIN_QUEST_AUDIT; 60 kulcs és NPC/item hookok | 95a94245a1947d33f299971f03d5917709761126 |
| src/lib/questDesign.ts | MAIN_QUEST_DESIGN, DRAMA, uniqueBeats; szöveges dramaturgia, nem case runtime | 52fc81490d3236a5b37ab0ae04f5142d4f82a8cf |
| src/lib/narrative.ts | DynamicWorldLayer, SideQuestBlueprint, RuntimeSideQuest, buildDeterministicRuntime, flags sanitizer | 8410c65679a5a26c659aa60706c157df2f87d82b |
| src/lib/types.ts | ItemDefinition, InventoryItem, QuestChoice, QuestDefinition | 443f69f61193917131c1c52784c2056c25f9cd3d |
| src/lib/store.ts | startQuest, resolveQuest, useNpcFunction, accept/resolveSideQuest | 60fc472f8eeefd940aa25e226e3a1aa3a20b1aba |
| src/lib/itemSystem.ts | isQuestItem, isMarketEligible, isSellable | e8c1220ceb563e1e10ef0064ec9be4991d0bf475 |
| src/lib/expansionItems.ts | kiegészítő item definíciók ellenőrzése | d62ba1cfd6f51f11763a77b968d002d624135483 |
| docs/OUTSKIRTS_PHASE1_SHARED_ARCHITECTURE.md | ADR-P2-002/003 Shipment aggregate + scoped custody; Watch cross-district alkalmazás | eef428d8ea3ee5bc9b05240e38f218ccc776fa4d |
| docs/GATE_CITY_DAMAR_PHASE2_ARCHITECTURE_DECISIONS.md | Damar owner-approved Shipment architecture | 66f5e1eecd6f4863c8a1abf4cd3831c1c6dc3984 |

**Kiemelt forráshelyek:** content.ts NPC sorok 276, 335–337; NPC function sorok 424, 478–480; NPC_STORIES sorok 497, 515–517; dokumentum itemek sorok 63, 65, 84, 86, 123–126 és a további document kategóriájú itemdefiníciók. mainStory.ts négy Watch node a 23. és 41–43. sorokban. mainQuestAudit.ts négy Watch hook a 13–20. és 175–200. sorokban. store.ts useNpcFunction a 568–677. sorokban; main quest start/resolve a 432–495. sorokban. narrative.ts DynamicWorldLayer és sidequest runtime típusok a 37–143. sorokban; a dynamic flag kezdeti értéke és sanitizálása a createInitialNarrativeState/sanitizeNarrativeState függvényekben.

**Damar tulajdonosi döntés forrása:** gate-city/phase-1-specification branch, commit a46e79e8ae7260b5248c8efe987a82b2b55dd523; docs/GATE_CITY_DAMAR_PHASE2_ARCHITECTURE_DECISIONS.md. Ez a shipment-domain modellre vonatkozó jóváhagyott irány; a Watch Evidence Reference mezői ettől még nem jóváhagyottak.

### 12.6 Gap closure státusz

- Quest/case source map: SOURCE VERIFIED; Canon case és runtime sidequest/case különválasztva.
- Quest node ID-k: 60/60 rögzítve.
- Watch NPC hookok és choice ID-k: rögzítve.
- Dokumentum-item katalógus: source-derived; a hitelesített bizonyíték mezőmodell hiány.
- Közös evidence/provenance: egyetlen Damar Shipment-kompatibilis javaslat elkészült; mezőlista CENTRAL DECISION REQUIRED.
- Main quest regression: invariánsok és kötelező tesztek rögzítve; tesztek nem futottak.
- Source code: változatlan.
- Merge: nem történt.
- További NPC-specifikáció újraírás: nem történt.

**Elfogadási korlát:** a jelen kiegészítés dokumentációs gap closure. Nem engedélyez evidence runtime, case runtime, dokumentum-hitelesítő, Bran permission vagy Orren patrol implementációt.
