# AIMORPG OUTSKIRTS — NPC FUNCTION MATRIX
## Draft v0.1 — 24 NPCs
**Status:** PHASE 1 SPECIFICATION — NOT APPROVED FOR IMPLEMENTATION

This matrix is a coordination index, not a substitute for detailed district specifications. Current implementation must be verified in source; proposed gameplay does not imply implementation.

| District | NPC | Technical ID | Baseline status / note | Proposed unique gameplay loop | Shared dependencies |
|---|---|---|---|---|---|
| Kapuváros | Damar | VERIFY | PHASE 0 marked complete by owner; source evidence to be linked in district spec | receive cargo → inspect seals/weights → reconcile storage → issue claim/contract | item instances, logistics, documents, transactions |
| Kapuváros | Alma Varg | VERIFY | same | lodging/services → traveler leads → use existing rest rules → relationship outcomes | world time, NPC presence, relationships |
| Kapuváros | Petar | VERIFY | same | compare transport offers → plan route/load → accept delivery → resolve outcome | logistics, route, inventory, economy |
| Kapuváros | Vera Noll | VERIFY | same | inspect coin → compare marks/weight/records → identify anomaly → preserve evidence | evidence, appraisal, documents, Canon |
| Kapuváros | Jarek | VERIFY | same | study map → choose route → record discovery → unlock navigation knowledge | map items, discovery state |
| Műhelynegyed | Borin Vasmarok | garran | Branch candidate adds craft boundary; main branch had generic forge/craft behavior | select weapon recipe → prepare materials → smithing activity → craft/dismantle | shared recipe, item instance, economy |
| Műhelynegyed | Velka | velka | Branch candidate assigns armor specialty | choose armor → prepare materials → armorsmith activity → craft/repair (repair not in reviewed slice) | item instance, durability decision |
| Műhelynegyed | Nara Bőrös | nara | Branch candidate adds leather recipes using existing tannersWax | prepare leather materials → cutting/stitching activity → craft/dismantle | item/recipe schema |
| Műhelynegyed | Tomen | tomen | Current apprentice action increases global smithing stat; no separate mastery verified in branch report | diagnose/learn → supervised challenge → unlock approved options | progression contract, stats, relationships |
| Régi Piac | Zora Fűszeres | VERIFY | NPC-specific runtime to verify | inspect spice → research blend → prepare mixture → assess result | shared recipe, ingredient data, alchemy |
| Régi Piac | Cador | VERIFY | NPC-specific runtime to verify | compare ledgers → reconcile transaction → authenticate document → settle case | documents, transaction IDs, evidence |
| Régi Piac | Pell | VERIFY | NPC-specific runtime to verify | inspect food/raw materials → compare quality → buy/prepare/supply | ingredient quality, item/economy |
| Régi Piac | Ilren (not assigned) | ilren | Earlier audit reports district-list vs NPC master-data mismatch; master data observed region market, district exchangeSquare | NO SPECIFICATION UNTIL CENTRAL DECISION | Canon, region/district mapping |
| Vörös Utcák | Miri | miri | NPC identity seen in source; specific runtime needs mapping | obtain lead → assess source reliability → cross-check → decide whether to share | memories, relationships, information state |
| Vörös Utcák | Havel | VERIFY | specific runtime needs verification | strategic card rounds → legal actions → opponent strategy → score/settle | game session, deterministic resolver, economy |
| Vörös Utcák | Brenka | VERIFY | generic gamble handler exists; store uses Math.random()<0.45 for current win outcome | evaluate event/odds → stake → resolve explicit rules → settle once | currency, transaction, outcome authority |
| Vörös Utcák | Silas | VERIFY | specific runtime needs verification | contact intro → negotiate favor → fulfill/decline → relationship consequences | relationship facets, narrative |
| Vörös Utcák | Tosk | VERIFY | specific runtime needs verification | present credentials/cover → answer challenge → access or exposure consequence | permissions, identity, item |
| Őrségi Negyed | Rovan | rovan | fn-rovan referenced as main-quest hook | receive optional case → gather evidence → compare → resolve legal/informal route | protected quest hooks, documents, evidence |
| Őrségi Negyed | Lena Varr | lena | fn-lena referenced as main-quest hook | inspect seal/document → compare registry → authenticate → issue result | document/item, permission |
| Őrségi Negyed | Bran | bran | fn-bran referenced as main-quest hook | request access → examine detention log → interview → compare statements | main quest protection, narrative, permission |
| Őrségi Negyed | Orren | orren | fn-orren referenced as main-quest hook | review incidents → plan sector/route → execute patrol scenario → report | world time, location state |
| Régi Perem | Eldra | eldra | fn-eldra configured as alchemy; store includes alchemy handler | inspect ingredient → hypothesize → combine/prepare → record research result | item, recipe, progression, economy |
| Régi Perem | Siven | siven | fn-siven configured as ruins with cost 40; dedicated expedition runtime needs verification | prepare → select route → explore → solve obstacle → recover/retreat | expedition state, item, reward |
| Régi Perem | Maela | maela | fn-maela configured as well with silentWellVial | observe well → compare old account/clue → record discovery → optional access | Eye, memory, Canon, discovery |

