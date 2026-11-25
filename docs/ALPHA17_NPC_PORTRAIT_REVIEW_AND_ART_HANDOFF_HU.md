# AIMORPG alpha.17 — aktív NPC-portré felülvizsgálat és grafikai átadás

Az alpha.16 folytatási/backlog listáját a fő assetmanifest aktuális soraival összevetve **13 aktív NEEDS_REVIEW** NPC-t találtam. Ez nem fájlhiány: minden sorban feloldott képútvonal van, de a portré szerepmegfelelése nem bizonyított. Élő UI QA `NOT RUN`. A Pack01/02 jelöltek alább csak ellenőrizendő lehetőségek, NEM mappingek.

| Stable ID | Név / szerep | Jelenlegi konkrét probléma | Potenciális meglévő koncepció – nem integrálva |
|---|---|---|---|
| `nara` | Nara Bőrös — Bőrműves | A bőrműves portréja műhelyi páncél-/kovács kontextusba csúszik; bőrművesség (bőr, csizma, kesztyű) nem olvasható egyértelműen. | Pack01 npc_concept_10_rugged_workshop_smith – műhelyi, de a leírt portré férfias kovács-olvasatú, nem bőrműves; nem integrálva. |
| `tomen` | Tomen — Tanonc | A kép felnőtt, díszes páncélú harcost mutat; tanonci életkor/szerep és műhelyi kontextus nem látható. | Pack01 npc_concept_13_young_healer_white_hood – fiatal koncepció, de gyógyító szerepet jelez, nem tanoncot; nem integrálva. |
| `sera` | Sera Dovin — Céhes megbízott | A köpenyes lámpástartó vándor nem utal céhes ügyintézésre, engedélyekre vagy hivatalos megbízotti szerepre. | Pack01 npc_concept_16_mustached_courtier – udvari tisztviselőhöz hasonló, de nem bizonyít céhes megbízotti azonosságot; nem integrálva. |
| `taris` | Taris — Alkudozó közvetítő | A kereskedő jellegű alak közel állhat a közvetítői szerephez, de alkudozás/közvetítés nincs vizuálisan jelölve; felülvizsgálat, nem automatikus újrakötés. | Pack01 npc_concept_14_desert_caravan_guide – kereskedelmi útvonalhoz kapcsolódhat, de sivatagi vezető nem azonos városi alkudozóval; nem integrálva. |
| `marwen` | Marwen Holt — Raktári felügyelő | A korsót tartó fogadói alak nem egyezik a raktári felügyelő/pecsétvizsgáló szereppel. | Pack01 npc_concept_01_greybearded_veteran – idős/veterán olvasat, de raktárfelügyeletet nem bizonyít; nem integrálva. |
| `arenaRusk` | Rusk — Fogadóház-kezelő | A prémes, korsót tartó alak fogadói környezetben elfogadható jelölt lehet, de az odds-/eredménykönyv szerep nem olvasható ki; szerepkör-jóváhagyás szükséges. | Pack01 npc_concept_16_mustached_courtier – nem mutat fogadási könyvet/arena-bookmaker szerepet; nem integrálva. |
| `harborTessa` | Tessa Vane — Tengerész toborzó | A csuklyás, erdei/utazó megjelenés nem támasztja alá a tengerész-toborzó/hajós szerződések funkciót. | Pack01 npc_concept_03_weathered_harbor_captain – kikötői helyszín, de más karakter szerepe/neme; nem integrálva. |
| `harborSable` | Sable Renn — Szabad hajós | A vörös ruhás arénaszerű harcos nem illeszkedik egyértelműen a szabad hajós/tengeri megbízások karakteréhez. | Pack01 npc_concept_12_hooded_traveler – általános vándor, nem bizonyított hajós; nem integrálva. |
| `miri` | Miri — Sikátorok hírvivője | A keretezett közeli portré nem hordoz sikátor/hírvivő/utcai információ-közvetítő kontextust. | Pack01 npc_concept_08_hooded_masked_informant – információs szerephez közeli lehet, de nem bizonyítja Miri portréját; nem integrálva. |
| `damar` | Damar — Raktárőr | A keretezett férfiportré nem ad raktárőri, rakparti mérlegházi vagy árumozgási jelzést. | Pack01 npc_concept_01_greybearded_veteran – őr/katona lehet, de raktárőri/mérlegházi szerepet nem igazol; nem integrálva. |
| `ilren` | Ilren — Főkufár | A keretezett közeli portré nem támasztja alá a főkufár/kereskedelmi értékbecslő szerepet. | Pack01 npc_concept_16_mustached_courtier – kereskedői szerephez közeli, de főkufár és konkrét karakterazonosság nem bizonyított; nem integrálva. |
| `serin` | Serin — Arénamester | A keretezett közeli portrén nincs arénamesteri, rang- vagy kihíváskezelő kontextus. | Pack01 npc_concept_07_scarred_redcloak_champion – arénai téma, de bajnok ≠ arénamester; nem integrálva. |
| `velka` | Velka — Páncélkovács | A keretezett vörös hajú portrén nem látszik páncélkovács-műhely vagy védelmi felszerelés; a szakma nem igazolható. | Pack01 npc_concept_10_rugged_workshop_smith – műhelyi rokon szerep, de páncélkovács mesternő konkrét azonosságát nem igazolja; nem integrálva. |

