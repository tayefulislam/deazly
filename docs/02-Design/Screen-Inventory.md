---
tags: [ux, screens, backlog]
---
# Screen Inventory and Required States

| ID | Screen | User | Primary CTA | Critical data / states |
|---|---|---|---|---|
| C01 | Marketplace homepage | Customer | View offer | Trending/recommended, sale badge, vendor |
| C02 | Product and compare sellers | Customer | Select offer | Offer-specific price, condition, delivery |
| C03 | Checkout | Customer | Place order | Multi-vendor split, tax, shipping, payment, disclosures |
| C04 | Order details | Customer | Track, return | Parent/vendor order, each shipment and invoice |
| C05 | Return/cancel request | Customer | Submit request | Reason, eligibility, item quantity, refund estimate |
| V01 | Vendor dashboard | Vendor | Manage orders | Today's sales, pending dispatch, payable/held amounts |
| V02 | Offer editor / sale schedule | Vendor | Save / submit | Effective prices, approval, Google/Meta sync status |
| V03 | Vendor order details | Vendor | Dispatch / resolve | Money breakdown, method, shipment timeline |
| V04 | Earnings & payouts | Vendor | View statement | Commission/delivery deduction, pending/paid |
| V05 | Warehouse inbound transfer | Vendor | Create inbound | Source, target warehouse, parcel tracking |
| A01 | Operations overview | Admin | Review exception | Alerts, shipments, failure queue |
| A02 | Fulfillment settings | Admin | Configure policy | Cost payer, warehouses, estimated charges |
| A03 | Tax & invoicing settings | Admin | Publish tax rule | Effective dates, registration, audit trail |
| A04 | Marketing catalog sync | Admin | Retry sync | Google/Meta item states, sale effective dates |
| W01 | Receiving workbench | Warehouse | Scan / accept | Expected/actual, serials, damaged/quarantine |
| W02 | Stock & transfer | Warehouse | Move stock | Location, custody, available/reserved/in transit |
| W03 | Pick/pack/dispatch | Warehouse | Confirm handoff | Barcode, pick validation, label, courier |
| F01 | COD batch reconciliation | Finance | Match / flag | Collected/remitted/difference/proof |
| F02 | Settlement and payout | Finance | Approve batch | Reconciled, held, release, two-person approval |
| F03 | Shipping allocation review | Finance/Admin | Finalize allocation | Actual vs estimate, per-vendor distribution |
| A05 | Recommendation manager | Admin | Publish strategy | Eligible products, placement, results, opt-outs |

## State completeness checklist — EACH screen
`loading` · `empty` · `success` · `validation error` · `permission denied` · `offline/retry` · `partial completion` · `stale data` · `screen reader labels` · `mobile layout`.

## Design review rules
- Financial and inventory screens must have both **summary** and **detailed audit trail**.
- Changes to external advertising platforms must display `QUEUED`, `SENT`, `ACKNOWLEDGED`, `REJECTED`, etc., not simply `LIVE` after sending an API call.
- Separate estimated delivery cost and finalized carrier invoice amount.
- Customer sees amounts paid, not internal platform commission and vendor margin.
- Vendor sees its commission and platform delivery allocation; never another vendor's data.
