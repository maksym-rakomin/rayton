# Rayton V2 theme charter

## Meta

- Epic: `RAYTON-V2` (internal key; no external Jira ticket was provided).
- Repository: the single Git repository rooted at `/Users/maksym.rakomin/projects/rayton`.
- Objective: turn the existing static redesign into a separate installable classic WordPress theme named **Rayton V2**.
- Consumer: the existing production WordPress installation at `rayton.com.ua`.
- Delivery for this epic: local theme source, validation tooling/tests, and an installable ZIP artifact. Uploading, activating, routing production traffic, and sending live test forms are separate future work.
- Dependencies on production: WordPress, Polylang, Yoast SEO, ACF Pro, Caldera Forms, existing Pages/posts and their language relationships.

## Repository guardrails

- This repository has no `CLAUDE.md`, `.claude/CLAUDE.md`, `AGENTS.md`, package manifest, or project-specific commit protocol. `.claude/launch.json` only starts `python3 tools/serve.py 4173`.
- The working tree was already dirty before this epic. Preserve and do not overwrite unrelated user changes in `assets/js/calculator.js`, `calculator.html`, `financing.html`, `index.html`, `ses.html`, or `tests/calculator-pages.test.js`.
- Never upload to WordPress, activate/deactivate a theme, submit a public form, change the database, change permalinks, or clear production caches during this epic.
- Never overwrite or vendor the existing Neve theme. Rayton V2 must be a sibling theme with a unique stylesheet directory/name.
- Never `git push`. Do not create a local commit until the user approves the relevant implementation gate. If a commit is later approved, prefix its message with the internal key `RAYTON-V2` because no Jira key exists.
- Use WordPress APIs for asset URLs, URLs, escaping, enqueueing, body classes, document metadata hooks, and template selection. Do not hardcode the production origin.
- The distributable ZIP must exclude design/source-only artifacts such as `.fig`, `_design`, IDE metadata, tests, and repository metadata.
- No silent fallback to `mailto:` and no fake-success UI for forms.

## Locked decisions

- ✅ DECIDED — Build a new standalone theme called **Rayton V2**, not a child theme and not a modification of Neve. Rationale: activation becomes the eventual switch and Neve remains the rollback target.
- ✅ DECIDED — This epic is local-only. No upload or activation. Rationale: there is no staging environment and switching is explicitly a separate task.
- ✅ DECIDED — Produce an installable ZIP for the WordPress theme uploader. Rationale: WordPress admin is the available deployment channel.
- ✅ DECIDED — Do not take a production backup now. A full backup belongs to the future upload/activation task; theme creation itself is local and does not touch production.
- ✅ DECIDED — Keep form delivery compatible with the existing Caldera Forms backend for the first release, but do not send a test submission in this epic. Rationale: the recipient is unknown and existing forms already hold production submissions.
- ✅ DECIDED — Preserve WordPress/Polylang URL and content ownership. Do not ship `.html` URLs as production routes, replace language routing with `localStorage`, or mutate current Page template assignments.
- ✅ DECIDED — Existing UK/EN/RU routes must not break merely because Rayton V2 is active. Where redesign copy is not yet available for a locale/template, use a simple WordPress-content fallback rather than silently rendering Ukrainian as another language.
- ✅ DECIDED — Package only assets proven reachable from the final theme templates, CSS, or JavaScript. Do not mechanically copy the whole current `assets/` tree; exclude dead SVGs, obsolete images, duplicates, and design-only sources from the theme ZIP without deleting them from the original repository.
- ❌ REJECTED — Copy static files into the web root and bypass WordPress.
- ❌ REJECTED — Rename the static `.html` files to `.php` without integrating WordPress hooks and URL APIs.
- ❌ REJECTED — Replace, edit, zip, or delete the production Neve directory as the rollback mechanism.

## Ground-truth anchors

