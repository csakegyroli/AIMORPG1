# AIMORPG — Player-Facing Narrative Runtime v1.0

## Side quest flow
Narrative Opportunity → offered runtime side quest → player sees it in Küldetések → accept/decline → relationship + memory consequence → optional tracking → world play.

The side-quest layer is distinct from the main quest spine. It may enrich the current region, deepen an NPC, react to memories, or surface during night cycles. It must never auto-complete a main quest or teleport the player.

## NPC dialogue flow
Map NPC → Megszólítom → deterministic dialogue context → available topics → player picks a topic → dialogue turn recorded → relationship/world memory changes.

Topic depth remains governed by relationship and discovery level. The dialogue layer is not a chatbot.

## World event flow
Deterministic event candidate → runtime event → Overview world-news banner → A Szem observation context → event expiry/resolution.

Canon world events are authored separately and are never invented by the AI runtime. Dynamic local/regional events are not canon changes.

## AI boundary
The current runtime provides the player-facing execution surface. Future AI output must remain structured and pass Canon/NPC/World/Item/Relationship/Timeline/Consequence validation before entering runtime.

## Canon server events
Server-scale events are authored manually in `CANON_SERVER_WORLD_EVENTS`. They are not produced by the opportunity engine and are not writable by the future AI. Examples include season openings/closings, royal celebrations, region unlock milestones and new canonical character introductions.

## Dynamic events
The current runtime may surface local/regional dynamic events such as night activity, consequences of previous player actions, or relationship pressure. These are explicitly non-canon and temporary.
