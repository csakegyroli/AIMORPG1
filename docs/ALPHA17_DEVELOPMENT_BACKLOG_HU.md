# AIMORPG alpha.17 — bizonyítékokon alapuló fejlesztési backlog

Minden tétel a tényleges alpha.17 forrásból, tesztből vagy explicit környezeti blokkolásból származik. A `PLANNED` és `NOT RUN` nem jelenti azt, hogy a munka megtörtént.

Összes tétel: **20**. Prioritás szerinti megoszlás: **P0**: 3, **P1**: 11, **P2**: 4, **P3**: 2.

## P0

### QA-001 — Dependency-complete lint futtatás

- **Státusz:** `BLOCKED`
- **Bizonyíték:** package.json (lint=tsc --noEmit); docs/ALPHA17_TEST_REPORT_HU.md rögzíti, hogy hiányzik a next/react/types és az npm ci korábban EAI_AGAIN hibával állt le.
- **Szükséges munka:** Node 22+ és elérhető npm registry vagy ellenőrzött lockfile-azonos függőségi cache mellett egyetlen reprodukálható telepítés; utána külön npm run lint és teljes log mentése.
- **Függőség:** Hálózattal rendelkező környezet vagy előre cache-elt package-lock-függőségek.
- **Felelős munkaszál:** Fejlesztő/DevOps
- **Elfogadási feltétel:** npm run lint 0 exit code-dal lefut, Node/npm verzió és teljes log rögzített.

### QA-002 — Dependency-complete production build

- **Státusz:** `BLOCKED`
- **Bizonyíték:** package.json build=next build; a korábbi futás next: not found hibával blokkolt.
- **Szükséges munka:** A QA-001 által helyreállított, lockfile-azonos környezetben futtasd külön a next build parancsot.
- **Függőség:** QA-001; működő Next.js bináris.
- **Felelős munkaszál:** Fejlesztő/DevOps
- **Elfogadási feltétel:** Build 0 exit code-dal lefut; output és környezetverzió megőrizve.

### UI-001 — A sealedLedger és az átrendezett fallbackek élő UI QA-ja

- **Státusz:** `NOT RUN`
- **Bizonyíték:** src/lib/visualAssets.ts; public/assets/items/sealedLedger.webp; docs/ALPHA17_ITEM_ART_AUDIT_HU.csv; docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv. Forrásellenőrzés PASS, élő UI NOT RUN.
- **Szükséges munka:** Desktop 1440×900 és mobil 390×844 nézetben ellenőrizd a lepecsételt főkönyvet inventory/tooltip/reward helyeken, valamint heartyStew és stormSalt fallbacket; vizsgáld a console/network image hibákat.
- **Függőség:** QA-001/QA-002 és futtatható alkalmazás.
- **Felelős munkaszál:** UI fejlesztő + QA
- **Elfogadási feltétel:** Valódi appból készült képernyőképek; helyes ID-k, nem torzult képek, nincs 404 vagy konzolhiba; csak ezután VISUALLY VERIFIED.

## P1

### ART-001 — Arena whetstone egyedi illusztrációjának elkészítése

- **Státusz:** `NEEDS_NEW_ART`
- **Bizonyíték:** src/lib/content.ts arenaWhetstone; src/lib/visualAssets.ts fallback workshopIron; docs/ALPHA17_ITEM_ART_AUDIT_HU.csv. Pack01–03 itemkoncepciók között nincs pontos fenőkő.
- **Szükséges munka:** Grafikai szál készíts fenőkövet ábrázoló 512×512 WEBP-t; a kő láthatóan fenőkő legyen, ne érc vagy vasrúd.
- **Függőség:** Grafikai jóváhagyás, a jelenlegi stabil arenaWhetstone ID változatlan.
- **Felelős munkaszál:** Grafikai szál
- **Elfogadási feltétel:** Az eredeti forrás megőrzött; source/output hash receipt; ITEM_ART.arenaWhetstone mapping; asset smoke PASS; desktop/mobile UI QA.

### ART-002 — Merchant ink egyedi illusztrációjának elkészítése

