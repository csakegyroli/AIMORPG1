# AIMORPG alpha.17 — Pack01–03 koncepciók felülvizsgálati jegyzőkönyve

A koncepció-manifest **122** sorát átvettem az alpha.16 történeti manifestjéből; kizárólag a bizonyíthatóan illeszkedő Pack01 `concept01_item_11` sor változott `sealedLedger` integrációra.

## Tárgykoncepciók

- **Pack01:** 10 korábbi alpha.13 integráció megmarad; `concept01_item_11` most `sealedLedger`-hez integrált; `concept01_item_12` citadella-medál `NEEDS_REVIEW`, mert nincs közvetlenül igazolt stabil tárgy-ID.
- **Pack02:** 22 önálló tárgykoncepció továbbra is `NEEDS_REVIEW`; a meglévő felszerelések és relikviák egy részének alternatívája lehet, de a jelen munkában nem találtunk olyan stabil ID-t és szemantikai megfelelést, amely a már megfelelő unique mapping cseréjét indokolná.
- **Pack03:** az öt korábbi alpha.16 integráció változatlan. Hat korábbi tétel `ALREADY_COVERED_ALTERNATE_CONCEPT`; a maradó **37** tárgykoncepció `NEEDS_REVIEW`. A 37 koncepciót nem rendeltük automatikusan a 24 családfallbacket használó itemekhez.

### Három konkrét, de nem elég pontos jelölt

- `arenaProtein` ↔ `concept03-item-033` Szárított hús: a képi tartalom étel, de a katalógus meleg/sűrű, fehérjedús ételt ír le. `NEEDS_REVIEW`.
- `saltFish` ↔ `concept03-item-034` Halászszákmány: a kép friss fogást sugall, de a tárgy sózott, tartósított hal. `NEEDS_REVIEW`.
- `captainsLogPage` ↔ `concept03-item-028` Bőrtekercs: dokumentumhoz közel áll, de nem igazolja az elszakadt hajórakomány-naplólapot. `NEEDS_REVIEW`.

### Bizonyított új művészeti hiányok

- `arenaWhetstone`: nincs fenőkő-koncepció; az vasrúd nem megfelelő helyettesítő.
- `merchantInk`: nincs tintatartó/tinta-koncepció a Pack01–03 elérhető önálló tárgyképei között.
- `memoryMoss`: levél vagy lótusz nem azonos a leírt ezüstös mohával.
- `silverEyeShard`: főzet vagy általános relikvia nem bizonyítja a kifejezetten nem világító szilánkot.

## NPC és környezet

A Pack03 nem hozott önálló NPC-portrékat. Az alpha.16 folytatási állapota alapján a 13 aktív `NEEDS_REVIEW` NPC: `nara`, `tomen`, `sera`, `taris`, `marwen`, `arenaRusk`, `harborTessa`, `harborSable`, `miri`, `damar`, `ilren`, `serin`, `velka`. A korábbi alpha.15 `arenaSena`/`palaceOrven` szerep-eltérését nem nyitottam újra bizonyíték nélkül.

A régiók képeinél a kanonikus helyszínazonosítókat megőriztem. A Pack03 Hegyvidék koncepciója nem kap új ID-t, mert nincs megalapozott kanonikus `mountain/highland` régió. A környezetképeket nem cseréltem ki pusztán azért, mert alternatíva rendelkezésre áll.

## Bizonyítékok

- `docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA17.csv` — minden koncepció stabil forrás- és státuszrekordja.
- `docs/ALPHA17_ITEM_ART_AUDIT_HU.csv` és `.json` — mind a 187 item tényleges current mapping szerinti auditja.
- `docs/artwork-sources/integration-sources/crop-receipts.json` — új `sealedLedger` forrás/output hash.
- `docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv` — fő asset-regiszter frissítve; live UI render `NOT RUN`.
