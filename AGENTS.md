# AGENTS.md — Multi-Vendor Marketplace

> Master instructions for OpenCode and other AI coding agents.
> Project status: **PLANNING — APPLICATION DEVELOPMENT NOT STARTED**

## 1. Project Overview

Build a production-grade, scalable, single-storefront multi-vendor e-commerce marketplace similar in functionality to Daraz.

The marketplace must have original branding, original UI/UX, maintainable code, and clearly defined business domains.

The system supports:

- Customers and guest checkout
- Multiple vendors and seller storefronts
- Marketplace administrators
- Warehouse and fulfillment staff
- Finance and support teams
- One customer checkout with multiple vendor orders
- Centralized payment accounting
- Vendor-specific settlements
- Platform Fulfilled and Vendor Fulfilled orders
- COD and online payments
- Multiple warehouses
- Product catalogs and vendor-specific offers
- Automated product advertising catalog synchronization
- Multilingual storefronts and dashboards
- Advanced product recommendations
- Returns, refunds, disputes and notifications

**Current project phase:** Architecture and UI/UX planning.

Do not assume any feature has already been implemented.

---

## 2. Source of Truth

Before doing any task:

1. Read this `AGENTS.md`.
2. Read `docs/00-START-HERE.md`.
3. Read the relevant architecture documents.
4. Read the relevant database, API and UI/UX specifications.
5. Review the current implementation milestone.
6. Check existing code before creating or modifying files.

Documentation priority:

1. Approved business decisions
2. Approved architecture decision records
3. Approved database and API contracts
4. Approved UI/UX specifications
5. Implementation backlog
6. Existing application code

Existing code must be inspected carefully when it conflicts with documentation. Report the inconsistency rather than blindly overwriting working functionality.

Do not invent requirements, tables, endpoints or implementation status.

---

## 3. Technology Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query where appropriate
- React Hook Form
- Zod
- next-intl

### Backend

- Node.js
- NestJS
- TypeScript
- REST API with OpenAPI documentation
- Modular monolith architecture

### Database

- PostgreSQL as the primary database
- Prisma or Drizzle, selected through an architecture decision
- SQL migrations
- Foreign keys and database constraints
- ACID transactions for critical operations
- JSONB for flexible product attributes

### Infrastructure

- Redis
- BullMQ
- Meilisearch
- Cloudflare R2 or AWS S3
- Docker
- GitHub Actions
- OpenTelemetry-compatible observability

### Testing

- Unit tests
- Integration tests
- API contract tests
- Playwright E2E tests
- Security and authorization tests

Do not introduce another primary database or microservices without an approved architecture decision.

---

## 4. Critical Marketplace Business Rules

These rules must never be silently changed.

### 4.1 Multi-Vendor Orders

- Customers use one shared cart and checkout.
- One checkout creates one parent order.
- Parent orders contain independent vendor sub-orders.
- Each vendor order contains its own order items.
- Vendor orders may have multiple shipments.
- Payment accounting is centralized.
- Vendor settlement is independent.
- Partial cancellation and refunds must be supported.

### 4.2 Commission

The marketplace commission is fixed at 10%.

Commission is calculated on the final discounted product selling price.

Example:

Final product price: ¥1,000

Marketplace commission: ¥100

Vendor share before applicable delivery deductions: ¥900

Do not calculate commission on the original pre-discount price.

Apply a documented, deterministic integer-minor-unit rounding policy.

### 4.3 Discounts

- Vendors fund their own product discounts.
- Vendors can schedule discount start and end times.
- Promotional prices must be validated.
- Expired discounts must stop applying automatically.
- Historical order prices must remain unchanged.

### 4.4 Fulfillment

Support:

- PLATFORM_FULFILLED
- VENDOR_FULFILLED

For Platform Fulfilled orders:

- Platform manages the applicable fulfillment and customer delivery.
- Platform delivery deductions are allocated to the vendor.
- Vendor earnings are reduced by authorized delivery deductions.

For Vendor Fulfilled orders:

- Vendor manages delivery.
- No platform delivery deduction applies unless separately authorized.

Support both warehouse pre-stocked inventory and vendor-to-warehouse transfers after order placement.

Vendor-to-warehouse shipping responsibility remains subject to an approved policy.

### 4.5 Vendor Earnings

Basic calculation:

vendor_payable =
final_product_price

- platform_commission
- applicable_platform_delivery_deduction

Refunds, tax treatment and other approved adjustments must be accounted for separately.

Use immutable financial ledger entries and settlement snapshots.

Never directly modify balances without an auditable transaction.

