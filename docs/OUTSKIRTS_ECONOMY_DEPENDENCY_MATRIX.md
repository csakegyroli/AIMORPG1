# AIMORPG OUTSKIRTS — ECONOMY DEPENDENCY MATRIX
## Draft v0.1
**Status:** PHASE 1 PROPOSAL — CENTRAL REVIEW REQUIRED

## 1. Global economy owner
Central Meta-GPT is the single authority for gold, diamonds, item prices/selling formulas, rarity categories/multipliers, reward tables/drop rates, regional reward scalars, currency sources and sinks.

Relevant existing modules:
- src/lib/rewardEconomy.ts
- src/lib/itemSystem.ts
- src/lib/rules.ts
- src/lib/store.ts

District developers propose parameters; they do not merge changes independently.

## 2. Common transaction contract
Every transaction must:
1. show item/service, quantity, cost, fees and potential return before confirmation
2. validate current inventory, ownership, legality and funds
3. consume/reserve required inputs only once
4. apply currency and inventory changes atomically
5. record an idempotent transaction/result
6. prevent replay, duplicate reward and double settlement
7. provide explicit success/partial/failure reason
8. leave no partial state after failure

Client-side state is not proof of server-authoritative security. Current store is client-side; central server-authority decision is required for competitive/high-value outcomes.

## 3. District dependency table

| District / NPC | Economic input | Economic output / sink | Central review |
|---|---|---|---|
| Kapuváros / Damar | cargo/items, documents | storage/logistics fee, cargo reconciliation reward | stock/custody and reward caps |
| Kapuváros / Alma | gold, consumables, lodging access | accommodation/rest service | existing rest; no forced timer |
| Kapuváros / Petar | cargo, route information | transport fee/contract reward | no arbitrage or duplicate cargo |
| Kapuváros / Vera | coins, documents/evidence | appraisal, controlled information | no new currency or Black Coin alteration |
| Kapuváros / Jarek | maps, exploration data | cartography service, access unlock | no duplicated discovery |
| Workshop / Borin | materials, gold, item instances | weapon crafting/enhancement | recipe, stats, +1..+9 model |
| Workshop / Velka | materials, gold, armor instances | armor crafting/repair | common durability/repair |
| Workshop / Nara | leather inputs or existing tannersWax | leather outputs | branch candidate and recipe costs |
| Workshop / Tomen | training cost, mastery milestones | technique unlocks | global stat vs profession mastery |
| Old Market / Zora | spice ingredients, recipes | blended consumables/material outputs | item outputs, recipe and rarity |
| Old Market / Cador | transaction/document data | verification, case reward | currency/document integrity |
| Old Market / Pell | food/ingredients | consumable/material sales | quality and supply pricing |
| Red Streets / Miri | information, possible costs | information leads | no unlimited rumor reward |
| Red Streets / Havel | shared currency stake if approved | bounded game settlement | deterministic game and max stake |
| Red Streets / Brenka | shared currency stake | odds-based settlement | expected return, exposure, cancellation |
| Red Streets / Silas | existing relationship/favor state | access/mediation outcomes | no second favor currency |
| Red Streets / Tosk | documents/items/access flags | access opportunity | no permanent unauthorized access |
| Watch / Rovan | evidence, documents, case state | optional case reward | no main quest changes |
| Watch / Lena | document/material/service fee | authentication/access | no fake official item generation |
| Watch / Bran | access/interview state | information discovery | no direct item/currency farm |
| Watch / Orren | patrol decisions | reports/discoveries | bounded repeatable rewards |
| Old Edge / Eldra | ingredients, tools, recipes | alchemical output/research unlock | recipe, item effect and rarity |
| Old Edge / Siven | equipment, consumables, route prep | expedition discoveries/rewards | repeatability/rare reward ceiling |
| Old Edge / Maela | observation/clue state | stories/access/discovery | A Szem and Canon review |

## 4. Reward proposal form
Every new reward should state:
- activity type (repeatable/one-time/limited)
- input costs
- gold/diamond outflow
- gold/diamond inflow
- item outputs and rarity
- expected frequency
- upper bound per completion
- exploit-loop analysis
- skill dependency
- alternative progression route
- effect on other districts

## 5. Red-line rules
- No Pay-to-Win.
- No new currency without central approval.
- No unlimited reward source.
- No guaranteed-profit betting.
- No card-game settlement without stake cap and duplicate prevention.
- No hidden district-specific price multiplier.
- No quest/evidence resale exploit.
- No recipe output duplication.
- No free material loop through dismantling.
- No repeated dungeon/patrol/investigation reward claim without balance review.
- No payout controlled solely by client state.

## 6. Open economic decisions
1. Havel/Brenka stake and payout models.
2. Ingredient quality and global price treatment.
3. Recipe output quality/item-value interaction.
4. +1..+9 material sinks.
5. Durability/repair costs.
6. Expedition/dungeon reward ceilings.
7. Profession mastery without XP inflation.


---

