---
tags: [module, tax, invoices]
priority: P0
---
# Module 02 — Taxes and Invoicing

## Legal dependencies
Who is seller-of-record and invoice issuer is **not yet decided**. Primary operating jurisdiction, whether listed prices include tax, local invoicing rules and seller tax registrations require legal/accounting review. Do not hardcode Japan tax rates or assume marketplace is the seller-of-record. Configuration can cover Japan-specific qualified invoices where applicable.

## Screens
Checkout tax display; buyer invoice download; vendor sales/tax summary; [[03-Screens/Admin-Flows|admin rate and invoice configuration]]. Invoice statuses `DRAFT`, `ISSUED`, `VOIDED_BY_CORRECTION` only by lawful mechanism; amendments through credit/debit notes.

## Entities (`tax` schema)
- `jurisdictions(id,country_code,region_code,tax_regime)`.
- `registrations(id,legal_entity_id,registration_no,valid_from,valid_to,status)`.
- `rate_versions(id,jurisdiction_id,tax_category,rate_fraction,effective_from,effective_until,policy_version)`.
- `tax_calculations(id,order_id,version,source_context_json,result_json,created_at)`.
- `invoices(id,document_no,issuer_legal_entity_id,buyer_id?,order_id,issued_at,currency,status,pdf_asset_id,snapshot_json)`.
- `invoice_lines(id,invoice_id,order_item_id?,description,qty,net_minor,tax_minor,gross_minor,rate_version_id)`.
- `credit_notes(id,invoice_id,document_no,refund_id,issued_at,reason,pdf_asset_id,snapshot_json)`.

## Data integrity
Unique invoice number scoped to legal issuer/series. Documents immutable after issuance. Corrections are linked documents, never mutation of historical price/tax records. Preserve applied rounding method and rate version, currency and line allocations. Validate all sums with integer minor units (or rigorous DECIMAL for tax intermediate values).

## API contract
- `POST /api/v1/checkout/tax-quote`: cart context, destination, fulfillment, tax categories; returns quote `expiresAt`, `taxVersion` and breakdown.
- `GET /api/v1/orders/:id/invoices`: customer owns order or relevant vendor has authorized issuer visibility.
- `GET /api/v1/invoices/:id/download`: short-lived signed access, entitlement checked; downloads immutable rendered file.
- `POST /api/v1/admin/tax-rates`: draft a new effective-dated version; separate permission to publish.
- `POST /api/v1/admin/credit-notes`: internal audited action linked to finalized refund.

## Workflow
Cart quote → validate price/tax snapshot at order confirmation → order settled as defined → invoice issued by correct legal entity → PDF stored in R2/S3 → customer access → refund emits `RefundCompleted` → eligible credit note issued and linked.

## Failure handling
Tax API/rule unavailable: block checkout in an affected market if valid tax can't be determined; no fallback guessed percentage. Invoice render job failure: keep `ISSUANCE_PENDING`, retry idempotently, never create new invoice number accidentally. Tax rules effective dates do not rewrite existing invoice.

## Acceptance
- [ ] Tax-inclusive and tax-exclusive cases testable per market.
- [ ] Issued invoice stays immutable after later price or tax rule change.
- [ ] Credit note references refund and original invoice.
- [ ] Customer cannot access another customer's invoice.
- [ ] Seller legal registration/issuer rules validated for market before go-live.
