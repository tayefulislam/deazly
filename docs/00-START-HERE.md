---
tags: [marketplace, index, ux, engineering]
status: design-spec
---
# Start Here — Marketplace Design and Implementation

## Product objective
A shared marketplace where customers purchase offers from multiple vendors in one checkout. Vendors own their products and decide discounted prices; the platform centrally controls advertising and may perform delivery via one or many warehouses.

## Read order for an AI coding agent

1. Read `AGENTS.md` before editing anything.
2. Read [[01-Product/Business-Rules]]; do not change economic rules to simplify code.
3. Read [[01-Product/Decision-Register]]; keep undecided policies configurable, no fabricated legal rules.
4. Read [[05-Architecture/Architecture-and-Interfaces]] and [[05-Architecture/Data-Model]].
5. Read the active module specification and role screen documents.
6. Select the **first unblocked** task in [[06-Implementation/Backlog]].
7. Implement **one vertical slice**: migrations → use cases → authorization → API → UI → tests → observability.
8. Mark task status and attach test evidence; do not check an item without tests.

## Roles
- `CUSTOMER`: storefront, cart, order tracking, returns, support.
- `VENDOR_OWNER` / `VENDOR_STAFF`: own offers, vendor orders, own finance, own stock, dispatch, promotions.
- `WAREHOUSE_OPERATOR` / `WAREHOUSE_MANAGER`: permitted warehouses and fulfillment work only.
- `SUPPORT_AGENT`: assigned cases, restricted order context, audited overrides.
- `FINANCE_OPERATOR` / `FINANCE_APPROVER`: COD reconciliation, ledger, payouts; dual control.
- `MARKETING_ADMIN`: ads and catalog operations.
- `SUPER_ADMIN`: tenant-wide policy and emergency actions.

## Core domains
`identity`, `vendors`, `catalog`, `inventory`, `commerce`, `payments`, `fulfillment`, `finance`, `tax`, `recommendations`, `advertising`, `notifications`, `platform`.

## No-go criteria before launch
No live payments until vendor isolation, oversell prevention, idempotent webhooks, COD reconciliation, settlement controls, invoice rules, cancellation/refund correctness, and audited permissions pass end-to-end tests.

## Stage gates
- Gate 0: all blockers and jurisdictions documented.
- Gate 1: platform ledger, orders, money snapshots and idempotency implemented.
- Gate 2: warehouse + shipping + status recovery tested.
- Gate 3: tax/invoices + COD + payout processing tested.
- Gate 4: recommendations + marketing integrations verified.

> [!warning] Design-stage artifact
> This vault describes what to build. It does not certify regulatory compliance or completed implementation.

## Expanded UI/UX and implementation map
- [[07-Experience/UI-UX-Master-Plan]] — visual design and all role screens
- [[07-Experience/Screen-Wireframes]] — concrete page layouts
- [[07-Experience/Customer-Checkout-and-Orders]] — customer journey
- [[07-Experience/Vendor-Seller-Center]] — complete vendor portal
- [[07-Experience/Admin-Warehouse-Finance]] — operations screens
- [[07-Experience/Product-Images-and-Quality]] — image pipeline and quality checker
- [[07-Experience/Localization-and-Search]] — multilingual UX and product matching
- [[07-Experience/Notifications-and-Email]] — transactional email and unboxing notice
- [[07-Experience/Marketing-and-Recommendations]] — platform-funded ads and recommendation UX
- [[06-Implementation/Backlog]] — dependency-ordered coding roadmap
- [[08-Operations/Decisions-to-Confirm]] — remaining business policies

## Implementation planning set
- [[09-Implementation/Architecture-Audit]] — coverage matrix, gaps, conflicts and risks
- [[09-Implementation/Dependency-Graph]] — module, migration, API, UI and test build order
- [[09-Implementation/Milestones]] — M0–M12 with gates and acceptance criteria
- [[09-Implementation/Task-Backlog]] — granular AI-agent task units
- [[09-Implementation/Readiness-Checklist]] — 131 verifiable gate items

> [!important] Start with the audit
> The planning set concludes that full implementation is **not ready** until Gate 0 in
> [[09-Implementation/Readiness-Checklist]] is signed off. Gate 0 remains NOT READY;
> only M1-T01 may be considered under the separately approved, currently inactive
> [[09-Implementation/Foundation-Development-Gate]].

## 2026-10-19 — Planning reconciliation

- Current phase: PLANNING; no verified application implementation.
- Canonical roadmap: [[09-Implementation/Milestones]] (M0–M12).
- Legacy aliases: [[09-Implementation/Milestone-Reconciliation]].
- Task lifecycle policy: [[09-Implementation/Task-Status-Policy]].
- Approved ADR-005: [[05-Architecture/ADRs/ADR-005-Module-Boundaries]] (**Revision 3, APPROVED by Project Owner, 2026-10-19; M0-T05 DONE**). ADR-003 Revision 1 is APPROVED and M0-T03/M0-T12 are DONE. G0-03, G0-05, G0-06 and G0-24 are satisfied; Gate 0 remains NOT READY (4/35). ADR-001, ADR-002 and ADR-004 remain pending.
- Feature coverage gaps: [[09-Implementation/Feature-Coverage-Gaps]].
- Operational progress: [[06-Implementation/PROJECT-STATUS]] and [[06-Implementation/CURRENT-SPRINT]].

## Foundation Development Approval Package — approved, gate inactive

- [[05-Architecture/ADRs/ADR-003-Application-and-Deployment-Topology]] — six-app/finance-in-Admin topology, APPROVED Revision 1.
- [[05-Architecture/ADRs/ADR-Index]] and [[05-Architecture/ADRs/Decision-Log]] — accepted M0-T12 deliverables, DONE.
- [[09-Implementation/Foundation-Development-Gate]] — APPROVED M1-T01-only exception; inactive until all activation conditions pass.
- [[09-Implementation/M1-T01-Scope-Proposal]] — approved scope and toolchain pins; not execution permission.
- [[09-Implementation/Git-Setup-Plan]] — existing Git repository preserved; baseline scan/status acceptance pending.
- [[09-Implementation/Task-Handoffs/M1-T01]] — prepared, NOT AUTHORIZED FOR EXECUTION.

M0-T03 and M0-T12 are DONE as accepted documentation. Gate 0 remains NOT READY (4/35); M1-T01 remains BLOCKED. The approved foundation gate has not been activated. No tools were installed and no application coding was authorized.
