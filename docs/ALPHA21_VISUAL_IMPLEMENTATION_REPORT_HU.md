# AIMORPG v2.0.0-alpha.21 — vizuális implementációs jelentés

## A. Kiindulási állapot
- Forrás: `AIMORPG-v2.0.0-alpha.20-Navigation-and-The-Eye-Integration-Checkpoint.zip`.
- Frissen ellenőrzött SHA-256: `cb6d3c0fabe99be60fdcf67e1ca955b507adcdfec17b74f7e6d0d692cf809811`.
- ZIP-integritás: `ZipFile.testzip()` → `None`; 924 bejegyzés.
- Külön munkapéldány: `alpha21-work`; az eredeti alpha.20 ZIP változatlan.
- A projekt nem Git-repozitórium, ezért Git-branch/working-tree állapot nem kérdezhető le.
- A projektben megtalálható az önálló `public/assets/world/eye-observation.webp` (960×640, WebP, 96 198 bájt), a `capital-dawn.webp` (960×640, WebP, 112 792 bájt), valamint a `avatar-ranger.webp` és `avatar-vagabond.webp` (egyenként 230×280). Ezek a tényleges forrásfájlok; a pontosan kifogásolt böngészős megjelenítést böngésző hiányában nem lehetett élőben igazolni.

## B. Megvalósított változtatások
1. `src/components/GameClient.tsx`
   - A látható verziójelzés alpha.20-ról alpha.21-re frissült.
   - A Szem fejlécében a kis embléma helyett a meglévő, önálló, 960×640-es obszervatórium-illusztráció jelenik meg nagyobb, leíró alt szöveggel.
   - A négy nézet és meglévő adatforrásaik változatlanok.
2. `src/app/globals.css`
   - Új, célzott `.gm-hero-illustrated` megjelenés sötét fantasy háttérrel, nagyobb képpel és reszponzív elrendezéssel.
   - A világóra korábbi pozicionálási szabályait egy későbbi, célzott felülírás semlegesíti: normál dokumentumfolyamban, saját sorban jelenik meg; mobilon kompakt rácsot használ.
   - Képek méretezésénél explicit `image-rendering:auto` került a fontos avatár- és hero-képválasztókra; ez önmagában nem állítja helyre egy alacsony felbontású forrás részleteit.
3. `package.json`, `package-lock.json`: verzió `2.0.0-alpha.21`.
4. `scripts/smoke-test.cjs`, `scripts/visual-ui-smoke.cjs`: alpha.21 verzióelvárás és UI-ellenőrzések.
5. `RELEASE-v2.0.0-alpha.21.md`: kiadási összefoglaló.

### Nem teljesített vizuális célok
- Az Áttekintés első fejezetének képét nem cseréltem le: a jelenlegi forrás `capital-dawn.webp` 960×640-as; ennél jobb, tartalmilag egyező eredeti nem lett igazolva.
- A játékosavatárok és a Városrészek panorámája nem lett lecserélve. Az avatárok forrásai 230×280-asak; a tényleges pixelesedés okát élő böngészőben nem sikerült ellenőrizni.
- A képalkotó próbák egész UI-képernyőket adtak vissza, nem önálló, integrálható illusztrációt; ezeket nem integráltam, mert kollázs/screenshot nem helyettesítheti az önálló assetet.

## C. Tesztek
- `npm test`: PASS. Core/content smoke, TSX syntax/transpile smoke, security, visual assets és visual UI smoke mind sikeres.
- `npm run lint`: BLOCKED, kilépési kód 2; hiányzó `next`, `react`, `react/jsx-runtime` és React/Node típusok miatt.
- `npm run build`: BLOCKED, kilépési kód 127; `sh: 1: next: not found`.
- Függőségek telepítése nem történt, lockfile-t nem töröltem és nem generáltam újra.
- Böngészős QA: NOT RUN. Nincs telepített Next.js runtime és tényleges böngészőellenőrzésre alkalmas futó környezet.

## D. Átadás
- Munkapéldány: `/mnt/data/alpha21-work`.
- Új checkpoint: `AIMORPG-v2.0.0-alpha.21-Visual-Polish-Checkpoint.zip`.
- ZIP SHA-256: a külön `.sha256` ellenőrzőfájl tartalmazza a ténylegesen létrejött végleges ZIP hashét.
- Tesztnaplók: `docs/ALPHA21_NPM_TEST.log`, `docs/ALPHA21_LINT.log`, `docs/ALPHA21_BUILD.log`.
- A Szem illusztrációja a meglévő `public/assets/world/eye-observation.webp`; új grafikai assetet nem állítok elkészültnek.

## E. Következő lépés
A projekt függőségeinek lockfile-hű helyreállítása, majd a módosított nézetek tényleges böngészős QA-ja. Ezután külön kell megvizsgálni a három fennmaradó képi problémát, és csak igazolt, megfelelő minőségű eredeti vagy önálló asset esetén cserélni a képeket.