- **Státusz:** `NEEDS_NEW_ART`
- **Bizonyíték:** src/lib/content.ts merchantInk (sűrű tinta szerződésekhez); src/lib/visualAssets.ts fallback blackArchiveIndex; ALPHA17_ITEM_ART_AUDIT_HU.csv.
- **Szükséges munka:** Készíts tintatartót vagy sűrű tinta üvegét mutató ikon assetet; ne helyettesítsd könyvvel/levéltári indexszel.
- **Függőség:** Grafikai szál; item ID és leírás marad változatlan.
- **Felelős munkaszál:** Grafikai szál
- **Elfogadási feltétel:** 512×512 WEBP, forrás és output hash, receipt és manifest, valid ITEM_ART mapping, smoke PASS.

### ART-003 — Memory moss egyedi illusztrációjának elkészítése

- **Státusz:** `NEEDS_NEW_ART`
- **Bizonyíték:** src/lib/expansionItems.ts memoryMoss leírás: nedves kőfalon növő ezüstös moha; jelenlegi fallback moonleaf.
- **Szükséges munka:** Mutass nedves kőfelületen növő ezüstös mohát, de ne sima levél- vagy fekete-lótusz képet.
- **Függőség:** Grafikai brief és item-ID invariáns.
- **Felelős munkaszál:** Grafikai szál
- **Elfogadási feltétel:** Kép bizonyíthatóan moha; source/output hash és crop receipt; unique art map; smoke és UI QA.

### ART-004 — Silver Eye shard egyedi illusztrációjának elkészítése

- **Státusz:** `NEEDS_NEW_ART`
- **Bizonyíték:** src/lib/expansionItems.ts silverEyeShard: apró, hideg, nem világító szilánk; mostani fallback runeInfusion főzet.
- **Szükséges munka:** Kis, nem világító, ezüstös szilánk grafika; kerülje az izzó kristály / főzet olvasatot.
- **Függőség:** Grafikai jóváhagyás; Canon clue szöveg változatlan.
- **Felelős munkaszál:** Grafikai szál
- **Elfogadási feltétel:** 512×512 WEBP, provenance receipt, stable ID mapping; gameplay data unchanged; smoke PASS.

### ART-005 — Három közeli koncepció célzott tartalmi felülvizsgálata

- **Státusz:** `NEEDS_REVIEW`
- **Bizonyíték:** Pack03 concept03-item-033 Szárított hús; concept03-item-034 Halászszákmány; concept03-item-028 Bőrtekercs; current item IDs arenaProtein, saltFish, captainsLogPage; Alpha17 item audit.
- **Szükséges munka:** Tartalmi felelős döntse el, megfelel-e a szárított hús a meleg fehérjedús ételhez, a halászszákmány a sózott halhoz, illetve a bőrtekercs a hajórakomány naplólapjához. Addig ne mappingelj.
- **Függőség:** A megfelelő pack assetek és kanonikus itemdefiníciók megtekintése.
- **Felelős munkaszál:** Grafikai + item tartalmi szál
- **Elfogadási feltétel:** Mindhárom stable ID külön írásos döntést kap; vagy fallback marad, vagy pontos mapping/brief kerül jóváhagyásra; nincs találomra integráció.

### ART-006 — A Pack02 22 és a Pack03 37 felülvizsgálati tétel végleges döntése

- **Státusz:** `NEEDS_REVIEW`
- **Bizonyíték:** docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA17.csv: 22 Pack02 item és 37 Pack03 item marad NEEDS_REVIEW; a Pack01 citadel medallion is UNASSIGNED/NEEDS_REVIEW.
- **Szükséges munka:** Katalógusonként hasonlítsd össze a koncepció tényleges tartalmát, stabil item ID-t, leírást és már létező egyedi képet; dokumentáld alternatíva, elfogadható fallback, gap vagy irreleváns koncepció döntését.
- **Függőség:** Az ALPHA17_ITEM_ART_AUDIT_HU.csv és eredeti forrásképek.
- **Felelős munkaszál:** Grafikai + item tartalmi szál
- **Elfogadási feltétel:** Minden koncepciósor kap indokolt státuszt; nincs automatikus 1:1 párosítás; eredeti assetek megmaradnak.

### UI-002 — Inventory/equipment/market/tooltip képútvonal teljes QA-ja

- **Státusz:** `NOT RUN`
- **Bizonyíték:** src/components/GameClient.tsx ItemArtwork; scripts/visual-ui-smoke.cjs statikus ellenőrzés; vizuális élő QA nincs.
- **Szükséges munka:** Próbáld ki az egyedi képet, családfallback címkét, slot fallbacket, filtert és tooltipet; sérült fájlnál ellenőrizd a fallback állapotot.
- **Függőség:** Futó alpha17 app és tesztmentés.
- **Felelős munkaszál:** UI fejlesztő + QA
- **Elfogadási feltétel:** Desktop/mobile screenshotok és console/network logs; minden item ID a megfelelő grafikát mutatja.

