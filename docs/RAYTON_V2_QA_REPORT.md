# Rayton V2 independent QA report

## Scope and verdict

Independent source and package QA was performed after the project-link placeholder defect was corrected. No production UI, WordPress installation, database, cache, theme activation, form submission, commit, or push was touched.

**Verdict: PASS for the local deliverable (AC 1–11), subject to the production/runtime checks listed below.**

The earlier defect is resolved: the literal `#project-slug` no longer occurs in theme PHP or in the ZIP. Project cards that do not correspond to the 12-item local catalogue now link to the general Projects Page. The Projects Page retains only concrete hashes backed by one of the 12 catalogue IDs. Source and packaged regression assertions cover both conditions.

## Acceptance criteria

| AC | Result | Independent evidence |
|---|---|---|
| 1 | **Pass** | `wordpress/themes/rayton-v2/style.css` declares `Theme Name: Rayton V2`; the standalone source directory and required bootstrap files exist and do not modify Neve. |
| 2 | **Pass** | The classic hierarchy contains `index.php`, `front-page.php`, `page.php`, `home.php`, `single.php`, `archive.php`, `search.php`, and `404.php`. Setup is registered on `after_setup_theme`; the header calls `language_attributes()`, `wp_head()`, `body_class()`, and `wp_body_open()`; the footer calls `wp_footer()`. |
| 3 | **Pass** | Public CSS/JS is enqueued through WordPress APIs, theme URLs use `get_theme_file_uri()`, and versions use `filemtime()` with a theme-version fallback. Source and packaged scans found no static `.html` routes, relative `src="assets/"`/`href="assets/"` paths, or production `wp-content` paths. Recursive CSS dependencies are included. |
| 4 | **Pass** | Page fallbacks use the normal loop and `the_content()`. Locale detection uses Polylang when available and `determine_locale()` otherwise; only UK mapped Pages render the redesign, while EN/RU/unknown mappings use stored WordPress content. WordPress owns document metadata through `title-tag`/`wp_head()`, and normal hooks preserve plugin/admin output. |
| 5 | **Pass** | All 22 top-level static sources have either one of 18 redesign parts or an explicit WordPress destination. Blog/archive/search/single templates use live loop data, post permalinks, thumbnails, excerpts/content, and pagination. Projects deliberately use the documented 12-item local catalogue. |
| 6 | **Pass** | The shared Caldera wrapper selects the exact observed UK/EN/RU IDs (`CF62f6024bbb1dd`, `CF630c5867c8dcd`, `CF65901a68cf806`), calls the official shortcode only when registered, and otherwise renders a no-submit unavailable state. Contact/investment templates contain no custom form. Scans found no theme-owned fake-success or `mailto:` form transport. `single.php` intentionally omits the prototype comments UI. |
| 7 | **Pass** | Calculator and project scripts receive WordPress URLs through `wp_localize_script()`. Packaged JavaScript contains no `calculator.html`, `project.html`, or `?id=` navigation. Calculator model regressions pass. Every concrete project hash in PHP is backed by a catalogue ID; unmatched mock cases link to the Projects Page without a false detail hash. |
| 8 | **Pass** | `node --test tests/*.test.js` completed with 29 passed, 0 failed. Tests cover identity/hooks, page/locale routing, form integration, interactive routes, asset reachability, package structure, and the corrected project-hash condition. Packaged JavaScript also passes `node --check`. |
| 9 | **Pass** | `node tools/build-rayton-v2.js` reproducibly creates `dist/rayton-v2.zip`. `unzip -t` reports no errors; every archive entry is below the single `rayton-v2/` root; the archive contains no tests, Git/IDE metadata, `_design`, `.fig`, or root HTML files. The packaged manifest equals the configured allowlist. |
| 10 | **Pass** | `docs/RAYTON_V2_INSTALL.md` separates upload from activation and documents prerequisites, Live Preview, verified full database plus `wp-content` backup, stop conditions, preserved Neve rollback, and the no-production-action boundary. |
| 11 | **Pass** | The final recursive dependency audit reports `required=176`, `missing=0`, `unused=0`. Packaged media exactly matches allowlisted media; all packaged SVGs pass XML parsing; there are no zero-byte packaged assets. Comment-only/dead legacy media is excluded without deleting the repository originals. |

## Executed evidence

```text
node --test tests/*.test.js
29 tests passed; 0 failed; 0 skipped

node tools/build-rayton-v2.js
dist/rayton-v2.zip

unzip -t dist/rayton-v2.zip
No errors detected in compressed data

node --check <each packaged assets/js/*.js>
All packaged JavaScript parsed successfully

xmllint --noout <each packaged *.svg>
All packaged SVG files parsed successfully

auditAssetDependencies()
required=176 missing=0 unused=0

git diff --check
No whitespace errors
```

The rebuilt archive is approximately 17 MB. Its SHA-256 at QA time is:

```text
dcd43023f993a7edb1005012f510e0c3f25fd8a33b87cc22e7cd0ae00605f1ed  dist/rayton-v2.zip
```

Forbidden scans covered static `.html` routes, `project.html`, `calculator.html`, `localStorage`, raw relative theme asset attributes, fake-success/form-mailto patterns, local absolute paths, hardcoded production `wp-content`/`wp-admin` paths, and the obsolete `#project-slug` placeholder. No forbidden packaged match was found. Ordinary visible `mailto:` contact links are intentionally allowed and are not form transport.

## Not verified locally

- PHP CLI is not installed in this workspace, so no PHP lint or executed WordPress/PHP runtime assertion is claimed.
- The theme was not installed or rendered in WordPress; visual layout, browser networking, accessibility behavior, plugin styling, admin-bar spacing, and Live Preview remain manual runtime checks.
- Production Page IDs/slugs and Polylang translation relationships require read-only confirmation before activation.
- Caldera field schemas, investment suitability, recipient addresses, Turnstile behavior, processors, and actual mail delivery remain unverified. No form was submitted.
- Hosting upload limits, backup integrity, cache behavior, activation, and Neve rollback require a separately authorized deployment task.
- External video thumbnails, maps, bank links, and other remote resources were not network-validated.

These items do not invalidate the local package verdict; they are explicit deployment/runtime gates rather than claims made by this QA pass.
