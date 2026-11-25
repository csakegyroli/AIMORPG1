# AIMORPG v2.0.0-alpha.18 — Prioritásos fejlesztési backlog

**Tételek:** 24. Minden feladat tényleges forrásból vagy a soronkénti auditból származó bizonyítékhoz kötött.

| ID | Prioritás | Terület | Feladat | Státusz |
|---|---|---|---|---|
| A18-001 | P0 | QA/build | Next.js/React függőségi környezet helyreállítása | `BLOCKED` |
| A18-002 | P0 | QA/browser | Valódi desktop és mobil art-render QA | `NOT RUN` |
| A18-003 | P1 | Item art | Az elsődleges runtime grid három hibás kivágásának ellenőrzése | `SOURCE VERIFIED` |
| A18-004 | P1 | Item art | Négy tartalmilag hiányzó tárgygrafika brief jóváhagyása | `NEEDS_NEW_ART` |
| A18-005 | P1 | Item art | Három vizuálisan ismétlődő item illusztrációjának szétválasztása | `NEEDS_NEW_ART` |
| A18-006 | P1 | NPC art | Hat szerepköridegen NPC-portré cseréjének előkészítése | `NEEDS_NEW_ART` |
| A18-007 | P1 | Item art | 90 equipment-set item art lefedettségének specifikálása | `DUPLICATE_ART` |
| A18-008 | P1 | Data/manifest | Master-manifest és item audit regressziós tesztje | `SOURCE VERIFIED` |
| A18-009 | P1 | NPC data | Hét bizonytalan NPC-portré jóváhagyása | `NEEDS_VISUAL_REVIEW` |
| A18-010 | P1 | Item semantics | Három fogyóeszköz pontos képi referenciájának eldöntése | `NEEDS_VISUAL_REVIEW` |
| A18-011 | P2 | Item art | 16 szemantikailag elfogadható family fallback egyedivé tétele | `DUPLICATE_ART` |
| A18-012 | P2 | Item art | Kategória-, család- és felszerelésihely-fallback UI-jelölésének ellenőrzése | `NOT RUN` |
| A18-013 | P2 | Visual QA | Item art legibility at 64/96/128 px | `NOT RUN` |
| A18-014 | P2 | NPC art | NPC portrait crop and fallback accessibility audit | `NOT RUN` |
| A18-015 | P2 | Manifest/provenance | Pack01–03 koncepciók állapotának karbantartása | `SOURCE VERIFIED` |
| A18-016 | P2 | Region art | Régió- és városnegyedképek összehangolása | `NOT RUN` |
| A18-017 | P2 | NPC/gamelogic integration | NPC jelenlét és portré adatfolyam regresszió | `NOT RUN` |
| A18-018 | P2 | Gameplay integration | Inventory/equipment/market art views share a single stable resolver | `NOT RUN` |
| A18-019 | P3 | Art direction | Fotórealisztikus és stilizált ikonok stílusáttekintése | `NOT RUN` |
| A18-020 | P3 | Set art strategy | Equipment set image pipeline and reuse policy | `DUPLICATE_ART` |
| A18-021 | P0 | Release engineering | Végleges checkpoint független kivonat-tesztje | `PASS` |
| A18-022 | P2 | NPC art | Legacy direct avatarSrc útvonalak fenntartása vagy explicit mappingre váltása | `NEEDS_VISUAL_REVIEW` |
| A18-023 | P1 | Item art | Kiemelt item image twins — unique coverage artwork | `NEEDS_NEW_ART` |
| A18-024 | P1 | Archive maintenance | Original archive preservation checksums on every release | `PASS` |

## A18-001 — Next.js/React függőségi környezet helyreállítása
**Prioritás:** P0 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `BLOCKED`

**Bizonyíték:** package.json függőségeket deklarál; jelenleg nincs elérhető next/React/TypeScript telepített csomag; korábbi npm ci EAI_AGAIN.
**Feladat:** Megbízható hálózattal vagy előre cache-elt lockfile-kompatibilis függőségekkel futtatni a npm ci-t egyszer, majd npm run lint és npm run build.
**Függőségek:** Node >=22, npm-regiszter vagy komplett cache, package-lock.json (verzió nem módosítható szükségtelenül).
**Elfogadási feltétel:** Lint és build külön-külön valódi PASS; telepítési verziók a lockfile-ból; logok megőrizve.

## A18-002 — Valódi desktop és mobil art-render QA
**Prioritás:** P0 · **Felelős:** Fejlesztői munkaszál + QA · **Státusz:** `NOT RUN`

