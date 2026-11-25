# AIMORPG — helyi Windows futtatás és QA

Ez az útmutató az AIMORPG Next.js frontend ellenőrzésére szolgál. A script nem töröl fájlokat, nem írja felül a checkpointot, nem frissíti önkényesen a függőségi verziókat, és nem jelenít meg környezeti titkokat.

## Követelmények

- Windows 10/11 és PowerShell 5.1 vagy PowerShell 7.
- Node.js 22 vagy újabb, valamint az ahhoz tartozó npm.
- A projekt kibontott könyvtára, benne a `package.json`, `package-lock.json`, `src/app/page.tsx` és `scripts/windows-local-qa.ps1` fájlokkal.
- A frontend npm-csomagjai az ellenőrzés/build futtatásához. Az adatbázis- vagy backend-szolgáltatást igénylő funkciók ettől külön követelményeket is igényelhetnek.

## 1. Nyisd meg a PowerShellt a projekt gyökerében

A projektgyökér az a mappa, amelynek közvetlenül benne van a `package.json` és a `package-lock.json` fájlja. A script általában ezt a mappát automatikusan megtalálja a saját helyéből; más könyvtár esetén add meg a `-ProjectRoot` paramétert.

Ellenőrizd az eszközverziókat:

```powershell
node --version
npm --version
```

Az aktuális frontend `package.json` fájlja Node.js `>=22.0.0` követelményt deklarál.

## 2. Diagnosztika telepítés és futtatás nélkül

