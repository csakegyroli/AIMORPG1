# AIMORPG v2.0.0-alpha.17 — teszt- és ellenőrzési jelentés

## Végrehajtott ellenőrzések

- `npm test` — **PASS** a munkapéldányban: core gameplay/content; TypeScript/TSX transpile smoke; security/password hashing; visual asset smoke; visual UI smoke.
- A core smoke 187 katalóguselemet, 74 unique item-art mappinget, 23 explicit item-family fallbacket, 90 slot-fallbacket, 69 NPC-t, 60 questet és 28 régiókörzetet jelzett.
- `sealedLedger.webp` megnyitható, WEBP, 512×512, 49168 bájt. Source SHA-256: `a8b301c1a96dcc9063277ef4fa2d792df412557cb71d77d3e482fc62e6b4ead1`; output SHA-256: `99b38bdadf76c04aaf00b121c733dd9c4c6822bd89901d3b7972826f037c5fa1`.
- A `sealedLedger` itemrecept pontosan egy bejegyzést tartalmaz; a forrás hash, a kimeneti hash, a bájtszám, a fájlútvonal és az egyedi mapping egyezik.
- `heartyStew` → `sailorsStew`; `stormSalt` → `blackSalt` fallbackek a meglévő, már jelen lévő itemgrafikákra mutatnak.
- Fő asset manifest: 344 rekord; ugyanaz a meglévő `item:sealedLedger` rekord frissült unique assetre, nincs duplikált manifest sor.
- Alpha17 koncept manifest: 122 sor; Pack01 concept01_item_11 integrálva, a bizonytalan koncepciók felülvizsgálat alatt maradtak.

## Futtatási státusz

- `npm run lint` — **BLOCKED**: a `node_modules` hiányzik; a `tsc --noEmit` 2-es exit code-dal futott, TS2307/TS2875 modul- és JSX-típushibákat, majd ezekből következő típusszóródásokat jelzett. A korábbi npm registry `EAI_AGAIN` telepítési hiba miatt `npm ci` nem lett újraindítva. Teljes log: `docs/QA_EVIDENCE/alpha17-npm-lint.log` (3868 sor).
- `npm run build` — **BLOCKED**: `next: not found`, exit code 127. Teljes log: `docs/QA_EVIDENCE/alpha17-npm-build.log`.
- Az aktív 13 NPC `NEEDS_REVIEW` rekordot a főmanifestből karakterenkénti CSV/brief dokumentumba vezettem át; ez forrás-/portrékoncepció-audit, nem élő UI ellenőrzés.
- Az alpha.12–alpha.16 eredeti checkpointok és a Pack01–Pack03 eredeti ZIP-ek SHA-256 értéke ellenőrizve; minden érintett archívum `unzip -tq` PASS.
- Élő desktop/mobile browser QA — **NOT RUN**. A forrás mapping `SOURCE VERIFIED`; futó UI-ban `VISUALLY VERIFIED` állítás nem történt.
- A végső forrás munkapéldánybeli `npm test` futása **PASS**; napló: `docs/QA_EVIDENCE/alpha17-npm-test.log`, exit code: `docs/QA_EVIDENCE/alpha17-npm-test.exit`.
- A végleges alpha.17 ZIP-et `unzip -tq` paranccsal külön ellenőriztem (**PASS**), majd külön könyvtárba bontottam és az ottani `npm test` is **PASS**; a kicsomagolt példány külső naplója: `/mnt/data/AIMORPG_ALPHA17_EXTRACTED_CHECKPOINT_NPM_TEST.log`. A végső SHA-256 és archívum-ellenőrzés: `/mnt/data/AIMORPG_ALPHA17_CHECKPOINT_VERIFICATION.json`.
- `npm run lint` és `npm run build` nem ismétlődő környezeti próbálkozás: a függőségek hiánya miatt jelenleg blokkolt; `npm ci` újraindítása nem történt.
- Valódi futó alkalmazáson végzett desktop-/mobilböngészős QA **NOT RUN**; minden képi megfelelés forrásellenőrzés, nem élő UI-vizuális igazolás.
