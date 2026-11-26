# AIMORPG OUTSKIRTS — PHASE 1 SHARED ARCHITECTURE
## Draft v0.1 — Central Meta-GPT coordination
**Baseline:** v2.0.0-alpha.26  
**Repository:** csakegyroli/AIMORPG1  
**Status:** PHASE 1 SPECIFICATION — NOT APPROVED FOR IMPLEMENTATION

## 1. Governance and evidence

This document defines the shared contracts required by the six district developers. It is a coordination specification, not an implementation authorization.

Authority order:
1. Existing AIMORPG Canon and protected main quest content.
2. Central Meta-GPT decisions.
3. Approved shared architecture.
4. District-specific specifications.
5. Local UI and implementation details.

Evidence labels:
- VERIFIED: confirmed in alpha.26 source inspected for this coordination pass.
- BRANCH CANDIDATE: present on a non-main branch and not merged.
- PROPOSAL: recommended design requiring review.
- OPEN DECISION: not settled until Central Meta-GPT approval.

## 2. Verified alpha.26 architecture snapshot

| Concern | Existing source | Verified facts |
|---|---|---|
| Content/NPC/item/quest definitions | src/lib/content.ts | Defines NPCS, NPC_FUNCTIONS, ITEMS, quests, districts and NPC stories |
| Shared types | src/lib/types.ts | InventoryItem currently has instanceId and itemId; NPC function types exist |
| Runtime and persistence | src/lib/store.ts | Client-side React store; save key aimorpg-final-demo-v1-29; payload saveVersion 6 |
| Item rules | src/lib/itemSystem.ts | Categories, legality, regional pools, recipe helpers, dismantle helpers |
| Economy/rewards | src/lib/rewardEconomy.ts | Rarity profiles, loot tables, reward budgets and rolls |
| NPC relationships/identity/memory | src/lib/simulation.ts | Relationship facets, player identity, NPC runtime, world memories |
| Narrative/side quests/dialogue | src/lib/narrative.ts | Side quest and dialogue runtime |
| World clock | src/lib/worldTime.ts | 12 real hours = 1 in-world day |
| The Eye | src/lib/eye.ts | Authored observation layer; does not choose outcomes |
| Main quest integrity | src/lib/mainQuestAudit.ts | Audit references for 60 main quests and NPC hooks |
| UI | src/components/GameClient.tsx | Main client and NPC presentation/runtime integration |

**Critical limitation:** the store is client-side. No server-authoritative crafting, enhancement, betting, card-game or expedition outcome endpoint was verified in this source review. Do not describe client-side validation as server authority.

## 3. Shared NPC function contract

### 3.1 Current baseline
NPC functions are configured through NPC_FUNCTIONS and NpcFunctionDefinition. The current type contains identifier, NPC ID, title, description, kind, action label, and optional cost/region/item/stat metadata. Runtime behavior is handled through store NPC action logic. Several different kinds currently share generic handlers.

A configured NPC function is not proof of a unique playable mechanic.

### 3.2 Proposed standard action contract
Every specialized NPC action must document:
- actionId: stable unique action identifier
- npcId: existing canonical NPC ID
- kind: existing or centrally approved category
- preconditions: region, presence, access, items, stats, state
- inputs: typed player choices and referenced instance IDs
- costs: shared currency/material debits
- resolution: deterministic rules or explicitly injected RNG
- result: success / partial / failure with reason code
- effects: item/currency/state/relationship/narrative deltas
- history: auditable result where needed
- idempotency: duplicate-submission protection
- uiFeedback: preview, confirmation, result and recovery message

This is a proposed domain contract, not a claim that these fields exist in alpha.26.

### 3.3 Runtime requirements
1. Validate NPC ID, current region, access and presence.
2. Validate each item instance against current state.
3. Validate funds and quantities before mutation.
4. Resolve the action once.
5. Apply related changes atomically.
6. Return an explicit outcome; never report success before the operation succeeds.
7. Prevent replay/double-submit for stateful activities.
8. Persist only approved state.
9. Record meaningful results in existing journal/memory/narrative systems where justified.
10. Do not grant generic rewards simply for opening a menu.

