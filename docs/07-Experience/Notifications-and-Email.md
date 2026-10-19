---
tags: [notifications, email, ux]
status: design-spec
---
# Central Notifications, Emails and Unboxing Reminder

## Recipients / channels
Customer, vendor, admin, warehouse, finance. Transactional email + in-app; future SMS/push. Template locale `en`, `ja`, `id`. SES/Resend provider abstraction, authenticated delivery-status webhooks, bounce/complaint suppression, outbox/BullMQ, retries and idempotency.

## Critical event mapping
- `ParentOrderConfirmed`: ONE customer confirmation with grouped vendor order items, relevant invoice/receipt details.
- `VendorOrderCreated`: vendor-specific new order only; no other vendor information.
- `ShipmentDispatched`/`OutForDelivery`/`Delivered`: recipient customer, distinct per package.
- `CODCollected`/`CODRemitted`/`CODReconciled`: only relevant operational/finance/vendor notifications; do not misstate remittance as delivery.
- `ReturnOpened`, `RefundCompleted`, `DisputeResolved`, `PayoutConfirmed`, `WarehouseTransferReceived`, `MediaReviewFailed`, `SaleStarted`, `SaleEnded`.

## Unboxing reminder
Customer order details show notice on confirmation and shipment timeline; optional reminder on dispatch and out-for-delivery, deduped by `(shipment_id, notice_type, channel)`. Message: 'Before opening your package, consider recording a continuous video of sealed parcel, label and contents to help investigate issues. This is optional and is not a prerequisite for legitimate returns or refunds.' Evidence uploaded only through authenticated private return/dispute flow.

## Admin screen
`/admin/notifications`: templates, versions, locale preview, preference policy, delivery status, provider webhook status, suppressions, retry eligible failed delivery. Separate transactional notices and consented marketing newsletters.

## Security / privacy
Least-privilege recipient determination server-side, no cross-vendor leakage, don't log email bodies or private tokens, avoid sensitive URL tracking. Consent for marketing; suppress bounced addresses according to provider policy. Provider acceptance is not proof of inbox delivery.
