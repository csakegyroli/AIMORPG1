# AIMORPG PHASE 2 — GATE CITY / ALMA VARG
## First serial NPC vertical slice — owner-authorized execution

**Canonical code baseline:** `main` (AIMORPG v2.0.0-alpha.26 code)
**Working branch:** `gate-city/phase-2-alma`
**Execution mode:** one NPC at a time; Gate City is the active district.
**Scope:** Alma Varg (`alma`, `fn-alma`) only.

## Why Alma is first
The alpha.26 source already defines `fn-alma` as `kind: "inn"`, with a 60 gold rest service and the existing food items `heartyStew` and `gateRations`. Unlike Damar's warehouse proposal and Petar's transport proposal, Alma already has a dedicated `inn` runtime branch in `src/lib/store.ts`. This makes Alma the lowest-dependency first vertical slice without inventing a new shared logistics or evidence model.

This is a sequencing decision, not a Canon change. Damar remains the first Gate City specification task and next NPC in the Gate City queue unless the owner changes order; Alma is the first implementation slice because its runtime contract is already present.

## Protected baseline and constraints
- Do not change the 60 main quests, NPC identity/Canon, region routing, global economy, item registry, rarity, relationship model, or A Szem behavior.
- Do not add a local currency, local reputation, profession mastery, item-instance fields, or a new save-state model.
- Preserve the current save key/version and all legacy migrations unless a separately approved shared change is requested.
- No forced real-time wait, daily mandatory loop, energy system, or Pay-to-Win.
- Do not alter existing authored rest or food effects without evidence and explicit owner approval.
- Do not edit shared files outside the narrow approved Alma runtime/UI/test integration required by this slice. Any shared-contract change must be raised, not silently implemented.
- No merge to `main` without owner review and approval.

## Required work sequence
1. Read the full Alma NPC and function definitions, UI interaction path, `inn` handler, item effects, save normalization, and related tests from the current `main` baseline.
2. Write a concise implementation plan listing exact files to touch, current behavior, gaps, and regression tests. Do not start broad refactors.
3. Implement Alma as one coherent playable service using the existing shared systems:
   - explicit rest option and food purchase option;
   - clear price/effect preview before confirmation;
   - correct HP cap and no charge when rest cannot provide healing;
   - validate food against Alma's existing `itemIds`;
   - reject insufficient gold and full inventory without partial mutation;
   - prevent double submission / duplicate purchase where the current UI path allows it;
   - clear success, failure, and cancel feedback;
   - preserve the original item effects and rest rule.
4. Add or update focused automated tests for success, full HP, partial HP, HP cap, insufficient funds, full inventory, valid/invalid food ID, duplicate action, cancellation, reload/save compatibility, and protected quest/item invariants.
5. Run the repository's actual test, lint and build commands where available. Report exact commands and outcomes; do not claim unrun checks passed.
6. Update the Gate City specification with verified implementation references and mark Alma only as implemented / pending central review. Do not mark accepted until owner review.
7. Stop. Do not begin Damar or another NPC until Alma's PR/diff has been reviewed.

## Deliverables
- One isolated, reviewable Alma Varg vertical slice.
- Focused tests and exact test report.
- A short source map identifying the runtime/UI/persistence paths used.
- A pull request to `main` (prefer draft until checks are complete), with no unrelated files.

## Explicitly out of scope
- Damar cargo manifests, warehouse ledger, evidence chain.
- Petar route/delivery state or item custody.
- Vera evidence/coin-authentication model.
- Jarek persistent discovery/map model.
- Shared NPC action/result contract redesign.
- Server-authoritative architecture project.
- Any global save schema change.

## Completion report format
1. Files changed and why.
2. Player-facing before/after behavior.
3. Tests added and exact commands/results.
4. Save compatibility and exploit checks.
5. Remaining gaps / central decisions.
6. PR URL and merge status (must remain unmerged).


## Alma Varg — implementation closure notes (owner review)

### Runtime contract
- The canonical rest target is exactly `rest`. The store rejects `hours:1`, `1`, undefined and any unknown rest target.
- No rest target or pending inn transaction is persisted in save v6. No migration was added.
- The rest plan charges 60 gold and restores `ceil(10% of max HP)`, capped at the calculated maximum. If HP is already full/above max, no rest transaction is applied.
- Food purchase is limited to existing `fn-alma.itemIds`, and each ID must resolve to an existing consumable with a finite, non-negative price. The store and UI both enforce that allow-list.
- `heartyStew` and `gateRations` definitions/effects remain unchanged.

