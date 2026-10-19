---
tags: [architecture, adr, topology, planning]
adr: ADR-003
task: M0-T03
status: PROPOSED
approval: PENDING
decision_owner: Project Owner
review_status: PENDING
revision: 1
created: 2026-10-19
---
# ADR-003 — Application and Deployment Topology

> [!warning] PROPOSED — NOT APPROVED
> Authorized work is documentation only. This proposal neither activates the Foundation Development Gate nor authorizes scaffolding, installation, Git initialization or deployment. M0-T03 is IMPLEMENTED as a draft, not VERIFIED or DONE.

## 1. Decision record

| Field | Record |
|---|---|
| Decision owner / approver | Project Owner; approval/date PENDING |
| Author | Codex, Lead Architect, under the Foundation Development Approval Package request |
| Architecture/security reviewers | PENDING; author checks are not independent acceptance |
| Related requirements | G0-03 deployment topology; G0-24 finance application placement |
| Prerequisites / interfaces | Approved ADR-005 controls module ownership. ADR-001 must finalize authentication before identity implementation; this ADR proposes hosting/cookie constraints, not a session/OIDC selection |
| Supersedes | Nothing while PROPOSED; proposed reconciliation targets are listed in section 8 |
| Approval evidence | PENDING; [[05-Architecture/ADRs/Decision-Log]] records draft provenance |

## 2. Context and alternatives

Deazly is one shared marketplace, not separate vendor websites. Existing instructions name six application workspaces but six user-interface areas: finance and customer-account areas need not be additional applications. Topology affects workspace names, cookie scope, trusted API ingress and build boundaries.

| Option | Advantages | Costs / implications |
|---|---|---|
| Six apps; finance inside Admin | Matches AGENTS and the structural sketch; preserves finance UI with fewer deployment units | Admin and finance share an origin; backend finance permissions/MFA and maker-checker remain mandatory |
| Seven apps with separate finance frontend | Separate frontend deployment/origin | Adds app/CI/session boundaries and requires an approved expansion of the existing layout |
| One role-routed Next.js frontend plus API/worker | Fewer frontend deployments | Larger common browser/build boundary; departs from the preferred role-app layout |

Recommendation: six app workspaces, comprising four Next.js frontends, one NestJS API and one background worker. This remains a modular monolith, not six business microservices.

## 3. Proposed workspace and ownership

Use the existing repository root E:\Projects\deazly. Do not add a nested marketplace directory or reorganize the Obsidian vault.

| Application path | Purpose / proposed browser boundary |
|---|---|
| apps/storefront | Customer shopping and customer account portal; one storefront for all vendors; localized routes retain en/ja/id support |
| apps/vendor | Vendor Seller Center; vendor membership/resource checks remain API responsibilities |
| apps/admin | Administration, support/marketing areas and protected finance dashboard |
| apps/warehouse | Warehouse operations; API enforces assigned warehouse/resource scope |
| apps/api | NestJS REST API, domain owners, coordinators and HTTP composition under ADR-005 |
| apps/worker | Background process composition; no browser UI and no public HTTP listener by default |

Finance is proposed under the Admin origin at /admin/finance. It remains a distinct permission-scoped dashboard, not an entitlement granted to every admin user. Retain finance operator/maker/approver distinctions for M0-T06 reconciliation, privileged MFA and maker != approver. Sharing an app never merges Ledger, Settlements, Payouts, PaymentsCOD or their data ownership.

| Shared workspace | Boundary |
|---|---|
| packages/database | Server-only connection, migration and transaction-adapter tooling; no global cross-owner repository or browser import |
| packages/ui | Presentation components only; no server configuration, ORM or domain authority |
| packages/contracts | Namespaced public transport/port shapes and pure shared value types; no owner implementations or secret-bearing environment |
| packages/validation | Structural validation; no authoritative price, role, stock or payout decisions; imports must not create a contracts/validation cycle |
| packages/config | Explicit browser-safe versus server-only entry points; never expose all environment variables to frontend bundles |

