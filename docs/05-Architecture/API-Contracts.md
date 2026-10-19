---
tags: [api, rest, contracts]
---
# API Contracts and Response Conventions

## General
Prefix `/api/v1`; OpenAPI generated from NestJS DTOs; Zod/shared contracts for frontend. Authenticated role checks and scoped ownership on all private resources. Cursor pagination `?limit=30&cursor=...`; request IDs; RFC7807-like error shape; `Idempotency-Key` header for all stateful financial/inventory actions. UTC ISO timestamps plus display timezone.

## Consistent success response

```json
{
  "data": {
    "id": "<uuid>",
    "status": "PENDING"
  },
  "meta": {
    "requestId": "<trace-id>",
    "version": 1
  }
}
```

## Error response

```json
{
  "type": "https://example.invalid/errors/STOCK_INSUFFICIENT",
  "title": "Stock unavailable",
  "status": 409,
  "code": "STOCK_INSUFFICIENT",
  "requestId": "<trace-id>",
  "detail": "The selected offer no longer has sufficient stock."
}
```

## High-risk request/response examples

### POST /api/v1/warehouse/transfers/:id/receipts

```json
{
  "receiptLines": [
    { "transferLineId": "<uuid>", "acceptedQty": 7, "quarantinedQty": 1, "serials": ["S001"] }
  ],
  "operationId": "<unique-client-operation-id>"
}
```
Returns `receiptId`, accepted/quarantined counts and `DISCREPANCY` when mismatched. Validate totals against physically dispatched quantities.

### POST /api/v1/orders/:id/cancellation-requests

```json
{
  "reason": "CUSTOMER_CHANGED_MIND",
  "items": [{ "orderItemId": "<uuid>", "quantity": 1 }]
}
```
Returns `requestId` and eligibility status, **not** a guaranteed immediate refund.

### GET /api/v1/vendor/orders/:id/settlement

```json
{
  "data": {
    "currency": "JPY",
    "finalProductSaleMinor": 1000,
    "commissionRateBps": 1000,
    "commissionMinor": 100,
    "platformDeliveryDeductionMinor": 150,
    "vendorPayableMinor": 750,
    "deliveryCostStatus": "FINAL",
    "settlementStatus": "PENDING"
  }
}
```

### POST /api/v1/finance/cod/reconcile

```json
{
  "remittanceBatchId": "<uuid>",
  "matchMode": "STRICT_REFERENCE_AND_AMOUNT",
  "dryRun": true
}
```
Returns match/exception preview; a distinct commit call with maker-checker permission finalizes.

### POST /api/v1/finance/payout-batches/:id/approve

```json
{
  "reason": "Approved after COD reconciliation",
  "expectedVersion": 3
}
```
Maker and approver must be separate; returns acceptance/processing state rather than pretending bank transfer succeeded.

## Frontend error categories
401 -> login/auth flow; 403 -> permission; 404 -> safe not found; 409 -> concurrency/state conflict with refresh; 422 -> field errors; 429 -> retry delay; 5xx -> correlation ID and safe retry (no double-charge). Never expose raw SQL/stack traces.

## Source of truth
Detailed per-module endpoints live in [[04-Modules/01-Multi-Warehouse]], [[04-Modules/02-Taxes-and-Invoices]], [[04-Modules/03-Order-Cancellation-and-Recovery]], [[04-Modules/04-Vendor-Payouts]], [[04-Modules/05-Shipping-Allocation]], [[04-Modules/06-COD-Reconciliation]], [[04-Modules/07-Recommendations]].
