---
tags: [architecture, audit, implementation, planning]
status: audit-complete
created: 2026-10-19
---
# Architecture Audit — Multi-Vendor Marketplace

> [!important] Audit scope and status
> Audit date: **2026-10-19**. Vault state: **planning / specification only**.
> No application code, schema migration, endpoint, screen, or test exists in the repository.
> Every "coverage" judgement below refers to **specification coverage**, never implementation.
> This audit does not alter any confirmed business rule. Conflicts are recorded, not resolved unilaterally.

## Related documents
- [[00-START-HERE]]
- [[01-Product/Business-Rules]]
- [[01-Product/Decision-Register]]
- [[05-Architecture/Architecture-and-Interfaces]]
- [[05-Architecture/Data-Model]]
- [[05-Architecture/API-Contracts]]
- [[05-Architecture/Events-and-Failures]]
- [[06-Implementation/Backlog]]
- [[08-Operations/Decisions-to-Confirm]]
- [[09-Implementation/Dependency-Graph]]
- [[09-Implementation/Milestones]]
- [[09-Implementation/Task-Backlog]]
- [[09-Implementation/Readiness-Checklist]]

---

## 1. Objective and method

**Objective:** verify that the design vault is complete, internally consistent, and executable as a dependency-aware build plan before any code is generated.

**Method:**
1. Read `AGENTS.md`, `docs/AGENTS.md`, `docs/00-START-HERE.md`, and all 37 pre-existing documents under `docs/` (39 Markdown files including the two repository-root files).
2. Followed all internal wiki links referenced from the start page and module documents.
3. Mapped every confirmed business rule to a module, data entity, API surface, screen, and test.
4. Compared statements across product, architecture, module, and experience documents.
5. Classified every finding as **CONFIRMED**, **PROPOSED**, **OPEN**, **MISSING**, or **CONFLICT**.

**Document set reviewed (39 files):**

| Group | Files |
|---|---|
| Root | `AGENTS.md`, `productStucture.md` |
| Index | `docs/00-START-HERE.md`, `docs/AGENTS.md`, `docs/README.md` |
| Product | `Business-Rules`, `Decision-Register` |
| Design | `Screen-Inventory`, `Sitemap-and-Navigation`, `Visual-System` |
| Screens | `Admin-Flows`, `Customer-Flows`, `Finance-and-Support`, `Vendor-Flows`, `Warehouse-Flows` |
| Modules | 01 Multi-Warehouse … 09 Customer-Experience-Extensions (9 files) |
| Architecture | `Architecture-and-Interfaces`, `Data-Model`, `API-Contracts`, `Events-and-Failures` |
| Implementation | `Backlog` |
| Experience | `UI-UX-Master-Plan`, `Screen-Wireframes`, `Customer-Checkout-and-Orders`, `Vendor-Seller-Center`, `Admin-Warehouse-Finance`, `Product-Images-and-Quality`, `Localization-and-Search`, `Notifications-and-Email`, `Marketing-and-Recommendations` |
| Operations | `Decisions-to-Confirm` |

---

## 2. Requirements coverage matrix

Legend — **Spec:** ✅ specified · 🟡 partial · ❌ absent.
**Impl:** always ❌ (no code exists). **Blocker:** open decision required before build.

### 2.1 Business and commercial rules

| ID | Requirement | Source | Spec | Data model | API | UI | Test spec | Impl | Blocker |
|---|---|---|---|---|---|---|---|---|---|
| BR-01 | Single shared storefront, many vendors | Business-Rules | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-02 | One cart, one checkout, one parent order | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-03 | Independent vendor sub-orders | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-04 | Vendor orders may have multiple shipments | Business-Rules | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-05 | 10% commission on final discounted price | Business-Rules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | BR-14 rounding |
| BR-06 | Commission never on delivery charge | Business-Rules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | — |
| BR-07 | Vendor funds own discounts | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-08 | Scheduled discount start/end, auto-expiry | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-09 | Immutable historical order prices | Business-Rules | ✅ | ✅ | 🟡 | 🟡 | 🟡 | ❌ | — |
| BR-10 | Platform pays all Google/Meta ad spend | Business-Rules | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-11 | Vendors never billed for advertising | Business-Rules | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-12 | PLATFORM_FULFILLED / VENDOR_FULFILLED | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-13 | Platform delivery deduction only when platform-fulfilled | Business-Rules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | BR-05, BR-11 |
| BR-14 | Vendor payable = price − commission − delivery | Business-Rules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | BR-15 negative |
| BR-15 | Centralized payment accounting | Business-Rules | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | BR-16 gateway |
| BR-16 | Vendor-specific independent settlement | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | BR-07, BR-08 |
| BR-17 | Partial cancellation and refunds | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | BR-06, BR-07 |
| BR-18 | COD and online payment | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | BR-09, BR-16 |
| BR-19 | COD disabled for new vendors | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-20 | Admin approval gates vendor COD | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-21 | Per-offer COD toggle by approved vendor | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-22 | Checkout revalidates COD eligibility | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-23 | Mixed online-only carts force online payment | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-24 | COD collection ≠ remittance ≠ payout release | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | BR-09 |
| BR-25 | Multiple warehouses | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-26 | Inventory reservation | Business-Rules | ✅ | ✅ | ✅ | 🟡 | ✅ | ❌ | — |
| BR-27 | Vendor→warehouse transfers | Business-Rules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | BR-05 inbound freight |
| BR-28 | Stock reconciliation | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-29 | en / ja / id localization | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | BR-09 locale |
| BR-30 | Multilingual search | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-31 | Translation management workflow | Business-Rules | ✅ | ❌ | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-32 | Google Merchant / Meta catalog sync | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-33 | Scheduled price/discount sync | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-34 | Image optimization + quality checker | Business-Rules | ✅ | 🟡 | ✅ | ✅ | ✅ | ❌ | — |
| BR-35 | Similar / trending / FBT recommendations | Business-Rules | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | BR-10 privacy |
| BR-36 | UUIDv4 order URLs + authorization | Business-Rules | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | — |
| BR-37 | Customer/vendor/admin/warehouse/finance apps | Business-Rules | ✅ | ✅ | 🟡 | ✅ | 🟡 | ❌ | — |
| BR-38 | Returns, refunds, disputes, email, payouts | Business-Rules | ✅ | 🟡 | 🟡 | ✅ | 🟡 | ❌ | BR-06, BR-07 |
| BR-39 | Guest checkout | AGENTS §1 | 🟡 | 🟡 | 🟡 | 🟡 | ❌ | ❌ | — |
| BR-40 | Guest order secure verification | AGENTS §4.8 | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | — |

