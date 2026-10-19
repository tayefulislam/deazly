---
tags: [implementation, backlog, tasks, planning]
status: not-started
created: 2026-10-19
---
# Task Backlog — AI-Agent Executable Units

> [!danger] Planning only
> **No application task is started or complete.** M0-T03, M0-T05 and M0-T12 are DONE as accepted planning deliverables; ADR-003 and ADR-005 are approved, and the Foundation Gate is approved but inactive. All statuses must use the canonical implementation vocabulary.
> Do not mark a task `DONE` from code generation alone. `DONE` requires the acceptance criteria and test evidence.
> This file expands [[06-Implementation/Backlog]] into units small enough for one agent session.

## Related documents
- [[00-START-HERE]]
- [[01-Product/Business-Rules]]
- [[01-Product/Decision-Register]]
- [[05-Architecture/Architecture-and-Interfaces]]
- [[05-Architecture/Data-Model]]
- [[05-Architecture/API-Contracts]]
- [[05-Architecture/Events-and-Failures]]
- [[06-Implementation/Backlog]]
- [[09-Implementation/Architecture-Audit]]
- [[09-Implementation/Dependency-Graph]]
- [[09-Implementation/Milestones]]
- [[09-Implementation/Readiness-Checklist]]

## Status legend

| Status | Meaning |
|---|---|
| `NOT_STARTED` | No implementation or approved completion evidence yet |
| `READY` | Scope approved, prerequisites met, acceptance criteria defined |
| `IN_PROGRESS` | Authorized active work |
| `BLOCKED` | Requires documented prerequisite or decision; see blocker note |
| `IMPLEMENTED` | Deliverable exists but verification incomplete |
| `VERIFIED` | Required verification passed with evidence |
| `DONE` | Verified and explicitly accepted |

For the audit history and previous `TODO` / `REVIEW` values see [[09-Implementation/Task-Status-Policy]]. Review verdicts are separate from task status. **Gate 0 approval is a prerequisite of all M1+ implementation work, even where not repeated in the dependency cell.**

**Priority:** `P0` critical path · `P1` required for launch · `P2` post-launch tolerant · `P3` deferred.

**Size:** `S` ≤ half day · `M` ≤ 1 day · `L` ≤ 3 days (split if larger).

---

