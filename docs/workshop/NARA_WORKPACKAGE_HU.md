# Műhelynegyed — Nara Bőrös (nara)
## NPC munkacsomag — alpha.26 specifikáció

**Baseline:** main · AIMORPG v2.0.0-alpha.26 · commit 894e9606fa84f5d609d810152e326b1cfae09b18  
**Branch:** workshop/phase-1-npc-specification  
**Státusz:** **SPECIFICATION COMPLETE — RECIPE / MATERIAL CONTRACT BLOCKED BY CENTRAL DECISIONS**  
**Mód:** SPECIFICATION ONLY. Forráskódot ez a munkacsomag nem módosít.

## 1. Canon és karakterazonosság — VERIFIED

- ID: nara; név: Nara Bőrös; szerep: Bőrműves.
- Hely: Bőrös udvar, Műhelynegyed; elérhetőség 06:00–19:00.
- Szolgáltatás: „Bőr, kesztyű, javítás”.
- Cserzőcsaládban nőtt fel; felismeri a bőr állat- és vidékeredetét. Egy hamis bőrrel történt csalás miatt saját, tiszta beszállítói láncot akar.
- Titka: egy ritka bőr olyan hajóról érkezett, amely hivatalosan nem futott be; a bőrbe varrt jel nem kereskedelmi jel.
- A történeti szerep az áru eredetét köti össze a kereskedelmi hálózattal.

**Forrás:** src/lib/content.ts:323, 413, 469, 506.

## 2. Alpha.26 forráshelyek

| Forrás | Hely | Bizonyított tény |
|---|---:|---|
| NPC-definíció | src/lib/content.ts:323 | Bőrműves, Bőrös udvar, 06–19 |
| Kerületi Canon | src/lib/content.ts:413 | Műhelynegyed szerepe |
| NPC-funkció | src/lib/content.ts:469 | fn-nara, leatherwork, kesztyű/csizma craft, sérült bőrfelszerelés bontása |
| NPC-történet | src/lib/content.ts:506 | cserzőcsalád, hamis bőr, tiszta beszállítói lánc |
| Itemkatalógus | src/lib/content.ts:45-75 | tannersWax, workshopIron, paddedArmor, lurkerGloves, smithingKit |
| Recept | src/lib/itemSystem.ts:113-131 | egyetlen általános régiós recipe helper |
| Szétszerelés | src/lib/itemSystem.ts:134-147 | ugyanazon recipe fél hozama |
| Runtime | src/lib/store.ts:568-590, 643-652 | leatherwork és forge ugyanaz a handler |
| UI | src/components/GameClient.tsx:760-798 | csak kind === forge renderel workbench UI-t |
| Fő küldetés | src/lib/mainStory.ts:32 | main_outskirts_11, 3 Bőrviasz fogy, tradeSilk jutalom |

## 3. Meglévő runtime — PARTIALLY IMPLEMENTED / UI-HIÁNY

- fn-nara kind: leatherwork funkcióval szerepel a contentben.
- A store case forge: case leatherwork ága ugyanazt az általános craft/dismantle logikát futtatja.
- A craft recipe a Külvárosban tannersWax-ot használ másodlagos anyagként, de minden felszereléshez workshopIron is kell a közös helper szerint.
- A runtime nem vizsgálja, hogy az item bőrből készült-e, nem ellenőrzi a nara NPC ID-t, és nem különböztet meg bőrtermék-recepteket.
- A UI ezzel szemben kizárólag fn.kind === forge esetén jeleníti meg a crafting/dismantling workbench-t. A leatherwork nem kerül ebbe az ágba; a generic special-function kártya marad.
- Következmény: a funkció adatként és store switchben létezik, de a teljes játékosnak látható műhelyfelület alpha.26-ban nem igazolt.

## 4. Alapanyagok és beszerzés — VERIFIED / GAP

**Meglévő releváns itemek:**
- tannersWax: Bőrviasz, category material, Külváros, basePrice 22, legal, sellable és marketEligible.
- workshopIron: Műhelyvas, category material, Külváros, basePrice 18.
- smithingKit: Kovács fejlesztőkészlet, category upgrade, leírása finomhangoló eszközöket említ.
- lurkerGloves: Leselkedő kesztyű, leírás szerint finom bőrkesztyű, accessory slot.
- paddedArmor: Bélelt bőrvért, armor slot.
- travelerBoots: Futár csizmája, boots slot; a leírás nem mondja ki az anyagát.