### Transaction identity and protection
- Each UI submission receives a unique ID composed of the Alma NPC ID, function ID, local timestamp and random suffix.
- The store reserves that ID before queueing the functional state update. A repeated ID+target is rejected as duplicate; reuse of the same ID with another target is rejected as a collision.
- The bounded receipt map stores at most 256 recent IDs in client memory. It is lost on reload and old entries can be evicted; it is not persistent idempotency and is not server-side security.
- The existing functional store update evaluates gold, health and inventory from the latest state. The completion callback returns the resolved action result once, and the UI keeps its lock until that result is delivered rather than using a fixed delay.

### HP parity and cancellation
- The UI preview and store action both call the exported `getMaxHealth` calculation. It includes current equipment and active temporary stat/item buffs.
- Cancel resets pending/lock/selection before submission and performs no store mutation. The control is disabled while a submitted transaction is pending; a submitted or committed store action cannot be rolled back.

### Test scope
- `scripts/alma-inn-smoke.cjs` dynamically exercises the pure rest/purchase planners and the bounded transaction-ID guard.
- Its static contract checks verify store/UI wiring, canonical target, save key/version and the 60 main quests.
- React DOM click dispatch and the full React hook lifecycle are not dynamically tested because this repository has no configured component renderer or DOM test framework.


## Main alignment plan — 2026-11-27

Current comparison was refreshed against `main` at `2190291a6a58fe907f5aa737e4c466a6f334a08c`. The current Alma branch head at the time of this plan is `c9cc8ffddab57a3a48b7976eea92cba92a413c58`; comparison reports 25 commits ahead, 2 commits behind, with merge base `894e9606fa84f5d609d810152e326b1cfae09b18`.

Missing main commits:
1. `076239c4e6c0aeffd698520125882a61c939f1d9` — `docs: record owner-approved PHASE 2 architecture decisions`
2. `2190291a6a58fe907f5aa737e4c466a6f334a08c` — `docs: reconcile shared architecture open decisions with PHASE 2 approvals`

Reviewed diffs:
- Commit 1 adds §16 owner-approved PHASE 2 architecture decisions to `docs/OUTSKIRTS_PHASE1_SHARED_ARCHITECTURE.md`.
- Commit 2 refines §14 open decision wording in the same file.
- Neither changes any of the six files currently changed by Alma PR #11. No direct file-level overlap is present.

Potential conflict assessment:
- No same-file conflict is expected with the current six-file Alma diff.
- A history-level integration conflict remains possible because the branch diverged from main at the alpha.26 merge base.
- The two commits are ordered and both required: apply 076239c first, then 2190291c.

Safe integration procedure (NOT EXECUTED in this environment):
```bash
git fetch origin
git checkout gate-city/phase-2-alma
git status --short
git rev-parse HEAD
git rev-parse origin/main
git show --stat --oneline 076239c4e6c0aeffd698520125882a61c939f1d9
git show --stat --oneline 2190291a6a58fe907f5aa737e4c466a6f334a08c
git show --format=fuller --find-renames 076239c4e6c0aeffd698520125882a61c939f1d9 -- docs/OUTSKIRTS_PHASE1_SHARED_ARCHITECTURE.md
git show --format=fuller --find-renames 2190291a6a58fe907f5aa737e4c466a6f334a08c -- docs/OUTSKIRTS_PHASE1_SHARED_ARCHITECTURE.md
git cherry-pick 076239c4e6c0aeffd698520125882a61c939f1d9
git cherry-pick 2190291a6a58fe907f5aa737e4c466a6f334a08c
git diff --check
git status --short
git diff --name-only origin/main...HEAD
git log --oneline origin/main..HEAD
git push origin gate-city/phase-2-alma
```

Expected scope after integration:
- Alma implementation remains confined to the six existing PR files.
- The one additional file `docs/OUTSKIRTS_PHASE1_SHARED_ARCHITECTURE.md` is included only because it contains the two owner-approved main decisions being integrated.
- No main ref is modified. No force push, rebase, merge, or PR merge is performed.
- If cherry-pick reports a conflict, stop, preserve the conflict details, and request owner/central direction; do not resolve by guessing.

