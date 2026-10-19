---
tags: [architecture, adr, index, planning]
task: M0-T12
status: ACCEPTED
approval: ACCEPTED
decision_owner: Project Owner
review_status: ACCEPTED
created: 2026-10-19
---
# Architecture Decision Record Index

> [!important] Accepted index — 2026-10-19
> M0-T12 is DONE as a verified and accepted documentation deliverable. This index records (but does not itself grant) the explicit approval of ADR-003 and the Foundation Development Gate. Gate 0 remains NOT READY (G0-03, G0-05, G0-06 and G0-24 satisfied; 4/35).

## Current decision register

Decision owner is Project Owner for all five records; designated specialist reviewers are not invented. PENDING/MISSING are decision-document descriptors, not task statuses. Missing ADRs are listed without broken links to nonexistent files.

| ADR | Subject / actual file | Decision state / owner | Review / approval evidence | Canonical task / actual task status | Related Gate 0 requirements | Dependencies / consuming work |
|---|---|---|---|---|---|---|
| ADR-001 | Authentication/authorization architecture — file missing | PENDING, not approved; Project Owner | No ADR or approval evidence; session/OIDC/guest/MFA/CSRF decisions pending | M0-T01 / BLOCKED | G0-01; interfaces to G0-20/21/30 | ADR-003 browser/ingress boundaries and M0-T06 scopes; before M2 identity implementation |
| ADR-002 | PostgreSQL ORM and migration tooling — file missing | PENDING, not approved; Project Owner | No decision matrix or approval evidence; no ORM installed | M0-T02 / BLOCKED | G0-02 | ADR-005 enlistment/ownership guarantees; before M1-T05 and database primitives |
| ADR-003 | [[05-Architecture/ADRs/ADR-003-Application-and-Deployment-Topology]] | APPROVED revision 1, 2026-10-19; Project Owner | Final readiness review ACCEPT; explicit Project Owner approval and decision-log entry | M0-T03 / DONE | G0-03, G0-24 SATISFIED | Approved ADR-005; ADR-001 and M0-T07 retain their downstream interfaces; M1-T01 remains blocked until its approved foundation gate activates |
| ADR-004 | Financial representation/rounding — file missing | PENDING, not approved; Project Owner | No approved money/rounding/tax-basis decision or test vectors | M0-T04 / BLOCKED | G0-04, G0-09; interfaces to G0-08 | BR-13/14 and approved business commission; before M1-T09/M1-T10 and financial implementation |
| ADR-005 | [[05-Architecture/ADRs/ADR-005-Module-Boundaries]] | APPROVED revision 3, 2026-10-19; Project Owner | Final review ACCEPT and explicit owner approval; [[06-Implementation/PROGRESS-LOG#M0-T05 approval evidence]]; original acceptance record in ADR section 15 | M0-T05 / DONE | G0-05 SATISFIED | Auth/ORM/topology/money/RBAC/policy implementation details remain downstream; approval did not approve those decisions |

ADR-003's layout may be reviewed without implementing authentication. ADR-001 must honor approved topology before authentication coding. This is an interface coordination obligation, not a claim that both ADRs are approved or an artificial circular task prerequisite. ADR-005's downstream references likewise do not revoke its recorded approval.

## Related approval-package records

| Record | Present status | Authority / relationship |
|---|---|---|
| [[05-Architecture/ADRs/Decision-Log]] | ACCEPTED; approval provenance recorded | M0-T12 / DONE; Project Owner acceptance 2026-10-19 |
| [[09-Implementation/Foundation-Development-Gate]] | APPROVED revision 1, inactive | Project Owner approved M1-T01-only exception; activation prerequisites remain; Gate 0 NOT READY |
| [[09-Implementation/M1-T01-Scope-Proposal]] | APPROVED scope proposal; not execution handoff | M1-T01 remains BLOCKED; local toolchain and Git security checks pending |
| [[09-Implementation/Git-Setup-Plan]] | Approved preparation actions recorded; baseline not accepted | Existing repository preserved; ignore rules added; pinned scanner and local baseline scan remain pending |

## Supersession register

| Decision / source | Superseded specification | Current treatment |
|---|---|---|
| ADR-005 Revision 3 | Earlier proposed revisions of ADR-005 | Approved current record; original findings/log history retained; approved business rules unchanged |
| ADR-003 Revision 1 | Resolves app count and finance placement at architecture level | Approved six-app topology; exact route reconciliation remains M0-T07 |
| Foundation Development Gate Revision 1 | Full Gate 0 and ORM prerequisites remain the default | Approved exception permits only M1-T01 after all activation checks; full Gate 0 remains NOT READY |
| productStucture.md / migration-family sketches | No directory, milestone or migration ID supersession | Preserve current vault paths, M0–M12 and all 277 tasks; resolve separate schema numbering under later approved work |

## Maintenance and acceptance

Every new decision/change records owner, date, alternatives, status, review evidence, dependency impact and explicit supersession in the append-only Decision Log. Never create a missing ADR merely to make an index link resolve. Do not overwrite the approved ADR-005 to align it with a proposal.

M0-T12 acceptance requires all five ADRs accurately indexed, missing files identified, owner/review/gate/task/dependency/supersession fields checked against actual files, working links to existing evidence and explicit reviewer/Project Owner acceptance. Author link/count checks do not satisfy independent review or approval.

- Review identity/date/verdict: Codex, Final Foundation Readiness Review, ACCEPT for ADR-003, M0-T12 and gate; Project Owner acceptance 2026-10-19.
- Project Owner acceptance/date: RECORDED in [[05-Architecture/ADRs/Decision-Log]] and [[06-Implementation/PROGRESS-LOG#ADR-003-and-M0-T12-approval-evidence]].
- M0-T12 status: DONE; G0-06 satisfied. Gate 0 remains NOT READY (4/35).
