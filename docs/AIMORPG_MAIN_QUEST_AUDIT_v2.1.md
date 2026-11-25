# AIMORPG — Main Quest Audit v2.1

## Core rule
A main quest can never be completed by choosing a dialogue branch alone when its objective requires a physical resource or world condition. The objective must exist in the player's state and be verifiably satisfied.

## Quest loop
1. NPC gives the objective.
2. Player leaves and acts in the world.
3. Required items/conditions accumulate in the inventory/world state.
4. NPC becomes the next interaction gate.
5. Only after requirements are satisfied does the resolution scene unlock.
6. The player chooses among five contextual approaches.
7. The choice modifies identity, relationships, memory, reputation and future access.

## Resource requirements
The first audited exemplar is `main_outskirts_04 — Húsz vas`: 20 Műhelyvas must physically exist in inventory. Completing the quest consumes those 20 units.

The remaining 59 quests now receive a tangible objective layer tied to their region: materials, documents, evidence, trade goods, tools, or story objects. Counts grow with regional progression so the player cannot rush through later chapters without building capacity.

## Dramaturgy
Every quest carries: hook, twist, reveal, consequence, and fail-forward. Five resolution approaches replace the former three generic choices. A failed approach does not erase the objective or skip the required world interaction; it changes the consequence and records the failure.