**Bizonyíték:** VISUAL_ASSET_INTEGRATION_MANIFEST_ALPHA18.csv render_status NOT RUN; no live screenshots.
**Feladat:** App indítása után inventory, equipment, market, NPC shop/detail/directory és map/district képernyők ellenőrzése desktop és 390 px mobil nézetben.
**Függőségek:** A18-001 sikeres install/build; browser automation vagy tényleges böngésző.
**Elfogadási feltétel:** Valódi futó alkalmazásról képernyőképek, nincs törött kép/overflow; status VISUALLY VERIFIED.

## A18-003 — Az elsődleges runtime grid három hibás kivágásának ellenőrzése
**Prioritás:** P1 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `SOURCE VERIFIED`

**Bizonyíték:** Régi contact sheet: royalRapier részben boots+blade, harborAegis panel slice, courierRunners unwanted bleed; crop receipts source-board.
**Feladat:** Elfogadni és browser QA-val véglegesen ellenőrizni az alpha.18 source crops; mapping path marad stabil.
**Függőségek:** A18-001, A18-002.
**Elfogadási feltétel:** Három kép a UI-ban külön, tiszta tárgyként látható, nincs panelhatár/idegen tárgy.

## A18-004 — Négy tartalmilag hiányzó tárgygrafika brief jóváhagyása
**Prioritás:** P1 · **Felelős:** Grafikai munkaszál · **Státusz:** `NEEDS_NEW_ART`

**Bizonyíték:** ALPHA18_ITEM_ART_AUDIT_HU.csv: arenaWhetstone, merchantInk, memoryMoss, silverEyeShard = NEEDS_NEW_ART; jelenlegi family fallback tartalmilag eltér.
**Feladat:** Grafikai szál készítsen és owner hagyjon jóvá négy külön briefet; ne változzanak item statok/prices.
**Függőségek:** ALPHA18_UNIQUE_ART_REQUESTS_HU.csv.
**Elfogadási feltétel:** Stabil ID-hoz egyedi kép, distinct silhouette, receipt + manifest + smoke teszt frissítve.

## A18-005 — Három vizuálisan ismétlődő item illusztrációjának szétválasztása
**Prioritás:** P1 · **Felelős:** Grafikai munkaszál · **Státusz:** `NEEDS_NEW_ART`

**Bizonyíték:** Side-by-side: courtInvitation/sealedLetter; echoThreadCloak/archiveMantle; harborCoat/ashweaveCoat.
**Feladat:** Új, distinct image concept a courtInvitation, echoThreadCloak, harborCoat stabil ID-khoz.
**Függőségek:** Art owner jóváhagyás és brief a request CSV-ben.
**Elfogadási feltétel:** A három új kép kompozícióban/sziluettben/anyagban felismerhetően különbözik, receipts és tests pass.

## A18-006 — Hat szerepköridegen NPC-portré cseréjének előkészítése
**Prioritás:** P1 · **Felelős:** Grafikai munkaszál · **Státusz:** `NEEDS_NEW_ART`

**Bizonyíték:** Alpha.17 NPC audit + hat friss kontaktlap; nara, tomen, sera, marwen, harborTessa, harborSable.
**Feladat:** Grafikai briefek elfogadása és új portrék alkotása a külön grafikai szálban; az alpha.18 nem generál képet.
**Függőségek:** ALPHA18_UNIQUE_ART_REQUESTS_HU.csv; character/art-owner review.
**Elfogadási feltétel:** Új portré a stabil NPC ID-hoz, no copied portrait from another NPC, crop receipt/hash tests, live directory/detail UI QA.

## A18-007 — 90 equipment-set item art lefedettségének specifikálása
**Prioritás:** P1 · **Felelős:** Grafikai munkaszál + tartalomfelelős · **Státusz:** `DUPLICATE_ART`

**Bizonyíték:** Item audit rows show 90 distinct stable set item IDs resolve to five ITEM_SLOT_ART images.
**Feladat:** A 90 itemre egyedi silhouette-konceptusokat priorizálni set/rarity/slot alapján; ne legyen egy képből színcsere.
**Függőségek:** ALPHA18_UNIQUE_ART_REQUESTS_HU.csv; item/set owners.
**Elfogadási feltétel:** Minden set item külön azonosítható, stable ID mapping, outfit/set vizuális konzisztencia, all five UI surfaces QA.

## A18-008 — Master-manifest és item audit regressziós tesztje
**Prioritás:** P1 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `SOURCE VERIFIED`

**Bizonyíték:** 74 ITEM_ART entries, 23 family fallback entries and 90 slot fallback items counted by live source parser.
**Feladat:** Add script-level assert for 187 item statuses sum, image path, source receipt hashes, and no unlabelled fallback coverage.
**Függőségek:** ALPHA18_ITEM_ART_AUDIT_HU.csv + crop-receipts.
**Elfogadási feltétel:** Automated test verifies totals and reports actionable failing stable IDs.

