# AIMORPG v2.0.0-alpha.25 — Canonical Eye Entity

## Cél
A korábbi szemgrafika/animáció eltéréseinek javítása és egy közös, újrafelhasználható Szem-entitás kialakítása a Térképen, az Áttekintésben és A Szem saját nézetében; a világóra kompakt elhelyezése a felső státuszsorban.

## Változások
- Új `src/components/EyeEntity.tsx`: közös Szem-megjelenítés, változó ütemű, korlátozott tekintetmozgás, időzítők takarítása, `prefers-reduced-motion` kezelése.
- Új `src/components/EyeEntity.tsx` export: `EyeMark`, közös kék navigációs szemjel.
- Új `public/assets/world/eye-canonical.webp`: a felhasználó által biztosított `AIMORPG_UI_Arculat_01.zip` `01_AIMORPG_Master_UI_Concept_Board.png` képének kivágásából és felnagyításából készített arculati referencia-asset. Ez koncepcióból származtatott asset, nem különálló eredeti réteges grafika.
- A közös Szem beépítve a Térkép `map-eye` elemébe, az Áttekintés Szem-kártyájába, a fővárosi gyorselérési pecsétbe és A Szem fő vizualizációjába.
- A régi, csak A Szem fülhöz tartozó `EyeGazeOverlay` komponens eltávolítva; helyette közös `EyeEntity`.
- A világóra a felső státuszsor kompakt elemévé vált; a közepes és keskeny képernyőkön rendezett tördelést kap.
- Verziójelölés és az automatizált smoke tesztek frissítve alpha.25-re.
- A játékmeneti adatmodell, a világóra számítása, a mentési séma és a Szem olvasási szerepe nem változott.

## QA
- `npm test`: PASS.
- `npm ci --offline --no-audit --no-fund`: FAIL, `ENOTCACHED`; hiányzó csomag a helyi npm-cache-ből.
- Online `npm ci`: végrehajtási időkorlát miatt nem igazolt sikeres telepítés.
- `npm run lint`: FAIL, hiányzó `next`, `react`, `react/jsx-runtime` és típusdeklarációk miatt sok másodlagos TypeScript/JSX hiba.
- `npm run build`: FAIL, `next: not found` (exit 127).
- Alkalmazásindítás és böngészős QA: NOT RUN; függőségek nem települtek.
- Statikus asset-ellenőrzés: a létrehozott WEBP 570×350 képpontos, megnyitható; a forráskoncepció a csomagban dokumentálva van.

## Fontos korlát
Az animációs réteg kódja és a közös integrációs pontok elkészültek, de a futó demóban való láthatóság, a három felület közötti tényleges vizuális konzisztencia, a koordináták és a csökkentett mozgás böngészős ellenőrzése még nem igazolt. Ez nem teljes vizuális QA-lezárás.
