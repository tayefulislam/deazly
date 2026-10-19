---
tags: [governance, foundation, planning]
status: APPROVED
approval: APPROVED
active: true
decision_owner: Project Owner
review_status: ACCEPTED
revision: 1
created: 2026-10-19
approval_date: 2026-10-19
activation_date: 2026-10-19
---
# Foundation Development Gate — M1-T01 Only

> [!important] APPROVED / ACTIVE — M1-T01 ONLY
> The Project Owner approved Revision 1 on 2026-10-19 and explicitly authorized OpenCode execution of M1-T01 only in the same instruction (activation recorded 2026-10-19). Every activation prerequisite in section 3 is satisfied. This gate authorizes only M1-T01 workspace initialization; it does not authorize an application skeleton, TypeScript/lint setup, Docker, ORM, API or worker code. Full Gate 0 remains NOT READY (4/35 satisfied); all other M1+ work remains gated by the original requirements, and this gate never rolls forward to M1-T02 or any later task.
> Amendment (2026-10-19): a separate, narrowly scoped **M1-T02 exception** was approved — see section 11. It was subsequently made **effective for M1-T02** after the Project Owner explicitly waived the M1-T01-acceptance precondition and all M1-T02 prerequisites were verified; it does not alter any statement above.

## 1. Purpose, references and approval boundaries

Permit safe, reversible private workspace initialization without waiting for unrelated commercial policies. Do not authorize an application skeleton, sensitive data handling, database behavior or domain implementation. References: [[05-Architecture/ADRs/ADR-003-Application-and-Deployment-Topology]], approved [[05-Architecture/ADRs/ADR-005-Module-Boundaries]], [[05-Architecture/ADRs/ADR-Index]], [[05-Architecture/ADRs/Decision-Log]], [[09-Implementation/M1-T01-Scope-Proposal]], [[09-Implementation/Git-Setup-Plan]], [[09-Implementation/Task-Backlog]], [[09-Implementation/Readiness-Checklist]].

Project Owner must review and approve this exact revision, its scope proposal and tooling policy. ADR approval, task verification/acceptance, gate approval, activation readiness, Git/tool provisioning authority and OpenCode execution permission are separate records. None is inferred from another. No new milestone/task ID or replacement Gate 0 is introduced.

## 2. Exact implementation whitelist

| Canonical task | Authorized extent if and only if activated |
|---|---|
| M1-T01 | Root pnpm workspace, six application/five shared private manifest placeholders, reproducible dependency-free lockfile, approved Node/pnpm pins, workspace-only tests, root README and Git ignore rules; exact file allowlist in the scope proposal |

There is no authorization for any other M1 task or any M2–M12 task. M0 documentation work has its own authorization; it is not an implicit implementation extension. M1-T02 TypeScript, M1-T03 lint/import enforcement, M1-T04 Docker, M1-T05 ORM, M1-T23 API skeleton and M1-T25 CI are expressly outside this gate.

## 3. Activation prerequisites — all must have evidence

