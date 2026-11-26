# Műhelynegyed — függőségi térkép és tesztterv
## Alpha.26 kereszt-NPC és kerületközi integráció

**Baseline:** main · AIMORPG v2.0.0-alpha.26 · 894e9606fa84f5d609d810152e326b1cfae09b18  
**Branch:** workshop/phase-1-npc-specification  
**Státusz:** **SPECIFICATION COMPLETE — CENTRAL CONTRACTS PENDING**  
**Mód:** dokumentáció; nincs forráskód-implementáció.

## 1. Négy NPC közötti függőségi térkép

| Producer / NPC | Fogyasztó | Forrásból igazolt kapcsolat | Specifikációs következmény |
|---|---|---|---|
| Borin (garran) | Tomen | Borin kovács és Tomen tanonc; Tomen questje a hibás szerszámot és kovácstudást említi | ne legyen külön item/recipe modellek |
| Borin | Velka | mindkettő forge handleren fut | slot- és szolgáltatási határt központilag kell jóváhagyni |
| Borin | Nara | közös workshopIron, közös region recipe helper | Nara bőranyag-igénye nem oldható meg a helper önkényes felülírásával |
| Velka | Nara | main_outskirts_11 egyik választása: a játékos megmutatja a mintát Velkának | történeti handoff létezik; új state nem következik belőle |
| Nara | Régi Piac | main_outskirts_11 reveal a céhes karavánjelhez vezet; jutalom tradeSilk | beszállítói eredet / kereskedelmi lánc |
| Nara | Kikötő | NPC story szerint ritka bőr egy hivatalosan be nem futott hajóról érkezett | a hajó eredetének feltárása cross-district story függőség |
| Velka | Régi Piac / Kikötő | hibás fémbetétszállítmány közös forrásból érkezett; secret beszállítói név | supplier provenance nem új lokális item stat |
| Tomen | Régi Piac | main_outskirts_12 reward 2 merchantInk | meglévő item jutalom, nem mastery token |
| Borin | Kapuváros / Vera | Borin quest jelölt vasai későbbi súly-/fémvizsgálati témával összefüggnek | ne legyen külön kovács-érme rendszer |
| Mind a négy | közös inventory/economy | közös InventoryItem, gold, item catalogue, regional recipes | egyetlen shared source of truth |

**Fő quest források:** src/lib/mainStory.ts:25, 27, 32-33; src/lib/content.ts:499, 501, 506-507.

## 2. Kereszt-NPC játékosút — csak a meglévő fő történet megőrzésével

A jelenlegi fő történeti sorrend a Műhelynegyed érintett csomópontjain:
1. main_outskirts_04 — Borin: 20 Műhelyvas és a régi mesterjel.
2. main_outskirts_06 — Velka: 3 Bőrviasz és sérült páncél beszállítói hibája.
3. main_outskirts_11 — Nara: 3 Bőrviasz és ismeretlen bőr eredete.
4. main_outskirts_12 — Tomen: 1 Kovács fejlesztőkészlet és hibás szerszám vizsgálata.

Ez a lánc alpha.26 Canon. A munkacsomagok nem javasolnak új sorrendet, új fő küldetést, új jutalmat vagy új main quest choice-ot. A 60 fő küldetés védett.

## 3. Közös játékmeneti invariánsok

- Egyetlen item catalogue és ItemDefinition.
- Egyetlen InventoryItem(instanceId,itemId) modell.
- Egyetlen gold/diamond gazdaság.
- Egyetlen rarity taxonomy.
- Egyetlen recipe/dismantle szerződés.
- Egyetlen save version/migration szabály.
- Egyetlen relationship/identity/memory runtime.
- Egyetlen quest/side-quest runtime.
- A Szem csak eseményt figyel/rögzít; nem állít be outcome-ot.
- Nem lehet a 60 fő küldetés tartalmát vagy számát módosítani.
- A Műhelynegyed nem hozhat létre saját currencyt, mastery store-t, durability mezőt, enhancement mezőt vagy item-instance altípust.

## 4. Alpha.26 technikai tesztterv

### A. NPC és Canon integritás
1. Pontosan négy műhely NPC szerepel a workshops district listában: garran, velka, nara, tomen.
2. Az ID-k megmaradnak; nincs NPC duplikáció.
3. Canon név, szerep, hely és órarend ellenőrzése.
4. NPC story profile mind a négyhez létezik.
5. NPC_FUNCTIONS minden ID-hoz egy megfelelő funkciót rendel.
6. A 60 fő küldetés száma változatlan.

