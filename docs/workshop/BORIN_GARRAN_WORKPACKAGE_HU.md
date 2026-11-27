# Műhelynegyed — Borin Vasmarok (garran)
## NPC munkacsomag — alpha.26 specifikáció

**Baseline:** main · AIMORPG v2.0.0-alpha.26 · commit 894e9606fa84f5d609d810152e326b1cfae09b18  
**Branch:** workshop/phase-1-npc-specification  
**Státusz:** **SPECIFICATION COMPLETE — IMPLEMENTATION BLOCKED BY CENTRAL DECISIONS**  
**Mód:** SPECIFICATION ONLY. Forráskódot ez a munkacsomag nem módosít és nem engedélyez.

## 1. Canon és karakterazonosság — VERIFIED

- NPC ID: garran; megjelenített név: Borin Vasmarok.
- Szerep: Fegyverkovács. Hely: Külváros / Műhelynegyed / Vasmarok Műhely.
- Elérhetőség: 06:00–20:00.
- A kerületi Canon a Műhelynegyedet a kézzel végzett munka, mesterség és becsület helyeként írja le.
- Borin apja műhelyében nőtt fel; korábbi olcsó anyagból készült munkája miatt egy ember megsérült. Motivációja a céhes függéstől független, vállalható minőségű fegyverek készítése. Ismeri egy régi mesterpecsét eredetét.
- A karakter erkölcsi tengelye: a tárgy eredete, ára és a készítő felelőssége.

**Forrás:** src/lib/content.ts:313, 413, 499.

## 2. Alpha.26 forráshelyek

| Forrás | Pontos hely | Bizonyított tény |
|---|---:|---|
| NPC-definíció | src/lib/content.ts:313 | ID, szerep, hely, szolgáltatás, órarend |
| Műhelynegyed Canon | src/lib/content.ts:413 | kerület leírása, kérdése, négy NPC-je |
| NPC-funkció | src/lib/content.ts:462 | fn-garran, forge, Kovácsműhely |
| NPC-történet | src/lib/content.ts:499 | Borin history, motivation, secret, questRole |
| Tárgykatalógus | src/lib/content.ts:45-75 | alap felszerelések és külvárosi anyagok |
| Recept | src/lib/itemSystem.ts:113-131 | craftRecipeForItem |
| Szétszerelés | src/lib/itemSystem.ts:134-147 | dismantleYieldsForItem |
| Runtime | src/lib/store.ts:568-590, 643-652 | NPC-validáció, közös craft/dismantle handler |
| UI | src/components/GameClient.tsx:760-798 | közös forge UI, receptelőnézet, szétszerelés |
| Felszerelés-instance | src/lib/types.ts:48-60; src/lib/rules.ts:92-94 | InventoryItem és instance létrehozás |
| Fő küldetés | src/lib/mainStory.ts:25; src/lib/questDesign.ts:12-28 | main_outskirts_04, 20 Műhelyvas, döntési utak |

Forrás blobok a main ágon: content.ts 27206c65e37c5cc3b47d0257d91b1654f8971b95; itemSystem.ts e8c1220ceb563e1e10ef0064ec9be4991d0bf475; store.ts 60fc472f8eeefd940aa25e226e3a1aa3a20b1aba; types.ts 443f69f61193917131c1c52784c2056c25f9cd3d; GameClient.tsx 41743815f9b780e2dbad7d448e068a6a894988be.

## 3. Meglévő runtime — IMPLEMENTED

1. A funkció az NPC_FUNCTIONS rekordban fn-garran, kind: forge.
2. A useNpcFunction ellenőrzi az NPC/function párt, a játékos régióját és az NPC jelenlétét.
3. A craft target craft:<itemId> alakú.
4. A kiválasztott itemnek létező katalóguselemnek, felszerelés-slotú tárgynak és nem tiltott/relikvia/sideQuestOnly itemnek kell lennie.
5. A receptet a régió alapján a közös craftRecipeForItem számolja.
6. Az anyagok inventory mennyiség szerint ellenőrződnek és levonódnak; a kész termék új inventory instance-ként kerül be.
7. Dismantle esetén a játékos inventoryjából kiválasztott instance eltűnik, a közös helper által számított anyagok új instance-ként visszakerülnek.
8. A handler nem különbözteti meg Borint a Velka forge funkciójától; NPC-specializációs szűrő nincs.

