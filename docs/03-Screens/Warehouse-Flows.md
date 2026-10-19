---
tags: [screens, warehouse, inventory]
---
# Warehouse Console — Receiving, Stock, Transfer and Fulfillment

## W01 — Goods receiving workbench

```text
Inbound #INB-0142   Vendor A    Expected: 10 laptops
[Scan barcode/serial] [Input manual code (authorized)]
Scanned 8 / 10
Accepted 7  |  Quarantined 1  |  Missing 2
Serial       Expected     Inspection       Action
S001         Yes          Good             Accept
S002         Yes          Damaged          Quarantine
[Save partial receipt]  [Finalize with discrepancy]
```

Scan validates `warehouse_id`, transfer ID, SKU/offer and serial uniqueness. A mismatched serial is stopped for review. Only accepted available inventory can be reserved for sale. Finalization records employee and evidence; mismatch generates incident.

## W02 — Stock ledger and transfer
Filters: warehouse, zone/bin, vendor, offer, serial, condition. Show `on hand`, `reserved`, `available`, `in transit`, `quarantine`, `damaged` separately. Stock movement detail has source/destination and operation ID.

Transfer flow: create → reserve source → pick → dispatch → in transit → destination receive → reconcile missing/damaged → close. Destination must not show received quantity as available before receipt commit.

## W03 — Pick/pack/dispatch
1. Generate pick tasks by shipment/priority and assigned warehouse.
2. Worker scans bin/product/serial; mismatch disallows pick.
3. Pack verification shows order items and parcel weight/dimensions.
4. Carrier booking produces label/tracking reference.
5. Courier handoff scan moves package to dispatched; event emits for customer tracking.
6. Error screen permits authorized reallocation / lost item investigation, not fictitious shipped status.

## Operational UX
Large scan field with keyboard and hardware-scanner focus. Support repeated scanning without page reload. Sound is optional; never the sole confirmation. Optimistic client counts **cannot** substitute PostgreSQL stock transactions. Offline mode is excluded initially; if introduced later, queued scans are not authoritative until server conflict checks.

## Staff permissions
Operators receive/count/pick within assigned warehouses. Managers adjust quantities, close discrepancy and reassign tasks. Every adjustment requires reason code, quantity, before/after and audit trail.
