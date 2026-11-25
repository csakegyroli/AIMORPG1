# AIMORPG v2.0.0-alpha.14 — NPC Portrait Audit Checkpoint

## Kiadási fókusz

A kiadás az alpha.13 valós forrásából induló, külön munkapéldányban végzett teljes, 69 NPC-re kiterjedő portré-auditot és egy bizonyított, minimális avatar-útvonaljavítást tartalmaz. Az alpha.12 és alpha.13 eredeti archívumok változatlanul megmaradtak.

## Megvalósítva

- A 69 NPC rekord, a 61 explicit `NPC_PORTRAIT_ART` mapping, a 8 explicit map nélküli közvetlen `avatarSrc`, és a 10 különböző közvetlen útvonal ellenőrizve.
- Mind a 69 aktuális képútvonal létezik és a fájl megnyitható; 61/61 mapping asset SHA-256 összege egyezik a portré-crop receipt bejegyzéssel.
- Szemantikai vizuális felülvizsgálat: 52 szerephez illőnek tűnő kép, 15 `NEEDS_REVIEW`, 2 bizonyított szerepkör-eltérés, amely új portrét igényel (`arenaSena`, `palaceOrven`).
- A `garran`/Borin közvetlen `avatarSrc` útvonalát a hibás UI-képernyőképről a meglévő kovácsportréra javítottuk (`/assets/npc-borin-clean.webp`). A forrásképernyőképet megőriztük, nem töröltük.
- A vizuális asset manifest 344 rekordra bővült; tartalmazza mind a 69 NPC forrás-/mappingstátuszát, szemantikai auditját és blokkolóját.
- Magyar részletes jelentés, 69 soros CSV, strukturált JSON, manifestfrissítési javaslat, négy címkézett kontaktlap és grafikai átadási specifikáció elkészült.
- Verziójelölés és regresszióteszt-frissítés alpha.14-re.

## Változásmegőrzés

Nem változott NPC stabil azonosító, dialógus, napirend, régió, küldetés, gazdasági szabály vagy szerveroldali logika. A meglévő portrékat nem osztottuk át találomra más karakterek között.

## Tesztek

- `npm test`: **PASS** (core/content smoke, TSX transpile smoke, security smoke, visual asset smoke, visual UI smoke). A végső futás 69 NPC-t, 61 explicit NPC mappinget, 10 közvetlen `avatarSrc` értéket és 344 manifest rekordot jelzett.
- `npm run lint`: **BLOCKED**; tényleges futás exit 2. Hiányzik a `next`, `react`, `react/jsx-runtime` és kapcsolódó típusdefiníciók. Napló: `docs/QA_EVIDENCE/npc_portrait_audit/npm-lint-after-audit.log`.
- `npm run build`: **BLOCKED**; tényleges futás exit 127, `sh: 1: next: not found`. Napló: `docs/QA_EVIDENCE/npc_portrait_audit/npm-build-after-audit.log`.
- Élő böngészős desktop/mobil QA: **NOT RUN**. A portré-kontaktlapok a fájlok tartalmának statikus ellenőrzésére szolgálnak, nem helyettesítik az élő UI-tesztet.
- `npm ci`: nem futott újra.

## Következő lépés

Készüljenek el az `arenaSena` és `palaceOrven` új portréi az átadási specifikáció szerint; a 15 `NEEDS_REVIEW` esetet a narratív/grafikai tulajdonos hagyja jóvá vagy utasítsa új grafika igényére. Az új asset integrációja után frissítendő a mapping/manifest/receipt, majd ismételt `npm test`, lint/build és élő desktop-/mobil-QA szükséges.