### 2.2 Platform and engineering requirements

| ID | Requirement | Source | Spec | Blocker |
|---|---|---|---|---|
| EN-01 | pnpm monorepo with fixed app/package layout | AGENTS §12 | ✅ | — |
| EN-02 | NestJS modular monolith | AGENTS §3 | ✅ | — |
| EN-03 | PostgreSQL source of truth | AGENTS §3 | ✅ | — |
| EN-04 | ORM selection (Prisma vs Drizzle) via ADR | AGENTS §3 | ❌ **no ADR** | **YES** |
| EN-05 | Redis / BullMQ | AGENTS §3 | ✅ | — |
| EN-06 | Meilisearch | AGENTS §3 | ✅ | — |
| EN-07 | R2/S3 media | AGENTS §3 | ✅ | — |
| EN-08 | Docker local environment | AGENTS §3 | 🟡 | — |
| EN-09 | GitHub Actions CI | AGENTS §3 | 🟡 | — |
| EN-10 | OpenTelemetry observability | AGENTS §3 | 🟡 | — |
| EN-11 | OpenAPI from NestJS DTOs | API-Contracts | ✅ | — |
| EN-12 | Transactional outbox + inbox dedupe | Events-and-Failures | ✅ | — |
| EN-13 | Idempotency keys | API-Contracts | ✅ | — |
| EN-14 | Webhook signature verification | Events-and-Failures | ✅ | — |
| EN-15 | Audit logging | AGENTS §9 | 🟡 | — |
| EN-16 | Rate limiting | AGENTS §9 | 🟡 | — |
| EN-17 | Admin MFA | AGENTS §9 | 🟡 | — |
| EN-18 | Double-entry immutable ledger | AGENTS §10 | ✅ | — |
| EN-19 | Database migrations + constraints | AGENTS §3 | ✅ | — |
| EN-20 | Unit / integration / contract / E2E tests | AGENTS §3 | 🟡 | — |
| EN-21 | Accessibility baseline | AGENTS §11 | 🟡 | — |
| EN-22 | ADR process for architectural changes | AGENTS §15 | ✅ | — |
| EN-23 | Deployment architecture ADR | AGENTS §15 | ❌ | **YES** |
| EN-24 | Authentication architecture ADR | AGENTS §15 | ❌ | **YES** |

**Coverage summary (specification only):** 40/40 business rules have at least partial specification. 14 are fully specified end-to-end (data + API + UI + test). 21 are partial (typically missing concrete API request/response contracts or test acceptance). 5 are materially incomplete: guest checkout, guest verification, translation persistence, COD approval entity, media metadata schema.

---

## 3. Missing feature report

### 3.1 Missing from the data model (highest severity)