## Grafikai briefek – csak tartalmi jóváhagyás után

A következő rövid briefek az új képet igénylő irányokat rögzítik, de nem rendelnek önállóan portrét a karakterhez. A grafikai szál először mutassa meg a javaslatot a karakter-/világtulajdonosnak; ha egy meglévő koncepciót jóváhagynak, azt kell előnyben részesíteni.

### `nara` — Nara Bőrös: Bőrműves

- **Jelenlegi asset:** `/assets/npcs/nara.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[nara])
- **Funkció / hely:** Bőrös udvar · workshops · Bőr, kesztyű, javítás
- **Miért felülvizsgálandó:** A bőrműves portréja műhelyi páncél-/kovács kontextusba csúszik; bőrművesség (bőr, csizma, kesztyű) nem olvasható egyértelműen.
- **Kompozíciós irány új kép esetén:** Bőrmegmunkáló nő a Bőrös udvarban; kötény, bőrszíjak/csizma- vagy kesztyűdarab, varró-/vágóeszköz; ne páncélkovács-asztal.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_10_rugged_workshop_smith – műhelyi, de a leírt portré férfias kovács-olvasatú, nem bőrműves; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `tomen` — Tomen: Tanonc

- **Jelenlegi asset:** `/assets/npcs/tomen.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[tomen])
- **Funkció / hely:** Rézkopács műhely · workshops · Apró javítás, anyagismeret
- **Miért felülvizsgálandó:** A kép felnőtt, díszes páncélú harcost mutat; tanonci életkor/szerep és műhelyi kontextus nem látható.
- **Kompozíciós irány új kép esetén:** Fiatal tanonc a Rézkopács műhelyben; kezdő szerszámok, apró javítandó alkatrész, kíváncsi/figyelő testtartás; ne kész páncélos harcos.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_13_young_healer_white_hood – fiatal koncepció, de gyógyító szerepet jelez, nem tanoncot; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `sera` — Sera Dovin: Céhes megbízott

- **Jelenlegi asset:** `/assets/npcs/sera.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[sera])
- **Funkció / hely:** Céhesor · guildRow · Céhes ügyek, engedélyek
- **Miért felülvizsgálandó:** A köpenyes lámpástartó vándor nem utal céhes ügyintézésre, engedélyekre vagy hivatalos megbízotti szerepre.
- **Kompozíciós irány új kép esetén:** Céhes megbízott a Céhesoron; engedélytekercs, pecsét, nyilvántartó asztal vagy jelvény; hivatalos, tárgyalóképes megjelenés.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_16_mustached_courtier – udvari tisztviselőhöz hasonló, de nem bizonyít céhes megbízotti azonosságot; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `taris` — Taris: Alkudozó közvetítő

- **Jelenlegi asset:** `/assets/npcs/taris.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[taris])
- **Funkció / hely:** Mérleg tér · exchangeSquare · Alku, közvetítés, vevők keresése
- **Miért felülvizsgálandó:** A kereskedő jellegű alak közel állhat a közvetítői szerephez, de alkudozás/közvetítés nincs vizuálisan jelölve; felülvizsgálat, nem automatikus újrakötés.
- **Kompozíciós irány új kép esetén:** Alkudozó közvetítő a Mérleg téren; kereskedelmi jegyzet/árujegyzék, két fél közötti tárgyalási testtartás, visszafogott, kiismerhetetlen arckifejezés.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_14_desert_caravan_guide – kereskedelmi útvonalhoz kapcsolódhat, de sivatagi vezető nem azonos városi alkudozóval; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `marwen` — Marwen Holt: Raktári felügyelő

