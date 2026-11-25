# AIMORPG alpha.25 — magyar fejlesztői átadási jelentés

## 1. Kiindulás és eredet

A munkapéldány alapja az `AIMORPG-v2.0.0-alpha.24-Visual-Overhaul-Checkpoint.zip`. A tényleges SHA-256: `91b77f2176a259e22fe597c1916c4fcd8d4a809558e84de4989fb507fbd984ad` (korábban közölt értékkel egyezett), ZIP-integritás: PASS, 873 bejegyzés.

A felhasználó által feltöltött `AIMORPG_UI_Arculat_01.zip` tényleges SHA-256: `364b861431ab7f3d2ebef71a253fa2631c214c579b294c32aae118617be422f9`; ZIP-integritás: PASS, 16 bejegyzés. A `03_A_Szem_UI_Spec_HU.md` és a `06_A_Szem_Hub_Reference_Crop.jpg`, illetve a `01_AIMORPG_Master_UI_Concept_Board.png` tartalmát ténylegesen megvizsgáltam.

A koncepció alapján a kívánt Szem egy kék optikai/relikvia-mag bronzgyűrűkkel és gótikus környezettel. A projekt korábbi `/assets/world/eye-observation.webp` fájlja valójában csillagászati gömböt és alakot ábrázolt, nem a koncepcióban látható szem-relikviát; a korábbi animáció ennek a képnek a fölé rajzolt overlay volt. Ez jelentős vizuális eltérés.

## 2. Alpha.24 megoldásának értékelése

- Megtartva: az alpha.24 státuszadatainak adatforrásai, a négy Szem-nézet, a világóra adatforrása és a játék navigációja.
- Elvetve: az egyetlen `GameMaster` nézetben használt, különálló `EyeGazeOverlay` megoldás, valamint az a szemfókusz, amely nem a kanonikus Szem-koncepciót használó assetre illeszkedett.
- Új megközelítés: közös `EyeEntity` komponens, közös referencia-asset és azonos korlátozott mozgáslogika mindhárom felületre.

## 3. Módosított fájlok

- `src/components/EyeEntity.tsx` — új közös Szem-entitás és navigációs szemjel.
- `src/components/GameClient.tsx` — Térkép, Áttekintés, fővárosi gyorselérés és Szem-fül integráció; látható verzió alpha.25.
- `src/app/globals.css` — közös szemréteg, kompakt variánsok, fejléc- és világóra-elrendezés, reszponzív szabályok, reduced-motion.
- `public/assets/world/eye-canonical.webp` — a koncepciótáblából származtatott 570×350 WEBP.
- `package.json`, `package-lock.json` — alpha.25 verzió.
- `scripts/smoke-test.cjs` — az új EyeEntity TSX-szintaxisának ellenőrzése.
- `scripts/visual-ui-smoke.cjs` — verzió-, közös komponens-, asset-, reduced-motion- és fejlécellenőrzések.
- `RELEASE-v2.0.0-alpha.25.md` és `docs/alpha25/*` — dokumentáció és naplók.

## 4. Három felület státusza

| Felület | Forrásintegráció | Böngészőben ellenőrizve |
|---|---|---|
| Térkép | `map-eye` közös `EyeEntity mode="compact"` | NOT VERIFIED |
| Áttekintés | `overview-eye` közös `EyeEntity mode="compact"` | NOT VERIFIED |
| A Szem füle | `GameMaster` közös `EyeEntity mode="scene"`; négy alnézet megmaradt | NOT VERIFIED |

A három felület azonos `eye-canonical.webp` assetet és közös animációs komponenst használ. A külön DOM-példányok külön időzítőt használnak, tehát a mozgás ritmusa hasonló, de nem globálisan szinkronizált. A közös identitás/viselkedés kódoldali egységesítése megtörtént; az egyidejű mozgás fázisszinkronja nincs garantálva.

## 5. Animációs architektúra

A `EyeEntity` kliensoldali React-komponens, natív `setTimeout` ütemezéssel, változó 0,9–3,3 másodperces nyugalmi időkkel és kis amplitúdójú irányváltásokkal. Az időzítők unmountkor takarítódnak. `prefers-reduced-motion: reduce` esetén az időzítés nem indul el, illetve a változáskor a mozgás leáll. Nem történik képkockánkénti React-frissítés, külső függőség vagy világadat-írás.

A forráskoncepció lapos referencia-kép. A `eye-canonical.webp` kivágott/felnagyított koncepcióasset; nem különálló eredeti íriszréteg. A mozgó sötét pupilla/íriszréteg ezért vizuális ráépítés. A pozíciót és a maszkot csak böngészős megtekintéssel lehet véglegesen jóváhagyni, ez még nem történt meg.

## 6. Tesztstátuszok

| Ellenőrzés | Státusz | Részlet |
|---|---|---|
| `npm test` | PASS | Core/content, TSX transpile (EyeEntity is), biztonság, asset és UI smoke. |
| `npm ci --offline --no-audit --no-fund` | FAIL | `ENOTCACHED`: `why-is-node-running@2.3.0` csomag nincs a helyi cache-ben. |
| Online `npm ci --no-audit --no-fund` | BLOCKED | Nem sikerült igazolni a telepítést; a futtatás időkorlátba ütközött, a folyamatot le kellett állítani. |
| `npm run lint` | FAIL | Hiányzik a Next.js/React és a JSX-típusok. |
| `npm run build` | FAIL | `sh: 1: next: not found`, exit 127. |
| Alkalmazásindítás | BLOCKED | Hiányzó `next` bináris. |
| Valódi böngészős QA | NOT RUN | Nem futott a Next.js alkalmazás; nincs valódi demóképernyőkép vagy animációfelvétel. |
| ZIP-integritás | PASS | A végleges csomag ellenőrizve. |

## 7. Nyitott hibák / következő lépés

1. A Next.js/React-függőségek telepítésének helyreállítása a projekt lockfile-jának megőrzésével.
2. A futó demó megnyitása Chromiumban; mindhárom felület vizuális ellenőrzése és képernyőképek készítése.
3. A pupilla illeszkedésének és mozgási amplitúdójának beállítása a tényleges renderelt képhez.
4. A fejléc világórájának ellenőrzése a felhasználó képernyőszélességén, az összes státusz megőrzésével.
5. A csökkentett mozgás és az ismételt nézetváltás ellenőrzése.

A checkpoint kész és visszaállítható, de a fő elfogadási feltétel — a futó demóban ténylegesen látható, megfelelő tekintetmozgás — jelenleg `NOT VERIFIED`.

## 8. Checkpoint metaadata

- Archívum: `AIMORPG-v2.0.0-alpha.25-Canonical-Eye-Checkpoint.zip`
- ZIP tartalma: 886 fájlbejegyzés (a node_modules és a build-cache nem része a forráscsomagnak).
- ZIP-integritás: PASS (`ZipFile.testzip()` nem talált hibás tagot).
- Végleges SHA-256: a külső `.zip.sha256` ellenőrzőfájlban szereplő, a végleges archívumról újraszámított érték.
- Az archívumból frissen kibontott projekt `npm test` futtatása: PASS.