ADR-005's logical Kernel/Contracts/infrastructure layers remain distinct even where housed in these workspaces. Exact source subpaths/exports must be reviewed in M1-T02/T03/T07 before implementation; no sixth shared package or runtime exports are introduced by M1-T01. API/worker reuse the approved owner/workflow interfaces without importing API controllers or bootstrapping the HTTP application. The server export/build map is downstream M1-T02/T23/T24 work, not permission for deep private imports or duplicated business logic. API must not depend on worker composition.

## 4. Browser authentication and cookie constraints

These are proposed topology constraints; ADR-001 still selects sessions versus OIDC, credential/session storage, renewal/revocation, guest verification, SameSite behavior, CSRF protocol and MFA implementation.

- Give each frontend a distinct browser hostname/origin in deployed environments. Production DNS names are not selected here. Use HTTPS; session cookies must be Secure, HttpOnly and host-only, with no parent-domain Domain attribute. A __Host- prefixed cookie, if selected in ADR-001, also requires Path=/ and no Domain attribute.
- Do not share a broad .deazly-domain session cookie between storefront, vendor, admin and warehouse. Cross-app sign-in/SSO needs an explicitly approved ADR-001 flow, not copying browser credentials or widening cookie domains.
- Distinct hostnames isolate browser cookie scope, but do not themselves establish authorization. Bind accepted authentication to the intended application/audience through trusted server-side policy; never trust a caller's audience/vendor/role header. Revalidate actor assurance, membership, resource scope and privileged actions in NestJS under ADR-005.
- Admin and finance intentionally share one host/session boundary. Path=/admin/finance, hiding navigation or a frontend guard cannot protect a finance API. Backend permissions, finance scope, MFA/step-up policy and maker-checker are required; exact grants remain M0-T06/ADR-001 decisions.
- Same-site sibling subdomains are not automatically trusted for state-changing requests. Apply the approved CSRF/origin controls even where SameSite permits cookies; do not use credentialed wildcard CORS.
- SSR and any later frontend proxy use minimal explicitly selected request context, not arbitrary forwarded headers. Do not serialize private actor/session state into public caches, HTML or client bundles. Vendor/customer/finance responses must not be shared across users by cache keys.

Local development must not claim cookie isolation from ports: localhost:3000 and localhost:3001 share hostname cookie scope. Before authentication testing, approve distinct loopback-mapped development hostnames and local TLS, for example storefront.deazly.test, vendor.deazly.test, admin.deazly.test and warehouse.deazly.test. These are illustrative .test names, not configured DNS. Hosts-file edits, certificate trust installation and a reverse proxy require separate setup authorization. Any localhost-only fallback needs an explicitly reviewed isolation strategy before auth testing; do not silently disable cookie/CSRF protections.

Security reference: [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html). No auth code or security certification is delivered here.

## 5. API routing and process topology

Keep /api/v1, existing response envelopes, ownership guards, UUIDv4 order identifiers and financial/inventory idempotency requirements from API-Contracts. No new business endpoint is created.

Proposed browser path: browser -> its frontend origin's /api/v1 ingress -> NestJS API. Preserve the version prefix exactly once. Prefer same-origin ingress rather than direct cross-origin browser cookies. Edge routing selects a trusted frontend boundary; strip untrusted forwarding/audience headers and reconstruct only approved metadata over a trusted connection. The API authenticates the actual actor and scope; possession of an ingress path is not authorization. Proxy cookie forwarding/issuance must preserve the host-only constraints and be tested under ADR-001.

Public provider webhooks need separately approved, allowlisted ingress and provider verification contracts; they do not inherit browser-session authority. SSR API access is server-to-server with minimal trusted context. Direct signed media uploads retain their own authorized, restricted contract; browsers receive neither database credentials nor storage/provider master keys.

| Environment | Proposed logical layout | Not selected / not authorized |
|---|---|---|
| M1-T01 workspace-only | Private manifests, lockfile and workspace tests; zero running applications/services | No ports, DNS, cookies, proxy, Docker or certificates are configured |
| Later local runtime | Four separate frontend processes behind distinct local hostnames/TLS; private API; worker; local PostgreSQL/Redis/search/object-storage substitutes under separately approved tasks | Exact ports, hostname mapping and TLS provisioning procedure require their later task specification; not M1-T01 |
| Later deployed runtime | Four independently built frontend units, private API and worker units; existing PostgreSQL, Redis/BullMQ, Meilisearch and S3/R2-compatible infrastructure | Provider, region, domain names, scaling, residency, budgets and production resources remain pending |

