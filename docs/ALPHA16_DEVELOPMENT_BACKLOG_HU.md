# AIMORPG v2.0.0-alpha.16 — Bizonyítékokon alapuló fejlesztési backlog

**Forrásalap:** a 2026-10-19-i alpha.15 checkpoint külön munkapéldánya; a 03-as koncepció-ZIP; a tényleges `src/lib/content.ts`, `src/lib/visualAssets.ts`, `scripts/` és a korábbi, megőrzött auditdokumentumok. A backlog nem tekinti hibának a szándékos family/slot fallbacket, és a statikus forrásellenőrzést nem nevezi élő UI-QA-nak.

## Ellenőrzött aktuális alapállapot

- Katalógus: **187 item, 18 felszerelés-szett, 69 NPC, 60 küldetés, 28 körzet** — `npm test` forrás-/content smoke PASS.
- Item art az alpha.16 munkapéldányban: **73 unique ID mapping, 24 explicit family fallback, 90 slot fallback**; a 12 szemantikai kategória-fallback megmaradt ismeretlen teszt-azonosítókhoz.
- NPC-portré: **64 explicit mapping**, 69 NPC; a master manifestben **13** portré `NEEDS_REVIEW`, élő böngészős megjelenítés mind a 69-nél NOT RUN.
- Környezet: 7 canonical `REGION_ART` és 28 `DISTRICT_ART` mapping van; a Pack03 panorámák alternatív koncepcióként dokumentálva, mert aktív régiómappolások már léteznek.
- Pack03: 48 tárgykoncept + 8 régiókoncepció, 2 eredeti koncepciólap, 2 kontaktlap; a ZIP 64 fájlbejegyzése integritás- és képmegnyitási ellenőrzésen átment.
- 5 Pack03-tárgykép lett integrálva meglévő item-ID-hoz. Itemadat, item stat, ár, ritkaság, NPC-adat és játékmeneti kód nem változott.
- `npm test`: **PASS**. `npm run lint`: **BLOCKED** hiányzó `next`/`react`/típuscsomagokkal. `npm run build`: **BLOCKED** (`next: not found`). `npm ci`: NOT RUN; a korábbi EAI_AGAIN hibát nem ismételtük meg. Élő desktop/mobile QA: **NOT RUN**.

## Prioritás szerinti feladatok

### QA-001 — [P0] Dependency-complete lint és build hiteles futtatása
- **Terület/státusz:** D Minőségbiztosítás · `BLOCKED`
- **Bizonyíték:** package.json next/react/typescript script; node_modules hiányzik; docs/QA_EVIDENCE/alpha16-lint.log TS2307 next/react/jsx-runtime hiányokat mutat, alpha16-build.log: `next: not found`.
- **Szükséges munka:** Ne ismételd a telepítést ebben a hálózat nélküli munkamenetben. Támogatott Node 22+ gépen egyszer futtasd a lockfile-alapú npm ci-t; utána külön `npm run lint` és `npm run build`, a teljes logok megőrzésével.
- **Függőségek:** Hálózati npm-registry elérés vagy kész, lockfile-azonos dependency cache.
- **Felelős munkaszál:** Build/DevOps fejlesztő
- **Elfogadási feltétel:** Az npm ci reprodukálható; lint és build 0 exit kóddal fut; logok és környezetverzió rögzítve.

### UI-001 — [P0] Valódi desktop QA az item képek teljes megjelenítési útján
- **Terület/státusz:** B UI és megjelenítés · `NOT RUN`
- **Bizonyíték:** scripts/visual-ui-smoke.cjs a GameClient ItemArtwork-bekötését statikusan igazolja; docs/QA_EVIDENCE/alpha16-npm-test.log PASS, de élő browser QA NOT RUN.
- **Szükséges munka:** Futtasd a játékot dependency-complete környezetben 1440×900 nézeten; ellenőrizd az új streetMap, guildPermit, tradeSilk, guildMeal és sailcloth képeket inventoryban, tooltipben, piacon és releváns NPC szolgáltatásnál; nézd a console/network image hibákat.
- **Függőségek:** npm ci egyszer hálózattal rendelkező Node 22+ környezetben; build indíthatósága.
- **Felelős munkaszál:** UI fejlesztő + QA
- **Elfogadási feltétel:** Képernyőképek és konzol-/network-eredmény csatolva; a képek helyes ID-n jelennek meg inventory/market/service felületeken; nincs betöltési hiba; csak ekkor lehet az adott asset VISUALLY VERIFIED.

