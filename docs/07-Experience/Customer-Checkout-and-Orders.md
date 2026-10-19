---
tags: [customer, checkout, ux]
status: design-spec
---
# Customer — Checkout, Order Details, Returns

## Routes
`/[locale]`, `/[locale]/search`, `/[locale]/products/[slug]`, `/[locale]/cart`, `/[locale]/checkout`, `/[locale]/account/orders/[uuid]`, `/[locale]/account/returns/[uuid]`, `/[locale]/account/messages`, `/[locale]/track-order` (guest verification gated).

## Checkout screen
**Top:** locale selector, delivery location, trusted/secured checkout cues.
**Step 1:** products grouped by seller with offer, quantity, stock, per-offer discount, fulfillment method, available shipping/delivery estimates.
**Step 2:** shipping address, independent shipments/slot selection and customer-visible delivery charges if applicable.
**Step 3:** COD + online payment radios. COD available only when all offers meet product-level COD toggle AND admin-approved vendor policy AND destination/carrier eligibility. Mixed cart defaults to online-only with contextual explanation, optionally separate orders later.
**Step 4:** immutable checkout quote (items, tax, shipping, coupon, final price, currency), place order with idempotency key.
**Validation:** recheck stock/price/offer status/COD before commit; show changes and request customer acknowledgment.

## Order details layout
Header: human-readable order #, random UUID route, placed date, summary, status, support action.
Payment: online payment status OR COD collection/remittance per package as customer-appropriate; don't reveal internal payout terms.
Content: one parent order with independent vendor order cards, each shipment timeline and track link, product image, price, promo snapshot, returns/cancel eligibility.
Primary actions: Track Package, Download Invoice, Contact Seller, Request Return, Report Issue.
Unboxing notice (confirmation, shipped and delivered): 'Consider recording a continuous unboxing video showing sealed packaging and contents. Helpful for investigating problems; not required to file a valid claim.' Accessible and localized.

## Cancellation / partial order
Cancel eligible quantities only; refund estimate itemized. Vendor A delivered and Vendor B cancelled must show partial completion without marking entire parent order failed. Any payouts delayed only for impacted seller order.

## Guest access
No private content by UUID alone. Use short-lived single-purpose verified email access or OTP; rate-limit; audit verification; no long-lived tokens in analytics/referrers. Cache-Control private/no-store.

## Acceptance
- Single parent order, independent vendor shipments and partial failures.
- Unauthorized UUID yields no private data.
- Customer language changes while cart remains intact.
- Tracking + COD events do not incorrectly imply the marketplace has received cash.