### 4.6 Cash on Delivery

- Newly registered vendors have COD disabled.
- Admin approval is required before enabling vendor COD.
- Approved vendors may enable or disable COD per eligible seller offer.
- Checkout must revalidate COD eligibility.
- COD availability depends on platform, vendor, offer, courier and destination policies.
- Mixed carts containing online-only offers require online payment by default.
- Vendor Fulfilled COD must use an approved cash collection/remittance arrangement.
- COD collection and marketplace remittance are separate events.
- Vendor payout must not be released based only on delivery confirmation.

### 4.7 Advertising

- Marketplace pays Google and Meta advertising costs.
- Vendors do not pay advertising fees.
- Approved eligible products synchronize automatically to advertising catalogs.
- Product price, availability and scheduled promotion changes trigger catalog synchronization.
- Admin controls paid campaign selection and advertising budgets.
- Catalog synchronization does not guarantee ad delivery.
- Google/Meta integration errors must be tracked and retryable.

### 4.8 Order Identifiers

- Use securely generated random UUIDv4 identifiers for order URLs.
- Parent orders and vendor orders have separate UUIDs.
- Human-readable order numbers may be generated separately.
- Never rely on UUID unpredictability as authorization.
- Enforce customer ownership and vendor isolation on every order API.
- Guest order access requires secure verification.

---

## 5. Product Catalog Rules

Use:

CatalogProduct
→ ProductVariant
→ SellerOffer

A canonical product may have multiple seller offers.

Seller offers manage:

- Vendor
- SKU
- Selling price
- Discounts
- Stock
- Condition
- COD availability
- Fulfillment method
- Vendor-specific images
- Warranty and shipping terms

Avoid duplicate canonical products wherever possible.

Different used/refurbished product conditions must be represented accurately.

---

## 6. Product Media Management

Use S3/R2-compatible object storage.

Required features:

- Multiple product images
- Primary image
- Image reordering
- Variant images
- Direct authorized uploads
- File validation
- Background optimization
- Responsive image sizes
- CDN delivery
- Image Quality Checker
- Duplicate detection
- Quality review
- Advertising image eligibility

Keep media metadata in PostgreSQL.

Do not store image binaries directly in PostgreSQL.

Never delete referenced media without evaluating dependent records and retention requirements.

---

## 7. Localization

Initial languages:

- English — en
- Japanese — ja
- Indonesian — id

Required functionality:

- Language switching
- Localized storefront
- Localized vendor dashboard
- Localized admin dashboard
- Localized warehouse screens
- Product and category translations
- Multilingual search
- Translation management
- Localized transactional emails
- Localized SEO metadata
- Fallback translations

Language and currency must be independent.

Do not duplicate products merely to support translations.

Do not silently publish unreviewed machine translations as approved content.

---

## 8. Search and Recommendations

### Search

Use Meilisearch with PostgreSQL as the source of truth.

Support:

- Multilingual product search
- Localized aliases
- Brand and model matching
- SKU matching
- Structured specification search
- Typo tolerance
- Filters and sorting
- Canonical product grouping

### Recommendations

Initial algorithms:

1. Product Similarity
2. Trending Products
3. Frequently Bought Together

Future algorithms:

- Collaborative filtering
- Personalized ranking
- Machine learning

Do not introduce expensive AI services during the initial implementation without justification.

Filter unapproved, unavailable and restricted products from recommendations.

---

## 9. Security and Authorization

Enforce authorization on the backend.

Required:

- Authentication
- RBAC
- Vendor membership checks
- Resource ownership checks
- Customer order isolation
- Warehouse staff permissions
- Finance permissions
- Admin MFA
- Rate limiting
- Input validation
- Secure cookies and session management
- CSRF protection where applicable
- Audit logging
- Secure file uploads
- Secrets management
- Webhook signature verification
- Idempotency

Never trust client-provided:

- Product price
- Commission
- Vendor identity
- Permissions
- Payment status
- Inventory
- Delivery deductions
- Settlement amounts

Do not expose credentials in source code or logs.

---

## 10. Financial and Payment Integrity

Use PostgreSQL transactions for critical financial mutations.

Maintain an immutable double-entry financial ledger.

Implement:

- Payment allocation per vendor order
- Commission calculation
- Delivery cost allocation
- Refund adjustments
- COD reconciliation
- Vendor settlement eligibility
- Payout batches
- Payout reconciliation
- Financial holds
- Audit trails

Use idempotency keys for payment and payout operations.

Use transactional outbox events for reliable asynchronous workflows.

Never implement financial operations as unrelated database updates without transaction or recovery design.

---

