# AIMORPG – Grafikai koncepciócsomag 03

## Tartalom
- 48 különálló, 512×512 WebP tárgykoncepció (`items/`).
- 8 különálló, széles képarányú városrész-/régiókoncepció (`districts/`).
- Eredeti, változatlan koncepciólapok (`sources/`).
- `manifest.csv`: megjelenítési nevek, forráslap, rácscella, kivágási koordináták és állapot.
- `previews/`: áttekintő képlapok.

## Fontos integrációs szabályok
Az `asset_id` értékek kizárólag a koncepciócsomag belső azonosítói; **nem** az AIMORPG stabil tárgy-, NPC- vagy régióazonosítói. A fájlok nem kerülnek aktív `ITEM_ART`, NPC-portré- vagy régiómappingbe. Kizárólag staging-assetek, amíg a fejlesztő az eredeti forrásban ellenőrzi a jelentést és a kanonikus hozzárendelést.

A tárgyak forráslapról kivágott és 512×512 méretre készített koncepcióképek; ezért a végleges játékbeli használat előtt érdemes az elsődleges jellegzetességet, kis méretű olvashatóságot, átlátszó hátteret és szemantikai megfelelést ellenőrizni. A városképek környezeti koncepciók, nem garantáltan végleges canon helyszínnevek.

## Javasolt projektstaging-útvonal
- `public/assets/concept-staging/pack03/items/`
- `public/assets/concept-staging/pack03/districts/`
- `docs/artwork-sources/concept-pack-03/`

A pack03 nem módosítja a játékszabályokat, tartalmi adatokat, meglévő asseteket vagy aktív mappingeket.
