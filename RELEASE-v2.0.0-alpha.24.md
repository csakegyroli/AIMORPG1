# AIMORPG v2.0.0-alpha.24 — Visual Overhaul & Eye Remediation

## Implemented
- Moved `ServerTowerClock` into the existing top status header; it no longer renders as a separate full-width row.
- Replaced the main navigation's decorative Eye glyph with `/assets/eye-emblem-v2.webp`.
- Enlarged and centered the added blue gaze layer over the blue observatory orb in `eye-observation.webp`; variable pauses and direction targets are used, with reduced-motion support.
- Updated visible/package versions to alpha.24.
- Added UI smoke assertions for the header clock, Eye icon, gaze layer and reduced-motion CSS.

## Verification
- `npm test`: PASS.
- `npm run lint`: BLOCKED by missing TypeScript type packages.
- `npm run build`: BLOCKED (`next: not found`).
- `npm ci --offline`: BLOCKED (`ENOTCACHED` for `why-is-node-running@2.3.0`).
- Browser QA and screen recording: NOT RUN because the Next.js app cannot be launched in this environment.

## Important limitations
The observatory artwork is a flat 960x640 WebP image and does not contain an independently layered iris. The CSS overlay is an added stylized iris over the blue orb, not the original illustration's own eye. Its alignment and visible effect still require live browser confirmation. The three previously reported image-quality issues are not resolved in this checkpoint. This is a targeted remediation checkpoint, not a completed full visual overhaul.
