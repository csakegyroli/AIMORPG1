# AIMORPG alpha.24 — fejlesztői átadási jelentés

## Kiindulás és megőrzés
Az alpha.23 ZIP tényleges SHA-256 értéke `e4b078e0d523236ebedd073e756b5455d2238cdd7052857f9dcf9dc76c63004c`, ami egyezik a korábban jelentett hashértékkel. A ZIP tartalmát ellenőriztem, és külön munkapéldányt készítettem `/mnt/data/alpha24-work` alatt. A korábbi checkpoint ZIP-eket nem írtam felül.

## Javítások
- A `ServerTowerClock` most a `.topbar` elemen belül renderelődik, nem a fejléc utáni külön teljes szélességű sávban.
- A fő navigáció A Szem gombja a dekoratív `✧` karakter helyett a meglévő `/assets/eye-emblem-v2.webp` assetet használja.
- A `EyeGazeOverlay` láthatóbb méretet és a mágikus gömb közepéhez igazított pozíciót kapott. A mozgás változó szünetekkel és eltérő irányokkal működik, a `prefers-reduced-motion` letiltja.
- Frissült a `package.json`, a lockfile, a látható verziójelzés és a UI-smoke teszt.

## Fontos technikai pontosítás
A `/assets/world/eye-observation.webp` egy lapos, 960×640-as WebP illusztráció. Nincs benne külön animálható írisz vagy szemhéj. Az animációs réteg egy hozzáadott stilizált írisz a kék gömb fölött; nem állítom, hogy az eredeti grafika saját írisze külön mozog. A pontos illeszkedés és a láthatóság böngészőben még nem igazolt.

## Tesztstátusz
- `npm test`: PASS — core/content, security, asset és UI smoke tesztek.
- `npm run lint`: BLOCKED — hiányzó `chai`, `deep-eql`, `estree`, `node`, `react`, `react-dom` típuscsomagok.
- `npm run build`: BLOCKED — `next: not found`.
- `npm ci --offline`: BLOCKED — `ENOTCACHED`, a `why-is-node-running@2.3.0` csomag nem érhető el a helyi cache-ben.
- Alkalmazásindítás: NOT RUN.
- Élő böngészős QA, képernyőkép és mozgásfelvétel: NOT RUN, mert az app függőségek nélkül nem indítható el.

## Grafikai audit és nyitott hibák
- A szem fő illusztrációja: technikailag érvényes, 960×640 WebP; az animációs overlay integrálva van, de élő megjelenése nincs igazolva.
- Fő navigációs szemikon: a meglévő eye-emblem assetre cserélve a forráskódban; böngészőben nem igazolt.
- Világóra: a DOM-szerkezetben a felső státuszsorba került; desktop/mobil elrendezés nincs böngészőben igazolva.
- Áttekintés 1. fejezetének képe: nyitott.
- Játékosavatárok forrásfelbontása: nyitott.
- „A város nem díszlet” kép: nyitott.
- Pack02 és NPC Pack01 ZIP-ek: a jelenlegi `/mnt/data` fájllistában nem találhatók; nem tekinthetők integráltnak.

## Módosított fájlok
- `src/components/GameClient.tsx`
- `src/app/globals.css`
- `package.json`
- `package-lock.json`
- `scripts/smoke-test.cjs`
- `scripts/visual-ui-smoke.cjs`
- `RELEASE-v2.0.0-alpha.24.md`
- `docs/ALPHA24_STATUS_HU.md`
- `docs/ALPHA24_NPM_TEST.log`
- `docs/ALPHA24_LINT.log`
- `docs/ALPHA24_BUILD.log`

## Összegzés
Az alpha.24 javítja a forrásbeli fejlécelrendezést és a szemikon hozzárendelését, továbbá nagyobb, középre igazított mozgó overlayt használ. A felhasználó által jelzett vizuális hibák lezárását azonban nem állítom, amíg a függőségek telepítése, a build, az alkalmazásindítás és az élő böngészős elfogadási teszt nem fut le.