### UI-002 — [P0] Valódi mobil QA a gameplay és art felületeken
- **Terület/státusz:** B UI és megjelenítés · `NOT RUN`
- **Bizonyíték:** src/app/globals.css responsive breakpointokat tartalmaz; scripts/visual-ui-smoke.cjs csak CSS-forrás jelenlétét ellenőrzi. Mobil képernyőkép nincs.
- **Szükséges munka:** 390×844 vagy hasonló mobil viewporton vizsgáld inventory/felszerelést, piacot, NPC-listát/részletezőt, főtérképet/régiópanelt, quest naplót és hero HUD-ot; dokumentáld overflow, kontraszt, olvashatóság és képméretezés hibáit.
- **Függőségek:** Futó alkalmazás; desktop QA-val párhuzamos tesztadat.
- **Felelős munkaszál:** UI fejlesztő + QA
- **Elfogadási feltétel:** Valós mobil screenshotok; kritikus elemek nem fedik egymást, képek nem torzulnak, navigáció működik, nincs konzol- vagy képbetöltési hiba.

### ART-001 — [P1] A 24 megmaradt item-family fallback szemantikai felülvizsgálata
- **Terület/státusz:** A Grafikai hiányok · `NEEDS_REVIEW`
- **Bizonyíték:** src/lib/visualAssets.ts: ITEM_FAMILY_FALLBACK_ART; docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv; scripts/visual-assets-smoke.cjs. Jelenlegi ID-k: redStreetTokens, silentWellVial, heartyStew, smithingKit, gladiatorOil, arenaWhetstone, crowdScrip, matchLedger, arenaBlackToken, arenaProtein, arenaResin, merchantInk, sealedLedger, warehouseSeal, blackCoinLedgerFragment, promissoryNote, royalSealWax, saltFish, smugglersPass, captainsLogPage, blackCoinCargoTag, memoryMoss, stormSalt, silverEyeShard.
- **Szükséges munka:** Egyenként hasonlítsd össze a katalógusleírást a tényleges képpel; ha a meglévő források között van egyértelmű illusztráció, integráld egyedi ID-mappingként, máskülönben a fallback maradjon őszintén jelölve.
- **Függőségek:** Katalógus- és vizuális szakmai felülvizsgálat; no npm install needed for source audit.
- **Felelős munkaszál:** Fejlesztő + grafikai szál
- **Elfogadási feltétel:** Mind a 24 ID felülvizsgálva; minden új mapping stabil item-ID-ra és valódi forrásfájlra mutat; a family/unique státusz és eredetnyilvántartás konzisztens.

### ART-002 — [P1] A korábbi Pack 01/02 további 24 itemkoncepciójának ellenőrzése
- **Terület/státusz:** A Grafikai hiányok · `NEEDS_REVIEW`
- **Bizonyíték:** docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA16.csv; docs/ALPHA15_CONCEPT_ARCHIVE_INVENTORY_HU.md. A 10 korábban integrált item után 24 régi itemkoncepció maradt cél-ID nélkül.
- **Szükséges munka:** Vesd össze a koncepciókat a 187 item tényleges neveivel és leírásaival; a biztos targeteket dokumentáld, a bizonytalanokat hagyd UNASSIGNED/NEEDS_REVIEW állapotban.
- **Függőségek:** Alpha16 kumulatív koncepciómanifest; stabil katalógus-ID.
- **Felelős munkaszál:** Grafikai + tartalmi szál
- **Elfogadási feltétel:** A 24 rekord mindegyikének van indokolt végleges státusza; nincs találomra létrehozott item ID vagy játékmeneti rekord.