**Fontos:** a fn-garran leírása fegyvert, pajzsot, vértet és csizmát említ. Nem támasztja alá, hogy Borin kizárólag fegyvert/pajzsot készíthet. A Fegyverkovács szerep és a szélesebb szolgáltatásleírás közötti határt projektgazdának kell eldöntenie.

## 4. Játékosfunkció és teljes ciklus

**Alpha.26 jelenlegi ciklus:**
1. A játékos a Külvárosban megkeresi Borint a 06:00–20:00 idősávban.
2. Megnyitja a Kovácsműhely funkciót.
3. A UI legfeljebb 8 olyan katalógusitemet listáz, amelynek van slotja, a régióhoz vagy régiós sethez tartozik, és közönséges ritkaságú.
4. Kiválaszt egy itemet; megjelenik a leírás és a közös recipe anyagigénye.
5. A játékos elkészíti, ha az inputok megvannak.
6. Alternatívaként inventory felszerelést választ szétszerelésre, megnézi a várható hozamot, majd véglegesíti.
7. A művelet után az UI üzenetet mutat.

**Specifikációs javaslat, nem Canon:** Borin maradjon a Műhelynegyed fémeszköz- és fegyverkovácsának fő szolgáltatója. A craft kínálat és a slot-jogosultság csak a projektgazda által elfogadott specializációs táblázat alapján szűkíthető. Addig az alpha.26 általános katalógusjogosultság a referencia.

## 5. Játékosdöntések és alternatívák

- Craft vagy dismantle: a két művelet gazdasági iránya eltér; craft anyagot fogyaszt, dismantle tárgyat semmisít meg.
- Melyik item: csak a katalógusban létező és a helper által recepttel ellátható item lehet érvényes.
- Forrás megosztása: a fő küldetésben a játékos tiszta forrást, hallgatást, bizonyítékot, lojalitást vagy jövőbeli szívességet választhat. Ez a 60 fő küldetés védett tartalma, nem szabad újraírni.
- Művelet megszakítása: a UI bezárása vagy másik cél választása a confirm előtt nem járhat költséggel. Alpha.26-ban külön folyamatállapot nincs; a művelet csak a gomb megnyomásakor fut.

## 6. Előfeltételek, itemek, statok, jogosultságok

- NPC: garran, region: outskirts, district: workshops.
- Jelenlét: 06:00–20:00, továbbá runtime státusz nem lehet missing, traveling vagy disgraced.
- Felszerelés-slotok: weapon, shield, armor, accessory, boots.
- Külvárosi recept secondary anyaga: tannersWax.
- A helper képlete: weapon = 4 workshopIron + 1 tannersWax; shield = 3 + 1; armor = 5 + 2; boots = 2 + 1; accessory = 1 workshopIron + 1 tannersWax.
- A helper nem használja a smithing statot craft gate-ként.
- A craft jelenlegi kódja nem számít fel arany munkadíjat.
- A 60 fő küldetésben Borin main_outskirts_04 feladata 20 workshopIron elfogyasztása; jutalom 1 smithingKit.

## 7. Siker, részleges siker, kudarc, megszakítás

**Jelenlegi runtime:**
- Siker: a recipe inputok levonása és 1 új item instance létrehozása.
- Kudarc: hibás/tiltott item, hiányzó input, rossz régió, NPC távolléte vagy hiányzó inventory instance esetén a state változatlan marad.
- Részleges siker: nincs implementálva.
- Crafting minőségi/random kimenet: nincs implementálva.
- Dismantle részleges anyag-visszanyerése: a receptmennyiség fele, lefelé kerekítve, minimum 1 minden inputtípusból.
- Megszakítás: confirm előtt nincs state változás; folyamat közben nincs külön megszakítási állapot.

**Kritikus auditkockázat:** a dismantle ág nem ellenőrzi a teljes kimeneti inventory-kapacitást. Egy item két vagy több inputtípusból kaphat vissza anyagot; a nettó inventory-szám nőhet, és a 80-as korlát fölé kerülhet. A useNpcFunction craft/dismantle ágában külön inventory-limit check nem látható.

## 8. Költség és gazdasági hatás

- Craft költség: recipe input itemek; aranydíj nincs.
- Dismantle hozam: a recipe fél inputja, minimum 1 típusonként.
- Fő küldetés input: 20 Műhelyvas elfogyasztva, jutalom 1 Kovács fejlesztőkészlet.
- Nincs külön műhelypénz, gyártási valuta vagy rarity-szabály.
- Kockázat: dismantle ismételhető, nincs naponta/alkalmankénti limit; a közös formula miatt a hozam és a visszagyárthatóság gazdasági vizsgálatot igényel.

