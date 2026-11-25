# AIMORPG Grafikai Koncepció 03 — leltárösszefoglaló

## Azonosított forrás

- Feltöltött fájl: `AIMORPG_Grafikai_Koncepcio_03(2).zip`
- Méret: 10 107 570 bájt
- SHA-256: `10c7229a201b022b42e45ea9b9d4c029d44ba91aead37e2f9d32266c576ce073`
- ZIP állapota: `PASS`, 64 archívumbejegyzés.
- A változatlan eredeti ZIP a `docs/artwork-sources/concept-pack-03/AIMORPG_Grafikai_Koncepcio_03_original.zip` fájlban marad. A 01-es és 02-es koncepcióarchívum eredeti, változatlan ZIP-másolata is bekerült a megfelelő `concept-pack-01/` és `concept-pack-02/` mappába. A három másolat hash-e az eredeti feltöltött fájlokkal egyezik; a részleteket a `docs/ALPHA16_SOURCE_ARCHIVE_PRESERVATION_HU.json` tartalmazza.

## Tartalom

- 48 önálló 512×512-es WebP tárgykoncepció.
- 8 széles formátumú környezet-/régiókoncepció.
- 2 forrás-koncepciólap/képlap.
- Kiegészítő kontakt-/előnézeti képek, manifest, crop-receipts, README és a csomag saját npm tesztnaplója.
- Teljes fájlszintű leltár: `ALPHA16_CONCEPT03_ARCHIVE_INVENTORY.csv` (64 rekord: fájlnév, típus, formátum, méret, bájtszám, SHA-256, megnyithatóság és integrációs státusz).

## Párosítás és döntések

- **5 integrált:** `streetMap`, `guildPermit`, `tradeSilk`, `guildMeal`, `sailcloth`. Ezeknél a stabil itemleírás és a ténylegesen látható tárgy tartalma megfeleltethető; a forrásfájlok már önálló WebP-k voltak, így további kivágás nem kellett.
- **6 meglévő egyedi item alternatívája:** `stormKnot`, `firstWitnessLens`, `brokenSealRing`, `quietBell`, `caravanCompass`, `sailorsKnife`. Nem cserélődtek le, mert a katalógusban már van működő egyedi ID-mapping.
- **37 `NEEDS_REVIEW`:** a többi tárgykoncepció nem kapcsolható kockázat nélkül stabil item-ID-hez; nem hoztunk létre kitalált játéktárgyat vagy új statisztikát.
- **7 régiókép alternatíva:** a már létező régió-/környezetmappolásokkal összevetendők, nem váltották le automatikusan a működő artot.
- **1 régiókoncepció `NEEDS_REVIEW`:** a Hegyvidékhez nem található megfelelő canonical régióazonosító; stabil ID nélkül nem történt bekötés.
- NPC-portré nincs a Pack03 önálló assetkészletében; ezért új NPC-kép nem készült és nem került be.

## Kapcsolódó bizonyítékok

- `ALPHA16_CONCEPT03_ARCHIVE_INVENTORY.csv` — minden fájl statikus adatai.
- `ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA16.csv` — kumulatív koncepciómanifest.
- `QA_EVIDENCE/alpha16-pack03-item-audit-contact-sheet.jpg` — a 48 tárgykoncepció címkézett statikus áttekintése.
- `QA_EVIDENCE/alpha16-integrated-item-art-contact-sheet.jpg` — az öt kiválasztott runtime képfájl statikus előnézete.
- `artwork-sources/integration-sources/crop-receipts.json` — forrás-, képlap- és hasheredet.

A kontaktlapok az önálló képek forráselemzését segítik; nem bizonyítják a futó UI-ban való megjelenést. Élő desktop/mobile QA `NOT RUN`.
