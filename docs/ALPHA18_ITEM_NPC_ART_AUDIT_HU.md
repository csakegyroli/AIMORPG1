# AIMORPG v2.0.0-alpha.18 — Tárgy- és NPC-grafikai lefedettségi audit

## Audit alapja

A tényleges alpha.17 checkpoint külön munkapéldánya: `AIMORPG-v2.0.0-alpha.17-Item-Art-Integration-Checkpoint.zip`. A hivatalos ZIP SHA-256: `a00d7d3cece7049f36fd0487278378c0fa06cd39f1500ff77169189f5ea27884`. A Pack01–03 eredeti archívumai mind ZIP-integritás PASS eredményt adnak; hash-eik az auditban és a forrásmegőrzési jelentésben rögzítettek. A forrásokon dolgozó alfa.18 munkapéldány: `aimorpg-alpha18-work`.

## Soronkénti összesítés

### Tárgykatalógus — 187 rekord

| Státusz | Darab |
|---|---:|
| `UNIQUE_ART_VERIFIED` | 71 |
| `EXISTING_ART_INTEGRATION_REQUIRED` | 0 |
| `DUPLICATE_ART` | 109 |
| `NEEDS_NEW_ART` | 4 |
| `NEEDS_VISUAL_REVIEW` | 3 |
| `BLOCKED` | 0 |

Ellenőrzés: `ITEM_ART` 74 ID mapping, családfallback 23, slot-fallback öt slot; katalógus `187`. A 74 explicit item art közül 3 szemantikailag nagyon hasonló, ismételt illusztrációpárt érint (3 ismétlődő art row), ezért 71 kerül `UNIQUE_ART_VERIFIED` státuszba. A 90 set-item slot fallback külön-külön `DUPLICATE_ART` rekord, nem számít egyedi képnek. A családfallbackek között 16 átmenetileg szemantikailag elfogadható, 4 igazoltan képhiányos, 3 felülvizsgálatra vár.

### NPC-k — 69 rekord

| Státusz | Darab |
|---|---:|
| `UNIQUE_ART_VERIFIED` | 56 |
| `EXISTING_ART_INTEGRATION_REQUIRED` | 0 |
| `DUPLICATE_ART` | 0 |
| `NEEDS_NEW_ART` | 6 |
| `NEEDS_VISUAL_REVIEW` | 7 |
| `BLOCKED` | 0 |

Mind a 69 NPC runtime útvonala létezik és olvasható. `NPC_PORTRAIT_ART`: 64 explicit mapping; 5 rekord közvetlen régi `avatarSrc` útvonalat használ. Pontos fájlhash vagy útvonal duplikációt nem észleltünk az NPC-k között. A 13 korábban felülvizsgálatra jelölt NPC listája a tényleges alpha.17 review CSV-ből lett átvéve; közülük hatnál a jelenlegi portré jelentős szerepköri eltérése és a releváns packokban megfelelő pótlás hiánya alapján `NEEDS_NEW_ART`, hét esetben `NEEDS_VISUAL_REVIEW` marad.

## Alpha.18 igazolt módosítások

Az eredeti 1254×1254 forráslap `docs/artwork-sources/integration-sources/a_dark_fantasy_game_art_style_grid_illustration_a.png` megmaradt. Három szennyezett/panelhatáron átnyúló kivágás célzott, 512×512 WebP-ként újravágva: `courierRunners` (314,930,607,1223), `royalRapier` (620,926,922,1228), `harborAegis` (928,926,1242,1240). A három kimenet vizuálisan ellenőrizve; a crop-receipts és a master manifest SHA-256-, byte-, méret- és koordinátaadatot tartalmaz. A mappingek stabil útvonalai változatlanok, a játékmeneti adatok nem módosultak.

## Duplikációk és képhiányok

**Vizsgálattal igazolt vizuális ismétlések:** `courtInvitation` → `sealedLetter`, `echoThreadCloak` → `archiveMantle`, `harborCoat` → `ashweaveCoat`. A külön side-by-side bizonyítékok a `docs/QA_EVIDENCE/alpha18/compare-*.jpg` fájlok. A három `DUPLICATE_ART` sort nem cseréltük automatikus másik koncepcióval.

**Új tárgygrafikát igényel:** `arenaWhetstone`, `merchantInk`, `memoryMoss`, `silverEyeShard`.

**Tárgy-leírás jóváhagyásra vár:** `arenaProtein`, `saltFish`, `captainsLogPage`. A Pack03 szárított húsa nem egyezik bizonyíthatóan a meleg fehérjeétellel; a friss hal nem sózott hallal azonos; a krónikakönyv nem a kapitány naplójának egyetlen elszakadt lapja.

**NPC új portréigény:** `nara, tomen, sera, marwen, harborTessa, harborSable`. A teljes brief, kompozíciós igény, javasolt fájlnév és elfogadási feltétel a `ALPHA18_UNIQUE_ART_REQUESTS_HU.csv` állományban található. További `NEEDS_VISUAL_REVIEW`: `taris, arenaRusk, miri, damar, ilren, serin, velka`.

## Grafikai igénylista összesítés

A géppel feldolgozható `ALPHA18_UNIQUE_ART_REQUESTS_HU.csv` 119 rekordot tartalmaz: 113 tárgykép-igényt és 6 NPC-portré briefet. A 113 tárgyigényből 90 felszerelésiszett-darab még slot-fallbacket használ; 16 családfallback átmenetileg elfogadható, de nem egyedi; 4 stabil tárgy-ID-hoz nincs megfelelő meglévő kép; 3 explicit item mapping tartalmilag duplikált. A 3 `NEEDS_VISUAL_REVIEW` tárgyhoz egyelőre nem készül új artbrief, amíg a leírás-/art-owner döntés meg nem születik. A 6 NPC-brief: `nara`, `tomen`, `sera`, `marwen`, `harborTessa`, `harborSable`; a további 7 NPC review marad.

A három koncepció-pack eredeti, önálló assetjeinek leltári rekordjai a megőrzött manifestben: Pack01 34, Pack02 32, Pack03 56 (összesen 122); az Alpha.18 által javított 3 korábbi forráslapkivágással a master manifest 125 rekordos. A 125/125 forrásfájl létezik, és a forrás SHA-256 értéke egyezik.

## Képduplikáció-ellenőrzés

A 74 explicit `ITEM_ART` képen 2 701 páronkénti DCT-perceptual-hash összevetés készült (32×32 szürkeárnyalatos kép, 8×8 alacsony frekvenciás DCT, Hamming-távolság). Három párnál volt 10 vagy kisebb távolság, és ezeket a kontaktlapon kézzel is megerősítettük: `sealedLetter`/`courtInvitation` (8), `archiveMantle`/`echoThreadCloak` (10), `ashweaveCoat`/`harborCoat` (8). A következő legközelebbi párok 12-es távolságúak és szemrevételezés alapján más tárgyat ábrázolnak (pl. `firstWitnessLens`/`sealedLedger`, `paddedArmor`/`brineproofScale`), ezért nem számoltuk őket duplikációnak. Részletes eredmény: `docs/QA_EVIDENCE/alpha18/ALPHA18_ITEM_VISUAL_DUPLICATE_ANALYSIS.json`.

## Státuszok értelmezése

`UNIQUE_ART_VERIFIED` és `SOURCE VERIFIED` a forrás, az útvonal, a fájl és a kép tartalmának statikus ellenőrzésére vonatkozik. Ez **nem** jelenti, hogy az asset a futó alkalmazásban `VISUALLY VERIFIED`. Az élő desktop-/mobil UI ellenőrzés `NOT RUN`.
