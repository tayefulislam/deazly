---
tags: [module, advertising, promotions, integration]
priority: P1
---
# Adjacent Module — Google/Meta Advertising and Vendor Discounts

## Confirmed ownership
Marketplace bears **all** Google and Meta advertising cost, controls paid campaigns and budgets, owns channel connection credentials. Vendors pay **no ad fees** and do **not** have advertising wallets. Vendors may schedule and fund product discounts from their own selling price. Vendor commission remains 10% of the discounted sale price.

## Distinguish sync from paid delivery
- Catalog sync: every **approved and channel-eligible** seller offer should be synchronized, with price, stock, imagery, landing URL and scheduled discounted price.
- Paid ads: marketing admin selects eligible offers/campaigns and authorizes platform budgets. Being in catalog does not guarantee ad delivery or sale annotation.
- Google Merchant Center, Google Ads, GA4 and Meta Catalog, Meta Pixel + Conversions API are separate integrations with distinct responsibilities.

## UI
Vendor offer screen shows `MARKETPLACE_APPROVED`, `GOOGLE_PENDING/ACCEPTED/REJECTED`, `META_PENDING/ACCEPTED/REJECTED`, last sync, and reasons. Admin Marketing page shows connected accounts, error queue, product coverage, promo calendar, budget policy and campaign selection.

## Tables (`advertising`)
`connections(id,provider,external_account_id,status,credential_secret_ref)`, `catalog_items(id,offer_id,provider,external_product_id,sync_status,last_synced_at,last_error_code)`, `sync_jobs(id,offer_id,provider,kind,version,idempotency_key,state)`, `promotion_mappings(id,promotion_id,provider,external_promo_id,status)`, `campaigns(id,provider,external_campaign_id,budget_owner,status,selection_rule,approved_by)`, `campaign_offer_rules(id,campaign_id,offer_id?,category_id?,vendor_id?,eligibility_status)`.

## Event reactions
`OfferApproved`, `OfferPriceChanged`, `StockBecameAvailable`, `StockDepleted`, `PromotionScheduled`, `PromotionActivated`, `PromotionExpired`, `OfferDisabled`, `VendorSuspended` -> enqueue latest desired catalog state per offer/provider. Coalesce superseded queued updates, but preserve audit versions.

## Timed sale logic
Regular price ¥50,000; vendor sale price ¥40,000 for Nov 1–7 as example. Pricing engine is authoritative. Send suitable effective date data to Google when applicable; update Meta catalog price/sale fields according to channel spec and scheduling support. Reconcile catalog observations after start/end. A temporary lag must be surfaced and unsafe promo-specific creative should be excluded at expiry.

## Validation and failures
Enforce identical price at landing/checkout, supported currency/market, image quality, accurate condition/availability, channel policy eligibility and consistent offer IDs for tracking. Use retries with exponential backoff and channel rate limits; record accepted/rejected from platform separately from transmission success. No vendor secrets in browser; consent-aware conversion tracking. Campaign expense never touches vendor payable.

## Acceptance
- [ ] Vendor discount affects order total/commission correctly.
- [ ] Promotion start and end re-sync catalogs.
- [ ] Out-of-stock or suspended offers get excluded/updated.
- [ ] Catalog sync doesn't create unauthorized paid campaigns.
- [ ] Channel rejection clearly visible in admin dashboard.
- [ ] Meta browser/server purchase events deduplicate by shared event identity.