### 3.4 Proposed result envelope
```ts
type NpcActionOutcome =
  | { status: "success"; code: string; message: string; effects: NpcActionEffect[] }
  | { status: "partial"; code: string; message: string; effects: NpcActionEffect[] }
  | { status: "failure"; code: string; message: string; effects: NpcActionEffect[] };
```
Central decision: exact type location, error taxonomy, and whether existing return types are extended or adapted.

## 4. Item definitions and unique item instances

### 4.1 Verified current model
- Global item definitions are authored in content modules.
- InventoryItem currently contains instanceId and itemId.
- Inventory and equipment refer to item instances.
- Item definitions contain shared attributes such as category, rarity, base price, stats, regions, legality and effects.

### 4.2 Non-negotiable separation
- ItemDefinition describes the canonical item template.
- An item instance represents one owned object.
- Per-instance enhancement, durability, provenance or history must never mutate the global template.
- No district may create a second item registry or inventory.

### 4.3 Proposed instance extension
Consider optional versioned instance data:
- enhancement level (0–9)
- durability/condition only after approval
- provenance/crafter where needed
- per-instance history only when required
- schema version for safe migration

Do not finalize field names/defaults until save migration and server authority are designed.

### 4.4 Quest/evidence protection
Story-bound, quest-only, evidence and unique relic objects must preserve their trade/consume/duplicate restrictions. District actions must not fabricate or sell protected objects.

## 5. Crafting, dismantling, repair and enhancement

### 5.1 Existing functionality
itemSystem.ts provides craftRecipeForItem(), dismantleYieldsForItem(), item category/legal status helpers and regional item-pool/market helpers. The store already has generic forge/craft/dismantle execution.

### 5.2 Shared crafting contract proposal
A recipe must define:
- stable recipe ID
- output item ID and quantity
- input item IDs and quantities
- responsible profession/NPC
- unlock/knowledge preconditions
- required station/tools if applicable
- operation costs
- difficulty/quality rules if approved
- failure/cancellation behavior
- test cases

Districts may author recipe content within approved item IDs and recipe interfaces. Shared recipe schema owner: Central Meta-GPT / designated shared-systems owner.

### 5.3 Dismantling
- Input must be a real owned instance.
- Protected items must be rejected.
- Yield calculation must be explicit and tested.
- No repeated instance processing.
- Inventory/output updates must be atomic.

### 5.4 Repair
No general durable item condition model was verified in alpha.26. Repair cannot be fully specified as an existing mechanic until durability is approved or added.
Open decision: no durability versus a centrally shared condition scale; repair material costs; condition effects; repair caps; compatibility with starter and quest gear.

### 5.5 +1–+9 enhancement
Enhancement state belongs to an item instance. No permanent +1–+9 model was verified in alpha.26.

Before implementation, Central Meta-GPT must approve:
- equipment eligibility
- exact per-level probabilities
- failure consequences
- material and gold costs
- protection mechanics
- stat scaling and caps
- resale value impact
- UI disclosure
- authoritative resolution architecture
- migration/backward compatibility

No probability table is canonical until approved. No district may independently invent enhancement rules.

## 6. Gold, diamonds, trade, sales and rewards

### 6.1 Global authority
rewardEconomy.ts is the global reward/economic model. Gold and diamonds remain shared currencies. Market pricing and selling rules remain shared.

### 6.2 District responsibilities
Districts may design service offers, authored transaction choices, local availability proposals, activity costs, reward proposals and economic sinks.

They may not independently change currency definitions, item price formulas, global rarity multipliers, reward budgets/scalars, global drop tables, or material currency sources/sinks.

### 6.3 Transaction rules
- Show price/stake/cost and potential payout before confirmation.
- Validate current funds and item ownership at resolution.
- Apply debit/credit and inventory changes atomically.
- Prevent duplicate settlement and replay.
- No hidden fees.
- No unlimited guaranteed-profit loop.
- No Pay-to-Win.

### 6.4 Reward proposal requirements
Every repeatable or rare reward proposal documents source, expected frequency, maximum/average output, gold/diamond flow, item rarity, repeatability, exploit risks and alternative routes.

## 7. Rarity and reward framework

