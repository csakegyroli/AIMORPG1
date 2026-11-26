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
