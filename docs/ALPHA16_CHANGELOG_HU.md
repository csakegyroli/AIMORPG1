# AIMORPG v2.0.0-alpha.16 — magyar változásnapló

## Cél és kiindulás
Az alpha.15 tényleges checkpointjából külön munkapéldány készült. Az alpha.12–alpha.15 checkpointok külső eredeti ZIP-jei változatlanok; az ellenőrzőösszegeiket a `docs/ALPHA16_INTEGRATION_SUMMARY.json` és a kiadási ellenőrzőjelentés rögzíti. Mindhárom grafikai forrásarchívum változatlan másolata a projektben marad: `docs/artwork-sources/concept-pack-01/AIMORPG_Grafikai_Koncepcio_01_original.zip`, `docs/artwork-sources/concept-pack-02/AIMORPG_Grafikai_Koncepcio_02_original.zip` és `docs/artwork-sources/concept-pack-03/AIMORPG_Grafikai_Koncepcio_03_original.zip`. Mindegyik ZIP-integritásteszt PASS, a másolat hash-e egyezik a feltöltött eredetivel; a kicsomagolt források, kontaktlapok és manifestek is megmaradnak.

## Integrált tárgygrafikák
Öt, korábban csak családfallbackkel megjelenő item kapott a Pack03 meglévő, önálló 512×512 WebP illusztrációjából egyedi ID-mappinget:

| Stabil item ID | Integrált koncepció | Indok |
|---|---|---|
| `streetMap` | `concept03-item-022` Küldetéstérkép | Térképes pergamen, illeszkedik a sikátorokat/rövidítéseket ábrázoló térkép leírásához. |
| `guildPermit` | `concept03-item-021` Céhokmány | Pecsételt céhes okmány, szerep szerint illeszkedik az ideiglenes céhes engedélyhez. |
| `tradeSilk` | `concept03-item-029` Finom szövet | Textiltekercs képe a nagy értékű selyemáruról szóló leíráshoz. |
| `guildMeal` | `concept03-item-032` Sajt és kenyér | Konkrét ételképe jobban megfelel a kiadós céhes vacsorának, mint az úti fejadag-fallback. |
| `sailcloth` | `concept03-item-035` Vitorlavászon | A kép közvetlenül vitorlavásznat ábrázol. |

A runtime kimenetek byte-szinten megegyeznek a forrás-WebP-kel. Mind az öt bejegyzéshez source/output SHA-256 és eredet, képlap, grid cella és bounding box került a `crop-receipts.json` állományba. A régi family fallback hozzárendelések törölve lettek, így az azonos ID egyszerre nem szerepel unique és family mappingként.

## Lefedettség és megőrzés
- Itemkatalógus: változatlan 187.
- Egyedi item art: 68 → **73**.
- Family fallback: 29 → **24**.
- Szándékos equipment-slot fallback: változatlan **90** (18 szett × 5 felszerelési hely).
- NPC: változatlan 69, explicit portrémapping 64; 13 korábban jelölt szerepazonossági felülvizsgálat továbbra is nyitott.
- Régió/részterület: változatlan 7 canonical régiómapping és 28 district mapping. A 7 Pack03 régiókép alternatív, már lefedett koncepcióként, a Hegyvidék pedig canonical ID nélküli review-ként marad stagingben.
- 48 tárgykoncepcióból: 5 integrált, 6 egy meglévő egyedi item alternatívájaként nyilvántartott, 37 `NEEDS_REVIEW`.
- A Pack03-ban nincs NPC-portré; NPC-képet nem generáltunk és nem rendeltünk be találomra.

## Kód-/tesztfrissítések
A `src/lib/visualAssets.ts`, a 2 tesztfájl, a látható app-verzió, a `package.json` és `package-lock.json`, a runtime assetek, az asset manifest és crop receipts frissült. A játékmeneti katalógus, árak, statisztikák, küldetések, NPC-adatok, dialógusok, napirendek, utazási szabályok, Canon/Dynamic Layer és szerveroldali szerződések nem változtak.

A teszt elvárásai 68/29-ről 73/24-re frissültek, és az új öt képre forrás/output hash-, fájl-, formátum- és mappingellenőrzés került.

## Tesztstátuszok
- `npm test`: **PASS** a munkapéldányban (core content, security, asset, UI smoke).
- `npm run lint`: **BLOCKED** — hiányzó Next.js/React és típuscsomagok; nem tekinthető kódhibától megtisztított typechecknek.
- `npm run build`: **BLOCKED** — `next: not found`.
- `npm ci`: **NOT RUN** — a korábbi `EAI_AGAIN` telepítési problémát nem ismételtük meg.
- Élő böngészős desktop/mobile QA: **NOT RUN**; semmilyen új asset nincs `VISUALLY VERIFIED`-ként feltüntetve.

A részletes backlog: `docs/ALPHA16_DEVELOPMENT_BACKLOG_HU.md`; strukturált feladatlista: `docs/ALPHA16_DEVELOPMENT_BACKLOG_HU.csv`. A teljes 03-as ZIP-leltár: `docs/ALPHA16_CONCEPT03_ARCHIVE_INVENTORY.csv`; 122 rekordos kumulatív koncepciómanifest: `docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA16.csv`.