Existing rarity values:
- Közönséges
- Ritka
- Különleges
- Legendás

The shared rarity economy stays centrally owned. District content references these values; it does not redefine them.

Rare rewards should primarily require performance, preparation, evidence, strategy or discovery. Randomness may add controlled variety but must not replace player skill.

## 8. Professional and character progression

Global character level, XP, development points and stats remain centralized.

Districts may propose local mastery tracks if they:
- do not replace or duplicate global XP
- do not introduce unapproved currencies
- unlock meaningful options rather than only passive numerical inflation
- allow multiple viable advancement routes
- preserve old saves
- avoid daily mandatory activity or forced real-time waiting

Open decision: common mastery contract versus district-specific records behind one shared progression interface.

## 9. Side quests, relationships and world state

Use existing relationship facets, NPC runtime and player identity in simulation.ts. No parallel relationship meters.

Use narrative.ts side quest runtime. Preserve gates, limits, cooldowns, expiry, decline/failure/completion tracking. No district may independently enable a disabled generation gate.

All 60 main quest nodes and existing NPC function hooks remain unchanged. Optional district progression cannot become a main quest prerequisite.

## 10. Minigame state model

Each minigame must define:
- session ID and ruleset version
- initial/current state
- phase/turn
- legal actions
- player choices
- opponent/environment policy
- deterministic resolver and controlled RNG where applicable
- terminal state
- costs/stakes
- rewards
- replay/idempotency rules
- interruption/recovery
- save policy

A minigame is not accepted if its outcome is determined by a single unexplained random click. Economic or competitive outcomes need authoritative resolution. Current client-side store is not evidence of server authority.

## 11. Save compatibility

Verified baseline:
- save key aimorpg-final-demo-v1-29
- payload version 6
- legacy save keys and migration/sanitization exist in store.ts

Rules:
1. Do not change key/version in district branches independently.
2. Every persistent addition needs a migration/default strategy.
3. Old saves must load safely.
4. Malformed data must be sanitized.
5. Missing new fields must receive safe defaults.
6. Migration must be idempotent.
7. No quest/evidence item loss.
8. Provide fixture tests for current and legacy payloads.
9. Save schema changes are centrally owned.

## 12. Cross-district integration

- Gate City: Damar, Alma Varg, Petar, Vera Noll, Jarek.
- Workshop: Borin (garran), Velka, Nara, Tomen.
- Old Market: Zora, Cador, Pell.
- Red Streets: Miri, Havel, Brenka, Silas, Tosk.
- Watch: Rovan, Lena, Bran, Orren.
- Old Edge: Eldra, Siven, Maela.

Example loops:
- Gate City logistics ↔ Old Market supply and Watch shipment investigations.
- Workshop crafting ↔ Old Market ingredients ↔ Old Edge alchemy.
- Red Streets information ↔ Watch investigations ↔ Old Market documents.
- Old Edge discoveries ↔ Eye authored observations ↔ Watch evidence analysis.
- Gate City maps/routes ↔ Old Edge expeditions.

No district may change another district's Canon or runtime without approval.

## 13. A Szem safeguards

eye.ts establishes A Szem as an authored observation layer that does not choose outcomes. Preserve its Canon and limited AI scope.

A Szem may surface approved observations from known state. It must not become omniscient, an autonomous world-state editor, unrestricted dungeon master, decision authority, unapproved quest generator or unrestricted external AI/API client.

Every extension needs separate central approval with trigger, source data, exact output and Canon implications.

## 14. Open central decisions

1. Server-authoritative operation architecture.
2. Shared item-instance schema and migration plan.
3. Durability/repair model.
4. +1–+9 formula, probabilities and failure outcomes.
5. Shared professional mastery contract.
6. Recipe schema and cross-district contract.
7. Transaction/idempotency contract.
8. Persistent minigame session policy.
9. Cross-district access/permission contract.
10. A Szem observation extension policy.
11. Ilren region/district discrepancy.
12. Ownership of each shared file and merge order.

## 15. Phase gate

This is PHASE 1 draft only. It authorizes no code changes, merges, save migration, Canon changes, probability tables or economy changes. Proceed only after explicit owner approval.
