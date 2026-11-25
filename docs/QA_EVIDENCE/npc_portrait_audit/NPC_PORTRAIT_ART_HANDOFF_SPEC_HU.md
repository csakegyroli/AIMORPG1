# AIMORPG alpha.14 — NPC-portré grafikai átadási specifikáció

Ez a specifikáció a tényleges alpha.13-forrásból auditált NPC-khez készült. A stable ID-k nem változhatnak. Az új grafika elkészülte nem jelenti az integráció sikerét: a végleges fájlt hash-sel, manifesttel és futó UI-QA-val külön kell ellenőrizni.

## Közös technikai követelmények

- Kimeneti asset: `public/assets/npcs/<NPC_ID>.webp`, 320 × 320 px, négyzetes, olvasható arc és jellegzetes szerepkellék.
- Kérjük a nagy felbontású eredeti forrásképet is megőrizni a grafikai források között, valamint egy **NPC ID-vel és névvel feliratozott** kontaktlapot.
- Sötét, filmszerű AIMORPG fantasy stílus, karakterközeli kompozíció, egységes fényelés; ne legyen keret, szöveg, logó vagy UI-elem a portrén belül.
- Ne használjunk más NPC-hez rendelt kész portrét, és ne írjuk felül a régi fájlt a forrás megőrzése nélkül.
- A véglegesítéskor rögzítendő: NPC ID, fájlnév, forráskép, kontaktlap cella, SHA-256, méret, képpontméret.

## A. `arenaSena` — kötelező új portré

**Kanonikus forrásadat:** `Sena Késpenge`; szerep: `Beléptető bíró`; régió: Aréna; a háttértörténet vándorküzdőként írja le, akinek egy kardja és korábban eltört csuklója volt.

**Miért szükséges:** a jelenlegi `/assets/npcs/arenaSena.webp` kép kovácsot mutat az üllőnél/forgácsok között, ez a szerepkörrel és háttértörténettel ellentétes.

**Kívánt kompozíció:** mellkép egy kőből épült arénakapu/próbakapu előtt; utazástól kopott, praktikus küzdőfelszerelés; kard hüvelyben vagy jól látható harci kellék; visszafogott csuklóbandázs az ismert sérülés emlékeként. A karakter tekintete fegyelmezett, ítélkező, a belépő harcosokat figyeli. A forrás nem ad egyértelmű, explicit nemi leírást, ezért a grafikai csapat ne a névből vezessen le önkényes identitást: a narratív tulajdonos erősítse meg a végleges megjelenést.

**Kerülendő:** kovácsüllő, kalapács, izzó fém, kovácskötény, más NPC arca.

**Célútvonal:** `public/assets/npcs/arenaSena.webp` (csere csak felülvizsgálat után).

## B. `palaceOrven` — kötelező új portré

**Kanonikus forrásadat:** `Orven Hale`; szerep: `Királyi vizsgáló`; régió: Palota; levéltáros családból származik, bizonyítékokat gyűjt, és egy hiányzó, fekete jelhez kapcsolódó lapot keres.

**Miért szükséges:** a jelenlegi `/assets/npcs/palaceOrven.webp` kép erős, kovácsműhelyi alakot mutat, ami nem támasztja alá a királyi nyomozó/iratvizsgáló szerepet.

**Kívánt kompozíció:** érett, figyelmes királyi vizsgáló deréktól vagy mellkastól felfelé, palotai levéltár vagy iratőrző szoba háttérrel. Egy lezárt bizonyítéktasak, pecsételt dosszié vagy hiányzó oldal finoman utalhat a történetre; az arc legyen intelligens, megfigyelő és visszafogott, ne harci fenyegetést sugalló.

**Kerülendő:** üllő, kalapács, kovácsfény, nagy harci páncél, generikus „barbár” póz, más NPC portréja.

**Célútvonal:** `public/assets/npcs/palaceOrven.webp` (csere csak felülvizsgálat után).

## C. `tomen` — felülvizsgálathoz kötött jelölt, nem automatikus csere

**Kanonikus forrásadat:** `Tomen`; szerep: `Tanonc`; a háttértörténet szerint több műhelyből tanult, kérdez és kísérletezik.

**Miért van jelölve:** a jelenlegi kép díszes páncélt viselő, kész harcosnak tűnő alak kültéri környezetben; a tanoncszerep és a műhelytanulás nem látszik. Ez `NEEDS_REVIEW`, nem igazolt technikai mappinghiba.

**Ha a narratív tulajdonos is új portrét kér:** fiatal vagy kezdő benyomású műhelytanonc, egyszerű munkaruha/kötény, jegyzet vagy szerszám, kíváncsi és kissé konok tekintet, zsúfolt műhelyháttér. Ne legyen díszpáncélos lovag.

**Célútvonal, csak jóváhagyás után:** `public/assets/npcs/tomen.webp`.

## D. `garran` / Borin — opcionális felbontásjavítás

A hibás, UI-képernyőképet tartalmazó `avatarSrc` már az elérhető `/assets/npc-borin-clean.webp` képre mutat. Ez egy megfelelő kovácsot mutat, de csak 170 × 135 px és nem négyzetes. Ez nem hiányzó portré, hanem minőségi fejlesztési javaslat. Ha újrarajzoljuk, készítsünk 320 × 320-as közeli kovácsportrét üllővel és műhelyfénnyel; a jelenlegi assetet és hivatkozást az új fájl jóváhagyásáig tartsuk meg.

## Integrációs átvételi kritériumok

1. A grafikai kontaktlap címkéje egyezzen az NPC stabil ID-jével.
2. Az új WebP fájl megnyitható és 320 × 320; nincs véletlenül beégetett UI.
3. A mapping és a manifest egyezzen; a stabil NPC ID, dialógus, napirend, küldetés és szerepkör nem változhat.
4. Futtassuk a meglévő `npm test`-et; ezután külön lint/build és desktop-/mobil böngészős QA szükséges.
5. A jelentés csak ténylegesen lefuttatott böngészős ellenőrzés után írhat `VISUALLY VERIFIED` státuszt.
