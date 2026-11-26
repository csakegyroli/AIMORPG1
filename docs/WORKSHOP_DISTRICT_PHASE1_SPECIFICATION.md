# AIMORPG — Műhelynegyed PHASE 2 / FOUR-NPC PREPARATION
## Alpha.26 runtime-alapú specifikációs csomag

**Baseline:** AIMORPG v2.0.0-alpha.26  
**Forráság:** main  
**Baseline commit:** 894e9606fa84f5d609d810152e326b1cfae09b18  
**Specifikációs ág:** workshop/phase-1-npc-specification  
**Mód:** SPECIFICATION ONLY — NO SOURCE CODE IMPLEMENTATION  
**Státusz:** a négy NPC munkacsomag dokumentációja elkészült; központi döntések PENDING.

> A korábbi workshop/phase-1-crafting-specialization ág különálló BRANCH CANDIDATE. Nem elfogadott, nem merge-ölt, nem része ennek a baseline-nak, és nem szolgáltat Canon- vagy runtime-igazolást.

## 1. A csomag dokumentumai

### Négy NPC-munkacsomag
1. Borin Vasmarok (garran): docs/workshop/BORIN_GARRAN_WORKPACKAGE_HU.md
2. Velka (velka): docs/workshop/VELKA_WORKPACKAGE_HU.md
3. Nara Bőrös (nara): docs/workshop/NARA_WORKPACKAGE_HU.md
4. Tomen (tomen): docs/workshop/TOMEN_WORKPACKAGE_HU.md

### Központi döntési és integrációs csomag
- Projektgazdai döntések részletesen: docs/workshop/CENTRAL_DECISIONS_WORKSHOP_HU.md
- Döntési regiszter: docs/workshop/WORKSHOP_CENTRAL_DECISION_REGISTER_HU.md
- Kereszt-NPC függőségek és tesztterv: docs/workshop/DEPENDENCIES_AND_TEST_PLAN_HU.md

## 2. Bizonyítéki és státuszszabály

A forrásból igazolt alpha.26 tények és a tervezési javaslatok külön vannak jelölve. A munkacsomagokban szereplő javaslat nem Canon, nem jóváhagyott mechanika és nem implementációs engedély.

Státuszok:
- VERIFIED / IMPLEMENTED: a main alpha.26 forrásból ellenőrzött adat vagy runtime.
- PARTIALLY IMPLEMENTED: a funkció adatban vagy store handlerben jelen van, de UI vagy teljes játékosút hiányzik.
- PROPOSAL: új játékosfunkció vagy UI-irány, központi review szükséges.
- BLOCKED: közös adatmodell, gazdaság, Canon vagy szerver-authority döntés nélkül nem véglegesíthető.
- SPECIFICATION COMPLETE: a jelenlegi runtime, javaslatok, nyitott kérdések, tesztterv és fájlhatárok dokumentálva; nem jelenti a READY FOR IMPLEMENTATION státuszt.

## 3. Alpha.26 runtime fő megállapítások

| NPC | Canon szerep | Funkció ID / kind | Alpha.26 runtime |
|---|---|---|---|
| Borin | Fegyverkovács | fn-garran / forge | közös regionális crafting és dismantle |
| Velka | Páncélkovács | fn-velka / forge | Borinnal azonos generic forge handler |
| Nara | Bőrműves | fn-nara / leatherwork | store handler létezik, a forge UI feltétel nem jeleníti meg a workbench-et |
| Tomen | Tanonc | fn-tomen / apprentice | 15 goldért global smithing +1 (max 50) és trade affinity +2 |

### Közös runtime tények

- A shared ItemDefinition katalógus a content modulban van.
- InventoryItem jelenleg instanceId és itemId mezőkből áll.
- A crafting recipe régióalapú, általános helperből származik.
- A külvárosi recipe másodlagos anyaga tannersWax; a felszerelés slotja határozza meg a workshopIron mennyiséget.
- A dismantle helper a recipe felét adja vissza, inputtípusonként legalább 1-et.
- A store client-side; localStorage save key: aimorpg-final-demo-v1-29; saveVersion: 6.
- A crafting handler nem különíti el Borint és Velkát; a Nara leatherwork handler is ugyanazt a craft/dismantle ágat használja.
- A Műhelynegyed NPC-funkciók sikeres használata a közös used() journal/reputation/first-use XP útvonalat használja.
- Durability, repair állapot, tartós +1–+9 enhancement és profession mastery nincs igazolva az alpha.26 item-instance/runtime modellben.

