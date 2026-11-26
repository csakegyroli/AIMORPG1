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
