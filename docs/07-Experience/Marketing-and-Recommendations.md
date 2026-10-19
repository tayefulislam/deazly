---
tags: [marketing, recommendations, ux]
status: design-spec
---
# Platform-Funded Ads, Sales and Recommendations

## Confirmed economics
Platform pays Google and Meta advertising bills. Vendors do not pay ad fees; 10% sales commission only (plus platform-fulfilled eligible delivery cost deduction). Vendor promotion discounts reduce vendor selling price and commission basis.

## Google/Meta workflow
Approved product/offer → eligibility → outbox sync → Google Merchant Center/Meta Catalog. Updates for stock, media, availability, price, timed `sale_price`, expiry. Google/Meta product IDs stable and matched to offer-specific landing pages. Vendor cannot create paid campaigns or consume platform budgets. Admin chooses eligible catalog product sets and creates/pauses platform-funded ads; catalog synchronization is not paid ad creation. Show PENDING/ACCEPTED/REJECTED/retry statuses. Advertising account eligibility and policy checks vary by market.

## UI
Vendor promotions: offer → regular/discounted price → exact start/end in zone → preview buyer-visible price → submit → review → external sync status. Admin marketing screen: channel connections, sync failures, campaign selections, budget, attribution, consent tracking diagnostics.

## Initial recommendation rules
1. Similar Products: category/brand/attributes/price-band candidates.
2. Trending: rolling 24h/7d permitted views/carts/qualifying purchases with dedup and bot resistance.
3. Frequently Bought Together: eligible co-purchases from parent orders spanning multiple vendors, adjust for cancellations/refunds.

Canonical product first, then resolve eligible seller offer. No duplicate product cards due to multi-vendor offers. Filter banned/unavailable listings at response time; fallback to related category if sparse. Home 'Trending', product 'Similar/FBT', cart 'Frequently Bought Together'; personalized ML deferred. Admin recommendation manager controls strategies/exclusions and sees CTR/conversion/coverage/vendor diversity metrics. Do not allow vendors to buy recommendation priority.
