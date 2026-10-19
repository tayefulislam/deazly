---
tags: [architecture, adr, modular-monolith]
adr: ADR-005
task: M0-T05
status: APPROVED
approval: APPROVED
approval_date: 2026-10-19
decision_owner: Project Owner
revision: 3
last_updated: 2026-10-19
---
# ADR-005 — Module Boundaries

> [!important] APPROVED — Revision 3, Project Owner, 2026-10-19
> M0-T05 is DONE as a verified and explicitly accepted planning deliverable. Approval establishes the module-boundary decision, not application implementation or runtime certification. Gate 0 remains NOT READY; application development is not authorized.

## 1. Decision record and scope

| Field | Value |
|---|---|
| Decision owner / approval authority | Project Owner |
| Draft author | Codex, acting as Lead Architect under the user's M0-T05 documentation-only authorization |
| Architecture reviewer | Codex, final Revision 3 focused review, ACCEPT; report reviewed and accepted by Project Owner on 2026-10-19 |
| Security and finance reviewers | Planning-level controls covered by the accepted review; no separately named specialist audit or runtime sign-off claimed; policy and implementation reviews remain downstream |
| Revision / date | Revision 3 / 2026-10-19 |
| Review state | ACCEPT; documentation verified and explicitly accepted by Project Owner; historical findings closed for this planning deliverable |
| Approval / date | APPROVED / 2026-10-19 |
| Related task / gate | M0-T05 / G0-05 |
| Decision dependencies | ADR-001 authentication; ADR-002 ORM/transaction adapter; ADR-003 topology; ADR-004 money/rounding; M0-T06 RBAC; M0-T09 business policies |
| Review evidence | Revision 2/3 author checks, final Revision 3 ACCEPT report and explicit Project Owner approval recorded in [[06-Implementation/PROGRESS-LOG#M0-T05 approval evidence]] |
| Supersession | Approves Revision 3 of ADR-005; retains earlier proposal/review history; no other ADR is approved or superseded |

Objective: define enforceable ownership and interfaces inside the existing NestJS modular monolith and PostgreSQL database. API and worker deployments execute the same domain boundaries. No service extraction, second primary database, new product feature, DDL, REST endpoint or UI layout is authorized.

References:

- [[05-Architecture/Architecture-and-Interfaces]], [[05-Architecture/Data-Model]], [[05-Architecture/API-Contracts]], [[05-Architecture/Events-and-Failures]].
- [[01-Product/Business-Rules]], [[01-Product/Decision-Register]].
- [[09-Implementation/Task-Backlog]], [[09-Implementation/Dependency-Graph]], [[09-Implementation/Readiness-Checklist]], [[09-Implementation/Architecture-Audit]].
- All nine documents in 04-Modules, plus customer/vendor/operations, media, localization and notification specifications in 07-Experience.

## 2. Context, options and proposed decision

| Option | Consequences |
|---|---|
| Shared repositories/entities across broad modules | Fewer interfaces initially; weak isolation, uncontrolled writes and financial coupling |
| Explicit owners, public ports and coordinated PostgreSQL transactions | Selected proposal: preserves ACID invariants with enforceable private persistence |
| Independent services/databases | Distributed consistency and operational cost; outside approved architecture |

Retain one modular monolith. Domain owners enforce invariants; owner repositories alone write their tables. Workflow coordinators orchestrate owners using public, transaction-aware commands and queries. Projections and events support asynchronous work but cannot substitute for authoritative checks before stock or money mutations.

Module IDs below are logical boundaries, not additional applications. Offers and Pricing belong to Catalog; Returns, Disputes and deferred customer capabilities belong to Commerce; Online/COD/Refunds belong to Payments; Ledger/Settlements/Payouts belong to Finance; Localization/Policy belong to Platform. Deferred capabilities retain ownership without being approved for development.

## 3. Explicit module dependency and import matrix

Rows are consumers; the second column is the complete allowlist of direct imports of other owner modules' public application interfaces. A dash means none. All unlisted imports are prohibited; transitive access does not grant direct access. Internal domain code never imports another domain's implementation.

<!-- ADR005-IMPORTS-BEGIN -->
| Module ID | Allowed owner-interface imports | Purpose |
|---|---|---|
| Identity | — | Authentication and verified actor context |
| Vendors | Identity | Vendor membership and verification |
| CatalogCore | — | Canonical products, variants, taxonomy |
| Offers | CatalogCore, Vendors, Identity | Vendor-scoped commercial offers and associations |
| Pricing | Offers | Effective selling price and vendor-funded schedules |
| Media | Identity | Authorized assets, processing and quality |
| Inventory | Offers, Vendors, Identity | Stock/custody and reservation authority |
| Commerce | Identity | Carts, quotes, orders, cancellations and recovery records |
| CommerceReturns | Commerce, Identity | Return eligibility, inspections and disposition decisions |
| CommerceDisputes | Commerce, Identity | Cases, evidence and authorized resolutions |
| PaymentsOnline | — | Provider operations against trusted immutable payable context |
| PaymentsCOD | Vendors, Identity | COD authorization, arrangements and reconciliation |
| PaymentsRefunds | PaymentsOnline | Refund execution and provider reconciliation |
| Ledger | — | Journal posting from validated source contracts |
| Settlements | Ledger | Authoritative settlement liability and reservations |
| Payouts | Settlements, Ledger | Batches, attempts and verified transfers |
| Fulfillment | Commerce, Inventory | Shipment demand, custody and dispatch |
| Tax | — | Tax quotes and immutable documents from trusted context |
| Localization | Identity | Translation review and publication |
| Search | — | Own eligible catalog projection |
| Advertising | — | Own provider sync/campaign state |
| Recommendations | — | Own candidate/signal projections |
| Notifications | — | Own templates, preferences and deliveries |
| CommerceMessaging | Commerce, Identity | Deferred conversations and participant access |
| CatalogQuestions | CatalogCore, Identity | Deferred Q&A and moderation |
| CatalogReviews | CatalogCore, Identity | Deferred reviews; purchase evidence supplied by workflow |
| CommerceLoyalty | Identity | Deferred points records; policies remain unresolved |
| CommerceAlerts | Identity | Deferred subscriptions and alert delivery state |
| PlatformPolicy | Identity | Versioned policy storage and permitted administration |
| Workflows | Identity, Vendors, CatalogCore, Offers, Pricing, Media, Inventory, Commerce, CommerceReturns, CommerceDisputes, PaymentsOnline, PaymentsCOD, PaymentsRefunds, Ledger, Settlements, Payouts, Fulfillment, Tax, Localization, Search, Advertising, Recommendations, Notifications, CommerceMessaging, CatalogQuestions, CatalogReviews, CommerceLoyalty, CommerceAlerts, PlatformPolicy | Named use-case coordinators and cross-domain adapters |
| Composition | Workflows, Identity, Vendors, CatalogCore, Offers, Pricing, Media, Inventory, Commerce, CommerceReturns, CommerceDisputes, PaymentsOnline, PaymentsCOD, PaymentsRefunds, Ledger, Settlements, Payouts, Fulfillment, Tax, Localization, Search, Advertising, Recommendations, Notifications, CommerceMessaging, CatalogQuestions, CatalogReviews, CommerceLoyalty, CommerceAlerts, PlatformPolicy | NestJS API/worker bootstrap and DI wiring only |
<!-- ADR005-IMPORTS-END -->

Common-package layer:
- Kernel: framework-independent ID, money representation, currency, timestamp, correlation and actor-context value types. Money policy is ADR-004, not a configurable commission rate.
- Contracts: domain-namespaced transport/event schemas and port data shapes; may depend on Kernel only. No NestJS modules, ORM models or runtime owner services.
- Platform infrastructure: implements transaction, outbox/inbox, audit, configuration, queue, storage and observability ports. May depend on Kernel/Contracts and technical libraries, never owner modules or Workflows.
- Every owner's domain/application layer may import Kernel/Contracts and its own ports. Only its infrastructure/transport adapters may import platform infrastructure, NestJS and technical libraries. Domain code must remain free of ORM, HTTP and BullMQ dependencies.
- Workflows may use the common ports and owner public interfaces; Composition may bind infrastructure adapters. Neither layer gets repository/table access.
- packages/database provides connection/migration tooling and transaction adapters, not a global repository. packages/ui is frontend-only. packages/validation provides structural validation; server domain policy remains authoritative.

Location proposal: owner modules under apps/api/src/modules; coordinators and cross-domain adapters under an explicitly separate workflows/composition area. Worker composition reuses domain code without depending on API controllers or bootstrapping the API application. Physical package extraction is deferred to ADR-003 and later task specifications.

Each coordinator declares the subset of the Workflows row that it actually uses; the row is not permission for arbitrary service-locator access. Public exports use explicit entry points. Deep paths, ORM entities, repositories, raw transaction clients, dynamic service lookup and forwardRef cycle workarounds are prohibited.

Runtime facts are not code imports. Checkout obtains COD/carrier/tax inputs through coordinator-owned ports; PaymentsOnline receives payable snapshots through a coordinator; Ledger receives validated posting commands. Search, ads and recommendations consume Contracts and their own projections; authoritative offer resolution is composed by Workflows. These rules prevent Commerce↔Payments and Catalog↔Inventory import cycles.

## 4. Database ownership register

Scope: every explicitly named persistence object in Data-Model, Modules 01–09, the audit's data-object/gap lists and the detailed backlog. Prose-only migration concepts are assigned below without inventing physical tables. This is an ownership register, not approved DDL or confirmation that any table exists.

Source keys: DM = Data-Model; M01–M09 = numbered 04-Modules documents; AUD = Architecture-Audit; TB = Task-Backlog. Unqualified names inherit source schema context. Qualified names disambiguate collisions. ERD uppercase names refer to the same logical objects.

Names separated by commas each have the single owner in that row. Alias candidates retain their existing spellings; identifying related concepts does not approve merging or renaming them.

<!-- ADR005-TABLES-BEGIN -->
| Documented table/object names | Authoritative owner | Source / qualification |
|---|---|---|
| users | Identity | DM, AUD D-07 |
| vendors, vendor_memberships | Vendors | DM; vendor grants use Identity-issued actors |
| guest_checkout_sessions | Identity | AUD D-01; Commerce owns cart/quote contents, not verification credentials |
| vendor_verification | Vendors | AUD D-08 |
| catalog_products, product_variants, catalog_categories, brands, attributes | CatalogCore | DM, AUD D-17; categories spelling remains a logical alias candidate |
| seller_offers | Offers | DM/M09; price fields mutated through Offers' pricing-authorized interface |
| product_media | CatalogCore | AUD D-17; canonical association, not asset bytes; seller/variant association variants belong to Offers/CatalogCore respectively |
| discounts, promotions | Pricing | AUD D-05; pricing promotions, not paid ad campaigns |
| promotions.vouchers, promotions.rules, promotions.redemptions, promotions.campaigns, promotions.campaign_offers | Pricing | M09; quota/funding/stacking policy unresolved |
| coupons, vouchers | Pricing | AUD D-22; alias candidates for promotion concepts, not extra required tables |
| media_assets, media_variants, quality_reports, quality_findings | Media | AUD D-04 / TB M3-T06 |
| translations | Localization | AUD D-02/DB-10, TB M3-T07; entity owner must authorize source-content changes |
| warehouses, storage_locations, inventory_lots, stock_balances, stock_movements, stock_reservations, stock_transfers, transfer_lines, goods_receipts, serialized_units | Inventory | M01/DM; existing fulfillment schema does not transfer logical ownership |
| inventory_lot, warehouse | Inventory | AUD D-21 singular references to inventory_lots/warehouses, not extra tables |
| carts, cart_items, pricing_quotes | Commerce | AUD D-06/D-12; checkout quotes in TB M5-T02 are the same responsibility |
| addresses | Commerce | AUD D-09; customer profile data, distinct from Identity credentials |
| orders, vendor_orders, order_items, order_events | Commerce | DM/M03 |
| order_item_price_snapshot, order_totals, vendor_order_totals | Commerce | AUD D-19/DB-18; snapshot/projection representation not selected |
| cancellation_requests, cancellation_lines, failure_cases, recovery_actions, compensation_actions | Commerce | M03; workflow state references owner commands, never writes owner tables |
| returns.requests, returns.items, returns.inspections | CommerceReturns | M09; TB returns/return items/inspections/dispositions are this boundary |
| returns, return | CommerceReturns | AUD D-10/DB-20 logical/singular references; physical schema/table distinction pending |
| disputes.cases, disputes.events, disputes.evidence | CommerceDisputes | M09 |
| disputes, dispute | CommerceDisputes | AUD D-10/DB-20 logical/singular references |
| payments, payment_attempts | PaymentsOnline | TB M6-T03; provider references are payment-owned data |
| refunds, refund_allocations | PaymentsRefunds | AUD D-10 / TB M6-T06/M9-T04; refund record and reversal-link persistence is not yet selected |
| cod_collections, cod_collection_events, cod_remittance_batches, cod_remittance_lines, cod_reconciliations, cod_discrepancies | PaymentsCOD | M06 |
| vendor_cod_approvals | PaymentsCOD | AUD D-03 / TB M8-T14; offer COD preference remains Offers-owned |
| fulfillment_orders, shipments | Fulfillment | DM; packages in TB M7-T01 belong here |
| shipment_legs, shipping_quotes, shipping_costs, shipping_cost_allocations, shipping_adjustments, carrier_invoice_lines | Fulfillment | M05; adjustments contain evidence/ledger references, never journals |
| cost_allocations | Fulfillment | DM alias candidate for shipping_cost_allocations |
| carriers, carrier_accounts, carrier_services, labels, shipment_labels, shipping_slots | Fulfillment | AUD D-13/D-16/DB-16; labels/shipment_labels alias candidate; no carrier/slot policy chosen |
| ledger_accounts, ledger_transactions, ledger_entries | Ledger | M04; only Ledger posts financial journals |
| vendor_settlements, settlement_items | Settlements | M04; liability reservations belong here |
| payout_batches, payouts, payout_attempts, payout_reconciliation, payout_methods | Payouts | M04/AUD D-20; method verification does not authorize payout |
| jurisdictions, registrations, rate_versions, tax_calculations, invoices, invoice_lines, credit_notes | Tax | M02; immutable financial documents, no selected legal/tax policy |
| interaction_events, product_similarity, candidate_scores, model_versions, impressions, customer_preferences | Recommendations | M07; customer_preferences here means personalization only |
| advertising.connections, advertising.catalog_items, advertising.sync_jobs, advertising.promotion_mappings, advertising.campaigns, advertising.campaign_offer_rules | Advertising | M08; bare names in that document inherit advertising schema |
| search_documents | Search | AUD D-23 |
| notifications, email_templates, delivery_attempts | Notifications | AUD D-11; backlog templates/deliveries/preferences share this responsibility |
| messaging.conversations, messaging.messages, messaging.participants | CommerceMessaging | M09; deferred |
| loyalty.accounts, loyalty.points_entries | CommerceLoyalty | M09; points are not monetary journals |
| questions.questions, questions.answers, questions.reports | CatalogQuestions | M09; deferred |
| product_reviews | CatalogReviews | AUD D-18; deferred |
| alerts.subscriptions, alerts.deliveries | CommerceAlerts | M09; delivery transport delegated to Notifications |
| platform.outbox, platform.inbox, platform.idempotency_keys, platform.audit_log | PlatformInfrastructure | TB M1-T11–T14; domain owners use platform ports, not direct DML |
| outbox, inbox, idempotency_keys, audit_log | PlatformInfrastructure | Bare aliases in AUD/DM/Events-and-Failures; same logical objects as the platform-qualified row |
| currency_rates, feature_flags | PlatformPolicy | AUD DB-14/D-24; FX capability/policy not selected |
<!-- ADR005-TABLES-END -->

Prose-only concepts and alternative spellings:
- Identity owns credentials, sessions, MFA factors, guest access tokens, role-grant/permission catalog, warehouse-staff and finance-role assignments (TB M2-T01/T03/T04/T05). Vendor memberships/invitations/applications belong to Vendors (M2-T02/T15/T16). No physical names are selected here.
- CatalogCore owns category/attribute values and variant attributes; Offers owns seller SKU/condition/fulfillment/COD preference and seller-media associations. Media owns asset quality/processing; association owners authorize ordering/primary selection and references.
- Pricing owns price history/effective-price snapshots and discount schedule writes, using Offers to update offer-owned price fields. The authoritative calculation is Pricing; only Offers writes seller_offers.
- Inventory owns transfer/receipt lines including TB's receipt_lines, even where only a prose name is present. Owner scope includes vendor-held and platform-held stock. No new stock source or ownership policy is selected.
- Commerce owns order-number generation and customer profiles; CommerceReturns owns return_items/inspections/dispositions described in TB. PaymentsOnline owns payment allocations; PaymentsRefunds owns refund execution records/allocations; Ledger owns linked reversal journals.
- Fulfillment owns packages and carrier invoice header concepts implied by carrier_invoice_lines; Tax invoice_lines are distinct. Payouts owns provider attempts/reconciliation; Settlements owns financial holds and liability reservation metadata. Exact reservation storage is a later schema decision.
- Notifications owns notification_templates/deliveries/preferences concepts; alerts.deliveries is subscription-specific delivery intent, not the transport receipt. PlatformPolicy owns generic versioned configuration storage; the relevant domain owns policy validation and applicability.
- Bare outbox/inbox/audit_log/idempotency_keys references mean their platform-qualified counterparts. M08 bare connections/catalog_items/sync_jobs/promotion_mappings/campaigns/campaign_offer_rules mean advertising-qualified counterparts. Do not confuse promotions.campaigns with advertising.campaigns.
- AUD return/returns/dispute/disputes can denote a schema or logical aggregate rather than a concrete table. Their owner is fixed; schema normalization and exact DDL remain pending.

One owner writes each physical table after schema approval. Same-schema placement and foreign keys confer no write permission. Cross-owner queries use public interfaces or owner-approved read projections/views; no arbitrary cross-owner joins. Migrations may establish cross-domain FKs but must be reviewed by both owners. Cross-domain cascades must not delete historical orders, accounting, invoice or referenced-media evidence.

## 5. Returns, Refunds and Disputes

Commerce owns pre-dispatch cancellation acceptance and parent/vendor-order quantity state. CommerceReturns owns return requests, eligibility evidence, inspections and restock/quarantine/scrap decisions; Inventory alone executes stock movements. Fulfillment executes return shipping only through its own authorized command.

CommerceDisputes owns case participants, evidence, decisions and appeals. A case outcome requests an authorized refund/hold; it does not move cash, post journals or edit another owner's state.

PaymentsRefunds owns refund quantity/amount allocations, pending execution commitments, provider execution status and reconciliation. It validates trusted commercial entitlement and unrefunded limits supplied by the recovery workflow; PaymentsOnline performs the provider operation. Concurrent requests reserve the eligible refundable amount/quantity atomically so in-flight refunds cannot exceed the cap. Unknown provider results retain the commitment pending reconciliation.

Ledger owns refund journals/reversals. Tax issues eligible correction documents from finalized evidence. Settlements adjusts held/available liability through its own commands. Refund-after-payout creates linked recovery evidence and journal adjustments; negative-balance recovery remains BR-15. The workflow coordinates these owners without circular module imports or silently cancelling unaffected vendor orders.

## 6. Public interfaces and authorization context

Public owner operations accept immutable, validated input contracts, an explicit authorization context, operation/business key, expected versions and (where transactional) an opaque transaction capability. Query interfaces return scoped snapshots, not mutable entities or ORM clients. Financial commands accept source references and policy/snapshot versions; callers cannot nominate arbitrary journal accounts or client-calculated commissions.

Authorization context is constructed server-side after ADR-001 verification: authenticated actor/service identity, session or verified guest entitlement reference, requested action, permitted vendor/warehouse/customer scope, authentication assurance, correlation/causation and delegation origin. Permissions and memberships are resolved by trusted policy evaluation (M0-T06), never copied from client headers.

Each owner verifies action/resource scope at its boundary, including internal calls, exports and replays. A coordinator may narrow scope but cannot expand it. IDs in a request never establish vendor identity or ownership. Parent orders and vendor orders have separate random UUIDv4 identifiers; UUID unpredictability is never authorization.

For jobs, persist minimal actor/reference and intended scope, not session cookies, OTPs, bearer tokens or a permanent role snapshot. Execute with a narrowly privileged service principal and recheck current authority for new actions; retain initiating actor separately for audit. A durable command already accepted under a recorded policy version is reconciled according to its state, not silently reinterpreted as a new user command after revocation. Suspensions/holds affecting future fulfillment or money release are rechecked. Webhooks use verified provider service identity, not a customer/vendor identity from their payload. Least-privilege entitlement rules still apply to resulting queries and mutations.

## 7. Shared PostgreSQL transaction protocol

Workflows owns orchestration, never the records. Platform infrastructure runs the transaction and enlists owner-specific adapters on one PostgreSQL connection/transaction. The opaque capability carries transaction identity/lifetime; only enlisted owner repositories can obtain their restricted adapter. Do not expose a raw ORM/SQL client to coordinators.

1. The coordinator declares participants, invariant, authorization scope, business key and lock plan before writes.
2. Every participating owner joins the same transaction; it may neither commit independently nor open a nested independent transaction. Reads that determine the invariant use that transaction.
3. Acquire row/advisory/version guards in a documented total order across participants, then within each owner's stable resource-ID order. ADR-002 selects mechanisms and isolation levels proving equivalent safety.
4. Owner failure, failed expected version, insufficient stock/liability, authorization failure or outbox/audit insertion failure aborts the whole transaction. Participants propagate typed failures; catching an error cannot convert partial work into success.
5. Commit owner changes, command deduplication state/result, required audit and outbox facts together. Rollback removes all transactional effects. No callback, queue enqueue or external side effect is evidence of a committed DB mutation.
6. Retry the entire transaction only for classified serialization/deadlock/transient failures, with bounded attempts/backoff configured by infrastructure. Reread authorization, time-dependent policy, versions and availability each attempt. Do not retry stale quote/business rejection automatically as customer consent.
7. If the commit outcome is unknown, resolve the durable operation key before attempting new work. Retries retain the same key and request fingerprint.
8. Provider calls occur only after durable intent commits. Provider timeout enters reconciliation; no new charge/refund/payout reference is generated merely because a response was lost.

ADR-002 specifies ORM enlistment, rollback behavior, raw SQL containment, lock primitives and isolation. This ADR defines the required observable guarantees independent of ORM.

| Workflow | Atomic participants and guarantee |
|---|---|
| Place order | Commerce quote/order/idempotency, Inventory reservations, owner revalidation, platform audit/outbox; durable payment intent if created in this command joins via PaymentsOnline |
| Receipt / adjustment | Inventory receipt, movements, balances, discrepancy, operation key and audit/outbox |
| Verified payment/COD/refund result | Provider inbox acceptance, owning payment/refund/COD transition, policy-required Ledger journal and outbox in the source transaction per section 10; unknown or required-but-unposted results remain unavailable for settlement |
| Shipping finalization | Fulfillment evidence/allocation, Ledger posting and audit/outbox; pending evidence cannot masquerade as posted deduction |
| Cancellation/return/dispute resolution | Commercial quantity/decision, refund or hold commitment, permitted Inventory transition, recovery intent and audit/outbox; provider execution remains asynchronous |
| Liability scheduling / transfer authorization | Settlements reservation/revalidation, Payouts batch/attempt and Ledger encumbrance posting if approved accounting requires it, audit and durable operation intent |
| Verified payout result | Payouts outcome, Settlements reservation consumption/release, applicable Ledger posting and outbox |

External funds and local DB state cannot share ACID. There is no blanket distributed rollback; use idempotent intent and recovery/reconciliation. Accounting recognition timing/chart entries are not chosen here.

## 8. Checkout revalidation and reservation races

Commerce owns an immutable quote bound to customer/verified guest cart, currency, offer/variant/quantity, fulfillment/destination inputs, effective prices, expiry and source policy/version references. A quote never grants payment or stock authority.

At place-order commit the coordinator:

1. Verifies actor/cart entitlement, original request fingerprint, quote expiry and acknowledgment of material changes.
2. Resolves approved/non-restricted canonical variants, eligible active vendors/offers and fulfillment choice through owners. Offers' COD preference is distinct from vendor COD authorization.
3. Calls Pricing at a transaction evaluation instant; validates price/discount versions and promotion start/end. Use locks or conditional version guards on owner records so a concurrent change cannot pass unnoticed. Define that successful validation instant as the price acceptance linearization point; a later schedule boundary does not reprice accepted historical orders. Retries use a new instant.
4. Revalidates applicable tax/shipping quote validity, destination/carrier and policy versions. Missing required policy blocks the affected operation; placeholders are not production approvals.
5. For COD, checks current platform permission, admin-approved vendor state, offer toggle, carrier, destination and approved collection/remittance arrangement for every item. Mixed online-only carts require online payment by default. Serialize COD suspension/policy changes against acceptance via versions/locks; no silent payment-method substitution.
6. Calls Inventory to reserve authoritative stock using deterministic lock order and guarded quantity updates. Exclude transit/quarantine/damage from sellable stock; a display/search cache cannot reserve.
7. Atomically creates one parent order, independent vendor orders/items, immutable pricing/policy snapshots, reservations and durable outbox facts. Use idempotency to replay the same accepted result without a second reservation/order.

Inventory's display formula and transit bucket conservation examples conflict in existing docs. Inventory owns resolution; do not infer on_hand semantics or approve a new formula here. Vendor-to-warehouse transfer after ordering remains supported, but its allocation/commitment design must be approved before enabling that path; do not represent unreceived transit goods as available stock.

### 8.1 Reservation lifecycle and atomic acceptance

The following are proposed internal contract states, not changes to published API enums. Keep the state machines separate; exact persistence/enums are downstream schema work.

| Concern | States / meaning |
|---|---|
| Commerce order | PLACED_AWAITING_ACCEPTANCE, ACCEPTED, RECOVERY_REQUIRED, FAILED, CANCELLED; an order ID alone proves neither payment nor stock commitment |
| Online payment acceptance | UNCONFIRMED, VERIFIED_ACCEPTED, RECONCILIATION_REQUIRED; VERIFIED_ACCEPTED requires the approved payment architecture's authoritative provider evidence, not a client redirect or mere intent creation |
| COD order confirmation | UNCONFIRMED, AUTHORIZED_CONFIRMED; current platform/vendor/offer/carrier/destination/remittance policy must authorize confirmation; this does not mean cash collected or received |
| Inventory reservation | TEMPORARY, COMMITTED, EXPIRED, RELEASED; Inventory owns all quantity transitions |
| Allocation / fulfillment | UNALLOCATED, ALLOCATED, DISPATCHED; custody may independently be PENDING_RECEIPT or RECEIVED; stock commitment is not dispatch |

Order placement atomically creates PLACED_AWAITING_ACCEPTANCE and TEMPORARY holds against authoritative source stock (where that path is configured). It does not create VERIFIED_ACCEPTED. Each temporary reservation has its existing expiresAt, quantity, source and version. No timeout duration is selected here.

Only the successful shared transaction ACCEPT_AND_COMMIT removes a temporary hold from temporary-expiry eligibility. It records Commerce ACCEPTED and the applicable owner acceptance state, and changes all TEMPORARY reservations in that acceptance scope to COMMITTED without adding reserved quantity a second time. Merely recording a verified provider receipt, creating the order, or starting a worker does not do this. Physical lot/package allocation may follow; it cannot dispense with the stock commitment.

Payment acceptance revalidates the stored quote/order linkage, immutable amount/currency/allocation snapshots, current stock and applicable acceptance/COD policy. It never silently reprices the historical placed order to today's offer price. Any policy requiring renewed customer consent or a new quote must be explicit before enabling the affected flow. Financial recording of a verified capture after expiry is separate from Commerce acceptance: its source fact/journal may commit with RECOVERY_REQUIRED while the old stock hold remains EXPIRED.

Acceptance scope is explicit (the parent order's affected vendor-order/item set); all required holds in that scope join one transaction. No partial acceptance is implied by a partially successful loop. Existing independent-vendor cancellation/recovery rules determine later partial outcomes.

The acceptance and expiry coordinators use the same lock/version boundary over Commerce order/acceptance, relevant PaymentsOnline or PaymentsCOD state, and Inventory reservations/source balances, in the total order required by section 7. Capture database decision time t after acquiring the guards; do not use transaction-start time taken before lock waits. Validate versions again on guarded writes. ADR-002 selects the equivalent locking/isolation mechanism.

| Transition | Atomic preconditions | Committed result |
|---|---|---|
| TEMPORARY → COMMITTED | Order is PLACED_AWAITING_ACCEPTANCE; no terminal cancellation/failure; every required hold is TEMPORARY with matching version and t < expiresAt; quote/acceptance/policy checks pass; owner verifies online evidence or authorized COD confirmation | Inventory commitment, applicable acceptance state, Commerce ACCEPTED, deduplication result and outbox facts commit together |
| TEMPORARY → EXPIRED | t >= expiresAt; hold still TEMPORARY at the guarded version; ACCEPT_AND_COMMIT has not committed | Release exactly that hold's reserved quantity once; record expiry and Commerce recovery/expiry outcome with audit/outbox; verified/uncertain external funds are routed to recovery, not labelled failed by Inventory |
| TEMPORARY → RELEASED | Commerce-authorized terminal failure/cancellation for the affected unfulfilled scope; hold remains TEMPORARY | Release once with cancellation/recovery reference; other vendor-order holds are unaffected unless explicitly in scope |
| COMMITTED → RELEASED | Approved cancellation/recovery, unconsumed quantity and fulfillment/custody guards permit release | Owner-authorized release/compensation; never executed by the temporary-expiry worker |
| COMMITTED → allocation/dispatch | Valid stock commitment, authorized fulfillment and actual required custody are present | Fulfillment allocation/dispatch; Inventory alone records the corresponding stock movement |

At t = expiresAt the temporary-expiry boundary wins: ACCEPT_AND_COMMIT cannot accept the old hold. A provider's earlier occurredAt cannot resurrect a hold that failed this local guarded condition. Replays of a previously committed acceptance return its original result rather than reevaluating it as a new purchase.

### 8.2 Required race and recovery outcomes

| Scenario | Required behavior |
|---|---|
| Unpaid order reaches expiry | Release TEMPORARY holds once under the shared guards. Commerce determines the order outcome. Payment UNCONFIRMED is not proof of provider failure; reconcile an outstanding external intent according to approved payment policy |
| Payment confirmation before expiry | When ACCEPT_AND_COMMIT wins while t < expiresAt and all guards pass, mark reservations COMMITTED. Ordinary temporary expiry is then a no-op. Receiving a callback early without completing this transaction does not guarantee commitment |
| Expiry before payment confirmation | Commit EXPIRED and quantity release. Later confirmation records real payment evidence but cannot change EXPIRED → COMMITTED or decrement stock through the old hold |
| Callback arrives after deadline, worker has not yet released | Acceptance guard still fails on time. Atomically expire/release, or leave an explicit recovery intent for the expiry coordinator; do not accept merely because a stale TEMPORARY row remains |
| Concurrent acceptance and expiry workers | Shared locks/versions and database decision time permit exactly one legal transition. Loser reloads: COMMITTED means expiry no-op; EXPIRED/RELEASED means acceptance recovery. A stale version never authorizes a quantity update |
| Failed payment attempt | An individual failed attempt is not automatically a failed order. A remaining TEMPORARY hold may persist only until its existing deadline under the approved payment/retry policy |
| Failed or cancelled order | Reject new acceptance for terminal affected items; release eligible unconsumed holds exactly once. A later verified capture remains recorded and starts compensation; shipped/consumed stock requires the return/recovery workflow, not direct balance restoration |
| Vendor-to-warehouse, custody pending | A configured path may commit authoritative vendor-held source stock and remain ACCEPTED/PENDING_RECEIPT. COMMITTED prevents temporary expiry, but not approved supply-failure/cancellation recovery. Warehouse on_hand and dispatch availability cannot increase until Inventory verifies receipt. If no approved source commitment/custody design exists, keep that path disabled; do not invent warehouse stock or an acceptance guarantee |

For late verified funds, PaymentsOnline records the canonical provider fact and the section 11 economic effect; Commerce records RECOVERY_REQUIRED and a durable, idempotent recovery intent. Preserve the original order/payment linkage and the fact that cash was received. Re-reservation, if approved, must obtain fresh availability and a new reservation identity under the recovery policy; it never rewrites an EXPIRED/RELEASED hold or silently substitutes price/items. Otherwise an approved void/refund workflow uses a durable compensation ID and reconciles provider outcome before any repeat. Unknown outcomes keep the case open; no false refund/payment success, duplicate journal or payout eligibility is permitted. Where the recovery decision is unconfigured, hold the affected funds/order for authorized review rather than selecting a commercial remedy.

No COD remittance arrangement, payment authorization-versus-capture rule, custody deadline or cancellation window is selected here. Those decisions remain with the payment architecture record, ADR-004 and M0-T09 policies. Inventory cannot decide payment failure or cancel Commerce records independently.

## 9. Settlement liability reservations and concurrent payout protection

Ledger is the only journal-posting authority. Settlements owns eligibility, holds and reservations of outstanding unpaid vendor liability; Payouts owns batches/attempts. A settlement becoming AVAILABLE or SCHEDULED does not discharge liability or prove a payout.

### 9.1 Selected accounting basis and equation

Use outstanding unpaid liability, per immutable source settlement allocation, vendor and currency. Vendor totals are sums of source allocations with the same basis; enforce both source and aggregate caps. Do not pay one source twice through different batches.

| Symbol | Exact meaning | Included / excluded |
|---|---|---|
| E | Cumulative recognized earned vendor entitlement credited to vendor-payable liability | Final discounted sales less commission and initially recognized authorized deductions; recognition policy remains an approved accounting decision |
| J | Cumulative signed posted non-payout adjustments to that entitlement | Refund deductions, approved late delivery/tax adjustments and linked reversals; negative reductions, positive credits. Never include the same deduction already in E |
| P | Net finalized discharges already debited from vendor-payable liability, normally verified paid payouts | Includes a discharge exactly once; any approved non-cash discharge requires its own posted evidence. Settlement calculation, batch scheduling and unknown transfers are not P |
| L | Current outstanding unpaid ledger liability: E + J - P | Already net of P and posted J; includes amounts reserved for payout or held; reservations/holds do not themselves change L |
| U | Currently unavailable, unreserved portion of L | Union of applicable holds, uncleared online/COD funds and other eligibility restrictions, allocated without overlap. Excludes amounts already reduced through J/P and amounts represented in R |
| R | Active payout-reserved portion still included in L | Includes scheduled, authorized, submitted and unknown-outcome transfers until verified discharge/release; excludes consumed or released reservations |
| A | Amount available for a new reservation | max(0, L - U - R), subject to valid policy, source/aggregate caps and no unresolved unsafe exposure in that scope |

E/J/P are a reconciliation decomposition of Ledger's authoritative L, not mutable shadow balances. A cached settlement projection must not authorize a payout. The equations neither choose when entitlement is earned nor define tax/refund recovery policy; they constrain the approved policy's posted results.

Active R is included in L, excluded from U and subtracted exactly once to obtain A. Previously paid P is already removed in L; do not subtract P again from A. Holds do not post a financial debit merely to block payout. If L is negative or a reduction leaves R + U > L, expose the signed liability and deficit; max(0, ...) is a release cap, not permission to erase/recover a negative balance. Block new authorization for the affected unsafe scope and create an auditable review case under BR-15; do not silently choose carry-forward, offset or debit rules.

R is normally a subset of L, but an already in-flight commitment can exceed a subsequently reduced L; retain its full amount as recorded exposure until the verified outcome. A real verified payout is still recorded through Ledger even if a later refund has made L insufficient: expose the resulting deficit and policy-pending recovery case, rather than falsifying cash history or treating the transfer as unpaid. This does not authorize a new payout against insufficient liability.

### 9.2 Atomic operations and changing eligibility

- RESERVE(x): lock/version-check the affected source/aggregate liability and eligibility/reservation records, reread authoritative L and the non-overlapping U/R, require x > 0 and x <= A, then add a source-bound active reservation and bind the payout/batch in the same transaction. Enforce unique business scheduling key plus request fingerprint. Two workers cannot both reserve the same remainder. A duplicate key replays the same result; changed payload conflicts.
- RELEASE(x): with expected state/version, remove only the unconsumed reserved x from R once; L is unchanged. Re-evaluate restrictions before treating x as available: a hold may move x to U, and a refund already posted in J must not be deducted again. An unknown provider outcome cannot be released as though failed.
- CONFIRM_PAID(x): after verified provider evidence, atomically post the Ledger discharge (P increases by x, L decreases by x), mark the corresponding reservation consumed (R decreases by x), and commit Payouts outcome/audit/outbox. Replays reuse the economic-effect ID; no second debit or second consumption. No other owner edits journal balances.
- A hold/refund command and transfer authorization serialize on the same affected liability/reservation scope. Before a transfer intent is durably authorized, reduce/cancel an impacted unsent reservation and invalidate stale batch approval as necessary. For a hold, move the impacted portion from R to U once. For a posted refund, reduce L through J and shrink R as necessary; do not add that same refund to U.
- Approval and authorization recheck versions, current finance permissions, maker distinct from approver, cleared payment/COD evidence, allocation finality and all applicable restrictions. Delivery alone or an imported remittance line cannot clear funds.
- The durable transfer-authorization point separates revocable internal reservations from in-flight external exposure. A later hold on an in-flight reserved portion is flagged against that R (not counted again in U); a later refund reduces L through J while R remains pending. Mark that source unsafe and stop new release from it until reconciled. Do not claim an already authorized external transfer can be atomically revoked.
- A provider timeout leaves R active with the same payout/attempt/provider reference. Query/reconcile it before retrying. Verified failure permits an idempotent RELEASE followed by fresh eligibility checks; verified paid uses CONFIRM_PAID. If the provider cannot establish outcome, retain the reservation and review case rather than declare paid or free the liability.

For mixed batches, preserve source attribution and independent vendor-order holds; unaffected sources are not cancelled merely because one source needs review. Exact reservation tables/constraints are downstream schema work. Any aggregate negative-balance/offset restriction must be explicitly configured before permitting a batch, not guessed here.

### 9.3 Numerical acceptance examples (JPY minor units)

| Case | Inputs / operation | Required result |
|---|---|---|
| A — no payouts | E=900, J=0, P=0, U=0, R=0 | L=900; A=900. Reserving 900 changes R to 900, L stays 900, A becomes 0 |
| B — partial payout | E=900, J=0, P=500, U=0, R=0 | L=400; A=400. The prior 500 is not subtracted again. Verified payment of the remaining 400 makes P=900, L=0 and R=0 |
| C — competing workers | Start as B; two different batches each request 400 | The first locked/guarded commit sets R=400 and A=0. The second reloads and rejects/no-ops without a second reservation. After confirmed paid, L and R both become 0 |
| D1 — hold after unsent reservation | L=400, U=0, R=400; a 200 hold is authorized before transfer authorization | Atomically reduce the unsent reservation to R=200, move 200 to U and invalidate/reapprove the changed batch. A=max(0,400-200-200)=0 |
| D2 — refund after unsent reservation | E=900, P=500, R=400; approved posted refund J=-100 before transfer authorization | L=300; shrink R to 300, U=0; A=0. The refund is represented in J only, not deducted twice |
| D3 — refund after submission / uncertain outcome | Same initial 400 reservation, now in flight; posted refund J=-100 | L=300 and R=400 pending reconciliation; deficit=100. New payout availability is 0 and exposure is explicit. Retain R until verified outcome; paid/recovery handling follows approved policy, never a silent vendor debit |

These examples select an arithmetic basis only. They do not approve cadence, minimum payout, return windows, refund amounts, journal account selection or negative-balance recovery policy.

## 10. Outbox and four distinct deduplication scopes

| Mechanism | Unique logical identity | Atomic effect / failure handling |
|---|---|---|
| Client/internal command idempotency | Authenticated operation scope + business key, with canonical request fingerprint | Same request replays its authorized result; different fingerprint conflicts; concurrent claims cannot both mutate |
| Provider webhook receipt | Provider + connected account/environment + provider event ID; verified payload hash detects conflicting reuse | Verify signature/raw body and provider-specific replay rules first. Inbox receipt, accepted owner transition, posting/outbox commit together, or persist durable receipt and process later with explicit pending state |
| Internal event consumer processing | Stable consumer/handler identity + event ID; handler-version migration is explicit | Each consumer deduplicates independently in the same transaction as its own mutations/outbox; one consumer cannot suppress another |
| Financial economic effect | Canonical economic fact ID + accounting component + currency (economicEffectId), independent of delivery, handler or command ID | Ledger enforces uniqueness with a canonical accounting-input fingerprint in the same transaction as balanced entries. Same identity/input returns the original journal; conflicting input rejects and reconciles. A new event ID cannot authorize another posting |
| External provider operation | Stable business operation/provider idempotency reference | Durable intent before network call, persist observed outcome, reconcile unknown results before new attempts |

platform.inbox owns receipt/deduplication persistence; provider and internal namespaces are logically distinct. Whether one table or separate physical tables represents them is ADR-002/schema design. Do not claim M1-T12's provider-only sketch already covers consumer-scoped processing. Retention, replay windows, key expiry and signed payload algorithms require provider contracts/M1-T13/T18 specifications; no arbitrary TTL is selected.

The outbox dispatcher delivers at least once. Consumer completion marks and effects commit together; crash before commit retries, crash after commit deduplicates. Jobs acknowledge durable processing, not merely enqueue success. Use bounded retries, visible dead letters, audit and authorized replay. External effects require durable intent and provider reconciliation; an inbox row alone cannot make an external API call exactly once.

The four scopes are not interchangeable: a provider can send different webhook event IDs for one capture; a reconciliation command can discover the same capture without a webhook; two subscribers can legitimately process the same event; two commands can refer to one economic fact. Signature verification and receipt deduplication alone do not prevent duplicate journals.

Resolve verified provider observations to one owner-controlled canonical fact using a unique provider/account/environment/operation-type/provider-operation-ID mapping (or an approved equivalent identity). A callback and reconciliation job upsert/lock that same fact before accepting it. The owner issues immutable businessEffectIds for its fact components. A capture cash component uses the canonical capture ID; a commission component uses the immutable order-item entitlement/allocation ID, not each capture ID; refund components use the canonical refund and allocation IDs; payout discharge uses the canonical transfer and liability-allocation IDs. COD collection, remittance and matching are different facts, not three names for the same cash receipt. Each approved accounting component has one canonical fact anchor; record this mapping before implementation. Never derive economic identity from a webhook/event delivery ID, timestamp, worker, batch retry or mutable policy version. Store policy version and amounts in the fingerprint; corrections require a separately authorized, linked reversal/adjustment identity, not a new key for unchanged economics.

**Single posting route: source transaction only.** For every financial component requiring recognition under approved accounting policy, its authoritative source workflow calls Ledger's public posting port through Workflows in the same PostgreSQL transaction as the accepted source fact, economic-effect claim and outbox. Ledger alone writes journals. The event carries the committed economicEffectIds/journal references. Later event consumers are projection/recovery-trigger consumers, never an alternative journal-posting route. A recovery trigger may ask the authoritative source workflow to retry its original operation with the same fact/component IDs; it cannot create an event-derived posting key. This also applies to provider callbacks and reconciliation. Ledger is never imported directly by a source owner contrary to section 3: the coordinator enlists both owners.

A durably received provider observation may await processing; it is not a financially accepted fact until the required journal/source transaction commits. Where no accounting entry is required, persist an explicit NOT_APPLICABLE disposition with its approved policy reference. Missing recognition policy means PENDING_POLICY and blocks the affected financial acceptance/eligibility, not an inferred zero entry. Required posting failure rolls back acceptance/outbox; external evidence remains durable for recovery. There is no later Ledger-consumer posting option for the same effect. Recognition timing, accounts and legal treatment remain separate decisions.

Aggregate version guards protect transitions; event stream sequencing is defined in section 11. A newer full-state projection may supersede older versions only if its contract allows it. Delta consumers cannot silently discard missing required facts. Replaying event transport never replays money movement or stock mutation; repair of authoritative state requires an authorized owner command with the original business-effect identity and current invariant checks.

## 11. Event ownership and contract register

All entries are proposed contracts for already documented event names, not implemented payloads. Source is Events-and-Failures, M01–M09, TB or Notifications-and-Email. The publisher is the owner of the committed fact; a coordinator may call its publication port inside the same transaction but cannot impersonate another owner.

Common proposed envelope: existing eventId/eventType/aggregateType/aggregateId/aggregateVersion/occurredAt/correlationId/payload plus explicit schemaVersion, streamId, streamSequence, businessEffectIds and causation/operation reference. Version 1 is the proposed starting schema, not proof of a published contract. Actor references contain no credentials. Money payloads require currency, integer amounts, immutable source and policy versions. Final field-level schemas and compatibility fixtures remain M1-T07/domain contract work.

streamId is publisher + aggregateType + aggregateId, with explicit schema/tenant scope where needed. aggregateVersion is the owner's monotonically increasing committed state version; immutable append-only facts have version 1. Several events may describe one state version. streamSequence is a contiguous committed event ordinal within that complete stream, allocated transactionally with outbox insertion (no externally visible rollback gaps), not a global database sequence. Multiple events at one aggregateVersion have different ordinals. Envelope IDs/versions stay unchanged on redelivery and replay; aliases for one fact share businessEffectIds, never imply another economic effect.

<!-- ADR005-EVENTS-BEGIN -->
| Event name(s) | Publisher owner | Intended consumers / minimum committed fact |
|---|---|---|
| OfferApproved | Offers | Search/Advertising/Recommendations/Notifications: offer, vendor/variant, approval version |
| OfferPriceChanged | Pricing | Search/Advertising/Recommendations: effective price/source version and currency; Offers-owned price update joins transaction |
| PromotionScheduled, PromotionStarted, PromotionExpired | Pricing | Advertising/Search/Notifications: promotion/offer, effective interval and price version |
| PromotionActivated, SaleStarted, SaleEnded | Pricing | Documented alternate vocabulary; map to lifecycle contracts only after schema review; no duplicate financial effect |
| OfferDisabled | Offers | Search/Advertising/Recommendations: restriction/status version |
| VendorSuspended | Vendors | Eligibility projections and Workflows: vendor/status version; future guarded commands recheck authority |
| StockReserved, StockReservationReleased | Inventory | Commerce/Fulfillment via Workflows: reservation/item/lot quantities and version |
| GoodsReceived, StockBecameAvailable, StockDepleted | Inventory | Fulfillment/Search/Advertising: receipt or availability source reference/version |
| InboundDispatched, StockAdjusted, InventoryDiscrepancyOpened | Inventory | Operations/Notifications: transfer/movement/discrepancy reference |
| WarehouseTransferReceived | Inventory | Notification vocabulary: receipt reference; equivalence with GoodsReceived requires contract mapping |
| OrderPlaced, VendorOrderConfirmed | Commerce | Payments/Fulfillment/Notifications via Workflows: parent/vendor order and immutable payable/snapshot references |
| ParentOrderConfirmed, VendorOrderCreated | Commerce | Notification source vocabulary; creation and confirmation are distinct facts, not automatic aliases of OrderPlaced |
| ShipmentDispatched, OrderDelivered, OutForDelivery, Delivered | Fulfillment | Commerce/COD/Notifications via Workflows: shipment/package status/version; Delivered label maps to shipment delivery, never COD cash |
| ShippingCostFinalized | Fulfillment | Ledger/Settlements via Workflows: cost/allocation/source/policy version and currency |
| OrderCancellationAccepted | Commerce | Inventory/Refunds/Notifications via Workflows: accepted item quantities and recovery reference |
| ReturnOpened | CommerceReturns | Operations/Notifications: item/vendor order/request reference |
| DisputeResolved | CommerceDisputes | Recovery/Notifications: authorized case outcome reference, not cash movement |
| PaymentCaptured | PaymentsOnline | Ledger/Commerce/Settlements via Workflows: verified provider operation and allocation references |
| RefundCompleted | PaymentsRefunds | Ledger/Tax/Settlements/Notifications via Workflows: verified completed refund/allocations; never emit for a request alone |
| CODCollected | PaymentsCOD | Operations/Ledger via Workflows: verified collection evidence; not remitted cash |
| CODRemitted | PaymentsCOD | Reconciliation/Notifications: verified remittance evidence; not matched/releasable liability |
| CODRemittanceMatched, CODReconciled | PaymentsCOD | Settlements/Ledger via Workflows: match/decision/evidence reference; vocabulary equivalence pending, not a second cash posting |
| SettlementAvailable | Settlements | Payouts/Notifications via Workflows: eligible liability/version; payout must still revalidate |
| PayoutVerifiedPaid, PayoutConfirmed | Payouts | Ledger/Settlements/Notifications via Workflows: verified transfer reference; confirmation label cannot mean request accepted |
| InvoiceIssued | Tax | Notifications: immutable invoice/issuer/document reference |
| MediaReviewFailed | Media | Offers/Notifications via Workflows: asset/report/review reference |
<!-- ADR005-EVENTS-END -->

### 11.1 Financial and inventory replay contract profiles

The following register refines, rather than replaces, the publisher register. Aggregate names are logical contracts, not new tables or endpoint schemas. Every name in these families uses the common version/stream rules above and these mandatory profiles:

- **F — financial fact:** posting responsibility is exclusively Ledger through the authoritative source transaction in section 10, when approved policy requires an entry; otherwise an explicit approved NOT_APPLICABLE disposition. No event-consumer posting. Replay rebuilds projections only and never calls providers. Consumer scope is handler + eventId for transport and handler + businessEffectId + projection purpose for equivalent facts/aliases; both markers commit with the projection. Ledger additionally deduplicates economicEffectId globally within its accounting scope, independent of handler. Ordering is per complete owner stream; cross-owner order is never assumed. Causal missing dependencies trigger durable deferral/owner reconciliation, not guessed accounting.
- **N — eligibility/evidence only:** no journal from this event; replay rebuilds the named projection. Same transport and semantic consumer scopes as F. An approved later economic decision is a separately identified source fact, not permission for a subscriber to post from this label. Per-stream ordering/causal deferral as F.
- **I — inventory:** only Inventory mutates stock in the original owner transaction; there is no stock mutation from replay. Ledger posting responsibility is NONE for these operational events; any approved valuation accounting needs its own explicit source-effect contract before use. Replay rebuilds non-authoritative stock projections, never reserves/releases/receives again. Consumer scope is handler + eventId and handler + businessEffectId + projection purpose. Delta projections apply each identified movement exactly once in causal order or rebuild from an authoritative snapshot. No cross-stream arrival order is assumed.

Every row supplies aggregate identity and stable effect anchors; all profiles retain at-least-once delivery with idempotent committed effects. Collections of components carry the individual component IDs, not just a batch ID.

<!-- ADR005-REPLAY-BEGIN -->
| Event name(s) | Publisher | Aggregate type / aggregate ID | Stable business-effect identity | Profile / posting and ordering refinement |
|---|---|---|---|---|
| PaymentCaptured | PaymentsOnline | PaymentCapture / canonical capture ID | capture ID + cash/allocation component + currency; commission, if recognized here, uses the order-item entitlement component identity | F; verified provider operation maps to this capture once; no independent callback/reconciliation posting |
| RefundCompleted | PaymentsRefunds | Refund / canonical refund ID | refund ID + allocation/component + currency | F; linked capture/order allocation prerequisite; request and completion are not two refund postings |
| ShippingCostFinalized | Fulfillment | ShippingCost / finalized cost ID | cost ID + vendor-order allocation/component + currency | F; corrected cost uses a linked adjustment ID, never overwrites/reposts original deduction |
| CODCollected | PaymentsCOD | CODCollection / canonical collection ID | collection ID + collection component/allocation + currency | F; collection evidence only, not remittance or payout eligibility |
| CODRemitted | PaymentsCOD | CODRemittance / canonical remittance ID | remittance ID + receipt-line/component + currency | F; remittance evidence distinct from collection and matching |
| CODRemittanceMatched, CODReconciled | PaymentsCOD | CODReconciliation / canonical reconciliation decision ID | decision ID + match allocation/component + currency; any already-recognized cash component retains its original collection/remittance economicEffectId | F; vocabulary mapping pending; aliases cannot post the same match or cash twice; require collection/remittance prerequisites |
| SettlementAvailable | Settlements | VendorSettlement / settlement ID | settlement ID + eligibility transition version | N; eligibility is not another earned entitlement or paid discharge; payout revalidates source liability |
| PayoutVerifiedPaid, PayoutConfirmed | Payouts | PayoutTransfer / canonical transfer ID | transfer ID + liability allocation/discharge component + currency | F; same verified transfer identity for callbacks, reconciliation and both labels; pending/submitted is not paid |
| InvoiceIssued | Tax | Invoice / immutable invoice ID | invoice ID + issue component; any approved accounting component + currency | F; approved policy may mark NOT_APPLICABLE; issuance cannot post capture/commission a second time |
| StockReserved | Inventory | StockReservation / reservation ID | reservation ID + reserve generation + item/source allocation | I; original reserve mutation only; acceptance commitment retains reservation identity, never reserves twice |
| StockReservationReleased | Inventory | StockReservation / reservation ID | reservation ID + terminal release generation + item/source allocation | I; expiry/cancel share one terminal release effect; committed release uses its authorized recovery operation ID |
| GoodsReceived, WarehouseTransferReceived | Inventory | GoodsReceipt / canonical receipt ID | receipt ID + receipt-line/movement ID | I; mappings pending; both labels for one receipt share movement IDs; custody changes once |
| InboundDispatched | Inventory | StockTransfer / transfer ID | transfer ID + dispatch operation/line/movement ID | I; receipt is a distinct later movement with causal transfer reference |
| StockAdjusted | Inventory | StockMovement / immutable movement ID | movement ID (version 1); correction has its own linked movement ID | I; movement amount never reapplied on replay |
| StockBecameAvailable, StockDepleted | Inventory | StockBalance / offer-location-source balance ID | balance ID + availability transition version | I; derived availability transition, not an additional quantity delta; movement IDs reference the causing facts |
| InventoryDiscrepancyOpened | Inventory | InventoryDiscrepancy / discrepancy ID | discrepancy ID + opening transition | I; evidence, no automatic adjustment; approved correction is a distinct movement |
<!-- ADR005-REPLAY-END -->

OrderPlaced/ParentOrderConfirmed/VendorOrderCreated/VendorOrderConfirmed, OrderCancellationAccepted, ReturnOpened, DisputeResolved and delivery events do not themselves authorize a payment, stock mutation or journal on replay. Commands arising from them recheck owner state, authorization and approved policy, and use the original authorized operation/effect identity. Actual resulting capture/refund/movement/discharge facts use the contracts above. A cancellation label is not a refund completion; a delivery label is not cash or entitlement recognition.

### 11.2 Ordering, filtered subscriptions and recovery

A subscriber consuming the **complete** stream can detect a genuine missing streamSequence and defer a dependent delta until replay/backfill or an authoritative snapshot establishes the checkpoint. AggregateVersion jumps alone do not prove missing events: versions may include changes with no event, and one version may emit multiple events. A filtered subscriber (for example only StockReservationReleased) legitimately skips other event types and cannot demand consecutive complete-stream ordinals or call every jump a failure. Its contract must either use a full-stream checkpoint/watermark reader, provide an explicit predecessor for the relevant projection stream, or read the authoritative owner/snapshot for the missing causal prerequisite. It must not invent consecutive filtered numbering from arrival order.

Record each subscriber's filter, checkpoint scope, projection purpose, causal prerequisites, snapshot/rebuild strategy and supported schema versions before implementation. Preserve source ordinals across redelivery. A late old notification may be ignored only under an explicitly full-state/latest-version contract; an unapplied movement or financial component cannot be discarded merely because a newer version arrived. Consumer rebuilds use an isolated projection generation/checkpoint namespace, never reset Ledger economic uniqueness or owner command keys. Original user grants are not replay authority: section 6 requires a scoped service principal, source actor attribution and current authorization for new commands; envelope actor references cannot grant access.

Each subscriber is separately scoped and named before implementation. Consumer labels in this register express information flow, not owner-import permission. Financial journals are source-transaction effects; later event consumers project the result instead of posting it again.

Required contract cases: duplicate event/provider receipt, conflicting payload reuse, unsupported schema version, two independent consumers, out-of-order/gapped sequence, unknown provider outcome, replay after consumer deployment, and parent confirmation notification deduplication. Do not collapse creation/confirmation, delivery/cash, or remittance/match because names look similar.

## 12. API/database/UI consistency and unresolved decisions

| Existing reference | Compatibility rule / remaining work |
|---|---|
| Architecture-and-Interfaces places Pricing with Commerce in its overview | Approved ownership is Catalog.Pricing; Commerce orchestrates it. Overview reconciliation remains a downstream documentation prerequisite before implementation, not permission for two pricing authorities |
| DM/M01 puts stock tables in fulfillment schema | Inventory owns them logically; no physical rename in this task |
| DM cost_allocations vs M05 shipping_cost_allocations | One proposed owner (Fulfillment); schema/alias resolution deferred |
| TB M8-T14 combines COD authorization and offer eligibility | PaymentsCOD owns authorization; Offers owns preference. Workflow coordinates both; no cross-owner table writes |
| M6 and M9 each describe refund records / RefundCompleted | One execution owner PaymentsRefunds and one linked Ledger posting path; migrations/event producers must be reconciled before implementation |
| M09 adjacent schemas and AUD missing-object names | Ownership retained in section 4; no duplicate physical models or hidden feature removal |
| API /api/v1 prefixes, envelopes, pagination, expectedVersion and idempotency headers | Retained. Financial/inventory commands require backend authorization; no new endpoint is created |
| API POST warehouse/reservations described as internal | Remains internal owner port; never grant a customer stock-override endpoint |
| COD reconcile dry run / payout approval endpoints | Preview is not commit; finalization rechecks evidence, versions, actor scope and maker/checker rules |
| Events envelope lacks schemaVersion; notification names differ | Section 11 proposes explicit version/ownership and records unresolved mappings; no silent payload migration |
| M03 diagram compresses payment failure and release into one arrow | Section 8 distinguishes failed attempt from terminal order failure; payment timeout alone never proves failure; expiry can release stock while funds remain under reconciliation |
| M01/M04/Events contain overview-only reservation, liability and replay rules | Sections 8–11 refine the proposed protocols; field-level schemas, stream checkpoints and economic-component identity maps require approved downstream contracts before implementation |
| G1-05 still says exactly-once dispatcher | Inconsistent with at-least-once design; separate checklist correction required, no approval inferred |
| Dependency-Graph mixes runtime/events/build order and includes API cycle | Section 3 governs only this proposed import graph; older sequencing defects remain recorded, not resolved here |
| M0-T05 planning status vs application progress | DONE means this planning document is verified and explicitly accepted; all application features remain NOT_STARTED. Only G0-05 is satisfied (1/35); Gate 0 remains NOT READY |

ADR-001 selects authentication/session/guest security. ADR-002 selects ORM, enlistment, isolation and migration mechanics. ADR-003 selects topology/cookie domains. ADR-004 selects rounding/residuals, tax commission basis and FX stance. These ADRs are pending; references are identifiers, not claims that approved files exist.

BR-05/06/07/08/09/10/11/12/13/14/15/16 remain under the Decision-Register and M0-T09. No inbound freight payer, return window, cadence, country, issuer, gateway, tax rate or negative-balance debit is selected here. A payment architecture decision record is required by AGENTS before selecting/changing that architecture; no new ADR number is invented.

UI implications: preserve current layouts, localization (en/ja/id) and currency independence. Show authoritative queued/pending/reconciled/paid states, own-vendor settlement details only, and customer-facing charges without internal vendor margins. Missing schemas and page specifications remain Gate 0 work.

## 13. Preserved business invariants

- CatalogProduct → ProductVariant → SellerOffer; translations do not duplicate canonical products.
- One shared checkout, one parent order and independent vendor orders/shipments; partial cancellation/refunds preserve unaffected sellers.
- Inventory alone owns stock writes and reservations, regardless of custody or fulfillment method.
- Ledger alone posts immutable balanced double-entry journals per currency; corrections are linked reversals/adjustments.
- Commission is fixed at 10% (1000 basis points) of final discounted product selling price, never pre-discount price or delivery. ADR-004 supplies deterministic integer-minor-unit rounding; no 0.9 multiplier substitutes for commission subtraction.
- Vendor payable starts with final product price minus commission minus applicable authorized platform delivery deduction; taxes/refunds/other adjustments remain explicit. Example: JPY 1000 → 100 commission → 900 before delivery, or 750 after the illustrated authorized 150 deduction.
- Vendors fund their own discounts; schedule expiry changes current prices automatically but cannot rewrite order snapshots.
- PLATFORM_FULFILLED may deduct applicable allocated delivery cost once; VENDOR_FULFILLED has zero platform deduction absent separately authorized policy. Inbound cost responsibility remains open.
- New vendor COD is disabled; admin approval plus eligible offer/platform/carrier/destination/remittance arrangement is mandatory. Checkout revalidates every participating offer.
- Delivered ≠ collected ≠ remitted ≠ matched ≠ eligible for payout. No payout from delivery confirmation alone.
- Payment/refund/payout commands and settlement reservations are idempotent; unknown external outcomes reconcile before retry with a new operation.
- Marketplace funds Google/Meta advertising; vendors have no advertising fees/wallets. Catalog synchronization cannot authorize campaign spend or guarantee ad delivery.
- Backend authorization protects customers, guests, vendors, warehouses and finance; no UUID-only entitlement. Media binaries remain in S3/R2; referenced assets and accounting evidence are retained under approved policy.

## 14. Enforceable checks and CI acceptance criteria

This section specifies future implementation tests; it does not install tools or claim they pass now. Link later task specifications to M1-T03 (boundaries), M1-T07 (contracts), M1-T25 (CI) and the relevant owner tests. New test files require later implementation authorization.

| Check | Required acceptance criterion |
|---|---|
| Import manifest | Every owner/adapter/public entry point mapped to section 3; no undeclared edge; zero strongly connected components larger than one and zero self-imports |
| Resolved graph | Check TypeScript aliases, package exports, barrels, type imports, literal dynamic imports and NestJS DI/provider graphs; ban nonliteral cross-domain imports, global service lookup and forwardRef bypasses |
| Layer/public-surface restrictions | Fail on domain→ORM/HTTP/queue, private entity/repository imports, backend→frontend and browser→server/secret paths |
| Ownership | Every migration table/view/function/trigger and repository maps to one owner; static ORM/raw SQL allowlists and owner-reviewed migration references reject cross-owner writes, including triggers and cascades |
| Raw SQL containment | SQL access only in declared owner/technical adapters; dynamic/unanalysable SQL requires explicit reviewed query registration; lint alone is not proof of write isolation |
| Transaction fixtures | Inject a failure after every participant/outbox step; assert zero partial order/reservation/payment/journal mutation and no committed success result |
| Checkout contention | Concurrent final unit, price/promo boundary, offer/COD suspension and quote change; at most one valid reservation and no unauthorized stale acceptance |
| Expiry/payment contention | Both commit orders tested; no released stock consumed and no late verified funds silently lost |
| Reservation state fixtures | PLACED_AWAITING_ACCEPTANCE remains TEMPORARY; only atomic ACCEPT_AND_COMMIT prevents expiry; test equality at deadline, late callback before worker runs, terminal cancel and pending-custody allocation guards |
| Liability contention | Two batches for same liability, duplicate schedule/approve/result, refund/hold before/after transfer authorization; no over-allocation, double payout or premature release |
| Liability arithmetic | Cases A–D3 in section 9.3 pass; prior P deducted only through L; unknown transfers retain R; holds/refunds do not double-count U/J and deficit is visible |
| Inbox/outbox contracts | Duplicate provider receipt, two consumers of one event, crash before/after commit, conflicting hash, schema mismatch and sequence gap; each legitimate effect once, no cross-consumer suppression |
| Economic-effect recovery | Distinct callback event IDs, reconciliation and replay for one fact yield one journal/component; conflicting economic fingerprint rejects; source journal failure rolls back acceptance/outbox; replay consumers post zero journals and call zero providers |
| Replay coverage | Every financial/inventory event maps to section 11.1; test same-version multiple events, full-stream gaps versus filtered skips, alias-equivalent effect IDs, delta backfill and isolated projection rebuild |
| Security fixtures | Customer/vendor/guest/warehouse/finance list/detail/export/mutation and job isolation; forged context, stale grants and maker=approver rejected |
| Money/policy fixtures | 1000 bps post-discount commission; currency balance; approved rounding policy; no delivery double deduction/vendor ad fees; unconfigured policy blocks affected money movement |
| Negative architecture fixtures | Deliberately prohibited imports, cross-owner SQL and DI cycles must fail the checker; a permitted coordinator transaction must pass |
| CI result | Required lint, typecheck, architecture, unit/integration/contract and relevant E2E jobs all pass; do not waive a failed boundary test to build a feature |

Before ADR acceptance, independently review the matrix, full table/source mapping, event register, transaction/authorization protocols and all recorded compatibility differences. Document-only checks can inspect the proposed graph and ownership coverage now; actual concurrency, rollback, API and CI behavior must be proven later against code.

## 15. Consequences, migration and acceptance

Explicit ports/coordinators add code and contract maintenance later, but preserve financial/inventory correctness and prevent repository coupling. No shared DB transaction grants shared ownership. Projections remain rebuildable and non-authoritative for checkout/payout.

No migrations or runtime changes occur in M0-T05. Before implementation, the approved ADR must be reflected in domain schema/API/task specifications and the dependency graph, retaining all canonical IDs. Existing migration-family numbering conflicts remain unresolved. Project Owner approval satisfies G0-05 only; no application feature or other Gate 0 requirement is completed.

Acceptance record — 2026-10-19:

The following paragraph preserves the pre-approval review history, not the current decision status:

Historical review findings retained: the review of revision 2 returned **REVISE**, with HIGH reservation-expiry ambiguity, HIGH payout-liability double subtraction and MEDIUM incomplete economic-effect/replay contracts. Revision 3 proposes corrections in sections 8, 9 and 10–11 respectively, with measurable fixtures in section 14. These are author corrections, not independent closure or acceptance. All three findings await reviewer confirmation; prior evidence in PROGRESS-LOG is retained.

- Reviewer identity/date: Codex, final Revision 3 review, 2026-10-19; Project Owner reviewed the report and accepted the decision on 2026-10-19.
- Architecture review verdict and issue references: ACCEPT for Revision 3 corrections. The HIGH reservation-expiry, HIGH payout-liability and MEDIUM economic-effect/replay findings are closed for M0-T05 by the accepted review and explicit owner approval; their historical text is retained above.
- Security/finance review evidence: accepted planning-level authorization, Ledger, liability and replay controls in sections 6–11 and the final review. No separate human specialist audit or runtime test certification is represented by this approval.
- Verification evidence: [[06-Implementation/PROGRESS-LOG#M0-T05 approval evidence]] records the documentation acceptance mapping, structural checks and final review report. This is not a claim of independent implementation testing.
- Explicit approval decision/date: APPROVED, Project Owner, 2026-10-19. The user's instruction "Deazly — Approve ADR-005 and Close M0-T05" expressly approves Revision 3 and authorizes closing the planning task.
- Task lifecycle: IMPLEMENTED → VERIFIED → DONE on 2026-10-19; verification recorded before explicit-acceptance synchronization. See the progress log for both transitions.
- Approval scope / follow-up decisions: Revision 3 module boundaries are adopted; proposed persistence labels and field-level schemas remain downstream design work. Section 12 compatibility work, ADR-001–ADR-004, M0-T06/M0-T09, provider contracts and specialist/runtime reviews remain unresolved. This approval neither resolves those decisions nor completes Gate 0 or authorizes application development.
