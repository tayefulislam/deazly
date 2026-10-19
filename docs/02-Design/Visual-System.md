---
tags: [design, tokens, components]
status: approved-direction
---
# Visual System — Marketplace UI/UX

## Design direction
**Bright, premium, clean, white-first**, modern e-commerce aesthetic. Original design distinct from Daraz or any existing marketplace. Easy to scan on phones, high-contrast totals in vendor finance, dense-but-readable operational tables for staff. Support English, Japanese and Indonesian. Do not build neon or dark-default dashboards.

## Token proposal (Tailwind CSS variables)

```css
:root {
  --bg: #f7f9fc;
  --surface: #ffffff;
  --surface-subtle: #f1f5f9;
  --text: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --brand: #155eef;
  --brand-hover: #0049c7;
  --success: #087f5b;
  --warning: #b45309;
  --danger: #b42318;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --shadow-card: 0 8px 30px rgba(15,23,42,.045);
}
```

Spacing 4px base, content max width 1440px, operational sidebar 248px; dashboard page margins 32px desktop / 16px mobile. Minimum target size 44×44px; responsive widths: `<640`, `640–1023`, `>=1024`. Use semantic status colors **with text labels**. Typography: system sans or hosted licensed font, body 14–16px, heading 24–32px, currency totals 24–34px. JPY as whole-yen, grouping separators, locale-aware `Intl.NumberFormat`.

## Core components

| Component | Variants | Core behavior |
|---|---|---|
| `AppShell` | customer/vendor/admin/warehouse/finance | Role-scoped navigation, mobile drawer, breadcrumbs |
| `DataTable` | dense/comfortable | Sorting, server pagination, filters, columns, skeleton/empty states |
| `StatusBadge` | positive/warning/negative/neutral | Text + color + accessible tooltip |
| `MoneyBreakdown` | compact/full | Sale, discount, tax, commission, delivery allocation, vendor net |
| `OrderTimeline` | horizontal/vertical | Timestamp, actor, state, exceptions, shipment grouping |
| `FulfillmentBadge` | platform/vendor | Detailed stock and shipping responsibility tooltip |
| `WarehouseStockCell` | available/reserved/inbound/quarantined | Prevent confusing in-transit with sellable |
| `InvoicePreview` | invoice/credit-note | Immutable document and version reference; download |
| `ReconciliationDiff` | COD/shipping/payout | Expected, observed, delta, reason, resolution |
| `RecommendationGrid` | home/product/cart | Only eligible current offers, with seller and price |
| `ConfirmActionDialog` | reversible/irreversible | Reason input where needed; double confirmation on money-moving actions |
| `AuditDrawer` | financial/stock/admin | Actor, previous/new state, timestamps, correlation IDs |

## Form behavior
- Show required labels, descriptions and validation near fields; do not rely only on toast.
- Financial actions display currency, exact amount and recipient before confirmation.
- Always show status of *estimated* versus *finalized* delivery costs.
- Unsaved changes warning for campaigns, price edits, tax configs, and shipment allocations.
- Empty state includes a clear safe next step; errors have retry paths and correlation IDs.
- Skeleton for loading; no infinite spinner on essential workflows.
- Keyboard focus visible; dialogs trap focus; tables have caption/accessible headers.

## Language / content
- Keys not hardcoded into JSX; use localized dictionaries and ICU plural handling.
- Japanese labels may wrap. Avoid widths fixed to English copy.
- Dates in user's locale with visible warehouse/merchant timezone for deadlines.
- Status messages must say if change is saved internally, sent to channel, or confirmed externally.

## Example design content
All demo figures (¥1,000, ¥100, ¥150, ¥750) are illustrative; no fake ratings, delivery ETA or advertising approval claims in production UI.