## 4. Fő küldetések védelme

A Műhelynegyedhez kapcsolódó meglévő fő küldetések:
- main_outskirts_04 — Borin, 20 workshopIron input.
- main_outskirts_06 — Velka, 3 tannersWax input.
- main_outskirts_11 — Nara, 3 tannersWax input.
- main_outskirts_12 — Tomen, 1 smithingKit input.

A 60 fő küldetés védett. A csomag nem módosít fő küldetést, rewardot, követelményt, choice-ot, sorrendet vagy quest state modellt. A smoke test a 60 quest és a 60 main story blueprint darabszámát ellenőrzi.

## 5. Központi döntések

Minden döntés PENDING, tulajdonosa a projektgazda:
- WD-01: +1–+9 itemfejlesztés.
- WD-02: durability / condition.
- WD-03: repair.
- WD-04: profession mastery.
- WD-05: recipe és output központi tulajdonosa.
- WD-06: sikertelen craft következménye.
- WD-07: alapanyagveszteség és dismantle yield.
- WD-08: tranzakciós, idempotency és duplikáció elleni védelem.

NPC-specifikus döntés: Borin és Velka termékköri határa; Velka önálló játékosértéke; Nara jóváhagyott bőranyag- és outputkatalógusa; Tomen oktató vagy tanulótárs szerepe, valamint smithing capnél a 15 goldos képzés kezelése.

## 6. Függőségek és tesztkapu

A függőségi és tesztterv külön dokumentumban található. Kiemelt ellenőrzések:
- craft/dismantle input-output egyensúly és inventory 80-as cap;
- protected quest/evidence/relic itemek;
- NPC schedule és runtime presence;
- client-side state és dupla végrehajtás;
- save/reload és instance uniqueness;
- Nara UI/store eltérés;
- Velka repair felirat és tényleges handler eltérése;
- Tomen smithing 50-es cap edge case;
- 60 fő küldetés snapshot változatlansága.

A tesztek ebben a specifikációs munkában nem futottak. A dokumentumok teszttervet, nem teszteredményt tartalmaznak.

## 7. Forrásjegyzék — alpha.26 main

- src/lib/content.ts — NPC, NPC_FUNCTIONS, NPC_STORIES, ITEMS, kerületi Canon; blob 27206c65e37c5cc3b47d0257d91b1654f8971b95.
- src/lib/itemSystem.ts — craftRecipeForItem és dismantleYieldsForItem; blob e8c1220ceb563e1e10ef0064ec9be4991d0bf475.
- src/lib/store.ts — useNpcFunction, save/load, localStorage; blob 60fc472f8eeefd940aa25e226e3a1aa3a20b1aba.
- src/lib/types.ts — InventoryItem, NpcFunctionDefinition, ItemDefinition; blob 443f69f61193917131c1c52784c2056c25f9cd3d.
- src/lib/rules.ts — makeInventoryItem; blob bc79941f9f9731cccffd6bc17ba8b0eda2534ffe.
- src/lib/simulation.ts — NPC presence, relationship facets; blob 76af3656c21acbddab905a0905533e88ba47fbc4.
- src/components/GameClient.tsx — NPC panel, forge UI, schedule display; blob 41743815f9b780e2dbad7d448e068a6a894988be.
- src/lib/mainStory.ts — 60 main story blueprints and four workshop quests; blob 9f0b8f5dbd55f4952b0be08ba8c63fc782584b20.
- scripts/smoke-test.cjs — 60 quest assertions, item instance and workshop quest tests; blob a98874eb285afec919f54a3d42b74f58ee8e816a.

## 8. Fájl- és jogosultsági nyilatkozat

A specifikációs ágon kizárólag docs/workshop és a jelen index dokumentációs fájljai módosulnak. Forráskód, shared type, item, recipe, store, UI, save, economy, main quest vagy más district file nem módosítható. Nincs implementációs branch, nincs merge, nincs Canon-változtatás.

**Végső státusz:** mind a négy NPC SPECIFICATION COMPLETE — IMPLEMENTATION NOT AUTHORIZED; a központi döntések PENDING.