Blocker:
The connected GitHub tool can inspect and write individual files/commits, but does not provide a local git checkout or cherry-pick operation. Local `git clone` previously failed with `Could not resolve host: github.com`. Therefore the two commits are reviewed and their exact integration plan is documented, but they have NOT been integrated.


## Owner follow-up — technical closure pass (2026-11-27)

### Targeted code fixes committed
- Removed an accidental self-import from `src/lib/innService.ts`; planner functions and `InnTransactionState` are declared in that same module and are referenced directly.
- Changed `executeAlmaInnTransaction` so it completes plan validation before reserving the ID. A failed preflight therefore leaves gold/HP/inventory unchanged and does not burn the ID; a corrected retry can proceed. A successful request reserves the ID, and repeats are rejected as duplicate/collision.
- In `src/lib/store.ts`, re-check the pending submission controller from inside the functional state updater immediately before any store mutation. A cancel that wins before that updater executes now prevents the transaction from committing.
- Terminalize the submission controller on both successful and rejected execution paths, so invalid NPC/presence/preflight exits do not leave a pending lock behind.
- Expanded `scripts/alma-inn-smoke.cjs` to execute the same `executeAlmaInnTransaction` boundary called by the store, including rest/purchase, full HP, insufficient gold, allow-list failures, unknown/non-consumable items, full inventory, duplicate/collision, failed-preflight retry, and controller cancel/commit/reset behavior.

### Runtime evidence
- Environment: Node `v22.16.0`; npm `10.9.2`; globally available TypeScript `5.8.3`.
- The current branch test source was exercised in an isolated local harness with the same `innService.ts` implementation and expanded runtime assertions. Result: **PASS** — `Alma executor, planners, idempotency guard, and pending/cancel state-machine runtime checks.`
- Scope limitation: the full repository checkout and all source dependencies were not present locally. The isolated harness exercised the shared transaction executor and state-machine module; it did not mount React or dispatch DOM clicks, and it was not the complete repository test suite.

### Full project checks — NOT RUN against the branch checkout
A complete `gate-city/phase-2-alma` git checkout could not be established. No `.git` repository exists in the available local project directories. DNS resolution for `github.com`, `api.github.com`, and `raw.githubusercontent.com` fails with `Temporary failure in name resolution`; there is no configured HTTP(S) proxy. Thus the full project dependency lockfile/node_modules are unavailable here.
- `npm test`: **NOT RUN** as the complete project script. The focused Alma runtime test above passed in isolation.
- `npm run lint`: **NOT RUN** against the repository. A diagnostic attempt in the isolated harness exited 1 because the full TypeScript project and tsconfig/dependencies were not present; the global compiler reports 5.8.3, not the repository-declared 5.9.3.
- `npm run build`: **NOT RUN** against the repository. The isolated harness has no Next.js installation; diagnostic attempt exited 127 (`next: not found`).
- `npm ci`: **NOT RUN**; there is no branch checkout/lockfile available locally and DNS resolution is failing.

### Main alignment
The current GitHub compare still reports 33 commits ahead and 2 behind main, with merge base `894e9606fa84f5d609d810152e326b1cfae09b18`. The two main commits were individually fetched and their complete diffs reviewed. Both only touch `docs/OUTSKIRTS_PHASE1_SHARED_ARCHITECTURE.md`, in order 076239c then 2190291. Direct path collision with Alma's six PR files is absent. Git cherry-pick was not performed because there is no local checkout and no working GitHub DNS; no conclusion about history-level conflict-free cherry-picking is claimed.

### Remaining limitations / status
- The React hook/UI click lifecycle is not dynamically verified; no DOM renderer is configured in this isolated environment.
- Store functional-updater integration is established by source inspection and the shared executor/state-machine tests, not a live React mount.
- The 256-entry receipt guard remains session-memory-only; it is not durable idempotency or server security.
- No save key/version, save schema, InventoryItem, Canon, item definitions, or main quest data were intentionally changed.
- PR #11 remains **Open / Draft / Unmerged**. Alma remains pending explicit owner acceptance. No other NPC implementation was started.


## Owner follow-up — transaction reservation order correction (2026-11-27)

