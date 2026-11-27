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
  const {
    getInnRestPreview, getInnFoodPreview, planInnRest,
    planInnFoodPurchase, createInnTransactionGuard,
    createInnSubmissionController, executeAlmaInnTransaction,
  } = require(helperOut);

  // One-hour rest: 60 gold and ceil(10% max HP), capped at max HP.
  const rest = getInnRestPreview(100, 125, 125, 60);
  assert.deepEqual(
    { canRest: rest.canRest, price: rest.price, restored: rest.restoredHealth, resulting: rest.resultingHealth },
    { canRest: true, price: 60, restored: 13, resulting: 113 },
  );
  assert.equal(getInnRestPreview(123, 125, 60).restoredHealth, 2);
  assert.equal(getInnRestPreview(125, 125, 1000).reason, "full-health");
  assert.equal(getInnRestPreview(100, 125, 59).reason, "insufficient-gold");
  assert.equal(getInnRestPreview(100, 125, 100, -1).reason, "invalid-preview");
  assert.equal(getInnRestPreview(100, 125, 100, Number.NaN).reason, "invalid-preview");
  assert.equal(getInnRestPreview(140, 125, 60).currentHealth, 140);
  assert.equal(getInnRestPreview(100, 125.9, 60).maxHealth, 125);

  const restState = { gold: 125, health: 100, inventoryCount: 4 };
  const restPlan = planInnRest(restState, 125, 60);
  assert.equal(restPlan.success, true);
  assert.deepEqual(restPlan.nextState, { gold: 65, health: 113, inventoryCount: 4 });
  const blockedRest = planInnRest({ ...restState, gold: 59 }, 125, 60);
  assert.equal(blockedRest.success, false);
  assert.deepEqual(blockedRest.nextState, { ...restState, gold: 59 });

  const content = fs.readFileSync(path.join(root, "src/lib/content.ts"), "utf8");
  const stewMatch = content.match(/\{ id: "heartyStew"[^\n]*effects: \{ healPercent: (\d+) \}/);
  assert.ok(stewMatch, "Existing heartyStew effect must remain present.");
  const rationsMatch = content.match(/\{ id: "gateRations"[^\n]*\}/);
  assert.ok(rationsMatch, "Existing gateRations definition must remain present.");
  assert.doesNotMatch(rationsMatch[0], /effects:/);
  const stew = { id: "heartyStew", type: "consumable", basePrice: 24, effects: { healPercent: Number(stewMatch[1]) } };
  const rations = { id: "gateRations", type: "consumable", basePrice: 12, effects: undefined };
  assert.equal(getInnFoodPreview(stew, 125, 100, 24, 10).healingAmount, 25);
  assert.equal(getInnFoodPreview(stew, 125, 123, 24, 10).restoredHealth, 2);
  assert.equal(getInnFoodPreview(rations, 125, 100, 100, 10).healingAmount, 0);
  assert.equal(getInnFoodPreview(stew, 125, 100, 100, 10, 80, false).reason, "invalid-item");
  assert.equal(getInnFoodPreview({ ...stew, type: "weapon" }, 125, 100, 100, 10).reason, "invalid-item");
  assert.equal(getInnFoodPreview({ ...stew, basePrice: -1 }, 125, 100, 100, 10).reason, "invalid-item");
  assert.equal(getInnFoodPreview({ ...stew, basePrice: Number.NaN }, 125, 100, 100, 10).reason, "invalid-item");
  assert.equal(getInnFoodPreview(stew, 125, 100, 100, 80).reason, "inventory-full");
  assert.equal(getInnFoodPreview(stew, 125, 100, 23, 10).reason, "insufficient-gold");

  // Store and tests share this planner, so every invalid request is state-preserving.
  const purchaseState = { gold: 100, health: 100, inventoryCount: 10 };
  const validPurchase = planInnFoodPurchase(purchaseState, stew, ["heartyStew", "gateRations"], 125);
  assert.equal(validPurchase.success, true);
  assert.deepEqual(validPurchase.nextState, { gold: 76, health: 100, inventoryCount: 11 });
  const invalidInputs = [
    [purchaseState, undefined, ["heartyStew"]],
    [purchaseState, stew, ["gateRations"]],
    [purchaseState, { ...stew, type: "weapon" }, ["heartyStew"]],
    [purchaseState, { ...stew, basePrice: -1 }, ["heartyStew"]],
    [{ ...purchaseState, gold: 1 }, stew, ["heartyStew"]],
    [{ ...purchaseState, inventoryCount: 80 }, stew, ["heartyStew"]],
  ];
  for (const [state, item, allowList] of invalidInputs) {
    const plan = planInnFoodPurchase(state, item, allowList, 125);
    assert.equal(plan.success, false);
    assert.deepEqual(plan.nextState, state, "Rejected purchase must preserve its input gold, HP and inventory.");
  }

  // Actual store transaction boundary used by the React store; assert full state outcome.
  const integrationGuard = createInnTransactionGuard(32);
  const storeState = { gold: 100, health: 100, inventoryCount: 79 };
  const restArgs = {
    targetId: "rest", transactionId: "alma:store:rest:tx000001",
    npcId: "alma", functionId: "fn-alma",
    allowedItemIds: ["heartyStew", "gateRations"], items: [stew, rations],
    maxHealth: 125, restPrice: 60, inventoryLimit: 80,
  };
  const committedRest = executeAlmaInnTransaction(storeState, restArgs, integrationGuard);
  assert.equal(committedRest.success, true);
  assert.deepEqual(committedRest.state, { gold: 40, health: 113, inventoryCount: 79 });
  const duplicateRest = executeAlmaInnTransaction(committedRest.state, restArgs, integrationGuard);
  assert.equal(duplicateRest.success, false);
  assert.deepEqual(duplicateRest.state, committedRest.state);

  const purchaseArgs = {
    ...restArgs, targetId: "buy:heartyStew",
    transactionId: "alma:store:buy:tx000001",
  };
  const committedPurchase = executeAlmaInnTransaction(storeState, purchaseArgs, integrationGuard);
  assert.equal(committedPurchase.success, true);
  assert.equal(committedPurchase.addedItemId, "heartyStew");
  assert.deepEqual(committedPurchase.state, { gold: 76, health: 100, inventoryCount: 80 });
  const disallowed = executeAlmaInnTransaction(storeState, {
    ...purchaseArgs, targetId: "buy:unknownItem", transactionId: "alma:store:buy:tx000002",
  }, integrationGuard);
  assert.equal(disallowed.success, false);
  assert.deepEqual(disallowed.state, storeState);
  const wrongTargetPayload = executeAlmaInnTransaction(storeState, {
    ...purchaseArgs, targetId: "buy:gateRations",
  }, (id, fingerprint) => integrationGuard(purchaseArgs.transactionId, fingerprint));
  assert.equal(wrongTargetPayload.success, false);
  assert.deepEqual(wrongTargetPayload.state, storeState);

  // Duplicate submission, ID collision, invalid ID and bounded-cache eviction.
  // UI submission state machine: pending may cancel before commit; committed work cannot cancel.
  const submission = createInnSubmissionController();
  const submissionId = "alma:alma:fn-alma:submit0001";
  assert.equal(submission.begin(submissionId), true);
  assert.equal(submission.getStatus(), "pending");
  assert.equal(submission.canCommit(submissionId), true);
  assert.equal(submission.cancel(submissionId), true);
  assert.equal(submission.getStatus(), "cancelled");
  assert.equal(submission.canCommit(submissionId), false);
  assert.equal(submission.commit(submissionId), false);
  assert.equal(submission.cancel(submissionId), false);
  assert.equal(submission.begin("alma:alma:fn-alma:submit0002"), true);
  assert.equal(submission.commit("alma:alma:fn-alma:submit0002"), true);
  assert.equal(submission.getStatus(), "committed");
  assert.equal(submission.cancel("alma:alma:fn-alma:submit0002"), false);
  assert.equal(submission.begin("alma:alma:fn-alma:submit0003"), true);
  assert.equal(submission.begin("alma:alma:fn-alma:submit0004"), false, "Only one submission may be pending at a time.");
  submission.cancel("alma:alma:fn-alma:submit0003");

  const guard = createInnTransactionGuard(2);
  const firstId = "alma:fn-alma:1:abcdef1234";
  assert.equal(guard(firstId, "alma|fn-alma|rest"), "reserved");
  assert.equal(guard(firstId, "alma|fn-alma|rest"), "duplicate");
  assert.equal(guard(firstId, "alma|fn-alma|buy:heartyStew"), "collision");
  assert.equal(guard("short", "alma|fn-alma|rest"), "invalid");
  assert.equal(guard("alma:fn-alma:2:abcdef1234", "alma|fn-alma|rest"), "reserved");
  assert.equal(guard("alma:fn-alma:3:abcdef1234", "alma|fn-alma|rest"), "reserved");
  assert.equal(guard(firstId, "alma|fn-alma|rest"), "reserved");

  // Static source-contract checks; these do not replace React DOM integration tests.
  const store = fs.readFileSync(path.join(root, "src/lib/store.ts"), "utf8");
  assert.match(store, /targetId !== "rest"/);
  assert.match(store, /planInnRest\(/);
  assert.match(store, /planInnFoodPurchase\(/);
  assert.match(store, /reserveInnTransaction\(transactionId, fingerprint\)/);
  assert.match(store, /getMaxHealth\(s\)/);
  assert.match(store, /queueMicrotask\(\(\) => onResult\(settled\)\)/);
  assert.doesNotMatch(store, /hours:1/);
  assert.match(store, /const SAVE_KEY = "aimorpg-final-demo-v1-29"/);
  assert.match(store, /saveVersion: 6/);

  const ui = fs.readFileSync(path.join(root, "src/components/GameClient.tsx"), "utf8");
  assert.match(ui, /getMaxHealth\(game\)/);
  assert.match(ui, /transactionId = `alma:/);
  assert.match(ui, /cancelInnAction\("rest"\)/);
  assert.match(ui, /cancelInnAction\("food"\)/);
  assert.match(ui, /result => \{/);
  const innAction = ui.slice(ui.indexOf("const runInnAction"), ui.indexOf("const selectedCraft"));
  assert.doesNotMatch(innAction, /setTimeout/);
  assert.match(ui, /item\.type==="consumable" && fn\.itemIds\?\.includes\(item\.id\)/);

  const mainStory = fs.readFileSync(path.join(root, "src/lib/mainStory.ts"), "utf8");
  assert.equal((mainStory.match(/id:\s*"main_[^"]+"/g) ?? []).length, 60);

  console.log("Alma focused runtime tests: PASS");
  console.log("Runtime coverage: rest rounding/cap, full HP, insufficient funds, above-max HP, price validation, food allow-list, unknown/wrong item, invalid price, inventory limit, rejected-state immutability, transaction ID duplicate/collision/eviction.");
  console.log("Static source-contract checks: store/UI wiring, canonical rest target, save-v6 invariants and 60 main quests.");
  console.log("React DOM click dispatch is not dynamically exercised; no component renderer or DOM test framework is configured.");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
