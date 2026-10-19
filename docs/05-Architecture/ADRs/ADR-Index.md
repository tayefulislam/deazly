---
tags: [architecture, adr, index, planning]
task: M0-T12
status: PROPOSED
approval: PENDING
decision_owner: Project Owner
review_status: PENDING
created: 2026-10-19
---
# Architecture Decision Record Index

> [!warning] Draft index — acceptance pending
> M0-T12 is IMPLEMENTED as documentation, not VERIFIED or DONE. An entry describes evidence; this index does not approve an ADR or satisfy G0-06 automatically. Gate 0 remains NOT READY (G0-05 only, 1/35).

## Current decision register

Decision owner is Project Owner for all five records; designated specialist reviewers are not invented. PENDING/MISSING are decision-document descriptors, not task statuses. Missing ADRs are listed without broken links to nonexistent files.

| ADR | Subject / actual file | Decision state / owner | Review / approval evidence | Canonical task / actual task status | Related Gate 0 requirements | Dependencies / consuming work |
|---|---|---|---|---|---|---|
| ADR-001 | Authentication/authorization architecture — file missing | PENDING, not approved; Project Owner | No ADR or approval evidence; session/OIDC/guest/MFA/CSRF decisions pending | M0-T01 / BLOCKED | G0-01; interfaces to G0-20/21/30 | ADR-003 browser/ingress boundaries and M0-T06 scopes; before M2 identity implementation |
| ADR-002 | PostgreSQL ORM and migration tooling — file missing | PENDING, not approved; Project Owner | No decision matrix or approval evidence; no ORM installed | M0-T02 / BLOCKED | G0-02 | ADR-005 enlistment/ownership guarantees; before M1-T05 and database primitives |
| ADR-003 | [[05-Architecture/ADRs/ADR-003-Application-and-Deployment-Topology]] | PROPOSED revision 1; Project Owner | Draft under documentation authorization; architecture/security review and approval PENDING | M0-T03 / IMPLEMENTED (draft only) | G0-03, G0-24 | Approved ADR-005; interfaces with ADR-001 and M0-T07; M1-T01's explicit prerequisite remains incomplete |
| ADR-004 | Financial representation/rounding — file missing | PENDING, not approved; Project Owner | No approved money/rounding/tax-basis decision or test vectors | M0-T04 / BLOCKED | G0-04, G0-09; interfaces to G0-08 | BR-13/14 and approved business commission; before M1-T09/M1-T10 and financial implementation |
| ADR-005 | [[05-Architecture/ADRs/ADR-005-Module-Boundaries]] | APPROVED revision 3, 2026-10-19; Project Owner | Final review ACCEPT and explicit owner approval; [[06-Implementation/PROGRESS-LOG#M0-T05 approval evidence]]; original acceptance record in ADR section 15 | M0-T05 / DONE | G0-05 SATISFIED | Auth/ORM/topology/money/RBAC/policy implementation details remain downstream; approval did not approve those decisions |

ADR-003's layout may be reviewed without implementing authentication. ADR-001 must honor approved topology before authentication coding. This is an interface coordination obligation, not a claim that both ADRs are approved or an artificial circular task prerequisite. ADR-005's downstream references likewise do not revoke its recorded approval.

## Related approval-package records

| Record | Present status | Authority / relationship |
|---|---|---|
| [[05-Architecture/ADRs/Decision-Log]] | PROPOSED index/log deliverable; facts retained with provenance | M0-T12; Project Owner review/acceptance pending |
| [[09-Implementation/Foundation-Development-Gate]] | PROPOSED, inactive | Owner selected Option B for documentation preparation only; exact whitelist M1-T01; no new canonical task or replacement Gate 0 |
| [[09-Implementation/M1-T01-Scope-Proposal]] | PROPOSED, not final handoff | M1-T01 remains BLOCKED; scope/toolchain/execution approvals outstanding |
| [[09-Implementation/Git-Setup-Plan]] | PROPOSED, unexecuted | Git initialization, scanner provisioning, commit identity and commit authority remain pending |

## Supersession register

| Decision / source | Superseded specification | Current treatment |
|---|---|---|
| ADR-005 Revision 3 | Earlier proposed revisions of ADR-005 | Approved current record; original findings/log history retained; approved business rules unchanged |
| ADR-003 proposal | No approved specification is superseded yet | Candidate targets: ambiguous app count/finance placement in Architecture-and-Interfaces, AGENTS interface interpretation, /finance versus /admin/finance route variants; see ADR comparison table. Exact routes still require M0-T07 |
| Foundation gate proposal | No blanket prerequisite is removed | Would create an approved M1-T01-only exception to Gate 0/ORM-before-M1 rules, only after its activation conditions are fulfilled |
| productStucture.md / migration-family sketches | No directory, milestone or migration ID supersession | Preserve current vault paths, M0–M12 and all 277 tasks; resolve separate schema numbering under later approved work |

## Maintenance and acceptance

Every new decision/change records owner, date, alternatives, status, review evidence, dependency impact and explicit supersession in the append-only Decision Log. Never create a missing ADR merely to make an index link resolve. Do not overwrite the approved ADR-005 to align it with a proposal.

M0-T12 acceptance requires all five ADRs accurately indexed, missing files identified, owner/review/gate/task/dependency/supersession fields checked against actual files, working links to existing evidence and explicit reviewer/Project Owner acceptance. Author link/count checks do not satisfy independent review or approval.

- Review identity/date/verdict: PENDING.
- Project Owner acceptance/date: PENDING.
- M0-T12 status: IMPLEMENTED; G0-06 remains unchecked.
