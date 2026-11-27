# AIMORPG PHASE 2 — GATE CITY / ALMA VARG
## First serial NPC vertical slice — owner-authorized execution

**Canonical code baseline:** `main` (AIMORPG v2.0.0-alpha.26 code)
**Working branch:** `gate-city/phase-2-alma`
**Execution mode:** one NPC at a time; Gate City is the active district.
**Scope:** Alma Varg (`alma`, `fn-alma`) only.

## Why Alma is first
The alpha.26 source already defines `fn-alma` as `kind: "inn"`, with a 60 gold rest service and the existing food items `heartyStew` and `gateRations`. Unlike Damar's warehouse proposal and Petar's transport proposal, Alma already has a dedicated `inn` runtime branch in `src/lib/store.ts`. This makes Alma the lowest-dependency first vertical slice without inventing a new shared logistics or evidence model.

This is a sequencing decision, not a Canon change. Damar remains the first Gate City specification task and next NPC in the Gate City queue unless the owner changes order; Alma is the first implementation slice because its runtime contract is already present.

## Protected baseline and constraints
- Do not change the 60 main quests, NPC identity/Canon, region routing, global economy, item registry, rarity, relationship model, or A Szem behavior.
- Do not add a local currency, local reputation, profession mastery, item-instance fields, or a new save-state model.
- Preserve the current save key/version and all legacy migrations unless a separately approved shared change is requested.
- No forced real-time wait, daily mandatory loop, energy system, or Pay-to-Win.
- Do not alter existing authored rest or food effects without evidence and explicit owner approval.
- Do not edit shared files outside the narrow approved Alma runtime/UI/test integration required by this slice. Any shared-contract change must be raised, not silently implemented.
- No merge to `main` without owner review and approval.

## Required work sequence
1. Read the full Alma NPC and function definitions, UI interaction path, `inn` handler, item effects, save normalization, and related tests from the current `main` baseline.
2. Write a concise implementation plan listing exact files to touch, current behavior, gaps, and regression tests. Do not start broad refactors.
3. Implement Alma as one coherent playable service using the existing shared systems:
   - explicit rest option and food purchase option;
   - clear price/effect preview before confirmation;
   - correct HP cap and no charge when rest cannot provide healing;
   - validate food against Alma's existing `itemIds`;
   - reject insufficient gold and full inventory without partial mutation;
   - prevent double submission / duplicate purchase where the current UI path allows it;
   - clear success, failure, and cancel feedback;
   - preserve the original item effects and rest rule.
4. Add or update focused automated tests for success, full HP, partial HP, HP cap, insufficient funds, full inventory, valid/invalid food ID, duplicate action, cancellation, reload/save compatibility, and protected quest/item invariants.
5. Run the repository's actual test, lint and build commands where available. Report exact commands and outcomes; do not claim unrun checks passed.
6. Update the Gate City specification with verified implementation references and mark Alma only as implemented / pending central review. Do not mark accepted until owner review.
7. Stop. Do not begin Damar or another NPC until Alma's PR/diff has been reviewed.

## Deliverables
- One isolated, reviewable Alma Varg vertical slice.
- Focused tests and exact test report.
- A short source map identifying the runtime/UI/persistence paths used.
- A pull request to `main` (prefer draft until checks are complete), with no unrelated files.

## Explicitly out of scope
- Damar cargo manifests, warehouse ledger, evidence chain.
- Petar route/delivery state or item custody.
- Vera evidence/coin-authentication model.
- Jarek persistent discovery/map model.
- Shared NPC action/result contract redesign.
- Server-authoritative architecture project.
- Any global save schema change.

## Completion report format
1. Files changed and why.
2. Player-facing before/after behavior.
3. Tests added and exact commands/results.
4. Save compatibility and exploit checks.
5. Remaining gaps / central decisions.
6. PR URL and merge status (must remain unmerged).


## Alma Varg — implementation closure notes (owner review)

### Runtime contract
- The canonical rest target is exactly `rest`. The store rejects `hours:1`, `1`, undefined and any unknown rest target.
- No rest target or pending inn transaction is persisted in save v6. No migration was added.
- The rest plan charges 60 gold and restores `ceil(10% of max HP)`, capped at the calculated maximum. If HP is already full/above max, no rest transaction is applied.
- Food purchase is limited to existing `fn-alma.itemIds`, and each ID must resolve to an existing consumable with a finite, non-negative price. The store and UI both enforce that allow-list.
- `heartyStew` and `gateRations` definitions/effects remain unchanged.

### Transaction identity and protection
- Each UI submission receives a unique ID composed of the Alma NPC ID, function ID, local timestamp and random suffix.
- The store reserves that ID before queueing the functional state update. A repeated ID+target is rejected as duplicate; reuse of the same ID with another target is rejected as a collision.
- The bounded receipt map stores at most 256 recent IDs in client memory. It is lost on reload and old entries can be evicted; it is not persistent idempotency and is not server-side security.
- The existing functional store update evaluates gold, health and inventory from the latest state. The completion callback returns the resolved action result once, and the UI keeps its lock until that result is delivered rather than using a fixed delay.

### HP parity and cancellation
- The UI preview and store action both call the exported `getMaxHealth` calculation. It includes current equipment and active temporary stat/item buffs.
- Cancel resets pending/lock/selection before submission and performs no store mutation. The control is disabled while a submitted transaction is pending; a submitted or committed store action cannot be rolled back.

### Test scope
- `scripts/alma-inn-smoke.cjs` dynamically exercises the pure rest/purchase planners and the bounded transaction-ID guard.
- Its static contract checks verify store/UI wiring, canonical target, save key/version and the 60 main quests.
- React DOM click dispatch and the full React hook lifecycle are not dynamically tested because this repository has no configured component renderer or DOM test framework.
