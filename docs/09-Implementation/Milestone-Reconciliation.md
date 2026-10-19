---
tags: [planning, milestones, reconciliation]
status: PROPOSED
canonical_scheme: M0-M12
---
# Milestone Reconciliation — Proposed Canonical IDs

> [!important] Draft migration, pending approval
> The existing detailed plan uses **M0–M12** and **M<n>-T<nn>**. Do not rename existing canonical task IDs. Legacy **M00–M14** milestone references are mapped by scope, not by identical numerals. This document preserves the original definitions and the proposed mappings. No application task is newly approved here.

The primary references are Milestones.md (/E:/Projects/deazly/docs/09-Implementation/Milestones.md), Task-Backlog.md (/E:/Projects/deazly/docs/09-Implementation/Task-Backlog.md), and Dependency-Graph.md (/E:/Projects/deazly/docs/09-Implementation/Dependency-Graph.md).

The detailed backlog contains 277 tasks, with:

- No duplicate task IDs.
- No unresolved references to explicit task IDs.
- No cycles among explicit task-to-task dependency edges.
- Two dependencies requiring clarification: M12-T02 → M11 and M12-T11 → All.

These checks establish reference integrity only. They do not establish that requirements or prerequisites are complete.

### Canonical structure

| Record | Proposed convention |
|---|---|
| Milestone | Retain M0 through M12 |
| Task | Retain existing M0-T01, M1-T01, etc. |
| Feature | Retain existing IDs such as ORD-010 |
| Architecture decision | Retain ADR-001 through ADR-005 |
| Gate requirement | Retain G0-01, G1-01, etc. |
| Legacy identifiers | Preserve in a mapping register with source-document context |

Once assigned, a task ID remains stable. A later scheduling change updates its milestone assignment rather than renumbering it. New tasks receive the next unused sequence; existing tasks are never overwritten.

### Legacy milestone mapping

The left column refers specifically to the milestone definitions in 06-Implementation/PROJECT-STATUS.md.

| Legacy milestone | Proposed canonical destination | Mapping qualification |
|---|---|---|
| M00 Foundation/environment | M1 Platform foundation | Planning prerequisites belong to M0 |
| M01 Authentication/authorization | M2 Identity and tenancy | Direct scope match |
| M02 Vendor management | M2; related work in M3/M8 | Onboarding/membership in M2; offers and finance elsewhere |
| M03 Catalog/media | M3 Catalog, offers, discounts, media | Direct scope match |
| M04 Inventory/warehouses | M4 Inventory and warehouses | Direct scope match |
| M05 Storefront/search | M10 discovery/localization; M5 shopping flows | Storefront coverage is incomplete; see below |
| M06 Checkout/orders | M5 Cart, checkout, orders | Payment integration also depends on M6/M8 |
| M07 Payments/COD/ledger | M6 Payments/ledger and M8 COD | Split milestone |
| M08 Fulfillment/shipping/tracking | M7 Fulfillment and shipping | Inventory prerequisites remain in M4 |
| M09 Returns/refunds/disputes | M9 Returns, refunds, disputes | Financial primitives remain in M6 |
| M10 Vendor payouts/finance | M8 Settlements/payouts; M6 ledger | Split milestone |
| M11 Notifications/messaging | M10 notifications | Buyer-seller messaging lacks detailed task coverage |
| M12 Promotions/advertising | M3 discounts and M11 advertising | Vouchers remain a separate coverage gap |
| M13 Recommendations/analytics | M11 recommendations | Broader analytics lacks complete task coverage |
| M14 Security/testing/deployment | M0 decisions, M1 foundation, M12 hardening; security throughout | No single equivalent |

Canonical M0 Decisions and architecture records has no direct legacy milestone equivalent. It formalizes planning work previously mixed into prerequisites and Stage 0.

The overlapping labels M10, M11, and M12 have different meanings in the two schemes. Their migration must use document context, never global text replacement.

### Legacy task mapping

Only one numbered task using the legacy task convention was found:

| Legacy task | Canonical mapping |
|---|---|
| M00-001 — Initialize pnpm Monorepo | M1-T01 for workspace initialization |

The broader objective in CURRENT-SPRINT.md also mentions infrastructure and tooling. Preserve that scope through links to M1-T02–M1-T08, M1-T23–M1-T25, as applicable; do not silently expand M1-T01 to absorb them.

