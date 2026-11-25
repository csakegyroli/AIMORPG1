# AIMORPG v2.0.0-alpha.20 — Navigation and The Eye Integration

## Implemented

- Reorganized the existing 11 navigation destinations into five labelled primary groups: A királyság, A hős, Történet és kapcsolatok, A világ megfigyelője, Rendszer. Existing `ViewId` destinations and the `go()` navigation path are preserved.
- Added accessible active-page semantics (`aria-current="page"`), labelled navigation groups, and a visible unread observation count.
- Added four distinct A Szem views backed by existing state: Világállapot reads the current game/world clock, region, reputation, quest counts, event count and memory count; Emlékek reads `game.worldMemories`; Látomások shows only dynamic events explicitly tagged `vision` or `látomás` and otherwise shows an honest empty state; Események reads existing runtime world events and the existing kingdom calendar.
- Kept A Szem read-only. No Canon/Dynamic Layer mutation, persistence schema, API contract, game-economy or NPC behaviour changes were introduced.
- Extended the existing CSS with responsive styles for the grouped navigation and four view tabs, using the alpha.19 theme tokens and visible keyboard focus.
- Updated package and lockfile version to `2.0.0-alpha.20`, and extended smoke-test assertions for the new navigation and view sources.

## Verification

- `npm test`: PASS (core/content smoke, TSX syntax/transpile smoke, password-hashing runtime test, visual asset smoke, visual UI smoke).
- `npm run lint`: BLOCKED (exit 2) because Next.js, React and their type declarations are not installed in this environment; the output includes missing-module and cascading JSX type errors.
- `npm run build`: BLOCKED (exit 127), `next: not found`.
- `npm ci --offline --ignore-scripts`: BLOCKED (exit 1), npm cache lacks the requested registry tarball (`why-is-node-running-2.3.0.tgz`). Lockfile was not regenerated.
- Browser QA: NOT RUN; no installed Next.js runtime or browser automation harness is available to serve the application. Chromium exists, but this does not by itself constitute app/browser verification.
- ZIP integrity and final SHA-256 are recorded in the external `.sha256` sidecar after packaging.

## Known limitations

- The Látomások view is intentionally an empty state unless existing Dynamic Layer events carry the explicit vision tag; the current model does not define a dedicated vision event type or separate vision store.
- Browser rendering, interactive tab behaviour in a live app, full semantic TypeScript checking, and production build remain unverified until project dependencies can be installed.
