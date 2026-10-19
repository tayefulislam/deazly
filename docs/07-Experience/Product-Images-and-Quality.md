---
tags: [media, quality, ux]
status: design-spec
---
# Product Images + Image Quality Checker

## Vendor editor UI
Upload drop zone and file picker (proposed JPG/PNG/WebP, max 10MB, max 10 images per offer). Tile gallery: reorder, designate primary, replace, alt-text, map to variant, upload state. Used/refurbished goods require accurate condition photos; canonical images and seller-offer images belong to distinct owners.

## Pipeline
Request signed upload intent → temporary S3/R2 key → verify actual object metadata/signature and limits → malware/security scanning → quality checks → admin review if flagged → Sharp responsive variants → CDN → storefront → Google/Meta catalog eligibility. Worker (BullMQ) asynchronous, retries idempotent, garbage-collect unreferenced temp objects.

## Checker statuses
`QUEUED`, `PROCESSING`, `PASSED`, `WARNING`, `NEEDS_REVIEW`, `REJECTED`, `FAILED`.
Objective block: corrupt, disallowed, malicious, insufficient hard-resolution requirement. Subjective warnings: blur, lighting, background, composition, OCR-style text/promotional watermark detection, duplicates (perceptual hash), mismatch suspicion; optional ML later.
Quality score is supplemental; vendor sees named problems and specific fixes. Store `analyzer_version`, `check_type`, `score`, `severity`, `recommendation`, `reviewer_override` and audit. Separate storefront and Google/Meta suitability flags; external feed inclusion is not equivalent to external approval.

## Image usage
Thumbnail 160; small 320; medium 640; large 1200 (fit bounding box, no destructive stretching); preserve original for permitted reprocessing. CDN cache invalidation / stable object versioning. Do not store binary blobs in PostgreSQL. Never delete assets still referenced by historical invoices/order/dispute evidence.

## API contracts
`POST /api/v1/media/upload-intent`; `POST /api/v1/media/{assetId}/complete`; `GET /api/v1/media/{assetId}/quality-report`; `POST /api/v1/media/{assetId}/recheck`; `POST /api/v1/vendor/offers/{offerId}/images`; `PATCH /api/v1/vendor/offers/{offerId}/images/reorder`; `GET /api/v1/admin/media/quality-reviews`; `POST /api/v1/admin/media/{assetId}/quality-decision`.

## Acceptance
Vendor A cannot modify Vendor B's images; missing/failed conversions do not publish broken URLs; candidate ad primary images are clean and meet current channel rules; invalid images never reach final public URLs.
