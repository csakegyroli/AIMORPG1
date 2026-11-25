# AIMORPG v2.0.0-alpha.26 — Canonical Eye futtatási blokkolók és vizuális validálás

## Összefoglaló

Az alpha.26 az ellenőrzött alpha.25 checkpoint külön munkapéldányából készült. Célzott javításokat tartalmaz a közös Szem animációs életciklusán, a régi obszervatórium-háttér használatán és a fejléc reszponzív tördelésén. A projekt nem tekinthető vizuálisan validáltnak: a függőségek telepítése a registry DNS-hibája miatt blokkolt, ezért a Next.js alkalmazás nem indítható el ebben a környezetben, és nem készült valódi böngészős képernyőkép vagy animációs felvétel.

## Kiindulási forrás ellenőrzése

- Eredeti ZIP: `AIMORPG-v2.0.0-alpha.25-Canonical-Eye-Checkpoint.zip`
- Tényleges SHA-256: `1aebb1703b1881c8dfd029a528d1ed9f87802fd0221dbaad295d33a37e1aa96e`
- A korábbi SHA-256 fájllal egyezik.
- ZIP bejegyzések száma: 887; `ZipFile.testzip()` eredménye: `None` (PASS).
- Az eredeti ZIP változatlan maradt.
- A munkapéldány: `alpha25-validation-work`; verzió: `2.0.0-alpha.26`.
- Arculati referencia: `AIMORPG_UI_Arculat_01.zip`, SHA-256 `364b861431ab7f3d2ebef71a253fa2631c214c579b294c32aae118617be422f9`; 16 bejegyzés, ZIP-integritás PASS.

## Környezetdiagnosztika

- Node.js: `v22.16.0`
- npm: `10.9.2`
- `package-lock.json`: jelen van, lockfileVersion 3; nem töröltem és nem generáltam újra.
- `node_modules`: gyakorlatilag üres.
- npm cache: 0 cache-bejegyzés, 0 bájt tartalom.
- `npm ping`: `EAI_AGAIN`, DNS-feloldás sikertelen a `registry.npmjs.org` címhez.
- `npm ci --fetch-retries=0 --fetch-timeout=10000`: blokkolt; a napló több csomag letöltésénél `EAI_AGAIN` hibát mutat, majd az npm `Exit handler never called!` üzenettel kilépett.
- Chromium bináris elérhető (`/usr/bin/chromium`), de futó Next.js alkalmazás nélkül ez nem alkalmas az alkalmazás tényleges QA-jára.

## Módosítások

1. `src/components/EyeEntity.tsx`
   - Az animációs timer takarítása dedikált `clearTimer()` függvényt használ.
   - A `prefers-reduced-motion` változására leállítja vagy újraindítja az ütemezést.
   - A `mode` bekerült az effect függőségei közé.
   - A kompakt változat mozgása kevésbé csillapított (0,8×), hogy kis méretben is látható lehessen.
   - Az irányváltozások továbbra is korlátozottak és szabálytalan szünetekkel működnek.

2. `src/app/globals.css`
   - Az Áttekintés Szem-panelje és a Szem hub illusztrált fejlécének háttere már nem használja a régi `eye-observation.webp` assetet; visszafogott, sötét fantasy felületi háttérre váltott.
   - A kanonikus Szem-komponens pupillarétegének középpontja és mérete a referencia szemközéppontjához igazítva módosult.
   - 1250 px alatt a fejléc státuszelemei rendezett tördelést kaphatnak; a világóra külön, teljes szélességű sávja desktopon továbbra sem a fejléc alá kerül.

3. `src/components/GameClient.tsx`, `package.json`, `package-lock.json`, `scripts/smoke-test.cjs`, `scripts/visual-ui-smoke.cjs`
   - Verzió alpha.26-ra frissítve.
   - A UI smoke teszt az alpha.26 fejlécet és a kanonikus asset bekötését ellenőrzi; ellenőrzi azt is, hogy a fő Áttekintés- és Szem-hub CSS-szabályok nem tartják meg a régi obszervatórium-hátteret.

## Státusztábla

| Ellenőrzés | Státusz | Eredmény |
|---|---|---|
| Alpha.25 ZIP hash | PASS | Egyezik a korábban jelentett hash-sel |
| Alpha.25 ZIP integritás | PASS | 887 bejegyzés, hibás tag nincs |
| Arculati ZIP integritás | PASS | 16 bejegyzés, hibás tag nincs |
| `npm test` | PASS | Core/content, biztonság, asset és UI smoke tesztek sikeresek |
| `npm run lint` | BLOCKED | Hiányzó Next.js/React és típusdeklarációk miatt számos TS-hiba |
| `npm run build` | BLOCKED | `next: not found` |
| Függőségek telepítése | BLOCKED | Registry DNS `EAI_AGAIN`; npm cache üres |
| Alkalmazásindítás | BLOCKED | A Next.js függőség nincs telepítve |
| Böngészős QA — Térkép | NOT RUN | Nincs futó alkalmazás |
| Böngészős QA — Áttekintés | NOT RUN | Nincs futó alkalmazás |
| Böngészős QA — A Szem fül | NOT RUN | Nincs futó alkalmazás |
| Mozgást igazoló felvétel | NOT RUN | Nem készült; statikus kép nem lenne bizonyíték |

## Fontos korlátozás

A kód és az automatizált smoke tesztek ellenőrizve lettek, de ez nem bizonyítja, hogy a tekintet a valódi demóban természetesnek és jól illeszkedőnek látszik. A `eye-canonical.webp` továbbra is lapos illusztráció, ezért az írisz/pupilla külön CSS-réteg. A végső vizuális elfogadás blokkolt marad a függőségek helyreállításáig és a három felület böngészős ellenőrzéséig.

## Folytatáshoz szükséges konkrét feltétel

Olyan hálózati vagy előre feltöltött npm-csomagkörnyezet szükséges, amelyből a `package-lock.json` szerinti Next.js, React, TypeScript és típuscsomagok telepíthetők. Ezután: `npm ci`, `npm test`, `npm run lint`, `npm run build`, `npm run dev`, majd a Térkép, Áttekintés és Szem fül ellenőrzése asztali és keskeny nézetben, csökkentett mozgással is.
