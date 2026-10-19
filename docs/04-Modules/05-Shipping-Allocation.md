---
tags: [module, shipping, allocations]
priority: P0
---
# Module 05 — Shipping Charges and Allocation

## Business rules
- PLATFORM fulfillment: allocated platform-provided delivery cost is deducted from vendor share.
- VENDOR fulfillment: no platform delivery deduction for independently shipped orders.
- Vendor → warehouse inbound leg, failed delivery, RTO and returns liability are **open policy decisions**, see [[01-Product/Decision-Register]].
- Multiple vendors sharing one actual package cost must never be charged that full cost multiple times.

## Screens
Vendor order: estimated charge before fulfillment, final charge and adjustment item. Admin/finance allocation view: shipment legs and actual carrier invoice, allocation preview, mismatch flag, finalize button. Customer: only customer-facing shipping charges and delivery tracking.

## Entities (`fulfillment`)
`shipment_legs(id,shipment_id,leg_type,origin_id,destination_id,status)`, `shipping_quotes(id,shipment_leg_id,carrier_id,estimated_minor,currency,expires_at)`, `shipping_costs(id,shipment_leg_id,invoice_line_id?,actual_minor,currency,finalized_at)`, `shipping_cost_allocations(id,shipping_cost_id,vendor_order_id,allocated_minor,method,policy_version)`, `shipping_adjustments(id,vendor_order_id,previous_allocation_id?,amount_minor,reason,ledger_ref)`, `carrier_invoice_lines(id,carrier_invoice_id,tracking_ref,amount_minor,currency)`.

## Allocation algorithm
1. Determine eligible platform-provided **delivery legs** and vendor orders participating in each shipment.
2. Choose cost source: carrier invoice actual; estimate only pending finalization.
3. Determine policy-responsible amount (customer fee, platform share, vendor share are separate).
4. Allocate vendor-liable amount by selected versioned rule: direct line, billable weight, or other approved method.
5. Deterministic remainder distribution in whole minor units ensures exact sum equality.
6. Post allocation ledger entries once; subsequent actual-cost changes post adjustments, never replace historical allocation.

**Invariant:** `sum(vendor allocations) + platform-funded allocation + other authorized allocations = actual cost`. This is checked per cost line and currency.

## API
`POST /api/v1/checkout/shipping-quote`, `GET /api/v1/vendor/orders/:id/shipping-costs`, `GET /api/v1/finance/shipping/allocations`, `POST /api/v1/finance/shipping/allocations/:id/finalize`, `POST /api/v1/finance/shipping/adjustments`.

## Edge cases / tests
- [ ] Mixed shipment with two vendors and ¥300 carrier bill allocates exactly ¥300 total.
- [ ] Vendor-fulfilled shipments don't receive platform outbound delivery deduction.
- [ ] Two-leg shipment records inbound and outbound independently.
- [ ] Courier invoice delta produces an adjustment and clear vendor statement.
- [ ] Cancellation/return modifies liability only according to versioned policy.
- [ ] Currency mismatch blocked until authorized FX policy applies.
