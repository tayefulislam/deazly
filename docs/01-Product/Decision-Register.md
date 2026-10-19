---
tags: [adr, decisions, open]
status: decision-required
---
# Policy Decisions and Safe Defaults

`CONFIRMED` is agreed in the conversation. `PROPOSED` is an implementation recommendation, **not** user approval.

| ID | Status | Topic | Safe configuration or proposed default |
|---|---|---|---|
| BR-01 | CONFIRMED | 10% commission on discounted sale | Rate bps = 1000, versioned, per order-item snapshot |
| BR-02 | CONFIRMED | Platform pays all ads | Vendor ad billing disabled |
| BR-03 | CONFIRMED | Vendor bears vendor-created discounts | Discount funding = VENDOR |
| BR-04 | CONFIRMED | Platform delivery deducted only for platform-fulfilled service | Vendor order shipment allocations |
| BR-05 | OPEN | Vendor → warehouse inbound freight | Separate cost, configurable `PLATFORM` or `VENDOR`; do not auto-deduct without policy |
| BR-06 | OPEN | Failed delivery / return-to-origin liability | Reason-based allocation with audited resolution |
| BR-07 | OPEN | Returns window / payout eligibility | Jurisdiction-aware configurable hold and return windows |
| BR-08 | PROPOSED | Payout cadence | Weekly once cleared and risk holds released |
| BR-09 | OPEN | COD on vendor-fulfilled delivery | Require marketplace-controlled cash remittance or explicit vendor collection contract |
| BR-10 | OPEN | Primary operating country and seller-of-record | Tax legal review before invoice and live checkout |
| BR-11 | OPEN | Customer-paid shipping | Separate quote from carrier expense and vendor deduction; configurable |
| BR-12 | PROPOSED | Warehouse inventory ownership | Vendor-owned consignment with auditable custody |
| BR-13 | OPEN | Taxes inclusive vs exclusive | Per market, product tax category and document version |
| BR-14 | OPEN | Commission rounding in JPY | Select and version a deterministic policy; require sum-of-lines reconciliation |
| BR-15 | OPEN | Negative vendor payable | Hold for review / carry-forward under explicit agreement; no silent debit |
| BR-16 | OPEN | Stripe/other gateway local availability | Gateway-by-country review; do not assume supported everywhere |

## Engineering handling for OPEN decisions
- Introduce typed policy configuration and effective-date versioning.
- Display policy label and estimated financial impact in the UI.
- Refuse irreversible automated actions when required policy is unconfigured.
- Cover alternatives with tests, but do not silently pick a fee payer or tax party.
- An admin policy change should not rewrite issued orders/settlements/invoices.

## Must verify before go-live
Accounting/tax counsel, carrier contracts, local payment gateway support, refund liabilities, seller agreement, payout permissions and data privacy requirements.
