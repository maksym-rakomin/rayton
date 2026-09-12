# Rayton V2 specification

## 1. Scope

Build a standalone classic WordPress theme named **Rayton V2** under `wordpress/themes/rayton-v2/` and an uploadable `dist/rayton-v2.zip`. The theme is a sibling of Neve and never edits or packages Neve.

This epic is local-only. It does not upload or activate the theme, touch the WordPress database or permalinks, submit a public form, clear caches, or take a production backup. Existing Elementor, ACF, Polylang, Yoast, Caldera, Page, and post data remain untouched.

The static redesign is source material. Production templates must not contain `.html` navigation, relative `assets/...` URLs, `localStorage` language routing, `project.html?id=...`, form submission through `mailto:`, or fake form-success states.

## 2. Repository findings

The repository has 22 top-level HTML files. Twenty-one are full pages; `financing-raiffeisen.html` is a 470-byte redirect stub. `articles/` has 13 generated article pages. The root `assets/` tree contains 335 files and is about 29 MB: 16 CSS, 19 JavaScript, 16 fonts, 187 icons, 95 images, one data file, and one partial.

Most pages load CSS in this order: `fonts`, `base`, `layout`, `components`, `pages`, `motion`, `responsive`, `header`, followed by page-specific CSS. Page additions are `business`, `calculator`, `company`, `financing-figma`, `investments`, `media`, `projects`, and `quote`. Common JavaScript is `header.js` plus `main.js`; calculator, business/UZE, media, projects, contact, and investment behavior is conditional.

The current tests use Node's built-in test runner. There is no package manifest and no local PHP executable. Existing regression files are `tests/header.test.js`, `tests/solar-calc.test.js`, and the pre-existing untracked `tests/calculator-pages.test.js`.

### Repeated markup

The 35 inspected HTML documents contain:

- 34 headers totaling 301,002 bytes;
- 34 footers totaling 154,772 bytes;
- 34 inline sprites totaling 787,886 bytes.

Together these repeated blocks are 1,243,660 bytes, or 67.9% of the HTML inspected. The safe conversion is therefore to create one `header.php`, one `footer.php`, and one sprite partial, then copy only each page's `<main>` into new theme template parts. Source HTML and the existing dirty files are never mechanically rewritten.

## 3. Minimal theme structure

```text
wordpress/themes/rayton-v2/
  style.css
  functions.php
  index.php
  header.php
  footer.php
  front-page.php
  page.php
  home.php
  single.php
  archive.php
  search.php
  404.php
  inc/theme.php
  inc/assets.php
  inc/routes.php
  inc/forms.php
  template-parts/sprite.php
  template-parts/content-page.php
  template-parts/content-none.php
  template-parts/pages/*.php
  template-parts/forms/enquiry.php
  assets/                         only allowlisted runtime files
  asset-manifest.json             simple packaged-file allowlist
```

`functions.php` only loads the small `inc/` files. No new plugin, REST backend, CPT, ACF model, import pipeline, or general-purpose framework is introduced.

## 4. WordPress compatibility

`inc/theme.php:rayton_v2_setup()` enables `title-tag`, thumbnails, HTML5 markup, custom logo, and menu locations. `header.php` uses `language_attributes()`, `bloginfo('charset')`, `wp_head()`, `body_class()`, and `wp_body_open()`. `footer.php` uses `wp_footer()`.

Static `<title>` and description elements are removed so WordPress and Yoast own title, canonical, metadata, schema, and social tags. Theme output uses normal escaping helpers. Asset and internal URLs come from WordPress APIs rather than a hardcoded production origin. Standard hooks preserve the admin bar, logged-in classes, and plugin assets.

## 5. Pages, locale, and links

`inc/routes.php:rayton_v2_page_map()` maps every named redesign source:

| Static source | Theme destination |
|---|---|
| `index.html` | `front-page.php` + `pages/home.php` |
| `solutions.html` | `pages/solutions.php` |
| `ses.html` | `pages/ses.php` |
| `ses-industrial.html` | `pages/ses-industrial.php` |
| `ses-roof.html` | `pages/ses-roof.php` |
| `ses-consumption.html` | `pages/ses-consumption.php` |
| `uze.html` | `pages/uze.php` |
| `hybrid.html` | `pages/hybrid.php` |
| `autonomous.html` | `pages/autonomous.php` |
| `services.html` | `pages/services.php` |
| `financing.html` | `pages/financing.php` |
| `financing-raiffeisen.html` | stored WordPress content; static redirect is not shipped |
| `projects.html`, `project.html` | `pages/projects.php`, using the current local dataset and hash-selected detail view |
| `blog.html` | `home.php`, using WordPress posts |
| `article.html`, `articles/*.html` | `single.php`, using the current WordPress post |
| `youtube.html` | `pages/youtube.php` |
| `about.html` | `pages/about.php` |
| `contacts.html` | `pages/contacts.php` |
| `calculator.html` | `pages/calculator.php` |
| `faq.html` | `pages/faq.php` |
| `investments.html` | `pages/investments.php` |

