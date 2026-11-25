# AIMORPG v2.0.0-alpha.18 — Tesztjelentés

## Forrás és archívumok

- Kiinduló checkpoint: `AIMORPG-v2.0.0-alpha.17-Item-Art-Integration-Checkpoint.zip` — SHA-256 `a00d7d3cece7049f36fd0487278378c0fa06cd39f1500ff77169189f5ea27884`; méret 207 193 303 bájt. ZIP-integritás: **PASS**.
- Pack01 SHA-256 `5f33714e62095918e5aa2e872d868aea235b27ed4552c684484dadafddcf30de`; Pack02 `f6b2261e6f13d5be6336d8fff7c18ee1aaa901a10f6138daf9b2e1bb6545b390`; Pack03 `10c7229a201b022b42e45ea9b9d4c029d44ba91aead37e2f9d32266c576ce073`. Mindhárom eredeti ZIP `unzip -tq`: **PASS**. Az eredeti fájlok és az alpha.17 munkaforrásban őrzött ZIP-másolataik hash-e egyezik.
- A 125 soros Alpha.18 koncepciómanifest minden forrásútvonala létezik, és a source SHA-256 mind a 125 rekordnál egyezik.
- A 344 soros fő runtime manifest minden `/assets/...` hivatkozására létező fájlt talált.
- 187/187 item- és 69/69 NPC-útvonal fájlszinten létezik, olvasható és formátum/méret/hash adatokkal szerepel a leltárban.

## Soronkénti grafikai státuszok

- Tárgyak (187): `{'UNIQUE_ART_VERIFIED': 71, 'DUPLICATE_ART': 109, 'NEEDS_NEW_ART': 4, 'NEEDS_VISUAL_REVIEW': 3}`; összeg: 187.
- NPC-k (69): `{'NEEDS_VISUAL_REVIEW': 7, 'UNIQUE_ART_VERIFIED': 56, 'NEEDS_NEW_ART': 6}`; összeg: 69.
- Alpha.18 runtime crop-javítás: `courierRunners`, `royalRapier`, `harborAegis` — mindhárom 512×512 WebP; eredeti forrás megőrizve, pixelkoordináták és source/output SHA a crop receiptben; forráscrop szemrevételezve.
- 74 explicit itemképen 2 701 perceptual-hash párvizsgálat; három vizuálisan megerősített duplikátumpár (részletek az `ALPHA18_ITEM_VISUAL_DUPLICATE_ANALYSIS.json` fájlban).

## Teszteredmények

| Ellenőrzés | Státusz | Tény
|---|---|---|
| `npm test` (munkapéldány) | **PASS** | Exit 0. Core gameplay/content, password-hashing, asset-smoke és UI-smoke sikeres. |
| `npm run lint` | **BLOCKED** | A `tsc --noEmit` ténylegesen elindult, de a `next`, `react`, `react/jsx-runtime` és React namespace/típusok hiányoznak; az ezt követő JSX/típusüzenetek függőség-hiányból eredő kaszkádok lehetnek. Függőséget nem telepítettünk újra. |
| `npm run build` | **BLOCKED** | `sh: 1: next: not found` (exit 127). |
| Élő böngészős desktop-/mobil-QA | **NOT RUN** | A függőségek hiányában az alkalmazás nem indult. A kontaktlap és forráskép ellenőrzése nem élő UI-QA. |
| ZIP-integritás és kibonthatóság | **PASS** | `unzip -tq` hibát nem talált. A ZIP-ből friss munkakönyvtár készült, és abban az `npm test` exit 0-val futott le; a végső csomag utolsó ellenőrzése külön verifikációs JSON-ban szerepel. |

## Környezeti korlát

A korábbi npm-regiszter `EAI_AGAIN` hibája miatt az `npm ci` nem lett ismételve. Az alpha.18 tesztfutás a meglévő lockfile-t és függőségi verziókat nem módosította. A lint/build helyreállításának legkisebb következő feltétele a lockfile-kompatibilis Node.js 22+ függőségek (`next`, `react`, `react-dom`, `typescript`, `@types/react`, `@types/node`) elérhetősége hálózatról vagy előre rendelkezésre álló cache-ből.

## Élő megjelenítési státusz

Az assetek forrás- és mappingellenőrzése `SOURCE VERIFIED`; **egyetlen runtime képernyő sem kapott `VISUALLY VERIFIED` státuszt**, mert a böngészős QA `NOT RUN`.
