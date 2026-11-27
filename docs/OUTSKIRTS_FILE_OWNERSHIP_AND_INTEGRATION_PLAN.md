# AIMORPG OUTSKIRTS — FILE OWNERSHIP AND INTEGRATION PLAN
## Draft v0.1
**Status:** PHASE 1 PROPOSAL — CENTRAL REVIEW REQUIRED

## 1. Ownership principle
One shared file has one accountable owner for a given change set. Multiple districts may propose changes, but must not make competing edits to shared files in parallel.

Central Meta-GPT owns shared contracts and arbitrates shared-file changes.

## 2. Proposed ownership matrix

| File / subsystem | Single accountable owner | District contribution |
|---|---|---|
| src/lib/types.ts | Central Meta-GPT / Shared Types Owner | typed change proposals only |
| src/lib/content.ts | Central Meta-GPT / Content Integrator | NPC/item/quest content proposals; central integration |
| src/lib/itemSystem.ts | Central Meta-GPT / Item Systems Owner | recipe/item-rule proposals |
| src/lib/rewardEconomy.ts | Central Meta-GPT / Economy Owner | reward/cost proposals |
| src/lib/rules.ts | Central Meta-GPT / Gameplay Rules Owner | modifier requirements |
| src/lib/store.ts | Central Meta-GPT / Runtime State Owner | isolated domain modules; central wiring/persistence |
| src/lib/simulation.ts | Central Meta-GPT / Simulation Owner | relationship/identity/memory requests |
| src/lib/narrative.ts | Central Meta-GPT / Narrative Runtime Owner | content blueprints/event requests |
| src/lib/eye.ts | Central Meta-GPT / Eye Canon Owner | Old Edge submits observation proposals only |
| src/lib/worldTime.ts | Central Meta-GPT / World Clock Owner | districts consume clock; no local clock |
| src/lib/mainQuestAudit.ts | Central Meta-GPT / Main Quest Canon Owner | no edits without explicit approval |
| src/components/GameClient.tsx | Central Meta-GPT / UI Integration Owner | district components/specs; central integration |
| src/app/globals.css | Central Meta-GPT / Design System Owner | design token/component requests |
| package.json | Central Meta-GPT / Build Owner | dependency/script requests |
| scripts/* | Central Meta-GPT / QA Owner | district test cases; central runner integration |
| docs/OUTSKIRTS_*.md | Central Meta-GPT | shared docs centrally maintained; district specs authored by district owner |

These are proposed accountable roles; the Central Meta-GPT must confirm named human/agent owners before implementation.

## 3. Proposed district module boundaries
Not approved for file creation:
- Gate City: src/lib/gateCity/, src/components/gateCity/
- Workshop: src/lib/workshop/, src/components/workshop/
- Old Market: src/lib/oldMarket/, src/components/oldMarket/
- Red Streets: src/lib/redStreets/, src/components/redStreets/
- Watch: src/lib/watchDistrict/, src/components/watchDistrict/
- Old Edge: src/lib/oldEdge/, src/components/oldEdge/

A district module may own local mechanics but only call approved shared interfaces.

## 4. Branch and merge policy
- Canonical baseline: main.
- Workshop candidate reviewed separately; not merged by this plan.
- Other district branches are not assumed to exist.
- PHASE 1 is specification only; no source implementation.
- No automatic merge.
- Shared files integrate sequentially under central review.
- Every PR declares shared-file impact and test evidence.

## 5. Integration sequence
1. Approve shared types and NPC action/result contract.
2. Approve item-instance, recipe and transaction contracts.
3. Approve progression, relationship and quest state contracts.
4. Approve persistence and server-authority strategy.
5. Approve isolated district module boundaries.
6. Implement isolated district mechanics.
7. Integrate through central runtime wiring.
8. Run regression tests across all districts and protected main quests.

## 6. Required shared-file change request
Each request must include:
- file and current source location
- exact proposed change
- reason and gameplay use
- compatibility impact
- districts affected
- migration needs
- tests
- accountable owner
- approval status

## 7. Workshop branch governance
workshop/phase-1-crafting-specialization remains an unmerged candidate. Its changes must be reviewed separately. If accepted later, central integrator ports or merges only approved scope after comparing against current main and evaluating regressions. It must not become the new canonical baseline without explicit approval.


---

# PHASE 2 TARGETED GAP CLOSURE — OLD MARKET OWNERSHIP BOUNDARIES

**Status:** DOCUMENTATION-ONLY CLARIFICATION · CENTRAL REVIEW REQUIRED  
**Baseline:** `main`, `2.0.0-alpha.26`  
**Branch:** `old-market/phase-1-specification`

## 1. Old Market source ownership

This Phase 2 source-verification addendum does not transfer ownership of shared runtime files to Developer 03.

| Source / subsystem | Accountable owner remains | Old Market contribution |
|---|---|---|
| `src/lib/content.ts` | Central Meta-GPT / Content Integrator | Verified item/NPC/function catalogue; propose itemIds only after approval |
| `src/lib/itemSystem.ts` | Central Meta-GPT / Item Systems Owner | Verified regional-pool membership; no local pool mutation |
| `src/lib/rules.ts` | Central Meta-GPT / Gameplay Rules Owner | Verified current price/resale formulas; no local formula |
| `src/lib/store.ts` | Central Meta-GPT / Runtime State Owner | Report Zora/Pell/Cador runtime defects; no local transaction handler |
| `src/lib/types.ts` | Central Meta-GPT / Shared Types Owner | Report missing document/manifest fields; no new type or evidence model |
| `src/lib/mainQuestAudit.ts` | Central Meta-GPT / Main Quest Canon Owner | Consume existing hooks only; no edits to the 60 main quests |
| Damar shipment/manifest domain | Damar/Gate City owner, then Central approval | Cador may request read-only published references; no Cador-owned shipment/custody model |
| Dain cargo/ship-log domain | Harbor owner, then Central approval | Provide cross-reference requirements only |
| `docs/OUTSKIRTS_*.md` | Central Meta-GPT maintains shared matrices | Old Market supplies source-backed amendments; central review retains final ownership |

## 2. Cador ↔ Damar future interface boundary

**VERIFIED alpha.26:** Damar is the Gate City warehouse keeper and `fn-damar` is `kind:"warehouse"`; its description covers opening or checking official cargo movement subject to permission. Dain's `fn-dain` is `kind:"cargo"` and describes comparing ship logs and cargo manifests. Neither function currently exposes a typed manifest/custody record through its authored function definition.

**PROPOSAL only:** if a future Damar shipment/manifest contract is approved, it remains Damar-owned. Cador may receive read-only references for ledger reconciliation (e.g. manifest reference, shipment reference, item ID, quantity, origin/destination, dispatch/arrival times, seal reference). Cador may not create a parallel manifest, shipment, custody, or evidence model and may not mutate Damar's authoritative shipment data.

Sources: [Damar NPC](../src/lib/content.ts#L277-L277), [Damar function](../src/lib/content.ts#L422-L425), [Dain function](../src/lib/content.ts#L453-L453), [Damar quest hook](../src/lib/mainQuestAudit.ts#L21-L28).

## 3. Ilren — BLOCKED, no ownership transfer

Ilren remains outside Developer 03's accepted Old Market scope. The mismatch is recorded only:

- `OUTSKIRTS_DISTRICTS.oldMarket.npcIds` includes `ilren`.
- NPC master data defines Ilren as `region:"market"`, `district:"exchangeSquare"`.
- No district relocation, Canon edit, item/function ownership change, or implementation plan is authorized.
- Project owner is the decision-maker; Central Meta-GPT records the decision before any district owner acts.

Sources: [Old Market district NPC list](../src/lib/content.ts#L410-L413), [Ilren master record](../src/lib/content.ts#L278-L278).

## 4. Change control

This branch contains documentation amendments only. No TypeScript, runtime, content, item, quest, save, or schema source is changed. No pull request is opened and no merge is performed. Central Meta-GPT review is required before the amended shared matrices become approved project policy.