| # | Missing object | Why it matters | Evidence |
|---|---|---|---|
| D-01 | `guest_checkout_sessions` / verified guest access token store | Guest checkout is a stated requirement but has no persistence or verification model | AGENTS §1, §4.8; Customer-Checkout §Guest access |
| D-02 | `translations` table + locale columns strategy | Localization requires translatable entities but Data-Model has no translation tables | AGENTS §7; Localization-and-Search §Content ownership |
| D-03 | `vendor_cod_approvals` / vendor COD status entity | Vendor COD state machine (NOT_REQUESTED → APPROVED) has no table | Business-Rules; Vendor-Flows §COD |
| D-04 | `media_assets`, `media_variants`, `quality_reports`, `quality_findings` | Image pipeline requires metadata tables; only prose exists | Product-Images-and-Quality |
| D-05 | `discounts` / `promotions` tables with time windows and funding party | Scheduled vendor discounts are confirmed but only implied in catalog | AGENTS §4.3; V02 |
| D-06 | `carts` / `cart_items` | Checkout requires a server cart; no cart entity in ERD | Data-Model; C03 |
| D-07 | `users` credential/session tables (identity detail) | `USERS` appears in ERD with no attributes, sessions, or MFA model | Data-Model |
| D-08 | `vendor_verification` / seller application workflow | Vendor onboarding and approval referenced, not modeled | Admin-Flows; Seller Center |
| D-09 | `addresses` / customer profile | Checkout address step has no entity | C03 |
| D-10 | `returns`, `refunds`, `disputes` schemas | Mentioned as adjacent; cancellation module covers requests only | Modules 03, 09 |
| D-11 | `notifications`, `email_templates`, `delivery_attempts` | Notification system fully described, not modeled | Notifications-and-Email |
| D-12 | `pricing_quotes` / checkout quote snapshot | "Immutable checkout quote" required, no entity | C03 Step 4 |
| D-13 | `shipping_slots` / delivery promise | Checkout mentions slot selection; no model | C03, C04 |
| D-14 | `outbox`/`inbox` concrete schema | Only described as primitives | Events-and-Failures |
| D-15 | `audit_log` concrete schema | Required everywhere, never defined | AGENTS §9 |
| D-16 | `carriers`, `carrier_accounts`, `labels` | Shipping allocation references carriers, no registry | Module 05 |
| D-17 | `catalog_categories`, `brands`, `attributes`, `product_media` | Canonical catalog incomplete for a Daraz-like storefront | Module 01, Data-Model |
| D-18 | `product_reviews` / ratings | Customer screens mention Reviews; no model or rule | C02 |
| D-19 | `order_item_price_snapshot` explicit columns | Snapshot is described but not enumerated | Data-Model |
| D-20 | `payout_methods` / bank account verification | Payouts reference `payout_method_ref` only | Module 04 |
| D-21 | `inventory_lot` ↔ `warehouse` ownership/custody rules | `owner` vs `custodian` mentioned, not modeled | Module 01 |
| D-22 | `coupons` / `vouchers` redemption ledger | Adjacent module only; affects checkout pricing | Module 09 |
| D-23 | `search_documents` / index version tracking | Search rebuild and staleness diagnostics need state | Localization-and-Search |
| D-24 | `feature_flags` / policy configuration versioning | OPEN decisions require typed versioned policy config | Decision-Register |

### 3.2 Missing workflows

| # | Missing workflow | Impact |
|---|---|---|
| W-01 | Vendor onboarding → verification → approval → first offer | No defined state machine or screens |
| W-02 | Guest checkout → verification → order access | Security-critical, entirely undefined |
| W-03 | Customer registration, login, password reset, MFA | Identity is the first build dependency |
| W-04 | Cart merge on login (guest → customer) | Common marketplace requirement, absent |
| W-05 | Inventory reservation expiry → release → order cancellation | Mentioned as failure rule, no job spec |
| W-06 | Online payment capture → authorize → void → refund lifecycle | Only high-level references |
| W-07 | Partial refund allocation across vendor orders and ledger | Invariants stated, algorithm absent |
| W-08 | Return → inspection → restock or scrap → refund | Only status labels |
| W-09 | Dispute escalation and SLA timers | No timers or assignment model |
| W-10 | Vendor suspension and catalog takedown cascade | Event named, workflow absent |
| W-11 | Product canonicalization / duplicate merge | "Avoid duplicates" with no merge workflow |
| W-12 | Translation review and publish pipeline | Statuses named, no persistence/workflow |
| W-13 | Search reindex and reconciliation | Pipeline described, no rebuild/verify job |
| W-14 | Catalog sync reconciliation after promo expiry | Requirement stated, no reconciliation design |
| W-15 | Warehouse cycle count and stock adjustment approval | Mentioned, no state machine |
| W-16 | Payout method change with verification hold | Mentioned, no flow |
| W-17 | Negative vendor balance recovery | OPEN decision with no interim behavior beyond "hold" |
| W-18 | Admin emergency actions (pause storefront, freeze payouts) | Referenced in UI, no command model |
| W-19 | Data retention and lawful deletion | Stated as policy, no implementation model |
| W-20 | Incident response and restore drill | Stated as a gate, no runbook |

### 3.3 Missing non-functional specifications

- Concrete performance budgets (search latency, checkout p95, dashboard p95, catalog sync throughput).
- Load and capacity targets (SKUs, vendors, orders/day, concurrent checkouts).
- Backup/RPO/RTO numbers.
- Data residency and PII classification matrix.
- Rate-limit values per endpoint class.
- Accessibility conformance target (WCAG 2.1 AA vs 2.2 AA) — currently only "WCAG-aligned".
- Browser/device support matrix.
- Currency and FX policy for multi-currency display (JPY examples only).
- Observability SLOs and alert thresholds (metrics named, thresholds absent).

