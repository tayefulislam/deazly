---
tags: [screens, admin, marketing]
---
# Admin Workspace — Screen Specs

## A01 — Operations home
KPIs: gross merchandise value, confirmed payments, pending COD, vendor liabilities, delayed fulfillment, unresolved incidents, catalog errors, advertising sync failures. **Financial KPIs show currency and time interval.** Drill-down links to filtered tables.

Exception queue combines risk/recovery signals: missing warehouse stock, overdue inbound, COD remittance discrepancy, courier failure, negative payable, unapproved tax settings.

## A02 — Fulfillment policy and warehouse management
Tabs `Warehouses`, `Carrier integrations`, `Shipping charges`, `Allocation rules`, `Transfer responsibilities`, `Return & RTO policies`.

Policy editor requires effective date + who bears cost + rounding/allocation method. A read-only preview shows sample vendor order settlement before publishing. Policy versions must not retroactively change settled orders.

## A03 — Taxes and invoicing
Tabs `Jurisdictions`, `Seller-of-record`, `Rates`, `Registrations`, `Invoice Templates`, `Credit notes`, `Tax reports`. Legal warnings on unconfigured regions. Tax rate form version history and simulation of tax-inclusive vs exclusive quote.

Invoice detail shows document issuer, immutable PDF reference, tax breakdown, issuance timestamp, original invoice and corrective credit notes. No hard delete of issued invoice.

## A04 — Marketing & catalog synchronization

```text
Platform marketing / Catalog
Google Merchant Center    Connected • Last successful sync
Meta Catalog              Connected • Last successful sync
[Queued 14] [Rejected 2] [Synchronized 12,492]
Item SKU      Marketplace    Google        Meta      Sale period
A-100        Approved       Pending       Synced    01–07 Nov
B-200        Approved       Rejected      Synced    —
[View error] [Retry sync] [Open platform requirements]
```

Campaign selection admin-managed, no vendor-funded marketing or vendor ad wallets. Paid campaigns separate from catalog sync. Promo expiration automatically updates base price and channel feed.

## A05 — Recommendation governance
Placements, algorithm version, rule weights (relevance/popularity/availability), excluded categories, inventory freshness and aggregate impression/click/conversion metrics. Personalization toggle defaults to jurisdiction-appropriate consent. `Preview results` filtered by market without exposing buyer identity.

## A06 — Order failure console
For each case show parent order, vendor order, shipment, payment, warehouse location, timeline, customer-visible state, financial exposure, reversible proposed actions, and last backend error. Admin's manual intervention requires reason and audit; financial resolution uses finance service.

## UX behavior
- Batch actions show count, filter scope, estimated impact, and require explicit confirmation.
- Any change to commission, warehouse fee rules, taxes, payout windows or integrations requires a permission check and change log.
- Operation result states `Requested`, `Queued`, `Applied`, `Failed`, `Needs review`, not one generic success toast.