`rayton_v2_current_locale()` uses `pll_current_language('slug')` when available, otherwise normalizes `determine_locale()`. Only verified Ukrainian mappings render hardcoded redesign copy. EN, RU, unknown locales, and unresolved slugs use the normal loop and `the_content()`. Ukrainian is never silently presented as another language.

The language switcher uses URLs returned by Polylang. Without Polylang it is omitted. Internal CTA helpers resolve WordPress Page permalinks; unresolved destinations are not given invented links. Home, posts, archives, pagination, and search use core URL functions.

Real production Page IDs/slugs and translation relationships are not available in this repository. Before activation they must be checked against the map. Until then, `the_content()` is the safe fallback and no Page template assignment is changed.

## 6. Blog, projects, and comments

`home.php`, `single.php`, `archive.php`, and `search.php` use standard WordPress loops, post permalinks, featured images, excerpts/content, dates, categories, and pagination. The 13 generated article files and `assets/data/media.json` are not production templates.

Projects remain deliberately simple in v1 because no production project CPT contract is known. `pages/projects.php` preserves the repository's 12-item `projects-data.js` catalogue and existing visual detail view. Cards point to the Projects Page with `#project-slug`; adapted `projects.js` reads the hash and renders the selected project on that WordPress route. It must not use `project.html`, `?id=`, or fake a CMS. This limitation is documented for a later CMS migration.

Comments are intentionally omitted in v1. The static comments and `action="#"` form are prototypes, while production moderation, notifications, spam handling, and privacy behavior are unknown. Existing WordPress comments are not deleted; `single.php` simply does not call `comments_template()`.

## 7. Caldera forms

`inc/forms.php:rayton_v2_caldera_form_ids()` contains the observed map:

```text
uk: CF62f6024bbb1dd
en: CF630c5867c8dcd
ru: CF65901a68cf806
```

`rayton_v2_render_enquiry_form()` selects the current locale and renders the official `caldera_form` shortcode when it exists. Contact and investment placements share this wrapper because only these three production IDs are verified. The theme does not invent an investment-specific form or backend.

Caldera owns its fields, nonce, transport, validation, Turnstile, processors, and server-confirmed messages. The theme does not intercept submit or claim success. Its CSS is scoped beneath `.rayton-enquiry` and does not hide errors, status, honeypot, or Turnstile UI. If Caldera is unavailable, the wrapper shows a localized unavailable message plus ordinary phone/email links and no submit button.

The exact Caldera field schemas, investment-field coverage, recipient, and mail delivery are open production checks. No submission is made in this epic.

## 8. Assets and scripts

`inc/assets.php:rayton_v2_enqueue_assets()` preserves the common CSS dependency order and loads only page-specific additions needed by the current template. Scripts are likewise conditional. Versions use each packaged file's `filemtime()`, with theme version fallback.

PHP asset references use `rayton_v2_asset_url()`. CSS may keep normal paths relative to its own file. Calculator forms and JavaScript receive the WordPress calculator Page URL from PHP rather than using `calculator.html`. Prototype form scripts are not loaded. Prototype `i18n.js` and locale dictionaries are not used for routing.

The current project dataset may remain a runtime asset in v1, but its image and route values are adapted to theme URLs and the Projects Page hash route.

## 9. Asset allowlist and ZIP

`tools/rayton-v2-assets.json` is a small explicit list of runtime CSS, JavaScript, fonts, images, icons, and `screenshot.png`. It is assembled from references in final PHP/CSS/JS and reviewed when a template changes. The build copies only listed files from the repository into the theme; it never copies or deletes the whole root `assets/` tree.

`tools/build-rayton-v2.js` performs pragmatic checks:

- every allowlisted source exists;
- template asset references and CSS `url(...)` files are allowlisted;
- packaged images/SVGs appear in the allowlist;
- forbidden source/design/test/editor paths are absent;
- the ZIP has exactly one top-level `rayton-v2/` directory.

It then creates `dist/rayton-v2.zip` and includes `asset-manifest.json`, which records the packaged paths. Dead SVGs, obsolete images, `.fig`, `_design`, `.git`, IDE files, root HTML, tests, and build-only files are excluded. This is an allowlist and focused validation, not a custom dependency-analysis framework.

## 10. Focused validation and operating boundary

The essential regression command is `node --test tests/*.test.js`. New focused tests cover theme identity/hooks/templates, forbidden `.html`/relative PHP asset/form-mailto strings, locale/content fallback, Caldera IDs, calculator behavior, manifest file existence, and ZIP exclusions. Existing calculator tests remain unchanged.

Gate 4 documents future WordPress upload, Live Preview, activation prerequisites, and rollback to preserved Neve. The documentation requires a verified database + `wp-content` backup before future activation. No operational step is performed during this epic.

## 11. Open production inputs

- Actual Page IDs/slugs and Polylang relationships for UK/EN/RU.
- Exact Caldera fields, recipient, mail delivery, and whether the same forms suit investment enquiries.
- Future CMS model for the currently local project dataset.
- Dynamic source for Rayton TV.
- Hosting upload/PHP limits, backup verification, activation window, and cache/smoke-test ownership.
