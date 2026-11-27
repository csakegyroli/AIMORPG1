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

1. Server-authority architecture details and risk-tier implementation boundary (the owner-approved risk-tiered rule is recorded in §16).
2. Shared item-instance schema and migration plan.
3. Durability/repair model.
4. +1–+9 formula, probabilities and failure outcomes.
5. Shared professional mastery contract.
6. Recipe schema and cross-district contract.
7. Transaction/idempotency details: canonical ID format/scope, same-key/different-payload behavior, retention and result-history ownership (the hybrid direction is approved in §16).
8. Persistent minigame session policy.
9. Cross-district access/permission contract.
10. A Szem observation extension policy.
11. Ilren region/district discrepancy.
12. Ownership of each shared file and merge order.

## 15. Phase gate

This is PHASE 1 draft only. It authorizes no code changes, merges, save migration, Canon changes, probability tables or economy changes. Proceed only after explicit owner approval.


---

## 16. PHASE 2 — owner-approved central architecture decisions

**Decision status:** OWNER-APPROVED  
**Decision baseline:** AIMORPG v2.0.0-alpha.26  
**Approval:** Project owner, 2026-11-27  
**Scope:** These decisions are binding inputs for all six district specification branches. They authorize documentation and source-verification updates, not automatic implementation, merge, or Canon changes.

### ADR-P2-001 — NPC transaction and idempotency: HYBRID

**Approved rule**
- Initial single-player demo work may use client-side business-logic transaction protection.
- Every state-changing NPC transaction must have an explicit stable transaction identifier and duplicate-execution protection.
- Client-side protection is an application-integrity/replay guard only. It is not server security and must never be represented as such.
- The future server-authority transition contract must be documented now: request identity, validation, authoritative resolution, atomic state/economy mutation, durable result record, retry behavior, and duplicate-key response.
- The server migration must preserve the same business operation identity where practical; client-generated identifiers are correlation/idempotency inputs, not proof of authorization.

**Still open:** canonical transaction ID format/scope and retention; behavior for same key with different payload; conflict/retry policy; transaction history location; exact shared API boundary. These are not silently decided by this ADR.

### ADR-P2-002 — Damar shipment: MODEL A

**Approved rule**
- Use one domain-specific Shipment aggregate as the authoritative current shipment state.
- Use a Shipment-scoped custody event log to record handoff, receipt, inspection, hold, acceptance and rejection history.
- This is not a general event bus or universal event-sourcing framework.
- Reuse the existing item and inventory model. Shipment lines reference existing item instances and quantities; no parallel cargo inventory, item registry or generic warehouse stock system.
- Shipment aggregate state and its custody history must remain internally consistent.

### ADR-P2-003 — Partial receipt: ITEM/LINE LEVEL

**Approved rule**
- Each shipment line can be received, rejected or held independently.
- Quantities and line-level outcomes must be explicit and reconcilable.
- Aggregate shipment status is derived from its line outcomes and custody state; acceptance of one line does not imply acceptance of the whole shipment.
- Reuse existing item-instance/inventory contracts. No duplicated item ownership or silent item cloning.

**Still open:** exact quantity semantics where the current item model represents unique instances; whether a line can be split across accepted/rejected quantities; custody transfer timing for each outcome. Specify only after source verification and present unresolved choices for owner approval.

### ADR-P2-004 — Transaction authority: RISK-TIERED

**Approved rule**
- The initial single-player demo may remain client-side for ordinary, low-risk NPC interactions, provided the approved client-side transaction ID and duplicate-execution contract is followed.
- Before release as a trusted economic transaction, server-side authority is mandatory for high-value, chance-based, competitive, or future multiplayer-affecting transactions.
- Client-only results for those categories are demo/practice outcomes, not trusted settlement.
- Havel's card-game economy and Brenka's odds/betting settlement must be treated explicitly under this boundary. Their rulesets may be specified independently, but actual trusted economic settlement is blocked until a server-authoritative resolver and ledger/transaction contract exist.
- The server authority boundary must be documented in each relevant workpackage; do not make all single-player NPC services wait for a server rewrite.

