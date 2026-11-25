# AImorpg — Fekete Érme

**Version:** `2.0.0-alpha.13`  
**Direction:** single-player first; server-authoritative foundation for future multiplayer; AI as narrative collaborator, not as an unbounded world-state writer.

AImorpg is a dark-fantasy browser RPG set in a living capital. The current authored world includes 69 named NPCs with story profiles, 7 regions, 28 districts, 60 main-story quest nodes, 18 five-piece regional equipment sets, a world calendar, local economy rules, relationship facets, narrative memory, and the deterministic rules for **A Szem** (The Eye).

## Visual integration continuation — alpha.8, alpha.9 and alpha.10

- Existing region artwork is now shown directly on the interactive capital-map hotspots and the matching region list. Region selection remains separate from travel; locked-region gates are retained.
- Shared item artwork is used inside NPC crafting, dismantling, trade, alchemy and food/inn service workbenches as well as inventory, equipment, market and tooltip surfaces.
- Fifteen additional unique item illustrations have been integrated across alpha.6 and alpha.8 from preserved archive contact sheets and mapped to stable item IDs; crop lineage is recorded in `docs/artwork-sources/integration-sources/crop-receipts.json`.
- NPC portraits and item illustrations have explicit load-error handling. Additional NPC directory/district portrait surfaces use `SafeArtImage`. `npm test` passes; npm registry DNS (`EAI_AGAIN`) has blocked dependency installation, so lint/build and full live-app browser QA remain unverified.
- Alpha.9 adds a panoramic main-map hero using the preserved `public/assets/world/capital-dawn.webp` art with live current-region, world-time and present-NPC data; its actions reuse the existing region-detail and quest views without triggering travel. The local Windows QA runner is `scripts/windows-local-qa.ps1`, with Hungarian instructions in `docs/WINDOWS_LOCAL_QA_GUIDE.md`.

## Visual World Expansion — alpha.3

- The game now opens on the capital's map-led play surface; Overview remains available in the existing navigation.
- A shared dark-stone, worn-bronze and parchment design layer applies across the main shell, map, character sheet, inventory/equipment, quests, NPC directory, market, messages, chronicle and The Eye.
- Fifteen image-only derivatives from the provided concept board are in `public/assets/world/`; all nine original concept boards are preserved in `docs/artwork-sources/original-concepts/`.
- The server, API contracts, save system, game rules, and server-side Eye AI path were not changed in this visual release.
- Run `npm test` for content/security smoke tests, asset-file and crop-lineage checks, and UI source-wiring checks.

## What changed in 2.0 alpha

- Expanded the item catalogue from 166 to **187 authored items**, including five equipment-synergy families.
- Equipment synergies now add actual stat values used by the same effective-stat calculation as equipment and regional set bonuses.
- Added a player account panel with registration/login UI, current account/security status, local save export/import, and account-bound cloud save management.
- Added a NestJS API foundation and PostgreSQL/Prisma schema/migration for user records, player profiles, sessions, game saves, AI interactions, and security events.
- Added password hashing (Node.js scrypt), opaque server-side sessions stored as hashes, HttpOnly/SameSite cookies, session expiry/revocation, request-origin protection, CORS allowlisting, Helmet, validation, endpoint throttling, ownership-scoped save access, save size/count limits, and hashed IP audit identifiers.
- Added the first **real generative AI call for A Szem** through OpenAI's Responses API. It is server-side only and returns a schema-validated observation. It cannot mutate stats, inventory, quests, relationships, or the canon.
- Kept local single-player play independent from account/database/AI availability. The game does not falsely claim to be connected when the backend is offline.

## Requirements

- Node.js 22 LTS recommended.
- npm compatible with the installed Node.js.
- PostgreSQL 17 for account and cloud-save features. Docker Compose is provided for local development.
- An OpenAI API key for live generative A Szem observations. This is optional; the deterministic Eye rules and the offline game continue to work without it.

## Start the local single-player game

From the project root:

```bash
npm ci
npm test
npm run dev
```

Open `http://localhost:3000`. You can play the local game without an account or API/database services. The existing browser save key is intentionally retained so prior local saves can be migrated by the current save-normalization code. Before experimenting, export the save in the **Fiók és mentések** panel.

## Start the API and PostgreSQL

Open a second terminal:

```bash
cd server
cp .env.example .env
```

The `.env.example` contains development-only values. For local development, the compose file and `DATABASE_URL` use the same local password placeholder. Start the database and API:

```bash
docker compose up -d postgres
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run start:dev
```

The API listens on `http://localhost:4000`. Check `http://localhost:4000/api/system/health`. The account panel should show the database as connected once PostgreSQL is ready and the migration has succeeded.

If the web app uses another port/origin, update `WEB_ORIGIN` in `server/.env` to the exact origin shown in the browser address bar. If you host the API elsewhere, define `NEXT_PUBLIC_API_URL` in the frontend environment before starting Next.js, for example `NEXT_PUBLIC_API_URL=https://api.example.test`.

### Enable the real AI integration

Put the API key only in `server/.env`:

```dotenv
OPENAI_API_KEY=your-real-key-here
OPENAI_MODEL=gpt-6-luna
```

Restart the API. **Never put the key in a `NEXT_PUBLIC_*` variable, source file, commit, save file, or browser storage.** A Szem's generative interpretation requires a registered and signed-in user, a live database, a valid key, and available API quota. The endpoint has a simple per-user hourly quota and stores a digest of the input plus the returned observation for audit; it does not store the full prompt context.

## Security and release status