## 9. Kapcsolat és fejlődés

Sikeres funkcióhasználatkor a közös used() journal-bejegyzést, relationships és activity reputation-rész növelést ad. Az adott NPC-funkció első használata 2 XP-t és egy activity memory-t is ad; a későbbi ismétlések ugyanazt az XP-memóriát nem ismétlik. Ez nem NPC-specifikus relationship-facet delta, és nem szakmai mastery. Borin fő küldetésének választásai a meglévő quest relationship/identity rendszerhez tartoznak.

## 10. UI és interakció

- NPC modal és funkciópanel a közös NpcFunctionPanel komponensben.
- Craft-kártyák: ikon/grafika, név, rarity, slot, statok.
- Recipe előnézet: anyagok és birtokolt/szükséges darabszám.
- Dismantle előnézet: visszanyerhető anyagok.
- A jelenlegi craftlista legfeljebb 8 elemre korlátozott; a UI csak közönséges ritkaságot listáz.
- Hiányzó anyag esetén a craft gomb tiltott.
- Mobil és akadálymentességi teszt szükséges; a forrás önmagában nem igazolja a böngészős megjelenés minőségét.

## 11. Állapot és mentés

- InventoryItem = { instanceId, itemId }; nincs craft quality, durability, enhancement, crafter vagy history mező.
- Item instance létrehozása makeInventoryItem.
- Store: localStorage, save key aimorpg-final-demo-v1-29, payload saveVersion: 6, régi kulcsok beolvasása.
- Craft/dismantle eredmény külön history rekordként nem tárolódik; journalbejegyzés készül.
- Új instance mező vagy craft history csak központi migrációs döntés után jöhet.

## 12. Exploitvédelem

**Meglévő:** NPC ID + function ID párosítás, régió, jelenlét, item ID, slot és recipe input ellenőrzés; egyedi instance ID a tulajdonosi item kiválasztásnál.

**Hiány / kockázat:** kliensoldali store; nincs szerver-authoritative transaction, idempotency key, replay token vagy atomikus tranzakciós napló. A craft output inventory limitet nem ellenőrzi, dismantle output kapacitást nem ellenőriz. A dismantle ágnál a protected-item feltételeket a dismantleYieldsForItem üres hozama önmagában nem feltétlenül akadályozza meg az item törlését, ezért explicit protected-item teszt szükséges.

## 13. Tesztterv

1. garran + fn-garran működik; más NPC function ID elutasítva.
2. Rossz régió és NPC távolléte state-változás nélkül elutasítva.
3. Weapon/shield/armor/boots/accessory recept mennyisége pontos.
4. Hiányzó 1 db bármely inputból: sem inputlevonás, sem output.
5. Story-bound, relic, marketEligible:false, sideQuestOnly item craft tiltása.
6. Craft új, egyedi instance-t ad; meglévő item definition/stat nem módosul.
7. Dismantle csak inventoryban lévő instance-t fogad el.
8. Ugyanazon instance második dismantle kísérlete elutasítva.
9. Dismantle minden hozama egyezik a helperrel.
10. Dismantle 79/80 és 80/80 állapotból nem lépheti át a kapacitást.
11. Cancel / panel bezárás nem változtat inventoryn.
12. Gyors dupla kattintás nem okoz duplikált outputot.
13. Mentés és reload után a craft/dismantle eredmény konzisztens.
14. 60 fő küldetés darabszáma és Borin quest követelménye változatlan.
15. Ismételt craft XP/reputation viselkedése a jelenlegi used() szabálynak felel meg.

## 14. Keresztkörzeti függőségek

- Kapuváros / Vera: a Borin quest vasának eredetét és súlyát a fő történet későbbi vizsgálatai kapcsolják össze.
- Régi Piac: anyagforrások, kereskedelmi lánc és a merchantInk későbbi történeti nyom.
- Őrségi Negyed: a régi mesterpecsét / hibás szállítmány hivatalos nyomozási következményei.
- Aréna / Fegyvermester Olen: fegyverhangolási funkció létezik, ezért a fegyverkarbantartás/fejlesztés felelősségét központilag kell szétválasztani.
- Kikötő: a fekete jelölt fém eredete későbbi rakománytörténeti kapcsolat.