**Hiányzó igazolt adat:** a jelenlegi katalógusban nincs külön nyersbőr, cserzett bőr, bőrlemez, fonal, szíj vagy bőralkatrész item az alpha.26 vizsgált külvárosi itemlistában. A tannersWax tartósító viasz, nem nyersbőr. Ebből önmagában nem következik bőranyag-feldolgozási lánc.

## 5. Önálló játékosérték — javaslatok, döntés szükséges

**A opció — bőrfelszerelés-specialista**
- Nara csak a jóváhagyott bőrtermék-katalógushoz kap craft/dismantle hozzáférést.
- A jelenlegi item ID-k közül a lurkerGloves és paddedArmor leírása bőrre utal; a travelerBoots anyaga nincs explicit megadva.
- A recipe output csak létező item ID lehet, amíg új item contentet a content owner jóvá nem hagy.
- Külön nyersbőr/anyag nem hozható létre ebben a kerületi szálban.

**B opció — bőreredet- és beszállítói vizsgálat**
- Nara fő értéke a bőr származásának, kezelési nyomainak és kereskedelmi láncának vizsgálata.
- A main_outskirts_11 meglévő történeti témájára támaszkodhat, de a fő küldetés nem módosítható.
- Opcionális új melléktartalom csak a közös narrative/side-quest szerződéssel és Canon review-val készülhet.

**Javaslat:** a két réteg egymást kiegészítheti, de a craft recept csak az item- és recipe-tulajdonos jóváhagyása után írható le végleges számszerű outputként. A tannersWax-ot nem szabad nyersbőrként átnevezni vagy új jelentéssel felruházni.

## 6. Teljes játékmeneti ciklus

**Alpha.26 jelenlegi:** NPC megkeresése → jelenlét/régió ellenőrzése → funkciókártya → a store leatherwork ágának meghívása csak akkor, ha a megfelelő targetet más módon küldi a kliens. A normál UI nem ad Nara craft/dismantle választófelületet.

**A opció (PROPOSAL):**
1. Bőrtermék kiválasztása a jóváhagyott katalógusból.
2. Item anyagcímkéjének és slotjának ellenőrzése.
3. Központi recipe preview és input count.
4. Anyagok és inventory capacity ellenőrzése.
5. Confirm.
6. Közös recipe transaction végrehajtása.
7. Új inventory instance és pontos input/output visszajelzés.

**B opció (PROPOSAL):**
1. Bőrminta vagy beszállítói tétel kiválasztása, kizárólag ha ilyen adat létezik a jóváhagyott item/quest modellben.
2. Anyagvizsgálati megközelítés választása.
3. A közös narrative resolver meglévő stat/choice szabálya oldja fel.
4. A Szem csak a megtörtént eseményt rögzíti; nem állapít meg új Canon tényt.
5. Eredmény lehet információ vagy kapcsolatváltozás, de új item/jutalom csak jóváhagyott reward contract alapján.

## 7. Döntések és alternatívák

- Bőrtermék craft vs anyageredet-vizsgálat.
- tannersWax használata a jelenlegi általános recipe szerint vs új, központilag jóváhagyott bőranyag-recept.
- lurkerGloves és paddedArmor bőrtermék-katalógusba sorolása; csizma besorolása külön ellenőrzendő.
- A szétszerelés csak Nara által jóváhagyott bőrfelszerelésre korlátozása, vagy közös általános dismantle szolgáltatás fenntartása.
- Ha a UI nincs implementálva, a játékos ne kapjon olyan gombot, amely nem működő műveletet ígér.

## 8. Előfeltételek, itemek, statok, jogosultságok