## 11. UI/UX Requirements

Build a clean, modern, responsive marketplace interface.

Design principles:

- Light visual theme
- Accessible contrast
- Consistent spacing
- Clear typography
- Responsive layouts
- Reusable components
- Keyboard accessibility
- Loading and error states
- Empty states
- Clear validation feedback
- Mobile-first customer shopping
- Efficient desktop dashboards

Required interface areas:

1. Customer Storefront
2. Vendor Seller Center
3. Admin Dashboard
4. Warehouse Dashboard
5. Finance Dashboard
6. Customer Account Portal

Before implementing a page, read its approved UI/UX specification.

Do not invent or redesign approved layouts without documenting the change.

Every page must define:

- Purpose
- User roles
- Components
- Data dependencies
- User actions
- Validation
- Loading states
- Empty states
- Error states
- Responsive behavior
- Accessibility
- Authorization requirements

---

## 12. Code Organization

Use a pnpm monorepo.

Preferred structure:

marketplace/

- apps/
  - storefront/
  - vendor/
  - admin/
  - warehouse/
  - api/
  - worker/
- packages/
  - database/
  - ui/
  - contracts/
  - validation/
  - config/
- docs/
- infrastructure/
- tests/

Backend business logic belongs in services and domain components, not directly inside controllers.

Keep module boundaries explicit.

Avoid circular dependencies.

Prefer strongly typed API contracts.

---

## 13. AI Agent Workflow

For each task:

1. Identify the active milestone.
2. Read relevant architecture documents.
3. Inspect existing files.
4. Identify dependencies and affected modules.
5. Create a small implementation plan.
6. Implement only the approved scope.
7. Add tests.
8. Run relevant verification commands.
9. Review security and business-rule compliance.
10. Update documentation and task status.

Do not implement unrelated features.

Do not rewrite unrelated modules.

Do not make unnecessary architectural changes.

Do not skip tests merely to finish faster.

---

## 14. Definition of Done

A task is complete only when:

- Requirements are implemented.
- Business rules are preserved.
- Type checking passes.
- Relevant automated tests pass.
- API contracts are satisfied.
- Authorization is verified.
- Error handling is implemented.
- Database migrations are tested where applicable.
- Documentation is updated.
- No critical security issues remain.
- The implementation is reviewed against acceptance criteria.

If a test cannot run, explicitly report why.

Never claim that an untested feature is production-ready.

---

## 15. Architecture Decision Rules

Create an Architecture Decision Record when changing:

- Primary database
- ORM
- Authentication architecture
- Payment architecture
- Order structure
- Financial ledger
- Fulfillment model
- Search engine
- Advertising synchronization design
- Major module boundaries
- Deployment architecture

Document:

- Context
- Options considered
- Decision
- Justification
- Consequences
- Migration implications

Do not silently override previous decisions.

---

## 16. Current Planning-Phase Restrictions

Until the architecture is approved:

ALLOWED:

- Analyze requirements
- Review Obsidian documents
- Create architecture diagrams
- Design PostgreSQL schemas
- Define API contracts
- Design UI/UX specifications
- Create implementation backlogs
- Document architectural risks
- Write test plans

NOT ALLOWED without explicit instruction:

- Generate application features
- Initialize production application code
- Install dependencies
- Run database migrations
- Deploy services
- Create production infrastructure
- Replace approved architecture

Approved narrow exception: `docs/09-Implementation/Foundation-Development-Gate.md` Revision 1 permits **M1-T01 only** after every activation prerequisite is verified, the gate is recorded active, and a final handoff plus explicit OpenCode permission is accepted. The gate is currently inactive. Full Gate 0 remains NOT READY; no other implementation task is permitted by this exception.

Planning documents are not evidence that the features have been implemented.

---

## 17. Agent Response Format

For architecture tasks, report:

1. Objective
2. Documents reviewed
3. Existing architecture findings
4. Proposed changes
5. Affected modules
6. Database implications
7. API implications
8. UI/UX implications
9. Security considerations
10. Testing requirements
11. Unresolved decisions
12. Next recommended task

For coding tasks, report:

1. Task completed
2. Files changed
3. Business rules affected
4. Tests executed and results
5. Remaining issues
6. Next dependency

Keep responses specific and verifiable.

---

## 18. Highest-Priority Engineering Principles

1. Financial correctness over implementation speed.
2. Customer and vendor data isolation.
3. Secure order access.
4. Transaction-safe inventory and payments.
5. Independent vendor fulfillment.
6. Reliable COD collection and reconciliation.
7. Transparent commission and delivery deductions.
8. Maintainable, modular architecture.
9. Accessible, consistent UI/UX.
10. Verified testing before deployment.

