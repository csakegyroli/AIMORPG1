# AIMORPG — Concept Pack 02 (staging)

Ez a mappa az AIMORPG fejlesztői projektben elhelyezett, második grafikai koncepciócsomag dokumentációja.

- 22 tárgykoncepció a `public/assets/concept-staging/pack02/items/` alatt
- 4 NPC-portré a `public/assets/concept-staging/pack02/npc-portraits/` alatt
- 6 városrész-koncepció a `public/assets/concept-staging/pack02/districts/` alatt
- Eredeti többpaneles koncepciólap: `concept_board_02.png`
- A külön PNG kivágások: `source-crops/`
- Az ID-ket, útvonalakat, képméreteket és SHA-256 értékeket a `manifest.csv` és `crop_receipts.json` rögzíti.

**Integrációs határ:** minden elem `CONCEPT_ONLY_NOT_INTEGRATED`; a játékbeli stabil ID `UNASSIGNED`. A jelen csomag nem módosít runtime registryt, játéklogikát, adatbázist vagy API-szerződést. Ne jelenítsd meg éles assetként és ne rendelj a képekhez kitalált item/NPC/region ID-ket. A helyes mappinget a tényleges katalógus és fejlesztői jóváhagyás alapján kell elkészíteni.

**Minőségi korlát:** az önálló képek egy 1536×1024 kompozit táblából kivágott, felnagyított koncepciók (512×512 item/portré, 768×512 környezet). Nem átlátszó hátterű, végleges production assetek; önálló nagyfelbontású újraalkotást és vizuális ellenőrzést igényelhetnek.