- NPC nara, region outskirts, district workshops, 06:00–19:00.
- smithing létezik statként, de a közös recipe helper nem követeli meg.
- tannersWax és workshopIron létező material ID-k.
- lurkerGloves és paddedArmor bőrre utaló itemleírások; a travelerBoots anyaga nincs rögzítve.
- Fő quest main_outskirts_11: 3 Bőrviasz fogyasztása, tradeSilk jutalom. Ez a küldetés mintavizsgálatról és származási láncról szól, nem crafting recept.

## 9. Siker / részleges siker / kudarc / megszakítás

**Jelenlegi runtime:** a közös forge handler siker/validációs kudarc ágai; Nara UI-normálútja nincs bekötve. Részleges craft és minőségi kimenet nincs.

**Tervezési javaslat:** validációs kudarc esetén nincs anyagvesztés; művelet előnézet után explicit confirm; craft failure risk csak központi döntés után. Ha az anyagvizsgálat side questként készül, használja a közös fail-forward szabályt, ne saját quest state-et.

## 10. Költségek és jutalmak

- Jelenlegi generic Külvárosi recipe: tannersWax + workshopIron, slotfüggő mennyiségek.
- Nara-nál külön munkadíj nincs.
- Nincs külön bőr-nyersanyag beszerzési vagy feldolgozási ára.
- Fő quest 11: 3 tannersWax consume, 1 tradeSilk reward.
- Új bőr input/output, ár, drop vagy jutalom csak Economy + Content tulajdonos jóváhagyásával.

## 11. Kapcsolat és fejlődés

A jelenlegi közös used() minden sikeres funkcióhasználatkor journal-bejegyzést és reputation activity/relationships növelést ad; első alkalommal 2 XP-t és activity memory-t. Ez nem Nara-specifikus relationship-facet változás és nem profession mastery. A main quest választások a közös quest resolverhez tartoznak.

## 12. UI és interakció

- A NpcFunctionPanel az első NPC-funkciót választja.
- A forge UI ág tartalmaz craft és dismantle panelt.
- A leatherwork nincs a forge UI feltételben; ezért Nara számára a normál UI csak generic special-function kártyát mutat.
- A következő UI-specben külön kell választani: craft list, item detail, recipe input preview, dismantle preview, insufficient material, inventory full, NPC absent, success/failure.
- A vizuális item art megléte nem bizonyítja a leatherwork UI működését.

## 13. Állapot és mentés

Nara nem rendelkezik saját state-tel. A közös inventory instance instanceId + itemId; localStorage save key aimorpg-final-demo-v1-29, saveVersion 6. Nincs leather stock, hide quality, supplier provenance vagy craft history mező. Ezek nem vezethetők be kerületi szinten.

## 14. Exploitvédelem

- A store elfogad leatherwork-ot a közös handlerben, de nem validálja a bőranyag-azonosságot.
- UI hiányában kézzel/hamisított targettel történő művelet tesztelendő.
- Dismantle instance tulajdonjogot ellenőriz, de explicit kapacitáslimit nincs a kimenethez.
- Kliensoldali store miatt nincs szerveroldali csalásvédelem vagy idempotens tranzakció.
- A questhez szükséges 3 Bőrviasz fogyasztását nem szabad crafting output loopon keresztül megkerülni.

## 15. Tesztterv

1. Nara fn-nara ID és leatherwork kind.
2. NPC presence 05:59, 06:00, 18:59, 19:00.
3. Wrong region / absent NPC.
4. UI smoke: a leatherwork ne mutasson üres vagy félrevezető panelt.
5. Store leatherwork target: valid item, invalid item, non-slot item.
6. A jelenlegi generic recipe mennyiségek rögzítése.
7. tannersWax hiány és workshopIron hiány: nincs state mutation.
8. lurkerGloves/paddedArmor item leírás-alapú bőrcímkézés csak content owner döntés után.
9. travelerBoots anyagbesorolása ne legyen feltételezve.
10. Dismantle protected item és 80-as capacity boundary.
11. Double submit / replay / reload.
12. Main quest main_outskirts_11 3 Bőrviasz és tradeSilk reward változatlan.
13. Nincs új material ID és nincs globális ár/drop módosítás.

## 16. Keresztkörzeti függőségek

