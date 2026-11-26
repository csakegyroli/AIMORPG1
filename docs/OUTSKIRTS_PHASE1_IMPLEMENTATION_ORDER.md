# AIMORPG OUTSKIRTS — PHASE 1 IMPLEMENTATION ORDER
## Draft v0.1
**Status:** PHASE 1 PLAN — NO IMPLEMENTATION AUTHORIZED

## 1. Phase 1 objective
Complete all gameplay specifications and shared architecture decisions before new code implementation. PHASE 1 does not authorize source-code implementation or automatic merging.

## 2. Recommended sequence

### Stage 1 — Shared architecture decisions
1. NPC action/result contract.
2. Item definition vs item instance.
3. Transaction and inventory atomicity.
4. Crafting/recipe data contract.
5. Durability/repair decision.
6. +1..+9 enhancement decision.
7. Global economy/reward approval process.
8. Profession mastery vs character XP.
9. Side quest and relationship integration.
10. Minigame state and replay safety.
11. Save migration policy.
12. Server-authoritative operation strategy.
13. A Szem scope and event contract.
14. Canon and Ilren unresolved issue register.

### Stage 2 — District specifications in parallel
- Kapuváros: five NPC specs.
- Műhelynegyed: four NPC specs and existing branch candidate review.
- Régi Piac: three NPC specs; Ilren discrepancy separately.
- Vörös Utcák: five NPC specs.
- Őrségi Negyed: four NPC specs plus 60-main-quest protection.
- Régi Perem: three NPC specs plus A Szem safeguards.

### Stage 3 — Cross-district alignment
Review all loops and ensure one owner per shared mechanic. Remove duplicated recipe, quality, access, evidence, relationship, reward and state models.

### Stage 4 — Consolidation
Central Meta-GPT records:
- approved/rejected proposals
- open questions
- file owners
- dependencies
- test acceptance criteria

### Stage 5 — PHASE 1 gate
Present all six district specs and six shared documents. Obtain explicit project-owner approval before PHASE 2 / implementation.

## 3. First narrow implementation package — recommendation
Package A (proposal, not authorized):
- confirm shared NPC action/result contract
- confirm transaction validation and duplicate-action prevention
- review the Workshop candidate; do not merge automatically
- add no durability, enhancement, repair or progression until their contracts are approved
- do not alter global rarity or economy

Whether Package A is suitable must be decided after Phase 1 acceptance and owner approval.

## 4. PHASE 1 acceptance criteria
1. All 24 NPCs have individual implementable specifications.
2. Every NPC's current function and runtime status have source evidence.
3. All six district specifications are consistent.
4. Shared architecture defines one source of truth for items, instances, economy, rarity, recipes, progression, relationships, quests, minigames and saves.
5. One accountable owner is assigned per shared file.
6. Cross-district dependencies have owners and interface proposals.
7. Ilren discrepancy is recorded and not silently resolved.
8. Workshop branch is reviewed, scoped and accepted/rejected/deferred; never merged by default.
9. 60 main quests and NPC Canon protections are explicit and testable.
10. A Szem observation role and AI scope remain limited.
11. Critical data-model decisions are exposed.
12. Each system has test acceptance cases.
13. No implementation occurs before owner approval.

## 5. PHASE 2 entry criteria
Project owner approval must explicitly identify:
- accepted architecture decisions
- accepted district specifications
- first implementation package authorized
- branch and accountable implementer
- shared files permitted to change

Without that authorization, remain in specification/review mode.