A projekt gyökeréből:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\windows-local-qa.ps1 -DiagnosticsOnly
```

A végrehajtási szabály csak az aktuális PowerShell-folyamatra érvényes; nem állítja át a gép tartós szabályzatát. A diagnosztika ellenőrzi a frontend gyökerét, a package- és lockfile-t, a Node.js/npm-verziókat, a Next.js/React/TypeScript jelenlétét és egyszer megpróbálja elérni az npm-regisztert. Nem telepít függőségeket.

Ha más mappából futtatod:

```powershell
.\scripts\windows-local-qa.ps1 -ProjectRoot "D:\AIMORPG\AIMORPG-v2.0.0-alpha.8" -DiagnosticsOnly
```

A paraméterhez a ténylegesen kibontott projektgyökeret add meg; ne a ZIP-fájl útvonalát.

## 3. Függőségek telepítése és automatikus ellenőrzések

Csak akkor kérj telepítést, ha engedélyezed az npm-regiszter elérését, és készen állsz arra, hogy az npm a lockfile alapján a `node_modules` könyvtárat helyreállítsa:

```powershell
.\scripts\windows-local-qa.ps1 -InstallDependencies
```

A script először egyszer megvizsgálja az npm-regiszter elérhetőségét. Ha a próba DNS- vagy hálózati hibával sikertelen (`EAI_AGAIN` vagy hasonló), nem indít ugyanazon feltételek mellett újabb telepítési próbát. A telepítés a projekt meglévő lockfile-jával, `npm ci --no-audit --no-fund` paranccsal történik; a script nem módosítja a függőségi verziókat.

Az ellenőrzések telepítés nélkül is lefuttathatók:

```powershell
.\scripts\windows-local-qa.ps1
```

Ez futtatja a ténylegesen deklarált `npm test`, `npm run lint` és `npm run build` scripteket. A `npm test` futtatása önmagában nem igazolja, hogy a Next.js alkalmazás buildelhető vagy böngészőben működik.

## 4. A fejlesztői szerver elindítása

Ha a függőségek már sikeresen települtek:

```powershell
.\scripts\windows-local-qa.ps1 -StartDevServer
```

A script a csomag `dev` scriptjét indítja el külön folyamatban, majd az aktuális `PORT` vagy a `dev` scriptben szereplő port alapján ellenőrzi a helyi TCP-portot. Ha nincs projektbeállítás, a Next.js alapértelmezett 3000-es portját ellenőrzi. A napló megadja a ténylegesen vizsgált URL-t, a folyamatazonosítót és a szerver kimenetének elérési útját.

A port elérhetősége még nem teljes vizuális QA: nyisd meg a jelentett URL-t böngészőben, lépj végig a releváns képernyőkön, és ellenőrizd a konzolt, a képek betöltését és az interakciókat. A tényleges böngészős képernyőképekhez Playwright vagy más böngészőeszköz külön szükséges lehet.

A háttérben maradó fejlesztői folyamat leállítható a naplóban szereplő PID-del:

```powershell
taskkill /PID <PID> /T /F
```

A `<PID>` helyére a script által ténylegesen kiírt számot írd.

## 5. Hol vannak a naplók?

Alapértelmezésben a naplók a Windows ideiglenes könyvtárán belül jönnek létre:

`%TEMP%\AIMORPG-local-qa\ÉÉÉÉHHNN-ÓÓPPMM\`

A futás fő állományai:

- `qa-run.log` — parancsok és eredmények;
- `qa-summary.json` — géppel is olvasható, státuszonkénti összefoglaló;
- `dev-server.stdout.log` és `dev-server.stderr.log` — a fejlesztői szerver kimenete, ha azt elindítottad.

A futási naplóban parancsok és konzolkimenetek szerepelnek, de a script nem listázza a környezeti változók teljes értékeit, és nem kér API-kulcsot vagy jelszót. Napló megosztása előtt ennek ellenére ellenőrizd, hogy nem került-e bele érzékeny adat.

## alpha.10 megjegyzés

A panorámás fővárosi felület karaktergyorsállapota az aktuális játékosnevet, szintet, életerőt, aranyat, gyémántot és követett küldetést a meglévő játékállapotból jeleníti meg. Ez a kódoldali integráció önmagában nem bizonyít böngészős megjelenítést; azt az alkalmazás tényleges indítása után kell ellenőrizni.

## 6. A státuszok értelmezése

- `PASS`: a parancs ténylegesen lefutott és nulla kilépési kóddal zárult.
- `FAIL`: a parancs vagy ellenőrzés hibát talált.
- `BLOCKED`: külső vagy környezeti akadály miatt nem hajtható végre, például nincs npm-regiszter-hozzáférés vagy hiányzik a Next.js.
- `NOT RUN`: az adott lépés szándékosan nem futott le, például mert a `-DiagnosticsOnly` módot választottad.

A BLOCKED és a NOT RUN nem sikeres teszteredmény. A script végső kilépési kódja `0`, ha nincs FAIL/BLOCKED, `1`, ha FAIL van, és `2`, ha nincs FAIL, de legalább egy lépés BLOCKED.

## 7. DNS-hiba vagy sikertelen telepítés esetén

Ha az npm-regiszter próba `EAI_AGAIN` hibát ad:

1. Ne ismételgesd rövid időn belül korlátlanul a telepítést.
2. Ellenőrizd a hálózatot, VPN/proxy/DNS beállításokat és az npm-regiszter hozzáférését a helyi gépen.
3. Ha a szervezet proxyval működik, az érvényes proxybeállítást a saját környezetedben állítsd be; ne írj hitelesítő adatot a projektfájlokba.
4. Futtasd újra a diagnosztikát, majd a telepítést, ha a regiszter már elérhető.
5. Ne töröld a lockfile-t, és ne válts találomra más függőségverziókra.

A projekt frontendje és a `server/` backend külön csomagok lehetnek. Ez a script a gyökér Next.js frontend `package.json` fájlján dolgozik. A backendhez csak akkor futtass telepítést vagy szerverindítást, ha annak saját konfigurációja és lockfile-ja a projektben ténylegesen rendelkezésre áll; ezeket a parancsokat ne következtesd ki találomra.


## Alpha.12 — aktualizált szerverindítási viselkedés

A `scripts/windows-local-qa.ps1 -StartDevServer` indítás előtt ellenőrzi a projektben beállított portot. Ha a port már foglalt, a következő szabad portot keresi egy korlátozott tartományban; a már futó folyamatot nem állítja le. Az indítás a kiválasztott portot a meglévő `npm run dev` scriptnek `-- --port <port>` argumentummal adja át, a `package.json` átírása nélkül. A PASS státusz csak akkor adható, ha a HTTP-válaszban Next.js-re utaló jelek is megjelennek.

A diagnosztika és a telepítés továbbra is külön futtatható:

```powershell
.\scripts\windows-local-qa.ps1 -DiagnosticsOnly
.\scripts\windows-local-qa.ps1 -InstallDependencies
.\scripts\windows-local-qa.ps1 -StartDevServer
```

A script tényleges Windows/PowerShell-futtatása ebben a fejlesztési környezetben nem volt lehetséges; a fenti működés a forrásban ellenőrzött, de Windows runtime státusza továbbra is `NOT RUN`.


## Alpha.12 aktualis kiindulási állapot

Az alpha.12 checkpoint a frontend gyökerében `package.json` és `package-lock.json` fájlt tartalmaz, Node.js `>=22.0.0` követelménnyel. A `server/` alatt külön NestJS `package.json` található, de ebben a checkpointban a `server/` könyvtárhoz nem található önálló lockfile; a jelen QA-script csak a gyökér Next.js frontendet kezeli. A backend telepítését ne következtesd ki automatikusan; azt külön, a projekt backend-folyamatai szerint kell vizsgálni.

Az alpha.12 fejlesztési környezetben a regiszterpróba `EAI_AGAIN` hibát adott, `next` nem volt telepítve, ezért a valódi alkalmazásindítás és az élő böngészős QA `NOT RUN`. A fájl-/forrásalapú smoke tesztek PASS eredménye nem helyettesíti a futó alkalmazás QA-ját.

A helyi gépen, a kibontott projekt gyökeréből, a hálózati kapcsolat helyreállása után futtasd:

```powershell
npm ci --no-audit --no-fund
npm test
npm run lint
npm run build
```

Ezután a scriptben ellenőrzött portot és tényleges indulást a következővel kérheted:

```powershell
.\scripts\windows-local-qa.ps1 -StartDevServer
```

A script által naplózott pontos `http://localhost:<port>/` címet nyisd meg. A böngészős QA-t csak azután jelöld sikeresnek, hogy a futó alkalmazás képernyőit és interakcióit ténylegesen ellenőrizted, valamint a valódi képernyőképeket elmentetted.
