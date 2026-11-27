# AIMORPG — GATE CITY / DAMAR
## PHASE 2 — OWNER-APPROVED SHIPMENT ARCHITECTURE DECISION PACKAGE

**Status:** OWNER-APPROVED ARCHITECTURAL DIRECTION / DOMAIN DETAILS TO BE SOURCE-VERIFIED  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Branch:** `gate-city/phase-1-specification`  
**Mode:** Documentation and source verification only. No implementation authorization.

## 1. Binding owner decisions

This package applies the following approved decisions:

- NPC transaction/idempotency: hybrid. Initial single-player demo may use client-side business-logic protection with stable transaction ID and duplicate-execution guard. This is not server security. Document the future server-authority transition.
- Shipment: Model A — one Shipment aggregate for current state plus a Shipment-scoped custody event log.
- Partial receipt: item/manifest-line level, with quantities and outcomes explicit.
- Authority: ordinary low-risk single-player demo may remain client-side initially. High-value, chance-based, competitive or future multiplayer-affecting economic settlement requires server authority before trusted release.
- Save/migration: prepare a separate versioned migration plan before each new persistent domain state. Protect old saves. No general save-system redesign.

## 2. Alpha.26 source baseline

The existing source audit recorded:

- `src/lib/content.ts`: `fn-damar`, kind `warehouse`; no authored `itemIds` allow-list or shipment manifest definition was verified.
- `src/lib/store.ts`: the current warehouse action is handled through the generic NPC service path; it does not implement shipment inspection, seal validation, custody transfer or manifest settlement.
- `src/lib/types.ts`: existing `InventoryItem` shape is `{ instanceId, itemId }`.
- `src/lib/store.ts`: client-side persistence; save key `aimorpg-final-demo-v1-29`, payload `saveVersion: 6`.
- No persistent shipment, manifest, custody event or warehouse stock aggregate was verified in alpha.26.

These are baseline findings, not a claim that future branch code already implements the model.

## 3. Approved domain boundary

### 3.1 Shipment aggregate

Shipment is the single source of truth for the current state of one authored shipment. It owns:
- stable `shipmentId`;
- authored sender and recipient references;
- manifest lines;
- shipment-level current status derived from line outcomes and custody state;
- references to its own custody history;
- stable operation/transaction identifiers for state-changing commands.

Shipment does **not** own a second item catalogue, inventory, generic event bus, general ledger or quest registry.

### 3.2 Manifest line

A manifest line describes the expected content of one shipment line. The eventual implementation must define, after source verification:
- stable `lineId`;
- canonical `itemId`;
- expected quantity;
- exact existing item-instance references where the current inventory model requires unique instances;
- inspected quantity;
- accepted quantity;
- rejected quantity;
- held quantity;
- line-level result and reason;
- custody/ownership transfer outcome.

**Important unresolved quantity rule:** alpha.26's visible InventoryItem shape is instance-based. Do not assume stack semantics. If one unit corresponds to one instance, quantity must reconcile to the number of valid instance references. If a current stackable item path exists, document its exact source and rules before proposing an alternate representation. Never create duplicate item instances to make counts match.

### 3.3 Line-level outcomes

Candidate semantic outcomes for specification and tests:

- `PENDING`: not yet inspected/decided;
- `ACCEPTED`: accepted quantity is eligible for transfer under the approved custody rule;
- `PARTIALLY_ACCEPTED`: only a subset is accepted;
- `REJECTED`: rejected quantity is not transferred to the recipient;
- `HELD`: disputed quantity remains under controlled custody pending resolution.

These labels are domain vocabulary for the specification. Confirm exact enum values and allowed transitions against source and owner approval before freezing code contracts.

### 3.4 Shipment-level status

Shipment-level status must be derived from its manifest lines and custody state. It must not collapse partial outcomes into a false all-or-nothing result.

The specification must cover:
- all lines pending;
- all lines accepted;
- mixed accepted/rejected quantities;
- one or more held quantities;
- all lines rejected;
- cancelled/invalid shipment before custody transfer;
- terminal/closed shipment and prevention of replay.

Exact status enum and transition graph remain to be source-verified and separately proposed; do not silently canonize a guessed list.

## 4. Shipment-scoped custody event log

The custody log belongs to the Shipment aggregate. It is not a universal event framework.

Each event should document:
- stable `custodyEventId`;
- `shipmentId`;
- optional `lineId` when the event applies to one line;
- event type;
- actor/reference;
- timestamp;
- from/to custody state where applicable;
- reason/evidence references;
- transaction ID that committed the operation.

The event history is append-only at the domain level. Corrections are represented by a new compensating/corrective event, not by rewriting historical evidence.

Potential event vocabulary for source-backed specification:
- prepared;
- dispatched/handed over;
- received for inspection;
- inspected;
- held;
- accepted;
- partially accepted;
- rejected;
- transferred;
- closed.

These are candidate labels, not yet an approved source enum. Document permitted event ordering and invalid transitions. A custody event does not automatically prove authenticity, guilt, quest completion or evidence admissibility.

## 5. Transaction and idempotency contract

