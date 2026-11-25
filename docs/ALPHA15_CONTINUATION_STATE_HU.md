# AIMORPG alpha.15 — folytatási állapot

## Kiindulópont
- Elkészült checkpoint: `AIMORPG-v2.0.0-alpha.15-Concept-Integration-Checkpoint.zip`; az ellenőrzött elérési út, fájlméret és SHA-256 a csomagon kívüli ellenőrzési összefoglalóban szerepel.
- Előzmények: az alpha.12, alpha.13 és alpha.14 archívumokat külön, az eredeti útvonalukon megőriztem; nem kerülnek be egymásba ágyazott ZIP-ként az alpha.15-be.
- A két koncepcióarchívum SHA-256 összege és ZIP-integritása a `docs/ALPHA15_CONCEPT_INTEGRATION_SUMMARY.json` fájlban található.

## Integrációs állapot
- 10 item ID integrált, az `ITEM_ART` stabil mappingjei változatlanok.
- 6 NPC-portré integrált szerep-/kontextus-egyezéssel. `rovan`, `garran`, `eldra` új explicit, ID-alapú mappinget kapott; `arenaSena`, `palaceOrven`, `harborKael` korábbi mappingje mögött az asset frissült. Garran UI-szintű hardcoded képútvonalai megszűntek.
- 6 canonical `REGION_ART` kép frissült; a `forest` és a 28 `DISTRICT_ART` mapping nem változott.
- 44 koncepció `NEEDS_REVIEW`: 24 item, 14 NPC, 6 alternatív városrész-kép. A Pack 02 kontaktlapon jelzett négy, önálló fájl nélküli panel nem került integrációba.

## Első következő lépések
1. Hálózattal rendelkező, támogatott Node.js-környezetben a lockfile megőrzésével futtatni `npm ci`, utána külön `npm run lint` és `npm run build` (ebben a munkaszakaszban nem történt telepítési újrapróba).
2. Futtatható appból desktop és mobil böngészős QA, tényleges képernyőképekkel: item inventory / felszerelés / piac; NPC-lista / részletező / dialógus; régió hotspot / lista / régió hőskép. Csak ezután jelölhető `VISUALLY VERIFIED`.
3. A 44 `NEEDS_REVIEW` sor egyenkénti katalógus- és lore-felülvizsgálata. A board-only 2 tárgy (utazóköpeny, rubingyűrű) és 2 portré (rejtélyes tudós, második kovács) integrációjához hiányzik a megfelelő különálló forráskivágás és a forrásmanifest-rekord.
4. A `arenaSena`, `palaceOrven` és további role-level match portréknál a végleges művészeti jóváhagyás külön szükséges; az illusztráció nem állít kanonikus arcazonosságot.

## Megőrzött források és rollback
- Az eredeti standalone koncepció PNG-k érintetlenül maradnak a `docs/artwork-sources/concept-pack-01/` és `concept-pack-02/` alatt.
- Az alpha.14-ben aktív assetek rollback másolata: `docs/artwork-sources/alpha14-overridden-assets/`.
- A forrás/output hash-lánc: `docs/artwork-sources/integration-sources/crop-receipts.json`; a teljes leltár `docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA15.csv`.