## Per-NPC implementation specification checklist

Every NPC spec must include:
1. exact NPC ID and source evidence
2. current NPC function IDs/kinds and actual runtime handler
3. unique gameplay purpose
4. complete player activity loop
5. legal actions and rules
6. preconditions: region, schedule, items, stats, permissions, prior state
7. success/partial/failure
8. costs and rewards
9. economy flows and exploit controls
10. relationship/progression effects
11. UI states and copy
12. persistence/migration
13. tests and regressions
14. dependencies and file ownership
15. Canon constraints and unresolved questions

## Duplication checks

- No separate crafting at Old Market or Old Edge.
- No separate item quality/rarity systems.
- No separate relationship meters.
- No separate quest state machine for Watch cases or expeditions.
- No separate money/stake wallets for card games/betting.
- A Szem is not a decision engine.
- Ilren is excluded from Old Market implementation until centrally resolved.


---

# PHASE 2 TARGETED GAP CLOSURE — OLD MARKET (ALPHA.26)

**Status:** SOURCE-VERIFIED ADDENDUM · DOCUMENTATION ONLY · NOT APPROVED FOR IMPLEMENTATION  
**Baseline:** `main`, `2.0.0-alpha.26`  
**Branch:** `old-market/phase-1-specification`

This addendum supersedes the three Old Market rows' earlier generic gameplay-loop proposals wherever those proposals conflict with the verified alpha.26 runtime below. It does not change Canon or authorize implementation.

## 1. Zora — actual UI catalogue and runtime

### Verified function/NPC facts

- NPC: `zora`, Zora Fűszeres; role `Fűszerkereskedő`; region `outskirts`; district `oldMarket`; location `Fűszerfolyosó`; service `Fűszer, ritka áru, hírek`; routine 07:00–18:00.
- Function: `fn-zora`; kind `spiceTrade`; cost `18`; **`itemIds` is absent**.
- The UI selects `fn.itemIds` when non-empty; otherwise it falls back to `regionalMarketItems(npc.region)`. Thus Zora's current visible catalogue is the complete eligible `outskirts` regional pool, not a Zora-authored spice catalogue.
- The UI displays each item's `basePrice` and sends `buy:<itemId>`.
- The backend has no dedicated `spiceTrade` case. The generic handler accepts a selected item only if it is in `fn.itemIds`; with no `itemIds`, it resolves no product and charges the function's `18` gold. The visible item's displayed `basePrice` is therefore not the amount used by the backend, and no item is granted.
- **All 25 entries below are UI-visible but currently route through the generic handler. None is a member of Zora's `fn.itemIds`. This is a broken transaction path, not a verified authored spice offer.**

