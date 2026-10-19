---
tags: [implementation, dependencies, graph, planning]
status: planning
created: 2026-10-19
---
# Dependency Graph — Build Order

> [!note] Planning artifact
> This graph expresses **design-time build dependencies**, not deployed infrastructure.
> An edge `A --> B` means **B cannot be completed correctly before A is stable**.
> No code exists. See [[09-Implementation/Architecture-Audit]] for the gaps this graph resolves.

## Related documents
- [[00-START-HERE]]
- [[01-Product/Business-Rules]]
- [[01-Product/Decision-Register]]
- [[05-Architecture/Architecture-and-Interfaces]]
- [[05-Architecture/Data-Model]]
- [[05-Architecture/API-Contracts]]
- [[05-Architecture/Events-and-Failures]]
- [[06-Implementation/Backlog]]
- [[09-Implementation/Milestones]]
- [[09-Implementation/Task-Backlog]]
- [[09-Implementation/Readiness-Checklist]]

---

## 1. Foundation dependency graph

```mermaid
flowchart TD
  subgraph D0["D0 — Decisions (blocking)"]
    ADR1[ADR-001 Auth]
    ADR2[ADR-002 ORM]
    ADR3[ADR-003 Deployment topology]
    ADR4[ADR-004 Money and rounding]
    ADR5[ADR-005 Module boundaries]
    RBAC[RBAC permission matrix]
    ROUTES[Canonical route map]
    TOKENS[Single design token set]
    POL[Gate 0 policy decisions]
  end

  subgraph D1["D1 — Platform primitives"]
    MONO[pnpm monorepo + CI]
    DB[PostgreSQL + migration tool]
    PRIM[Outbox / Inbox / Idempotency / Audit primitives]
    MONEY[Money value object + currency]
    ERRS[Error envelope + request IDs]
    OBS[Logging + tracing baseline]
  end

  subgraph D2["D2 — Identity and tenancy"]
    ID[Identity and sessions]
    MEM[Vendors and memberships]
    AUTHZ[Guards and scoped repositories]
    VONB[Vendor onboarding and verification]
  end

  subgraph D3["D3 — Catalog"]
    CAT[Canonical product / variant]
    OFFER[Seller offer]
    DISC[Discounts and promotions]
    MEDIA[Media pipeline + quality checker]
    PRICE[Pricing engine]
  end

  subgraph D4["D4 — Inventory"]
    WH[Warehouses and locations]
    LOT[Inventory lots and balances]
    RES[Reservations]
    XFER[Transfers and receipts]
  end

  subgraph D5["D5 — Commerce"]
    CART[Cart]
    QUOTE[Checkout quote]
    ORDER[Parent and vendor orders]
    SNAP[Immutable snapshots]
  end

  subgraph D6["D6 — Money"]
    PAY[Payments and gateway adapter]
    LEDGER[Double-entry ledger]
    SETTLE[Settlements]
    PAYOUT[Payouts]
    COD[COD collection and remittance]
    TAX[Tax and invoices]
  end

  subgraph D7["D7 — Fulfillment"]
    SHIP[Shipments and legs]
    ALLOC[Cost allocation]
    WHOP[Pick / pack / dispatch]
  end

  subgraph D8["D8 — Recovery"]
    CANCEL[Cancellation]
    RETURN[Returns]
    REFUND[Refunds]
    DISPUTE[Disputes]
  end

  subgraph D9["D9 — Experience"]
    I18N[Localization]
    SEARCH[Search]
    RECS[Recommendations]
    ADS[Ads and catalog sync]
    NOTIF[Notifications]
  end

  ADR1 --> MONO
  ADR2 --> DB
  ADR3 --> MONO
  ADR4 --> MONEY
  ADR5 --> MONO
  RBAC --> AUTHZ
  ROUTES --> MONO
  TOKENS --> MONO
  POL --> PAY
  POL --> SETTLE
  POL --> TAX

  MONO --> DB
  DB --> PRIM
  MONEY --> PRIM
  PRIM --> ID
  ERRS --> ID
  OBS --> ID
  ID --> MEM
  MEM --> AUTHZ
  AUTHZ --> VONB

  MEM --> CAT
  CAT --> OFFER
  OFFER --> DISC
  OFFER --> MEDIA
  OFFER --> PRICE
  DISC --> PRICE

  AUTHZ --> WH
  WH --> LOT
  LOT --> RES
  LOT --> XFER

  CAT --> CART
  OFFER --> CART
  PRICE --> QUOTE
  RES --> QUOTE
  CART --> QUOTE
  QUOTE --> ORDER
  ORDER --> SNAP

  ORDER --> PAY
  PAY --> LEDGER
  SNAP --> LEDGER
  LEDGER --> SETTLE
  SETTLE --> PAYOUT
  PAY --> COD
  COD --> SETTLE
  ORDER --> TAX
  LEDGER --> TAX

  ORDER --> SHIP
  SHIP --> ALLOC
  LOT --> WHOP
  SHIP --> WHOP
  ALLOC --> SETTLE

  ORDER --> CANCEL
  SHIP --> CANCEL
  CANCEL --> REFUND
  CANCEL --> RETURN
  RETURN --> REFUND
  REFUND --> LEDGER
  RETURN --> DISPUTE
  DISPUTE --> REFUND

  CAT --> SEARCH
  OFFER --> SEARCH
  ORDER --> RECS
  CAT --> RECS
  OFFER --> ADS
  DISC --> ADS
  ORDER --> NOTIF
  LEDGER --> NOTIF
  AUTHZ --> I18N
```