### ART-003 — [P1] A Pack 03 37 még hozzá nem rendelt tárgykoncepciójának felülvizsgálata
- **Terület/státusz:** A Grafikai hiányok · `NEEDS_REVIEW`
- **Bizonyíték:** docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA16.csv; docs/ALPHA16_CONCEPT03_ARCHIVE_INVENTORY.csv. A 48 képből 5 integrálva, 6 meglévő egyedi item alternatívájaként dokumentálva, 37 stabil target nélkül maradt.
- **Szükséges munka:** Karakterenként/tárgyanként hasonlítsd össze a tényleges képet, a célkatalógust és az itemleírást; ne a fájlnév vagy kontaktlapcímke döntsön.
- **Függőségek:** A korábbi koncepcióanyagok és a 187 itemes katalógus.
- **Felelős munkaszál:** Grafikai + itemrendszer fejlesztő
- **Elfogadási feltétel:** Mind a 37 koncepció státusza megerősített; csak egyértelmű meglévő ID esetén kerül runtime mappingbe; a kanonikus itemkatalógus nem bővül külön jóváhagyás nélkül.

### GAME-001 — [P1] Save export/import és migrációs tesztek
- **Terület/státusz:** C Játékmenet és integráció · `PLANNED`
- **Bizonyíték:** docs/DEVELOPMENT_ROADMAP_NEXT.md: Save resilience; a projekt localStorage-alapú böngészős demó, nem igazolt adatbázis-mentés.
- **Szükséges munka:** Készíts felhasználó által indított mentés-exportot/importot sémavalidálással, mentési verziót és teszteket korábbi állapotok migrációjára; hibás mentés ne törlődjön csendben.
- **Függőségek:** Meglévő store.ts save/load schema és verzió döntés.
- **Felelős munkaszál:** Gameplay/state fejlesztő
- **Elfogadási feltétel:** Érvényes mentés körkörös round-trip pass; hibás input elutasítva és megőrizve; migrációs regressziós tesztek; nincs csendes reset.

### GAME-002 — [P1] Side-story életciklus és regionális gate integrált playtest
- **Terület/státusz:** C Játékmenet és integráció · `PLANNED`
- **Bizonyíték:** docs/DEVELOPMENT_ROADMAP_NEXT.md felsorolja a gyakoriságot, ismétlésvédelmet, lejáratot, region gate-et és NPC-elérhetőséget; smoke test a 60 fő küldetés és content referenciák statikus integritását ellenőrzi.
- **Szükséges munka:** Valós karakterrel játssz végig ajánlat/elfogadás/elutasítás/követés/feloldás/fail-forward ágakat, alacsony és felszerelt karakterrel, külön napszak- és régióállapotokban.
- **Függőségek:** Futó alkalmazás és mentésállapotok.
- **Felelős munkaszál:** Gameplay QA + quest design
- **Elfogadási feltétel:** Minden lifecycle végállapot reprodukálható; jutalom/reputáció/inventory egyszer történik; region gate és NPC napirend nem kerülhető meg.

### NPC-001 — [P1] A 13 jelenleg NEEDS_REVIEW NPC-portré lezárása
- **Terület/státusz:** A Grafikai hiányok · `NEEDS_REVIEW`
- **Bizonyíték:** docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv; docs/QA_EVIDENCE/npc_portrait_audit/NPC_PORTRAIT_AUDIT_HU.csv. ID-k: nara, tomen, sera, taris, marwen, arenaRusk, harborTessa, harborSable, miri, damar, ilren, serin, velka. Az alpha15 frissítette az arenaSena/palaceOrven szerepmegfelelését, de az élő megjelenítés nem igazolt.
- **Szükséges munka:** Karakterenként ellenőrizd a szerepet, leírást, portréforrást és a karaktertulajdonos jóváhagyását. Hiányzó megfelelő koncepció esetén készíts pontos grafikai briefet.
- **Függőségek:** NPC lore és szerepleírás; grafikai szál.
- **Felelős munkaszál:** Grafikai + NPC tartalmi szál
- **Elfogadási feltétel:** Mind a 13 rekord jóváhagyva, szándékosan megtartva vagy új portrébriefet kap; nincs találomra történő mapping; új assetnél source/output hash és UI-QA rögzített.

