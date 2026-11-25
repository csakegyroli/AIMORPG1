# AIMORPG AI Council Architecture v1.0

## Purpose
This is the dormant, deterministic foundation for the future AI layer. It contains no model/API calls.

```text
                        AI JÁTÉKMESTER
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
     Világfigyelő       Történetmester     Gazdaságmester
            │                 │                 │
            └─────────────────┼─────────────────┘
                              │
                    Döntéshozó réteg
                              │
          Küldetések • NPC-k • Eventek • Régiók
```

## World Observer / A Szem
The Eye remains an authored observation layer. In v1.0 it is formalized as the World Observer contract: snapshots are produced from player identity, relationships, memory, NPC state, time and active main quest. It never chooses outcomes, writes Canon or forces the player.

## Story Master
Consumes deterministic opportunities, dialogue pressure, current story position and runtime side-quest state. Produces ranked story proposals, not final quests. The future AI may turn a proposal into a structured SideQuestBlueprint.

## Economy Master
Observes regional item supply, player material pressure, market demand inputs and wealth band. It cannot grant currency/items or mutate the economy by itself. It produces pressure signals only.

## Decision Layer
Combines proposals, validates hard constraints and selects a small compatible queue. It does not override player agency and cannot write Canon.

## AI Játékmester / Orchestrator
The future model-facing layer. It will call the managers, provide world snapshots, request structured outputs, validate them, and pass only approved Dynamic-layer mutations to runtime. AI is disabled in v1.0.

## Hard invariants
1. Canon is read-only to AI.
2. All AI output is structured before runtime execution.
3. Item/NPC/region references must exist.
4. NPC availability and timeline must be valid.
5. Relationship claims must match current facets.
6. Every proposed story must have a consequence plan.
7. No more than one new AI side quest and one new world event may be approved per evaluation tick.
8. AI may never teleport, delete player progress, or undo a player decision.