# M0 — Decisions and architecture records

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M0-T01 | Write ADR-001 authentication architecture: session vs OIDC, cookie strategy, CSRF, MFA, guest access tokens, session revocation | P0 | M | — | BLOCKED | decision |
| M0-T02 | Write ADR-002 ORM selection: Prisma vs Drizzle scored on migrations, raw SQL/locking, partial indexes, JSONB, transactions, type safety, tooling | P0 | M | — | BLOCKED | decision |
| M0-T03 | Write ADR-003 deployment topology: number of frontends, finance app vs admin route, cookie domains, CI matrix | P0 | S | — | DONE | ADR-003 Revision 1 APPROVED by Project Owner 2026-10-19 after final review ACCEPT; IMPLEMENTED → VERIFIED → DONE; G0-03 and G0-24 satisfied; evidence [[06-Implementation/PROGRESS-LOG#ADR-003-and-M0-T12-approval-evidence]]; no coding permission |
| M0-T04 | Write ADR-004 money and rounding: minor units, commission rounding, residual allocation, tax base, FX stance | P0 | M | — | BLOCKED | BR-14, BR-13 |
| M0-T05 | Write ADR-005 module boundaries: allowed imports, shared kernel, read-model rules, lint enforcement plan | P0 | M | — | DONE | IMPLEMENTED → VERIFIED → DONE on 2026-10-19; Revision 3 documentation checks and final ACCEPT review accepted by Project Owner; ADR-005 APPROVED and task closure explicitly authorized; evidence in [[06-Implementation/PROGRESS-LOG#M0-T05 approval evidence]]; no application implementation |
| M0-T06 | Produce RBAC permission matrix: role × permission × scope predicate, reconciling role vocabulary conflicts | P0 | M | — | BLOCKED | C-08 |
| M0-T07 | Produce canonical route map: `uuid` vs `id`, `products` vs `offers`, locale prefixing, finance routes | P0 | S | — | NOT_STARTED | Planning candidate; approval pending |
| M0-T08 | Reconcile design tokens into one canonical set and mark the superseded document | P0 | S | — | NOT_STARTED | Planning candidate; approval pending |
| M0-T09 | Record Gate 0 policy decisions (country, seller-of-record, tax mode, COD remittance, payout cadence, returns window, negative payable, gateway) | P0 | M | — | BLOCKED | business |
| M0-T10 | Define performance budgets and capacity targets (SKU count, orders/day, p95 latency, sync throughput) | P1 | S | — | NOT_STARTED | Planning candidate; approval pending |
| M0-T11 | Define PII classification matrix and log-redaction rules | P0 | M | — | NOT_STARTED | Planning candidate; approval pending |
| M0-T12 | Create ADR index and decision log with owner/date fields | P1 | S | — | DONE | Index/log reviewed and accepted by Project Owner 2026-10-19; IMPLEMENTED → VERIFIED → DONE; missing ADR-001/002/004 correctly remain pending; G0-06 satisfied; evidence [[06-Implementation/PROGRESS-LOG#ADR-003-and-M0-T12-approval-evidence]] |

**M0 exit:** all P0 tasks `DONE`; no `BLOCKED` task remains in M1.

---

# M1 — Platform foundation

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M1-T01 | Initialize pnpm workspace with `apps/*` and `packages/*` per ADR-003 | P0 | M | M0-T03 | IMPLEMENTED | Workspace created on branch `chore/m1-t01-workspace` from baseline `b1d26ab`; Node 24.22.0 / pnpm 12.14.0 verified; Gitleaks v8.30.0 clean; 13/13 workspace tests pass; dependency-free lockfile reproducible. Awaiting independent review + accepted `pmOnFail` deviation. Not VERIFIED/DONE. |
| M1-T02 | Add TypeScript strict config and path aliases (project references/composite excluded by decision D4; see reconciliation note) | P0 | S | M1-T01 | IMPLEMENTED | M1-T02-only gate exception APPROVED and EFFECTIVE 2026-10-19 ([[09-Implementation/Foundation-Development-Gate]] §11); Owner waived the M1-T01-acceptance precondition and kept M1-T01 IMPLEMENTED. `typescript@6.0.3`, `tsconfig.base.json`, 11 workspace configs, `export {};` placeholders, config test and `typecheck` scripts added. 43/43 TypeScript tests, 56/56 combined tests, typecheck exit 0, frozen offline install exit 0. Not VERIFIED/DONE; independent review pending. |
| M1-T03 | Add shared ESLint + Prettier + import-boundary rules per ADR-005 | P0 | M | M1-T01, M0-T05 | IMPLEMENTED | M1-T03-only gate exception EFFECTIVE 2026-10-19 ([[09-Implementation/Foundation-Development-Gate]] §12); pins explicitly Owner-approved 2026-10-19. Root flat ESLint config with ADR-005 boundary rules plus literal-dynamic-import enforcement (`no-restricted-syntax`), Prettier config/ignore, exact pins (`eslint@10.13.0`, `@eslint/js@10.0.1`, `typescript-eslint@8.71.2`, `globals@17.13.0`, `eslint-config-prettier@10.1.8`, `prettier@3.9.10`), `lint`/`format`/`test:lint` scripts and 28 config/boundary tests added. 84/84 combined tests pass, lint/format/typecheck exit 0, frozen offline install and `git diff --check` exit 0. Resolved-graph and NestJS DI-graph checks are deferred (no existing task ID; see reconciliation note). Not VERIFIED/DONE; independent review pending. |
| M1-T04 | Add Docker Compose: PostgreSQL, Redis, Meilisearch, MinIO | P0 | M | M1-T01 | BLOCKED | Unmet dependency / approval |
| M1-T05 | Wire migration tool per ADR-002 and create forward-only policy doc | P0 | M | M1-T01, M0-T02 | BLOCKED | Unmet dependency / approval |
| M1-T06 | Create `packages/config` with typed environment validation | P0 | S | M1-T01 | BLOCKED | Unmet dependency / approval |
| M1-T07 | Create `packages/contracts` skeleton + OpenAPI generation pipeline | P0 | M | M1-T01 | BLOCKED | Unmet dependency / approval |
| M1-T08 | Create `packages/validation` with shared Zod primitives | P0 | S | M1-T07 | BLOCKED | Unmet dependency / approval |
| M1-T09 | Implement `Money` value object: minor units, currency, add/sub/mul, rounding policy, guards | P0 | M | M1-T02 | BLOCKED | Unmet dependency / approval |
| M1-T10 | Unit-test `Money`: JPY zero-decimal, rounding modes, mixed-currency rejection, overflow | P0 | S | M1-T09 | BLOCKED | Unmet dependency / approval |
| M1-T11 | Migration: `platform.outbox` with state, attempts, next_attempt_at, payload, aggregate version | P0 | M | M1-T05 | BLOCKED | Unmet dependency / approval |
| M1-T12 | Migration: `platform.inbox` with provider event id unique + payload hash | P0 | M | M1-T05 | BLOCKED | Unmet dependency / approval |
| M1-T13 | Migration: `platform.idempotency_keys` with scope + key unique + response snapshot | P0 | M | M1-T05 | BLOCKED | Unmet dependency / approval |
| M1-T14 | Migration: `platform.audit_log` append-only with actor, before/after JSONB, correlation id | P0 | M | M1-T05 | BLOCKED | Unmet dependency / approval |
| M1-T15 | Implement outbox writer helper callable inside a transaction | P0 | M | M1-T11 | BLOCKED | Unmet dependency / approval |
| M1-T16 | Implement outbox dispatcher worker: claim, visibility timeout, retry, DLQ | P0 | L | M1-T15, M1-T04 | BLOCKED | Unmet dependency / approval |
| M1-T17 | Integration test: mutation + outbox atomically persisted; duplicate dispatch/consume produces one committed business effect | P0 | M | M1-T16 | BLOCKED | Unmet dependency / approval |
| M1-T18 | Implement idempotency interceptor with replay and conflict responses | P0 | M | M1-T13 | BLOCKED | Unmet dependency / approval |
| M1-T19 | Integration test: duplicate key replays original response; no second mutation | P0 | M | M1-T18 | BLOCKED | Unmet dependency / approval |
| M1-T20 | Implement error envelope + request ID middleware + RFC7807 mapping | P0 | M | M1-T01 | BLOCKED | Unmet dependency / approval |
| M1-T21 | Implement structured logging with redaction + correlation propagation | P0 | M | M1-T20, M0-T11 | BLOCKED | Unmet dependency / approval |
| M1-T22 | Bootstrap OpenTelemetry traces for API and worker | P1 | M | M1-T21 | BLOCKED | Unmet dependency / approval |
| M1-T23 | Create NestJS app skeleton with health/readiness endpoints | P0 | S | M1-T01 | BLOCKED | Unmet dependency / approval |
| M1-T24 | Create BullMQ worker app skeleton with graceful shutdown | P0 | M | M1-T04, M1-T16 | BLOCKED | Unmet dependency / approval |
| M1-T25 | Add CI: lint, typecheck, unit, migration test, build | P0 | M | M1-T03, M1-T05 | BLOCKED | Unmet dependency / approval |
| M1-T26 | Add local seed script and reset command | P1 | S | M1-T04 | BLOCKED | Unmet dependency / approval |
| M1-T27 | Document migration rollback/restore procedure | P1 | S | M1-T05 | BLOCKED | Unmet dependency / approval |

**M1 exit:** clean clone builds; primitives have passing integration tests; CI green.

---

# M2 — Identity and tenancy

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M2-T01 | Migration: users, credentials, sessions, MFA factors | P0 | M | M1-T05 | BLOCKED | M0-T01 |
| M2-T02 | Migration: vendors, vendor memberships, invitations | P0 | M | M2-T01 | BLOCKED | Unmet dependency / approval |
| M2-T03 | Migration: role grants and permission catalog per RBAC matrix | P0 | M | M2-T01, M0-T06 | BLOCKED | Unmet dependency / approval |
| M2-T04 | Migration: warehouse staff assignments, finance role assignments | P0 | M | M2-T03 | BLOCKED | Unmet dependency / approval |
| M2-T05 | Migration: guest access tokens (hashed, single-purpose, expiring) | P0 | M | M2-T01 | BLOCKED | Unmet dependency / approval |
| M2-T06 | Implement customer registration + email verification | P0 | M | M2-T01 | BLOCKED | Unmet dependency / approval |
| M2-T07 | Implement login/logout/session refresh with secure cookies | P0 | M | M2-T01 | BLOCKED | Unmet dependency / approval |
| M2-T08 | Implement password reset with single-use expiring token | P0 | M | M2-T06 | BLOCKED | Unmet dependency / approval |
| M2-T09 | Implement MFA enrollment and verification for privileged roles | P0 | M | M2-T07 | BLOCKED | Unmet dependency / approval |
| M2-T10 | Implement rate limiting on auth and OTP endpoints | P0 | M | M2-T07 | BLOCKED | Unmet dependency / approval |
| M2-T11 | Implement permission guard decorator + policy evaluator | P0 | M | M2-T03 | BLOCKED | Unmet dependency / approval |
| M2-T12 | Implement scoped repository base: customer scope, vendor scope, warehouse scope, finance scope | P0 | L | M2-T11 | BLOCKED | Unmet dependency / approval |
| M2-T13 | Authorization test matrix: vertical escalation (role) | P0 | M | M2-T11 | BLOCKED | Unmet dependency / approval |
| M2-T14 | Authorization test matrix: horizontal escalation (other tenant's id) | P0 | M | M2-T12 | BLOCKED | Unmet dependency / approval |
| M2-T15 | Implement vendor application + document upload + verification state machine | P0 | L | M2-T02 | BLOCKED | Unmet dependency / approval |
| M2-T16 | Implement vendor staff invitation + least-privilege role assignment | P0 | M | M2-T02 | BLOCKED | Unmet dependency / approval |
| M2-T17 | Implement guest order access token issue + verify + revoke | P0 | M | M2-T05 | BLOCKED | Unmet dependency / approval |
| M2-T18 | Security test: bare order UUID returns no data; token required | P0 | S | M2-T17 | BLOCKED | Unmet dependency / approval |
| M2-T19 | Implement audit log helper and apply to privileged mutations | P0 | M | M1-T14 | BLOCKED | Unmet dependency / approval |
| M2-T20 | UI: auth shell, login, register, reset, MFA challenge | P0 | L | M2-T07, M2-T09 | BLOCKED | Unmet dependency / approval |
| M2-T21 | UI: vendor onboarding wizard + verification status | P1 | M | M2-T15 | BLOCKED | Unmet dependency / approval |
| M2-T22 | UI: permission gate component + denied state | P0 | S | M2-T11 | BLOCKED | Unmet dependency / approval |

**M2 exit:** every endpoint has a permission entry and a passing authorization test.

---

# M3 — Catalog, offers, discounts, media

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M3-T01 | Migration: categories, brands, attributes, attribute values | P0 | M | M2-T01 | BLOCKED | Unmet dependency / approval |
| M3-T02 | Migration: canonical products, variants, variant attributes | P0 | M | M3-T01 | BLOCKED | Unmet dependency / approval |
| M3-T03 | Migration: seller offers with SKU, condition, fulfillment method, COD flag | P0 | M | M3-T02 | BLOCKED | Unmet dependency / approval |
| M3-T04 | Migration: discounts/promotions with time window, funding party, status | P0 | M | M3-T03 | BLOCKED | Unmet dependency / approval |
| M3-T05 | Migration: price history / effective price snapshots | P0 | M | M3-T04 | BLOCKED | Unmet dependency / approval |
| M3-T06 | Migration: media assets, variants, quality reports, findings | P0 | M | M3-T03 | BLOCKED | Unmet dependency / approval |
| M3-T07 | Migration: translations table with locale, field, status, version | P1 | M | M3-T02 | BLOCKED | Unmet dependency / approval |
| M3-T08 | Implement canonical product + variant CRUD (admin) | P0 | M | M3-T02 | BLOCKED | Unmet dependency / approval |
| M3-T09 | Implement seller offer CRUD scoped to vendor membership | P0 | L | M3-T03, M2-T12 | BLOCKED | Unmet dependency / approval |
| M3-T10 | Implement offer approval workflow (submit → review → approved/rejected) | P0 | M | M3-T09 | BLOCKED | Unmet dependency / approval |
| M3-T11 | Implement discount creation with timezone validation and no retroactive start | P0 | M | M3-T04 | BLOCKED | Unmet dependency / approval |
| M3-T12 | Implement pricing engine: authoritative effective price at instant T | P0 | L | M3-T05, M3-T11 | BLOCKED | Unmet dependency / approval |
| M3-T13 | Unit test: discount boundary instants, overlap rejection, expired discount | P0 | M | M3-T12 | BLOCKED | Unmet dependency / approval |
| M3-T14 | Unit test: commission basis uses final discounted price | P0 | S | M3-T12 | BLOCKED | Unmet dependency / approval |
| M3-T15 | Implement media upload intent + signed URL issuance | P0 | M | M3-T06 | BLOCKED | Unmet dependency / approval |
| M3-T16 | Implement media completion: object verify, size/type limits, AV scan hook | P0 | M | M3-T15 | BLOCKED | Unmet dependency / approval |
| M3-T17 | Implement image variant generation (Sharp) with idempotent worker | P0 | M | M3-T16 | BLOCKED | Unmet dependency / approval |
| M3-T18 | Implement quality checker: resolution, corrupt, blur heuristic, perceptual hash duplicate | P0 | L | M3-T16 | BLOCKED | Unmet dependency / approval |
| M3-T19 | Implement quality statuses and admin decision endpoint | P0 | M | M3-T18 | BLOCKED | Unmet dependency / approval |
| M3-T20 | Implement offer image association, reorder, primary selection | P0 | M | M3-T17 | BLOCKED | Unmet dependency / approval |
| M3-T21 | Emit `OfferApproved`, `OfferPriceChanged`, `PromotionStarted/Expired` to outbox | P0 | M | M3-T12, M1-T15 | BLOCKED | Unmet dependency / approval |
| M3-T22 | UI: vendor offer editor (wizard steps 1–8) | P0 | L | M3-T09 | BLOCKED | Unmet dependency / approval |
| M3-T23 | UI: vendor media uploader + quality report panel | P0 | L | M3-T19 | BLOCKED | Unmet dependency / approval |
| M3-T24 | UI: admin media review queue | P1 | M | M3-T19 | BLOCKED | Unmet dependency / approval |
| M3-T25 | UI: admin offer approval queue | P1 | M | M3-T10 | BLOCKED | Unmet dependency / approval |
| M3-T26 | UI: vendor promotions list + schedule editor | P1 | M | M3-T11 | BLOCKED | Unmet dependency / approval |
| M3-T27 | Integration test: upload → scan → variants → public URL; failed conversion leaves no broken URL | P0 | M | M3-T17 | BLOCKED | Unmet dependency / approval |
| M3-T28 | Security test: vendor A cannot edit vendor B offer/images | P0 | S | M3-T09 | BLOCKED | Unmet dependency / approval |

**M3 exit:** a vendor can publish an approved offer with valid images and a scheduled discount.

---

# M4 — Inventory and warehouses

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M4-T01 | Migration: warehouses, storage locations, operating timezone | P0 | M | M2-T04 | BLOCKED | Unmet dependency / approval |
| M4-T02 | Migration: inventory lots with owner vs custodian | P0 | M | M4-T01, M3-T03 | BLOCKED | Unmet dependency / approval |
| M4-T03 | Migration: stock balances with CHECK constraints and version | P0 | M | M4-T02 | BLOCKED | Unmet dependency / approval |
| M4-T04 | Migration: immutable stock movements with operation key unique | P0 | M | M4-T03 | BLOCKED | Unmet dependency / approval |
| M4-T05 | Migration: stock reservations with partial unique active index | P0 | M | M4-T04 | BLOCKED | Unmet dependency / approval |
| M4-T06 | Migration: transfers, transfer lines, goods receipts, receipt lines | P0 | M | M4-T03 | BLOCKED | Unmet dependency / approval |
| M4-T07 | Migration: serialized units with uniqueness scope decision | P1 | M | M4-T02 | BLOCKED | Unmet dependency / approval |
| M4-T08 | Implement stock availability query (available = on_hand − reserved − quarantine) | P0 | M | M4-T03 | BLOCKED | Unmet dependency / approval |
| M4-T09 | Implement reservation service with deterministic lock ordering | P0 | L | M4-T05 | BLOCKED | Unmet dependency / approval |
| M4-T10 | Concurrency test: two checkouts, one unit, exactly one reservation | P0 | M | M4-T09 | BLOCKED | Unmet dependency / approval |
| M4-T11 | Implement reservation expiry worker with idempotent release | P0 | M | M4-T09 | BLOCKED | Unmet dependency / approval |
| M4-T12 | Implement inbound transfer create/dispatch with source validation | P0 | L | M4-T06 | BLOCKED | Unmet dependency / approval |
| M4-T13 | Implement goods receipt with accepted/quarantined/rejected and discrepancy event | P0 | L | M4-T06 | BLOCKED | Unmet dependency / approval |
| M4-T14 | Integration test: duplicate receipt request does not double-add stock | P0 | M | M4-T13 | BLOCKED | Unmet dependency / approval |
| M4-T15 | Implement stock adjustment with reason, manager approval, audit | P0 | M | M4-T04 | BLOCKED | Unmet dependency / approval |
| M4-T16 | Implement transit bucket excluded from availability | P0 | M | M4-T12 | BLOCKED | Unmet dependency / approval |
| M4-T17 | Property test: on_hand = available + reserved + quarantined + in_transit | P0 | M | M4-T15 | BLOCKED | Unmet dependency / approval |
| M4-T18 | UI: warehouse receiving workbench (scan, accept, quarantine, discrepancy) | P0 | L | M4-T13 | BLOCKED | Unmet dependency / approval |
| M4-T19 | UI: stock and transfer console with separate buckets | P0 | L | M4-T08 | BLOCKED | Unmet dependency / approval |
| M4-T20 | UI: vendor inbound transfer creation | P1 | M | M4-T12 | BLOCKED | Unmet dependency / approval |
| M4-T21 | Security test: cross-vendor stock isolation on list/detail/export | P0 | S | M4-T08 | BLOCKED | Unmet dependency / approval |

**M4 exit:** no oversell under concurrency; transit and quarantine never sellable.

---

# M5 — Cart, checkout, orders

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M5-T01 | Migration: carts, cart items, guest token binding, expiry | P0 | M | M2-T05 | BLOCKED | Unmet dependency / approval |
| M5-T02 | Migration: checkout quotes with immutable snapshot | P0 | M | M5-T01 | BLOCKED | Unmet dependency / approval |
| M5-T03 | Migration: orders, vendor orders, order items, snapshots | P0 | L | M5-T02 | BLOCKED | Unmet dependency / approval |
| M5-T04 | Migration: order events append-only | P0 | M | M5-T03 | BLOCKED | Unmet dependency / approval |
| M5-T05 | Migration: order numbers sequence with prefix and uniqueness | P0 | S | M5-T03 | BLOCKED | Unmet dependency / approval |
| M5-T06 | Migration: addresses and customer profile | P0 | M | M2-T01 | BLOCKED | Unmet dependency / approval |
| M5-T07 | Implement cart add/update/remove with price revalidation | P0 | M | M5-T01, M3-T12 | BLOCKED | Unmet dependency / approval |
| M5-T08 | Implement guest cart + merge-on-login | P0 | M | M5-T07 | BLOCKED | Unmet dependency / approval |
| M5-T09 | Implement checkout quote builder (items, discounts, placeholders, COD eligibility) | P0 | L | M5-T07, M4-T08 | BLOCKED | Unmet dependency / approval |
| M5-T10 | Implement quote revalidation and change acknowledgement | P0 | M | M5-T09 | BLOCKED | Unmet dependency / approval |
| M5-T11 | Implement COD eligibility predicate (offer + vendor + destination + carrier) | P0 | M | M5-T09, M2-T15 | BLOCKED | Unmet dependency / approval |
| M5-T12 | Implement place-order command: split vendor orders, reserve stock, snapshot prices | P0 | L | M5-T03, M4-T09 | BLOCKED | Unmet dependency / approval |
| M5-T13 | Integration test: idempotent place-order creates no duplicate | P0 | M | M5-T12 | BLOCKED | Unmet dependency / approval |
| M5-T14 | Integration test: 3 vendors → 1 parent + 3 vendor orders | P0 | M | M5-T12 | BLOCKED | Unmet dependency / approval |
| M5-T15 | Implement order state machines with separated order/payment/shipment/return/payout status | P0 | L | M5-T03 | BLOCKED | Unmet dependency / approval |
| M5-T16 | Unit test: quote total equals sum of item snapshots + adjustments | P0 | M | M5-T09 | BLOCKED | Unmet dependency / approval |
| M5-T17 | UI: cart page | P0 | M | M5-T07 | BLOCKED | Unmet dependency / approval |
| M5-T18 | UI: checkout steps 1–4 with vendor grouping | P0 | L | M5-T09 | BLOCKED | Unmet dependency / approval |
| M5-T19 | UI: customer order detail with per-vendor cards | P0 | L | M5-T15 | BLOCKED | Unmet dependency / approval |
| M5-T20 | UI: guest checkout + order verification | P0 | M | M2-T17 | BLOCKED | Unmet dependency / approval |
| M5-T21 | Security test: guest cannot access another guest's order | P0 | S | M5-T20 | BLOCKED | Unmet dependency / approval |
| M5-T22 | E2E: multi-vendor checkout online and COD | P0 | L | M5-T18 | BLOCKED | Unmet dependency / approval |
| M5-T23 | Emit `OrderPlaced` + `VendorOrderConfirmed` in transaction | P0 | M | M5-T12, M1-T15 | BLOCKED | Unmet dependency / approval |

**M5 exit:** one checkout produces a correct split order with idempotency and price snapshots.

---

# M6 — Payments and ledger (Gate 1)

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M6-T01 | Define payment provider adapter interface (intent, capture, void, refund, status) | P0 | M | M0-T09 | BLOCKED | Unmet dependency / approval |
| M6-T02 | Implement sandbox adapter + configuration | P0 | M | M6-T01 | BLOCKED | Unmet dependency / approval |
| M6-T03 | Migration: payments, payment attempts, provider references | P0 | M | M5-T03 | BLOCKED | Unmet dependency / approval |
| M6-T04 | Migration: payment allocations per vendor order | P0 | M | M6-T03 | BLOCKED | Unmet dependency / approval |
| M6-T05 | Migration: chart of accounts, ledger transactions, ledger entries | P0 | L | M0-T04 | BLOCKED | Unmet dependency / approval |
| M6-T06 | Migration: refund records + reversal links | P0 | M | M6-T05 | BLOCKED | Unmet dependency / approval |
| M6-T07 | Implement payment intent creation with idempotency | P0 | M | M6-T03, M1-T18 | BLOCKED | Unmet dependency / approval |
| M6-T08 | Implement webhook endpoint with signature verify + inbox dedupe | P0 | M | M1-T12 | BLOCKED | Unmet dependency / approval |
| M6-T09 | Integration test: duplicate webhook does not double-post | P0 | M | M6-T08 | BLOCKED | Unmet dependency / approval |
| M6-T10 | Implement ledger posting service: balanced entries + idempotency key | P0 | L | M6-T05 | BLOCKED | Unmet dependency / approval |
| M6-T11 | Property test: debits = credits per transaction and per currency | P0 | M | M6-T10 | BLOCKED | Unmet dependency / approval |
| M6-T12 | Implement commission calculator with versioned rounding policy | P0 | M | M1-T09, M0-T04 | BLOCKED | Unmet dependency / approval |
| M6-T13 | Unit test: ¥1,000 → ¥100 commission → ¥900 vendor share | P0 | S | M6-T12 | BLOCKED | Unmet dependency / approval |
| M6-T14 | Unit test: commission never on delivery charge; never on pre-discount price | P0 | S | M6-T12 | BLOCKED | Unmet dependency / approval |
| M6-T15 | Implement payment allocation across vendor orders | P0 | M | M6-T04, M6-T10 | BLOCKED | Unmet dependency / approval |
| M6-T16 | Implement unknown-state reconciliation job (query by provider reference) | P0 | M | M6-T03 | BLOCKED | Unmet dependency / approval |
| M6-T17 | Integration test: provider timeout → REVIEW, no duplicate charge | P0 | M | M6-T16 | BLOCKED | Unmet dependency / approval |
| M6-T18 | Implement ledger read APIs for vendor earnings projection | P0 | M | M6-T10 | BLOCKED | Unmet dependency / approval |
| M6-T19 | Security test: webhook rejects invalid signature and replayed event | P0 | S | M6-T08 | BLOCKED | Unmet dependency / approval |
| M6-T20 | UI: payment step with pending/failed/retry states | P0 | M | M6-T07 | BLOCKED | Unmet dependency / approval |
| M6-T21 | Emit `PaymentCaptured`, `RefundCompleted` to outbox | P0 | S | M6-T10 | BLOCKED | Unmet dependency / approval |

**Gate 1:** ledger balances, idempotency verified, money snapshots immutable.

---

# M7 — Fulfillment and shipping (Gate 2)

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M7-T01 | Migration: fulfillment orders, packages, shipment legs | P0 | L | M5-T03 | BLOCKED | Unmet dependency / approval |
| M7-T02 | Migration: carriers, carrier services, shipment labels | P0 | M | M7-T01 | BLOCKED | Unmet dependency / approval |
| M7-T03 | Migration: shipping quotes and actual shipping costs | P0 | M | M7-T01 | BLOCKED | Unmet dependency / approval |
| M7-T04 | Migration: cost allocations with method + policy version | P0 | M | M7-T03, M6-T05 | BLOCKED | Unmet dependency / approval |
| M7-T05 | Migration: shipping adjustments linked to ledger | P0 | M | M7-T04 | BLOCKED | Unmet dependency / approval |
| M7-T06 | Implement shipment creation from reserved stock per vendor order | P0 | L | M7-T01, M4-T09 | BLOCKED | Unmet dependency / approval |
| M7-T07 | Implement pick/pack/dispatch with scan validation | P0 | L | M7-T06 | BLOCKED | Unmet dependency / approval |
| M7-T08 | Implement carrier label booking adapter interface | P0 | M | M7-T02 | BLOCKED | Unmet dependency / approval |
| M7-T09 | Implement allocation engine with deterministic remainder | P0 | L | M7-T04 | BLOCKED | Unmet dependency / approval |
| M7-T10 | Unit test: ¥300 shared cost across two vendors allocates exactly ¥300 | P0 | M | M7-T09 | BLOCKED | Unmet dependency / approval |
| M7-T11 | Unit test: vendor-fulfilled shipment → zero platform deduction | P0 | S | M7-T09 | BLOCKED | Unmet dependency / approval |
| M7-T12 | Implement late-invoice adjustment (no historical replacement) | P0 | M | M7-T05 | BLOCKED | Unmet dependency / approval |
| M7-T13 | Integration test: late carrier invoice produces adjustment + statement update | P0 | M | M7-T12 | BLOCKED | Unmet dependency / approval |
| M7-T14 | Implement status recovery for lost/failed shipment | P0 | M | M7-T07 | BLOCKED | Unmet dependency / approval |
| M7-T15 | Emit `ShipmentDispatched`, `OrderDelivered`, `ShippingCostFinalized` | P0 | S | M7-T07 | BLOCKED | Unmet dependency / approval |
| M7-T16 | UI: warehouse pick/pack/dispatch | P0 | L | M7-T07 | BLOCKED | Unmet dependency / approval |
| M7-T17 | UI: customer tracking timeline per package | P0 | M | M7-T15 | BLOCKED | Unmet dependency / approval |
| M7-T18 | UI: vendor order fulfillment panel | P0 | M | M7-T06 | BLOCKED | Unmet dependency / approval |
| M7-T19 | UI: finance shipping allocation review | P1 | L | M7-T09 | BLOCKED | Unmet dependency / approval |
| M7-T20 | Security test: vendor sees only own shipments | P0 | S | M7-T06 | BLOCKED | Unmet dependency / approval |

**Gate 2:** warehouse + shipping + status recovery tested.

---

# M8 — Tax, COD, settlements, payouts (Gate 3)

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M8-T01 | Migration: jurisdictions, registrations, rate versions | P0 | M | M0-T09 | BLOCKED | BR-10, BR-13 |
| M8-T02 | Migration: tax calculations with version + source context | P0 | M | M8-T01 | BLOCKED | Unmet dependency / approval |
| M8-T03 | Migration: invoices, invoice lines, credit notes | P0 | M | M8-T02 | BLOCKED | Unmet dependency / approval |
| M8-T04 | Implement tax quote endpoint with expiry and version | P0 | M | M8-T02 | BLOCKED | Unmet dependency / approval |
| M8-T05 | Implement invoice issuance + PDF render + object storage | P0 | L | M8-T03 | BLOCKED | Unmet dependency / approval |
| M8-T06 | Integration test: issued invoice immutable after rate change | P0 | M | M8-T05 | BLOCKED | Unmet dependency / approval |
| M8-T07 | Implement credit note issuance linked to refund | P0 | M | M8-T05 | BLOCKED | Unmet dependency / approval |
| M8-T08 | Migration: COD collections, collection events, remittance batches, lines | P0 | L | M7-T01 | BLOCKED | BR-09 |
| M8-T09 | Migration: COD reconciliations and discrepancies | P0 | M | M8-T08 | BLOCKED | Unmet dependency / approval |
| M8-T10 | Implement COD carrier webhook with dedupe | P0 | M | M8-T08, M1-T12 | BLOCKED | Unmet dependency / approval |
| M8-T11 | Implement remittance import + strict match + dry run | P0 | L | M8-T09 | BLOCKED | Unmet dependency / approval |
| M8-T12 | Integration test: short remittance → discrepancy, not false match | P0 | M | M8-T11 | BLOCKED | Unmet dependency / approval |
| M8-T13 | Implement discrepancy resolution with audit + evidence | P0 | M | M8-T11 | BLOCKED | Unmet dependency / approval |
| M8-T14 | Migration: vendor COD approvals + per-offer COD eligibility | P0 | M | M2-T15 | BLOCKED | Unmet dependency / approval |
| M8-T15 | Implement vendor COD request/approve/suspend workflow | P0 | M | M8-T14 | BLOCKED | Unmet dependency / approval |
| M8-T16 | Migration: vendor settlements + settlement items | P0 | L | M7-T04, M6-T05 | BLOCKED | Unmet dependency / approval |
| M8-T17 | Implement settlement eligibility engine (holds, return window, COD) | P0 | L | M8-T16 | BLOCKED | Unmet dependency / approval |
| M8-T18 | Migration: payout batches, payouts, attempts, reconciliation | P0 | L | M8-T16 | BLOCKED | Unmet dependency / approval |
| M8-T19 | Implement payout batch builder with maker-checker enforcement | P0 | L | M8-T18 | BLOCKED | Unmet dependency / approval |
| M8-T20 | Integration test: maker ≠ approver enforced at DB and service | P0 | M | M8-T19 | BLOCKED | Unmet dependency / approval |
| M8-T21 | Implement payout provider transfer + reconciliation + timeout REVIEW | P0 | L | M8-T19 | BLOCKED | Unmet dependency / approval |
| M8-T22 | Unit test: statement reconciles sale − commission − delivery − adjustments | P0 | M | M8-T17 | BLOCKED | Unmet dependency / approval |
| M8-T23 | Implement negative balance hold policy per BR-15 | P0 | M | M8-T17 | BLOCKED | Unmet dependency / approval |
| M8-T24 | UI: finance COD reconciliation workspace | P0 | L | M8-T11 | BLOCKED | Unmet dependency / approval |
| M8-T25 | UI: finance payout batch builder + approval | P0 | L | M8-T19 | BLOCKED | Unmet dependency / approval |
| M8-T26 | UI: admin COD approval | P0 | M | M8-T15 | BLOCKED | Unmet dependency / approval |
| M8-T27 | UI: vendor earnings + payout statements | P0 | L | M8-T17 | BLOCKED | Unmet dependency / approval |
| M8-T28 | UI: admin tax + invoice manager | P1 | L | M8-T05 | BLOCKED | Unmet dependency / approval |
| M8-T29 | UI: customer invoice download | P0 | S | M8-T05 | BLOCKED | Unmet dependency / approval |
| M8-T30 | Security test: vendor finance scoping; invoice cross-customer access denied | P0 | S | M8-T05 | BLOCKED | Unmet dependency / approval |

**Gate 3:** tax/invoices + COD + payout processing tested.

---

# M9 — Returns, refunds, disputes

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M9-T01 | Migration: cancellation requests + lines | P0 | M | M5-T03 | BLOCKED | Unmet dependency / approval |
| M9-T02 | Migration: returns, return items, inspections, dispositions | P0 | L | M7-T01 | BLOCKED | Unmet dependency / approval |
| M9-T03 | Migration: disputes, events, evidence | P0 | M | M5-T03 | BLOCKED | Unmet dependency / approval |
| M9-T04 | Migration: refunds + refund allocations | P0 | M | M6-T06 | BLOCKED | Unmet dependency / approval |
| M9-T05 | Implement cancellation eligibility + refund estimate | P0 | M | M9-T01 | BLOCKED | Unmet dependency / approval |
| M9-T06 | Implement cancellation acceptance with stock release and ledger reversal | P0 | L | M9-T05, M6-T10 | BLOCKED | Unmet dependency / approval |
| M9-T07 | Implement return request with item quantity caps | P0 | M | M9-T02 | BLOCKED | Unmet dependency / approval |
| M9-T08 | Implement inspection → restock/quarantine/scrap | P0 | M | M9-T07, M4-T15 | BLOCKED | Unmet dependency / approval |
| M9-T09 | Implement refund service with partial allocation across vendor orders | P0 | L | M9-T04, M6-T10 | BLOCKED | Unmet dependency / approval |
| M9-T10 | Integration test: duplicate cancellation → no double refund | P0 | M | M9-T06 | BLOCKED | Unmet dependency / approval |
| M9-T11 | Integration test: one vendor failure does not cancel others | P0 | M | M9-T06 | BLOCKED | Unmet dependency / approval |
| M9-T12 | Implement refund-after-payout recovery receivable | P0 | M | M9-T09, M8-T19 | BLOCKED | Unmet dependency / approval |
| M9-T13 | Implement dispute case lifecycle + vendor response + support decision | P1 | L | M9-T03 | BLOCKED | Unmet dependency / approval |
| M9-T14 | Implement return label / pickup flow | P1 | M | M9-T07, M7-T08 | BLOCKED | Unmet dependency / approval |
| M9-T15 | Emit `OrderCancellationAccepted`, `ReturnOpened`, `RefundCompleted` | P0 | S | M9-T09 | BLOCKED | Unmet dependency / approval |
| M9-T16 | UI: customer cancel/return request flow | P0 | L | M9-T05 | BLOCKED | Unmet dependency / approval |
| M9-T17 | UI: vendor return tasks | P1 | M | M9-T07 | BLOCKED | Unmet dependency / approval |
| M9-T18 | UI: admin exception + dispute console | P1 | L | M9-T13 | BLOCKED | Unmet dependency / approval |
| M9-T19 | Unit test: refund caps and allocation math | P0 | M | M9-T09 | BLOCKED | Unmet dependency / approval |
| M9-T20 | E2E: partial return across multi-vendor order | P0 | L | M9-T16 | BLOCKED | Unmet dependency / approval |

**M9 exit:** item-level recovery correct, auditable, and isolated.

---

# M10 — Localization, search, notifications

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M10-T01 | Configure `next-intl`, locale routing, fallback chain | P1 | M | M1-T01 | BLOCKED | Unmet dependency / approval |
| M10-T02 | Implement language switcher preserving cart/order context | P1 | M | M10-T01 | BLOCKED | Unmet dependency / approval |
| M10-T03 | Implement translation CRUD + status workflow | P1 | L | M3-T07 | BLOCKED | Unmet dependency / approval |
| M10-T04 | Implement admin TMS UI (side-by-side, glossary, publish, revert) | P1 | L | M10-T03 | BLOCKED | Unmet dependency / approval |
| M10-T05 | Configure Meilisearch index schema (localized fields, synonyms) | P1 | M | M3-T02 | BLOCKED | Unmet dependency / approval |
| M10-T06 | Implement index projection worker from outbox events | P1 | L | M10-T05, M1-T15 | BLOCKED | Unmet dependency / approval |
| M10-T07 | Implement search query endpoint with filters/sorting/cursor | P1 | L | M10-T06 | BLOCKED | Unmet dependency / approval |
| M10-T08 | Implement canonical dedupe + eligible offer resolution at query time | P1 | M | M10-T07 | BLOCKED | Unmet dependency / approval |
| M10-T09 | Implement reindex job + index health diagnostics | P1 | M | M10-T06 | BLOCKED | Unmet dependency / approval |
| M10-T10 | Unit test: locale fallback and query normalization | P1 | S | M10-T07 | BLOCKED | Unmet dependency / approval |
| M10-T11 | Integration test: outbox → index → result; stale/unapproved excluded | P1 | M | M10-T08 | BLOCKED | Unmet dependency / approval |
| M10-T12 | Migration: notification templates, deliveries, preferences | P1 | M | M2-T01 | BLOCKED | Unmet dependency / approval |
| M10-T13 | Implement email provider abstraction + bounce/complaint webhooks | P1 | M | M10-T12 | BLOCKED | Unmet dependency / approval |
| M10-T14 | Implement notification dispatcher with dedupe keys | P1 | M | M10-T13, M1-T15 | BLOCKED | Unmet dependency / approval |
| M10-T15 | Implement localized template rendering with ICU plurals | P1 | M | M10-T14 | BLOCKED | Unmet dependency / approval |
| M10-T16 | Implement in-app notification inbox + preferences UI | P1 | M | M10-T14 | BLOCKED | Unmet dependency / approval |
| M10-T17 | Implement unboxing notice with dedupe by shipment/type/channel | P2 | S | M10-T14 | BLOCKED | Unmet dependency / approval |
| M10-T18 | UI: search results page with filters | P1 | L | M10-T07 | BLOCKED | Unmet dependency / approval |
| M10-T19 | E2E: locale switch through checkout preserves cart | P1 | M | M10-T02 | BLOCKED | Unmet dependency / approval |
| M10-T20 | Accessibility test: ja label wrapping at 320px | P1 | S | M10-T02 | BLOCKED | Unmet dependency / approval |

**M10 exit:** en/ja/id usable end-to-end; search correct and current.

---

# M11 — Advertising and recommendations (Gate 4)

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M11-T01 | Migration: provider connections, catalog items, sync jobs | P2 | M | M3-T03 | BLOCKED | Unmet dependency / approval |
| M11-T02 | Migration: promotion mappings, campaigns, campaign rules | P2 | M | M11-T01 | BLOCKED | Unmet dependency / approval |
| M11-T03 | Implement shared eligibility predicate for catalog/search/ads/recs | P1 | M | M3-T21 | BLOCKED | Unmet dependency / approval |
| M11-T04 | Implement catalog sync worker with coalescing + retry + backoff | P2 | L | M11-T01, M1-T16 | BLOCKED | Unmet dependency / approval |
| M11-T05 | Implement Google Merchant Center adapter | P2 | L | M11-T04 | BLOCKED | Unmet dependency / approval |
| M11-T06 | Implement Meta catalog adapter | P2 | L | M11-T04 | BLOCKED | Unmet dependency / approval |
| M11-T07 | Implement promotion start/end sync + post-expiry reconciliation | P2 | M | M11-T04 | BLOCKED | Unmet dependency / approval |
| M11-T08 | Implement rejection reason capture + retry endpoint | P2 | M | M11-T04 | BLOCKED | Unmet dependency / approval |
| M11-T09 | Implement campaign selection + budget control (platform-funded only) | P2 | M | M11-T02 | BLOCKED | Unmet dependency / approval |
| M11-T10 | Integration test: sync never creates paid campaign | P2 | S | M11-T09 | BLOCKED | Unmet dependency / approval |
| M11-T11 | UI: admin marketing catalog sync + error queue | P2 | L | M11-T08 | BLOCKED | Unmet dependency / approval |
| M11-T12 | Migration: interaction events, similarity, candidate scores, impressions | P2 | M | M5-T03 | BLOCKED | Unmet dependency / approval |
| M11-T13 | Implement product similarity (category/brand/attributes/price band) | P2 | M | M11-T12 | BLOCKED | Unmet dependency / approval |
| M11-T14 | Implement trending (rolling windows, dedupe, bot resistance) | P2 | M | M11-T12 | BLOCKED | Unmet dependency / approval |
| M11-T15 | Implement frequently bought together from finalized orders | P2 | M | M11-T12 | BLOCKED | Unmet dependency / approval |
| M11-T16 | Implement candidate filtering + fallback | P2 | M | M11-T03 | BLOCKED | Unmet dependency / approval |
| M11-T17 | Implement recommendation endpoints with caching | P2 | M | M11-T16 | BLOCKED | Unmet dependency / approval |
| M11-T18 | Implement personalization consent toggle | P2 | S | M11-T17 | BLOCKED | Unmet dependency / approval |
| M11-T19 | UI: recommendation placements (home/product/cart) | P2 | L | M11-T17 | BLOCKED | Unmet dependency / approval |
| M11-T20 | UI: admin recommendation governance | P2 | M | M11-T19 | BLOCKED | Unmet dependency / approval |
| M11-T21 | Unit test: suspended/out-of-stock excluded; no stale price | P2 | M | M11-T16 | BLOCKED | Unmet dependency / approval |
| M11-T22 | Security test: no provider secrets in client bundle | P1 | S | M11-T05 | BLOCKED | Unmet dependency / approval |

**Gate 4:** recommendations + marketing integrations verified.

---

# M12 — Hardening and launch

| ID | Task | Pri | Size | Depends on | Status | Blocker / note |
|---|---|---|---|---|---|---|
| M12-T01 | Load test at target capacity; record p95 against budgets | P0 | L | M0-T10 | BLOCKED | Unmet dependency / approval |
| M12-T02 | OWASP review + dependency audit + fix findings | P0 | L | M11 milestone completion (prerequisite; not a task ID) | BLOCKED | Unmet dependency / approval |
| M12-T03 | Full authorization matrix regression run | P0 | M | M2-T14 | BLOCKED | Unmet dependency / approval |
| M12-T04 | Backup restore drill with measured RPO/RTO | P0 | M | M1-T27 | BLOCKED | Unmet dependency / approval |
| M12-T05 | Observability dashboards: outbox age, queue lag, unreconciled money, stock drift, sync rejection | P0 | M | M1-T22 | BLOCKED | Unmet dependency / approval |
| M12-T06 | Alert thresholds + routing | P0 | M | M12-T05 | BLOCKED | Unmet dependency / approval |
| M12-T07 | Runbooks: stuck outbox, unknown payout, COD gap, index drift, inventory discrepancy | P0 | M | M12-T05 | BLOCKED | Unmet dependency / approval |
| M12-T08 | Data retention + deletion jobs per policy | P0 | M | M0-T11 | BLOCKED | Unmet dependency / approval |
| M12-T09 | Incident response plan + on-call rotation | P0 | M | M12-T07 | BLOCKED | Unmet dependency / approval |
| M12-T10 | Feature flags for staged rollout | P1 | M | M1-T06 | BLOCKED | Unmet dependency / approval |
| M12-T11 | Launch checklist sign-off with evidence links | P0 | S | All required release prerequisites except M12-T11 itself (explicit set pending approval) | BLOCKED | Unmet dependency / approval |

---

## 1. Agent execution protocol

For each task:

1. Confirm the task status is `TODO` and all dependencies are `DONE`.
2. Read the linked specification documents and the relevant ADR.
3. Write a short plan (files, migrations, endpoints, tests).
4. Implement the smallest vertical slice: migration → service → contract → API → UI → tests.
5. Run lint, typecheck, unit, integration, and relevant E2E tests.
6. Update this backlog: status, owner, date, evidence links.
7. Report: files changed, migrations, tests executed, results, remaining risks, rollback steps.

**Forbidden:**
- Marking `DONE` without passing tests.
- Changing a business rule to simplify implementation.
- Adding a table, endpoint, or screen not in the specs without updating the docs.
- Skipping authorization tests.
- Committing secrets.

---

## 2. Ready-to-start tasks (current)

Only unfinished, unblocked M0 planning tasks are eligible for recommendation; authorization is still required. M0-T05 and M0-T12 are DONE. ADR-003/M0-T03 is also DONE. The earlier planning order is retained below as historical guidance; M0-T12 has been completed since that ordering was written:

1. **M0-T05** module boundaries — DONE, 2026-10-19; excluded from new work.
2. **M0-T07** canonical route map (no external dependency).
3. **M0-T08** design token reconciliation (no external dependency).
4. **M0-T10** performance budgets.
5. **M0-T11** PII classification.
6. **M0-T12** ADR index.

Then the decision-blocked ADRs (M0-T01 to M0-T04, T06, T09) once stakeholders respond.

**Do not start M1 until M0-T02 and M0-T03 are `DONE`, except M1-T01 (per the activated Foundation Development Gate), M1-T02 (per the section 11 exception) and M1-T03 (per the section 12 exception).** All exceptions are narrow and never roll forward to later tasks.

## Reconciliation notes (documentation-only)

- Existing task IDs preserved. Original statuses `TODO` were normalized to `NOT_STARTED`, **not** `READY`. Blocker details were moved into the `Blocker / note` column.
- All M1+ tasks require **Gate 0 approval**, regardless of local dependency lists, except the specifically approved M1-T01 gate and the M1-T02/M1-T03 exceptions ([[09-Implementation/Foundation-Development-Gate]] §11–§12). Full Gate 0 remains NOT READY.
- `M12-T02 → M11` is milestone-level; `M12-T11 → All` needs an explicit, non-self-referential release prerequisite list before approval.
- `M5` payment/COD E2E acceptance occurs only when the relevant M6/M8 capabilities are present; core checkout testing remains in M5. See [[09-Implementation/Milestone-Reconciliation]].
- Review the disputed dependencies in the reconciliation document; they have **not** been declared resolved by this status normalization.
- M0-T05 is DONE as an approved planning document; no application task is DONE and no application code has been written.
- **M1-T02 scope label:** the original backlog title said "project references" but the approved M1-T02 implementation (decision D4, [[09-Implementation/Task-Handoffs/M1-T02]]) **excludes** `composite`/project references. The canonical task ID is preserved; the title now states the approved scope. No project references were added and the TypeScript architecture is unchanged.
- **Deferred ADR-005 checks (M1-T03):** M1-T03 enforces static imports and literal dynamic imports only. Resolved module-graph checks and NestJS DI/provider-graph checks (ADR-005 §14) have **no existing task ID**; they must be added under new IDs in a future backlog revision, without renumbering existing IDs. M1-T25 (CI: lint, typecheck, unit, migration test, build) does not currently cover them. See [[09-Implementation/Task-Handoffs/M1-T03]] §14 and [[09-Implementation/Foundation-Development-Gate]] §12.3.