### UI-003 — NPC-szolgáltatás és piaci tranzakció end-to-end UI QA

- **Státusz:** `NOT RUN`
- **Bizonyíték:** src/lib/content.ts: marketEligible/sellable item fields; scripts/smoke-test.cjs statikus state/content checks.
- **Szükséges munka:** Valós appban ellenőrizd a vásárlás/eladás, nem kereskedhető quest itemek, NPC workbench artwork és inventory frissülés útját.
- **Függőség:** Futó alkalmazás, fixálható teszt karakterállapot.
- **Felelős munkaszál:** UI + gameplay QA
- **Elfogadási feltétel:** Vásárlás/eladás után ár, pénz és inventory egyszer frissül; quest item korlátozás érvényes; képek nem hibásak.

### UI-004 — Régiógrafika, régiókapu és tényleges utazás QA

- **Státusz:** `NOT RUN`
- **Bizonyíték:** src/lib/visualAssets.ts REGION_ART/DISTRICT_ART; scripts/visual-ui-smoke.cjs ellenőrzi a forráskódos kötéseket és a gate/travel wiringet.
- **Szükséges munka:** Desktop/mobil nézetben hasonlítsd össze a térkép hotspotját, helyszínképét, zárt kaput, kijelölést és tényleges game.travel műveletet.
- **Függőség:** Futó app és nyitott/zárt régiót tartalmazó fixture.
- **Felelős munkaszál:** Gameplay + UI QA
- **Elfogadási feltétel:** A kijelölés nem teleport; zárt kapu nem kerülhető meg; utazás után régió, világidő és NPC-jelenlét konzisztens; screenshot és log megőrizve.

### GAME-001 — Save export/import és migrációs regresszió

- **Státusz:** `PLANNED`
- **Bizonyíték:** docs/DEVELOPMENT_ROADMAP_NEXT.md és src/lib/store.ts; jelenlegi teszt nem teljes körű böngészős mentés-round-trip.
- **Szükséges munka:** Felhasználó által indított export/import sémavalidációval és verziózott migrációkkal; hibás mentést ne töröljön csendben.
- **Függőség:** Save schema/verzió döntés.
- **Felelős munkaszál:** Gameplay/state fejlesztő
- **Elfogadási feltétel:** Valid mentés round-trip PASS, hibás bemenet elutasítva és megőrizve, régi mentés migrációja regressziós tesztelve.

### QA-003 — Végleges ZIP-ben futó teszt és SHA-256 megismétlése

- **Státusz:** `IN_PROGRESS`
- **Bizonyíték:** scripts/smoke-test.cjs, scripts/visual-assets-smoke.cjs, scripts/visual-ui-smoke.cjs; korábbi checkpoint flow külön csomagolt tesztet ír elő.
- **Szükséges munka:** Módosítás után tiszta ZIP, unzip -t, külső SHA-256, majd ZIP-ből kibontott példányon npm test; kizárni node_modules, .next, .git, dist, coverage, .env*.
- **Függőség:** Végleges alpha17 forrásmódosítások.
- **Felelős munkaszál:** Release/QA
- **Elfogadási feltétel:** Munkapéldány és kibontott checkpoint npm test PASS; zip test PASS; SHA fájl egyezik; archivált logok.

## P2

### ART-007 — A 90 generated equipment slot fallback art irányának jóváhagyása

- **Státusz:** `PLANNED`
- **Bizonyíték:** src/lib/visualAssets.ts ITEM_SLOT_ART; scripts/smoke-test.cjs 18 set × 5 slot = 90 fallback.
- **Szükséges munka:** A szettek lore/ritkaság/szlot alapján határozd meg mely darabok érdemelnek külön képet; ne tekintsd a slot fallbacket automatikus hibának.
- **Függőség:** Jóváhagyott set-prioritás és art budget.
- **Felelős munkaszál:** Itemrendszer + grafikai szál
- **Elfogadási feltétel:** Elfogadott stable item ID lista és brief; a többi slot fallback explicit marad.

### ART-008 — A 13 NPC-portré NEEDS_REVIEW lezárása

