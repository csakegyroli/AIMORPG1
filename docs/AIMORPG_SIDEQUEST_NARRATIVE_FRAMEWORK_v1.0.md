# AIMORPG — Side Quest / NPC Dialogue / World Event Framework v1.0

## Core law
The game stores narrative ingredients and world state, not a catalog of prewritten side quests. The future AI recombines current state into new Dynamic stories.

## Pipeline
1. World snapshot
2. Opportunity detection
3. NPC motivation check
4. Player context check
5. Story shape selection (micro/local/character_arc)
6. Dynamic quest draft
7. Canon validation
8. Runtime validation
9. Consequence + memory registration

## Narrative primitives
- Intents: investigate, retrieve, protect, deliver, negotiate, confront, escort, discover, prove
- Conflicts: truth_vs_access, duty_vs_opportunity, honor_vs_gain, order_vs_freedom, trust_vs_suspicion, knowledge_vs_safety, risk_vs_security, loyalty_vs_autonomy
- Choice methods: conversation, trade, craft, investigation, combat, stealth, service, risk
- Consequences: relationship, memory, npc_state, world_flag, reward
- Scales: micro, local, character_arc

## Opportunity sources
- Relationship pressure: trust, debt, suspicion, affection, fear, respect
- Local problems: shortages, unresolved incidents, service bottlenecks, district tensions
- Night opportunities: only when night-capable NPCs are present and the world clock makes them relevant
- World reactions: important memories or dynamic events returning in new form
- Identity reflections: recurring player behavior creating a thematically coherent local opportunity

## Dialogue framework
NPC dialogue is contextual, not chatbot. It is derived from:
- NPC canon identity and discovered backstory level
- current location and schedule
- relationship facets
- runtime state
- player identity
- recent memory tags
- active main quest

## World event framework
World events are candidates, not automatic reality. The runtime must validate time, participants, locations and consequences before activation.

## AI boundaries
AI is deliberately dormant. When enabled later, it may write only Dynamic content and must use existing canon entities. It may not invent NPCs, items, districts, main quest outcomes, or new canon history without an explicit authored migration.

## Infinite-combination principle
The future system generates from changing state + primitives + existing assets. It does not select from 100 prewritten stories. Uniqueness comes from recombination of NPC motive, player identity, relationship state, world memory, time, location, items, and consequence planning.