---

## 4. Conflicting business rules

> [!warning] Conflicts are recorded for decision. No rule has been changed.

### C-01 — Commission base vs discount funding (terminology drift, not economic conflict)
- `AGENTS.md` §4.2 and `docs/AGENTS.md`: commission on **final discounted product selling price**.
- `Business-Rules`: same, with illustration ¥1,000 → ¥100.
- `04-Modules/04-Vendor-Payouts`: "Vendor portion is 90% **before allocated platform delivery**."
- **Status:** consistent economically. **Risk:** the phrase "90%" can be misread as a fixed vendor rate. It must be implemented as `amount − round(amount × 1000bps)`, not `amount × 0.9`, because rounding policies differ.
- **Recommendation:** standardize on "commission = round(final item total × 1000 bps)" and forbid literal 0.9 multipliers. Document in ADR-002.

### C-02 — Rounding policy undefined (BR-14 OPEN)
- `AGENTS.md` §4.2 demands "documented, deterministic integer-minor-unit rounding policy".
- `Decision-Register` BR-14 marks it OPEN.
- **Conflict:** the rule is mandatory but the algorithm is unselected. Per-line vs per-order rounding changes totals.
- **Impact:** commission, settlement, refund, and invoice amounts can differ by ¥1 per line.
- **Recommendation:** choose per-line HALF_UP on commission, then reconcile order totals against the sum of lines with an explicit residual line. Block settlement until resolved.

### C-03 — "10% commission" vs taxes
- `Business-Rules` says the illustration is payout economics, not tax policy; taxes are separate.
- `Module 02` leaves tax-inclusive vs tax-exclusive OPEN (BR-13).
- **Conflict risk:** if commission is computed on a tax-inclusive price, the platform effectively commissions tax. Not decided.
- **Recommendation:** define commission base as **net of tax** or **gross of tax** explicitly per market before ledger implementation.

### C-04 — Customer-paid shipping vs vendor deduction
- `Business-Rules` and `Module 05` allow a customer shipping fee.
- BR-11 is OPEN; examples assume product totals only.
- **Conflict risk:** double recovery if the customer pays shipping and the vendor is also deducted the full platform delivery cost.
- **Recommendation:** model three separate amounts: customer shipping charged, actual carrier cost, vendor-liable allocation, with the invariant `vendor_liability + platform_funded + customer_funded = actual_cost`.

### C-05 — COD for VENDOR_FULFILLED orders
- `AGENTS.md` §4.6 requires "approved cash collection/remittance arrangement".
- BR-09 is OPEN; `Module 06` says do not assume the platform has the cash.
- **Conflict:** the system must support the feature, but the money flow is undefined, so settlement cannot be implemented safely.
- **Recommendation:** build the COD state machine with an explicit `remittance_responsible_party` enum; leave `VENDOR_COLLECTED` blocked by policy flag until decided.

### C-06 — Advertising catalog inclusion vs approval
- `AGENTS.md` §4.7: "Approved eligible products synchronize automatically."
- `Marketing-and-Recommendations`: "Approved product/offer → eligibility → outbox sync."
- **No conflict**, but `Module 08` also says "every approved and channel-eligible seller offer should be synchronized", which is a broader set than "approved eligible products".
- **Recommendation:** define one eligibility predicate shared by catalog sync, search, and recommendations.

### C-07 — Vendor payout release timing
- BR-07 / BR-08 OPEN (returns window, payout cadence).
- `Module 04` state machine requires eligibility checks but no interval.
- **Conflict risk:** implementing a default cadence would silently create a business policy.
- **Recommendation:** implement `eligible_at` as data driven by versioned policy; refuse to auto-release when policy is unconfigured.

### C-08 — Role naming inconsistency
- `00-START-HERE` roles: `VENDOR_OWNER`, `VENDOR_STAFF`, `WAREHOUSE_OPERATOR`, `WAREHOUSE_MANAGER`, `SUPPORT_AGENT`, `FINANCE_OPERATOR`, `FINANCE_APPROVER`, `MARKETING_ADMIN`, `SUPER_ADMIN`.
- `Module 04` uses `FINANCE_MAKER` / `FINANCE_APPROVER`.
- `Module 01` uses "warehouse manager".
- `AGENTS.md` §11 lists six interface areas including a separate **Finance Dashboard**, while `Sitemap-and-Navigation` places finance under `/admin/finance`.
- **Conflict:** two role vocabularies and two app topologies.
- **Recommendation:** publish a single RBAC matrix (ADR) before guards are written. Decide whether finance is a separate app or a permission-gated area of admin.