Source locations: [NPC definitions](../src/lib/content.ts#L326-L328), [function definitions](../src/lib/content.ts#L471-L473), [regional pools and filter](../src/lib/itemSystem.ts#L25-L44), [regionalMarketItems](../src/lib/itemSystem.ts#L78-L95), [UI fallback and purchase button](../src/components/GameClient.tsx#L767-L770), [generic runtime handler](../src/lib/store.ts#L663-L670).

### Full current UI-visible Zora catalogue

All rows: `fn.itemIds membership = NONE`; `runtime = GENERIC spiceTrade handler`; current backend effect on selection = fixed 18-gold charge, no product grant. “No effect” means no `effects` property; stat fields are not item effects.

#### Generated common Outskirts set items

Generated by `buildSetItems()`; the five items are in the explicit Outskirts pool and are market-eligible because the set rarity is Common.

| Item ID | Exact name | basePrice | type / category | origin | rarity | effects |
|---|---|---:|---|---|---|---|
| `set_outskirts_common_weapon` | A Peremárnyék készlete · penge | 75 | weapon / equipment | A Peremárnyék készlete · penge | Közönséges | none |
| `set_outskirts_common_shield` | A Peremárnyék készlete · pajzs | 75 | shield / equipment | A Peremárnyék készlete · pajzs | Közönséges | none |
| `set_outskirts_common_armor` | A Peremárnyék készlete · vért | 75 | armor / equipment | A Peremárnyék készlete · vért | Közönséges | none |
| `set_outskirts_common_accessory` | A Peremárnyék készlete · kesztyű | 75 | accessory / equipment | A Peremárnyék készlete · kesztyű | Közönséges | none |
| `set_outskirts_common_boots` | A Peremárnyék készlete · csizma | 75 | boots / equipment | A Peremárnyék készlete · csizma | Közönséges | none |

The generated set definition uses base price 75 for Common items, origin `${set.name} · ${piece.label}`, and `marketEligible: true` / `sellable: true` only for Common sets. Source: [set definitions and generated item builder](../src/lib/content.ts#L138-L153), [set piece builder](../src/lib/content.ts#L237-L271).

#### Explicit legacy Outskirts pool items

For items where `category`, `origin`, `legalStatus`, or `effects` is omitted, the omission is real source data. UI category fallback is `equipment` when a slot exists, otherwise `consumable`; origin display falls back to “Ismeretlen eredet” if neither `origin` nor `regions` exists.

| Item ID | Exact name | basePrice | type / category | origin | rarity | effects |
|---|---|---:|---|---|---|---|
| `militiaBlade` | Városi őrkard | 46 | weapon / equipment (fallback) | not authored; fallback unknown | Közönséges | none |
| `oakShield` | Tölgyfa pajzs | 38 | shield / equipment (fallback) | not authored; fallback unknown | Közönséges | none |
| `paddedArmor` | Bélelt bőrvért | 52 | armor / equipment (fallback) | not authored; fallback unknown | Közönséges | none |
| `travelerBoots` | Futár csizmája | 30 | boots / equipment (fallback) | not authored; fallback unknown | Közönséges | none |
| `smokePhial` | Füstfiola | 25 | consumable / consumable (fallback) | not authored; fallback unknown | Közönséges | none |
| `gateRations` | Úti fejadag | 12 | consumable / consumable | Külváros · Kapuváros | Közönséges | none |
| `workshopIron` | Műhelyvas | 18 | consumable / material | Külváros · Műhelynegyed | Közönséges | none |
| `tannersWax` | Bőrviasz | 22 | consumable / material | Külváros · Műhelynegyed | Közönséges | none |
| `streetMap` | Külvárosi utcajegyzék | 16 | consumable / document | Külváros · Régi Piac | Közönséges | `statBoost: perception +1, navigation +1` |
| `redStreetTokens` | Vörös utcai zseton | 28 | consumable / tradeGood | Külváros · Vörös Utcák | Ritka | none |
| `watchSeal` | Őrségi ideiglenes pecsét | 42 | consumable / document | Külváros · Őrségi Negyed | Ritka | none |
| `silentWellVial` | Néma kút fiolája | 34 | consumable / relic | Külváros · Régi Perem | Különleges | `questBonus: 1` |
| `watchLantern` | Őrségi kézilámpa | 40 | consumable / equipment | Őrségi Negyed | Közönséges | none |

Source: [base item definitions](../src/lib/content.ts#L45-L67), [watchLantern definition](../src/lib/content.ts#L134-L134), [explicit Outskirts pool](../src/lib/itemSystem.ts#L25-L33).

#### Expansion Outskirts pool items

| Item ID | Exact name | basePrice | type / category | origin | rarity | effects |
|---|---|---:|---|---|---|---|
| `watchCaptainsSaber` | A Kapitány utolsó kardja | 185 | weapon / equipment | Külváros · Őrségi negyed | Ritka | none |
| `oathMedallion` | A Névtelen Őrség medálja | 145 | accessory / equipment | Külváros · Régi őrhely | Különleges | none |
| `ashweaveCoat` | Hamuval szőtt kabát | 178 | armor / equipment | Belváros · Hátsó szabóműhely | Ritka | none |
| `canalKnife` | Csatornaőrök keskeny kése | 132 | weapon / equipment | Külváros · Csatornajárat | Ritka | none |
| `smokeStepBoots` | Füstjáró csizma | 155 | boots / equipment | Külváros · Vörös utcák | Ritka | none |
| `courierRunners` | Futárcéh gyorsjárója | 138 | boots / equipment | Kereskedelmi Központ · Futárcéh | Ritka | none |
| `memoryMoss` | Emlékmoha | 42 | consumable / material | Külvárosi kutak és erdei romok | Ritka | none |

Source: [expansion pool](../src/lib/itemSystem.ts#L36-L44), [expansion item definitions](../src/lib/expansionItems.ts#L6-L111).

### Catalogue boundary

- `moonleaf`, `emberRoot`, `strengthTonic`, `runeInfusion`, `heartyStew`, and other items with `regions: ["outskirts"]` are **not** automatically part of Zora's current visible pool. The UI uses the explicit + expansion pool through `regionalMarketItems`, not every item whose `regions` array contains `outskirts`.
- The current catalogue contains no authored spice-blend item and no Zora-specific product list.
- All 25 displayed items must be treated as **GENERIC HANDLER / BROKEN PURCHASE PATH** until a separately approved item/function correction exists.

## 2. Pell — exact current offer and transaction discrepancy

### Verified function

- NPC: `pell`; role `Gyümölcsárus`; region `outskirts`; district `oldMarket`; location `Kétkocsis sor`; routine 06:00–15:00.
- Function: `fn-pell`; kind `foodTrade`; cost `14`; `itemIds: ["gateRations"]`.
- Because `itemIds` is non-empty, the UI displays only the explicitly assigned item, not the entire Outskirts regional pool.
- The item card and confirmation button display `gateRations.basePrice = 12`; the dedicated backend `foodTrade` case charges `fn.cost = 14`.
- `gateRations` has `marketEligible: true`, `sellable: true`, `tradeValue: 8`, but no `effects` property. The backend's success message claims percentage-based healing, but `consumeItem` rejects a consumable with no positive healing/effect. Thus the current Pell offer is not a functioning food-healing item.
- The regional item pool does not make other food items Pell offers. `heartyStew` is authored separately and appears in Alma's inn function, not Pell's `itemIds`.

Sources: [Pell NPC and function](../src/lib/content.ts#L328-L328), [Pell and Alma functions](../src/lib/content.ts#L465-L473), [gateRations/heartyStew definitions](../src/lib/content.ts#L60-L67), [UI item price](../src/components/GameClient.tsx#L767-L770), [foodTrade backend](../src/lib/store.ts#L618-L625), [consumeItem effect validation](../src/lib/store.ts#L520-L539).

### Pell current item catalogue

| Item ID | Exact name | basePrice | type / category | origin | rarity | effects | fn.itemIds | market eligibility |
|---|---|---:|---|---|---|---|---|---|
| `gateRations` | Úti fejadag | 12 | consumable / consumable | Külváros · Kapuváros | Közönséges | none | MEMBER | true |

### Purchase, resale and freshness

- Pell backend purchase: 14 gold; UI display: 12 gold. No demand update is applied in the dedicated `foodTrade` branch.
- `tradeValue: 8` is catalog metadata; the current generic player `sell()` function does **not** use it.
- Actual generic resale uses `sellingPrice(basePrice, effective appraisal, equipment)`. It is not a Pell buyback and does not route to Pell.
- With base appraisal 5 and no equipped `sellBonus`, the current formula gives `round(12 × (0.5 + 0.04)) = 6` gold. Actual value changes with effective appraisal and equipped sell bonuses.
- Generic `sell()` reduces that item's `marketDemand` by 3. Pell's dedicated purchase does not increase demand.
- Neither `ItemDefinition` nor `InventoryItem` defines freshness, spoilage, or per-instance quality. No freshness/quality tier is verified.

Sources: [sell and market buy](../src/lib/store.ts#L540-L568), [marketPrice and sellingPrice](../src/lib/rules.ts#L77-L94), [item and inventory types](../src/lib/types.ts#L30-L57).

## 3. Cador — authored document-input matrix

### Verified NPC/function facts

- NPC: Cador; role Könyvelő; Old Market / Fekete tinta irodája; service: számlák, könyvelés, okiratok; 08:00–16:00.
- Function: `fn-cador`; kind `ledger`; cost 25; no `itemIds`.
- The current UI uses the generic special-function fallback. The current backend routes `ledger` through the generic handler: no input document is consumed, no authored document item is created, and the 25-gold action returns only the function description.
- Authored output promise (“hivatalos számla, adóslevél vagy egyszerű tranzakciós okirat”) exists in the function description, but no output ItemId or document data contract is defined.

Sources: [Cador NPC](../src/lib/content.ts#L327-L327), [fn-cador](../src/lib/content.ts#L472-L472), [generic UI fallback](../src/components/GameClient.tsx#L793-L814), [generic ledger handler](../src/lib/store.ts#L663-L670).

### Direct Old Market / Outskirts authored inputs

| Item ID | Source / exact name | Authored fields | Cador verification supported by source | Cross-NPC authentication | Missing stored data |
|---|---|---|---|---|---|
| `sealedLedger` | Kereskedelmi Központ · Raktárgyűrű / Lepecsételt főkönyv | base 110; category document; origin present; legalStatus restricted; tradeValue 160; sellable false; marketEligible false; questItem true; rarity Különleges; no tags | **VERIFIED narrative role:** tangible form of the bookkeeping discrepancy in `main_outskirts_14`. No ledger rows are stored in the item definition. | Oris is the support NPC for physical verification in `main_outskirts_14`. | account rows, amounts, timestamps, author, seal ID, manifest/shipment reference |
| `watchSeal` | Őrségi Negyed / Őrségi ideiglenes pecsét | base 42; category document; origin present; legalStatus restricted; tradeValue 50; sellable true; marketEligible true; no tags | **VERIFIED narrative link:** official investigation document; Cador is support for Lena's quest. No serial/issuer/expiry is stored. | Lena is core, Cador support in `main_outskirts_20`. | seal number, issuer ID, issue time, expiry, registry reference |
| `guildPermit` | Kereskedelmi Központ · Céhesor / Céhes ideiglenes engedély | base 85; category document; origin present; legalStatus restricted; tradeValue 95; sellable true; marketEligible true; no tags | **VERIFIED narrative link:** guild access document; its related invoice is referenced in the audit, but no invoice item is defined. | Sera is core, Cador support in `main_market_03`. | permit number, issuing guild, validity, fee, invoice ID, signature/seal reference |
| `streetMap` | Külváros · Régi Piac / Külvárosi utcajegyzék | base 16; category document; origin present; legalStatus legal; tradeValue 24; sellable true; marketEligible true; effects statBoost perception/navigation; no tags | No Cador-specific check is authored. | Jarek core / Malk support in `main_outskirts_10`. | route segment IDs, author, version, surveyed time |

Sources: [item definitions](../src/lib/content.ts#L63-L86), [main quest hooks](../src/lib/mainQuestAudit.ts#L112-L135), [watchSeal hook](../src/lib/mainQuestAudit.ts#L177-L181), [streetMap hook](../src/lib/mainQuestAudit.ts#L87-L95).

### Cross-district authored documents and evidence relevant to a future Cador input boundary

| Item ID | Authored identity / fields | Narrative hook or source relation | Cador status |
|---|---|---|---|
| `merchantInk` | Kereskedői tinta; material, origin Market · Régi könyvpiac; legal; tradeValue 30; sellable/marketEligible true; appraisal/logistics stats; no tags | `main_market_01` material hook; Ilren/Lyra | **NOT A DOCUMENT.** Possible writing material is proposal only; no Cador consumption rule exists. |
| `warehouseSeal` | Raktári viaszpecsét; material, origin Market · Raktárgyűrű; legal; tradeValue 45; sellable/marketEligible true; no tags | `main_market_04` evidence hook; Oris/Marwen | Physical seal-related material; no serial, state, or applied-seal instance data. Not a Cador-authored input. |
| `blackCoinLedgerFragment` | Quest item; legalStatus evidence; tradeValue 0; unsellable/non-market; questItem true | `main_market_08` evidence hook; Lyra/Vera | Evidence can be referenced narratively; the item stores no ledger entries or transaction IDs. |
| `matchLedger` | Arena document; restricted; tradeValue 85; sellable/marketEligible true | Arena main-quest evidence hook; Rusk/Brenka | Not a Cador input in current Canon. |
| `promissoryNote` | Inner City document; restricted; tradeValue 220; sellable/marketEligible true | `main_market_07` document hook; Cassian/Livia | Existing debt instrument, not Cador-produced. |
| `patronInvitation` | Inner City document; restricted; questItem true; unsellable/non-market | `main_inner` social-access hook; Adrian/Selene | Not a Cador input. |
| `debtMarker` | Inner City document; legalStatus evidence; questItem true; unsellable/non-market | No direct `MainQuestAudit.itemHook` found in the reviewed audit map | Evidence-like item; no Cador link verified. |
| `courtInvitation` | Palace document; restricted; questItem true; unsellable/non-market | Palace access storyline | Not a Cador input. |
| `royalArchiveCopy` | Palace document; restricted; tradeValue 320; sellable/marketEligible true | Palace archive clue hook | Not a Cador input. |
| `royalTransitPass` | Document; restricted; questItem true; unsellable/non-market | Inner/Palace access and transit hooks | Not a Cador input. |
| `sealedTestimony` | Quest item; legalStatus evidence; questItem true; unsellable/non-market | Palace evidence item | No Cador-specific link verified. |
| `blackArchiveIndex` | Quest item; legalStatus evidence; questItem true; unsellable/non-market | Palace archive evidence hook; Ysra/Orven | No Cador-specific link verified. |
| `sealedLetter` | Quest item; origin Ismeretlen; legalStatus evidence; questItem true; unsellable/non-market | `main_harbor_02` document hook; Dain/Kael | Future read-only cross-reference candidate; no manifest data stored. |
| `captainsLogPage` | Quest item; origin Harbor · Vasrakpart; legalStatus evidence; questItem true; unsellable/non-market | Authored description says a torn captain's log page about a ship's cargo | Future shipment-input candidate only; no structured cargo fields stored. |
| `blackCoinCargoTag` | Quest item; origin Harbor · Éjjeli Raktárak; legalStatus evidence; questItem true; unsellable/non-market | `main_harbor_01` evidence hook; Kael/Dain | Future shipment-input candidate only; no manifest or custody reference stored. |
| `blackCoin` | Relic/quest item; legalStatus evidence; questItem true; unsellable/non-market | Earlier Outskirts evidence hook; Vera/Lyra | Evidence object, not a document; not Cador's property. |

Relevant authored item ranges: [Outskirts and Market items](../src/lib/content.ts#L60-L89), [Inner City and Palace documents](../src/lib/content.ts#L96-L109), [Harbor evidence items](../src/lib/content.ts#L119-L123), [universal evidence items](../src/lib/content.ts#L123-L127). Relevant quest hooks: [Main Quest Audit](../src/lib/mainQuestAudit.ts#L112-L135), [Market hooks](../src/lib/mainQuestAudit.ts#L294-L365), [Harbor hooks](../src/lib/mainQuestAudit.ts#L492-L510).

### Evidence, tags and missing fields

- `ItemDefinition` has `origin`, `legalStatus`, `tradeValue`, `questItem`, `sellable`, `marketEligible`, optional `tags`, `stats`, and `effects`.
- There is no dedicated `evidence` boolean, document issuer, signature, document number, transaction ID, shipment ID, manifest reference, seal-instance reference, custody owner/history, or authenticity field in `ItemDefinition`.
- `InventoryItem` stores only `instanceId` and `itemId`; it has no per-instance document payload.
- Narrative/evidence relationships are currently represented externally through `MainQuestAudit.itemHooks`, `functionHooks`, and quest/world memory tags. These are not document metadata.
- The reviewed Old Market document/evidence items do not author `tags`; do not infer tags from category or legal status.

Source: [ItemDefinition and InventoryItem types](../src/lib/types.ts#L30-L57), [QuestItemHook/MainQuestAudit types](../src/lib/types.ts#L88-L92).

### Damar shipment/manifest compatibility boundary

**VERIFIED current source:** Damar is the Gate City warehouse keeper; `fn-damar` is `warehouse` and describes official cargo movement/inspection subject to permissions. Damar's `main_outskirts_03` hook links the warehouse-key route to Petar. Dain's `fn-dain` is `cargo` and explicitly compares ship logs and cargo manifests; Kael's `fn-kael` handles official harbor permissions. These are currently generic handlers, not a structured shipment/manifest runtime.

**PROPOSAL — compatibility only, not a new Cador model:** if a future Damar-owned shipment/manifest contract is approved, Cador may read its published immutable references and compare the ledger against them. Candidate read-only fields owned by that future Damar contract: manifest reference, shipment reference, item ID, quantity, origin/destination, dispatch/arrival time, seal reference, issuing office. Cador must not create or own shipment records, custody state, chain-of-custody, or a parallel evidence model. The authoritative shipment/manifest schema and lifecycle remain with Damar/central integration.

Sources: [Damar NPC](../src/lib/content.ts#L277-L277), [Damar function](../src/lib/content.ts#L422-L425), [Kael and Dain functions](../src/lib/content.ts#L448-L453), [Damar quest hook](../src/lib/mainQuestAudit.ts#L21-L28), [Harbor quest hooks](../src/lib/mainQuestAudit.ts#L492-L510).

## 4. Ilren — BLOCKED (unchanged)

Ilren is not part of this Old Market package. No relocation, Canon edit, implementation plan, or accepted NPC-list change is made.

The discrepancy remains: `OUTSKIRTS_DISTRICTS.oldMarket.npcIds` lists `ilren`, while the NPC master record defines Ilren as region `market`, district `exchangeSquare`. Project-owner decision is required. Source: [Old Market district list](../src/lib/content.ts#L410-L413), [Ilren NPC master record](../src/lib/content.ts#L278-L278).

## 5. VERIFIED vs PROPOSAL status

**VERIFIED:** the 25 Zora UI-visible items, item fields shown above, absent Zora `itemIds`, generic spice handler, Pell's sole `gateRations` item, 12/14 price mismatch, absent food effect, generic resale formula, absence of freshness/quality fields, Cador's generic ledger handler, authored document/evidence item fields and quest hooks, Damar/Dain/Kael function definitions, Ilren mapping discrepancy.

**PROPOSAL:** any future Zora spice-specific catalogue, any Cador-authored invoice/debt-note output, any new document data contract, any Damar manifest fields listed above, and any cross-NPC read-only reconciliation adapter.

No source code, Canon, main quest, item model, inventory model, currency model, or save model is changed by this addendum.


### Cador matrix correction — tagged archive material

Add this related material row to the cross-district input matrix:

| Item ID | Exact name | Authored fields | Cador status |
|---|---|---|---|
| `blackArchiveWax` | Fekete archív viasz | basePrice 51; type consumable; category material; origin Kereskedelmi Központ · zárt árusor; legalStatus restricted; tradeValue 62; sellable true; marketEligible true; rarity Ritka; tags `crafting`, `archive`, `evidence`; no effects | **VERIFIED MATERIAL, NOT DOCUMENT.** No Cador function hook or consumption rule exists. Any use for sealing/authenticating a Cador document is **PROPOSAL** only. |

Source: [blackArchiveWax item definition](../src/lib/expansionItems.ts#L105-L114). This row does not make the item a Cador input and does not create an evidence/custody model.
