---
tags: [module, customer-experience]
priority: mixed
---
# Adjacent Customer Features (Previously Agreed)

These complement the seven current build features. They should share existing identity, catalog, orders, promotions, notification, finance and seller offer models instead of duplicating them.

| Feature | Customer UI | Vendor/Admin UI | Persistence | Key guarantee |
|---|---|---|---|---|
| Buyer-seller messaging | `/account/messages` thread with context | `/vendor/messages`, moderated case access | `messaging.conversations/messages/participants` | Cross-vendor isolation and abuse reporting |
| Dispute center | `/account/disputes` case and evidence | Vendor response; support decision | `disputes.cases/events/evidence` | Only authorized refund workflow moves money |
| Seller comparison | Product `Compare Sellers` | Offer editor, product matching moderation | `catalog.catalog_products/product_variants/seller_offers` | Compare the *same exact variant/condition* |
| Return/exchange | `/account/returns` | Vendor return tasks; admin inspections | `returns.requests/items/inspections` | Item-level quantity and refund caps |
| Vouchers | Apply during checkout | Vendor-funded coupon controls | `promotions.vouchers/rules/redemptions` | Atomic quotas and item-level funding allocation |
| Seller promotions | Discounted offers with end time | `/vendor/promotions` | `promotions.campaigns/campaign_offers` | Vendor funds own discount, not advertising |
| Loyalty | `/account/rewards` | Admin loyalty policy | `loyalty.accounts/points_entries` | Append-only entries; refunds reverse points |
| Personalization | Recommended products + preference toggle | Admin ranking | `recommendations.*` | Consent, catalog eligibility and privacy |
| Product Q&A | Product detail questions | Vendor verified answer and moderation | `questions.questions/answers/reports` | Product vs seller-specific answers labeled |
| Wishlist alerts | Price drop/restock opt-in | Admin delivery health | `alerts.subscriptions/deliveries` | Deduplicate and cooldown notifications |

## UX rules
- Refund/return and dispute actions must link to a specific item/vendor order, not infer from parent order.
- Vendor never accesses another seller's customer messages or personal browsing history.
- Coupon and loyalty redemption are both included in checkout pricing engine with well-defined stacking and refund reversal.
- Internal promotion-price schedule triggers the same advertising catalog sync described in [[04-Modules/08-Ads-Promotions-and-Catalog-Sync]].
- Seller comparison prices must include correct seller offer, shipping handling and condition.

## Deferred detailed implementation
Do not treat this table as executable DDL. Deep CRUD, migration and API work for each adjacent module needs separate vertical-slice tasks once P0 finance, shipping, stock and recovery dependencies are working. Extend this vault module-by-module and keep foreign keys stable.
