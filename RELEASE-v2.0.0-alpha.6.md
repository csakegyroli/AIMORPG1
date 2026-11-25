# AIMORPG v2.0.0-alpha.6 — Stage 2 Visual Continuation Checkpoint

This is a continuation checkpoint based on the actual alpha.5 Stage 2 ZIP. It is not a final release.

## Implemented in this checkpoint
- Actual region illustrations are now visible in the clickable capital-map hotspot surface and the adjacent region list, using the existing stable region ID mapping.
- The region hot spot remains a selection action only; locked-region checks and the existing explicit `game.travel` details action remain in place.
- NPC portrait components in key detail/directory/dialogue contexts fall back to an existing known avatar if image loading fails.
- `ItemArtwork` catches mapped-image load failures, marks the rendered kind as `broken` and shows the item's icon rather than leaving a broken image element.
- NPC forge, crafting, dismantling, trade, alchemy, infusion and food/inn service lists now use the same `ItemArtwork` component as inventory, market and tooltip surfaces.
- Visible app header, `package.json`, and lockfile root are alpha.6.
- The `npm test` suite includes `scripts/visual-ui-smoke.cjs`.

## Validation
- `npm test`: PASS (four scripts).
- Dependency installation: BLOCKED by the container execution limit; partial `node_modules` is not a successful install.
- `npm run lint`: BLOCKED / not verified in this attempt because required package/type dependencies are unavailable.
- `npm run build`: BLOCKED because `next` is not installed.
- Live browser rendering and screenshots: NOT RUN.

## Asset coverage - source level only
- 187 item definitions; 53 unique ID-based item images; 33 explicit family illustrations; 101 equipment-slot fallbacks.
- 69 NPCs; 61 explicit NPC portrait mappings (other records may use authored avatar paths).
- 7 region images and 28 district images.
- All 7 region image paths are checked by the visual UI smoke test. This does not imply all image subjects are semantically verified or all images have been rendered in browser.

## Protected systems
No intentional modifications to AI runtime/API, server business logic, database schema, save mechanics, item stats/economy, NPC/quest canonical data, world time model, or travel gates. No live AI request or database test was made.

## Next concrete action
Restore dependencies with the pinned lockfile in a network-enabled environment; run lint/build; launch in Chromium; capture actual desktop/mobile UI screenshots; audit semantic fit of all item and NPC artwork and update render/verification fields only after direct validation.


## Additional archive-based item art in alpha.6
Ten semantically selected crops from the preserved item grid now supply unique ID artwork for `courtInvitation`, `blackCoin`, `royalTransitPass`, `rareAmber`, `blackSalt`, `guildWaxSet`, `echoThreadCloak`, `harborCoat`, `dockHook`, and `watchLantern`. Crop lineage and file hashes are recorded in `docs/artwork-sources/integration-sources/crop-receipts.json`. Source-level mapping/file checks passed; these assets have not been marked browser-rendered or visually verified in the running game.