### C-09 — App topology
- `AGENTS.md` §12 lists `apps/storefront`, `vendor`, `admin`, `warehouse`, `api`, `worker` (no finance app).
- `AGENTS.md` §11 requires a **Finance Dashboard**.
- `Architecture-and-Interfaces` says apps "may be deployed as separate frontends or role-routed apps".
- **Conflict:** unresolved deployment topology affects routing, auth cookies, and CI.
- **Recommendation:** ADR to confirm six frontends or five plus finance routes; default to finance under `admin` with strict RBAC unless separation is required for compliance.

### C-10 — Design token duplication
- `02-Design/Visual-System` proposes `--brand: #155eef`, `--bg: #f7f9fc`.
- `07-Experience/UI-UX-Master-Plan` proposes `Primary #2563EB`, `Background #F8FAFC`.
- **Conflict:** two palettes.
- **Recommendation:** treat `Visual-System` as canonical and reconcile Master Plan; do not generate tokens from both.

### C-11 — Route naming
- `Sitemap-and-Navigation`: `/account/orders/[id]`, `/vendor/orders/[id]`.
- `Customer-Checkout-and-Orders`: `/[locale]/account/orders/[uuid]`.
- `Vendor-Seller-Center`: `/vendor/orders/[uuid]`, `/vendor/products`, but `Vendor-Flows` refers to `/vendor/offers`.
- **Conflict:** `id` vs `uuid`, `products` vs `offers`.
- **Recommendation:** fix a canonical route map before frontend scaffolding.

### C-12 — Notification for `ParentOrderConfirmed` vs vendor orders
- `Notifications-and-Email`: one customer confirmation grouped by vendor.
- `Events-and-Failures`: `VendorOrderConfirmed` event.
- **No conflict**, but the mapping between parent confirmation and per-vendor events is unspecified (transaction boundary vs async).
- **Recommendation:** emit `OrderPlaced` once and `VendorOrderConfirmed` per vendor inside the same transaction; notify from a projection.

---

## 5. Database architecture gaps

| # | Gap | Consequence | Recommendation |
|---|---|---|---|
| DB-01 | No schema-per-module DDL beyond illustrative snippets | Cannot generate migrations safely | Produce full DDL per module with FK order |
| DB-02 | Money model defined conceptually, not as a reusable type | Inconsistent columns across tables | Standardize `(amount_minor BIGINT, currency CHAR(3))` composite or value object |
| DB-03 | No tax-inclusive price representation | Ambiguous invoice math | Add `tax_inclusive` flag + tax category on offer/order item |
| DB-04 | No price snapshot column list | Historical accuracy risk | Enumerate snapshot columns: base, discount, final, commission bps, rounding policy version, currency, fx rate |
| DB-05 | `stock_balances` sample omits FKs and warehouse ownership | Referential integrity risk | Add FKs, `CHECK`, and partial unique indexes |
| DB-06 | No idempotency key uniqueness scope | Duplicate financial mutations | `UNIQUE(scope, idempotency_key)` on command tables |
| DB-07 | No outbox/inbox tables | Reliability primitives missing | Add `platform.outbox`, `platform.inbox` with state + attempt indexes |
| DB-08 | No audit log schema | Compliance gap | Append-only `platform.audit_log` with actor, before/after JSONB, correlation id |
| DB-09 | No soft-delete / retention strategy per table | Accounting and privacy conflict | Classification matrix + retention policy table |
| DB-10 | No translation strategy (column vs table) | Localization blocked | Use `translations(entity_type, entity_id, locale, field, value, status, version)` |
| DB-11 | No `carts` persistence | Checkout cannot resume | Add cart with expiry and guest token |
| DB-12 | No `order_events` append-only detail | Timeline UI and audit | Already named in Module 03; promote to core migration |
| DB-13 | No unique business identifiers | Human order numbers mentioned only | Add `order_number` sequence with prefix + uniqueness |
| DB-14 | No currency/FX table | Multi-currency display undefined | Add `currency_rates` versioned table or restrict to single currency in MVP |
| DB-15 | No inventory ledger linkage to ledger transactions | Stock and money reconciliation | Add `ledger_ref` on stock movement where cost-bearing |
| DB-16 | No carrier and label registry | Fulfillment incomplete | Add `carriers`, `carrier_services`, `shipment_labels` |
| DB-17 | No unique constraint for one active reservation per item/lot/location | Oversell risk | Partial unique index on `(order_item_id, lot_id, location_id) WHERE status='ACTIVE'` |
| DB-18 | No separation of parent order money vs vendor order money | Reporting ambiguity | Explicit `order_totals` and `vendor_order_totals` projections |
| DB-19 | No event versioning on aggregates | Out-of-order handling | Add `aggregate_version` on mutable aggregates |
| DB-20 | No `dispute`/`return` FK to ledger adjustments | Money traceability | Link every adjustment to `ledger_transaction_id` |

---

## 6. Missing API specifications

### 6.1 Missing contract categories

