---
tags: [vendor, ux, dashboard]
status: design-spec
---
# Vendor Seller Center — Detailed UI/UX

## Desktop layout
Left sidebar (collapsible): Overview, Store & Verification, Products, Inventory, Orders, Fulfillment, COD & Payments, Discounts, Earnings, Returns/Disputes, Messages/Q&A, Analytics, Notifications, Staff & Settings. Sticky topbar: store switcher for multi-store staff if permissioned, search, language, bell, account. Main content: 12-column dashboard grid.

## Mobile layout
Header + bottom navigation: Home, Orders, Products, Earnings, More. Card layouts replace dense grids; menu drawer for remaining sections; sticky actions. All key amounts tabular aligned.

## Overview `/vendor/dashboard`
KPIs: today's finalized sales, new orders, to dispatch, low stock, COD approval, payout available/held, cancellations. Task queue priority: Awaiting acceptance → Dispatch needed → Warehouse inbound → Buyer issue → Settlement warning. Recent orders with vendor-only sub-order IDs. Sales trend charts when data exists; meaningful empty state for newly approved vendors.

## Products `/vendor/products` and `/vendor/products/new`
Wizard: (1) catalog search/match existing canonical product (2) seller offer data/SKU/condition/variants (3) images (4) price and schedule/vendor-funded discount (5) stock location/fulfillment method (6) COD toggle disabled until approved (7) localized content (8) review/publish. On approval, enqueue eligible Google/Meta catalog sync; show per-channel state, never 'ad live' automatically.

## COD `/vendor/payment-settings/cod`
Header status: NOT_REQUESTED, PENDING_APPROVAL, APPROVED, SUSPENDED, REJECTED. Request activation CTA; read-only approved courier terms, remittance status; list of offers with toggle, eligibility reasons. If not approved, toggles locked with explanatory text. Existing orders retain payment method.

## Orders `/vendor/orders/[uuid]`
Tabs: Overview, Fulfillment, Settlement, History, Customer Messages. Header: sub-order ref/status/payment & COD status; items and authorized delivery data. Settlement panel: post-discount item total → 10% commission → platform delivery allocation only if PLATFORM → net payable; estimated vs final clearly labeled. Steps depend on vendor/platform fulfillment; no other vendors' information.

## Inventory `/vendor/inventory`
Availability by SKU/vendor warehouse vs platform warehouse, reserved, inbound, in-transit, damaged; transfer creation to selected warehouse, barcode/serial and receipt detail, alerts. No cross-vendor inventory.

## Earnings `/vendor/earnings`
Balance cards: pending, held, available, processing, paid; statement export with item-level reference, commission, courier cost allocation, refunds/adjustments. Customer gross payment != payout. Date filters and invoice view.

## Discounts `/vendor/promotions`
Vendor-owned sale creation: percent/fixed discount, eligible offers, start/end date in IANA zone, price preview, status and Google/Meta sync tracking. Advertising paid only by platform, no vendor ad wallet or billing.

## Other screens
Returns/Disputes: evidence, deadlines, admin outcomes; Messaging/Q&A: vendor conversations; Analytics: own sales and returns; Staff: least-privilege role assignment; Notifications: transactional alerts and preferences.

## Acceptance
Customer cannot use vendor routes. A vendor staff member may use only explicitly granted permissions. COD is disabled until admin approval. Vendor cannot edit another vendor's offers or see its private order/settlement. Negative payout is flagged/held, not sent.
