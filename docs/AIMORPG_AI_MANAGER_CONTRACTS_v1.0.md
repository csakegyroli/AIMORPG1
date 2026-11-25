# AIMORPG AI Manager Contracts v1.0

## AI Játékmester / Orchestrator
Role: coordinator only. It owns evaluation cadence, routes snapshots to managers, merges proposals, invokes validation gates and passes an approved Dynamic-layer action to runtime. It never writes Canon and never bypasses validators.

## Világfigyelő / A Szem
Existing authored Eye rules are the semantic contract. The AI Council formalizes them as the World Observer adapter. It reports observations about time, travel, memories, identity patterns, relationship pressure, NPC availability and player stall pressure. It does not choose outcomes.

## Történetmester
Consumes opportunities, Quest DNA, NPC backstory/motivation, relationship pressure, current main quest and recent events. It proposes story shapes and dialogue pressure. It cannot invent NPCs, items, regions or canon facts.

## Gazdaságmester
Consumes regional item catalogue, current material pressure, market demand inputs and player wealth/inventory bands. It proposes economic pressure and supply/demand opportunities. It cannot directly grant or remove currency, items or prices.

## Döntéshozó réteg
Ranks compatible proposals by priority x confidence, rejects conflicts, enforces per-tick limits and required validators, and creates a decision record. It preserves player agency and only prepares Dynamic-layer changes.

## Handoff contract
All future AI outputs must be structured JSON-like objects conforming to the project schemas. Any unknown NPC/item/region, Canon contradiction, invalid timeline, impossible relationship claim, or missing consequence plan is rejected before runtime.
