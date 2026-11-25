# AIMORPG — AI NARRATIVE DIRECTOR RULES v1.0

## Status

**Dormant.** The Narrative Director is implemented as a deterministic rules engine and context builder. No generative AI is connected in this phase.

## Mission

The Director's future job is to decide **whether the world has a credible reason to offer optional narrative content right now** and, if so, identify the human problem that should receive attention.

It is not a chatbot and not the source of canon.

## Inputs

- Player Identity
- Relationship Facets
- World Memory
- NPC Runtime State
- Current region and district
- Active main quest
- Quest DNA
- Server time / day phase
- Regional access and world flags

## Outputs in this phase

The Director produces dormant, deterministic **hooks** only:

- relationship pressure;
- local problem pressure;
- night opportunity;
- world reaction;
- identity reflection.

A hook contains only:

- NPC
- region
- priority
- reason
- tags

No side quest text is generated.

## Decision hierarchy

1. Canon safety
2. Current world state
3. NPC motivation and state
4. Player relationship history
5. Player identity pattern
6. Time-of-day continuity
7. Main quest context
8. Optional content opportunity

## Hard prohibitions

The future AI may never:

- invent a new canonical NPC;
- invent a new region or district;
- contradict a known NPC biography;
- rewrite a completed main quest;
- force a main quest outcome;
- teleport or auto-complete the player;
- expose hidden relationship or identity scores;
- punish the player for being offline;
- generate a side quest solely because content is needed.

## Side quest admission rule

A side quest must have a **reason to exist now**. At least one of the following must be true:

- a meaningful relationship changed;
- an NPC has a pressing local problem;
- a night-time or schedule-specific opportunity exists;
- a remembered world event has produced a credible reaction;
- the player's behaviour creates a believable personal hook.

## Dormant implementation

The code evaluates these conditions and records hooks, but `mode = dormant` prevents any generated quest from entering the player's active quest state.

The AI connection is a future release gate after the item system, artwork, unique NPC functions and final content polish are complete.