## A18-009 — Hét bizonytalan NPC-portré jóváhagyása
**Prioritás:** P1 · **Felelős:** Grafikai munkaszál + narrative owner · **Státusz:** `NEEDS_VISUAL_REVIEW`

**Bizonyíték:** ALPHA18_NPC_ART_AUDIT_HU.csv: Taris, Rusk, Miri, Damar, Ilren, Serin, Velka.
**Feladat:** Character/art owner reviews portrait, role, region, and candidate sources without reassigning other NPC art.
**Függőségek:** Current contact sheets and audit report.
**Elfogadási feltétel:** Each row becomes UNIQUE_ART_VERIFIED or receives an approved new art brief with unchanged stable ID.

## A18-010 — Három fogyóeszköz pontos képi referenciájának eldöntése
**Prioritás:** P1 · **Felelős:** Fejlesztői/content munkaszál · **Státusz:** `NEEDS_VISUAL_REVIEW`

**Bizonyíték:** arenaProtein, saltFish, captainsLogPage fallback differs from concrete noun in item description; Pack03 candidates only approximate.
**Feladat:** Content owner resolves whether current descriptions or fallback semantics are intended; no silent substitutions.
**Függőségek:** ALPHA18_ITEM_ART_AUDIT_HU.csv and Pack03 originals.
**Elfogadási feltétel:** Written decision per stable ID and updated status/brief; gameplay data unchanged unless separately approved.

## A18-011 — 16 szemantikailag elfogadható family fallback egyedivé tétele
**Prioritás:** P2 · **Felelős:** Grafikai munkaszál · **Státusz:** `DUPLICATE_ART`

**Bizonyíték:** The family illustrations fit broad categories but 16 item IDs still share paths; listed in audit and request CSV.
**Feladat:** Create individual images selectively by actual visibility, frequency and story relevance; keep family fallback while art is pending.
**Függőségek:** Art prioritization and item owners.
**Elfogadási feltétel:** Unique matching asset and stable mapping per approved item, no change to price/stats.

## A18-012 — Kategória-, család- és felszerelésihely-fallback UI-jelölésének ellenőrzése
**Prioritás:** P2 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `NOT RUN`

**Bizonyíték:** itemArtKindFor distinguishes unique/family/slot/category fallback; 90 set items currently use slot fallback.
**Feladat:** Use true runtime screens to confirm fallbacks are clearly indicated and never falsely labelled unique.
**Függőségek:** A18-001/002.
**Elfogadási feltétel:** UI attributes/labels match resolver for fallback and unique cases.

## A18-013 — Item art legibility at 64/96/128 px
**Prioritás:** P2 · **Felelős:** Art + front-end · **Státusz:** `NOT RUN`

**Bizonyíték:** 74 mapped item art variants include different light, dark and vector styles; source contact sheets prepared.
**Feladat:** Review silhouette contrast at small UI sizes and normalize padding where it is genuinely needed, not by regenerating art.
**Függőségek:** A18-002.
**Elfogadási feltétel:** No clipped silhouette, readable visual at defined sizes, style gaps documented.

## A18-014 — NPC portrait crop and fallback accessibility audit
**Prioritás:** P2 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `NOT RUN`

**Bizonyíték:** NPC_PORTRAIT_ART explicit mappings=64; five use direct avatarSrc; SafeArtImage exists in GameClient.
**Feladat:** Live QA broken images, alt text, crop focus and fallback behavior in directory/detail/shop UIs.
**Függőségek:** A18-002.
**Elfogadási feltétel:** All 69 portraits load without broken images, names/alt labels are stable and fallback handles simulated failure.

## A18-015 — Pack01–03 koncepciók állapotának karbantartása
**Prioritás:** P2 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `SOURCE VERIFIED`

**Bizonyíték:** ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA18.csv preserves 122 pack rows and adds three corrections; originals present.
**Feladat:** Whenever art is approved, update target stable ID, source SHA, output SHA, source package, acceptance and render status.
**Függőségek:** Art requests.
**Elfogadási feltétel:** No integrated row missing path/hashes/provenance; REVIEW rows remain explicitly marked.

## A18-016 — Régió- és városnegyedképek összehangolása
**Prioritás:** P2 · **Felelős:** Grafikai munkaszál · **Státusz:** `NOT RUN`

