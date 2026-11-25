# AImorpg Project Status — v1.41.0

## Current baseline

The current source of truth is `AIMORPG-Final-Demo-v1.40.1-Effective-Stats-Hotfix.zip`, not the older v0.16 browser demo. The v1.41.0 working tree builds on that baseline and preserves its authored world, 60-node main quest structure, relationship model, world memory, world clock/calendar, deterministic world-event layer, 166-item ecosystem, 18 equipment sets, and 69 NPC definitions across 7 regions and 28 districts.

## This release

Playable side-story resolution is now implemented. The player accepts a dynamic side story, follows it to its giver, and resolves it in the NPC's local interaction view by choosing one of five approaches. The selected method uses a defined attribute and a scale-based threshold. Success grants the full deterministic side-story reward; failure creates a fail-forward outcome with reduced consolation rewards. Both outcomes save a relationship delta, NPC state, world memory, journal entry, Game Master message, and dynamic narrative event.

## Architecture truth

This release is still a **front-end demo**. Game state persists in browser `localStorage`; there is no connected NestJS API, PostgreSQL database, Prisma persistence layer, authentication system, or deployed AI service in this source bundle. Those are future milestones, not features to assume are present.

## Non-negotiable world rules

- The authored Canon and main story are read-only to dynamic systems.
- Generative AI remains dormant until the deterministic gameplay and validation gates pass.
- NPC presence and region location must be respected; the information-only side-story list must never teleport the player or resolve a story.
- Failure should create consequences and future opportunities rather than stop the campaign. Expired story deadlines remain in the journal/history and notify the player; they are not silently deleted.
- Rewards must use the existing deterministic economy and obey inventory capacity.

## Next milestones

1. **Playtest / balance pass:** inspect side-story generation frequency, expiration, cooldowns, difficulty tiers, repeat prevention and reward bands in real play.
2. **Save reliability:** add explicit export/import and a versioned save migration test suite before moving persistence to a server.
3. **World-event agency:** ensure every active local event offers a clear player action and an auditable resolution path.
4. **Visual/UX pass:** make quest state, active objective, NPC presence, and consequences clearer on laptop and mobile layouts.
5. **Backend foundation:** only when the gameplay loop is stable, introduce NestJS, Prisma and PostgreSQL with server-authoritative time and transactions.
6. **AI Release Gate:** after deterministic tests and canon validators are in place, connect a server-side AI proposer that cannot mutate Canon and can only submit validated dynamic proposals.

## Validation status

- `npm test`: passing in this release workspace.
- `npm run lint` / `npm run build`: not confirmed in this environment because the package installation was interrupted by unavailable npm registry DNS (`EAI_AGAIN`). Run a clean `npm ci` in a network-enabled environment before considering the release production-ready.