---

# AI Agent Project Progress Management Protocol

## Mandatory Session Initialization

Before starting any task, the AI agent MUST read:

1. AGENTS.md
2. 00-START-HERE.md
3. 06-Implementation/PROJECT-STATUS.md
4. 06-Implementation/FEATURE-REGISTRY.md
5. 06-Implementation/CURRENT-SPRINT.md
6. 06-Implementation/Backlog.md
7. 06-Implementation/PROGRESS-LOG.md

If these files are located inside a docs/ directory,
use their corresponding docs/ paths.

Read the relevant architecture, database,
API, and UI/UX documents for the task.

## Progress Source of Truth

Use this order when verifying progress:

1. Actual source code and database migrations
2. Executed test and verification evidence
3. Accepted task records
4. Feature Registry
5. Project Status summary
6. Current Sprint and Backlog

If source code and documentation disagree:

- Report the inconsistency.
- Inspect implementation evidence.
- Do not assume documentation is correct.
- Do not assume existing code is correct.
- Reconcile the status after verification.

## Feature Status Lifecycle

NOT_STARTED
↓
READY
↓
IN_PROGRESS
↓
IMPLEMENTED
↓
VERIFIED
↓
DONE

A task may instead become BLOCKED at any stage.

A failed verification cannot be marked DONE.

## Before Starting Development

The agent MUST:

1. Identify the current milestone.
2. Identify the active task.
3. Read task dependencies.
4. Verify prerequisite completion.
5. Inspect relevant existing source code.
6. Review related business rules.
7. Review database and API dependencies.
8. Review relevant UI/UX specifications.
9. Confirm the task is approved.
10. Present a concise implementation plan.

Do not begin a new development task without
explicit user authorization.

## After Implementing a Task

The agent MUST:

1. Review changed files.
2. Run relevant type checks.
3. Run relevant automated tests.
4. Verify relevant acceptance criteria.
5. Check authorization and security implications.
6. Update the related backlog task.
7. Update FEATURE-REGISTRY.md.
8. Update CURRENT-SPRINT.md.
9. Update PROJECT-STATUS.md.
10. Append an entry to PROGRESS-LOG.md.
11. Record available Git commit evidence.
12. Recommend the next eligible task.

Do not report an untested feature as production-ready.

## Status Consistency Rules

Every feature must have a stable feature ID.

Every implementation task must have a stable task ID.

The same feature must not have conflicting statuses
in different documents.

The Feature Registry summarizes feature status.

The Backlog stores individual task requirements
and task status.

PROJECT-STATUS.md is a summary, not a separate
independent source of task completion.

CURRENT-SPRINT.md identifies active work.

PROGRESS-LOG.md records historical activity.

Never delete progress history to conceal failures.

## Next Task Selection Rules

When asked "What should we build next?":

1. Read the approved milestone plan.
2. Find unfinished backlog tasks.
3. Exclude blocked tasks.
4. Verify required dependencies.
5. Check implementation evidence.
6. Prioritize the current milestone.
7. Recommend the smallest eligible task.
8. Explain why it should be next.

Do not automatically start coding.

## Required Agent Response

At the start of a development session, provide:

### Project Status

- Current phase
- Current milestone
- Overall verified progress

### Completed Work

- Verified completed tasks
- Relevant evidence

### Current Work

- Active task
- Implementation status

### Blockers

- Unresolved decisions
- Missing dependencies

### Next Recommended Task

- Task ID
- Task title
- Reason for selection

### Implementation Permission

- Approved or pending

## Planning Phase Protection

Until the user explicitly authorizes implementation:

- Do not initialize application code.
- Do not install dependencies.
- Do not run migrations.
- Do not deploy.
- Do not mark application features DONE.
- Do not alter approved business rules.

Architecture documents, UI mockups, and
implementation plans do not count as completed code.

## Implementation Documentation Structure

This project uses two implementation directories.

### docs/06-Implementation/

Purpose: Current development progress and execution tracking.

- PROJECT-STATUS.md: Overall project summary
- FEATURE-REGISTRY.md: Feature implementation status
- CURRENT-SPRINT.md: Active task and milestone
- PROGRESS-LOG.md: Historical development activity
- Backlog.md: Summary and navigation index

### docs/09-Implementation/

Purpose: Architecture planning and implementation specifications.

- Architecture-Audit.md: Architecture issues and gaps
- Dependency-Graph.md: Module/task dependencies
- Milestones.md: Development milestones
- Readiness-Checklist.md: Pre-development requirements
- Task-Backlog.md: Authoritative detailed task backlog

