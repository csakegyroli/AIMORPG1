# AIMORPG alpha.17 — teljes tárgygrafikai audit

Forrás: az alpha.17 munkapéldány tényleges `src/lib/content.ts`, `src/lib/expansionItems.ts`, `src/lib/itemSystem.ts` és `src/lib/visualAssets.ts` futásra transpilált moduljai. A katalógus **187** tárgyat tartalmaz. A besorolás az alpha.17 mappinget és fájllétezést számolja újra; a fájl megléte nem jelenti az élő UI renderelés igazolását.

## Összesítés

| Státusz | Darab | Jelentés |
|---|---:|---|
| `UNIQUE_ART_AVAILABLE` | 74 | Egyedi ID-mapping és elérhető asset. |
| `FAMILY_FALLBACK_ACCEPTABLE` | 106 | A 90 felszerelésszett-slot-fallback, valamint 16 megmaradt családfallback jelenleg elfogadható. |
| `NEEDS_REVIEW` | 3 | Három, hasonló, de nem egyértelműen azonos koncepció; a meglévő fallback marad. |
| `NEEDS_NEW_ART` | 4 | Négy családfallback tartalmilag nem megfelelő; az elérhető Pack01–03-ban nem találtunk pontos képet. Új képet ebben a munkában nem generáltunk. |

## Egyedi döntést igénylő itemek

| ID | Név | Státusz | Bizonyíték / következő lépés |
|---|---|---|---|
| `arenaWhetstone` | Bajnoki fenőkő | `NEEDS_NEW_ART` | A jelenlegi vasrúd/kovácsanyag nem ábrázol fenőkövet; a három Pack01–03 csomagban nem találtunk pontos fenőkő-illusztrációt. Következő: Grafikai szál készítsen stabil item-ID-ra célzott briefet és csak jóváhagyott hiány esetén készítsen új assetet; a régi fallback maradjon használható. |
| `arenaProtein` | Harcosok meleg étele | `NEEDS_REVIEW` | Szárított hús – közel áll az étkezéshez, de nem bizonyítja a sűrű, meleg étel jellegét. Következő: Forrásképet és az itemleírást tartalmi felelős vesse össze; addig maradjon a jelenlegi fallback. |
| `merchantInk` | Kereskedői tinta | `NEEDS_NEW_ART` | A főkönyv/levéltár fallback nem mutat tintásüveget vagy tintát; a három Pack01–03 csomag ismert itemkoncepciói között nincs pontos tinta-asset. Következő: Grafikai szál készítsen stabil item-ID-ra célzott briefet és csak jóváhagyott hiány esetén készítsen új assetet; a régi fallback maradjon használható. |
| `saltFish` | Sózott tengeri hal | `NEEDS_REVIEW` | Halászszákmány – a kép friss fogást sugall, nem bizonyítja a tartósított/sózott halat. Következő: Forrásképet és az itemleírást tartalmi felelős vesse össze; addig maradjon a jelenlegi fallback. |
| `captainsLogPage` | Kapitányi naplólap | `NEEDS_REVIEW` | Bőrtekercs – dokumentum jellegű, de nem azonosítható elszakadt hajórakomány-naplólapként. Következő: Forrásképet és az itemleírást tartalmi felelős vesse össze; addig maradjon a jelenlegi fallback. |
| `memoryMoss` | Emlékmoha | `NEEDS_NEW_ART` | A moonleaf növényi illusztráció nem azonos nedves kőfalon növő ezüstös mohával; a három csomagban nincs bizonyíthatóan pontos moha-koncepció. Következő: Grafikai szál készítsen stabil item-ID-ra célzott briefet és csak jóváhagyott hiány esetén készítsen új assetet; a régi fallback maradjon használható. |
| `silverEyeShard` | Ezüst Szem-szilánk | `NEEDS_NEW_ART` | A runeInfusion főzet nem felel meg a kifejezetten nem világító, apró szilánknak; a három csomagban nincs egyértelműen megfelelő Szem-szilánk. Következő: Grafikai szál készítsen stabil item-ID-ra célzott briefet és csak jóváhagyott hiány esetén készítsen új assetet; a régi fallback maradjon használható. |

## Biztosan végrehajtott javítások

- `sealedLedger`: a Pack01 `concept01_item_11` vörös viaszpecsétes iratkötege az existing stable ID kanonikus `Lepecsételt főkönyv` leírásához illeszkedik; külön 512×512 WebP készült, az eredeti PNG változatlan maradt. Forrás SHA-256: `a8b301c1a96dcc9063277ef4fa2d792df412557cb71d77d3e482fc62e6b4ead1`; output SHA-256: `99b38bdadf76c04aaf00b121c733dd9c4c6822bd89901d3b7972826f037c5fa1`. 
- `heartyStew`: a meglévő `sailorsStew` ételkép a korábbi `gateRations` képnél egyértelműbben illeszkedik az egytálételhez; továbbra is családfallback, nem egyedi mapping.
- `stormSalt`: a meglévő `blackSalt` sókristály-kép pontosabb a korábbi `tannersWax` anyagképénél; továbbra is családfallback, nem egyedi mapping.
- Az alpha.13 tíz kiemelt tárgygrafikáját nem módosítottuk. Az itemadatok, árak, ritkaságok, hatások, stable ID-k és gazdasági szabályok változatlanok.

## Következő UI-ellenőrzés

A source mapping / asset hash audit `SOURCE VERIFIED`; az inventory, equipment, market, NPC-szolgáltatás és tooltip élő renderelése `NOT RUN`, mert a függőségek hiányoznak. A végső elfogadás előtt desktop- és mobilnézetben képernyőképes UI QA szükséges.