### QA-002 — [P1] Asset source smoke teljes lefedés és csomagolt teszt folytatása
- **Terület/státusz:** D Minőségbiztosítás · `IN_PROGRESS`
- **Bizonyíték:** scripts/visual-assets-smoke.cjs most ellenőrzi az 5 új source/output SHA-256-t, fájlméretet, 512×512 WebP formátumot és family/unique kizárólagosságot; npm test PASS.
- **Szükséges munka:** Tartsd fenn a 73/24/90 elvárt számokat és a receipt-ellenőrzést; a checkpoint ZIP kibontott példányában is futtasd újra az npm testet.
- **Függőségek:** Végleges forrás és archívum.
- **Felelős munkaszál:** QA/fejlesztő
- **Elfogadási feltétel:** Munkapéldány és végleges ZIP külön npm test PASS; zip testzip PASS; külső SHA-256 egyezik.

### UI-003 — [P1] NPC directory, részletező és portré-fallback böngészős ellenőrzése
- **Terület/státusz:** B UI és megjelenítés · `NEEDS_REVIEW`
- **Bizonyíték:** src/components/GameClient.tsx: SafeArtImage/npcAvatar; 69 NPC, 64 explicit mapping, 5 mapping nélküli NPC közvetlen avatarSrc-re támaszkodik; 13 rekord a master manifestben NEEDS_REVIEW.
- **Szükséges munka:** Desktopon és mobilon ellenőrizd a jelenléti listát, NPC-részletezőt és dialógusablakot nappali/éjszakai állapotban; ellenőrizd mind a 13 felülvizsgálandó portrét és a kép fallback viselkedését.
- **Függőségek:** Futó alkalmazás és QA tesztadat.
- **Felelős munkaszál:** UI + NPC content QA
- **Elfogadási feltétel:** Képernyőképek, image load/network pass, helyes NPC-ID-hoz kötött portrék, szerep-megfelelés review lezárva vagy nyitottként megjelölve.

### UI-004 — [P1] Térkép, régió art, kapuk és tényleges utazás integrált QA-ja
- **Terület/státusz:** B UI és megjelenítés · `NOT RUN`
- **Bizonyíték:** src/lib/visualAssets.ts: 7 REGION_ART és 28 DISTRICT_ART; scripts/visual-ui-smoke.cjs statikusan igazolja a region artot és a `game.travel(selected.id)` külön explicit útvonalat.
- **Szükséges munka:** Ellenőrizd a nyitott és zárt régiót, hotspot/lista art egyezést, útvonalválasztást és az utazás tényleges akcióját; a területválasztás ne telepítsen automatikusan.
- **Függőségek:** Futó app; megfelelő mentésállapot a nyitott/zárt kapukhoz.
- **Felelős munkaszál:** Gameplay + UI QA
- **Elfogadási feltétel:** Desktop és mobil screenshot; zárt kapu nem kerülhető meg; kiválasztás nem teleport; utazás után helyszín, világidő és NPC-jelenlét konzisztens.

### ART-004 — [P2] A Pack 03 hét alternatív régióképének összehasonlító művészeti jóváhagyása
- **Terület/státusz:** A Grafikai hiányok · `NEEDS_REVIEW`
- **Bizonyíték:** src/lib/visualAssets.ts: REGION_ART (outskirts/market/arena/inner/palace/harbor/forest); docs/ALPHA16_CONCEPT03_ARCHIVE_INVENTORY.csv. Mind a hét célrégió már rendelkezik működő mappinggel.
- **Szükséges munka:** Készíts egymás melletti, nem runtime contact-sheet összehasonlítást az aktív és Pack03 panorámákról; csak art director jóváhagyással és futó UI-teszttel cserélj.
- **Függőségek:** Valódi desktop/mobile UI QA és vizuális jóváhagyás.
- **Felelős munkaszál:** Grafikai szál + UI fejlesztő
- **Elfogadási feltétel:** Mind a 7 alternatíva dokumentált döntést kap; nincs indokolatlan aktív mapping-csere; ha cserélve, output-hash és képernyőkép rögzítve.

