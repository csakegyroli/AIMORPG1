# Item-art semantic review — Stage 2 repair

The original target files were copied to `docs/artwork-sources/legacy-mappings-review/items/` before replacement. The corrected image crops were matched to the item definitions in `src/lib/content.ts` and `src/lib/expansionItems.ts`, not to the previous output filenames.

- 39 item assets are crops from existing generated item boards.
- 4 are original hand-authored vector illustrations rendered to WebP: `velvetWine`, `luxuryCigar`, `blackArchiveWax`, `arenaBand`. These were chosen because no source-board panel depicted those objects accurately enough.
- Set-generated items are not individually illustrated in this batch. They are assigned a slot-family image at render time by `itemArtFor`, and this is an acknowledged shared visual fallback, not unique set artwork.
- The source artwork has been visually reviewed as a grid. Individual image fitting and in-game browser render remain `NOT RUN`, so the items are not labeled `RENDERED` or `VERIFIED`.
- The exact per-item source and cell records live in `docs/artwork-sources/integration-sources/crop-receipts.json`.