---

## 2. Critical path

The longest blocking chain determines the earliest possible launch:

```mermaid
flowchart LR
  A[ADRs + policy] --> B[Monorepo + primitives]
  B --> C[Identity + RBAC]
  C --> D[Catalog + offers]
  D --> E[Inventory + reservations]
  E --> F[Cart + quote + orders]
  F --> G[Payments + ledger]
  G --> H[Settlements + payouts]
  H --> I[COD + tax + invoices]
  I --> J[Fulfillment + allocation]
  J --> K[Returns + refunds + disputes]
  K --> L[Search + i18n + notifications]
  L --> M[Ads + recommendations]
  M --> N[Release gates]
```

**Critical path length:** 14 stages. Parallelizable branches (media, search, notifications, recommendations, ads) do not shorten it because they depend on catalog or orders.

**Earliest safe launch:** after stage K plus release-gate verification. Advertising and recommendations (L–M) may ship post-launch if catalog sync eligibility is stable.

---

## 3. Module dependency matrix

Rows depend on columns. `—` means no direct dependency.

| Module | Identity | Vendor | Catalog | Inventory | Commerce | Payments | Ledger | Fulfillment | Tax | Search | Ads | Recs | Notif |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Identity | — | — | — | — | — | — | — | — | — | — | — | — | — |
| Vendor | ✔ | — | — | — | — | — | — | — | — | — | — | — | — |
| Catalog | ✔ | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| Inventory | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — | — |
| Commerce | ✔ | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — |
| Payments | ✔ | — | — | — | ✔ | — | — | — | — | — | — | — | — |
| Ledger | ✔ | ✔ | — | — | ✔ | ✔ | — | — | — | — | — | — | — |
| Fulfillment | ✔ | ✔ | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — |
| Tax | ✔ | ✔ | ✔ | — | ✔ | — | ✔ | — | — | — | — | — | — |
| Search | — | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — |
| Ads | — | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — |
| Recs | ✔ | ✔ | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — |
| Notifications | ✔ | ✔ | — | — | ✔ | ✔ | ✔ | ✔ | ✔ | — | — | — | — |

**Rules enforced by this matrix:**
- No module may import another module's tables directly; use its service or a read model.
- `Ledger` is the only writer of financial entries.
- `Commerce` never writes inventory; it calls `Inventory` reservation services.
- `Ads`, `Search`, `Recs` are read-only projections of catalog and commerce.

---

## 4. Data migration dependency order

```mermaid
flowchart TD
  M001[M001 identity + vendors + RBAC] --> M002[M002 catalog + offers + discounts]
  M001 --> M003[M003 commerce + orders + snapshots]
  M002 --> M003
  M002 --> M004[M004 warehouses + inventory]
  M003 --> M004
  M003 --> M005[M005 fulfillment + shipments]
  M004 --> M005
  M003 --> M006[M006 payments + COD]
  M005 --> M006
  M003 --> M007[M007 ledger + settlements + payouts]
  M005 --> M007
  M006 --> M007
  M003 --> M008[M008 tax + invoices]
  M007 --> M008
  M001 --> M009[M009 platform primitives]
  M002 --> M010[M010 media + translations]
  M002 --> M011[M011 search + ads + recs]
  M003 --> M011
  M008 --> M012[M012 returns + refunds + disputes]
  M007 --> M012
```

> [!warning] Correction to [[05-Architecture/Data-Model]]
> The original plan places outbox/inbox/audit/idempotency in **M009**, after finance.
> Every module from M001 onward needs them. This graph moves the **primitives** into M001
> (as tables) and keeps only the **dispatcher/worker wiring** in M009.
> This is a recommendation, not an applied change. Record it in the ADR log.

---

## 5. API dependency order

```mermaid
flowchart LR
  A1[Auth + session endpoints] --> A2[Vendor onboarding]
  A2 --> A3[Catalog + offer CRUD]
  A3 --> A4[Media upload]
  A3 --> A5[Inventory + transfers]
  A3 --> A6[Search read endpoints]
  A4 --> A3
  A5 --> A7[Cart + quote]
  A3 --> A7
  A7 --> A8[Orders]
  A8 --> A9[Payments + webhooks]
  A9 --> A10[Ledger projections + vendor earnings]
  A10 --> A11[Settlements + payouts]
  A8 --> A12[Fulfillment + shipments]
  A12 --> A13[Shipping allocation]
  A13 --> A11
  A9 --> A14[COD]
  A14 --> A11
  A8 --> A15[Tax + invoices]
  A8 --> A16[Cancellation + returns]
  A16 --> A17[Refunds]
  A17 --> A10
  A16 --> A18[Disputes]
  A8 --> A19[Notifications]
  A3 --> A20[Ads catalog sync]
  A3 --> A21[Recommendations]
```

