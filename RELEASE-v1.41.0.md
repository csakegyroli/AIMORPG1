# AIMORPG Final Demo v1.41.0 — Playable Side Stories

## What changed
- Active side stories can now be resolved through five authored approaches: conversation, service, trade, risk, and investigation.
- Resolution is only accepted when the player is in the quest giver's region and the NPC is present; the information-only quest list cannot complete a story.
- A shared, deterministic rule maps every approach to a core stat and a scale-based threshold (micro 5, local 7, character arc 9), including equipment quest bonuses.
- Success and failure both leave a durable world memory, journal entry, Game Master message, relationship change, and narrative event. Failed approaches use fail-forward consequences and a reduced consolation reward instead of a hard game-over branch.
- Side-story rewards use the existing deterministic reward economy and inventory capacity guard.
- Side-story history now keeps expired stories as visible outcomes instead of silently deleting them; failed, declined, expired and completed IDs are stored separately. Expired deadlines also create a Game Master notice and stop tracking an expired active story.
- Added smoke-test coverage for the side-story stat mapping and difficulty rules.

## Deliberate constraints
- Generative AI remains disabled.
- Canon and the authored main quest spine remain unchanged.
- Side stories remain dynamic-only and cannot teleport the player or resolve outside the story giver's local interaction.

## Validation
- `npm test` — pass.
- `npm run lint` — dependency installation in the working container was incomplete during this release pass; rerun after a clean `npm ci` before production use.