# PHASE 2 TARGETED GAP CLOSURE — OLD MARKET ECONOMY (ALPHA.26)

**Status:** SOURCE-VERIFIED ECONOMIC ADDENDUM · CENTRAL ECONOMY APPROVAL REQUIRED  
**Baseline:** `main`, `2.0.0-alpha.26`  
**Branch:** `old-market/phase-1-specification`

This addendum corrects the earlier Old Market economic proposal where it assumed spice ingredients, quality tiers, or food quality that are not present in alpha.26. It does not authorize new economy or item models.

## 1. Verified Old Market transaction paths

| NPC | Authored function | Current item scope | UI price | Backend charge | Current backend outcome |
|---|---|---|---:|---:|---|
| Zora | `fn-zora`, `spiceTrade`, cost 18, no `itemIds` | UI falls back to all 25 eligible Outskirts regional-pool items | selected item's `basePrice` | 18 gold | generic handler grants no item; charges 18 gold |
| Cador | `fn-cador`, `ledger`, cost 25, no `itemIds` | no item input selected by current UI | no item price | 25 gold | generic handler produces no document item or structured ledger result |
| Pell | `fn-pell`, `foodTrade`, cost 14, `itemIds:["gateRations"]` | only `gateRations` | 12 gold | 14 gold | item granted, but UI/backend price mismatch |

