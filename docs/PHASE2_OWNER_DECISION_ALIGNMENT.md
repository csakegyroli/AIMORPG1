# AIMORPG PHASE 2 — OWNER DECISION ALIGNMENT

**Status:** OWNER-APPROVED ARCHITECTURE INPUT  
**Baseline:** AIMORPG v2.0.0-alpha.26  
**Approval date:** 2026-11-27  
**Scope:** Documentation and source-verification alignment only. This file does not authorize implementation, merge, Canon edits, or save-schema changes.

## Binding central decisions

1. **NPC transaction/idempotency — HYBRID.** Initial single-player demo actions may use client-side business-logic protection with a stable transaction ID and duplicate-execution guard. The client is not a security boundary. Document the future server-authority transition contract now.
2. **Shipment — MODEL A.** Damar uses one Shipment aggregate for current state and a Shipment-scoped custody event log for handoff/receipt history. Do not create a universal event bus.
3. **Partial receipt — ITEM/LINE LEVEL.** Each shipment line can have its own quantity and receipt outcome. Reuse existing item instances and inventory; no parallel cargo/item system.
4. **Authority — RISK-TIERED.** Ordinary low-risk single-player demo interactions may remain client-side initially. High-value, chance-based, competitive, or future multiplayer-affecting economic settlement requires server authority before it can be trusted. Client-only outcomes in those categories are practice/demo outcomes, not trusted settlement.
5. **Save/migration — PER NEW PERSISTENT DOMAIN STATE.** Before each new persistent domain state, prepare its own versioned migration plan, backward-compatibility checks, defaults/normalization, malformed-data handling and tests. No general save-system redesign is implied.

## Required implementation/specification discipline

- Use a stable transaction ID for every state-changing NPC operation; same operation ID must not execute twice.
- Document same-key/different-payload behavior, retry semantics and transaction-result history as open technical details until centrally approved.
- Document the server migration boundary even when the initial demo implementation remains client-side.
- Do not call client-side validation server security or server authority.
- Do not change global save key/version or add persisted fields without a domain-specific migration plan and explicit implementation approval.
- Preserve the alpha.26 Canon, all 60 main quest nodes, shared currencies, rarity rules and existing InventoryItem shape.
- Continue all independent local specification and source-verification work. A shared open question blocks only the dependent feature, not unrelated work.
- No automatic merge, no cross-branch integration, and no implementation without separate authorization.

## Remaining central decisions (still open)

- Transaction ID format/scope, retention, payload mismatch and conflict policy.
- High-value/competitive classification threshold.
- Server service architecture, trusted RNG, durable ledger/result record and audit contract.
- Shipment quantity splitting, custody transfer timing and terminal-state semantics.
- Shared item-instance schema extension, if needed.
- Durability/repair; +1–+9 enhancement; shared mastery; canonical recipe schema.
- Persistent minigame session/save policy; cross-district permissions and evidence provenance.
- A Szem observation extensions; Ilren region/district discrepancy; shared-file ownership and merge order.

## Status reporting

Every district must report: (a) completed source verification, (b) local specification still progressing, (c) features blocked specifically by an open central decision, (d) tests proposed versus actually executed, and (e) any requested owner decision. Do not report a proposed contract as implemented.

## Gate City application

- **Alma Varg:** PR #11 remains draft/unmerged and requires explicit owner acceptance. No next NPC code implementation before that acceptance. Continue only the already-requested Alma repair/review work.
- **Damar:** continue specification using Shipment aggregate + Shipment-scoped custody log. Line-level partial receipt is approved. Do not create cargo inventory. Exact quantity-splitting and item-instance custody semantics remain open.
- **Petar:** route/delivery specification and source verification may continue independently; use stable transaction identity and do not invent a route graph or custody model.
- **Vera Noll:** read-only appraisal/evidence source verification may continue. Issuing trusted evidence remains dependent on the shared provenance/authority contract.
- **Jarek:** map and route source verification may continue. Persistent discovery requires its own migration plan; do not create a second route graph.

Implementation order: Alma owner acceptance → separate authorization for next NPC implementation. Damar documentation is not blocked by Alma; Damar code implementation remains blocked.