### B. NPC jelenlét és hozzáférés
1. Borin: 05:59 unavailable; 06:00 available; 19:59 available; 20:00 unavailable.
2. Velka: 07:59 unavailable; 08:00 available; 17:59 available; 18:00 unavailable.
3. Nara: 05:59 unavailable; 06:00 available; 18:59 available; 19:00 unavailable.
4. Tomen: 06:59 unavailable; 07:00 available; 16:59 available; 17:00 unavailable.
5. Minden NPC más régióból elutasítva.
6. missing, traveling, disgraced runtime státuszban elutasítva.

### C. Crafting és dismantle
1. Minden slot recipe-je a helperből számolódik.
2. Külvárosi secondary anyag tannersWax.
3. Story-bound, relic, marketEligible:false, sideQuestOnly craft tiltva.
4. Hiányzó input: nincs inputlevonás és output.
5. Sikeres craft: pontos input levonás és egy új instance.
6. Dismantle: csak owned instance.
7. Ugyanazon instance kétszeri bontása elutasítva.
8. Dismantle yield megfelel a helpernek.
9. Dismantle kimenet 79/80 és 80/80 állapotban sem lépheti át a limitet.
10. Felszerelt tárgy és inventory instance külön kezelésének ellenőrzése.
11. Dismantle nem semmisíthet meg védett quest/evidence/relic itemet.
12. Két azonos itemId két külön instance-szal külön kezelhető.

### D. NPC-specifikus regressziók
- Borin: craft UI, recipe preview, quest main_outskirts_04.
- Velka: a jelenlegi generic forge viselkedés rögzítése; páncél-specializáció csak jóváhagyás után.
- Nara: a UI leatherwork hiányának regressziós tesztje; store és UI eltérés explicit ellenőrzése.
- Tomen: 15 gold, smithing +1 cap50, trade affinity +2 cap100, capnél történő levonás, első XP egyszeri, ismételt reputation hatás.

### E. Save/persistence
1. Új craft output után localStorage mentés.
2. Reload után item count és instance ID konzisztens.
3. Duplikált instanceId betöltéskor kiszűrve.
4. Legacy save keys továbbra is olvashatók.
5. Ha később új mező kerül a shared instance modellbe, migrációs fixture régi save-ből.
6. Save version csak központi jóváhagyással változhat.

### F. Gazdaság és abuse
1. Craft/dismantle oda-vissza ciklus anyag-egyensúly tesztje minden slotra.
2. Nincs arany nélküli végtelen profit.
3. Nincs item/anyag duplikáció gyors dupla submit esetén.
4. Client-side target tampering elutasítása.
5. Invalid recipe ID nem ad outputot.
6. Inventory capacity minden branchben ellenőrzött.
7. Repeated used() XP/reputation pontosan a meglévő contract szerint.
8. Nincs unapproved random failure vagy extra loot.

### G. Fő küldetés védelem
1. QUESTS.length === 60.
2. MAIN_STORY_BLUEPRINT.length === 60.
3. main_outskirts_04, 06, 11, 12 giver, requirements, consume flags, rewards és choice listák snapshotja változatlan.
4. A mainQuestAudit hookok és a narrative.QUEST_DNA 60 eleműek.
5. Műhely funkció nem tud quest itemet vagy fő quest jutalmat gyártani.

### H. UI / eszköz
1. Desktop 1440px és 1280px.
2. Mobil 390px és 360px.
3. Billentyűzet fókusz, gombok accessible name-je, disabled állapot.
4. Recipe preview és dismantle preview olvashatósága.
5. NPC jelenlét/nyitvatartás pontos kijelzése.
6. Nara leatherwork külön UI útvonalának explicit ellenőrzése.
7. Velka „Páncélt javíttatok” címke és a tényleges forge handler közötti eltérés kezelése.

## 5. Automatizált tesztfájlok és parancsok

Alpha.26 package.json:
- npm test: scripts/smoke-test.cjs, security-smoke.cjs, visual-assets-smoke.cjs, visual-ui-smoke.cjs.
- npm run lint: tsc --noEmit.
- npm run build: Next.js production build.

A scripts/smoke-test.cjs ellenőrzi a 69 NPC-t, 60 questet, item instance egyediséget, Borin 20 Műhelyvas követelményét és a 60 main story blueprintet (141, 204, 212-214, 362-367). A tesztek ebben a specifikációs munkában nem futottak; a fenti lista tesztterv, nem teszteredmény.

## 6. Elfogadási kapu

- Minden teszt determinisztikus fixture-rel reprodukálható.
- Minden gazdasági változás expected input/output táblával ellenőrzött.
- Minden item művelet atomic és idempotens a jóváhagyott shared contract szerint.
- A 60 fő küldetés snapshot változatlan.
- UI teszt nem helyettesíti a store/server validációt.
- Minden central decision PENDING marad, amíg a projektgazda nem hagyja jóvá.

**Végső státusz:** SPECIFICATION COMPLETE — CENTRAL CONTRACTS PENDING.
