---
tags: [wireframe, ui, ux]
status: design-spec
---
# Text Wireframes — UI Blueprint

> [!note] These are schematic layouts (not production screenshots). Apply [[07-Experience/UI-UX-Master-Plan]] tokens.

## Customer checkout — desktop
```text
┌ Header: Search | Locale | Account | Cart ────────────────────────────────┐
│ Checkout / Step 2 of 3                                              │
│ ┌ Delivery & Payments ────────────────────┐ ┌ Order Summary ───────────┐ │
│ │ Vendor A: laptop  PLATFORM             │ │ Product subtotal       │ │
│ │ Vendor B: mouse   VENDOR               │ │ Seller discounts       │ │
│ │ Vendor C: monitor PLATFORM             │ │ Shipping / tax         │ │
│ │ Delivery destination + split parcels   │ │ Total due              │ │
│ │ Payment ○ Online   ○ COD (eligibility)  │ │ [Place order]          │ │
│ └─────────────────────────────────────────┘ └────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```
Mobile: summary collapsible, Place Order sticky, payment explanation inline.

## Parent order detail
```text
#ORD-2026-001248 [Partially Shipped] [Support]
Paid/COD summary (customer appropriate)       [Invoice]
Vendor A [Shipped]   package A [Track] [Return]
Vendor B [Processing] package B [Messages]
Vendor C [Delivered] package C [Review]
[ℹ Consider recording an unboxing video; optional evidence]
```

## Vendor order detail
```text
Vendor #VORD… [Platform Fulfilled] [COD - Reconciled]
Items / warehouse / tracking
Final sale                   ¥1,000
10% platform commission       -¥100
Platform delivery cost        -¥150  (actual)
-----------------------------------
Vendor earnings                ¥750 [Held until eligibility]
[Timeline] [Messages] [Report issue]
```

## Product wizard
```text
Products > Add / Edit
[1 Catalog match] [2 Offer] [3 Images] [4 Price] [5 Fulfillment]
[6 COD] [7 Languages] [8 Review]
Images: [Upload zone] [Primary] [Reorder thumbnails]
Quality: Resolution ✓ | Blur ! | Duplicate ✓ | Overlay needs review
COD [disabled until approved]  Promotion 20% off [schedule]
[Save draft] [Submit for approval]
```

## Finance COD reconciliation
```text
COD Reconciliation  [Carrier] [Date] [Import remittance]
Collected | Remitted | Unmatched | Difference
Row: Shipment | Vendor Order | Expected | Collected | Remitted | State
[Select discrepancy] → [Review evidence] → [Resolve w/audit]
```

## Navigation / modals
All destructive actions need confirmation, reason and affected order breakdown. Screens have skeleton/error/empty/permission-denied states. Use tables only where enough width; mobile shows stacked cards.
