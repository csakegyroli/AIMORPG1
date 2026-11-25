# AIMORPG alpha.15 — teszt- és ellenőrzési jelentés

## Összefoglaló státuszok

| Ellenőrzés | Státusz | Bizonyíték / korlát |
|---|---|---|
| Koncepció ZIP-ek integritása | PASS | Mindkét ZIP `ZipFile.testzip()` eredménye hibamentes. |
| 66 önálló PNG forrás olvashatósága és dimenzióleltára | PASS | Mind a 66 fájl megnyitható és méretezhető volt a manifest generálásakor; forráshash mindegyikhez rögzítve. |
| 22 integrált asset source/output ellenőrzése | PASS | 10 item, 6 NPC, 6 régió: mindkét útvonal létezik, a forrás- és kimeneti hash a receipt rekorddal egyezik. |
| `npm test` munkapéldányban | PASS | Core gameplay/content smoke, security smoke, visual asset smoke és visual UI smoke mind sikeres. |
| Kész ZIP `unzip -t` | PASS | A teljes, végleges alpha.15 archívum kicsomagolási integritástesztje hibamentes. |
| Kibontott ZIP-másolat `npm test` | PASS | A létrehozott checkpoint egy külön könyvtárba kibontva, az eredeti munkapéldánytól függetlenül is teljes teszt-PASS eredményt adott. |
| TSX smoke | PASS (korlátozott) | `GameClient`, `AccountPanel`, app page/layout transpile/syntax smoke; nem teljes szemantikus TypeScript-ellenőrzés. |
| `npm run lint` | BLOCKED | `tsc --noEmit` többek között hiányzó `next`, `react`, `react/jsx-runtime`, React/Node típusok miatt áll meg. Részletes napló: `docs/QA_EVIDENCE/alpha15-lint.log`. |
| `npm run build` | BLOCKED | `sh: 1: next: not found`. Részletes napló: `docs/QA_EVIDENCE/alpha15-build.log`. |
| `npm ci` | NOT RUN | A korábbi környezetben a DNS `EAI_AGAIN` hibát adott; ezt a munkaszakaszt nem indítottam újabb install-próbával. |
| Valódi desktop böngészős QA | NOT RUN | Nincs igazolt futó alkalmazás/screenshot ebben a környezetben. |
| Valódi mobil böngészős QA | NOT RUN | Nincs igazolt futó alkalmazás/screenshot ebben a környezetben. |
| Interakciós render QA (inventory/equip/market/NPC/map) | NOT RUN | A forrás bekötését ellenőrző smoke PASS nem egyenlő futó UI renderrel. |

## npm test — lefutott komponensek
- `scripts/smoke-test.cjs`: PASS — 187 tárgy, 18 szett, 69 NPC, 60 küldetés, 28 körzet, 27 assetreferencia; TSX smoke PASS.
- `scripts/security-smoke.cjs`: PASS — jelszóhash-elési runtime teszt.
- `scripts/visual-assets-smoke.cjs`: PASS — 68 egyedi item-ID grafika, 29 item-specifikus family fallback, 12 szemantikai kategória-fallback, 64 explicit NPC mapping, 10 közvetlen `avatarSrc`-útvonal, 69 NPC, 28 district mapping.
- `scripts/visual-ui-smoke.cjs`: PASS — alpha.15 fejléc, központi HUD, modulparancs-sáv, valódi inventory/quest összegzések, képfallback, 7 régiókép-mapping a térképen, gates/travel wiring, responsive CSS és 344 manifestrekord.

## Állítások korlátja
A statikus forrás- és képfájl-ellenőrzés `SOURCE VERIFIED`, nem `VISUALLY VERIFIED`. A contact sheet csak a konvertált assetek kompozíciójának statikus szemléjét igazolja, nem a futó alkalmazásban történő megjelenést. A 6 NPC-portré role-level match; a kanonikus arcazonosság nem bizonyított.
