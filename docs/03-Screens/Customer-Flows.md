---
tags: [screens, customer, mobile]
---
# Customer Screens and UX Flows

## C01 — Homepage and recommendation placements
**Top-to-bottom:** sticky search/header, categories, editorial hero, sale section, recommended for you (if consented), trending products, recently viewed (if allowed), vendor spotlight, footer.

Product tile anatomy: image with descriptive `alt`, product title (2 lines), current offer price, verified discount comparison only if valid, seller name, availability, fulfillment label, and card link. Do not claim guaranteed delivery dates without carrier estimate.

Recommendation fallback: if no consent or no history, show popular/seasonal items without personal tracking. Empty state: curated categories.

## C02 — Product detail and seller comparison

```text
[Gallery]  [Product title / specs]
           [Selected seller offer: ¥1,000, condition, warranty]
           [Shipping method and estimate]
           [Quantity] [Add to cart] [Buy]
           [Compare sellers ↓]
----------------------------------------------------------------
Seller       Price      Fulfillment      Stock      Select
Vendor A     ¥1,000     PLATFORM         8          [Choose]
Vendor B     ¥1,120     VENDOR           3          [Choose]
----------------------------------------------------------------
[Specifications] [Q&A] [Reviews] [Similar products]
```

- Price is **seller-offer specific**, not a global product price.
- On mobile, comparison renders as stacked seller cards; show product/condition and seller label in each.
- Show price promo effective end in selected timezone, and no inaccurate countdown when clock is unsynchronized.
- Selection updates checkout offer ID, not only visible label.

## C03 — Cart and checkout
Steps: cart → delivery address/pickup option → shipment/fulfillment grouping → payment → review totals → confirmation. For mixed vendors show vendor-order grouping and possible separate deliveries. Keep one parent order ID with multiple vendor sub-orders.

**Review panel:** products after vendor discount, tax presentation per market, customer-paid shipping fee if any, coupons, final customer payable. **Do not show vendor commission or internal delivery deduction in buyer checkout.**

COD field: explain who collects, whether eligible, and expected cash total. Respect admin-controlled checkout required fields. On payment timeout, show `PAYMENT_PENDING` and safe retry; never blindly recreate order.

## C04 — Order details

```text
Order ORD-10001 • Order Placed • [Download invoice]
Vendor A • Platform Fulfilled • Shipment SHP-1
  Awaiting warehouse → Picked → Courier → Delivered
Vendor B • Vendor Fulfilled • Shipment SHP-2
  Vendor Packing → Courier → Delivered
[Track shipment] [Request cancellation if eligible] [Request return]
Customer paid: item amount + applicable tax/shipping - discounts
```

Show each shipment timeline and the specific items in the package. Invoice and credit note belong to legal issuer determined by tax rules. Cancel button disabled with explicit reason after last eligible stage.

## C05 — Cancellation/return journey
1. Select vendor order item and quantity; remaining refundable quantity shown.
2. Select reason, optional photos, summary of expected refund and whether return shipping is needed.
3. Review cancellation/return eligibility and a clear no-guarantee notice if manual review.
4. Submit with idempotency key; show case/reference ID and current status.
5. Timeline includes vendor response, warehouse inspection, payment refund and appeal path.

**State messages:** `Requested`, `Awaiting review`, `Return label available`, `Received`, `Refund processing`, `Refunded`, `Rejected — dispute available`.

## Accessibility and localization
- Currency localized; language switch `en`, `ja`, `id` preserves route where possible.
- Never show only red/green to indicate a financial status.
- Disable actions with explanation and link to support.
- Mobile fixed bottom CTA only when it doesn't obscure content or browser navigation.