API and worker share PostgreSQL as domain source of truth, use the same approved transaction/ownership rules, and are separately runnable process compositions—not independently authoritative domain services. Redis/queues/search are not stock or money authorities. Worker credentials and network access are least privilege; jobs preserve source attribution and execute with scoped service authority per ADR-005. No frontend connects directly to PostgreSQL or the queue.

## 6. CI and deployment boundaries

Future CI, implemented under its own tasks, must have separate build/test targets for each of the four frontends, API, worker and shared packages. Shared-contract changes trigger all affected consumers, not just changed folders. Ownership/import/DI negative fixtures, resolved graph checks and secret-exposure checks from ADR-005 remain mandatory.

Use reproducible pinned toolchains and frozen lockfile installs; untrusted PR jobs receive no deployment/provider secrets. Release/deployment jobs require separate authorization and scoped credentials. Never expose server secrets through NEXT_PUBLIC_ variables. Worker tests must prove no HTTP bootstrap/controller import. Finance API isolation and maker-checker tests cannot be replaced by an Admin frontend build passing.

M1-T01 has workspace verification only. It does not deliver full CI, frontend builds, API health endpoints, migration jobs or the M1 milestone exit criteria. Node/pnpm candidates are in [[09-Implementation/M1-T01-Scope-Proposal]]; no framework version is selected by this ADR.

## 7. Consequences and migration implications

Four browser origins add ingress, cookie and CI coordination; shared Admin/finance requires explicit authorization separation. One backend domain architecture avoids distributed accounting/stock ownership. No schema, API monetary type, commission, COD, rounding, shipping, legal or UI layout policy is changed.

There is no deployed application to migrate. If approved, reflect this topology in the route map and later build/export/ingress specifications without changing task IDs. Existing documentation and migration numbering remain intact. Do not execute those updates as application implementation until authorized.

## 8. Existing-specification comparison / proposed supersession

| Source | Actual statement / implication | Proposed treatment, effective only after approval |
|---|---|---|
| AGENTS section 12; productStucture.md | Six app paths and five shared package paths | Retain paths at the current root; the sketch's different docs directory names are not a relocation instruction |
| AGENTS section 11 | Six interface areas including Finance and Customer Account | Account is in storefront; finance is in Admin; no seventh app is implied |
| Architecture-and-Interfaces | Role experiences may be separate apps or role-routed; broad backend groupings | Select the six-app topology only; ADR-005 remains authoritative for domain ownership |
| Sitemap-and-Navigation | Finance UI paths /finance/... | Propose Admin-contained /admin/finance/...; exact path mapping/redirects must be approved in M0-T07, not invented here |
| Admin-Warehouse-Finance | Finance shell /admin/finance | Align placement; preserve all finance screens and authorizations |
| Architecture-Audit C-09 | Unresolved finance app placement; its summary does not capture every route variant | Resolve app placement if this ADR is approved; do not silently declare the complete route map reconciled |
| Dependency-Graph / Milestones / backlog | Broader build/gate prerequisites; M1-T01 depends on M0-T03 | Preserve dependencies. Only the separately approved foundation gate can create a narrowly scoped exception; this ADR alone cannot |
| ADR-005 | Ownership/public surfaces/shared transactions/outbox | No supersession; all remain binding |

## 9. Review and approval requirements

Required review: six-app/five-package consistency; finance placement; cookie hostname/port and CSRF analysis; API ingress trust; backend reuse/export plan; CI dependency coverage; comparison/supersession scope and unresolved decisions. Runtime acceptance later requires cross-origin/session, unauthorized-finance, cache-isolation, import/DI and build tests.

Open decisions: ADR-001 auth mechanism and cookie details; M0-T06 role vocabulary; M0-T07 exact finance/locale routes; server export map; local TLS/host/port setup; production DNS/provider/residency; remaining ADR-002/004 and business policies. None prevents reviewing this logical layout; none is silently approved by it.

- Architecture/security review verdict and evidence: PENDING.
- Project Owner approval/date: PENDING.
- G0-03 / G0-24: remain unchecked pending verified acceptance.
- Foundation gate approval, Git/tool provisioning and implementation permission: separate, PENDING.