- **Státusz:** `NEEDS_REVIEW`
- **Bizonyíték:** docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv; docs/ALPHA17_NPC_PORTRAIT_REVIEW_HU.csv; docs/ALPHA17_NPC_PORTRAIT_REVIEW_AND_ART_HANDOFF_HU.md. A főmanifestben 13 aktív NEEDS_REVIEW NPC sor van.
- **Szükséges munka:** Karakterenként ellenőrizd a stabil ID-t, leírást, forrásképet és szerepmegfelelést. A grafikai átadási dokumentum tartalmazza a meglévő Pack01 jelölteket is, de ezeket nem rendeli be automatikusan; tulajdonosi jóváhagyás után döntsd el, elég-e meglévő kép vagy új portré szükséges.
- **Függőség:** NPC leírások, karaktertulajdonosi jóváhagyás és elérhető Pack01/02 portrék.
- **Felelős munkaszál:** Grafikai + NPC tartalmi szál
- **Elfogadási feltétel:** Mind a 13 rekord dokumentált döntést vagy jóváhagyott grafikai briefet kap; nincs találomra mapping; új assetnél forrás-/output hash és futó UI QA rögzített.

### UI-005 — Panorámás fővárosi képernyő, Chronicle és A Szem reszponzív QA

- **Státusz:** `NOT RUN`
- **Bizonyíték:** src/components/GameClient.tsx és src/app/globals.css meglévő panelek; statikus visual UI smoke PASS, élő többállapotú megjelenítés nincs igazolva.
- **Szükséges munka:** Vizsgáld a 1440×900 és 390×844 layoutot, fókuszállapotokat, görgetést, kontrasztot, csökkentett mozgást és hosszú szövegeket.
- **Függőség:** Futó böngészős alkalmazás.
- **Felelős munkaszál:** UI/Accessibility QA
- **Elfogadási feltétel:** Screenshotok; nincs overflow/overlay hiba; billentyűzetes navigáció és reduced-motion működik.

### GAME-002 — NPC napirend, küldetésállapot és piac közös end-to-end tesztje

- **Státusz:** `NOT RUN`
- **Bizonyíték:** src/lib/content.ts: 69 NPC, 60 quest, 28 district; scripts/smoke-test.cjs ID/referencia integritást fed, nem teljes futó UI folyamatot.
- **Szükséges munka:** Determinista időléptetéses forgatókönyv NPC jelenlétre, quest transitionre, piaci vásárlásra, jutalomra és inventory/equipment konzisztenciára.
- **Függőség:** Futó app és determinisztikus game-state fixture.
- **Felelős munkaszál:** Gameplay fejlesztő + QA
- **Elfogadási feltétel:** Minden state transition reprodukálható; tranzakciók egyszer hatnak; save/load után nincs eltérés.

## P3

### GAME-003 — Későbbi szerver-authoritative architektúra külön specifikációja

- **Státusz:** `PLANNED`
- **Bizonyíték:** docs/DEVELOPMENT_ROADMAP_NEXT.md; alpha17 csomag nem vezet be új élő backend/API-t.
- **Szükséges munka:** Külön munkaszálban definiáld az auth, DTO, transaction, save/market/reward authority és audit log szerződéseket; Canon/Dynamic Layer szétválasztás megtartása.
- **Függőség:** Jóváhagyott domain- és save-schema szerződések.
- **Felelős munkaszál:** Backend/architektúra
- **Elfogadási feltétel:** Jóváhagyott API/data contracts és regressziós tesztek; nincs párhuzamos játékállapot.

### GAME-004 — AI runtime biztonsági kapui külön munkafázisban

- **Státusz:** `PLANNED`
- **Bizonyíték:** docs/AI_RUNTIME_CONTRACT.md; docs/AIMORPG_CANON_DYNAMIC_LAYER_v1.0.md; jelen feladat nem engedélyez élő generatív API bekötést.
- **Szükséges munka:** A generatív rendszer csak strukturált javaslatot adhasson; determinisztikus validator, anti-canon-drift és player-agency tesztek után külön engedélyezés.
- **Függőség:** Stabil backend és validator contractok.
- **Felelős munkaszál:** AI architektúra + gameplay safety
- **Elfogadási feltétel:** Adversarial tesztek ismeretlen item/NPC ID, duplikált quest, inventory túlcsordulás, Canon drift és időzítés exploit ellen PASS.

