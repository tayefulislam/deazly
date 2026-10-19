---
tags: [ai-agent, instructions]
status: design-only
---
# AGENTS — Required Implementation Contract

> [!danger] Planning stage only
> The uploaded workspace is an Obsidian planning repository; there is no verified application implementation. Never claim a screen, endpoint, test, migration, or integration is implemented unless code and test evidence exist.

## Read before coding
1. [[00-START-HERE]] → [[01-Product/Business-Rules]] → [[01-Product/Decision-Register]].
2. [[07-Experience/UI-UX-Master-Plan]] and the relevant screen design.
3. [[05-Architecture/Data-Model]], [[05-Architecture/API-Contracts]], [[05-Architecture/Events-and-Failures]].
4. [[06-Implementation/Backlog]]; pick the first unblocked slice.

## Development rules
- One shared marketplace storefront; no Shopify-style merchant sites.
- Next.js App Router + TypeScript + Tailwind/shadcn/ui; NestJS modular monolith, PostgreSQL, Redis/BullMQ, Meilisearch, R2/S3.
- All money in integer minor units, explicit currency and rounding rules; vendor rate 1000 basis points (10%) on actual post-discount item value.
- One parent order, many vendor orders, independent fulfillment/shipment, centralized payment ledger, independent settlement.
- Vendor discount paid by vendor; ads paid by platform; vendor-fulfilled orders have no platform delivery deduction; platform-fulfilled orders deduct eligible allocated platform delivery cost.
- Vendor COD starts disabled; platform authorizes collection/remittance first; then vendor may toggle per offer; entire checkout only COD when every participating offer, destination and carrier is eligible.
- Never treat random UUID as authorization. Scope customer and vendor accesses at query/service boundaries.
- An external catalog sync does not guarantee paid ad impression; no automatic ad spend when vendor adds an offer.
- Invoices, ledger entries, confirmed price snapshots and other historical accounting records are immutable; use adjustments and credit notes.
- Use outbox + idempotent workers; authenticated webhook signature verification and deduplication.
- No hardcoded tax laws, courier pricing, return windows or payout release intervals without approved policy.

## One vertical slice per development increment
Migration → policies/guards → NestJS use case → contract/validation → Next.js UI → tests (unit/integration/E2E) → accessibility → logs/metrics → documentation.

## Definition of done
The implementation includes role/ownership enforcement, empty/loading/error UI states, mobile behavior, keyboard accessibility, security and concurrency tests, audit records, documentation updates, and no unverifiable claims. Record decisions and blockers in [[01-Product/Decision-Register]].

## Canonical tracking (2026-10-19)

Use [[09-Implementation/Milestones]] for M0–M12, [[09-Implementation/Task-Backlog]] for M<n>-T<nn>, [[09-Implementation/Milestone-Reconciliation]] for M00–M14 legacy scope mapping, [[09-Implementation/Task-Status-Policy]] for task statuses, and [[05-Architecture/ADRs/ADR-005-Module-Boundaries]] for the **APPROVED Revision 3** module boundaries (Project Owner, 2026-10-19; M0-T05 DONE). ADR-003 Revision 1 and M0-T12 are accepted/DONE. Gate 0 remains NOT READY (4/35); the approved Foundation Development Gate is **ACTIVE for M1-T01** (activated 2026-10-19) with separate task-specific exceptions **EFFECTIVE for M1-T02 (section 11)** and **M1-T03 (section 12)**; M1-T01, M1-T02 and M1-T03 are IMPLEMENTED pending independent review, and no other M1 or later task is authorized.