**Contract-first rule:** publish OpenAPI schema + shared Zod contract before the corresponding UI task starts. UI tasks that depend on an unpublished contract are blocked.

---

## 6. UI dependency order

```mermaid
flowchart TD
  UI0[AppShell + design tokens + i18n shell] --> UI1[Auth screens]
  UI1 --> UI2[Vendor onboarding]
  UI1 --> UI3[Customer storefront browse]
  UI2 --> UI4[Vendor offer editor]
  UI3 --> UI5[Product detail + compare sellers]
  UI4 --> UI5
  UI5 --> UI6[Cart]
  UI6 --> UI7[Checkout]
  UI7 --> UI8[Customer order detail]
  UI4 --> UI9[Vendor order detail]
  UI7 --> UI10[Vendor order queue]
  UI10 --> UI9
  UI3 --> UI11[Search results]
  UI2 --> UI12[Vendor COD settings]
  UI9 --> UI13[Vendor earnings]
  UI13 --> UI14[Vendor payouts]
  UI1 --> UI15[Warehouse shell]
  UI15 --> UI16[Receiving workbench]
  UI15 --> UI17[Stock and transfer]
  UI15 --> UI18[Pick pack dispatch]
  UI1 --> UI19[Finance shell]
  UI19 --> UI20[COD reconciliation]
  UI19 --> UI21[Shipping allocation review]
  UI19 --> UI22[Payout batch builder]
  UI1 --> UI23[Admin shell]
  UI23 --> UI24[Vendor approval]
  UI23 --> UI25[COD approval]
  UI23 --> UI26[Media review]
  UI23 --> UI27[Marketing catalog sync]
  UI23 --> UI28[Tax and invoicing]
  UI23 --> UI29[Audit log viewer]
  UI23 --> UI30[Policy configuration]
  UI8 --> UI31[Returns and disputes]
  UI8 --> UI32[Invoices]
```

---

## 7. Test dependency order

| Layer | Depends on | Required before |
|---|---|---|
| Money unit tests (rounding, allocation) | Money value object | Any financial module |
| RBAC matrix tests | Permission matrix | Any guarded endpoint |
| Repository isolation tests | Scoped repositories | Any vendor/customer endpoint |
| Concurrency tests (stock, idempotency) | Inventory + primitives | Checkout |
| Ledger invariant tests | Ledger | Settlement |
| Contract tests (OpenAPI) | Published contracts | UI integration |
| E2E happy path | Checkout + payment sandbox | Gate 2 |
| E2E failure path (timeout, duplicate webhook) | Payments + outbox | Gate 2 |
| Accessibility tests | UI shell | Every screen task |
| Load tests | Stable API + seed data | Gate 4 |

---

## 8. Blocking dependency register

| Blocker | Blocks | Owner decision needed |
|---|---|---|
| ADR-001 Auth | Identity, all guarded APIs, all UI | Architecture |
| ADR-002 ORM | Migrations, repositories | Architecture |
| ADR-003 Topology | Monorepo layout, CI, cookies | Architecture |
| ADR-004 Money/rounding | Ledger, settlement, invoices | Finance + Architecture |
| ADR-005 Module boundaries | Import rules, lint config — decision prerequisite resolved; implementation still blocked by Gate 0 | RESOLVED: Revision 3 APPROVED by Project Owner, 2026-10-19; M0-T05 DONE; [[06-Implementation/PROGRESS-LOG#M0-T05 approval evidence]] |
| RBAC matrix | Guards, UI gates, tests | Product + Security |
| Canonical routes | Frontend scaffold, auth scopes | Product + UX |
| Design tokens | UI shell | Design |
| BR-07 returns window | Settlement eligibility | Business |
| BR-09 COD remittance | COD module, vendor COD | Business + Legal |
| BR-10 country / seller-of-record | Tax, invoices, gateways | Legal |
| BR-13 tax inclusive/exclusive | Pricing, invoices | Finance + Legal |
| BR-14 rounding | Ledger correctness | Finance |
| BR-15 negative payable | Settlement edge case | Finance |
| BR-16 gateway availability | Payments | Business |

**Unblock rule:** no task in [[09-Implementation/Task-Backlog]] marked `BLOCKED` may start until its listed blocker is resolved **and recorded in [[01-Product/Decision-Register]]**.

## Dependency interpretation and unresolved sequencing

A dependency graph must distinguish **build prerequisites**, **runtime public interface calls**, **event subscriptions**, and **foreign keys**. These are not interchangeable nor permission to import a module’s private repositories. See [[05-Architecture/ADRs/ADR-005-Module-Boundaries]].

Gate 0 explicitly blocks M1 and later implementation until approval. The Codex audit flagged additional sequencing for quote revalidation, COD approval, common offer eligibility, settlements and M12 release sign-off; see [[09-Implementation/Milestone-Reconciliation]]. This appendix documents issues without falsely marking them resolved.

Migration sequence IDs `M001`–`M012` in diagrams are **not** milestone IDs; their conflicting uses in Data-Model and this graph require separate reconciliation before migrations.