- Régi Piac: Nara története egy céhes karavánjelhez és a kereskedelmi hálózathoz vezet.
- Kikötő: a ritka bőr hivatalosan be nem futott hajóról érkezett.
- Kapuváros: beszállítási és fuvarlánc, eredetellenőrzés.
- Velka: a main_outskirts_11 egyik választása szerint a játékos megmutathatja neki a mintát; ez történeti kapcsolat, nem közös recipe bizonyíték.
- Borin: közös workshopIron és recipe helper; Nara bőrtermék-katalógusa nem fedheti át indokolatlanul a fémkovács szerepet.

## 17. Fájl-engedélyezés és elfogadás

**Ebben a fázisban:** kizárólag dokumentáció.  
**Jövőbeni, külön jóváhagyású:** src/lib/content.ts, src/lib/itemSystem.ts, src/lib/store.ts, src/components/GameClient.tsx, scripts/smoke-test.cjs, scripts/visual-ui-smoke.cjs.  
**Tiltott önálló módosítás:** types.ts, rules.ts, rewardEconomy.ts, simulation.ts, narrative.ts, mainStory.ts, mainQuestAudit.ts, save schema és minden más district.

Elfogadási kritérium: a forrásból igazolt anyag/recipe elkülönül a javaslattól; Nara UI hiánya és a shared-handler átfedése látható; a fő küldetés védett; új anyag és recipe nincs önkényesen létrehozva.

**Végső státusz:** SPECIFICATION COMPLETE — RECIPE / MATERIAL CONTRACT BLOCKED BY CENTRAL DECISIONS.


---

## 18. Célzott PHASE 2 — alpha.26 item- és receptkatalógus

**Baseline:** alpha.26 main, 894e9606fa84f5d609d810152e326b1cfae09b18.  
**Forrás:** src/lib/content.ts:45-75, 323, 469, 507; src/lib/itemSystem.ts:113-147; src/lib/store.ts:643-652; src/components/GameClient.tsx:760-798; src/lib/mainStory.ts:32.

### 18.1 Canon és runtime

Nara Canon szerepe Bőrműves; service: Bőr, kesztyű, javítás. fn-nara kind=leatherwork; leírása bőrből kesztyű és csizma készítését, valamint sérült bőrfelszerelés bontását mondja. A store forge és leatherwork esetén közös craft/dismantle kódot futtat, és nem ellenőrzi az item anyagát. A UI viszont kizárólag fn.kind === forge esetén renderel workbench-et. Nara normál UI-ján ezért nincs craft/dismantle panel: ez VERIFIED UI GAP.

### 18.2 Releváns itemkatalógus

Az ár a forrásbeli basePrice, nem garantált NPC-eladási ár. A „nincs deklarálva” azt jelenti, hogy a mező hiányzik.

| Item ID | Név | Kategória / slot | Forráshely | basePrice | Eredet / tradeValue | Craft szerep | Nara-kapcsolat | Címke |
|---|---|---|---|---:|---|---|---|---|
| paddedArmor | Bélelt bőrvért | armor / armor | content.ts:47 | 52 | nincs deklarálva / nincs deklarálva | Craft output target és dismantle input lehet; armor recipe | Leírása bőrvértet mond; Nara-hozzárendelés tematikus javaslat | VERIFIED item / PROPOSAL-hozzárendelés |
| lurkerGloves | Leselkedő kesztyű | accessory / accessory | content.ts:50 | 64 | nincs deklarálva / nincs deklarálva | Craft output target és dismantle input lehet; accessory recipe | Leírása finom bőrkesztyű; Nara Canon kesztyűkészítéséhez közvetlenül illik | VERIFIED item / PROPOSAL-hozzárendelés |
| travelerBoots | Futár csizmája | boots / boots | content.ts:48 | 30 | nincs deklarálva / nincs deklarálva | Craft output target és dismantle input lehet; boots recipe | Nara csizmát készít, de az item anyaga nincs megadva | VERIFIED item / CENTRAL DECISION REQUIRED |
| workshopIron | Műhelyvas | material / nincs slot | content.ts:62 | 18 | Külváros · Műhelynegyed / 16 | Outskirts recipe primary input | Fém alapanyag, nem bőr | VERIFIED |
| tannersWax | Bőrviasz | material / nincs slot | content.ts:63 | 22 | Külváros · Műhelynegyed / 20 | Outskirts recipe secondary input | Tartósító viasz; nem nyersbőr, nem bőrlemez | VERIFIED |
| smithingKit | Kovács fejlesztőkészlet | upgrade / nincs slot | content.ts:71 | 48 | Külváros · Műhelynegyed / 52 | Nem része a jelenlegi recipe helpernek | Műhelyhez kötött eszköz, de nem igazolt bőranyag; más questekben szerepel | VERIFIED / Nara-receptkapcsolat nem igazolt |
| guildWaxSet | Céhes viaszpecsét-készlet | material / nincs slot | content.ts:143 | 64 | Céhesor / 76 | Nem az outskirts recipe secondary inputja | Velka main_outskirts_06 jutalma; nem Nara-bőranyag | VERIFIED / kapcsolat nincs igazolva |
| tradeSilk | Céhes selyemtekercs | tradeGood / nincs slot | content.ts:87 | 68 | Kereskedelmi Központ · Céhesor / 82 | Nem craft helper input/output | main_outskirts_11 jutalma; nem bőranyag | VERIFIED |