### Agent Rules

1. Read both implementation directories.
2. Use Task-Backlog.md for task requirements and dependencies.
3. Use FEATURE-REGISTRY.md for feature-level status.
4. Use CURRENT-SPRINT.md to determine active work.
5. Use PROJECT-STATUS.md for the overall summary.
6. Use PROGRESS-LOG.md for historical evidence.
7. Do not maintain conflicting task statuses.
8. Do not mark a task DONE without verification.
9. Do not begin unapproved tasks.
10. Follow the parallel-agent integration protocol.

When documentation conflicts, inspect actual code,
tests, and Git evidence before reconciling statuses.

## Two-Tool Development Workflow

This project uses:

- Codex CLI: Architecture planning and code review
- OpenCode + DeepSeek: Approved implementation tasks

### Shared Workspace

Both tools may read the same repository.

Only one tool may perform write operations at a time.

Codex operates in read-only mode during implementation
and review.

OpenCode follows the approved task specification.

### Handoff Protocol

1. Codex reviews the current milestone.
2. Codex prepares the next task specification.
3. The user approves the implementation.
4. OpenCode implements the approved task.
5. OpenCode runs required tests.
6. Codex reviews the changes and test evidence.
7. OpenCode fixes reported defects.
8. After acceptance, progress files are synchronized.
9. Verified changes are committed to Git.

### Progress Files

Keep the following centrally consistent:

- docs/06-Implementation/PROJECT-STATUS.md
- docs/06-Implementation/FEATURE-REGISTRY.md
- docs/06-Implementation/CURRENT-SPRINT.md
- docs/06-Implementation/PROGRESS-LOG.md
- docs/09-Implementation/Task-Backlog.md

No task is DONE until it is verified and accepted.

Never let both tools independently modify these files
at the same time.

**Never sacrifice backend correctness for frontend convenience.**

---
## Deazly Canonical Milestone Reconciliation (2026-10-19)

> [!warning] Planning status — Gate 0 remains NOT READY; the approved M1-T01-only exception is inactive.

- Canonical milestone IDs: **M0–M12** in `docs/09-Implementation/Milestones.md`.
- Canonical detailed task IDs: **M<n>-T<nn>** in `docs/09-Implementation/Task-Backlog.md`.
- Prior M00–M14 references are legacy aliases **by scope**, not equivalent numbers; see `docs/09-Implementation/Milestone-Reconciliation.md`.
- `docs/06-Implementation/Backlog.md` is a thematic navigation index; do not treat its stage labels as task IDs.
- Task lifecycle: `NOT_STARTED`, `READY`, `IN_PROGRESS`, `BLOCKED`, `IMPLEMENTED`, `VERIFIED`, `DONE`. Review verdict `ACCEPT/REVISE/BLOCKED` is separate.
- ADR-005 Revision 3 is **APPROVED** by Project Owner on 2026-10-19; M0-T05 is **DONE** as a verified and accepted planning deliverable, not application implementation. See `docs/06-Implementation/PROGRESS-LOG.md` for verification and approval evidence.
- M0-T03 ADR-003 and M0-T12 ADR index/log are **DONE** as accepted documentation tasks; ADR-003 Revision 1 is **APPROVED**. `docs/05-Architecture/ADRs/ADR-Index.md` and `Decision-Log.md` record evidence. M0-T05 / ADR-005 Revision 3 remains **DONE / APPROVED**.
- The Project Owner approved `docs/09-Implementation/Foundation-Development-Gate.md` Revision 1, restricted to M1-T01; it remains **INACTIVE** until every activation prerequisite passes. Gate 0 remains NOT READY (G0-03, G0-05, G0-06, G0-24 satisfied; 4/35). M1-T01 remains BLOCKED pending Git, toolchain, governance and handoff checks. No other implementation is authorized.
- ADR-001, ADR-002 and ADR-004 and downstream policies remain pending. Application development is not authorized until the Foundation Gate is activated and M1-T01 receives separate execution permission.
- Preserve the existing Git repository. The observed `main`/`origin/main` candidate is recorded in `docs/09-Implementation/Git-Setup-Plan.md`; the baseline is not accepted until native status, ignore and pinned secret-scanner checks pass.
- Read `docs/09-Implementation/Feature-Coverage-Gaps.md` before declaring any milestone complete.
- Never reinterpret an at-least-once outbox dispatcher as exactly-once delivery; consumers must be idempotent.
- Preserve historical progress log entries and never mark a planned feature implemented without code/test evidence.
