---
tags: [product, finance, confirmed]
status: agreed
---
# Confirmed Marketplace Business Rules

| Rule | Behavior | System consequence |
|---|---|---|
| Marketplace | One shared marketplace website; many vendors | Shared customer cart, parent order and vendor orders |
| Commission | **10%** of *final discounted product selling price* | Immutable commission rate snapshot and item-level calculations |
| Vendor discount | Discount is borne by vendor | No platform subsidy by default |
| Advertising | Google/Meta ad costs borne by marketplace | Never charge vendor advertising fees |
| Catalog sync | Approved and eligible products, stock, prices, scheduled discounts sync automatically | Asynchronous channel status, retry, reconciliation |
| Paid ads | Marketplace controls which products get paid exposure, budgets | Catalog inclusion does not guarantee paid ad display |
| Platform Fulfilled (`PLATFORM`) | Platform handles dispatch, including from warehouse; deduct applicable platform delivery cost from vendor earnings | Distinct fulfillment and settlement records |
| Vendor Fulfilled (`VENDOR`) | Vendor handles dispatch/delivery; no **platform** delivery deduction | Vendor may bear its own carrier cost outside platform ledger |
| Warehouse model | Stock already in platform warehouse OR vendor sends after order | Consignment stock, inbound transfers, locations |
| Order details | Show transparent delivery deductions, 10% commission and vendor net | Immutable settlement breakdown with adjustments |
| Multi-vendor checkout | Parent order splits into vendor order(s); shipments can split independently | Model separate statuses and money per vendor order |
| Payment | COD and online payments supported | COD collected != COD remitted; reconcile before payout |

## Standard financial illustration — JPY, single vendor order

```
Final discounted product sale       ¥1,000
Marketplace commission (10%)         -¥100
Allocated PLATFORM delivery cost     -¥150
-------------------------------------------------
Vendor amount payable                 ¥750
```

For VENDOR delivery, platform delivery deduction is ¥0 and vendor payable is ¥900 before tax adjustments and refunds. Commission is **not calculated on delivery charges**.

**Important**: these are payout economics, not a tax accounting policy. Taxes, buyer delivery fees, shipping tax, refunds, disputes and gateway expenses require explicit separate ledger treatment. Advertising costs never appear as a vendor deduction.

## Price change and sale rules
1. Vendor submits offer or scheduled sale and accepts the discounted price.
2. Approval and eligibility policy runs.
3. The pricing engine calculates the authoritative effective selling price in the buyer's currency.
4. A price/promotion event triggers Google Merchant and Meta Catalog updates.
5. External catalog approval/latency is shown as a status, not mistaken for guaranteed ad delivery.
6. Order items snapshot actual paid price and pricing-rule versions.
7. On expiry, site returns to standard price and catalogs synchronize.

## Rules to protect
- Never deduct delivery twice, even if shipments merge vendors.
- Never let vendor staff view unrelated vendor stock, customer details, settlement or conversations.
- Never mark COD settled solely on delivery status.
- Never mark payout paid from a request timeout without bank/provider confirmation.
- Never use the current product price to recalculate an historical order.
- Never generate an invoice from mutable current tax rules for a past finalized transaction.

See [[01-Product/Decision-Register]].
