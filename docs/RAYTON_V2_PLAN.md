# Rayton V2 implementation plan

## 1. Rules

Run exactly one gate per executor session and stop with the required six-part Stage Report. Read `docs/RAYTON_V2_CHARTER.md` first. Implementation gates add or identify a failing check first, implement the smallest coherent change, then run the focused and full regressions.

Do not upload, activate, submit forms, touch production/Neve, commit without approval, push, or overwrite existing dirty files. Root HTML and legacy assets are read-only inputs. Theme work stays in `wordpress/themes/rayton-v2/`, `tools/`, `tests/`, `docs/`, and `dist/`.

## 2. Gate 1 — minimal theme foundation and asset build

### Files and symbols

- `wordpress/themes/rayton-v2/style.css:Theme Name`
- `functions.php`
- `inc/theme.php:rayton_v2_setup`
- `inc/assets.php:rayton_v2_asset_url`, `rayton_v2_enqueue_assets`
- Minimal `header.php`, `footer.php`, `index.php`, `front-page.php`, `page.php`, `home.php`, `single.php`, `archive.php`, `search.php`, `404.php`
- `tools/rayton-v2-assets.json`
- `tools/build-rayton-v2.js:buildThemeZip`
- `tests/rayton-v2-theme.test.js`
- `tests/rayton-v2-package.test.js`

### Failing-test-first sequence

1. Add `rayton-v2-theme.test.js` for theme metadata, required files, setup hook, `wp_head`, `wp_body_open`, `wp_footer`, and enqueue APIs. Run it; the absent theme must fail.
2. Add `rayton-v2-package.test.js` for allowlisted-file existence, forbidden paths, and a single ZIP root. Run it; the absent build must fail.
3. Create the smallest valid classic-theme skeleton and explicit asset list. Add only currently required common assets.
4. Implement the simple copy-and-ZIP command and rerun focused tests, then all existing tests.

### Commands

```bash
node --test tests/rayton-v2-theme.test.js tests/rayton-v2-package.test.js
node tools/build-rayton-v2.js
node --test tests/*.test.js
unzip -Z1 dist/rayton-v2.zip
```

### AC/manual checks

- AC 1: open `style.css`; expect “Theme Name: Rayton V2”.
- AC 2: inspect required hierarchy and hooks; expect one safe fallback per request type.
- AC 3: inspect enqueue helpers; expect WordPress asset URLs and `filemtime` versions.
- AC 8: run focused theme/package tests; expected pass after implementation.
- AC 9: list ZIP; expect only `rayton-v2/...`.
- AC 11: compare `asset-manifest.json` to copied assets; expect no unlisted packaged image/SVG.

## 3. Gate 2 — shared chrome and all named redesign pages

### Files and symbols

- `inc/routes.php:rayton_v2_current_locale`, `rayton_v2_page_map`, `rayton_v2_page_url`
- `header.php`, `footer.php`, `template-parts/sprite.php`
- `template-parts/content-page.php`
- `template-parts/pages/{home,solutions,ses,ses-industrial,ses-roof,ses-consumption,uze,hybrid,autonomous,services,financing,projects,youtube,about,contacts,calculator,faq,investments}.php`
- Adapted theme copies of shared/page CSS and visual scripts
- `tests/rayton-v2-pages.test.js`

### Failing-test-first sequence

1. Add a page-matrix test covering all 22 top-level sources and their redesign or explicit fallback destination. It must fail on missing parts.
2. Add focused scans rejecting `.html` links, relative PHP asset paths, hardcoded production origin, `localStorage` routing, static `<title>`/description tags, and `project.html?id=`.
3. Convert shared header/footer/sprite once, then each `<main>` into a new page part without editing source files.
4. Implement simple Polylang locale detection: verified UK renders redesign; EN/RU/unresolved routes call `the_content()`.
5. Adapt the current project catalogue to the Projects Page plus `#project-slug` detail state. Update the allowlist only for assets actually used.
6. Run focused tests, build, and full regression.

### Commands

```bash
node --test tests/rayton-v2-pages.test.js tests/rayton-v2-theme.test.js
node tools/build-rayton-v2.js
node --test tests/*.test.js
```

### AC/manual checks

- AC 2: trace homepage, Page, archive/search/404 skeletons; expect standard hooks/templates.
- AC 3: search PHP for `.html`, `src="assets`, `href="assets`, and `../assets`; expect zero production references.
- AC 4: inspect locale branches; expect Polylang URL use and `the_content()` for EN/RU/unresolved pages.
- AC 5: check the page matrix; expect every named source mapped, blog reserved for Gate 3, and projects preserved without query-string routing.
- AC 7: inspect CTAs and project/calculator routes; expect WordPress URLs or hashes, never `.html`.
- AC 11: inspect updated allowlist; expect only assets referenced by converted pages/CSS/JS.

## 4. Gate 3 — blog, Caldera, and interactive compatibility

### Files and symbols

- `home.php`, `single.php`, `archive.php`, `search.php`, `template-parts/content-none.php`
- `inc/forms.php:rayton_v2_caldera_form_ids`, `rayton_v2_render_enquiry_form`
- `template-parts/forms/enquiry.php`
- Adapted `assets/js/calculator.js`, `projects.js`, and required interactive scripts
- `tests/rayton-v2-compat.test.js`
- Existing `tests/solar-calc.test.js`