- **Jelenlegi asset:** `/assets/npcs/marwen.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[marwen])
- **Funkció / hely:** Hetedik kapu · warehouseRing · Pecsétvizsgálat, készletellenőrzés, zárolás
- **Miért felülvizsgálandó:** A korsót tartó fogadói alak nem egyezik a raktári felügyelő/pecsétvizsgáló szereppel.
- **Kompozíciós irány új kép esetén:** Raktári felügyelő a Hetedik kapunál; raktárpecsétek, leltárlap, kulcs vagy szállítmányjel, ellenőrző tekintet; ne fogadós/korsó.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_01_greybearded_veteran – idős/veterán olvasat, de raktárfelügyeletet nem bizonyít; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `arenaRusk` — Rusk: Fogadóház-kezelő

- **Jelenlegi asset:** `/assets/npcs/arenaRusk.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[arenaRusk])
- **Funkció / hely:** Fogadóház · crowdQuarter · Fogadások, oddsok, eredmények
- **Miért felülvizsgálandó:** A prémes, korsót tartó alak fogadói környezetben elfogadható jelölt lehet, de az odds-/eredménykönyv szerep nem olvasható ki; szerepkör-jóváhagyás szükséges.
- **Kompozíciós irány új kép esetén:** Fogadóház-kezelő az arénában; fogadási könyv/oddsjelzőtábla, fogadóablak vagy arénapadló kontextusa; ne egyszerű vendégként jelenjen meg.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_16_mustached_courtier – nem mutat fogadási könyvet/arena-bookmaker szerepet; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `harborTessa` — Tessa Vane: Tengerész toborzó

