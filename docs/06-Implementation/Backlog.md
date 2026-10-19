---
tags: [implementation, agent, backlog]
status: not-started
---
# AI Coding Agent — Thematic Backlog Index

> [!warning] This is a thematic, unchecked navigation checklist, **not an independent task-status ledger**. Canonical milestones and stable task IDs are in [[09-Implementation/Milestones]] and [[09-Implementation/Task-Backlog]]. See [[09-Implementation/Milestone-Reconciliation]] for legacy mappings. Do not interpret stage numbers as canonical milestone numbers.

## Stage 0 — Decisions and scaffolding
- [ ] Approve unresolved [[01-Product/Decision-Register]] including tax jurisdiction, COD remittance contract, shipping inbound cost, seller-of-record, payout holds.
- [ ] Create monorepo `apps/storefront`, `apps/vendor`, `apps/admin`, `apps/warehouse`, `apps/api`, `apps/worker`, `packages/contracts`, `packages/database`, `packages/ui`, `docs`.
- [ ] Establish CI, Docker local PostgreSQL/Redis, linting, typed contracts, migration tests, accessibility baseline.

## Stage 1 — Shared core
- [ ] Identity, sessions, vendor verification, vendor membership/role guards, audit trail.
- [ ] Canonical product → variant → vendor offer, prices and immutable promotion snapshots.
- [ ] Media uploads, R2/S3 worker, image quality checker and moderation.
- [ ] Parent order → vendor orders → items with UUIDv4 endpoints and strict ownership checks.
- [ ] Outbox/inbox, idempotency keys, reliable workers, webhook signing.
- [ ] Central accounting ledger with rate snapshot of commission (1000 bps), refunds and financial reconciliation.

## Stage 2 — Customer selling
- [ ] Multilingual storefront, search, product comparison, add to cart, checkout and offer availability.
- [ ] One multi-vendor checkout with online payment, COD eligibility gate, split vendor orders, independent shipments.
- [ ] Customer parent-order details with tracking, localized messaging, unboxing reminder and invoices.
- [ ] Vendor Seller Center: dashboard, product wizard, order/fulfillment details, earnings and COD settings.

## Stage 3 — Operations and finance
- [ ] Multi-warehouse custody, inventory reservations, transfers, scanning and dispatch.
- [ ] Shipping cost leg tracking, vendor allocations, cost verification and invoice reconciliation.
- [ ] COD collection → remittance → reconciliation (vendor-owned courier arrangement approved by platform).
- [ ] Payout holds, approval, provider transfer reconciliation, statements.
- [ ] Taxes/invoices, cancellations, partial refunds, returns/disputes and compensations.

## Stage 4 — Engagement + growth
- [ ] Multilingual transactional email, in-app notices, provider feedback.
- [ ] Google Merchant/Meta Catalog sync, scheduled discounts and rejection dashboard.
- [ ] Platform-only paid advertising selection/budget, Google/Meta consent and event tracking.
- [ ] Similar products, trending, frequently bought together; recommendation controls.
- [ ] Buyer-seller messaging, Q&A, vouchers, promotions, wishlist alerts, loyalty (as approved).

## Release gates
- [ ] Vendor A cannot see Vendor B records (API, database and UI tests).
- [ ] Final item stock concurrency does not oversell.
- [ ] Partial vendor cancellation preserves other sub-orders and calculates refund correctly.
- [ ] COD delivery != remitted cash; payment and payout gated by reconciliation.
- [ ] Order details link IDs unguessable UUIDv4 AND guarded; guest OTP/token flow secure.
- [ ] 10% commission, platform delivery allocation and multi-vendor payouts match ledger.
- [ ] Uploaded image quality failure and external ad rejection display correctly.
- [ ] Locale switch retains cart and customer context.
- [ ] Critical transactional emails deduped, translated, correct recipient.
- [ ] Load, security, restore and incident-response tests conducted.

## Agent status reporting contract
After each slice: modified paths, migrations applied, screenshots (if possible), tests executed and results, unresolved risks, feature flags, rollback instructions. Do not mark completed from code generation alone.

## Execution documents

This backlog is the thematic summary. Use the following for executable detail:

- [[09-Implementation/Architecture-Audit]] — what is missing or conflicting before coding starts.
- [[09-Implementation/Dependency-Graph]] — hard build order and blocker register.
- [[09-Implementation/Milestones]] — M0–M12 with gates and acceptance criteria.
- [[09-Implementation/Task-Backlog]] — granular task IDs, sizes, dependencies and status.
- [[09-Implementation/Readiness-Checklist]] — verifiable gate items with evidence.

> [!warning] Do not start Stage 0 scaffolding yet
> Gate 0 is not signed off. ADR-001 (auth), ADR-002 (ORM), the RBAC matrix, and the
> unresolved policies in [[01-Product/Decision-Register]] are still blocking.
