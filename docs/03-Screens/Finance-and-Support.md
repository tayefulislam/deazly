---
tags: [screens, finance, support]
---
# Finance, COD and Support UX

## F01 — COD reconciliation workspace

```text
COD Batch #COD-2026-1101  Carrier Example
Expected collected: ¥120,000
Remitted:           ¥118,500
Difference:         -¥1,500  [Needs Review]
[Matched 24] [Missing 1] [Overpaid 0] [Disputed 1]
Order      Tracking     Collected      Remitted     Status
ORD-12     JP-...       ¥5,000         ¥5,000       Matched
ORD-18     JP-...       ¥1,500         ¥0           Missing
[Import carrier statement] [Match rows] [Flag exception]
```

Tabs: pending collections, unmatched collections, remittance batches, discrepancies, completed reconciliation. `Confirm receipt` only after bank/processor evidence or authorized physical-cash verification. Reconcile partial remittance without falsifying full payment.

## F02 — Payout batch builder
Filters: settlement available status, vendor verified payout method, cleared COD or online collection, return/dispute holds, currency and region.

Show summary `Gross sales`, `Commission`, `Delivery deductions`, `Refund/adjustments`, `Net vendor payable`, `Batch total`. Require **maker-checker**: creator and final approver are distinct authorized people for payout release. Provider response gets its own status; timed-out request becomes `UNKNOWN/REVIEW`, not automatically retried with a new external transfer ID.

## F03 — Shipping allocation review
Invoice scan and shipment legs; show which delivery leg, actual carrier bill, which vendor-order items participate, and allocation shares. Sum-of-allocations = chargeable amount (minus platform-funded share). Report mismatches and prohibit finalize until resolved.

## Support — Order exception / cancellation / return
Unified timeline from order, shipment, payment, COD, warehouse, return and dispute records. Support agent can propose resolution with reason/evidence; refund issuance requires payment policy approval. Customer personal info shown only to staff with legitimate case access. Audit all overrides.

## Screens responsive behavior
On desktop, use split list/detail workspace. On mobile, use searchable list → detail drilldown; never force financial reviewers to use a 12-column table on a phone. Keep high-risk approve controls separated from simple row navigation.
