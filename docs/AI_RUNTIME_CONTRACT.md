# AI runtime contract — A Szem

## Current implementation

The deterministic Eye rules in `src/lib/eye.ts` remain the authoritative observer for the local game. The new optional API endpoint can ask an OpenAI model to turn a small, recent, already-recorded signal bundle into one Hungarian narrative observation: title, body, optional action hint and tone.

The browser submits only the player display name, current region and level, at most five recent journal signals, and at most three recent observations. The server truncates strings and sets a hard timeout. The model output uses a strict JSON schema and is validated again before returning to the browser. The key is server-only. An authenticated account and configured database are required for the AI route, and there is a six-call-per-hour user quota in the current alpha.

## Hard rules

The model may:
- Interpret known facts and highlight a plausible pattern.
- Produce tone, mood, a remembered echo, or a tentative suggestion for further investigation.
- Point to an existing known journal clue without deciding what it proves.

The model may not:
- Grant or remove items, currency, stats, experience or rewards.
- Start, complete, fail or alter a quest.
- Change relationships, NPC schedules, region access or world time.
- Invent canonical facts, NPCs, items, locations or prior player actions.
- Override player intent or make decisions on the player's behalf.
- Write directly to the database as game state.

## Next stage

Future AI features should use typed proposals and an explicit validation pipeline:

`known world snapshot → AI proposal → schema validation → canon/ID validation → rules validation → player or director approval → deterministic command → event log + save`

Narrative output can be imperfect and retried; world commands cannot be vague. The game should remain enjoyable, replayable and safe when the model is unavailable, rate limited, expensive, or returns invalid content. Add per-user budget caps, model/version reporting, tests for prompt-injection strings in in-world text, and a template fallback before expanding AI responsibilities.
