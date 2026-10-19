---
tags: [i18n, search, ux]
status: design-spec
---
# Language Experience, Translation Workflow and Search

## Initial locales
`en`, `ja`, `id`; `bn` planned optional. Language switching in header/mobile settings and saved customer preferences. Locale is not currency. Next.js App Router via `next-intl`; locale-prefixed storefront routes; preserve canonical product/order/cart context.

## Content ownership
UI translation keys centrally managed; product/category/promotion content localized per canonical entity. Vendor may provide original-language text, machine-translation *drafts* for review; never silently publish unreviewed descriptions as certified. Status `MISSING` → `DRAFT`/`MACHINE_TRANSLATED` → `IN_REVIEW` → `APPROVED` → `PUBLISHED`. If missing, clearly label source-language fallback. Emails use customer preference and published template versions.

## Admin TMS `/admin/translations`
Search keys, choose locale, side-by-side source and target editor, glossary, reviewer, publish, revert, audit, missing count, CSV/JSON import/export. Vendors edit only own content translations, not global UI keys.

## Search matching
One canonical product indexed with localized titles, synonyms, brand/model, specs, categories and eligible offer summary. `laptop`, `ノートパソコン`, `notebook`, `komputer jinjing` may resolve to same canonical product via translations/curated aliases; avoid treating broad category terms as exact synonyms. Language-aware tokenization and typo tolerance; Meilisearch does not automatically translate queries. Search results localized in display language, with clearly indicated fallback.

## Search pipeline
Normalize/search query → index matching + curated synonyms → rank exact identifiers/title/attributes → exclude unavailable/unapproved/disallowed offers → deduplicate canonical products → resolve eligible seller offers/prices from authoritative backend → render localized cards. Search indexing updates via outbox/BullMQ; show stale/failure diagnostics to admin.

## UX acceptance
Locale switch never erases cart; one product regardless of translations or multiple vendors; search in a language different from display locale works when aliases/translations are indexed; generated SEO URLs and hreflang only for genuinely translated, indexable content.
