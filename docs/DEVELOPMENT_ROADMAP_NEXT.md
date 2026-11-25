# AIMORPG — Development Roadmap (current: v1.41.0)

## Completed foundation

1. Stable browser UI / core mechanics
2. Six capital regions plus forest preview, 28 districts, and 69 persistent NPC definitions
3. NPC schedule/location model and local NPC interactions
4. Player identity, relationship facets, world memories, and NPC runtime state
5. 60-node main quest network with regional gating and fail-forward narrative
6. The Eye observation stream and deterministic narrative opportunity evaluator
7. Quest DNA, Canon Layer + Dynamic Layer, AI Council and handoff gates
8. Expanded item/equipment ecosystem, 18 equipment sets, regional markets, reward/loot economy
9. World time/calendar, deterministic local/regional events, dialogue topics and NPC backstories
10. Dynamic side-story offer/accept/decline/tracking lifecycle
11. **v1.41.0:** playable side-story resolution at the story giver; stat-based approaches, durable consequences, deterministic rewards, fail-forward handling

## Current product state

The project remains a front-end playable demo with browser `localStorage` persistence. It does not yet include a live NestJS API, PostgreSQL/Prisma backend, account service, or generative AI runtime.

## Next development order

### Phase 1 — Playability and balance (now)
- Playtest side-story frequency, repeat protection, expiry, regional gates and NPC availability.
- Balance difficulty tiers and reward ranges against low-level and equipped characters.
- Audit all active world events for an actual player-facing action and terminal outcome.
- Improve objective clarity, history states, and mobile layout.
- Add automated tests for the full side-story lifecycle and save migration behavior.

### Phase 2 — Save resilience
- Add save export/import with schema validation and explicit user-triggered backup.
- Test migrations from previous save versions; never silently erase invalid saves.
- Separate pure gameplay rules from browser storage adapters.

### Phase 3 — Server-authoritative world
- Introduce NestJS endpoints and DTO validation.
- Model players, characters, inventory, quests, NPC state, world memory, events, and reward rolls in Prisma/PostgreSQL.
- Make time, quest resolution, market trades and rewards server-authoritative and transactional.
- Add authentication, rate limits, audit logs, and deployment configuration.

### Phase 4 — AI Release Gate
- Keep AI dormant until gameplay and deterministic validators pass.
- Run adversarial tests for canon drift, duplicate opportunities, invalid items/NPCs, time-zone exploits, inventory overflow, and player-agency violations.
- Connect the AI only as a structured proposal generator. It must not write directly to the database or alter Canon.

## Hard project rule

**AI is the last layer, not the foundation.** The authored world, item economy, NPC roles, quest grammar and state transitions must stay coherent and testable before generative narration is enabled.