### ART-005 — [P2] Hegyvidék koncepcióhoz kanonikus helyszínazonosító döntése
- **Terület/státusz:** A Grafikai hiányok · `NEEDS_REVIEW`
- **Bizonyíték:** Pack03 manifest `concept03-district-08-hegyvidek.webp`; src/lib/visualAssets.ts REGION_ART jelenleg hét régiót tartalmaz, köztük nincs mountain/highland.
- **Szükséges munka:** A világtervező döntse el, létezik-e dokumentált jövőbeli régió. Új stable region ID-t csak külön tartalmi döntés és játékmeneti terv részeként vezess be.
- **Függőségek:** Világbiblia és régiótervezési döntés.
- **Felelős munkaszál:** Tartalmi/világtervezői szál
- **Elfogadási feltétel:** Írásos döntés: stagingben marad, vagy jóváhagyott külön fejlesztési scope indul; asset önmagában nem hoz létre új régiót.

### ART-006 — [P2] A 90 generált felszerelés-szettdarab egyedi vizuális irányának eldöntése
- **Terület/státusz:** A Grafikai hiányok · `PLANNED`
- **Bizonyíték:** src/lib/content.ts: SET_ITEMS/buildSetItems; src/lib/visualAssets.ts: ITEM_SLOT_ART; scripts/smoke-test.cjs. A 18 szett × 5 slot = 90 tárgy jelenleg slot-fallbacket kap; ez a jelenlegi architektúrában szándékos fallback.
- **Szükséges munka:** Ne kezeld hibás mappingként. Döntsd el, mely szett/ritkaság/szlot kapjon önálló koncepciót, majd készíts assettervet stable item ID-k módosítása nélkül.
- **Függőségek:** Art direction, szett-lore és prioritási döntés.
- **Felelős munkaszál:** Grafikai + itemrendszer fejlesztő
- **Elfogadási feltétel:** Jóváhagyott cél-ID-lista és art brief; az elkészült assetek csak konkrét stable item-ID-hoz kerülnek; az egyéb slot-fallbackek továbbra is explicit státusszal jelennek meg.

### GAME-003 — [P2] NPC napirend, quest állapot, piac és készlet közös end-to-end regresszió
- **Terület/státusz:** C Játékmenet és integráció · `NOT RUN`
- **Bizonyíték:** src/lib/content.ts: 69 NPC, 60 küldetés, 28 körzet; scripts/smoke-test.cjs az ID/referencia-integritást vizsgálja, de a browseres felhasználói folyamat nem futott.
- **Szükséges munka:** Adjon hozzá determinisztikus end-to-end teszteket időléptetéssel, NPC jelenlétváltással, küldetésállapot-váltással, piacvásárlással és felszerelés/inventory egyeztetéssel.
- **Függőségek:** Tesztelhető app runtime és determinisztikus idő-/játékállapot fixture.
- **Felelős munkaszál:** Gameplay fejlesztő + QA
- **Elfogadási feltétel:** Automatizált forgatókönyvek ellenőrzik a state transitionöket, tranzakciók egyetlen alkalommal hatnak, mentés/load után a state konzisztensebb.

### NPC-002 — [P2] A Pack 01/02 további 14 önálló NPC-koncepciójának döntése
- **Terület/státusz:** A Grafikai hiányok · `NEEDS_REVIEW`
- **Bizonyíték:** docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA16.csv: 20 standalone NPC-portré, ebből 6 integrálva, 14 nincs kiválasztva. Ez koncepciószám, nem a 13 aktív NEEDS_REVIEW NPC-szám.
- **Szükséges munka:** A 14 képet vesd össze a teljes 69 NPC katalógussal; különítsd el a használható alternatívákat a kanonikus ID nélküli koncepcióktól.
- **Függőségek:** Stabil NPC-ID-k és leírások; karaktertulajdonosi jóváhagyás.
- **Felelős munkaszál:** Grafikai + tartalmi szál
- **Elfogadási feltétel:** Mind a 14 önálló koncepció dokumentált státuszt kap; nincs párhuzamos NPC vagy ID-kitalálás.

