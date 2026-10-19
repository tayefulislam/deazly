---
tags: [architecture, decisions, history, planning]
task: M0-T12
status: ACCEPTED
approval: ACCEPTED
decision_owner: Project Owner
review_status: ACCEPTED
created: 2026-10-19
---
# Architecture Decision Log

> [!important] Accepted decision log — 2026-10-19
> The log preserves the ADR-005 approval history and records the current explicit Project Owner approvals. Gate 0 remains NOT READY and M1-T01 execution remains pending activation checks and separate authorization.

Append future records with decision owner, date, source, review result, status changes, affected tasks/gates and supersession. Never delete a prior rejection/finding to conceal it. Dates are known session dates, not invented times or signatures. See [[05-Architecture/ADRs/ADR-Index]].

## 2026-10-19 — ADR-005 revision history and approval (recorded from evidence)

- Decision owner / approver: Project Owner.
- Source: [[05-Architecture/ADRs/ADR-005-Module-Boundaries]] and [[06-Implementation/PROGRESS-LOG#M0-T05 approval evidence]].
- History: revision-2 review required corrections for HIGH reservation-expiry ambiguity, HIGH payout-liability arithmetic and MEDIUM economic-effect/replay completeness. Revision 3 supplied corrections; the focused final review returned ACCEPT.
- Explicit decision: the Project Owner's instruction "Deazly — Approve ADR-005 and Close M0-T05" approved Revision 3 and authorized planning-task closure.
- Recorded states: ADR-005 APPROVED, approval date 2026-10-19; M0-T05 IMPLEMENTED → VERIFIED → DONE; only G0-05 satisfied. Gate 0 NOT READY, 1/35.
- Supersession: earlier ADR-005 proposals only; preserve their findings and review evidence. No other ADR, policy, application feature or implementation milestone approved.
- Review qualification: Codex report accepted by owner; no separately named human security/finance audit or runtime testing is claimed.

## 2026-10-19 — Foundation approach selected; documentation package authorized

- Decision owner: Project Owner.
- Source: user's "DEAZLY — Prepare Foundation Development Approval Package" request in this session.
- Authorized: prepare ADR-003 PROPOSED, M0-T12 index/log draft, proposed Foundation Development Gate, M1-T01 scope proposal, Git setup plan, author documentation checks and relevant planning tracking.
- User explicitly selected Option B as the preferred approach, but explicitly withheld Foundation Development Gate approval and application coding authorization.
- No authorization for dependency/tool installation, Git initialization/commit, migrations, deployment, application source or OpenCode execution. No final implementation handoff is created.
- Task evidence: M0-T03 BLOCKED → IN_PROGRESS → IMPLEMENTED (draft produced under this authorization); M0-T12 NOT_STARTED → IN_PROGRESS → IMPLEMENTED (index/log draft). Both await required review and acceptance; neither is VERIFIED or DONE.

## 2026-10-19 — ADR-003 proposal and related scope records delivered

- Draft author: Codex; accountable decision owner: Project Owner; review verdict/date and approval: PENDING.
- Proposed decision: four frontend apps plus API and worker; protected finance area inside Admin; five shared workspaces; host-only cookie boundaries, same-origin API ingress and separate CI targets. [[05-Architecture/ADRs/ADR-003-Application-and-Deployment-Topology]].
- Related gates: G0-03/G0-24 remain unchecked; M0-T03 is not accepted. M0-T12 index/log delivery does not automatically satisfy G0-06.
- Proposed exception: [[09-Implementation/Foundation-Development-Gate]], M1-T01 only, inactive until explicit owner approval and all activation conditions. Existing full Gate 0 and ORM prerequisites remain in force today.
- Scope/version record: [[09-Implementation/M1-T01-Scope-Proposal]], not final handoff or execution permission. Git plan: [[09-Implementation/Git-Setup-Plan]], unexecuted.
- Supersession: none effective. Existing route/topology ambiguities are comparison targets, not silently rewritten specifications. Approved ADR-005 remains unchanged.
- Existing pending decisions: ADR-001/002/004 files missing; auth, ORM, money/rounding and business policies remain unresolved. No recommended option is treated as approved.

## Historical pending-record instruction (superseded by the approval entry below)

At the time this instruction was first drafted, review and explicit acceptance had not yet occurred. The following dated record supersedes that pending state; retained here as history.

Current-session repository observation: Git was absent at the initial check; an external actor subsequently created a main commit e5bd5da26def292260292c026abd25ff4985ae54 including proposal documents and added a small root README. Remote configuration is present. This agent performed no Git writes. Preserve that state; do not infer artifact approval, a clean index or an accepted foundation baseline from the commit. Details and pending validation are recorded in [[09-Implementation/Git-Setup-Plan]].

Record the reviewer identity/date/verdict, findings and exact approved artifact revisions; Project Owner decision/date; allowed exception scope and operative governance cross-references; tooling/Git authority; and any approved M0-T03/M0-T12 task transitions. Keep document approval, task verification/acceptance, gate activation and implementation permission separate. Rejecting or revising a proposal appends a new record; it does not erase this draft history.

## 2026-10-19 — ADR-003, M0-T12 and Foundation Development Gate approvals

- Decision owner: Project Owner.
- Review evidence: Final Foundation Readiness Review returned ACCEPT for ADR-003 Revision 1, M0-T12, Foundation Development Gate Revision 1 and M1-T01 Scope Proposal. Git Baseline returned REVISE for outstanding ignore/scanner validation; those findings remain open.
- Explicit decisions: Project Owner approved ADR-003 Revision 1, accepted M0-T12 — ADR Index and Decision Log, and approved Foundation Development Gate Revision 1. The approved exception is limited to M1-T01 and remains INACTIVE until every documented activation prerequisite is verified.
- Task transitions authorized: M0-T03 IMPLEMENTED → VERIFIED → DONE; M0-T12 IMPLEMENTED → VERIFIED → DONE. Evidence and verification checklist are appended in [[06-Implementation/PROGRESS-LOG#ADR-003-and-M0-T12-approval-evidence]].
- Gate status: full Gate 0 remains NOT READY. G0-03, G0-05, G0-06 and G0-24 are satisfied (4/35); 31 remain outstanding.
- Toolchain: Node.js 24.22.0 and pnpm 12.14.0 approved as pins, subject to local version verification. Neither was installed or upgraded in this task.
- Git: existing repository preserved at observed HEAD `ddd8d1a0e46f2e0badaaa0253425bd5f789a6f91` on `main`, origin configured; no commit or push. `.gitignore` prepared. Gitleaks v8.30.0 selected for pinned scanning; it was not available in checked conventional locations and no scan was run because host command execution was unavailable. Git baseline acceptance remains PENDING.
- Handoff: [[09-Implementation/Task-Handoffs/M1-T01]] prepared for review, explicitly NOT AUTHORIZED FOR EXECUTION. No application coding or task M1-T01 status change is authorized by these approvals.
- Supersession: no change to ADR-001, ADR-002, ADR-004, approved ADR-005, canonical task IDs or M0–M12 milestones.
