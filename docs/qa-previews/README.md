# Alpha.6 map component preview — provenance and limits

These two PNGs are **isolated HTML/CSS component previews**, not screenshots of the running Next.js game. They were produced using the project's current `src/app/globals.css`, the mapped regional image assets, and markup mirroring the current map hotspot/list image structure. The HTML was loaded using Playwright's `page.set_content` into system Chromium.

- `alpha6-map-component-preview.png`: 1440px wide desktop layout.
- `alpha6-map-component-preview-mobile.png`: 390px wide mobile layout.

Observed in this isolated preview: all 15 image elements load (1 map image, 7 hotspot art images, 7 region-list thumbnails), the 7/7 hotspot and 7/7 list-thumbnail counts are present, and document width does not exceed viewport width at either tested width.

Limit: this preview does not execute React state, server APIs, game travel, lock state, time, inventory or persistence. Full application browser QA is still blocked because the pinned dependencies could not be installed; `next build` cannot run while `next` is absent. Do not use these PNGs as proof of live gameplay or full visual QA.