All 277 existing detailed task IDs map to themselves. The five thematic stages in 06-Implementation/Backlog.md remain navigation groupings, not additional milestones.

### Requirements without a direct task equivalent

Adopting the detailed milestone scheme must not imply complete coverage. Preserve and explicitly trace these requirements:

- Customer homepage, category browsing, product detail, and seller comparison.
- Buyer-seller messaging, product Q&A/reviews, wishlist and alerts.
- Vouchers, loyalty, and exchange behavior requiring further specifications.
- Vendor analytics and broader marketplace analytics.
- Actual deployment preparation beyond deployment decisions and launch sign-off.

Some appear in the feature registry or adjacent-module specifications without corresponding executable tasks. Keep them as unresolved coverage items until approved task breakdowns exist. Do not delete, silently defer, or mark them covered by a broad milestone title.

### Dependency corrections requiring approval

| Finding | Proposed correction |
|---|---|
| M1 instructions sometimes require only ORM/topology approval, while readiness requires all Gate 0 items | Make Gate 0 sign-off an explicit prerequisite of M1 |
| M0 backlog exit criteria cover fewer deliverables than Gate 0’s 35 requirements | Add requirement-to-task traceability for every Gate 0 item |
| M5 requires online/COD E2E verification before M6 payment and M8 COD work | Separate core checkout verification from later integrated verification; preserve all tests |
| M5-T12 lacks explicit quote-revalidation/COD prerequisites | Link the relevant revalidation, eligibility, and idempotency tasks before acceptance |
| M5-T11 depends on vendor onboarding but not COD approval implementation | Add approval/policy prerequisites; distinguish disabled/unconfigured behavior from completed COD support |
| Critical-path narrative places settlements before fulfillment/allocation | Align it with the actual settlement inputs and milestone plan |
| M3 milestone includes search projection, but implementation tasks are in M10 | Distinguish M3 event production from M10 index consumption |
| Shared eligibility appears first in M11-T03, after M10 search needs it | Specify the common eligibility contract earlier; retain M11-T03 and revise its role/dependencies explicitly |
| M12-T11 → All can imply self-dependency | Define an explicit release prerequisite set excluding the sign-off task itself |

Also distinguish build dependencies, runtime calls, event flows, and foreign-key dependencies. The current diagrams sometimes combine them.

The illustrative migration families M001–M012 are a separate namespace. They also differ between Data-Model.md and Dependency-Graph.md, particularly around M009–M011. Preserve their source-qualified meanings until a schema reconciliation; they are not milestone aliases.

### Affected documents

After approval, reconciliation would affect:

| Documents | Intended change |
|---|---|
| 06-Implementation/PROJECT-STATUS.md | Canonical milestone summary and next planning task |
| 06-Implementation/CURRENT-SPRINT.md | Canonical references; separate planning authorization from coding authorization |
| 06-Implementation/FEATURE-REGISTRY.md | Task/milestone traceability; preserve all 100 feature IDs |
| 06-Implementation/Backlog.md | Link thematic requirements to canonical tasks and uncovered requirements |
| 06-Implementation/PROGRESS-LOG.md | Append reconciliation history; preserve original entries |
| 09-Implementation/Task-Backlog.md | Status legend, dependency corrections, evidence fields |
| 09-Implementation/Milestones.md | Gate alignment and scope clarifications |
| 09-Implementation/Dependency-Graph.md | Separate dependency types and correct sequencing |
| 09-Implementation/Readiness-Checklist.md | Requirement-to-task links and corrected terminology |
| 09-Implementation/Architecture-Audit.md | Dated addendum preserving the original audit |
| Root AGENTS.md, docs/AGENTS.md, 00-START-HERE.md | Align workflow terminology and navigation |
| Architecture/interface, data-model, event documents | Incorporate approved boundary and reliability decisions |

Proposed new documents, with paths subject to approval:

- docs/09-Implementation/Milestone-Reconciliation.md
- docs/09-Implementation/Task-Status-Policy.md
- docs/05-Architecture/ADRs/ADR-005-Module-Boundaries.md

## Reconciliation applied in this ZIP

- Operational summaries in `06-Implementation/` now *reference* the M0–M12 detailed milestone system.
- Original legacy mapping is preserved above, and original historical progress entries remain intact.
- Detailed task IDs are preserved; task availability and dependency fixes beyond explicit normalization remain review items.
- This does not constitute sign-off of the canonical architecture or Gate 0.
