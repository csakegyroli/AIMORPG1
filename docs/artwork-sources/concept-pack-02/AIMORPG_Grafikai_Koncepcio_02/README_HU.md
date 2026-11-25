# AIMORPG — Grafikai koncepciócsomag 02

## Tartalom
- 22 tárgykoncepció
- 4 NPC-portré-koncepció
- 6 városrész/környezet-koncepció
- teljes forrás-koncepciólap, képelőnézetek, CSV-jegyzék és SHA-256 kivágási nyilvántartás

## Projektbe helyezés
A `project_overlay/` könyvtár tartalmát a projekt gyökerébe másolva a fájlok a következő, elkülönített staging-útvonalakra kerülnek:
- `public/assets/concept-staging/pack02/items/`
- `public/assets/concept-staging/pack02/npc-portraits/`
- `public/assets/concept-staging/pack02/districts/`
- `docs/artwork-sources/concept-pack-02/`

Ezek a staging-útvonalak nem a jelenlegi runtime asset-mappinget írják felül. A ZIP nem módosít forráskódot, játékmenetet, adatbázist vagy meglévő assetet, és nem köti a koncepciókat hivatalos entity ID-khez. A `manifest.csv` `UNASSIGNED` értékeit csak a tényleges katalógus, NPC-adatok, régiónevek és fejlesztői jóváhagyás ellenőrzése után szabad feloldani.

## Minőségi és proveniencia-megjegyzés
Az önálló WebP-k 512×512-es tárgy-/portréképek, illetve 768×512-es környezetképek, amelyek egy 1536×1024-es kompozit koncepciólapból kivágott, felnagyított látványtervek. Nincs átlátszó háttér, nincs önálló nagyfelbontású forrás az egyes panelekhez, és a tényleges böngészős megjelenítés nincs ellenőrizve. Végleges játékassetként való használat előtt tartalmi és művészeti review, szükség szerint újragenerálás, majd a fejlesztő által ellenőrzött mapping és külön runtime QA szükséges.

## Ellenőrzött darabszámok
A manifestben 32 sor van: 22 item, 4 npc_portrait és 6 district_environment. Minden sor `CONCEPT_ONLY_NOT_INTEGRATED` státuszú.
