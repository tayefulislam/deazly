---
tags: [architecture, events, reliability]
---
# Domain Events, Outbox and Failure Recovery

## Durable publication
State mutation and event insert must occur **within the same PostgreSQL transaction**. A dispatcher claims queued outbox rows, enqueues worker jobs, records delivery attempts. Workers are idempotent; external API calls are *at least once* and require provider-reference deduplication. BullMQ/Redis is not authoritative for payment, COD or inventory state.

```mermaid
sequenceDiagram
  participant UI as Next.js
  participant API as NestJS
  participant DB as PostgreSQL
  participant Worker as BullMQ Worker
  participant External as Carrier / Payment / Ad Channel
  UI->>API: Command + Idempotency-Key
  API->>DB: BEGIN; mutate + outbox; COMMIT
  API-->>UI: Accepted reference + status
  DB-->>Worker: Dispatcher publishes pending event
  Worker->>External: Idempotent operation
  External-->>Worker: Ack / timeout / error
  Worker->>DB: Store result or reconciliation-needed state
  Worker-->>UI: UI refresh/poll observes new state
```

## Event catalogue
`OfferApproved`, `OfferPriceChanged`, `PromotionStarted`, `PromotionExpired`, `StockReserved`, `StockReservationReleased`, `GoodsReceived`, `StockBecameAvailable`, `VendorOrderConfirmed`, `ShipmentDispatched`, `OrderDelivered`, `OrderCancellationAccepted`, `PaymentCaptured`, `RefundCompleted`, `CODCollected`, `CODRemittanceMatched`, `ShippingCostFinalized`, `SettlementAvailable`, `PayoutVerifiedPaid`, `InvoiceIssued`.

## Event envelope

```json
{
  "eventId": "<uuid>",
  "eventType": "ShipmentDispatched",
  "aggregateType": "Shipment",
  "aggregateId": "<uuid>",
  "aggregateVersion": 7,
  "occurredAt": "2026-10-19T00:00:00Z",
  "correlationId": "<uuid>",
  "payload": {"shipmentId": "<uuid>"}
}
```

## Important failure rules
- **Unknown external transfer:** reconcile by provider reference before retrying.
- **Duplicate webhook:** enforce external event ID/unique hash + inbox deduplication.
- **Out-of-order event:** compare aggregate versions and fetch current source state.
- **Promotion activation fails:** website price remains authoritative; catalog sync status shows failure and alerts marketing.
- **Inventory reservation expires:** transactionally release quantity; don't mark order cancelled without checking current payment state.
- **Shipping invoice arrives late:** add financial adjustment and update vendor statement; no silent replace.
- **Refund after payout:** adjustment/recovery ledger; never delete paid payout history.
- **Dead-letter job:** visible admin queue with retriable vs requires-manual-review distinction.

## Alerts / metrics
Outbox age, worker retry rate, unresolved payout unknown state, COD unreconciled amount/day, warehouse stock discrepancies, invoice issuance lag, catalog rejection %, refund processing time, and abnormal negative vendor balances.
