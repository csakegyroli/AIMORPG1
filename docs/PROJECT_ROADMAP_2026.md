# AImorpg: 2026 architecture and gameplay roadmap

## Product promise

**A living city first. A world next. Multiplayer later. AI throughout—but never allowed to erase player agency.**

AImorpg should feel like a dark-fantasy role-playing world rather than a list of menus. The city needs memory: NPCs remember what the player actually did, schedules and local needs shape where people gather, goods flow through districts, and choices create readable consequences. The AI can make those consequences more vivid, but only deterministic game rules can grant items, change stats, complete quests, spend currency, or alter canonical facts.

## Phase 0 — v2.0 alpha: Living City Foundation (current)

- Preserve the existing world bible and save compatibility.
- Add authored items and tag-driven equipment synergies.
- Add account/database boundaries and portable saves.
- Bring up the first server-side A Szem call with structured output and strict scope.
- Document security posture and remaining gaps.

**Exit criteria:** frontend smoke checks pass; a developer can build the app, run migration, register/login, create a cloud save, restore it, and request a bounded AI observation with a configured server key.

## Phase 1 — v2.1: Playable loop and content quality

1. Create one gold-standard 30–60 minute vertical slice: prologue, three distinctive NPCs, one district mystery, multiple solutions, fail-forward states, item discovery, a crafting/synergy payoff, and a consequence that is visible later.
2. Run game-balance simulations for shops, crafting costs, rewards, drop probabilities, currency sinks, and item power curves. Keep rare/legendary objects narratively earned, not simply inflated stat sticks.
3. Add contextual tutorials and clear feedback: why a choice succeeded, which effective stats were checked, what was consumed, what changed, and what the NPC remembers.
4. Add item metadata for source, use, binding, dismantling, repair, durability (when introduced), crafting recipes, provenance, and lore. Avoid adding inventory volume without purpose.
5. Add automated quest path tests, deterministic reward tests, economy tests, and regression snapshots for canon.

## Phase 2 — v2.2: Server-authoritative single-player

- Introduce a domain-command API: `Travel`, `TalkToNpc`, `ResolveQuestChoice`, `EquipItem`, `ConsumeItem`, `TradeWithMerchant`, `CraftItem`.
- Treat the client as presentation only. The server validates location, unlock state, requirements, inventory, prices, cooldowns, and consequences.
- Move gameplay state to normalized save snapshots and append-only event records, with save schema versioning and migrations.
- Maintain a deterministic simulation kernel that has no direct dependency on an LLM.
- Provide user-specific save slots, conflict checks, atomic save updates and recovery/backups.

## Phase 3 — v2.3: NPC life simulation

- Model schedules, current district, needs, fears, obligations, loyalties, relationships, personal memory, occupation, wealth, secrets, and daily goals.
- NPC simulation should be low-cost and tiered: full detail near the player, aggregated simulation elsewhere, with reproducible daily outcomes.
- Add a city event queue driven by deterministic world rules: shipments lost, food shortages, court orders, guild feuds, patrol changes, seasonal events, and rumors.
- Show consequences through behavior, dialogue, prices, access, messages, and Chronicle entries—not only floating text.
- Define authoring tools and validator checks so the 69 current NPCs can be expanded without lore contradictions.

## Phase 4 — v2.4: The AI game-master runtime

AI pipeline:

1. The server creates a compact, sanitized snapshot of facts the player is allowed to know.
2. A selected model proposes dialogue, scene prose, optional side-quest drafts, rumor language, or NPC interpretations in strict schemas.
3. Deterministic validators reject unknown entities, canon conflicts, impossible travel, duplicate item IDs, invalid reward bundles, broken prerequisites, and forbidden state changes.
4. A rules engine decides what actually happens. The model cannot commit a state transition on its own.
5. Approved narrative text and a digest of relevant signals are stored for traceability and reproducibility.

For generated side quests, use a draft/validate/approve/execute flow. Store seed/context hashes, model/version, schema version, and validator results. Provide template fallback when no API key is configured. Add spend limits and a per-user budget before broad use.

## Phase 5 — v2.5: Multiplayer readiness

- Use the same server-authoritative command API for a single player now and many players later.
- Add explicit ownership, actor identity, transaction boundaries, optimistic concurrency/version numbers, idempotency keys, and server event sequence numbers.
- Keep per-player quests and inventory separate from shared world state; design public markets and persistent NPC/city state as different aggregates.
- Add websocket delivery only after command correctness, conflict resolution, abuse controls, and persistence are proven.
- Multiplayer is not a toggle. It requires concurrency tests, anti-cheat validation, access control, operational monitoring, and data migration strategy.

## Engineering quality gates

- CI: type check, lint, smoke/content tests, backend unit tests, Prisma migration test against disposable PostgreSQL, and an end-to-end register/login/save/restore/AI contract test.
- Every item/quest/NPC must reference existing IDs. Every story reward must exist. Every unlocked region path and item source must be reachable or explicitly marked unavailable.
- Balance reports should include min/max time to levels, gold inflation, shop margin, drop probabilities, expected item power, and completion rates for choice options.
- Require save backups and schema migrations before changing persistent state shapes.
- Keep AI API keys and session tokens server-only; do not send secrets or unnecessary personal data to the model.

## Current boundary

The v2.0 alpha introduces real infrastructure, not a live public MMO. The first generative A Szem feature is live only when the developer configures the server key and database. World state remains primarily client-side/local for the current playable demo. The first milestone after this release should prove one polished loop from start to consequence before adding hundreds of low-impact items or autonomous world events.