- **Jelenlegi asset:** `/assets/npcs/harborTessa.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[harborTessa])
- **Funkció / hely:** Fekete Vitorla Fogadó · sailorsRow · Hajómunka, legénység, tengeri szerződések
- **Miért felülvizsgálandó:** A csuklyás, erdei/utazó megjelenés nem támasztja alá a tengerész-toborzó/hajós szerződések funkciót.
- **Kompozíciós irány új kép esetén:** Tengerész-toborzó a Fekete Vitorla Fogadóban; hajózási szerződés, kikötői kötél/árbóc vagy legénységi lista; női tengerészeti szakember, nem erdei vándor.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_03_weathered_harbor_captain – kikötői helyszín, de más karakter szerepe/neme; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `harborSable` — Sable Renn: Szabad hajós

- **Jelenlegi asset:** `/assets/npcs/harborSable.webp` (docs/artwork-sources/integration-sources/crop-receipts.json#portraits[harborSable])
- **Funkció / hely:** Szabad Kikötő · freeDocks · Távoli utak, független fuvarok, veszélyes megbízások
- **Miért felülvizsgálandó:** A vörös ruhás arénaszerű harcos nem illeszkedik egyértelműen a szabad hajós/tengeri megbízások karakteréhez.
- **Kompozíciós irány új kép esetén:** Szabad hajós a Szabad Kikötőben; tengeri kabát, kötélszál/kompasz vagy fedélzeti háttér, független és veszélyes fuvaros hangulat; ne arénaharcos.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_12_hooded_traveler – általános vándor, nem bizonyított hajós; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `miri` — Miri: Sikátorok hírvivője

- **Jelenlegi asset:** `/assets/npc-miri.webp` (src/lib/content.ts#NPCS[miri].avatarSrc)
- **Funkció / hely:** Keskeny Udvar · redStreets · Információ, utcai közvetítés
- **Miért felülvizsgálandó:** A keretezett közeli portré nem hordoz sikátor/hírvivő/utcai információ-közvetítő kontextust.
- **Kompozíciós irány új kép esetén:** Sikátorok hírvivője a Keskeny Udvarban; diszkrét üzenet, futártáska vagy városi kapualj, fürge/éber benyomás; ne általános keretezett fejportré.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_08_hooded_masked_informant – információs szerephez közeli lehet, de nem bizonyítja Miri portréját; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `damar` — Damar: Raktárőr

- **Jelenlegi asset:** `/assets/npc-damar.webp` (src/lib/content.ts#NPCS[damar].avatarSrc)
- **Funkció / hely:** Rakparti mérlegház · gate · Raktári hozzáférés, árumozgás
- **Miért felülvizsgálandó:** A keretezett férfiportré nem ad raktárőri, rakparti mérlegházi vagy árumozgási jelzést.
- **Kompozíciós irány új kép esetén:** Raktárőr a Rakparti mérlegházban; kulcscsomó, rakományjegyzék vagy mérlegházi láda, őrző testtartás; ne dekoratív arckép.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_01_greybearded_veteran – őr/katona lehet, de raktárőri/mérlegházi szerepet nem igazol; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `ilren` — Ilren: Főkufár

- **Jelenlegi asset:** `/assets/npc-ilren.webp` (src/lib/content.ts#NPCS[ilren].avatarSrc)
- **Funkció / hely:** Mérleg tér · exchangeSquare · Kereskedelem, értékbecslés
- **Miért felülvizsgálandó:** A keretezett közeli portré nem támasztja alá a főkufár/kereskedelmi értékbecslő szerepet.
- **Kompozíciós irány új kép esetén:** Főkufár a Mérleg téren; főkönyv, mérleg, árujegyzék vagy minőségi áru, magabiztos árbecslő; ne általános fejportré.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_16_mustached_courtier – kereskedői szerephez közeli, de főkufár és konkrét karakterazonosság nem bizonyított; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `serin` — Serin: Arénamester

- **Jelenlegi asset:** `/assets/npc-serin.webp` (src/lib/content.ts#NPCS[serin].avatarSrc)
- **Funkció / hely:** Bajnoki fal · championsHall · Arénai kihívások, rangok
- **Miért felülvizsgálandó:** A keretezett közeli portrén nincs arénamesteri, rang- vagy kihíváskezelő kontextus.
- **Kompozíciós irány új kép esetén:** Arénamester a Bajnoki falnál; kihívás-/rangjegyzék, bajnoki címer vagy küzdőtér-háttér; tekintélyes vezető, ne aktív bajnoknak tűnjön.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_07_scarred_redcloak_champion – arénai téma, de bajnok ≠ arénamester; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

### `velka` — Velka: Páncélkovács

- **Jelenlegi asset:** `/assets/npc-velka.webp` (src/lib/content.ts#NPCS[velka].avatarSrc)
- **Funkció / hely:** Velka Páncélműhelye · workshops · Páncéljavítás, védelmi felszerelés
- **Miért felülvizsgálandó:** A keretezett vörös hajú portrén nem látszik páncélkovács-műhely vagy védelmi felszerelés; a szakma nem igazolható.
- **Kompozíciós irány új kép esetén:** Páncélkovács a saját műhelyében; vért-/vértlemez, üllő vagy javítóeszköz, tapasztalt mesternő; a fókusz páncéljavításon legyen, ne általános kovácson.
- **Meglévő forrás ellenőrzése:** Pack01 npc_concept_10_rugged_workshop_smith – műhelyi rokon szerep, de páncélkovács mesternő konkrét azonosságát nem igazolja; nem integrálva.
- **Technikai követelmény:** portré jellegű 1:1, 512×512 WebP, semleges/konzisztens sötét fantasy színkezelés, jól olvasható arc kis UI méreten, nincs ráégetett felirat vagy UI-keret; eredeti forrás megőrzése, source/output SHA-256 és manifest/receipt rögzítése.
- **Integrációs feltétel:** stabil NPC-ID változatlan; először forrás mapping, utána futó desktop/mobil UI QA. Jelen státusz `NEEDS_REVIEW`, render `NOT RUN`.

## Megőrzött invariánsok

- A Pack01/02 portréjelöltek közül egyiket sem kötöttem be találomra, mert a koncepcióleírások és a karakterleírások nem bizonyítanak konkrét karakterazonosságot.
- `arenaSena` és `palaceOrven` a főmanifestben `INTEGRATED_SOURCE_ROLE_MATCH` szerepel: ez korábbi, statikus szerephez illesztett forrásdöntés, nem élő böngészős vizuális igazolás; ezen munkában változatlan maradt.
- Minden kép betöltése a futó alkalmazásban továbbra is `NOT RUN` státuszú.
