---
tags: [screens, vendor]
---
# Vendor Workspace — Screen Specs

## V01 — Vendor home
Header: Store status, actionable alerts, orders requiring dispatch, inventory health, active discounts, expected earnings and payout holds. Vendor sees **only own orders and own financial values**.

Cards: `Orders to ship`, `Awaiting warehouse inbound`, `Delivery exceptions`, `Commission earned by platform`, `Vendor net payable`, `Scheduled promotions`, `Catalog sync errors`. Distinguish `available` from `pending` and `held` balances.

## V02 — Offer editor and discount schedule

```text
Product: Brand / Model / Condition
Offer price [¥____]  Inventory [____]
Fulfillment [Platform] [Vendor]   Stock source [Warehouse/Own]
Promotion
  Standard price [¥____]   Sale price [¥____]
  Starts [date + timezone]   Ends [date + timezone]
  Discount preview: 20% OFF
  Who funds discount? Vendor (fixed)
  [Save Draft] [Submit for Approval]
Sync: Marketplace [Approved]  Google [Pending]  Meta [Pending]
```

Validation: sale < regular price, valid scheduling and timezone, inventory/market eligibility, no retroactive date; backend rechecks on commit. New product and promotion are not instantly guaranteed paid ads.

## V03 — Vendor order detail
Top: order ID, fulfillment method, order status, payout status. Product list, time slot if applicable, assignment, delivery events and customer info scoped to fulfillment need.

**Earnings card (must be visible, not hidden in reports):**

```text
Final discounted item total    ¥1,000
Commission (10%)                -¥100
Platform delivery cost          -¥150 (estimated/final)
-------------------------------------
Net vendor earnings              ¥750
Payout status                   Pending
[View full deduction audit]
```

For vendor fulfilled, platform delivery deduction must be ¥0. If delivery estimate changed, display old estimate and an auditable adjustment, never silently overwrite.

Actions by status: `Accept`, `Pack`, `Mark ready for pickup`, `Enter tracking` (vendor fulfilment); `Create inbound transfer`, `Print transfer label`, `View warehouse receipt` (platform fulfillment from vendor stock). Suspected loss → `Report incident`, not `Mark delivered`.

## V04 — Earnings and payout statements
Tabs `All transactions`, `Pending`, `Held`, `Available`, `Paid`, `Adjustments`. Table columns: reference, vendor order, sale, commission, platform delivery deduction, adjustments, vendor net, eligibility date, payout ID.

Filter by date/status/order; click row to see underlying ledger transaction and evidence. Download statement; show last sync timestamp and dispute hold reason. No manual withdrawal button unless payout policy enables it.

## V05 — Inbound transfer creation
Select items and quantities with vendor stock check → destination warehouse → tracking method → print transfer manifest → ship → see in transit → warehouse scans receipt → discrepancy/case screen.

Show lost/damaged/rejected units separately from accepted sellable units. Vendor cannot mark warehouse receipt themselves.

## Mobile
Vendor nav becomes tabs/drawer; orders use compact cards and a bottom primary action. Earnings breakdown remains readable at 320px (no horizontal overflow). Use a confirmation sheet for irreversible order transitions.