- `README.md:3-4` — the repository is static markup intended for later WordPress theming.
- `README.md:10-38` — page and asset inventory.
- `README.md:185-225` — intended HTML-to-template mapping, enqueue order, CMS candidates, and the stated need for an AJAX/REST form handler.
- `assets/partials/header.html:1` — reusable header source.
- `index.html:1` — representative full static document and homepage source.
- `assets/js/i18n.js:1-43` — current incremental client translation; only UK/EN are exposed and locale is stored client-side. This is a prototype behavior, not the production routing model.
- `assets/js/contacts.js:1-37` — current contact form only creates a `mailto:` draft.
- `assets/js/investments.js:1-34` — current investment form only creates a `mailto:` draft.
- `article.html:245-270` — prototype comment form posts to `#` and has no backend.
- `assets/js/solar-calc.js:1` and `assets/js/calculator.js:1` — calculator model and UI must continue to function after theme conversion.
- `tests/header.test.js`, `tests/solar-calc.test.js`, `tests/calculator-pages.test.js` — existing regression tests to preserve and extend.

## Observed production constraints

- Active theme: Neve. The public site is rendered by Neve plus Elementor/Elementor Pro.
- WordPress version observed: 6.5.3.
- Production contains 78 Pages and uses Polylang for UK/EN/RU relationships.
- Caldera Forms 1.9.7 is active. Observed form IDs: Ukrainian `CF62f6024bbb1dd`, English `CF630c5867c8dcd`, Russian `CF65901a68cf806`.
- The Ukrainian form has an enabled mailer and an Auto Responder processor; recipient delivery has not been verified. The public form also renders a Cloudflare Turnstile response field.
- WP Rocket and Yoast SEO are active. `Disable All WordPress Updates` is active.
- Existing Elementor and Caldera content/configuration must remain intact for rollback.

## Acceptance criteria

1. A standalone classic theme exists under a dedicated source directory and is recognized as **Rayton V2** by WordPress.
2. It has a valid baseline template hierarchy and WordPress hooks: `style.css`, `functions.php`, `index.php`, `header.php`, `footer.php`, `front-page.php`, page handling, `home.php`, `single.php`, archive/search/404 handling as justified by the approved design.
3. Redesign CSS/JS/fonts/images are loaded from the theme with WordPress APIs and cache-safe versions; HTML-relative asset and page links are eliminated from rendered templates.
4. Existing WordPress Pages/posts, Polylang locale URLs, Yoast metadata, admin bar, and logged-in behavior remain compatible.
5. The redesigned homepage and all named static redesign pages have an explicit template mapping. The blog uses WordPress posts; projects may retain the repository's current local data/view in v1 because no production CPT contract is known.
6. Contact/investment enquiry UI has a defined Caldera integration path for each production locale and does not claim success without server confirmation. Comment UI either uses WordPress comments correctly or is intentionally omitted with that limitation explicit.
7. Existing calculator and interactive scripts continue to work from WordPress routes without `.html` navigation assumptions.
8. Focused automated checks cover theme validity, forbidden static links/asset paths, required hooks/templates, packaging exclusions, and important existing JS behavior without building a bespoke theme-analysis framework.
9. A reproducible command produces a WordPress-uploadable ZIP containing one top-level `rayton-v2/` directory and no source-only artifacts.
10. Installation/preview/activation/rollback instructions are documented, but no production action is taken.
11. The packaged theme contains only assets referenced by its templates/CSS/JS (plus explicitly documented runtime assets); unused legacy SVGs and images are not copied into the distributable.

## Gate map hypothesis

- Gate 0 — design: inspect the entire static surface, produce the detailed theme architecture/spec and an implementation plan mapped to AC 1-10. No production code.
- Gate 1 — theme foundation: minimal classic-theme skeleton, WordPress hooks, shared helpers, and a simple asset manifest/build command.
- Gate 2 — page conversion: shared header/footer and all named redesign page templates, internal URL conversion, and locale-aware fallback.
- Gate 3 — WordPress compatibility: normal post/blog templates, current project view, Caldera locale mapping, calculator/interactions, and Yoast/Polylang compatibility.
- Gate 4 — focused regression, pruned asset audit, uploadable ZIP, and installation/rollback documentation.

## Open items for the future deployment task

- Identify the actual email recipient(s) and verify mail delivery with one controlled submission.
- Confirm hosting/PHP limits for WordPress ZIP upload and the maximum accepted archive size.
- Take and verify a full database plus `wp-content` backup.
- Decide the production activation window and who will perform the visual smoke test.
- Decide when to migrate away from end-of-life Caldera Forms.