| # | Area | Missing |
|---|---|---|
| API-01 | Auth | register, login, logout, refresh, password reset, MFA enroll/verify, session list |
| API-02 | Guest | guest cart, guest checkout, guest order verification (email/OTP), token exchange |
| API-03 | Cart | add/update/remove, merge on login, price revalidation, coupon apply |
| API-04 | Catalog | category tree, brand list, product detail, offer list, facet search |
| API-05 | Checkout | quote creation, quote revalidation, place order, payment intent |
| API-06 | Payments | webhook contracts, refund creation, capture/void, gateway status |
| API-07 | Vendor onboarding | application, documents, verification status |
| API-08 | Vendor COD | request activation, approval status, per-offer toggle |
| API-09 | Media | signed upload completion semantics, quality report schema, decision payload |
| API-10 | Inventory | adjustment with reason, cycle count, availability query |
| API-11 | Returns/disputes | open, evidence upload, vendor response, decision, refund link |
| API-12 | Notifications | preferences, inbox, template admin |
| API-13 | Admin policy | versioned policy CRUD with effective dates |
| API-14 | Search admin | reindex, synonyms, index health |
| API-15 | Translations | CRUD, publish, import/export, missing report |
| API-16 | Payouts | method verification, statement export, provider webhook |
| API-17 | Webhooks | carrier, payment, email, Google, Meta — signature and replay contracts |
| API-18 | Idempotency | header semantics, replay response, conflict response |

### 6.2 Contract quality gaps

- No OpenAPI component schemas for money, currency, pagination, or errors beyond examples.
- No enumerated status values per resource (UI depends on them).
- No versioning strategy for breaking changes.
- No rate-limit headers or 429 contract.
- No webhook event payload schemas beyond the envelope example.
- No authorization matrix mapping endpoint → required permission → scope predicate.
- No example for cursor pagination on multi-sort endpoints.
- No specification for `Idempotency-Key` retention window or replay body.

---

## 7. Missing UI/UX screen specifications

`Screen-Inventory` lists 22 screens. Several required flows have no screen at all:

| # | Missing screen | Reason required |
|---|---|---|
| UX-01 | Registration / login / password reset / MFA | Identity is prerequisite |
| UX-02 | Guest order lookup and verification | AGENTS §4.8 |
| UX-03 | Vendor onboarding wizard and verification status | Vendor lifecycle |
| UX-04 | Admin vendor approval detail | Referenced in Admin-Flows but no spec |
| UX-05 | Admin COD approval detail | Referenced as `/admin/vendors/[id]/cod`, no wireframe |
| UX-06 | Cart page | Checkout starts at C03; cart is separate |
| UX-07 | Search results and filters | Sitemap has `/search`; no screen spec |
| UX-08 | Category listing / browse | Homepage references categories |
| UX-09 | Customer account dashboard and addresses | Only orders/returns listed |
| UX-10 | Vendor staff & permissions management | Named in Seller Center nav |
| UX-11 | Vendor analytics | Named, not specified |
| UX-12 | Admin audit log viewer | Required by AGENTS §9 |
| UX-13 | Admin policy configuration (commission/rounding/payout) | Decision-Register requires versioned policy UI |
| UX-14 | Admin translation manager wireframe | Described only in prose |
| UX-15 | Admin search health | Named in nav, no spec |
| UX-16 | Warehouse cycle count / adjustment | Mentioned in Module 01 |
| UX-17 | Finance adjustments / manual journal | Referenced in nav |
| UX-18 | Error pages (404/403/500) with safe recovery | Required by state checklist |
| UX-19 | Notification center and preferences | Described in experience doc, no screen |
| UX-20 | Return label / pickup scheduling | Return flow references it |
| UX-21 | Dispute evidence upload | Adjacent module only |
| UX-22 | Admin feature flags / maintenance mode | Operational necessity |

Additionally, none of the 22 existing screens has a complete field-level specification covering all 12 required attributes from `AGENTS.md` §11 (purpose, roles, components, data dependencies, actions, validation, loading, empty, error, responsive, accessibility, authorization). They are described at layout level.

---

## 8. Security and permission gaps

| # | Gap | Risk | Recommendation |
|---|---|---|---|
| SEC-01 | No authentication ADR (session vs OIDC) | Cannot scaffold auth | ADR-001 before identity module |
| SEC-02 | No RBAC permission matrix | Guards cannot be generated consistently | Single table: role × permission × scope |
| SEC-03 | Role vocabulary inconsistent (C-08) | Privilege bugs | Normalize roles |
| SEC-04 | No vendor staff invitation/permission model | Cross-vendor leakage | Add `vendor_memberships` with role + invite flow |
| SEC-05 | Guest access undefined | Data exposure via UUID | Signed, short-lived, single-purpose token + rate limit |
| SEC-06 | No CSRF strategy detail | Session auth risk | SameSite + token for state-changing routes |
| SEC-07 | No MFA enforcement policy | Admin compromise | Require MFA for admin/finance roles at login |
| SEC-08 | No secrets management design | Credential leakage | Secret manager + rotation policy + no secrets in logs |
| SEC-09 | No PII classification | Privacy non-compliance | Classify fields; mask in logs and support views |
| SEC-10 | No export authorization model | Bulk data leakage | Scope every export; audit; row limits |
| SEC-11 | No support impersonation rules | Unauthorized access | Explicit consent + audit + read-only default |
| SEC-12 | No webhook replay protection window | Duplicate financial events | Inbox dedupe + timestamp tolerance |
| SEC-13 | No file upload malware scanning detail | RCE/stored payloads | AV scan before promotion to public bucket |
| SEC-14 | No audit log tamper resistance | Repudiation | Append-only + hash chaining or WORM storage |
| SEC-15 | No rate-limit values | Abuse | Per-IP and per-account limits on auth/OTP/search |
| SEC-16 | No authorization test plan | Regression risk | Matrix-driven contract tests per role |