| Condition | Evidence required | Current state |
|---|---|---|
| ADR-003 accepted | Project Owner-approved ADR revision, required review evidence and M0-T03 VERIFIED then DONE | SATISFIED; Revision 1 APPROVED and M0-T03 DONE |
| ADR-005 remains binding | Existing approved Revision 3 and M0-T05 DONE; no conflict introduced | Existing evidence retained |
| ADR index/log accepted | Reviewed M0-T12 deliverables and explicit acceptance/DONE; missing decisions accurately identified | SATISFIED; M0-T12 accepted and DONE |
| Foundation gate approved | Owner/date, exact revision, whitelist, exclusions, exception text and expiration recorded | SATISFIED; approved 2026-10-19 and activated 2026-10-19 (active=true, M1-T01 only) |
| Scope and pins approved | Exact M1-T01 file allowlist, acceptance/tests and Node/pnpm versions approved | SATISFIED; M1-T01 scope and Node 24.22.0 / pnpm 12.14.0 approved |
| Toolchain available safely | Approved binaries/versions verified, acquisition/provisioning separately authorized; no silent global/runtime download | SATISFIED 2026-10-19; Project Owner authorized provisioning. Node v24.22.0 (`C:\nvm4w\nodejs\node.exe`, via nvm-windows) and pnpm 12.14.0 (`C:\nvm4w\nodejs\pnpm.cmd`) verified with `where.exe` and `--version` |
| Recoverable Git baseline | Explicit authorization to inspect/adopt the existing Git state, ignore/scanner checks, accepted baseline SHA and clean planned task branch | SATISFIED 2026-10-19; Project Owner authorized a docs-only baseline commit. Native `git status`/`git check-ignore` positive and negative cases pass; Gitleaks v8.30.0 (archive SHA-256 `54fe94f644b832dd08e8c3a5915efb3bfa862386d59fb27ca0792cb687a83573`) scanned all reachable history (3 commits) and the working tree with no findings (fully redacted). Baseline SHA and branch `chore/m1-t01-workspace` recorded in [[06-Implementation/PROGRESS-LOG]] |
| Governing references synchronized | Approved exception linked in operative instructions and task/gate tracking, without removing blanket rules | SATISFIED by the current documentation synchronization; read-only consistency check recorded in [[06-Implementation/PROGRESS-LOG#ADR-003-and-M0-T12-approval-evidence]]. Blanket rules remain in force outside M1-T01 |
| Final handoff and execution approved | Final reviewed Task-Handoffs/M1-T01.md created only after scope/prerequisite approval; explicit owner permission for OpenCode M1-T01 | SATISFIED 2026-10-19; Project Owner handed off [[09-Implementation/Task-Handoffs/M1-T01]] and explicitly authorized OpenCode execution of M1-T01 only |

Gate approval can precede activation; it never bypasses missing conditions. Final handoff preparation does not require an already-running coding session: once the gate policy, topology, scope and required preparation are approved, write/review the final handoff; activate only when its acceptance and execution permission are recorded. Do not create a circular condition demanding prior task execution.

## 4. Exception text — RECORDED; EFFECTIVE FOR M1-T01 ONLY

> Activation update (2026-10-19): the Project Owner approved and activated this gate. The exception text below is now effective for M1-T01 only. The original preparation wording is retained for the historical record.

Originally, after Project Owner approval and all activation checks, the following narrowly scoped exception was to be recorded in the governing documents:

> Notwithstanding full Gate 0/M0-exit prerequisites and the blanket M0-T02 ORM-before-M1 requirement, only M1-T01 may initialize the approved private, dependency-free workspace under this Foundation Development Gate. M0-T03 remains a mandatory completed prerequisite. Pending auth, money, RBAC, route, design-token, ORM and business-policy decisions confer no permission to implement their capabilities. All other tasks retain their existing gates/dependencies. Original Gate 0 remains NOT READY until its own requirements are satisfied.

Specific existing rules requiring future exception cross-references: AGENTS planning restrictions/current M1 blocker; docs/AGENTS and 00-START-HERE; 06-Implementation/Backlog scaffolding warning; Task-Backlog's full-Gate-0 rule, M0 exit and ORM/topology footer; Milestones M1 dependency on M0; Readiness-Checklist's Gate-0-before-scaffolding rule; Dependency-Graph's broader pre-scaffolding advisory edges. Do not delete or globally relax them. The generic dependency cell M1-T01 -> M0-T03 and all 277 task IDs remain unchanged. Future approved activation updates only M1-T01 readiness/authorization, not unrelated task states.

This draft supersedes nothing. ADR-001/002/004 and other Gate 0 requirements remain unapproved. Only complete, independently evidenced items may be checked; gate approval alone does not satisfy them or complete M0/M1.

## 5. Allowed and prohibited activities

Allowed after activation: inspect baseline; create only approved metadata/manifest/test/README/ignore files; generate a lockfile with no third-party dependencies or lifecycle scripts; run the approved workspace checks; report results and exact diff. All manifests are private. Existing documentation remains at its current paths.

Prohibited even if this gate is approved:

- Next.js/NestJS/React application generators, src directories, UI pages, controllers, routes, health listeners, worker processors or framework/runtime dependency installation.
- TypeScript/ESLint/shared-runtime implementations, Docker/services, migrations, ORM configuration, schemas, seed/reset commands or database connections.
- Auth/RBAC/guest flows, money/commission/rounding, stock, checkout, payments, COD, journals, settlements, refunds, providers, advertising or analytics implementations.
- Credentials, production/customer/vendor data, external provider calls, deployments, cloud resources, DNS/hosts/certificate changes or automatic toolchain provisioning.
- Task-ID renumbering, changes to approved ADR-005, business rules, migrations, existing UI/API contracts or existing history.
- Unapproved commits/pushes or central progress edits by competing tools. OpenCode reports evidence; only the explicitly authorized single tracking writer updates central records.

## 6. Toolchain/version policy

The exact pins were originally proposed as Node.js 24.22.0 and pnpm 12.14.0. Activation update (2026-10-19): the Project Owner approved and provisioned these exact versions, and both were locally verified (Node v24.22.0, pnpm 12.14.0). See the scope proposal for official sources and acquisition controls. Owner approval froze the exact versions; pin drift or a security finding requires review and an approved revision, not an automatic update. No framework/ORM/database version is selected by this gate.

Use a pre-provisioned approved toolchain; version checks must precede writing manifests. Do not use latest tags, remote execution/install scripts, silent package-manager switching, lifecycle hooks, runtime provisioning or global machine changes. Only the dependency-free lockfile/install verification commands expressly approved in the final handoff are permitted.

## 7. Verification and audit

Before execution capture baseline commit, current branch/status, file hashes, 277 task IDs, all 100 feature rows, ADR-005 hash and exact approved scope/toolchain. Stop on conflicting user changes. Record final handoff revision and approvals without storing credentials.

Required task checks: exactly eleven non-root workspaces at approved paths; unique names/private flags; exact pins; no dependency or install-hook additions; lockfile covers approved importers; frozen install is repeatable; meaningful workspace tests and negative fixtures pass; planned diff/ignore/secret checks pass; no prohibited file/activity. Test definitions are specified, not executed by this document. Full lint/typecheck/framework builds and DB/security concurrency tests remain later tasks; do not manufacture no-op scripts to claim they pass.

Record commands, exit codes, tool versions, diff/change manifest, baseline and final commit references if authorized, review findings and actual task transition evidence. Scope breach/test failure means stop and review—not task DONE. After successful review, task verification and explicit acceptance follow Task-Status-Policy; all application feature rows remain NOT_STARTED.

## 8. Git baseline and rollback

Follow the separately approved Git setup plan before coding. The baseline must include the reviewed planning state and applicable approvals, with no secrets or generated outputs. Activation update (2026-10-19): no Git initialization was required; the Project Owner separately authorized a docs-only baseline commit, completed as pre-code baseline SHA `b1d26ab2a4326aec109fdbbceb9a44d2add738cc` on branch `chore/m1-t01-workspace`, and Gitleaks v8.30.0 history and working-tree scans were clean.

For committed task changes, propose a reviewed revert of that exact task commit, preserving the architecture baseline and unrelated changes. For uncommitted changes, inspect the per-file change manifest and restore only task-owned paths under explicit rollback authority; preserve modified pre-existing files and user changes. Never recursively remove the repository, use reset --hard/git clean, delete .git or purge a shared pnpm store. No database rollback is relevant because migrations are forbidden. Keep failed verification/recovery history.

## 9. Expiration / revocation

This single-task permission expires when M1-T01 is accepted/DONE, Project Owner revokes it, approved scope/toolchain/architecture changes, a material security defect is found, or the verified baseline no longer matches the planned work. Stop before further mutations and seek renewed review. It never rolls forward to M1-T02 or any other task. No arbitrary time duration is invented.

## 10. Approval record

- Architecture/security review identity/date/verdict: Codex, Final Foundation Readiness Review, ACCEPT for ADR-003, M0-T12 and gate; Project Owner approval 2026-10-19.
- Project Owner approval/date and exact revision: APPROVED Revision 1 on 2026-10-19; activated 2026-10-19 (active=true, M1-T01 only).
- Scope/toolchain approval: M1-T01 scope and Node 24.22.0 / pnpm 12.14.0 pins approved and locally verified 2026-10-19. Git scan and baseline acceptance satisfied 2026-10-19.
- Final handoff review and execution authority: SATISFIED; Project Owner explicitly authorized OpenCode execution of M1-T01 only, 2026-10-19.
- Activation check evidence/date: ACTIVE 2026-10-19; all activation prerequisites in section 3 satisfied with recorded evidence.
- Original Gate 0: NOT READY, 4/35; not replaced by this approved and now active gate.

## 11. M1-T02 exception — TypeScript strict configuration (approved 2026-10-19; EFFECTIVE)

> [!warning] APPROVED AND MADE EFFECTIVE — M1-T02 ONLY
> The Project Owner approved this **M1-T02-only** exception on 2026-10-19 ("DEAZLY — AUTHORIZE AND IMPLEMENT M1-T02"). On the same date the Project Owner explicitly **waived the M1-T01-acceptance precondition** (choosing "proceed now; M1-T01 stays IMPLEMENTED"), and all M1-T02-specific prerequisites were verified. The exception is therefore **effective for M1-T02 only**. It does **not** authorize M1-T03 or any other task, and full Gate 0 remains NOT READY (4/35).

| Field | Record |
|---|---|
| Scope | Only M1-T02 — shared TypeScript strict base config, per-app and per-shared-package configs, `@deazly/*` path aliases, one exact TypeScript pin, `typecheck` scripts and Node built-in configuration tests, plus the minimal `src/index.ts` placeholders conditionally permitted by the Owner for meaningful typechecking |
| Explicitly excluded | M1-T03 lint/import-boundary, M1-T04 Docker, M1-T05 ORM/migrations, M1-T07/T08 contracts/validation, M1-T23 API skeleton, M1-T25 CI and every M2–M12 task; no ORM, database migration, framework initialization (Next.js/NestJS/React) or business/domain code |
| Dependency | M1-T02 depends on the M1-T01 workspace existing. The original "M1-T01 must be **accepted** first" condition was **waived by the Project Owner on 2026-10-19**; M1-T01 remains IMPLEMENTED. |
| Effectivity | **EFFECTIVE 2026-10-19** — the Project Owner waived the M1-T01-acceptance precondition (proceed while M1-T01 remains IMPLEMENTED) after M1-T02 prerequisites were verified |
| Expiration / revocation | Same model as section 9: expires when M1-T02 is accepted/DONE, is revoked, the approved scope/toolchain/architecture changes, a security defect is found, or the verified baseline drifts. It never rolls forward to M1-T03 or any later task. |
| References | [[09-Implementation/Task-Handoffs/M1-T02]] |

Approved toolchain addition: exactly one `typescript` devDependency at the workspace root, pinned to an exact Owner-approved version. No other dependency (no `@types/node`, no framework packages) is authorized by this exception. Node 24.22.0 and pnpm 12.14.0 pins remain unchanged, as does the `pmOnFail: ignore` setting.

Approval record:

- Project Owner authorization/date: APPROVED 2026-10-19 ("DEAZLY — AUTHORIZE AND IMPLEMENT M1-T02"), limited to M1-T02.
- Effectiveness: **EFFECTIVE 2026-10-19** — M1-T01-acceptance precondition explicitly waived by the Project Owner; M1-T02 prerequisites verified. M1-T01 remains IMPLEMENTED.
- Original Gate 0: unchanged, NOT READY (4/35).
- Implementation evidence (2026-10-19): M1-T02 **IMPLEMENTED** — 43/43 TypeScript tests, 56/56 combined tests, `typecheck` exit 0, frozen offline install exit 0. Not VERIFIED/DONE; independent review and acceptance outstanding. See [[09-Implementation/Task-Handoffs/M1-T02]] §14.
