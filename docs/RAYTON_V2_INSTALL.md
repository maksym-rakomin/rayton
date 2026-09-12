# Rayton V2 installation and rollback

This document is for a separate, explicitly authorized deployment task. The current development task did not upload, install, preview, activate, or submit anything on production.

## Preconditions

1. Confirm the production Page slugs and Polylang UK/EN/RU relationships against `rayton_v2_page_map()` in `inc/routes.php`.
2. Confirm the three Caldera Forms IDs, their field coverage, the recipient addresses, mail delivery, and whether the shared forms are suitable for investment enquiries.
3. Confirm that the hosting PHP upload and post limits accept `dist/rayton-v2.zip`.
4. Create a full database and `wp-content` backup immediately before activation. Verify that the backup files are readable and that the restore procedure is available.
5. Record the currently active theme as **Neve** and keep it installed and unchanged. Agree an activation window and a person responsible for the smoke test.

## Upload without activation

1. In WordPress open **Appearance → Themes → Add New Theme → Upload Theme**.
2. Select `dist/rayton-v2.zip`, choose **Install Now**, and wait for a successful installation message.
3. Do not choose **Activate**. Return to the Themes screen and confirm that both **Rayton V2** and **Neve** are present.
4. If WordPress reports that the destination already exists, stop and compare the installed theme version with the ZIP. Do not overwrite an unknown copy during the same operation.

Uploading the sibling theme does not replace Neve and does not route public traffic to Rayton V2.

## Live Preview

1. From **Appearance → Themes**, open **Live Preview** for Rayton V2 while Neve remains active publicly.
2. Check the home page and the production routes listed in the manual test guide at desktop and mobile widths.
3. Check the UK redesign, EN/RU WordPress-content fallback, admin bar, menus, post listing, one post, search, 404, calculator, project hash view, and the visible Caldera form/Turnstile state.
4. Do not submit a form until its recipient and the controlled test procedure have been approved.
5. If the preview cannot reliably exercise a plugin or route, record that item as unverified; do not infer success from markup alone.

## Activation in a separate task

1. Reconfirm the verified full database and `wp-content` backup and the rollback owner.
2. Activate **Rayton V2** only in the agreed window.
3. Run the priority smoke cases immediately. Check plugin-generated form status without submitting, unless a controlled submission is explicitly authorized.
4. After the initial observations are recorded, clear the relevant WordPress/CDN caches only under the deployment task's authorization, then repeat the route and asset checks.

## Rollback to Neve

1. In **Appearance → Themes**, activate the preserved **Neve** theme.
2. Clear the same application/CDN caches used during activation and confirm that the public site again renders through Neve.
3. Recheck the home page, one Page, one post, language switching, and the existing Caldera form.
4. Keep Rayton V2 installed but inactive while the issue is investigated. A theme switch does not delete Elementor, Caldera, Page, post, ACF, Polylang, or Yoast data.
5. Restore the database/`wp-content` backup only if the theme switch is insufficient and the restore is separately authorized. A normal Rayton V2 activation is not expected to write or migrate data.

## Stop conditions

Stop and return to Neve if there is a fatal error, inaccessible administration, broken primary routing, missing critical assets, an unusable form, or an unexpected locale/content substitution. Preserve error logs and screenshots before changing further state.
