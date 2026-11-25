# AIMORPG alpha.20 — fejlesztői átadás

## A. Kiindulási állapot

- Kiinduló csomag: `AIMORPG-v2.0.0-alpha.19-UI-Theme-Foundation-Checkpoint.zip`.
- Frissen ellenőrzött SHA-256: `0a19d5f2da6b34631414cee0e14033441a627119846f50b31c78cfe5f24eab89`.
- A forrás ZIP integritásvizsgálata sikeres; a csomagban 845 fájl volt.
- A package.json és lockfile alpha.19-et jelölt; a theme tokenek és `:focus-visible` stílus jelen voltak.
- Git-állapot nem volt elérhető: a munkakönyvtár nem Git-repozitórium. Ezért a módosítások fájlszintű patchként vannak mellékelve.

## B. Implementáció

- `src/components/GameClient.tsx`: 11 meglévő nézet öt funkcionális navigációs csoportba rendezve. Megmaradnak a korábbi `ViewId` azonosítók és a meglévő `go()` navigáció.
- Ugyanitt A Szem négy nézete: Világállapot (jelenlegi játékadatok és meglévő világóra); Emlékek (`game.worldMemories`); Látomások (csak a meglévő Dynamic Layer események explicit `vision`/`látomás` címkével, különben őszinte üres állapot); Események (meglévő runtime világ-események és királysági naptár).
- `src/app/globals.css`: csoportosított navigáció, nézetfülek (bal/jobb nyíl, Home/End, fókuszcsapda nélküli roving tabindex), adattáblák, üres állapotok és reszponzív elrendezés stílusai; a korábbi theme tokenek használatával.
- `package.json`, `package-lock.json`: verzió alpha.20.
- `scripts/smoke-test.cjs`, `scripts/visual-ui-smoke.cjs`: verzió- és funkcionális forrásellenőrzések.
- A Canon, Dynamic Layer írási működése, adatbázis, API-szerződések, tárgyak, küldetések, gazdaság és NPC-viselkedés nem változott.
- `docs/ALPHA20_SOURCE_DIFF.patch`: ellenőrizhető fájlszintű diff az alpha.19-hez képest.

## C. Tesztek

- `npm test` — **PASS**: core/content smoke; TSX szintaxis/transpile smoke; jelszóhash runtime; visual asset smoke; visual UI smoke.
- `npm run lint` — **BLOCKED**, exit 2: hiányzik a Next.js, React és típusdeklarációik; a TypeScript-kimenet többek között hiányzó modulokat és ezekből következő JSX típushibákat jelez.
- `npm run build` — **BLOCKED**, exit 127: `sh: 1: next: not found`.
- `npm ci --offline --ignore-scripts` — **BLOCKED**, exit 1: a helyi npm cache nem tartalmazza a `why-is-node-running-2.3.0.tgz` csomagot. A lockfile-t nem töröltem és nem generáltam újra.
- Böngészős QA — **NOT RUN**: a Next.js runtime és böngésző-automatizálás nem áll rendelkezésre. A Chromium jelenléte önmagában nem igazolja az alkalmazás megjelenítését.

## D. Átadott checkpoint

- Csomag: `AIMORPG-v2.0.0-alpha.20-Navigation-and-The-Eye-Integration-Checkpoint.zip`.
- Tartalmazza a teljes alpha.19 projektforrást a ténylegesen módosított forrásfájlokkal, tesztekkel, kiadási megjegyzésekkel és diff-fel; újragenerálható `node_modules` és build cache nélkül.
- A ZIP integritását és SHA-256 értékét a csomagolás után ellenőrizni kell; az érték az `.sha256` mellékfájlban szerepel.

## E. Fennmaradó munka

- Kész: öt navigációs csoport és A Szem négy különböző adatnézete a meglévő forrásokkal.
- Részleges: látomások csak címkézett dinamikus eseményekből olvashatók; dedikált látomás-adatmodell nincs igazolva.
- Blokkolt: teljes TypeScript/lint, production build és élő böngészős QA, mert a függőségek nem telepíthetők a jelenlegi offline npm cache-ből.
- Következő egyetlen lépés: a lockfile szerinti függőségek telepítése hálózattal rendelkező fejlesztői környezetben, majd lint/build és élő böngészős QA futtatása.
