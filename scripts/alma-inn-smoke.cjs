const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aimorpg-alma-inn-"));
try {
  const helperSource = path.join(root, "src/lib/innService.ts");
  const helperOut = path.join(temp, "innService.js");
  const source = fs.readFileSync(helperSource, "utf8");
  const compiled = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, strict: true },
    fileName: helperSource,
  });
  const errors = (compiled.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(e => ts.flattenDiagnosticMessageText(e.messageText, " ")).join("; "));
  fs.writeFileSync(helperOut, compiled.outputText);
  const { getInnRestPreview, getInnFoodPreview } = require(helperOut);

  const rest = getInnRestPreview(100, 125, 60);
  assert.deepEqual({ canRest: rest.canRest, price: rest.price, restored: rest.restoredHealth, result: rest.resultingHealth }, { canRest: true, price: 60, restored: 13, result: 113 });
  assert.equal(getInnRestPreview(123, 125, 60).restoredHealth, 2, "Rest must cap healing at max HP.");
  assert.equal(getInnRestPreview(125, 125, 1000).reason, "full-health", "Full HP must block and never charge.");
  assert.equal(getInnRestPreview(100, 125, 59).reason, "insufficient-gold");
  assert.equal(getInnRestPreview(100, 125, 60).price, 60);
  assert.equal(getInnRestPreview(0, 125, 60).restoredHealth, 13);

  const content = fs.readFileSync(path.join(root, "src/lib/content.ts"), "utf8");
  const stewMatch = content.match(/\{ id: "heartyStew"[^\n]*effects: \{ healPercent: (\d+) \}/);
  assert.ok(stewMatch, "Existing heartyStew healPercent definition must remain.");
  const rationsMatch = content.match(/\{ id: "gateRations"[^\n]*basePrice: (\d+)[^\n]*\}/);
  assert.ok(rationsMatch, "Existing gateRations definition must remain.");
  const stew = { id: "heartyStew", type: "consumable", basePrice: 24, effects: { healPercent: Number(stewMatch[1]) } };
  const rations = { id: "gateRations", type: "consumable", basePrice: Number(rationsMatch[1]), effects: undefined };
  assert.equal(getInnFoodPreview(stew, 125, 100, 24, 10).healingAmount, 25);
  assert.equal(getInnFoodPreview(stew, 125, 123, 24, 10).restoredHealth, 2);
  assert.equal(getInnFoodPreview(rations, 125, 100, 100, 10).healingAmount, 0, "Rations must not gain an invented healing effect.");
  assert.equal(getInnFoodPreview(stew, 125, 100, 23, 10).reason, "insufficient-gold");
  assert.equal(getInnFoodPreview(stew, 125, 100, 100, 80).reason, "inventory-full");
  assert.equal(getInnFoodPreview({ ...stew, basePrice: -1 }, 125, 100, 100, 10).reason, "invalid-item");
  assert.equal(getInnFoodPreview({ ...stew, type: "weapon" }, 125, 100, 100, 10).reason, "invalid-item");

  const store = fs.readFileSync(path.join(root, "src/lib/store.ts"), "utf8");
  assert.match(store, /targetId!==undefined && targetId!=="rest"/);
  assert.match(store, /getInnRestPreview\(s\.health,max,s\.gold,fn\.cost\?\?60\)/);
  assert.match(store, /fn\.itemIds\?\.includes\(selectedId as ItemId\)/);
  assert.match(store, /getInnFoodPreview\(item,max,s\.health,s\.gold,next\.inventory\.length\)/);
  assert.match(store, /const SAVE_KEY = "aimorpg-final-demo-v1-29"/);
  assert.match(store, /saveVersion: 6/);

  const ui = fs.readFileSync(path.join(root, "src/components/GameClient.tsx"), "utf8");
  assert.match(ui, /getInnRestPreview/);
  assert.match(ui, /getInnFoodPreview/);
  assert.match(ui, /innActionLock/);
  assert.match(ui, /Pihenek ·/);
  assert.match(ui, /Mégsem/);
  assert.match(ui, /aria-live="polite"/);
  assert.doesNotMatch(ui, /\[1,2,4,8\]\.map\(h=>/);

  console.log("Alma Varg inn focused tests: PASS");
  console.log("Covered: 60 gold / 10% max HP, HP cap, full HP, insufficient gold, existing stew effect, unchanged no-effect rations, inventory cap, allow-list, fixed one-hour rest, UI duplicate-click lock, cancellation feedback and unchanged save key/version.");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