Sources: [function definitions](../src/lib/content.ts#L471-L473), [UI catalogue fallback and displayed price](../src/components/GameClient.tsx#L767-L770), [foodTrade backend](../src/lib/store.ts#L618-L625), [generic handler](../src/lib/store.ts#L663-L670).

## 2. Zora economic facts

- The current visible stock is derived from `regionalMarketItems("outskirts")`: explicit regional pool + expansion pool, filtered by `isMarketEligible`.
- There are 25 UI-visible entries. They are not a Zora-specific authored spice catalogue.
- Zora's `fn.itemIds` is absent. The generic backend handler checks a selected ID against `fn.itemIds`; this fails for every visible item. The handler then uses `fn.cost = 18`, deducts it, and completes the generic function without granting an item.
- The UI price of any selected card is its `basePrice`, so displayed and charged amounts may differ.
- The generic handler does not re-check `isMarketEligible` or `itemAvailableInRegion` for the selected item; the current UI filtering is not a substitute for server-side validation.
- No current Zora purchase should be counted as a valid commodity sale, item sink, or market-demand change.

**VERIFIED:** the current handler is economically invalid.  
**PROPOSAL:** any Zora-specific list, product mapping, recipe, or price policy requires a separate central content/economy decision.

## 3. Pell economic facts

### Current purchase

- The sole function item is `gateRations`.
- Catalog: `basePrice=12`, `tradeValue=8`, `sellable=true`, `marketEligible=true`, `legalStatus=legal`, no `effects`.
- UI displays 12 gold.
- Dedicated `foodTrade` backend prioritizes `fn.cost=14`; it charges 14 gold.
- The dedicated branch does not update `marketDemand`.
- The backend success text says the food later restores health by percentage, but `gateRations` has no heal effect. The current `consumeItem` path rejects a consumable without a positive healing/effect.
- `heartyStew` is a separate Outskirts item with `healPercent:20`, but is authored in Alma's inn function, not Pell's item list. Do not silently add it to Pell's offer.

Sources: [gateRations and heartyStew](../src/lib/content.ts#L60-L67), [Pell and Alma function definitions](../src/lib/content.ts#L465-L473), [foodTrade](../src/lib/store.ts#L618-L625), [consumeItem](../src/lib/store.ts#L520-L539).

### Generic player resale

The catalog's `tradeValue` is not used by the generic `sell()` calculation. The actual resale formula is:

```ts
sellingPrice(basePrice, effectiveAppraisal, equipment)
= round(basePrice * (0.5 + min(0.12, appraisal * 0.008) + equippedSellBonus))
```

For `gateRations` at base appraisal 5 and no equipped `sellBonus`, the current result is 6 gold. Actual value depends on effective appraisal and equipped bonuses. This is a generic player-market sale, not a Pell buyback.

- Generic sale removes the item and decreases its `marketDemand` by 3.
- Generic regional-market purchase uses `marketPrice()` and increases demand by 4.
- Pell's dedicated `foodTrade` purchase uses neither `marketPrice()` nor the demand update.
- No NPC-specific repurchase route is defined for Pell.
- No freshness, spoilage, or per-instance quality field exists in `ItemDefinition` or `InventoryItem`.

Sources: [buy/sell handlers](../src/lib/store.ts#L540-L568), [price formulas](../src/lib/rules.ts#L77-L94), [item/inventory types](../src/lib/types.ts#L30-L57).

## 4. Cador economic boundary

- The 25-gold cost is present in `fn-cador`.
- The current generic `ledger` handler charges this cost without producing a document item, consuming an authored document input, or returning a structured accounting result.
- Existing authored documents/evidence are not a new Cador inventory. In particular, `sealedLedger` is a restricted, non-sellable, non-market quest item used as evidence in `main_outskirts_14`; it must not become a repeatable paid output.
- `watchSeal` and `guildPermit` have existing quest audit links involving Cador as support, but their current item definitions do not contain issuer, issue date, serial, validity, invoice, or transaction ID.
- No new fee, document output, reward, or transaction model is approved by this addendum.

Sources: [Cador function](../src/lib/content.ts#L472-L472), [sealedLedger definition](../src/lib/content.ts#L84-L84), [main_outskirts_14 hook](../src/lib/mainQuestAudit.ts#L121-L128), [watchSeal/guildPermit hooks](../src/lib/mainQuestAudit.ts#L177-L181) and [Market hooks](../src/lib/mainQuestAudit.ts#L312-L320).

## 5. Cross-district dependency list — verified links vs future interfaces

| Old Market NPC | Existing linked NPC / district | Verified relationship | Boundary / unresolved data |
|---|---|---|---|
| Zora | Pell / Old Market | `main_outskirts_13`: Zora core, Pell support; market voice reinforces the unknown-ship story | No shipment ID, ship ID, lot ID, or structured origin result is stored by the current item/function model |
| Zora | Kael / Dain / Harbor | Zora's Canon says she recognizes a ship's arrival from scent; Harbor quests use official harbor permissions and cargo records | Narrative compatibility only; no direct persisted Zora→manifest reference |
| Cador | Oris / Trade Center warehouse ring | `main_outskirts_14`: Cador core, Oris support; `sealedLedger` is the evidence item | Oris performs physical verification; Cador must not replace the warehouse record owner |
| Cador | Sera / Trade Center guild row | `main_market_03`: Sera core, Cador support; `guildPermit` is a document hook | Permit metadata (issuer/expiry/number/invoice) is not currently stored |
| Cador | Oris + Marwen / Trade Center warehouse ring | `main_market_04`: Oris core, Marwen support; `warehouseSeal` is evidence | Seal serial, application time, and validity state are not stored |
| Cador | Damar / Gate City | `main_outskirts_03`: Damar core, Petar support; Damar's function describes official warehouse/cargo movement | Current Damar function is generic `warehouse`; no structured shipment/manifest/custody state exists |
| Cador | Dain + Kael / Harbor | `main_harbor_01` and `main_harbor_02`: cargo-tag evidence, ship logs, manifests, official permissions | Cador may only consume a future Damar-owned read-only manifest reference after central approval |
| Pell | Alma / Gate City | `main_outskirts_15`: Pell core, Alma support; fresh food and inn conversation connect the places | Current Pell offer is only `gateRations`; food-quality/freshness is not stored |
| Pell | Zora / Old Market | Zora quest hook includes Pell as support; Pell is a local corroborating source | Information corroboration is narrative, not an economic stock dependency |

Sources: [Outskirts quest hooks](../src/lib/mainQuestAudit.ts#L112-L135), [Damar hook](../src/lib/mainQuestAudit.ts#L21-L28), [Market hooks](../src/lib/mainQuestAudit.ts#L294-L330), [Harbor hooks](../src/lib/mainQuestAudit.ts#L492-L510), [NPC/function definitions](../src/lib/content.ts#L277-L285) and [Damar/Kael/Dain functions](../src/lib/content.ts#L422-L453).

## 6. Damar manifest compatibility — proposal boundary only

**VERIFIED:** Damar owns the Gate City warehouse/cargo role in Canon; Dain owns the Harbor cargo-check role in Canon. Current `fn-damar` (`warehouse`) and `fn-dain` (`cargo`) are still generic runtime handlers.

**PROPOSAL:** a future Damar shipment/manifest model may publish immutable read-only references to Cador for ledger reconciliation. Candidate manifest fields (to be owned and approved by Damar/Central, not Cador): manifest reference, shipment reference, item ID, quantity, origin, destination, dispatch time, arrival time, seal reference, issuing office.

Cador must not create:
- a second shipment or manifest model;
- a custody owner/history model;
- a parallel evidence registry;
- a copied mutable cargo record.

Cador's future role is limited to comparing a source ledger against Damar-owned manifest facts and recording the approved result through existing journal/quest systems.

## 7. Economy decisions still open

1. Zora's authored `fn.itemIds` and whether any current item is legitimately part of her spice offer.
2. Whether the existing 18-gold Zora function cost is removed, retained as a service fee, or replaced by item-specific price calculation.
3. Pell's single-item `gateRations` offer: whether the item, function price, or authored description should be corrected.
4. Whether Pell is intended to sell an existing healing item such as `heartyStew` (not currently assigned to him).
5. Whether Cador's 25-gold fee is retained, and what verified output/input it purchases.
6. Future Damar manifest read-only interface and its authoritative owner.
7. No freshness/quality tier or item-instance field without central schema approval.

No new currency, item, quality tier, freshness field, transaction model, inventory model, or save model is introduced here.
