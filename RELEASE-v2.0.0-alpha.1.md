# AImorpg v2.0.0-alpha.1 — Living City Foundation

This is the next architectural milestone after v1.41.0. It focuses on systems that make the existing authored world more playable and give it a path toward persistent accounts and later multiplayer, rather than replacing the world with a fresh prototype.

## Player-facing changes

- New gear families: **Vasfogadalom**, **Suttogó szál**, **Tinta és pecsét**, **Viharhoz kötve**, and **A Szem visszhangja**. Two matching items activate the first bonus; three activate the second. Bonuses use the same effective-stat calculation as ordinary gear and regional item sets.
- New authored items include unique weapons, armor, accessories, a story relic, and crafting/evidence materials. Total authored item catalogue: 187.
- New **Fiók és mentések** view: register, log in, view basic security status, export/import the local save, and create/list/restore/delete account-owned cloud saves when the API is available.
- **A Szem** has a real optional server-side generative observation endpoint. It interprets recent checked journal signals only; it cannot create authoritative world facts or execute state changes.

## Technical changes

- NestJS API, PostgreSQL 17 Compose service, Prisma schema and initial migration.
- User, PlayerProfile, Session, GameSave, AiInteraction, and SecurityEvent tables.
- scrypt password hashing, opaque token in HttpOnly cookie and only token hash stored in DB, session expiration/revocation, server-side account-bound saves, validation, request-origin checks, CORS allowlist, Helmet, in-memory request throttling, basic audit logging with hashed IP identifiers.
- Local single-player state stays separate from account registration. This permits offline play and makes browser save export a recovery path.

## Verification

- Deterministic smoke test passes for 187 items, 18 equipment sets, 69 NPCs, 60 quests, 28 districts, and referenced visual assets.
- TypeScript transpilation checks passed for core UI and gameplay modules; the smoke script now also transpiles account panel and API sources.
- A full framework build and live database/AI integration test have **not** been certified in this environment. Follow README setup steps to install dependencies, start PostgreSQL, run Prisma migration and build both applications.

## Known alpha limitations

- AI requires an API key configured on the server and a signed-in account. The model call is a narrative observation, not an autonomous quest engine.
- Email verification, password reset, MFA/passkeys, public profile controls beyond basic schema, account deletion workflow, distributed rate limit, production observability, backup/restore, and formal security review are not complete.
- The current game simulation remains primarily client/local-save based. Multiplayer synchronization and server-authoritative gameplay actions are future work, not currently implemented.