### Implementation
- Reordered `executeAlmaInnTransaction`: validate the target and request identity payload; construct the rest/purchase plan; return the unchanged input state for failed preflight without mutating the receipt map; only then perform the mutating ID reservation and return the planned next state.
- Added `isValidInnTransactionId` so malformed IDs are rejected before planning/reservation.
- The bounded session guard now supports a read-only `probe` argument. If a plan fails, the executor probes only for an existing receipt: a previously committed identical request remains `duplicate`, and reuse with another payload remains `collision`. If no receipt exists, the preflight reason is returned and the ID remains unreserved. This preserves deterministic idempotency without burning IDs on failed attempts.
- Production store still calls this same `executeAlmaInnTransaction` function and the same 256-entry in-memory guard. No store, UI, save, Canon, item-definition, or main-quest file was changed in this reservation-order pass.

### Exact execution order
1. Validate args object, target (`rest` or non-empty `buy:<itemId>`), NPC/function identity, allow-list/items arrays, and transaction ID format.
2. Build the applicable `planInnRest` or `planInnFoodPurchase` plan.
3. If the plan fails, perform a read-only guard probe. Return existing `duplicate`/`collision` if already recorded; otherwise return the preflight reason and original state. No receipt is inserted.
4. If the plan succeeds, mutate the receipt guard. Reject `duplicate`/`collision`; only `reserved` returns the planned next state.

### Targeted test evidence
- Updated `scripts/alma-inn-smoke.cjs` to invoke the same exported executor used by the production store. Cases A–E cover insufficient gold, max HP, non-allow-listed item, post-success duplicate, and ID/payload collision. Case F covers invalid target. Every rejected case checks gold, HP and inventory separately; same-ID retries prove failed preflights did not reserve.
- Case D deliberately replays a rest after the first rest reduced gold below the rest price. The expected result is still `duplicate`, not `insufficient-gold`.
- Case E deliberately collides after the first rest leaves the bag full. The expected result is still `collision`, not `inventory-full`.
- The first local test attempt exposed this duplicate-vs-preflight edge case and failed as expected. The read-only probe was then added; the final focused run passed all 7 assertions/groups.

### Exact staged-file runtime
The available local environment does not contain a full Git checkout. For a targeted run, the exact current branch blobs were staged into an isolated directory:
- `src/lib/innService.ts`, blob `bdf57408a35d5f3dfcf5e6409f8bfcb00303fa33`
- `scripts/alma-inn-smoke.cjs`, blob `0dcf08d6cbbf9f2d44982a2cf9cb6f890d8ba1d3`

Both local files were verified with `git hash-object` to match those GitHub blob SHAs byte-for-byte. Command:
```bash
NODE_PATH=/opt/nvm/versions/node/v22.16.0/lib/node_modules node scripts/alma-inn-smoke.cjs
```
Environment: Node `v22.16.0`, npm `10.9.2`, global TypeScript `5.8.3`.
Actual output:
```text
A — insufficient gold / unchanged balances / same-ID retry: PASS
B — maximum HP / unchanged balances / same-ID retry: PASS
C — fn.itemIds rejection / unchanged balances / same-ID allow-list retry: PASS
D — successful transaction replay / deterministic duplicate / no second mutation: PASS
E — same-ID different payload / deterministic collision / no mutation: PASS
F — invalid target / unchanged balances / same-ID retry: PASS
Executor source order: plan and failed-preflight check precede mutating ID reservation: PASS
Alma transaction reservation-order tests: PASS (7/7)
```

This is a genuine Node runtime execution of the exact branch helper and test file blobs, but not an execution from a complete branch checkout. The full project `npm test`, `npm run lint`, and `npm run build` remain separate NOT RUN checks.

### Repository and main alignment
- Node and npm are available; the isolated runtime test ran successfully.
- A full branch checkout and remote fetch remain blocked: `git ls-remote https://github.com/csakegyroli/AIMORPG1.git refs/heads/gate-city/phase-2-alma` returned exit 128 with `fatal: unable to access 'https://github.com/csakegyroli/AIMORPG1.git/': Could not resolve host: github.com`.
- Main compare remains 2 commits behind, merge base `894e9606fa84f5d609d810152e326b1cfae09b18`. The two documented main commits were reviewed previously, but no cherry-pick or history-level conflict test was possible here.
- PR remains Open / Draft / Unmerged. No main update, force push, merge, or other NPC implementation was performed.
