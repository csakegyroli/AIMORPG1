# AIMORPG v2.0.0-alpha.16 — teszt- és ellenőrzési jelentés

## Vizsgálati környezet

- Kiindulás: `AIMORPG-v2.0.0-alpha.15-Concept-Integration-Checkpoint.zip`.
- A forrás külön `/mnt/data/aimorpg-alpha16-work` munkapéldányba került; az alpha.15 archívum hash-e a vizsgálat előtt és az alapfájl aktuális állapotában is `f7a4c39823a72fda7853038495aba5447bcb67d6e2357d1e85976808fdbb7587`.
- Node.js `v22.16.0`, npm `10.9.2`.
- A Pack03 feltöltött ZIP SHA-256: `10c7229a201b022b42e45ea9b9d4c029d44ba91aead37e2f9d32266c576ce073`; az eredeti, projektben megőrzött másolat ugyanezt az értéket adja.
- Az eredeti pack ZIP-integritás tesztje PASS; 64 archívumbejegyzésből 48 önálló 512×512 WebP tárgykoncepció, 8 környezetkép, 2 forrás-koncepciólap, preview/konceptlapok és leíró/manifest fájlok vannak. A Pack01, Pack02 és Pack03 grafikai eredeti ZIP változatlan másolatban a végső projektcsomagba is bekerül; a fájlonkénti SHA-256 és ZIP-integritás PASS eredmények a `docs/ALPHA16_SOURCE_ARCHIVE_PRESERVATION_HU.json` fájlban vannak.

## Asset és katalógus ellenőrzés — PASS

- A valódi katalógus 187 tárgyat, 18 felszerelés-szettet, 69 NPC-t, 60 küldetést és 28 körzetet tartalmaz.
- A központi `visualAssets.ts` mappingekben 73 egyedi item-ID grafika van; a maradék 24 család-fallback és 90 felszerelési hely fallback a kód jelenlegi szándékos mechanizmusa. Az új öt grafika családfallbacket váltott le; a katalógus, árak, ritkaságok, statisztikák és játékmeneti rekordok változatlanok.
- A kódban talált 173 hard-coded vizuális assethivatkozás mind fájlra oldódott; hiányzó fájlhivatkozás: 0.
- Mind az öt új runtime asset létezik, megnyitható 512×512 WebP, és a forrás- és runtime kimenet SHA-256 összege bájtról bájtra egyezik:
  - `streetMap` — `a664cedf79eb56f9428b74c18dd45e191782ed346439e07488805ec5b6e8764f`
  - `guildPermit` — `458577e80b63c8ae35f87226c353598e5d7cfe6916acd105589e5fea9b83616b`
  - `tradeSilk` — `6fbadc0151a67cc93e74d5575b00a47568e6e210f1b4bf524e866bfb0aac20a5`
  - `guildMeal` — `cd24be8649fda5fcd534ad324ba2cf47785d1127004a903ef33d44f7781517c1`
  - `sailcloth` — `cd16da485ef5857c40f6c33d3b7907c31ebab53aa4d7ca1a788377c9b114257b`
- A source/crop-receipt és runtime mapping ellenőrzése a `scripts/visual-assets-smoke.cjs` tesztben van. A két koncepciómanifest, a Pack03 teljes CSV-leltára és a képi preview a `docs/` alatt található.

## Teszteredmények

### `npm test` — PASS

A végrehajtott parancs: `npm test`, amely a következőket futtatta:

1. `scripts/smoke-test.cjs` — PASS: katalógus, gameplay/content, TSX syntax/transpile smoke. A teszt nem teljes TypeScript szemantikai ellenőrzés.
2. `scripts/security-smoke.cjs` — PASS: jelszóhash runtime smoke.
3. `scripts/visual-assets-smoke.cjs` — PASS: 73 egyedi itemgrafika, 24 családfallback, 64 explicit NPC-portré mapping, 69 NPC, 28 körzet és forrás-/asset ellenőrzések.
4. `scripts/visual-ui-smoke.cjs` — PASS: alpha.16 verziófejléc, HUD/module wiring, responsive CSS forrás-ellenőrzés, régió hotspottérkép, kapu-/utazáskapcsolat és 344 soros fő assetmanifest.

A teljes log: `docs/QA_EVIDENCE/alpha16-npm-test.log`.

### `npm run lint` — BLOCKED

A `tsc --noEmit` elindult, de nem használható hiteles teljes lint/typecheck eredményként, mivel hiányzik a Next.js, React, `react/jsx-runtime` és a React/Node típuscsomagok telepített példánya. A log: `docs/QA_EVIDENCE/alpha16-lint.log`.

### `npm run build` — BLOCKED

Hiba: `sh: 1: next: not found`. A log: `docs/QA_EVIDENCE/alpha16-build.log`.

### `npm ci` — NOT RUN

A korábbi munkamenetben a csomagregiszter elérése `EAI_AGAIN` hibával meghiúsult. A kérésnek megfelelően nem ismételtük meg a telepítési próbát.

### Élő desktop-/mobil-böngészős QA — NOT RUN

A futó Next.js app nem indítható a hiányzó függőségekkel, ezért nincs élő böngészőben készült képernyőkép vagy `VISUALLY VERIFIED` állítás. A kontaktlapok a forrásképek statikus vizsgálati segédletei, nem futó app screenshotjai.

## Első smoke-futás hibája és korrekció

A módosítások utáni első `npm test` a régi 68 egyedi grafikát/29 családfallbacket váró tesztelváráson megbukott. A tesztelvárásokat a ténylegesen változott 73/24 lefedettségre frissítettük, és az új 5 asset forrás-/kimeneti hash-ellenőrzését hozzáadtuk. A teljes `npm test` ezt követően sikeres lett.

## Megőrzési és játékmeneti határok

Nem módosult a 187 item definíciója, itemstatisztika/ár/ritkaság, NPC definíció/dialógus/napirend, küldetés, világidő, utazási logika, mentési séma vagy szerveroldali szerződés. Az eredeti Pack03 ZIP és koncepcióképek a projektben megmaradtak. Új képet nem generáltunk.

## Checkpoint státusz

Az alpha.16 checkpoint kicsomagolt példányán az `npm test` PASS eredménnyel futott le; a végleges, hash-azonos ZIP integritását, bájtméretét, SHA-256 értékét és az exact ZIP-ből történő kicsomagolásos tesztet a külső `AIMORPG_ALPHA16_CHECKPOINT_VERIFICATION.json` és `AIMORPG_ALPHA16_EXTRACTED_CHECKPOINT_NPM_TEST.log` rögzíti. A lint/build és élő QA ettől függetlenül BLOCKED/NOT RUN marad.