This is a **developer alpha**, not a production-ready public service. Email verification, secure password reset, MFA/passkeys, account deletion/export workflow, distributed rate limiting, provider-side billing alerts, automated backups, disaster recovery, production monitoring, and formal penetration testing remain outstanding. The current NestJS throttler is in-memory and is not sufficient by itself for a multi-instance production deployment. Use HTTPS, a managed PostgreSQL service, strong secrets, backups, and reviewed operational controls before exposing this to the public internet.

Before going live, replace `AUDIT_HASH_SECRET`, set an exact HTTPS `WEB_ORIGIN`, use a private database network and a proper secret manager, and test backup restore and account lifecycle flows. Never publish `server/.env` or any API key.

## Project structure

- `src/lib/` — authored world, NPCs, quests, deterministic rules, economy, equipment, narrative memory, and Eye rules.
- `src/components/GameClient.tsx` — browser game shell and gameplay views.
- `src/components/AccountPanel.tsx` — registration/login UI, local save portability, and account-bound save management.
- `server/src/` — NestJS API: auth/session, cloud saves, AI observation, health endpoint, guards.
- `server/prisma/schema.prisma` — PostgreSQL data model.
- `server/prisma/migrations/` — checked-in initial database migration.
- `docs/PROJECT_ROADMAP_2026.md` — upgrade roadmap and architecture.
- `docs/SECURITY_MODEL_ALPHA.md` — implemented protections and remaining risks.
- `docs/AI_RUNTIME_CONTRACT.md` — bounded role for A Szem and future AI features.

## Test status

`npm test` runs deterministic content/gameplay checks and TypeScript syntax transpilation for the frontend plus API source files. It is a smoke test, not a replacement for a complete Next.js/NestJS build or end-to-end integration tests. Build the backend and run the database migration locally before relying on account/AI features.


## Windows local QA — alpha.9

A magyar nyelvű, projektbe mentett futtatási és ellenőrzési útmutató: `docs/WINDOWS_LOCAL_QA_GUIDE.md`. A nem destruktív PowerShell-ellenőrző script: `scripts/windows-local-qa.ps1`. A script diagnosztikát végez, és csak a `-InstallDependencies` kapcsolóval kért esetben futtat `npm ci` telepítést. Az élő böngészős QA-t nem helyettesíti: azt a tényleges Next.js-alkalmazás elindítása után kell elvégezni.


## Alpha.10 — live character HUD on capital panorama

- Added a responsive character quick-status panel to the existing capital map panorama. It reads the actual player name, avatar, level, calculated maximum health/current health, gold, diamonds, and tracked main quest from the existing game state.
- The quest shortcut opens the existing quest view; it does not trigger travel or mutate the quest. Existing region selection, gate checks and explicit travel action remain authoritative.
- Improved the Windows QA server-startup check to validate an HTTP response from the Next.js app instead of treating an open TCP port alone as proof that the app is ready.
- Live browser QA is still blocked until dependencies can be installed in a network-enabled environment.


## Visual integration continuation — alpha.11

- Continued the shared dark-fantasy visual system across the existing character sheet, inventory/equipment, quest, NPC, market, map/place and overview surfaces.
- Added consistent bronze/gold panel framing, focus-visible states, more legible selected/hover states, item-slot depth, and small-screen layout refinements.
- No gameplay rules, item values, quest rewards, NPC schedules, travel authority, world-clock model, persistence schema, or AI activation were intentionally changed.
- Browser rendering remains unverified until the required Next.js dependencies are installed in a working environment.


## Previous checkpoint — v2.0.0-alpha.12 (2026-10-19)

- Continued from the verified alpha.11 checkpoint in a separate work copy; the original ZIP and prior checkpoints were left unchanged.
- Added a data-driven quick-access rail to the capital map for Character, Inventory, Quests, NPC directory, Market, Chronicle and The Eye. Counts and labels are derived from the current game state, not demo values.
- Added inventory capacity/equipment summaries, quest progression cards, an NPC directory live-state summary, and a region/filter-aware market summary.
- Improved the Windows QA helper to avoid collisions with an occupied local port and to pass the selected port to the existing Next.js dev script without editing package scripts.
- `npm test`: PASS, including TSX syntax/transpile checks and checks for the new UI surfaces. Full semantic lint, production build and live browser QA remain blocked by missing Next.js/React dependencies; registry probe returned `EAI_AGAIN`.
- These are source/UI changes, not a claim of completed live browser rendering. See `VISUAL_REBUILD_PROGRESS.md` and `docs/VISUAL_REBUILD_TEST_REPORT.md` for exact statuses.


## Current development checkpoint — v2.0.0-alpha.13 (2026-10-19)

- Continued from the verified alpha.12 source in a separate `work-alpha13` worktree; alpha.12 and earlier checkpoint ZIPs remain unchanged.
- Added ten stable-ID item-art mappings for `brokenSealRing`, `canalKnife`, `caravanCompass`, `championRibbon`, `duelistCape`, `firstWitnessLens`, `quietBell`, `sailorsKnife`, `stormKnot`, and `stormglassBow`.
- Preserved existing source contact sheets and recorded source paths, SHA-256, output paths, crop metadata and provenance in `docs/artwork-sources/integration-sources/crop-receipts.json`. `quietBell` is a deterministic, locally authored SVG-derived illustration because the previously referenced standalone raster was not present in the available archive.
- `ITEM_ART` unique-ID artwork count is now 68; the 29 family fallbacks and 90 remaining equipment-slot fallbacks remain separate categories. This is not a claim that every catalog item has unique artwork.
- The updated source-level smoke tests validate the ten additional mappings, output files and crop receipts. Item artwork live rendering remains `NOT RUN` until the real Next.js app is installed and opened in a browser.
- See `docs/ALPHA13_ITEM_ART_INTEGRATION_REPORT.md` for actual test, build, lint and archive-verification statuses.