### Failing-test-first sequence

1. Add blog assertions for the standard loop, post permalinks/content, archive/search pagination, and absence of hardcoded article data.
2. Add assertions for the three exact Caldera IDs, shortcode/plugin-missing branches, no form `mailto:`, no fake-success handling, and no Turnstile-hiding CSS.
3. Add route assertions rejecting `calculator.html`, `project.html`, and `?id=` in packaged JavaScript. Existing solar calculation tests provide the passing numerical baseline.
4. Implement standard post templates, the shared Caldera shortcode wrapper, and only the JS route adaptations required for WordPress.
5. Keep comments intentionally omitted and documented. Rebuild and run the complete regression set.

### Commands

```bash
node --test tests/rayton-v2-compat.test.js tests/solar-calc.test.js
node tools/build-rayton-v2.js
node --test tests/*.test.js
```

### AC/manual checks

- AC 4: inspect blog templates; expect standard WordPress post data and Yoast-compatible head ownership.
- AC 5: create a mental two-post case; each card/detail must use its own permalink and content.
- AC 6: inspect UK/EN/RU and missing-plugin branches; expect Caldera-owned status/Turnstile and no theme submit handler. Confirm `single.php` omits comments.
- AC 7: inspect calculator/project scripts on a nested WordPress route; expect injected URL/hash navigation and unchanged numerical behavior.
- AC 8: run compatibility plus existing JS tests; expected pass.

## 5. Gate 4 — final audit, ZIP, and operating documentation

### Files and symbols

- `docs/RAYTON_V2_INSTALL.md`
- `tools/rayton-v2-assets.json`
- `tests/rayton-v2-package.test.js`
- `dist/rayton-v2.zip`

### Failing-test-first sequence

1. Add any missing focused assertion for install-document headings, package exclusions, missing allowlisted files, or unused packaged image/SVG files.
2. Remove unreferenced entries from the allowlist and rebuild; do not delete legacy root assets.
3. Run the full suite, ZIP listing, and forbidden-string scan.
4. Document future upload, Live Preview, backup/activation prerequisites, smoke checks, and Neve rollback. Do not perform them.

### Commands

```bash
node --test tests/*.test.js
node tools/build-rayton-v2.js
node --test tests/rayton-v2-package.test.js
unzip -Z1 dist/rayton-v2.zip
rg -n "\\.html([?#]|[\\\"'])|(?:src|href)=[\\\"'](?:\\.\\./)*assets/|project\\.html|calculator\\.html" wordpress/themes/rayton-v2 --glob '*.php' --glob '*.js'
git status --short
```

### AC/manual checks

- AC 1-9 and AC 11: walk the focused acceptance matrix and inspect the final ZIP/manifest; expect all tests to pass and no source-only files.
- AC 10: read `RAYTON_V2_INSTALL.md`; expect backup-before-activation, upload separate from activation, Live Preview checks, preserved Neve rollback, and no claimed production action.

## 6. Acceptance mapping

| AC | Gate | Concrete planned anchors |
|---|---|---|
| 1 | 1, 4 | `style.css:Theme Name`; `tests/rayton-v2-theme.test.js:theme identity` |
| 2 | 1, 2, 3 | `inc/theme.php:rayton_v2_setup`; `header.php:wp_head/wp_body_open`; `footer.php:wp_footer`; baseline templates |
| 3 | 1, 2 | `inc/assets.php:rayton_v2_enqueue_assets/rayton_v2_asset_url`; `rayton-v2-pages.test.js:forbidden paths` |
| 4 | 2, 3 | `inc/routes.php:rayton_v2_current_locale`; `template-parts/content-page.php:the_content`; `home.php:loop` |
| 5 | 2, 3 | `inc/routes.php:rayton_v2_page_map`; `pages/projects.php`; `home.php`; `single.php` |
| 6 | 3 | `inc/forms.php:rayton_v2_caldera_form_ids/rayton_v2_render_enquiry_form`; `single.php:comments omitted` |
| 7 | 2, 3 | `assets/js/calculator.js:injected URL`; `assets/js/projects.js:hash route`; `tests/solar-calc.test.js` |
| 8 | 1-4 | `rayton-v2-theme.test.js`; `rayton-v2-pages.test.js`; `rayton-v2-compat.test.js`; `rayton-v2-package.test.js` |
| 9 | 1, 4 | `tools/build-rayton-v2.js:buildThemeZip`; package ZIP-root test |
| 10 | 4 | `docs/RAYTON_V2_INSTALL.md:upload/preview/activation/rollback` |
| 11 | 1, 2, 4 | `tools/rayton-v2-assets.json`; `asset-manifest.json`; package missing/unused checks |

## 7. Deferred production inputs

Before eventual activation, obtain a read-only inventory of real Page IDs/slugs and Polylang relationships, confirm Caldera schemas and investment suitability, identify the recipient, and test delivery in a separate authorized task. A future decision may migrate the local project dataset and Rayton TV content into WordPress. Upload limits, backup, activation window, cache clearing, and live smoke tests are also deployment-task work.
