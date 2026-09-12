# Rayton V2 development report

## Objective and constraints

The static Rayton redesign needed to become a separate, uploadable classic WordPress theme while WordPress retained ownership of routes, content, metadata, locale URLs, and form processing. The implementation is local-only: it does not modify Neve or production, create database migrations, submit forms, or introduce a replacement backend.

## Delivery by gate

- **Gate 1 — foundation:** standalone `Rayton V2` theme metadata, classic template hierarchy, WordPress setup/hooks, cache-versioned asset enqueueing, allowlisted build, and one-root ZIP packaging.
- **Gate 2 — pages:** shared header/footer/sprite, explicit mapping for every named redesign page, UK redesign rendering, WordPress-content fallback for other locales/unresolved mappings, WordPress URL helpers, and the local project catalogue on a hash route. Only cards backed by one of its 12 IDs use a detail hash; unmatched solution-page mock cases link to the general Projects Page.
- **Gate 3 — compatibility:** standard WordPress blog/post/archive/search templates, locale-selected Caldera Forms wrapper with an honest unavailable fallback, adapted calculator/project navigation, and intentional omission of the prototype comment form.
- **Gate 4 — release preparation:** recursive PHP/JavaScript/CSS asset-dependency audit, unused media pruning, final package checks, installation/rollback instructions, and manual test guidance.

No local commit was created; the working tree remains available for the user's review.

## Acceptance-criteria status

| AC | Status | Delivery |
|---|---|---|
| 1 | **Done** | Gate 1: standalone classic theme under `wordpress/themes/rayton-v2/`, identified as Rayton V2. Commit: none. |
| 2 | **Done** | Gates 1–3: baseline hierarchy and required WordPress header/footer/setup hooks. Commit: none. |
| 3 | **Done** | Gates 1–2: WordPress URL/enqueue APIs, cache-safe versions, and converted internal/theme asset references. Commit: none. |
| 4 | **Done** | Gates 2–3: WordPress loops/content, Polylang-aware locale routing, Yoast-owned head, and normal core hooks. Commit: none. |
| 5 | **Done** | Gates 2–3: explicit named-page map, dynamic WordPress blog, and documented local 12-project catalogue. Commit: none. |
| 6 | **Done** | Gate 3: exact UK/EN/RU Caldera IDs, plugin-owned submission/status behavior, unavailable fallback, and no prototype comments UI. Commit: none. |
| 7 | **Done** | Gates 2–3: calculator/project scripts use injected WordPress URLs and hash routing without static `.html` destinations. Commit: none. |
| 8 | **Done** | Gates 1–4: focused Node regression checks cover theme structure, pages, compatibility, dependencies, and packaging. Commit: none. |
| 9 | **Done** | Gates 1 and 4: reproducible `node tools/build-rayton-v2.js` output with one `rayton-v2/` ZIP root. Commit: none. |
| 10 | **Done** | Gate 4: separate upload, Live Preview, activation prerequisites, stop conditions, and Neve rollback are documented. Commit: none. |
| 11 | **Done** | Gates 1, 2, and 4: exact allowlist plus recursive dependency validation; unused assets are excluded without deleting legacy sources. Commit: none. |

## Deferred production work

- Verify real Page IDs/slugs and Polylang translation relationships before activation.
- Verify Caldera field schemas, investment suitability, recipients, and controlled mail delivery.
- Confirm hosting upload limits, take and verify the full backup, choose the activation window, and perform the live smoke test.
- Decide later whether projects and Rayton TV need dedicated dynamic WordPress content models.
- Plan a future migration from the end-of-life Caldera Forms plugin.

These are deployment or future-content tasks; none silently changes the local theme deliverable above.
