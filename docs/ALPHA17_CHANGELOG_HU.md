# AIMORPG v2.0.0-alpha.17 — változásnapló

## Tényleges módosítások

- `src/lib/visualAssets.ts`: új explicit `ITEM_ART.sealedLedger` → `/assets/items/sealedLedger.webp`; `sealedLedger` kivéve az item-family fallbackből; `heartyStew` fallbackje `sailorsStew`-re, `stormSalt` fallbackje `blackSalt`-re állítva.
- `public/assets/items/sealedLedger.webp`: Pack01 `concept01_item_11` forrásképből konvertált 512×512 WebP (49 168 bájt), forrás és kimenet hash rögzítve.
- `docs/artwork-sources/integration-sources/crop-receipts.json`: alpha17 `sealedLedger` crop/konverziós eredetnyilvántartás, alpha17 note; a korábbi receiptek megőrizve.
- `docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv`: `item:sealedLedger` unique assetként frissítve; heartyStew és stormSalt fallback útvonalának nyilvántartása frissítve.
- `docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA17.csv`: alpha16 koncepciómanifest új, verziózott másolata; csak a sealed dossier koncepció kapott bizonyított item ID-t.
- `package.json`, `package-lock.json`, `src/components/GameClient.tsx`: alpha17 verziófejléc.
- `scripts/smoke-test.cjs`, `scripts/visual-assets-smoke.cjs`, `scripts/visual-ui-smoke.cjs`: új 74/23 számlálók, sealedLedger provenance checks és alpha17 fejléc.
- Teljes 187 soros tárgygrafikai audit, prioritásos fejlesztési backlog, 13 aktív NPC-portré felülvizsgálati lista/grafikai átadási specifikáció és forrásmegőrzési jelentés készült.

## Változatlan rendszerek

A 187 katalóguselem stabil ID-jai, név/leírás/statisztika/ár/ritkaság/effektus, NPC- és quest-adatok, régióazonosítók, gazdasági szabályok, Canon/Dynamic Layer, mentés, utazás és szerveroldali szerződések nem változtak. Az alpha.13 tíz kiemelt tárgygrafikája érintetlen.

## Nyitott tételek

- 3 közeli itemkoncepció `NEEDS_REVIEW`; a runtime fallbackek megmaradnak.
- 4 tárgyhoz új, pontos grafika szükséges: `arenaWhetstone`, `merchantInk`, `memoryMoss`, `silverEyeShard`.
- 37 Pack03 item concept és 22 Pack02 item concept még nincs stabil ID-hoz rendelve; 1 Pack01 citadella-medál szintén felülvizsgálatra vár.
- Lint/build a hiányzó függőségek miatt `BLOCKED`; élő böngészős QA `NOT RUN`.