A három felszerelés itemdefiníciójában nincs explicit regions=["outskirts"] mező. A forgeCraftables UI régió/set tagságot, common rarityt és slotot vár; ezért a létező itemdefiníció és a ténylegesen látható UI-katalógus eltérhet. A store közvetlen target ellenőrzése ettől függetlenül elfogadja a létező, slotos itemet, ha a hívás ilyen targetet ad.

### 18.3 tannersWax és recipe/dismantle helper

craftRecipeForItem:
- Üres recept, ha sideQuestOnly, relic kategória vagy marketEligible=false; üres recept slot nélküli itemre.
- Outskirts secondary input: tannersWax.
- weapon: 4 workshopIron + 1 tannersWax.
- shield: 3 workshopIron + 1 tannersWax.
- armor: 5 workshopIron + 2 tannersWax.
- boots: 2 workshopIron + 1 tannersWax.
- accessory: 1 workshopIron + 1 tannersWax.
- Nem vizsgál NPC ID-t, anyagcímkét, bőrminőséget, Nara-jogosultságot vagy smithing statot.

dismantleYieldsForItem:
- Slot nélküli itemre üres hozam.
- Régió az item regions[0] mezője, hiányában outskirts.
- Minden recipe input fele, lefelé kerekítve, típusonként minimum 1.
- paddedArmor: 2 workshopIron + 1 tannersWax.
- lurkerGloves: 1 workshopIron + 1 tannersWax.
- travelerBoots: 1 workshopIron + 1 tannersWax.
Ezek helperből számolt generic értékek, nem Nara által jóváhagyott receptek/yield-ek.

### 18.4 GAP-ek

- GAP-NARA-01: nincs igazolt nyersbőr item.
- GAP-NARA-02: nincs igazolt cserzett bőr/bőrlemez item.
- GAP-NARA-03: nincs igazolt bőralkatrész input/output.
- GAP-NARA-04: leatherwork UI workbench hiányzik.
- GAP-NARA-05: paddedArmor és lurkerGloves leírása bőrre utal, de formális material mező nincs; travelerBoots anyaga ismeretlen.
- Új item ID, ár, rarity, effect vagy drop nem vezethető le a forrásból.
- main_outskirts_11: 3 tannersWax consume, tradeSilk reward; ez beszállítói/eredetvizsgálati fő küldetés, nem crafting recipe, és védett.

### 18.5 Alternatívák — PROPOSAL

**A — meglévő katalógusra szűkített Nara:** paddedArmor és lurkerGloves csak content owner jóváhagyással Nara-termék; travelerBoots besorolása függőben. A generic recipe ideiglenes referencia, nem nevezhető bőrreceptnek.

**B — valódi bőranyaglánc később:** nyersbőr/cserzett bőr/alkatrész és Nara-receptek csak külön content/economy review után. Addig a GAP nyitva marad.

**Státusz:** SPECIFICATION COMPLETE — MATERIAL / RECIPE / UI CONTRACT BLOCKED BY CENTRAL DECISIONS.