## 15. Fájl-engedélyezés

**Specifikációs munkacsomagban módosítható:** kizárólag ez a dokumentum.  
**Jövőbeni javasolt érintett forrásfájlok, külön engedéllyel:** src/lib/content.ts, src/lib/itemSystem.ts, src/lib/store.ts, src/components/GameClient.tsx, scripts/smoke-test.cjs, scripts/visual-ui-smoke.cjs.  
**Tiltott önálló módosítás:** src/lib/types.ts, src/lib/rules.ts, src/lib/rewardEconomy.ts, src/lib/mainStory.ts, src/lib/mainQuestAudit.ts, src/lib/narrative.ts, save schema, globális item stats, árak, rarity és minden más kerület fájljai.

## 16. Elfogadási kritériumok

- A jelenlegi alpha.26 runtime leírása és minden lényeges kockázata forrással alátámasztott.
- A recipe mennyiségek tesztelhetően levezethetők a közös helperből.
- Borin és Velka funkcióátfedése dokumentált; slot-specializáció nincs önkényesen eldöntve.
- A 60 fő küldetés változatlan.
- Nincs helyi item-instance, crafting, recipe, durability, mastery vagy economy modell.
- A központi döntések nélkül nincs implementációs READY státusz.

## 17. Nyitott kérdések

1. Borin a teljes jelenlegi slot-listát készítse, vagy a fegyverkovács Canon szűkítse a termékkört?
2. Milyen feladat marad Borinnál és mi Velkánál, ha a közös forge handler közös marad?
3. Legyen-e munkadíj? Jelenleg nincs, ezért bármilyen díj gazdasági döntés.
4. A dismantle anyagveszteség és kapacitáskorlát milyen közös szabályt kövessen?
5. A +1–+9, durability és repair csak központi jóváhagyás után specifikálható.

**Végső státusz:** SPECIFICATION COMPLETE — IMPLEMENTATION BLOCKED BY CENTRAL DECISIONS.


---

## 18. Célzott PHASE 2 — Borin–Velka termékkör-mátrix

**Forrásalap:** alpha.26 main, 894e9606fa84f5d609d810152e326b1cfae09b18. Ellenőrzött helyek: src/lib/content.ts:313,316,462,464; src/lib/itemSystem.ts:113-147; src/lib/store.ts:643-652; src/components/GameClient.tsx:760-798.

### 18.1 Canon és tényleges runtime

- Borin Canon szerepe Fegyverkovács; NPC service: Fegyverjavítás, kovácsmesterség. fn-garran kind=forge. Leírása fegyvert, pajzsot, vértet és csizmát nevez meg.
- Velka Canon szerepe Páncélkovács; NPC service: Páncéljavítás, védelmi felszerelés. fn-velka kind=forge. Leírása páncél szétszerelését/újraillesztését és védelmi felszerelés craftját említi.
- A store mindkét NPC-t ugyanazon forge ágon kezeli. A handler nem használ NPC ID alapú recept-, slot- vagy termékkör-szűrést.
- A UI forgeCraftables szűrése: slotos item, a régióhoz tartozó regions vagy setId, common rarity, maximum 8 elem. Nem NPC-specializáció alapján szűr.
- A dismantle UI a játékos inventoryjának slotos tárgyait mutatja, NPC-szereptől függetlenül. A store minden létező slotos itemet elfogad dismantle targetként.
- Repair nincs: nincs condition/durability mező vagy repair handler. Velka actionLabelje „Páncélt javíttatok”, de a panel craft/dismantle műveletet hajt végre.

### 18.2 Termékkör-mátrix

