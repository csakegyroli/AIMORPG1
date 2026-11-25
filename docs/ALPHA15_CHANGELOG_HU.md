# AIMORPG v2.0.0-alpha.15 — változásnapló

## Cél
A két meglévő grafikai koncepciócsomag forrásalapú integrációja az alpha.14-ből külön munkapéldányban. Új grafikát nem generáltam; a koncepcióarchívumokból származó képeket vágtam/konvertáltam az alkalmazás által használt méretekre.

## Integrált koncepciók
- **10 tárgygrafika** a meglévő stabil item-ID-khez: `brokenSealRing`, `canalKnife`, `caravanCompass`, `championRibbon`, `duelistCape`, `firstWitnessLens`, `quietBell`, `sailorsKnife`, `stormKnot`, `stormglassBow`. A játéktárgyak statisztikái, ára, ritkasága, hatása és az ID-k nem változtak.
- **6 NPC-portré:** `rovan`, `garran`, `arenaSena`, `palaceOrven`, `harborKael`, `eldra`. Az új központi, stabil-ID-s mapping a `rovan`, `garran`, `eldra` portrét is kifejezetten rögzíti; az `arenaSena`, `palaceOrven`, `harborKael` meglévő mappingjének fájlja frissült. `GameClient.tsx` több, Garranhoz kötött hardcoded kép-felülírását eltávolítottam, hogy a központi mapping legyen mérvadó.
- **6 régiókép:** `outskirts`, `market`, `harbor`, `arena`, `inner`, `palace`. A meglévő `REGION_ART` feloldóban a koncepcióképekre mutatnak; a `forest` és a 28 részletes `DISTRICT_ART` mapping megmaradt. A kiválasztott régiókép a map hotspotokon, régiólistában és az adott régió hősképernyőjén használt közös feloldáson keresztül jelenik meg.

## Forrásmegőrzés és eredet
- A 2 eredeti koncepcióarchívum és a kibontott forrás PNG-k megmaradtak. Az előzőleg aktív képekről rollback-másolatok vannak a `docs/artwork-sources/alpha14-overridden-assets/` alatt.
- Frissült a `docs/artwork-sources/integration-sources/crop-receipts.json` és a 344 soros `docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv`.
- Új, 66 soros `docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA15.csv` készült: 22 integrált asset, 44 `NEEDS_REVIEW`.
- A Pack 02 kontaktlapja 24 tárgy- és 6 NPC-panelt mutat; az önálló kivágások/manifest viszont csak 22 tárgyat és 4 NPC-t tartalmaz. A két további tárgy (utazóköpeny, rubingyűrű) és két további NPC (rejtélyes tudós, másik kovács) nem létezik önálló kivágásként; nem került runtime-integrációba és nem számít a 66 önálló asset közé.

## Koncepcióleltár
- 34 tárgykoncepció: 10 integrált, 24 `NEEDS_REVIEW`.
- 20 NPC-portré: 6 integrált szerepköri egyezés alapján, 14 `NEEDS_REVIEW`. A portrék illusztratív szerepegyezést mutatnak; a karakterek kanonikus arca/identitása ettől nem tekinthető igazoltnak.
- 12 városrész-/környezetkoncepció: 6 egyértelműen címkézett főrégióhoz rendelve, 6 alternatív panoráma `NEEDS_REVIEW`, mert nincs bizonyított egy-az-egyhez részletes körzet-ID.

## Projekt- és tesztváltozások
- A verzió a `package.json`, `package-lock.json` és a látható UI-fejléc szerint `2.0.0-alpha.15`. Függőségverzió nem változott, telepítést nem indítottam.
- A smoke-tesztek elvárásai az alpha.15 verzióhoz és a központi NPC-portréfeloldóhoz igazodnak.
- Az ellenőrzött 22 integrált forrás-/kimeneti kép útvonala, fájlformátuma, mérete és SHA-256 értéke szerepel az eredetnyilvántartásban.
- **`npm test`: PASS. `npm run lint`: BLOCKED (hiányzó Next.js/React/típusfüggőségek). `npm run build`: BLOCKED (`next: not found`). Élő böngészős QA: NOT RUN. `npm ci`: NOT RUN; korábbi `EAI_AGAIN` hiba miatt nem próbáltam újra.**

## Játékmeneti érintetlenség
Nem módosultak az item- vagy NPC-stabil azonosítók, a katalógus adatai, tárgystatisztikák/árak/ritkaságok, küldetések, dialógusok, NPC-napirendek, gazdasági szabályok, világidő, utazási/kapulogika, mentési modell vagy szerveroldali szerződések.