### Initial single-player demo

- Each state-changing command carries a stable transaction ID.
- The client/store business layer checks whether that operation has already been applied.
- The transaction validates shipment status, line identity, quantities, item-instance ownership and funds/costs before mutation.
- All related local state changes must be applied as one logical operation.
- A duplicate submission returns the recorded/original outcome or a deterministic duplicate result; it must not transfer items or debit/credit twice.
- Reload/re-entry must not make a committed operation executable again.

### Future server authority

Document a migration-compatible request/response boundary now:
- client sends operation ID, shipment/line IDs and requested action;
- server reloads authoritative shipment and item ownership state;
- server validates permissions, current state, quantity and operation identity;
- server resolves the operation once and atomically commits item custody, shipment state, custody event and transaction result;
- retry with the same operation ID returns the original committed result;
- same ID with a different payload is rejected as a conflict;
- client displays server result and never declares success before confirmation.

The exact server API, persistence technology, transaction ledger and conflict retention are still open. Do not invent a backend endpoint or claim one exists.

## 6. Authority classification

Damar's ordinary inspection UI can be specified independently. A client-only alpha.26 prototype may demonstrate local rules, but must be labelled demo-only and must not claim trusted custody or economic settlement.

Before any release that transfers high-value assets, settles contested value, affects competition or impacts multiplayer state, classify the transaction under the central risk threshold and require server authority if it meets the threshold.

The numerical/qualitative high-value threshold remains an open central decision.

## 7. Per-domain save migration

Shipment state is a new persistent domain state and therefore requires its own migration plan before implementation.

The plan must include:
- source payload version and exact legacy fixtures;
- new shipment state location and version;
- safe default for saves without shipment data;
- malformed/missing/duplicate shipment and line handling;
- item-instance reference validation;
- idempotent migration behavior;
- load → action → save → reload tests;
- recovery/rollback and release conditions.

Do not change save key `aimorpg-final-demo-v1-29` or global `saveVersion: 6` in this documentation task. Do not create a broad save rewrite.

## 8. Cross-district references

- Petar may refer to a Shipment ID or authorized delivery instruction; he must not create a second cargo inventory or custody history.
- Vera may inspect source-backed shipment/document references; a custody event is not automatically a verified evidence verdict.
- Cador may reference approved shipment/document identifiers for ledger review; he must not rewrite shipment custody.
- Rovan/Lena may reference Shipment ID and custody event IDs in a case. Case admissibility and conclusions remain a separate evidence contract.
- The Old Edge expedition system may reference existing item instances only under its own approved loadout/custody rules.

No automatic cross-district quest completion or evidence acceptance is implied.

## 9. Required test matrix

1. Valid shipment and manifest load.
2. Unknown shipment ID rejected.
3. Unknown line ID rejected.
4. Unauthorized actor rejected.
5. Exact item-instance ownership match.
6. Unknown/non-owned item instance rejected.
7. Expected quantity matches available instance references.
8. Quantity greater than available references rejected.
9. Zero, negative, fractional (where disallowed), NaN and infinite quantities rejected.
10. Full line acceptance.
11. Full line rejection.
12. Partial acceptance with explicit accepted/rejected quantities.
13. Held quantity cannot transfer to recipient.
14. Rejected quantity cannot transfer to recipient.
15. Sum of accepted/rejected/held quantities cannot exceed expected quantity.
16. Shipment aggregate status correctly reflects mixed line outcomes.
17. Duplicate transaction ID does not repeat transfer.
18. Same transaction ID with changed payload is rejected/conflicted.
19. Duplicate UI submission cannot double-apply the operation.
20. Reload after commit preserves the result and prevents replay.
21. Invalid custody event order rejected.
22. Custody history remains append-only.
23. Corrective event does not erase prior event.
24. Legacy save without shipment state loads with safe empty/default state after future migration.
25. Migration is idempotent.
26. Malformed shipment data is safely normalized/rejected without item loss.
27. Quest/evidence-protected item cannot be silently transferred.
28. No unrelated main quest node or NPC hook changes.

These are proposed tests; none are reported as executed.

## 10. Remaining owner decisions / technical questions

1. What exactly counts as one shipment line when one item ID can have multiple unique instances?
2. Are partial quantities within a single line allowed, or must each unique item instance be its own line?
3. At what exact event does custody transfer from sender to receiver?
4. Can a held line be released by Damar alone, or does it require another NPC/document authority?
5. Which shipment/line outcomes are terminal and can never be reopened?
6. What is the high-value transaction threshold?
7. What is the canonical transaction ID scope/retention and same-ID/different-payload policy?
8. Which cross-district document/evidence contract is allowed to consume custody references?

## 11. Scope and release gate

- Documentation only; no TypeScript, React, store, backend or save implementation.
- Do not alter Canon or the 60 main quest nodes.
- Do not create a generic event bus, second inventory, cargo stock registry or parallel item definitions.
- Do not start Damar implementation before Alma Varg has explicit owner acceptance and Damar receives a separate implementation authorization.
- Alma PR #11 remains draft and unmerged until owner acceptance.
