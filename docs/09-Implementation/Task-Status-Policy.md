---
tags: [implementation, status, governance]
status: PROPOSED
---
# Task Status Policy and Migration

> [!warning] Proposed policy; acceptance and authorization remain separate from task status.

Use the requested vocabulary for task and feature implementation status:

| Status | Required meaning |
|---|---|
| NOT_STARTED | Work has not begun; readiness is not established |
| READY | Scope approved, prerequisites satisfied, acceptance criteria defined |
| IN_PROGRESS | Authorized work actively underway |
| BLOCKED | A recorded dependency or decision prevents progress |
| IMPLEMENTED | Deliverable exists; verification remains incomplete |
| VERIFIED | Required verification passed with evidence |
| DONE | Verified deliverable explicitly accepted |

For documentation tasks, “deliverable” means the document or specification. It never implies application implementation.

### Existing inconsistencies and migration

| Existing value/location | Proposed treatment |
|---|---|
| Six TODO tasks in detailed backlog | Evaluate individually; use NOT_STARTED unless READY criteria are established |
| IN PROGRESS legend | Replace with IN_PROGRESS |
| REVIEW legend | Use IMPLEMENTED or VERIFIED according to actual evidence; record review outcome separately |
| BLOCKED (reason) cells | Store BLOCKED as the status; preserve reason in a blocker field |
| not-started backlog metadata | Normalize if it represents implementation status |
| planning, audit-complete, design-spec, not-ready | Preserve meaning in document lifecycle/readiness fields |
| Payment/payout REVIEW | Preserve as a business state |
| Unchecked checkboxes | Treat as unsatisfied criteria, not automatically NOT_STARTED tasks |

The detailed backlog currently has 271 BLOCKED task rows and six TODO rows. The feature registry already uses the requested vocabulary.

A feature can remain NOT_STARTED while its constituent tasks are BLOCKED: these describe different records. Summaries must not report conflicting statuses for the same task.

### History-preserving migration procedure

1. Capture each current record’s source, identifier, status, dependencies, and evidence.
2. Approve the identifier mapping and status policy.
3. Convert current records using evidence; do not infer progress from the migration.
4. Preserve original values and reasons in a dated migration record.
5. Append a progress-log entry; retain historical wording and IDs.
6. Validate counts, aliases, dependencies, and feature coverage.
7. Require reviewer acceptance before publishing the reconciled tracking state.

Record authorization, blockers, verification results, and review decisions separately from status. For example, review_decision: REVISE must not become an eighth implementation status.

A failed verification cannot advance to VERIFIED or DONE. Reopened work records its regression and reason without erasing previous verification history.

## Operational guardrails

- `review_decision: ACCEPT | REVISE | BLOCKED` is not a task status.
- `BLOCKED` tasks must retain their blocker reasons and dependencies.
- A documentation task marked `DONE` proves an accepted document, never application code.
- No project application feature is considered implemented in this ZIP.
