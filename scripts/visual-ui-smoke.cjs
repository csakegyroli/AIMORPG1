#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const gameClient = fs.readFileSync(path.join(root, "src/components/GameClient.tsx"), "utf8");
const visualAssets = fs.readFileSync(path.join(root, "src/lib/visualAssets.ts"), "utf8");
const css = fs.readFileSync(path.join(root, "src/app/globals.css"), "utf8");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const manifest = fs.readFileSync(path.join(root, "docs/VISUAL_ASSET_INTEGRATION_MANIFEST.csv"), "utf8");

function fail(message) {
  console.error(`Visual UI smoke test: FAIL\n - ${message}`);
  process.exit(1);
}

try {
  assert.match(gameClient, /V2\.0 alpha\.26/, "Visible application header must match the package checkpoint version.");
  assert.match(gameClient, /const navGroups:[\s\S]*?label: "A királyság"[\s\S]*?label: "A hős"[\s\S]*?label: "Történet és kapcsolatok"[\s\S]*?label: "A világ megfigyelője"[\s\S]*?label: "Rendszer"/, "Primary navigation must provide all five requested functional groups.");
  assert.match(gameClient, /role="tablist"[\s\S]*?Világállapot[\s\S]*?Emlékek[\s\S]*?Látomások[\s\S]*?Események/, "The Eye must expose four distinct view tabs.");
  assert.match(gameClient, /tabIndex=\{eyeView === tab\.id \? 0 : -1\}[\s\S]*?ArrowLeft[\s\S]*?ArrowRight/, "The Eye tabs must support keyboard arrow navigation and roving focus.");
  assert.match(gameClient, /game\.worldMemories/, "Eye memory view must read existing saved memories.");
  assert.match(gameClient, /narrativeState\.runtime\.worldEvents\.events/, "Eye events view must read existing runtime world events.");
  assert.match(gameClient, /Nincs rögzített látomás/, "Missing vision data must render an honest empty state.");
  assert.match(visualAssets, /"sealedLedger": "\/assets\/items\/sealedLedger\.webp"/, "Sealed ledger unique art must be mapped by its stable item ID.");
  assert.match(gameClient, /className="capital-world-hero" aria-label="A főváros panorámája"/, "The main map view must have a data-driven immersive capital hero.");
  assert.match(gameClient, /className="capital-world-player-card" aria-label="Karakter gyorsállapot"/, "The capital panorama must include the actual player-state HUD.");
  assert.match(gameClient, /game\.gold\.toLocaleString\("hu-HU"\)/, "The player HUD must show current persisted gold, not hard-coded demo currency.");
  assert.match(gameClient, /game\.diamonds\.toLocaleString\("hu-HU"\)/, "The player HUD must show current persisted diamonds.");
  assert.match(gameClient, /heroHealthPercent/, "The player HUD health bar must use the live game health values.");
  assert.match(gameClient, /heroTrackedQuest\?\.title/, "The player HUD must use the existing tracked quest state.");
  assert.match(gameClient, /className="capital-command-rail" aria-label="Gyorselérés a játék moduljaihoz"/, "The capital gameplay page must include a navigable command rail.");
  assert.match(gameClient, /id: "inventory", icon: "▦", label: "Inventory", value: `\$\{game\.inventory\.length\}\/80`/, "The command rail inventory indicator must reflect actual inventory entries.");
  assert.match(gameClient, /id: "quests", icon: "✦", label: "Küldetések", value: `\$\{activeQuestCount\} aktív`/, "The command rail quest indicator must reflect the current quest state.");
  assert.match(gameClient, /className="inventory-status-strip"/, "Inventory must expose actual filtered item counts and bag capacity.");
  assert.match(gameClient, /aria-valuenow=\{Math\.min\(80, game\.inventory\.length\)\}/, "Inventory capacity meter must expose an accessible, live numeric value.");
  assert.match(gameClient, /className="quest-status-overview"/, "Quest view must show the current completion/active/open state summary.");
  assert.match(gameClient, /className="npc-directory-live-summary"/, "NPC directory must summarize current presence and remembered connections.");
  assert.match(gameClient, /className="market-live-summary"/, "Market view must show counts derived from the current region and filter.");
  assert.match(css, /\.capital-command-grid\{display:grid;grid-template-columns:repeat\(7,minmax\(0,1fr\)\)/, "The quick-access rail needs a wide-screen multi-module layout.");
  assert.match(css, /@media\(max-width:640px\)\{\.capital-command-rail/, "The quick-access rail needs an explicit mobile layout.");

  assert.match(css, /background-image:url\('\/assets\/world\/capital-dawn\.webp'\)/, "Capital hero must use the preserved capital panorama artwork.");
  assert.match(css, /shared dark-fantasy frame system across existing gameplay modules/, "The shared design system must remain present across existing modules.");
  assert.match(css, /prefers-reduced-motion:reduce/, "Visual transitions must respect reduced-motion preferences.");
  assert.match(css, /--aim-bg-raised:#222B34/, "The alpha.19/alpha.23 theme must expose the specified raised-panel token.");
  assert.match(css, /gm-hero-illustrated/, "The Eye must use the illustrated hero presentation.");
  assert.match(fs.readFileSync(path.join(root, "src/components/EyeEntity.tsx"), "utf8"), /assets\/world\/eye-canonical\.webp/, "The canonical Eye component must load the canonical artwork.");
  assert.doesNotMatch(css, /\.overview-eye\{[^}]*eye-observation\.webp/, "Overview Eye panel must not retain the obsolete observatory background.");
  assert.doesNotMatch(css, /\.gm-hero-illustrated\{[^}]*eye-observation\.webp/, "Eye hub must not retain the obsolete observatory background.");
  assert.match(css, /server-tower-clock\{position:relative!important;inset:auto!important/, "The world clock must occupy a non-overlapping layout row.");
  assert.match(css, /--aim-magic-blue:#3C8FE8/, "The alpha.19/alpha.23 theme must expose the specified magic-blue focus token.");
  assert.match(fs.readFileSync(path.join(root, "src/components/EyeEntity.tsx"), "utf8"), /className="eye-entity-gaze"/, "The shared Eye must render a visible animated gaze layer.");
  assert.match(css, /\.topbar \.server-tower-clock/, "The world clock must be styled inside the top status header.");
  assert.match(css, /\.nav-icon-eye \.eye-mark/, "The main Eye navigation icon must use the canonical Eye mark.");
  assert.match(css, /prefers-reduced-motion:reduce.*eye-entity-gaze/s, "The shared gaze must respect reduced-motion preferences.");
  assert.ok(gameClient.includes("<EyeEntity mode=\"scene\""), "The Eye hub must use the shared canonical Eye component.");
  assert.match(fs.readFileSync(path.join(root, "src/components/EyeEntity.tsx"), "utf8"), /prefers-reduced-motion: reduce/, "The shared Eye must respect reduced-motion preferences.");
  assert.match(css, /\.eye-entity-gaze/, "The shared Eye gaze layer must have a dedicated style.");
  assert.match(css, /:focus-visible\{outline:2px solid var\(--aim-magic-blue\)/, "Keyboard focus must have a visible magic-blue outline.");
  assert.match(gameClient, /setView\("quests"\)/, "Capital hero quest action must navigate to the real quest view.");
  const localQaScript = fs.readFileSync(path.join(root, "scripts/windows-local-qa.ps1"), "utf8");
  const localQaGuide = fs.readFileSync(path.join(root, "docs/WINDOWS_LOCAL_QA_GUIDE.md"), "utf8");
  const heroStart = gameClient.indexOf('className="capital-world-hero"');
  const mapStart = gameClient.indexOf('className="capital-map-layout"', heroStart);
  assert.ok(heroStart >= 0 && mapStart > heroStart, "Capital hero must precede the real interactive map.");
  assert.doesNotMatch(gameClient.slice(heroStart, mapStart), /game\.travel\(/, "Hero location-detail selection must not trigger travel automatically.");
  assert.match(gameClient.slice(heroStart, mapStart), /visibleNpcs\.length/, "Hero NPC count must use the real current-presence state.");
  assert.doesNotMatch(localQaScript, /\bRemove-Item\b|\bClear-Content\b/, "Local QA script must not delete or clear user files.");
  assert.match(css, /\.capital-world-hero/, "Capital hero must have a real styling layer.");
  assert.match(css, /@media\(max-width:640px\)\{\.capital-world-hero/, "Capital hero must have a mobile layout.");
  assert.match(localQaScript, /npm-regiszter elérhetősége/, "Windows QA script must diagnose registry access.");
  assert.match(localQaScript, /npm ci/, "Windows QA script must support opt-in reproducible dependency installation.");
  assert.match(localQaScript, /qa-summary\.json/, "Windows QA script must save a machine-readable run summary.");
  assert.match(localQaScript, /Invoke-WebRequest/, "Windows QA server readiness must check an HTTP response, not only an open TCP port.");
  assert.match(localQaScript, /\$configuredPort/, "Windows QA must identify the configured port before checking availability.");
  assert.match(localQaScript, /'--port', \[string\]\$port/, "Windows QA must pass its verified free port to the Next.js dev command.");
  assert.match(localQaScript, /A már futó folyamatot nem állítja le/, "Windows QA must avoid stopping unrelated local processes when a port is occupied.");
  assert.match(localQaScript, /x-powered-by|__next_f|_next\/static/, "Windows QA readiness must distinguish the Next.js app from an unrelated process on the same port.");
  assert.match(localQaScript, /DiagnosticsOnly/, "Windows QA script must separate diagnostics from checks.");
  assert.match(localQaGuide, /PowerShell/, "Windows QA guide must be present in Hungarian.");
  assert.match(localQaGuide, /EAI_AGAIN/, "Windows QA guide must explain the DNS-blocked recovery path.");
  assert.ok(fs.existsSync(path.join(root, "public/assets/world/capital-dawn.webp")), "The immersive capital hero's source artwork must exist.");
  assert.match(gameClient, /function SafeArtImage\(/, "NPC portraits require a resilient image fallback.");
  assert.match(gameClient, /onError=\{\(\) => \{ if \(!failed\) setFailedSource\(src\); \}\}/, "Safe image fallback must react to an actual load error.");
  assert.match(gameClient, /const imageFailed = Boolean\(src && failedSource === src\)/, "Item artwork must reflect image load failures in the visible fallback state.");
  assert.match(gameClient, /data-art-kind=\{artKind\}/, "Visible item art must expose its actual kind for QA.");
  assert.match(gameClient, /className="map-hotspot-art" src=\{REGION_ART\[id\]\}/, "Main map hotspots must render the selected region's actual art.");
  assert.match(gameClient, /className="capital-place-icon"><img src=\{REGION_ART\[id\]\}/, "The region list must use the selected region's artwork as well.");
  assert.match(gameClient, /className="function-item-icon"><ItemArtwork itemId=\{item\.id\} fallback=\{item\.icon\}/, "NPC shops, forge and service lists must use item art rather than only Unicode icons.");
  assert.match(gameClient, /\["forge","leatherwork"\]\.includes\(fn\.kind\)/, "Nara must open the dedicated leatherwork workbench.");
  assert.match(gameClient, /craftRecipeForNpcItem\(selectedCraft, npc\.region, npc\.id\)/, "NPC workbenches must display their own material recipes.");
  assert.match(gameClient, /canNpcCraftItem\(npc\.id,item\)/, "Workshop craft lists must enforce NPC specialties.");
  assert.match(gameClient, /<SafeArtImage src=\{portrait\} alt=\{displayName\}/, "NPC detail portraits must use resilient image loading.");
  assert.match(gameClient, /<div className="npc-directory-avatar"><SafeArtImage src=\{portrait\} alt=\{displayName\}/, "NPC directory modal portraits must also use resilient image loading.");
  assert.doesNotMatch(gameClient, /<div className="npc-directory-avatar"><img src=\{portrait\}/, "NPC directory modal must not keep a raw, unprotected image element.");
  assert.match(gameClient, /<SafeArtImage src=\{npcAvatar\(n\)\}/, "NPC directory portraits must use the shared, ID-based portrait resolver.");
  assert.match(gameClient, /game\.travel\(selected\.id\)/, "Region details must retain explicit travel action.");
  assert.match(gameClient, /onClick=\{\(\)=>\{if\(open\)setSelectedRegion\(id\);else setLockedRegion\(id as RegionId\)\}\}/, "Map must preserve region gate checks.");
  assert.match(css, /\.capital-map-layout \.map-hotspot-art/, "Region artwork needs an explicit visual treatment.");
  assert.match(css, /@media\(max-width:640px\)[\s\S]*?\.capital-map-layout \.map-hotspot-art/, "Map art treatment needs a mobile breakpoint.");
  assert.match(css, /\.item-art--broken/, "Broken item artwork needs an honest, styled fallback.");
  assert.match(pkg.scripts.test, /visual-ui-smoke\.cjs/, "The visual UI smoke test must run as part of npm test.");

  const regionIds = ["outskirts", "market", "arena", "inner", "palace", "harbor", "forest"];
  for (const id of regionIds) {
    const match = visualAssets.match(new RegExp(`\\b${id}:\\s*"(/assets/world/[^\"]+)"`));
    assert.ok(match, `Missing region artwork mapping in resolver: ${id}`);
    assert.ok(fs.existsSync(path.join(root, "public", match[1].replace(/^\//, ""))), `Mapped region art file is absent: ${id} -> ${match[1]}`);
  }

  const eyeComponent = fs.readFileSync(path.join(root, "src/components/EyeEntity.tsx"), "utf8");
  assert.ok(fs.existsSync(path.join(root, "public/assets/world/eye-canonical.webp")), "Reference-derived canonical Eye artwork must exist.");
  assert.match(eyeComponent, /prefers-reduced-motion/ , "Shared Eye must honor reduced motion.");
  assert.ok(gameClient.includes("<EyeEntity mode=\"compact\" label=\"A Szem figyeli a várost\"/>"), "Map must use the shared Eye entity.");
  assert.ok(gameClient.includes("<EyeEntity mode=\"compact\" label=\"A Szem megfigyelőrelikviája\"/>"), "Overview must use the shared Eye entity.");
  assert.ok(gameClient.includes("label=\"A Szem élő megfigyelőrelikviája\""), "Eye hub must use the shared Eye entity.");
  assert.doesNotMatch(gameClient, /function EyeGazeOverlay/, "Obsolete one-off gaze overlay must be removed.");
  assert.match(css, /topbar \.server-tower-clock\{order:0!important;flex:0 0 170px!important/, "World clock must remain compact in the top status bar at desktop widths.");

  const manifestRows = manifest.trim().split(/\r?\n/).length - 1;
  console.log("Visual UI smoke test: PASS");
  console.log(`Validated alpha.26 header, immersive capital hero with live character/resource/quest HUD, data-driven module command rail, inventory capacity indicators, quest/NPC/market summaries, local QA script and guide, resilient image fallback code paths, seven region-art files on map hotspots, preserved gate/travel wiring, responsive styling, and ${manifestRows} manifest records.`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

assert.ok(fs.existsSync(path.join(root, "src/components/EyeEntity.tsx")), "shared canonical Eye component exists");
assert.ok(fs.readFileSync(path.join(root, "src/components/GameClient.tsx"), "utf8").includes("EyeEntity mode=\"scene\""), "Eye hub uses canonical Eye entity");
