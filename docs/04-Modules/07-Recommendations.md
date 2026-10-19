---
tags: [module, recommendations, personalization]
priority: P2
---
# Module 07 — Advanced Recommendations

## Customer placements
`Recommended for you`, `Similar products`, `Frequently bought together`, `Trending`, `Recently viewed` (with appropriate consent). Seller offers resolved at request time so prices and stock remain current.

## Admin console
[[03-Screens/Admin-Flows|Ranking manager]] with placement filters, strategy version, pinned/excluded offers (clearly marked as promoted if relevant), experiment metrics and anonymous aggregate performance. Never make personalized recommendations with sensitive inferred traits.

## Entities (`recommendations`)
`interaction_events(id,user_id?,session_id,product_id,offer_id?,event_type,consent_state,created_at)`, `product_similarity(product_id,related_id,similarity,model_version)`, `candidate_scores(context_key,product_id,score,model_version,computed_at)`, `model_versions(id,strategy,parameters_json,created_at,active)`, `impressions(id,placement,request_id,product_id,shown_at,clicked_at?)`, `customer_preferences(user_id,personalization_enabled,updated_at)`.

## Staged algorithms
1. Phase 1: category similarity, product attributes, in-stock best sellers and trending windows.
2. Phase 2: frequently bought together from finalized, privacy-compliant aggregated order-item relationships.
3. Phase 3: personalized ranking with user consent and privacy rules; measure uplift via A/B test.
4. Later: embeddings/ML if enough data and ops maturity.

## Candidate filtering
Filter unpublished/out-of-stock offers, suspended sellers, product/channel restrictions, excluded categories, regional mismatch and buyer eligibility. Candidate product must resolve to a valid seller offer and price (with fulfillment method) before rendering.

## API
`GET /api/v1/recommendations/home?placement=&limit=`, `GET /api/v1/products/:id/similar`, `GET /api/v1/products/:id/frequently-bought`, `PATCH /api/v1/account/personalization`, `POST /api/v1/recommendations/feedback` (rate limited).

## Nonfunctional
Prevent recommendation endpoint from blocking checkout. Cache anonymous/trending candidates with short TTL. Fall back to deterministic related products when recommendation store unavailable. Set retention/aggregation limits for event streams. Guard client events from bot traffic.

## Acceptance
- [ ] Disabled personalization excludes user-based ranking, offers useful anonymous results.
- [ ] Suspended seller and out-of-stock offer not returned.
- [ ] Recommendations never show stale/incorrect price at click time.
- [ ] Personal user event histories are not visible to vendors.
- [ ] Fallback returns within performance budget when personalization fails.
