# Rayton V2 manual test guide

Use this guide first in WordPress Live Preview and repeat the priority cases after a separately authorized activation. Do not submit a production form until its recipient and controlled test procedure are known.

## 1. Package inspection

1. Run `node tools/build-rayton-v2.js` → `dist/rayton-v2.zip` is rebuilt without an unused/missing dependency error.
2. Run `unzip -t dist/rayton-v2.zip` → the archive reports no errors.
3. Run `unzip -Z1 dist/rayton-v2.zip` → every line starts with `rayton-v2/`; no test, Git, IDE, `_design`, `.fig`, or root HTML file appears.
4. Open `rayton-v2/asset-manifest.json` inside the ZIP → its paths match `tools/rayton-v2-assets.json`.

## 2. Installation boundary

1. Upload the ZIP through **Appearance → Themes → Add New Theme → Upload Theme** → WordPress reports a successful install and public traffic still uses Neve.
2. Return to Themes → Rayton V2 and Neve both appear as separate themes; Neve's directory/content is unchanged.
3. Open Live Preview for Rayton V2 → the preview uses Rayton V2 while the public site remains on Neve.

## 3. Shared WordPress chrome

1. Preview the home page while logged in → the WordPress admin bar is present and does not overlap inaccessible navigation.
2. Inspect page source → WordPress/plugin head and footer output is present; the theme does not emit a static `<title>` or canonical/description replacement.
3. Open header links → destinations are WordPress routes, never `.html` files or hardcoded `rayton.com.ua` theme paths.
4. Resize to a narrow viewport and operate the menu by keyboard → the menu opens/closes, focusable controls remain reachable, and Escape closes supported panels.

## 4. Pages and locales

1. Preview the Ukrainian home and each mapped route: solutions, SES variants, storage, hybrid, autonomous, services, financing, projects, Rayton TV, about, contacts, calculator, FAQ, and investments → each mapped Ukrainian page shows its redesign body with shared chrome.
2. Preview `/about-us/`, `/rayton-business/`, `/avtonomnist/`, `/rayton-portfolio/`, `/okupnist/`, `/calculator/`, `/blogs/`, `/rayton_contact/`, and `/q_a/` → each resolves to the intended map or an explicit WordPress-content fallback, never an unrelated redesign.
3. Switch to EN and RU via Polylang → the locale URL changes through Polylang and stored WordPress content is rendered; Ukrainian redesign copy is not silently substituted.
4. Preview an ordinary unresolved Page → its title/content render through the normal WordPress loop.
5. Preview a missing URL → the theme shows its 404 response and a working home link.

## 5. Blog and search

1. Open the posts page with at least two posts → each card shows its own title, date, excerpt, optional featured image, and permalink; pagination appears when needed.
2. Open one post → its own title, date, categories, featured image, and content appear; the old static article/comment form does not appear.
3. Open a category/date archive → the archive title/description and matching post loop appear with pagination.
4. Search for a known term and an impossible term → matching posts appear for the first query and the no-results template appears for the second.

## 6. Projects and interactive pages

1. Open the Projects Page → the 12 local project records populate cards and all their images load without 404 responses.
2. Follow a card on the Projects Page, for example the Kostopil card → the same WordPress Page gains `#kostopil`, displays the selected project detail, and does not navigate to `project.html` or use `?id=`.
3. Follow a project-style card on a solution page whose displayed case is not in the 12-item dataset → the Projects Page opens without an invented hash or an empty detail view.
4. Open the calculator, submit valid consumption/tariff or bill inputs → results render, the URL remains the WordPress calculator route, and query/hash state is updated.
5. Submit empty, negative, non-numeric, and extremely small calculator inputs → a visible validation message appears and no fake result is displayed.
6. Open the calculator entry point embedded on the SES page → when a result redirect is needed it uses the injected WordPress payback-calculator URL, never `calculator.html`.

## 7. Enquiry forms

1. With Caldera Forms active, preview Contacts and Investments in UK, EN, and RU → the locale-selected existing Caldera form renders, including its plugin-owned validation/status and Turnstile UI.
2. Inspect browser listeners/network before interacting → the theme does not intercept Caldera submit, open a `mailto:` draft, or display its own success state.
3. In a safe non-production copy, temporarily disable Caldera → the theme shows the localized unavailable message plus phone/email links and no submit button.
4. Re-enable Caldera → the official form returns. Do not send a production submission until recipient verification is authorized.

## 8. Activation and rollback rehearsal

1. Confirm a verified full database and `wp-content` backup and keep Neve installed → the rollback prerequisites are observable before activation.
2. In the authorized window, activate Rayton V2 and run cases 3–7 → the public site uses the new theme and priority paths/assets remain healthy.
3. Activate Neve again → the former site presentation returns without deleting WordPress content or plugin configuration.
4. Clear the same authorized caches and repeat home/Page/post/form checks → cached Rayton V2 markup is no longer served.
