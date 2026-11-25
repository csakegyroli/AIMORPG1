# AIMORPG v2.0.0-alpha.22 — vizuális korrekciós checkpoint

Az alpha.21 külön munkapéldányából készült. Megőrizve a négy A Szem nézetet, a fő navigációt, a térképet, a gyorselérési sávot és a játékadatok működését.

## Végrehajtott módosítások
- Verziószám frissítve alpha.22-re a package manifestekben és a látható fejlécben.
- A Szem illusztrált fejlécének arányai javítva: nagyobb minimális megjelenítési terület, `object-fit: contain`, reszponzív mobil szabály.
- Avatarok képi megjelenítésénél explicit `image-rendering:auto` marad, a nearest-neighbour/pixel-art felnagyítás elkerülésére.
- Automatizált UI smoke teszt alpha.22 verziót ellenőriz.

## Ellenőrzések
- `npm test`: PASS.
- `npm run lint`: BLOCKED/FAIL, exit 2; hiányzó Next.js/React/típuscsomagok miatt a teljes TypeScript ellenőrzés nem futtatható.
- `npm run build`: BLOCKED, exit 127 (`next: not found`).
- Alkalmazásindítás és élő böngészős QA: NOT RUN, a függőségek telepítése npm ci közben nem fejeződött be a környezet időkorlátján belül; a node_modules nem teljes.

## Fontos hiányok
Az Áttekintés fő képe, az avatarok és a Városrészek „A város nem díszlet” képe nem kaptak új, ellenőrzött nagyfelbontású assetet ebben a checkpointban. A forrásassetek némelyike alacsony felbontású (pl. avatar portrék 230×280), ezért ezek minőségi javítása továbbra is nyitott. Nem állítjuk, hogy a böngészős vizuális QA megtörtént.
