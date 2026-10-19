---
tags: [ui, ux, design-system, navigation]
status: design-spec
---
# UI/UX Master Plan

## Experience principles
- Accessible, clean light-theme marketplace, restrained accents, mobile-first, WCAG-aligned contrast/focus/labels.
- Customers see **one** checkout and parent order; grouped packages and statuses by seller. Do not expose internal commission or other sellers' private data.
- Vendors see **only their own** products, stock, orders, settlement deductions, COD eligibility, and fulfillment steps.
- Admins see audits, exceptions, reviews, approvals, catalogs and marketing budget controls. Warehouse staff see assigned operational tasks; finance staff see reconciliation and payout approval.
- Responsive: 360 / 390 / 768 / 1024 / 1440px. On narrow view replace tables with compact cards, sticky primary action, and progressive disclosure.
- All routes locale-prefixed where appropriate; locale switch retains canonical product/cart/order context. Currency selection and language selection are independent.

## Visual tokens — proposal
| Token | Value | Usage |
|---|---|---|
| Background | `#F8FAFC` | App shell |
| Surface | `#FFFFFF` | Panels and cards |
| Text | `#0F172A` | Primary |
| Muted | `#64748B` | Secondary |
| Primary | `#2563EB` | Actions and navigation |
| Success | `#15803D` | Completed and verified |
| Warning | `#B45309` | Pending/attention |
| Danger | `#B91C1C` | Failed / destructive |
| Border | `#E2E8F0` | Dividers |
| Radius | 12px | Cards / inputs |
| Space | 4px scale | 4 / 8 / 12 / 16 / 24 / 32 |

Fonts: UI system sans with appropriate Japanese/Indonesian fallbacks; avoid truncating Japanese labels; RTL extension readiness if added later.

## Common component library
`AppShell`, `LocalizedHeader`, `LanguageSwitcher`, `GlobalSearch`, `ProductCard`, `OfferComparison`, `PriceWithSale`, `SellerBadge`, `FulfillmentMethodBadge`, `CODStatus`, `OrderStatusTimeline`, `PackageGroup`, `MoneyBreakdown`, `ImageUploader`, `QualityReport`, `MediaModerationStatus`, `InventoryTable`, `TransferStepper`, `AuditTimeline`, `NotificationInbox`, `PermissionGate`, `DataTable`, `EmptyState`, `ErrorState`, `ConfirmDialog`, `Toast`, `LoadingSkeleton`.

## UX states for every page
Loading/skeleton; empty with education and action; success; field errors; denied; partial result; stale data; network retry; action queued; cancelled/refunded; keyboard and screen reader UX. Show authoritative platform state rather than optimistic external success.

## Main role designs
- [[07-Experience/Customer-Checkout-and-Orders]]
- [[07-Experience/Vendor-Seller-Center]]
- [[07-Experience/Admin-Warehouse-Finance]]
- [[07-Experience/Product-Images-and-Quality]]
- [[07-Experience/Localization-and-Search]]
- [[07-Experience/Notifications-and-Email]]
- [[07-Experience/Marketing-and-Recommendations]]
- [[07-Experience/Screen-Wireframes]]
