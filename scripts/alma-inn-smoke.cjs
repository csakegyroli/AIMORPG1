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
  const fullHealthRest = planInnRest({ ...restState, health: 125 }, 125, 60);
  assert.equal(fullHealthRest.success, false);
  assert.deepEqual(fullHealthRest.nextState, { ...restState, health: 125 });

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

  // The same executor used by store.ts is the sole transaction path under test.
  const makeArgs = (targetId, transactionId) => ({
    targetId, transactionId, npcId: "alma", functionId: "fn-alma",
    allowedItemIds: ["heartyStew", "gateRations"], items: [stew, rations],
    maxHealth: 125, restPrice: 60, inventoryLimit: 80,
  });
  const assertBalances = (actual, expected, label) => {
    assert.equal(actual.gold, expected.gold, `${label}: gold`);
    assert.equal(actual.health, expected.health, `${label}: HP`);
    assert.equal(actual.inventoryCount, expected.inventoryCount, `${label}: inventory`);
  };
  const baseState = { gold: 100, health: 100, inventoryCount: 79 };

  // A. Insufficient gold: original balances and unreserved ID; same ID succeeds after funds recover.
  {
    const guard = createInnTransactionGuard();
    const id = "alma:case-a:tx000001";
    const args = makeArgs("rest", id);
    const before = { ...baseState, gold: 59 };
    const rejected = executeAlmaInnTransaction(before, args, guard);
    assert.equal(rejected.success, false);
    assert.equal(rejected.message, "insufficient-gold");
    assertBalances(rejected.state, before, "A rejected");
    const retry = executeAlmaInnTransaction(baseState, args, guard);
    assert.equal(retry.success, true, "A same-ID retry must succeed, proving no reservation on failed preflight.");
    assertBalances(retry.state, { gold: 40, health: 113, inventoryCount: 79 }, "A retry");
    const duplicate = executeAlmaInnTransaction(retry.state, args, guard);
    assert.equal(duplicate.success, false);
    assert.equal(duplicate.message, "duplicate");
    assertBalances(duplicate.state, retry.state, "A guard after retry");
  }

  // B. Maximum HP: no charge or mutation; same ID remains available for a valid rest.
  {
    const guard = createInnTransactionGuard();
    const id = "alma:case-b:tx000001";
    const args = makeArgs("rest", id);
    const fullHp = { ...baseState, health: 125 };
    const rejected = executeAlmaInnTransaction(fullHp, args, guard);
    assert.equal(rejected.success, false);
    assert.equal(rejected.message, "full-health");
    assertBalances(rejected.state, fullHp, "B rejected");
    const retry = executeAlmaInnTransaction(baseState, args, guard);
    assert.equal(retry.success, true, "B same-ID retry must succeed after HP is no longer full.");
    assertBalances(retry.state, { gold: 40, health: 113, inventoryCount: 79 }, "B retry");
  }

  // C. Item outside fn.itemIds: unchanged balances and unreserved ID; allow-listed retry succeeds.
  {
    const guard = createInnTransactionGuard();
    const id = "alma:case-c:tx000001";
    const disallowedArgs = makeArgs("buy:outsiderItem", id);
    const before = { ...baseState };
    const rejected = executeAlmaInnTransaction(before, disallowedArgs, guard);
    assert.equal(rejected.success, false);
    assert.equal(rejected.message, "invalid-item");
    assertBalances(rejected.state, before, "C rejected");
    const allowedArgs = makeArgs("buy:heartyStew", id);
    const retry = executeAlmaInnTransaction(before, allowedArgs, guard);
    assert.equal(retry.success, true, "C same-ID retry with allow-listed payload must succeed.");
    assert.equal(retry.addedItemId, "heartyStew");
    assertBalances(retry.state, { gold: 76, health: 100, inventoryCount: 80 }, "C retry");
  }

  // D. Successful transaction followed by identical request: duplicate and no second mutation.
  {
    const guard = createInnTransactionGuard();
    const id = "alma:case-d:tx000001";
    const args = makeArgs("rest", id);
    const first = executeAlmaInnTransaction(baseState, args, guard);
    assert.equal(first.success, true);
    assertBalances(first.state, { gold: 40, health: 113, inventoryCount: 79 }, "D first");
    const second = executeAlmaInnTransaction(first.state, args, guard);
    assert.equal(second.success, false);
    assert.equal(second.message, "duplicate");
    assertBalances(second.state, first.state, "D duplicate");
  }

  // E. Same ID with a different, independently valid payload: collision and no mutation.
  {
    const guard = createInnTransactionGuard();
    const id = "alma:case-e:tx000001";
    const firstArgs = makeArgs("rest", id);
    const first = executeAlmaInnTransaction(baseState, firstArgs, guard);
    assert.equal(first.success, true);
    const collisionArgs = makeArgs("buy:heartyStew", id);
    const collision = executeAlmaInnTransaction(first.state, collisionArgs, guard);
    assert.equal(collision.success, false);
    assert.equal(collision.message, "collision");
    assertBalances(collision.state, first.state, "E collision");
  }

  // Other executor rejections also preserve all three mutable balances.
  {
    const cases = [
      ["buy:unknownItem", baseState, [stew, rations]],
      ["buy:blade", baseState, [stew, rations, { id: "blade", type: "weapon", basePrice: 10 }]],
      ["buy:heartyStew", { ...baseState, inventoryCount: 80 }, [stew, rations]],
      ["buy:heartyStew", { ...baseState, gold: 1 }, [stew, rations]],
      ["invalid-target", baseState, [stew, rations]],
    ];
    for (let index = 0; index < cases.length; index += 1) {
      const [target, state, items] = cases[index];
      const guard = createInnTransactionGuard();
      const args = { ...makeArgs(target, `alma:extra:tx00000${index + 1}`), items };
      const result = executeAlmaInnTransaction(state, args, guard);
      assert.equal(result.success, false);
      assertBalances(result.state, state, `Extra rejection ${index + 1}`);
      // The failed ID remains unreserved; a valid rest with the same ID can reserve it.
      const retry = executeAlmaInnTransaction(baseState, makeArgs("rest", args.transactionId), guard);
      assert.equal(retry.success, true);
      assertBalances(retry.state, { gold: 40, health: 113, inventoryCount: 79 }, `Extra retry ${index + 1}`);
    }
  }

  // The bounded guard itself remains session-local and evicts oldest receipts at its configured cap.
  const boundedGuard = createInnTransactionGuard(2);
  const firstId = "alma:guard:tx000001";
  assert.equal(boundedGuard(firstId, "alma|fn-alma|rest"), "reserved");
  assert.equal(boundedGuard(firstId, "alma|fn-alma|rest"), "duplicate");
  assert.equal(boundedGuard(firstId, "alma|fn-alma|buy:heartyStew"), "collision");
  assert.equal(boundedGuard("short", "alma|fn-alma|rest"), "invalid");
  assert.equal(boundedGuard("alma:guard:tx000002", "alma|fn-alma|rest"), "reserved");
  assert.equal(boundedGuard("alma:guard:tx000003", "alma|fn-alma|rest"), "reserved");
  assert.equal(boundedGuard(firstId, "alma|fn-alma|rest"), "reserved", "Oldest receipt is evicted at the configured cap.");

  // Pending/cancel controller tests remain separate from React DOM click-flow coverage.
  const submission = createInnSubmissionController();
  const submissionId = "alma:submit:tx000001";
  assert.equal(submission.getStatus(), "idle");
  assert.equal(submission.begin(submissionId), true);
  assert.equal(submission.getStatus(), "pending");
  assert.equal(submission.canCommit(submissionId), true);
  assert.equal(submission.cancel(submissionId), true);
  assert.equal(submission.getStatus(), "cancelled");
  assert.equal(submission.canCommit(submissionId), false);
  assert.equal(submission.commit(submissionId), false);
  assert.equal(submission.cancel(submissionId), false);
  submission.reset();
  const committedId = "alma:submit:tx000002";
  assert.equal(submission.begin(committedId), true);
  assert.equal(submission.commit(committedId), true);
  assert.equal(submission.getStatus(), "committed");
  assert.equal(submission.cancel(committedId), false);
  assert.equal(submission.commit(committedId), false);
  submission.reset();
  assert.equal(submission.getStatus(), "idle");
  assert.equal(submission.begin("alma:submit:tx000003"), true, "A later submission must not remain locked.");

  // Static source-contract checks; these do not replace React DOM integration tests.
  const store = fs.readFileSync(path.join(root, "src/lib/store.ts"), "utf8");
  assert.match(store, /targetId !== "rest"/);
  assert.match(store, /planInnRest\(/);
  assert.match(store, /planInnFoodPurchase\(/);
  assert.match(store, /reserveInnTransaction\(transactionId, fingerprint\)/);
  assert.match(store, /getMaxHealth\(s\)/);
  assert.match(store, /queueMicrotask\(\(\) => onResult\(settled\)\)/);
  assert.match(store, /if \(isInn && transactionId && !innSubmissionController\.canCommit\(transactionId\)\)/);
  assert.match(store, /finishInnSubmission\(\)/);
  const executorSource = fs.readFileSync(path.join(root, "src/lib/innService.ts"), "utf8");
  assert.ok(executorSource.indexOf("const plan =") < executorSource.indexOf("const idResult = reserve("), "The transaction plan must be built before ID reservation.");
  assert.ok(executorSource.indexOf("if (!plan.success)") < executorSource.indexOf("const idResult = reserve("), "Failed preflight must return before ID reservation.");
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
