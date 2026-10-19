---
tags: [requirements, coverage, planning]
status: OPEN
---
# Feature Coverage Gaps — Not Yet Assigned to Detailed Tasks

> [!warning] These are requirements from existing Deazly documentation and the supplied Codex audit. Existing feature IDs remain valid; no feature is removed or silently deferred. An approved task breakdown and traceability review are required before declaring coverage.

| Requirement | Example existing feature IDs / modules | Gap to resolve |
|---|---|---|
| Customer homepage, category browsing and detail UX | CUS-001–004 | Screen implementation tasks, data contracts, states and acceptance tests |
| Canonical seller comparison | CUS-007 | Seller-offer selection/filtering tasks and UI test coverage |
| Messaging and Q&A/reviews | CUS-014–015 | Moderation, access, lifecycle and API task split |
| Wishlist / restock / price alerts | CUS-008, experience extensions | Notification preferences, data/event rules and delivery tasks |
| Vouchers, loyalty and exchanges | Promotions, customer experience | Funding/stacking, points ledger, exchange flow and controls |
| Vendor and cross-market analytics | Vendor Seller Center / administration | Metrics definitions, event attribution and authorization |
| Homepage CMS, mobile interaction and localization | ADM-007, localization | Publish workflow, responsive behavior, per-locale banners |
| Live deployment and operational readiness | M12, Operations | Environment, rollback, monitoring, incident and go-live tasks |

## Required follow-up

1. Associate each feature ID with one or more existing canonical task IDs when truly covered.
2. Draft new stable task IDs for uncovered scope; do **not** insert new task IDs silently.
3. Review priority and determine whether recommendations/advertising are launch blockers or later releases.
4. Require tests and accepted criteria for every mapped feature.

See [[06-Implementation/FEATURE-REGISTRY]] and [[09-Implementation/Task-Backlog]].
