# AIMORPG v2.0.0-alpha.21 — Visual polish checkpoint

## Implemented
- The Eye's header now uses the existing standalone 960×640 `/assets/world/eye-observation.webp` artwork as a prominent, responsive illustrated hero instead of the small 256×202 emblem as the primary visual.
- The world clock no longer uses fixed/absolute positioning. It occupies its own normal-flow row below the top header, with a compact mobile layout, preventing overlap with the brand and top controls.
- Updated visible header and package/lockfile version to `2.0.0-alpha.21`.
- Extended UI smoke assertions for the Eye illustration and non-overlapping clock positioning.
- Existing four Eye tabs and their data sources were preserved.

## Verification
- `npm test`: PASS (core/content, TSX syntax smoke, security, asset, UI checks).
- `npm run lint`: BLOCKED (exit 2; Next.js/React and type declarations are not installed in this environment).
- `npm run build`: BLOCKED (exit 127; `next: not found`).
- Browser QA: NOT RUN; a working Next.js runtime/browser is unavailable in this environment.
- Alpha.20 source archive hash verified before extraction: `cb6d3c0fabe99be60fdcf67e1ca955b507adcdfec17b74f7e6d0d692cf809811`.

## Not claimed as fixed
The Overview chapter artwork, player avatar artwork, and district hero artwork have not been replaced. Their current sources exist (including 960×640 world paintings and 230×280 avatar files), but no verified higher-resolution original for the specific complained-about instances was established in this run. Do not treat these items as visually QA-passed. The image-generation attempts produced whole UI mockup screenshots rather than isolated, integration-ready artwork and were not integrated.
