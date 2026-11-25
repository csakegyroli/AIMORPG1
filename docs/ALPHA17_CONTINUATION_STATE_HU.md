# AIMORPG alpha.17 — folytatási állapot

## Kiindulás és védett források

- Kiinduló verzió: alpha.16, külön munkapéldány: `aimorpg-alpha17-work`.
- Az alpha.12–alpha.16 checkpointokat és a Pack01–03 eredeti ZIP-jeit nem írtuk felül.
- Pack01–03 ZIP-integritás: PASS; az eredeti Pack01/02/03 belső másolatai változatlanul megmaradtak a `docs/artwork-sources` alatt.

## Alpha.17 eredmény

- 1 új egyedi item-art (`sealedLedger`) integrálva a Pack01 `concept01_item_11` forrásból.
- 2 meglévő családfallback szemantikailag pontosabb, de továbbra is fallback: `heartyStew` → `sailorsStew`, `stormSalt` → `blackSalt`.
- 187 soros item audit, 122 soros alpha17 concept manifest, 20 tételes backlog.
- Core/source tests PASS; lint/build BLOCKED dependency availability miatt; élő desktop/mobile QA NOT RUN.

## Következő műveletek

1. Dependency-complete Node 22+ környezetben lockfile-alapú install egyszer, utána külön lint és build.
2. Élő desktop/mobile QA: inventory, equipment, market, tooltip, NPC service panels, region map/gates/travel, Chronicle és A Szem.
3. Tartalmi döntés a `arenaProtein`, `saltFish`, `captainsLogPage` három közeli koncepcióról.
4. Grafikai brief + új artwork a `arenaWhetstone`, `merchantInk`, `memoryMoss`, `silverEyeShard` stabil item ID-khoz.
5. 37 Pack03 és 22 Pack02 item concept végigvezetése stabil ID/leírás párosítás vagy alternatíva/irreleváns státusz felé; nincs automatikus remap.
6. A 13 aktív NPC `NEEDS_REVIEW` rekord felülvizsgálata; a kérdéses karakterekhez csak bizonyított portréazonosság után integrálj.

**Invariánsok:** ne változtasd az item- vagy NPC-azonosítókat, játékmeneti értékeket, napirendeket, questeket, gazdaságot, világidőt, utazást, mentést, Canon/Dynamic Layer határokat vagy szerveroldali szerződéseket grafikai munka miatt.