---

## 9. Payment, COD and settlement risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| PAY-01 | Commission rounding undefined (BR-14) | High | Versioned rounding policy + reconciliation test |
| PAY-02 | Commission base ambiguous re tax (C-03) | High | Decide net/gross before ledger |
| PAY-03 | COD remittance responsibility undefined (BR-09) | Critical | Model responsible party; block vendor COD until approved |
| PAY-04 | Payout release interval undefined (BR-07) | High | Data-driven `eligible_at`; no hardcoded default |
| PAY-05 | Negative payable policy undefined (BR-15) | Medium | Hold + review; no silent debit |
| PAY-06 | Refund after payout has no recovery flow | High | Recovery receivable + negative balance case |
| PAY-07 | No gateway abstraction or idempotency contract | Critical | Provider adapter with reference-based reconciliation |
| PAY-08 | No partial refund allocation algorithm | High | Item-level refund caps + deterministic allocation |
| PAY-09 | Multi-currency ledger undefined | Medium | Single currency per ledger account; FX policy ADR |
| PAY-10 | Double-deduction risk on merged shipments | High | Allocation invariant test per cost line |
| PAY-11 | Ledger lacks explicit chart of accounts | High | Define accounts: sales, commission, delivery, refunds, payouts, receivables |
| PAY-12 | No maker-checker implementation detail | High | Distinct actor enforced at DB + service |
| PAY-13 | No payout provider reconciliation states | High | `REVIEW` on unknown; never blind retry |
| PAY-14 | Tax/invoice issuance blocked by open jurisdiction | Critical | Gate 3 blocked until decided |
| PAY-15 | Advertising spend not in vendor ledger (correct) but no platform P&L model | Low | Platform accounting out of scope; document boundary |

---

## 10. Warehouse and fulfillment risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| WH-01 | No explicit custody vs ownership model | High | `inventory_lots.owner_type` + `custodian_warehouse_id` |
| WH-02 | Inbound freight responsibility OPEN (BR-05) | Medium | Configurable, no auto-deduction |
| WH-03 | Reservation expiry job unspecified | High | BullMQ job + DB transaction + idempotency |
| WH-04 | Cross-warehouse allocation algorithm unspecified | High | Deterministic candidate ordering + lock order |
| WH-05 | No oversell concurrency test defined at DB level | Critical | `SELECT … FOR UPDATE` + invariant tests |
| WH-06 | Transit stock double-count risk | High | Separate `IN_TRANSIT` bucket, excluded from sellable |
| WH-07 | Serialized unit uniqueness scope unclear | Medium | Unique per lot or per warehouse; decide |
| WH-08 | No RTO (return-to-origin) inventory flow | High | Define RTO receiving → quarantine → disposition |
| WH-09 | No damage/scrap accounting | Medium | Stock movement type + evidence + approval |
| WH-10 | Vendor-to-warehouse transfer after order undefined in sequencing | High | Decide reservation vs transfer-first policy |
| WH-11 | No pick/pack shortage handling | Medium | Partial pick → exception → substitution policy |
| WH-12 | No carrier integration contract | High | Carrier adapter interface + label storage |
| WH-13 | No cycle count schedule or tolerance | Medium | Policy-driven count + variance approval |
| WH-14 | Offline scanning explicitly excluded but not enforced | Low | Document as non-goal in MVP |

---

## 11. Architectural risks (cross-cutting)

| # | Risk | Impact | Recommendation |
|---|---|---|---|
| AR-01 | ORM not selected (Prisma vs Drizzle) | Blocks schema/migration tooling | ADR-002 with evaluation criteria |
| AR-02 | Modular monolith boundaries only prose | Coupling, circular deps | Define module dependency rules + lint enforcement |
| AR-03 | No deployment topology ADR | CI/CD ambiguity | ADR-003 |
| AR-04 | Outbox dispatcher design unspecified | Event loss/duplication | Claiming strategy + visibility timeout + DLQ |
| AR-05 | No schema versioning strategy for events | Consumer breakage | Event schema registry + version field |
| AR-06 | Search index drift | Wrong prices/stock shown | Outbox-driven index + periodic reconciliation job |
| AR-07 | Recommendation reads may hit primary DB | Checkout latency | Read model/cache with TTL |
| AR-08 | Media pipeline backpressure | Queue saturation | Concurrency limits + priority queues |
| AR-09 | Catalog sync rate limits | Throttling/rejections | Token bucket + coalescing |
| AR-10 | No performance budgets | Unknown scalability | Define SLOs before Gate 2 |
| AR-11 | No feature-flag strategy | Risky rollout | Typed flags + environment config |
| AR-12 | No migration rollback policy | Production incidents | Forward-only + tested restore |
| AR-13 | Two design systems (C-10) | UI inconsistency | Single token source |
| AR-14 | Route naming drift (C-11) | Broken links, auth scope bugs | Canonical route map |
| AR-15 | Documentation duplication across `02-Design` and `07-Experience` | Contradiction risk | Declare canonical doc per topic |

