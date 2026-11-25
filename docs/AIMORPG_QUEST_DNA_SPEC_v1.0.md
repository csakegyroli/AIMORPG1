# AIMORPG — QUEST DNA SPECIFICATION v1.0

## Purpose

Quest DNA is the authored contract for every quest in AIMORPG. It does not generate quests. It makes every quest legible to the rest of the simulation stack.

A quest may have beautiful prose and still fail design review if it has no meaningful conflict, no relationship consequence, no memory value and no believable place in the canon.

## Required fields

| Field | Question it answers |
|---|---|
| `intent` | What kind of human problem is this? |
| `conflict` | What values or pressures collide? |
| `resolutionMode` | How may the player approach the problem? |
| `stakes` | What can meaningfully change? |
| `identitySignals` | What behaviour does this quest reinforce? |
| `relationshipSignals` | Which relationship patterns can move? |
| `worldMemoryTags` | What should survive in memory? |
| `consequenceHorizon` | What can echo immediately, later, or long-term? |
| `failForward` | Can the authored spine continue after failure? |
| `canonAnchors` | Which facts may never be contradicted? |
| `npcRole` | Why does this NPC own this story beat? |
| `regionRole` | Why does this belong in this place? |

## Design contract

Every main quest must:

1. teach or reveal something about the world;
2. belong naturally to its NPC and region;
3. create at least one durable state change or memory;
4. expose a meaningful choice or method of resolution;
5. preserve forward motion through fail-forward resolution;
6. use consequence instead of numerical reward as the primary narrative feedback;
7. leave enough deterministic state for the later Narrative Director to reason about.

## Resolution model

The current authored main quests expose three methods. Their numeric stat checks remain implementation details. The player sees the consequences, not the formula.

## Main vs side

**Main quest:** authored spine, shared across all players, region-scoped, canon-sensitive.

**Side quest:** later dynamic content, relationship- and world-sensitive, optional, generated from the Side Quest Framework under Narrative Director control.

## AI boundary

Quest DNA is available to the future AI Narrative Director as structured context. The Director may never override canonical quest facts, quest outcomes, or player decisions.
