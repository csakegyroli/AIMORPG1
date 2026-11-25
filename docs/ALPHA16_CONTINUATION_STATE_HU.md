# AIMORPG alpha.16 — folytatási állapot

## Biztos kiinduló állapot
- Projekt: `AIMORPG v2.0.0-alpha.16`; az alpha.15 tényleges checkpointjából külön munkapéldány készült.
- `npm test` PASS: 187 item, 73 unique item art, 24 family fallback, 90 szett-slot fallback, 18 equipment set, 69 NPC, 60 quest, 28 district; core, security, asset és UI smoke futott.
- Pack03 ZIP: 64 archívumbejegyzés, ZIP-integritás PASS; 48 önálló 512×512 WebP itemkoncepció, 8 régiókép, két eredeti koncepciólap, két contact/previewsheet. Az archívum hash és minden fájl-hash a leltárban található.
- Öt item art bekötve: `streetMap`, `guildPermit`, `tradeSilk`, `guildMeal`, `sailcloth`; mindegyik unique item-ID asset, 512×512 WebP, source/output hash egyezik.
- `npm run lint` BLOCKED (`next`/`react`/típuscsomagok hiányoznak); `npm run build` BLOCKED (`next: not found`); npm telepítést ne ismételd ebben a környezetben. Élő browser QA NOT RUN.

## Következő konkrét lépések
1. Véglegesítsd és csomagold a checkpointot, ellenőrizd ZIP-et, SHA-256-ot és az exact kicsomagolt projekt npm testjét.
2. Hálózattal rendelkező Node.js 22+ környezetben egyszer telepíts a lockfile alapján; futtasd külön a lintet/buildet, és rögzítsd a teljes logokat.
3. Tényleges appból desktop/mobile QA: inventory, felszerelés, tooltip, piac, NPC szolgáltatás, NPC portré/részletező, régió hotspottérkép és travel-gate, fővárosi hero, Chronicle és A Szem. A képernyőképek valós futó alkalmazásból származzanak.
4. A 24 family fallback ID és a Pack 01/02-ből megmaradt 24 itemkoncepció felülvizsgálata; a Pack03 37 nem hozzárendelt tárgykoncepcióját stabil katalógus-ID-hez kell kötni vagy tudatosan stagingben hagyni.
5. A 13 aktív NPC `NEEDS_REVIEW` esetet külön grafikai/tartalmi munkaszálon zárd le. A 14 korábbi Pack 01/02 NPC-koncepció közül csak bizonyított szerep- és canonical mapping esetén integrálj új képet.
6. A 7 alternatív Pack03 régiópanorámát csak vizuális összehasonlítás és jóváhagyás után cseréld; a Hegyvidék képet ne kösd be stabil régió-ID nélkül.
7. A 90 equipment-slot fallback szándékos. Egyedi szett-art fejlesztést csak jóváhagyott stable ID listával, art brief alapján indíts.

## Változtatási korlátok
Nem módosult itemkatalógus, item stat/ár/ritkaság, NPC/quest content, dialógus, napirend, world time, travel rules, save schema vagy server contract. Nem történt grafika újragenerálás.