---

## 12. Recommended improvements

### 12.1 Immediate (before general application scaffolding)

These prerequisites remain the default for all implementation other than M1-T01. The approved [[09-Implementation/Foundation-Development-Gate]] permits only that dependency-free workspace initialization after its activation checks; it does not unblock the dependent M1 tasks or business modules.
1. Write **ADR-001 Authentication architecture** (session vs OIDC, MFA, guest access).
2. Write **ADR-002 ORM selection** with a decision matrix (Prisma vs Drizzle) covering: migrations, raw SQL for ledger/locking, type safety, partial indexes, transactions, JSONB, tooling.
3. Write **ADR-003 Deployment topology** (number of frontends, finance app vs admin route).
4. Write **ADR-004 Money and rounding policy** (minor units, commission rounding, residual handling).
5. Write **ADR-005 Module boundaries and dependency rules**.
6. Publish a **single RBAC permission matrix** and reconcile role names (C-08).
7. Publish a **canonical route map** and reconcile `id`/`uuid` and `products`/`offers` (C-11).
8. Publish **one design token set** (C-10).
9. Decide Gate 0 policies: country, seller-of-record, tax mode, COD remittance, payout cadence, returns window.
10. Define **performance budgets and capacity targets**.

### 12.2 Data model
11. Produce full DDL per migration family with FK ordering and constraints.
12. Add the 24 missing objects listed in §3.1, prioritizing identity, cart, discounts, translations, media, COD approval.
13. Add outbox/inbox/audit/idempotency primitives **in M001**, not M009, because every module depends on them.
14. Define the chart of accounts before writing the ledger.

### 12.3 API
15. Add OpenAPI component schemas for money, pagination, errors, and status enums.
16. Produce an endpoint → permission → scope matrix.
17. Define webhook contracts per provider with signature and replay rules.
18. Define idempotency semantics precisely (key scope, TTL, replay, conflict).

### 12.4 UI/UX
19. Complete field-level specs for the 22 existing screens against the 12 required attributes.
20. Add the 22 missing screens in §7.
21. Define accessibility conformance target and test method.
22. Define responsive breakpoint behavior per screen, not globally.

### 12.5 Process
23. Split `06-Implementation/Backlog` into the granular task backlog in [[09-Implementation/Task-Backlog]].
24. Require test evidence per task; never mark done from code generation.
25. Add an ADR index and a decision log with dates and owners.

---

## 13. Findings summary

| Category | Count | Status |
|---|---|---|
| Confirmed business rules | 40 | Specified, 0 implemented |
| Fully specified end-to-end | 14 | Ready to build after ADRs |
| Partially specified | 21 | Need API/DB detail |
| Materially incomplete | 5 | Blocked |
| Missing data objects | 24 | Must design |
| Missing workflows | 20 | Must design |
| Conflicting rules/terms | 12 | Need decisions (only C-02, C-03, C-05 are economically material) |
| Missing API areas | 18 | Must define |
| Missing screens | 22 | Must design |
| Security gaps | 16 | Must close before Gate 1 |
| Payment risks | 15 | 4 critical |
| Warehouse risks | 14 | 3 critical |
| Architectural risks | 15 | 4 blocking |

**Overall readiness:** the vault is a strong **product and architecture brief** but is **not yet an executable engineering specification**. The blocking set is small and well-defined: four ADRs, the RBAC matrix, the route map, the design-token reconciliation, and the Gate 0 policy decisions. None of these requires new product invention.

**Verdict:** **Not production-ready; not implementation-ready.** It is **planning-ready with a defined unblock path**. See [[09-Implementation/Readiness-Checklist]].

## 2026-10-19 — Addendum: Codex reconciliation assessment

The uploaded Codex planning response identifies 277 existing task IDs, 0/35 Gate 0 sign-offs, ambiguous milestone numbering, two broad dependency references, missing customer/marketing/analytics task coverage, and missing approved module boundaries. See [[09-Implementation/Milestone-Reconciliation]], [[09-Implementation/Task-Status-Policy]], [[05-Architecture/ADRs/ADR-005-Module-Boundaries]], and [[09-Implementation/Feature-Coverage-Gaps]]. This is a planning update; it does not supersede the original audit or establish implementation.
