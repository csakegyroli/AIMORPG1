const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aimorpg-alma-"));
try {
  const sourcePath = path.join(root, "src/lib/innService.ts");
  const source = fs.readFileSync(sourcePath, "utf8");
  const compiled = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, strict: true },
    fileName: sourcePath,
  });
  const errors = (compiled.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(e => ts.flattenDiagnosticMessageText(e.messageText, " ")).join("; "));
  const helperPath = path.join(temp, "innService.cjs");
  fs.writeFileSync(helperPath, compiled.outputText);

  const { executeAlmaInnTransaction, createInnTransactionGuard } = require(helperPath);
  const heartyStew = { id: "heartyStew", type: "consumable", basePrice: 24, effects: { healPercent: 20 } };
  const gateRations = { id: "gateRations", type: "consumable", basePrice: 12, effects: undefined };
  const makeArgs = (targetId, transactionId) => ({
    targetId, transactionId, npcId: "alma", functionId: "fn-alma",
    allowedItemIds: ["heartyStew", "gateRations"],
    items: [heartyStew, gateRations],
    maxHealth: 125, restPrice: 60, inventoryLimit: 80,
  });
  const assertState = (actual, expected, label) => {
    assert.equal(actual.gold, expected.gold, label + " gold");
    assert.equal(actual.health, expected.health, label + " HP");
    assert.equal(actual.inventoryCount, expected.inventoryCount, label + " inventory");
  };
  const state = { gold: 100, health: 100, inventoryCount: 79 };

  // A — insufficient gold: no mutation and no ID reservation; same ID can later commit.
  {
    const guard = createInnTransactionGuard(256);
    const args = makeArgs("rest", "alma:case-a:tx000001");
    const before = { ...state, gold: 59 };
    const failed = executeAlmaInnTransaction(before, args, guard);
    assert.equal(failed.success, false);
    assert.equal(failed.message, "insufficient-gold");
    assertState(failed.state, before, "A failed preflight");
    const retry = executeAlmaInnTransaction(state, args, guard);
    assert.equal(retry.success, true, "A same-ID retry proves the failed preflight did not reserve.");
    assertState(retry.state, { gold: 40, health: 113, inventoryCount: 79 }, "A successful retry");
  }

  // B — max HP: no charge or mutation; same ID can later commit after HP decreases.
  {
    const guard = createInnTransactionGuard(256);
    const args = makeArgs("rest", "alma:case-b:tx000001");
    const before = { ...state, health: 125 };
    const failed = executeAlmaInnTransaction(before, args, guard);
    assert.equal(failed.success, false);
    assert.equal(failed.message, "full-health");
    assertState(failed.state, before, "B failed preflight");
    const retry = executeAlmaInnTransaction(state, args, guard);
    assert.equal(retry.success, true, "B same-ID retry proves the failed preflight did not reserve.");
    assertState(retry.state, { gold: 40, health: 113, inventoryCount: 79 }, "B successful retry");
  }

  // C — item outside fn.itemIds: no mutation or reservation; allow-listed same-ID retry succeeds.
  {
    const guard = createInnTransactionGuard(256);
    const id = "alma:case-c:tx000001";
    const before = { ...state };
    const failed = executeAlmaInnTransaction(before, makeArgs("buy:outsiderItem", id), guard);
    assert.equal(failed.success, false);
    assert.equal(failed.message, "invalid-item");
    assertState(failed.state, before, "C failed preflight");
    const retry = executeAlmaInnTransaction(before, makeArgs("buy:heartyStew", id), guard);
    assert.equal(retry.success, true, "C same-ID allow-list retry proves the failed preflight did not reserve.");
    assert.equal(retry.addedItemId, "heartyStew");
    assertState(retry.state, { gold: 76, health: 100, inventoryCount: 80 }, "C successful retry");
  }

  // D — a successful rest replay is duplicate even though its new preflight would fail on gold.
  {
    const guard = createInnTransactionGuard(256);
    const args = makeArgs("rest", "alma:case-d:tx000001");
    const first = executeAlmaInnTransaction(state, args, guard);
    assert.equal(first.success, true);
    assertState(first.state, { gold: 40, health: 113, inventoryCount: 79 }, "D first commit");
    const replay = executeAlmaInnTransaction(first.state, args, guard);
    assert.equal(replay.success, false);
    assert.equal(replay.message, "duplicate");
    assertState(replay.state, first.state, "D duplicate replay");
  }

  // E — same ID with a different payload collides even when the second plan fails (full inventory).
  {
    const guard = createInnTransactionGuard(256);
    const id = "alma:case-e:tx000001";
    const fullBagState = { ...state, inventoryCount: 80 };
    const first = executeAlmaInnTransaction(fullBagState, makeArgs("rest", id), guard);
    assert.equal(first.success, true);
    const collision = executeAlmaInnTransaction(first.state, makeArgs("buy:heartyStew", id), guard);
    assert.equal(collision.success, false);
    assert.equal(collision.message, "collision");
    assertState(collision.state, first.state, "E collision");
  }

  // Invalid target is also rejected before reservation; the same ID remains usable.
  {
    const guard = createInnTransactionGuard(256);
    const id = "alma:case-f:tx000001";
    const failed = executeAlmaInnTransaction(state, makeArgs("invalid-target", id), guard);
    assert.equal(failed.success, false);
    assert.equal(failed.message, "invalid-payload");
    assertState(failed.state, state, "F invalid target");
    const retry = executeAlmaInnTransaction(state, makeArgs("rest", id), guard);
    assert.equal(retry.success, true);
    assertState(retry.state, { gold: 40, health: 113, inventoryCount: 79 }, "F same-ID retry");
  }

  // The source order is guarded in addition to the dynamic same-ID retry evidence.
  const executor = source.slice(source.indexOf("export function executeAlmaInnTransaction("));
  assert.ok(executor.indexOf("const plan =") < executor.indexOf("const idResult = reserve("));
  assert.ok(executor.indexOf("if (!plan.success)") < executor.indexOf("const idResult = reserve("));

  console.log("A — insufficient gold / unchanged balances / same-ID retry: PASS");
  console.log("B — maximum HP / unchanged balances / same-ID retry: PASS");
  console.log("C — fn.itemIds rejection / unchanged balances / same-ID allow-list retry: PASS");
  console.log("D — successful transaction replay / deterministic duplicate / no second mutation: PASS");
  console.log("E — same-ID different payload / deterministic collision / no mutation: PASS");
  console.log("F — invalid target / unchanged balances / same-ID retry: PASS");
  console.log("Executor source order: plan and failed-preflight check precede mutating ID reservation: PASS");
  console.log("Alma transaction reservation-order tests: PASS (7/7)");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