| Kategória | VERIFIED CURRENT | CANON ROLE | PROPOSAL | CENTRAL DECISION REQUIRED |
|---|---|---|---|---|
| Fegyver | A közös forge craft/dismantle engedi a slotos itemet; a recept slotfüggő. | Borin: közvetlen szerep. Velka: nem fegyverkovács. | Fegyver Borin elsődleges katalógusában. | Igen: Borin kizárólagosság és UI/store allowlist. |
| Pajzs | A shield slotot a helper kezeli, mindkét forge NPC-vel. | Borin funkcióleírása kifejezetten említi. Velka védelmi felszerelés szerepe tágabb értelmezést enged. | Borin elsődleges; Velka csak projektgazdai döntéssel. | Igen: pajzs felelőse és megosztása. |
| Páncél | Armor slot craftolható és dismantle-ölhető a közös handlerben. | Borin leírása vértet említ; Velka Canon szerepe kifejezetten páncélkovács. | Velka elsődleges páncélkatalógus; Borin explicit leírása miatt az átfedés nem törölhető automatikusan. | Igen: páncél-hozzáférés és Borin kivétele. |
| Bőr felszerelés | A runtime nem vizsgál anyagcímkét; slot és recipe alapján dolgozik. | Nara bőrműves; Borin/Velka fémműhely. | Bőrtermékek Narához, itemenkénti content jóváhagyással. | Igen: anyagbesorolás és NPC jogosultság. |
| Csizma | Boots slot craft/dismantle engedélyezett a közös handlerben. | Borin funkcióleírása csizmát említ; Nara Canon is csizmát készít; Velka nem nevezi meg. | Csizma anyag/termék szerint Borin és Nara között szétválasztandó. | Igen: travelerBoots anyaga és termékkör. |
| Kiegészítő | Accessory slotra is van generic recipe; handler elfogadja. | Borin és Velka Canon nem nevez meg kiegészítőt; Nara kesztyűt említ. | Csak itemenként igazolt anyag és jóváhagyott NPC-hozzárendelés. | Igen: kesztyű és általános accessory jog. |
| Szétszerelés | Bármely inventoryban lévő slotos item szétszerelhető; hozam fél recipe, lefelé kerekítve, minimum 1/inputtípus. | Borin: felesleges felszerelés; Velka: páncél; Nara: sérült bőrfelszerelés. | Közös dismantle vagy NPC-specifikus item allowlist. | Igen: jogosultság, protected item, capacity és yield. |
| Javítás | Nincs condition mező vagy repair handler. | Borin, Velka és Nara service-leírása javítást említ. | Csak globális condition contract után mechanikai repair. | Igen: WD-05/06. |

**Értelmezés:** VERIFIED CURRENT a kód általános engedélyét jelenti, nem a Canon-helyességet és nem azt, hogy a UI ténylegesen megjeleníti. A UI régió/set szűrője és a store target-ellenőrzése eltérhet.

### 18.3 Szereposztási alternatívák — mindkettő PROPOSAL

**A — funkcióleírás szerinti megosztás**
- Borin: fegyver + pajzs; vért és csizma csak a fn-garran szövegével összhangban, projektgazda által rögzített kivételként.
- Velka: páncél + védelmi felszerelés; pajzs csak külön döntéssel.
- Canon-kompatibilitás: Borin felsorolása miatt a vért/csizma nem zárható ki automatikusan; Velka páncél-specialista marad.
- Játékosoldali egyediség: magasabb, slotonként egyértelmű szakember.
- Runtime: NPC-azonosítóhoz kötött termékkör allowlist; ugyanaz a jogosultságlista érvényes a UI-ra és store-ra.
- Recipe: közös helper maradhat; új recept nem szükségszerű.
- UI: Borin és Velka külön katalógusa; dismantle jog külön konfigurációval.

**B — Borin általános kovács, Velka minőségspecialista**
- Borin: általános, jóváhagyott felszerelés craft/dismantle.
- Velka: páncélillesztés, minőség- és beszállítóvizsgálat; mechanikai repair csak condition rendszer után.
- Canon-kompatibilitás: Borin széles szolgáltatása illeszkedik a fn-garranhoz; Velka karaktertörténetéhez erős, de a jelenlegi védelmi felszerelés craft-leírás felülvizsgálata szükséges.
- Játékosoldali egyediség: a művelettípus különbözteti meg a két NPC-t.
- Runtime: Velkához külön diagnosztikai action; repair csak WD-05/06 után.
- Recipe: Velka vizsgálata nem fogyaszt inputot és nem ad itemet; Borin a közös recipe contractot használja.
- UI: Borin craft/dismantle panel; Velka vizsgálati panel, repair ígéret nélkül.

A opció kevesebb Canon-szöveg változtatást, több katalógusszűrést igényel. B erősebb funkcionális különbség, de Velka service/fn leírásának projektgazdai felülvizsgálatát igényli. Egyik sem végleges döntés.

**Státusz:** SPECIFICATION COMPLETE — IMPLEMENTATION BLOCKED BY CENTRAL DECISIONS. A döntés WD-09.
