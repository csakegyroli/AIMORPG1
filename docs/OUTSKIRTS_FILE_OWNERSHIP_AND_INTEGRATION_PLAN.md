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
