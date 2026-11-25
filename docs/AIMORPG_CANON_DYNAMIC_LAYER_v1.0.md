# AIMORPG — CANON LAYER + DYNAMIC LAYER v1.0

## Canon Layer

The Canon Layer contains authored facts that are not to be silently rewritten:

- regions and districts;
- NPC identity, role, biography and motivation;
- the six main story arcs;
- the Black Coin premise;
- authored main quest structure;
- core world rules such as server time and map-first interaction.

The Canon Layer is read-only at runtime.

## Dynamic Layer

The Dynamic Layer contains state that may change during play:

- world flags;
- narrative events;
- NPC runtime overrides;
- discovered canon hints;
- future side-quest seeds;
- player-specific relationship and identity consequences.

Dynamic state may enrich canon but may not contradict it.

## State persistence

Dynamic events are retained as bounded historical data. This gives later systems a stable event stream without turning the save file into an unbounded log.

## Why two layers?

Without separation, generative systems eventually confuse "what happened to this player" with "what is true in the world".

AIMORPG deliberately prevents that.

> Canon defines the world. Dynamic state records what this player did inside it.