**Bizonyíték:** 28 district mappings and 7 region concepts in REGION_ART/DISTRICT_ART; source manifest records source-level checks only.
**Feladat:** Visual owner review consistency for palette, composition and the six regions; do not replace with concept alternatives without approval.
**Függőségek:** A18-002.
**Elfogadási feltétel:** Every region ID retains an approved image; no map hotspot uses unrelated district art.

## A18-017 — NPC jelenlét és portré adatfolyam regresszió
**Prioritás:** P2 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `NOT RUN`

**Bizonyíték:** GameClient uses NPC_PORTRAIT_ART and SafeArtImage in directory/detail; source smoke validates resolver wiring.
**Feladat:** Browser check NPC schedule/presence switches portrait details correctly and image resolution does not alter canonical NPC state.
**Függőségek:** A18-002.
**Elfogadási feltétel:** Time and presence UI remains derived from existing NPC/world-time model.

## A18-018 — Inventory/equipment/market art views share a single stable resolver
**Prioritás:** P2 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `NOT RUN`

**Bizonyíték:** GameClient has ItemArtwork usage for inventory/equipment/NPC shop/forge; market path shown by component and tests.
**Feladat:** Exercise same item in inventory, equipment, tooltip, rewards, marketplace and NPC workbench.
**Függőségek:** A18-001/002.
**Elfogadási feltétel:** Same item ID resolves same image everywhere; item data/stats/prices unchanged.

## A18-019 — Fotórealisztikus és stilizált ikonok stílusáttekintése
**Prioritás:** P3 · **Felelős:** Grafikai munkaszál · **Státusz:** `NOT RUN`

**Bizonyíték:** Contact sheets include a few vector-style icons among realistic items; semantics still readable.
**Feladat:** Decide whether future icons follow strict cinematic painterly style; do not replace existing art without content benefit.
**Függőségek:** Visual owner sign-off.
**Elfogadási feltétel:** Approved art-direction sheet and explicit list of actual visual conflicts.

## A18-020 — Equipment set image pipeline and reuse policy
**Prioritás:** P3 · **Felelős:** Fejlesztői + grafikai munkaszál · **Státusz:** `DUPLICATE_ART`

**Bizonyíték:** 90 stable generated set item IDs resolve through five slot defaults; individual mappings are not authored per set piece.
**Feladat:** Plan style-preserving set-specific item art, source crops, naming and QA batching.
**Függőségek:** A18-007; content/art owners.
**Elfogadási feltétel:** Documented generation/crop plan and acceptance spec; no runtime gameplay changes.

## A18-021 — Végleges checkpoint független kivonat-tesztje
**Prioritás:** P0 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `PASS`

**Bizonyíték:** Required for every source/art release.
**Feladat:** Create clean ZIP; unzip test; extract fresh; run npm test; compare SHA-256 with .sha256; exclude caches and secrets.
**Függőségek:** All alpha.18 sources and reports.
**Elfogadási feltétel:** ZIP CRC PASS, extracted npm test PASS, SHA-256 verified; no node_modules/.next/.git/.env included.

## A18-022 — Legacy direct avatarSrc útvonalak fenntartása vagy explicit mappingre váltása
**Prioritás:** P2 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `NEEDS_VISUAL_REVIEW`

**Bizonyíték:** Five NPCs (miri, damar, ilren, serin, velka) resolve through authored avatarSrc rather than NPC_PORTRAIT_ART.
**Feladat:** Only after art-owner approval, migrate each verified image into explicit mapping and update receipts.
**Függőségek:** A18-009.
**Elfogadási feltétel:** No path duplication/behavior change; 69 stable IDs still resolve once each.

## A18-023 — Kiemelt item image twins — unique coverage artwork
**Prioritás:** P1 · **Felelős:** Grafikai munkaszál · **Státusz:** `NEEDS_NEW_ART`

**Bizonyíték:** Three pairwise comparison images and 74 explicit item maps show three near-duplicate pairs.
**Feladat:** Prioritize courtInvitation, echoThreadCloak, harborCoat before optional semantic family fallback art.
**Függőségek:** Art brief approval.
**Elfogadási feltétel:** Three new outputs each materially distinct from their comparison mate; mapping and crop receipts refreshed.

## A18-024 — Original archive preservation checksums on every release
**Prioritás:** P1 · **Felelős:** Fejlesztői munkaszál · **Státusz:** `PASS`

**Bizonyíték:** Alpha.12–alpha.17 checkpoints and Pack01–03 source ZIPs are preserved under source/project evidence.
**Feladat:** Keep originals immutable; record SHA-256 from source files and verify copies included in alpha.18 distribution.
**Függőségek:** Packaging script.
**Elfogadási feltétel:** Source and preserved copy hashes agree; older checkpoint ZIPs never nested into new one.
