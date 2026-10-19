---
tags: [admin, warehouse, finance, ux]
status: design-spec
---
# Admin, Warehouse and Finance — UI/UX

## Admin shell `/admin`
Sidebar: Overview, Vendors & Verification, Catalog Review, Product Media Quality, Orders & Exceptions, Fulfillment Configuration, Warehouses, COD Approvals, Payments, Settlements, Taxes & Invoices, Marketing & Ads, Translations, Search, Recommendations, Notifications, Support, Audit & Security.

### Operational overview
Cards: pending vendor approval, rejected media, unfulfilled orders, COD remittance gap, payment exceptions, inventory imbalance, payout holds, external catalog sync failures. Drill-down to auditable queue. Filter by market, seller, channel and date.

### COD approval `/admin/vendors/[id]/cod`
Identity and carrier/remittance evidence; approve/reject/suspend; approval notes; affected offer count; dual-control for sensitive exceptions; status history. No approval from UI alone without signed server decision.

### Catalog / media review
Original and processed images side-by-side, quality dimensions/exposure/sharpness, duplicate warnings and moderation status, external channel eligibility and review decision.

## Warehouse shell `/warehouse`
Role-scoped location picker. Task-first interface, scanner-compatible, large touch targets, offline warnings (not silently writing stock offline), receiving discrepancy and damage capture.
- `/warehouse/inbound`: vendor transfer, expected SKU/lot/serial, accept/short/damage, proof photos, bin assignment.
- `/warehouse/inventory`: stock status and cycle counts.
- `/warehouse/pick`: scan pick list, validate exact location/lot/serial, partial pick exceptions.
- `/warehouse/pack`: package weight, labels, contents confirmation, transfer to carrier.

## Finance shell `/admin/finance`
- COD Reconciliation: courier collection lines, collected vs remitted, discrepancies, import reference, unmatched, matched, escalated. Individual collections per package/vendor order.
- Shipping Allocation: courier invoice vs estimate, shipment legs inbound/outbound, allocated per vendor order, variance approval. No double deduction.
- Payout Review: vendor net payable/held, proof of funds, tax and refund holds, approve batches via separate operator/approver, bank provider outcome; never mark PAID on timeout.
- Tax/Invoice Manager: legal issuer, tax rule version and effective date, issued immutable invoice, credit note instead of overwrites.

## Failure UX
Distinguish QUEUED vs ACKNOWLEDGED for external systems; MATCHED vs REMITTED for COD. Destructive actions show impact + reason + audit trail. Admin emergency pause never bypasses ledger consistency.
