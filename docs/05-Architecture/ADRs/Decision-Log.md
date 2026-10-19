---
tags: [architecture, decisions, history, planning]
task: M0-T12
status: PROPOSED
approval: PENDING
decision_owner: Project Owner
review_status: PENDING
created: 2026-10-19
---
# Architecture Decision Log

> [!warning] Draft log structure — not new approval authority
> The established ADR-005 approval below is historical fact, not a proposal to revoke it. This log/index deliverable awaits M0-T12 review and acceptance. New ADRs and the Foundation Development Gate remain unapproved.

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

## Next record required — review and explicit acceptance (not yet performed)

Current-session repository observation: Git was absent at the initial check; an external actor subsequently created a main commit e5bd5da26def292260292c026abd25ff4985ae54 including proposal documents and added a small root README. Remote configuration is present. This agent performed no Git writes. Preserve that state; do not infer artifact approval, a clean index or an accepted foundation baseline from the commit. Details and pending validation are recorded in [[09-Implementation/Git-Setup-Plan]].

Record the reviewer identity/date/verdict, findings and exact approved artifact revisions; Project Owner decision/date; allowed exception scope and operative governance cross-references; tooling/Git authority; and any approved M0-T03/M0-T12 task transitions. Keep document approval, task verification/acceptance, gate activation and implementation permission separate. Rejecting or revising a proposal appends a new record; it does not erase this draft history.