**Still open:** numerical/qualitative definition of high value; competitive classification; server service architecture, persistence/ledger ownership, RNG trust model, auditability and operational deployment. No server implementation is authorized by this decision alone.

### ADR-P2-005 — Save/migration: PER-NEW-PERSISTENT-DOMAIN-STATE

**Approved rule**
- Before introducing each new persistent domain state, prepare a separate versioned migration plan for that state.
- Each plan must document old-save compatibility, defaults/normalization, malformed-data handling, migration idempotency, fixtures and tests, rollback/recovery and release conditions.
- Existing saves must remain backward compatible.
- This does not authorize or require a general save-system redesign.
- No district may independently change the global save key/version or add persistent fields without the applicable migration plan and explicit implementation approval.

### 16.1 Cross-district application

| District | Required application of approved decisions |
|---|---|
| Gate City | Damar uses Shipment aggregate + scoped custody log + line-level receipt; Alma remains under its separate owner-acceptance gate; Petar/Vera/Jarek continue independent source/specification work with shared dependencies marked accurately. |
| Workshop | Existing crafting/service flows specify client-side transaction IDs and duplicate protection for the demo; durability, recipe and mastery decisions remain open; no parallel inventory. |
| Old Market | Zora/Cador/Pell service and document flows apply transaction protection; trade/economy remains shared; unresolved item IDs/prices and Ilren questions remain open. |
| Red Streets | Havel ruleset and Brenka odds model can be specified separately; no trusted real-money/gold settlement for chance-based or competitive play without server authority. |
| Watch District | Evidence/case specifications may progress independently; any shipment reference uses Damar's Shipment ID and scoped custody history, not a parallel evidence event bus. |
| Old Edge | Eldra/Siven/Maela and Eye work continue independently; any new persistent expedition/discovery state requires its own versioned migration plan; Eye remains observation-only. |

### 16.2 Remaining central decisions — NOT APPROVED BY ADR-P2-001..005

The following remain open; the five approvals do not close them:

1. Canonical transaction identifier format, scope, collision handling, payload mismatch behavior, retention and transaction-result history.
2. Exact threshold/rule for classifying a transaction as high-value or competitive.
3. Server-authority architecture, trusted RNG, durable settlement/ledger, audit and retry contracts for Havel/Brenka and later multiplayer transactions.
4. Shipment line quantity semantics, partial-quantity splitting, item-instance custody transfer and terminal-state rules.
5. Shared item-instance extension/schema and its migration, if any.
6. Durability/condition and repair model.
7. +1–+9 enhancement probabilities, costs, protection and failure consequences.
8. Shared professional mastery contract.
9. Canonical recipe schema and cross-district crafting contract.
10. Persistent minigame session ownership, save/recovery and replay policy.
11. Cross-district access/permission and document/evidence provenance contract.
12. A Szem observation extension policy and any new event/output schema.
13. Ilren region/district discrepancy.
14. Shared-file ownership, integration order and merge authority.
15. Havel/Brenka practice-mode disclosure, economic balance limits and the eventual server-settlement release gate.

### 16.3 Governance and implementation gate

- District developers may continue independent specification and source-verification work against alpha.26.
- Shared decisions above must be consumed as approved constraints, not reopened as generic pending questions.
- Remaining open questions must be listed separately and must not block unrelated local specification work.
- No automatic merge, no cross-branch cherry-pick, no unapproved source implementation.
- Preserve Canon, all 60 main quest nodes and existing item/inventory structures.
- Gate City implementation order remains: Alma owner acceptance first; only then may the next NPC implementation be separately authorized. Damar specification work may continue now.
- This register records decisions; it does not itself authorize code changes.
