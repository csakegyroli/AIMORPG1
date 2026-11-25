# Alpha.22 fejlesztői állapotjelentés

## Kiindulópont
- Alpha.21 ZIP SHA-256: `b97f86925edb133718934db550eb0b890c6072df1b24dde525d381a9f93f84a5` — egyezik a ténylegesen számított értékkel.
- ZIP integritás: PASS (`testzip() == None`), 856 bejegyzés.
- Node.js `v22.16.0`, npm `10.9.2`.
- Az eredeti alpha.21 és alpha.20 ZIP változatlan.

## Módosított fájlok
- `package.json`, `package-lock.json`
- `src/components/GameClient.tsx`
- `src/app/globals.css`
- `scripts/smoke-test.cjs`, `scripts/visual-ui-smoke.cjs`
- `RELEASE-v2.0.0-alpha.22.md`
- `docs/ALPHA22_NPM_TEST.log`, `docs/ALPHA22_LINT.log`, `docs/ALPHA22_BUILD.log`

## Tesztek
- `npm test`: PASS; core/content, security, visual asset és visual UI smoke.
- `npm run lint`: exit 2, függőségi/típusdeklaráció hiány miatt blokkolt.
- `npm run build`: exit 127, `next: not found`.
- `npm ci`: megpróbálva, de a környezetben nem fejeződött be; a függőségek nem álltak helyre.
- Alkalmazásindítás, élő böngészős QA és hálózati assetbetöltés: NOT RUN.

## Vizuális javítások státusza
- A Szem képe a projektben önálló WebP, 960×640, 96,198 bájt. A komponens a `/assets/world/eye-observation.webp` fájlra hivatkozik. Élő betöltés nincs böngészőben igazolva.
- Világóra: alpha.21 elrendezési módosítás megőrizve; böngészős nézetekben nem ellenőrizhető ebben a környezetben.
- Áttekintés: jelenlegi `capital-dawn.webp` 960×640; új megfelelő, nagyfelbontású asset nem integrálódott.
- Játékosavatárok: `avatar-vagabond.webp` és `avatar-ranger.webp` 230×280; a CSS megőrzi az arányos `object-fit: cover` és `image-rendering:auto` viselkedést, de ez nem pótolja a nagyobb eredeti grafikát.
- Városrészek: nincs új, megfelelő minőségű grafika integrálva.

## QA-ellenőrzőlista
- Áttekintés képe éles: NOT RUN
- Játékosavatárok nem pixelesek: NOT RUN
- Városrészek képe megfelelő: NOT RUN
- Szem képe betöltődik és arányos: NOT RUN
- Szem négy nézete működik: NOT RUN
- Canon/Dynamic Layer írási jogosultság változatlan: PASS a célzott diff alapján; runtime teszt NOT RUN
- Világóra/logó átfedés: NOT RUN
- Térkép, gyorselérés, navigáció: automatizált forrás-smoke PASS; élő böngészős QA NOT RUN
- Nincs hiányzó asset / konzol- vagy hálózati hiba: NOT RUN
- Desktop és keskeny nézet: NOT RUN

## Összegzés
Az alpha.22 a tényleges alpha.21 forrásból készült és automatizált tesztjei sikeresek. Nem tekinthető teljes vizuális lezárásnak: az npm-függőségek helyreállítása, a böngészős QA, valamint a három problémás képfelület valódi assetcseréje még hátravan.