### UI-005 — [P2] Chronicle, A Szem és hosszabb szövegmodulok usability QA-ja
- **Terület/státusz:** B UI és megjelenítés · `NOT RUN`
- **Bizonyíték:** src/components/GameClient.tsx és src/app/globals.css létező Chronicle/A Szem felületeket tartalmaz; a jelenlegi vizuális smoke nem igazolja a teljes interaktív, többállapotú renderelést.
- **Szükséges munka:** Ellenőrizd a hosszabb történetszövegeket, overflowt, fókuszállapotokat, csökkentett mozgást, billentyűzetes navigációt és mobil olvashatóságot.
- **Függőségek:** Live browser QA környezet.
- **Felelős munkaszál:** UI/Accessibility QA
- **Elfogadási feltétel:** Képernyőképek/tesztjegyzőkönyv, fókusz és scroll hibamentes, responsive, reduced-motion tiszteletben tartva.

### GAME-004 — [P3] Szerver-authoritative NestJS/PostgreSQL/Prisma réteg későbbi fázisának specifikálása
- **Terület/státusz:** C Játékmenet és integráció · `PLANNED`
- **Bizonyíték:** docs/DEVELOPMENT_ROADMAP_NEXT.md és a projekt road map szerint a jelenlegi játszható build frontend/localStorage; nincs aktív NestJS API, PostgreSQL/Prisma vagy account-service.
- **Szükséges munka:** Külön architekturális munkaszálban definiáld DTO-kat, tranzakciós határokat, auth/rate limits, auditlogot, mentési és market/reward autoritást; ne építs párhuzamos state-et az alpha.16 art feladaton belül.
- **Függőségek:** Mentési séma és gameplay domain model stabilizálása.
- **Felelős munkaszál:** Backend/architektúra szál
- **Elfogadási feltétel:** Jóváhagyott API/adatmodell-szerződések, migration és tranzakciós tesztek, Canon/Dynamic Layer határ megőrizve.

### GAME-005 — [P3] AI runtime release gate fenntartása
- **Terület/státusz:** C Játékmenet és integráció · `PLANNED`
- **Bizonyíték:** docs/AI_RUNTIME_CONTRACT.md; docs/AIMORPG_CANON_DYNAMIC_LAYER_v1.0.md; roadmap szerint AI nincs még éles runtime-ként bekötve.
- **Szükséges munka:** Generatív AI csak structured proposal módban indulhat, ha a determinisztikus validatorok, anti-canon-drift és player agency tesztek sikeresek; AI ne írjon közvetlenül adatbázisba és ne módosítsa a Canont.
- **Függőségek:** Stabil backend contracts és teljes gameplay regression gates.
- **Felelős munkaszál:** AI architecture + gameplay safety
- **Elfogadási feltétel:** Adversarial tesztek duplikált questre, ismeretlen item/NPC ID-ra, időzóna exploitra, inventory túlcsordulásra és Canon driftre PASS.

## Fontos azonosítók a következő munkamenethez

- Családfallbackben maradt 24 item: `redStreetTokens, silentWellVial, heartyStew, smithingKit, gladiatorOil, arenaWhetstone, crowdScrip, matchLedger, arenaBlackToken, arenaProtein, arenaResin, merchantInk, sealedLedger, warehouseSeal, blackCoinLedgerFragment, promissoryNote, royalSealWax, saltFish, smugglersPass, captainsLogPage, blackCoinCargoTag, memoryMoss, stormSalt, silverEyeShard`.
- NPC `NEEDS_REVIEW`: `nara, tomen, sera, taris, marwen, arenaRusk, harborTessa, harborSable, miri, damar, ilren, serin, velka`.
- A Pack03-ból 37 itemkoncepció maradt stabil játékkatalógus-target nélkül; teljes fájl-, hash-, méret- és integrációs státusz: `ALPHA16_CONCEPT03_ARCHIVE_INVENTORY.csv` és `ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA16.csv`.
- Az alternatív panorámák nem cserélték le a már létező, stabil `REGION_ART` mappingeket. A Hegyvidék képet nem kötöttük be, mert nincs hozzá tényleges canonical régió-ID.
