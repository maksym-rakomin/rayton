'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const theme = path.join(root, 'wordpress/themes/rayton-v2');

function read(relativePath) {
  return fs.readFileSync(path.join(theme, relativePath), 'utf8');
}

function themeFiles(directory = theme) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? themeFiles(absolute) : [absolute];
  });
}

test('all 22 top-level sources have a redesign part or an explicit WordPress destination', () => {
  const redesignParts = [
    'home', 'solutions', 'ses', 'ses-industrial', 'ses-roof', 'ses-consumption',
    'uze', 'hybrid', 'autonomous', 'services', 'financing', 'projects', 'youtube',
    'blog', 'about', 'contacts', 'calculator', 'faq', 'investments'
  ];

  for (const page of redesignParts) {
    assert.ok(fs.existsSync(path.join(theme, `template-parts/pages/${page}.php`)), page);
  }

  const sourceMatrix = {
    'index.html': 'home', 'solutions.html': 'solutions', 'ses.html': 'ses',
    'ses-industrial.html': 'ses-industrial', 'ses-roof.html': 'ses-roof',
    'ses-consumption.html': 'ses-consumption', 'uze.html': 'uze', 'hybrid.html': 'hybrid',
    'autonomous.html': 'autonomous', 'services.html': 'services', 'financing.html': 'financing',
    'financing-raiffeisen.html': 'wordpress-content', 'projects.html': 'projects',
    'project.html': 'projects-hash-detail', 'blog.html': 'blog',
    'article.html': 'wordpress-posts', 'youtube.html': 'youtube', 'about.html': 'about',
    'contacts.html': 'contacts', 'calculator.html': 'calculator', 'faq.html': 'faq',
    'investments.html': 'investments'
  };
  assert.equal(Object.keys(sourceMatrix).length, 22);

  const routes = read('inc/routes.php');
  assert.match(routes, /wordpress-content/);
  assert.match(routes, /wordpress-posts/);
  assert.match(routes, /projects-hash-detail/);
});

test('locale routing keeps the packaged redesign for Ukrainian and English', () => {
  const routes = read('inc/routes.php');
  const content = read('template-parts/content-page.php');
  assert.match(routes, /function\s+rayton_v2_current_locale\s*\(/);
  assert.match(routes, /pll_current_language\s*\(/);
  assert.match(routes, /determine_locale\s*\(/);
  assert.match(routes, /function\s+rayton_v2_page_map\s*\(/);
  assert.match(routes, /function\s+rayton_v2_page_url\s*\(/);
  assert.match(routes, /function\s+rayton_v2_use_packaged_page\s*\(/);
  assert.match(routes, /in_array\(\s*rayton_v2_current_locale\s*\(\s*\)\s*,\s*array\(\s*['"]uk['"]\s*,\s*['"]en['"]/);
  assert.match(content, /!\s*rayton_v2_use_packaged_page\s*\(\s*\)/);
  assert.match(content, /the_content\s*\(\s*\)/);
  assert.match(content, /rayton_v2_render_packaged_page\s*\(/);
  assert.match(read('front-page.php'), /rayton_v2_use_packaged_page\s*\(\s*\)/);
  assert.match(read('front-page.php'), /the_content\s*\(\s*\)/);
  assert.match(routes, /if\s*\(\s*\$key\s*\)\s*\{[\s\S]{0,120}page--/);
});

test('home and internal URLs resolve the linked Polylang page', () => {
  const routes = read('inc/routes.php');
  assert.match(routes, /get_option\s*\(\s*['"]page_on_front['"]\s*\)/);
  assert.match(routes, /pll_get_post\s*\(\s*\$page_id\s*,\s*\$locale\s*\)/);
  assert.match(routes, /get_permalink\s*\(\s*\$page_id\s*\)/);
  assert.match(routes, /pll_the_languages\s*\(\s*array\s*\(\s*['"]raw['"]\s*=>\s*1\s*\)\s*\)/);
});

test('production Page aliases are resolved in explicit priority order', () => {
  const routes = read('inc/routes.php');
  const aliases = {
    about: ['about-us', 'about'],
    ses: ['rayton-business', 'ses'],
    uze: ['avtonomnist', 'uze'],
    projects: ['rayton-portfolio', 'projects'],
    financing: ['calculator', 'financing'],
    calculator: ['okupnist', 'calculator'],
    blog: ['blogs', 'blog'],
    contacts: ['rayton_contact', 'contacts'],
    faq: ['q_a', 'faq']
  };
  for (const [key, candidates] of Object.entries(aliases)) {
    const ordered = candidates.map(candidate => `'${candidate}'`).join('\\s*,\\s*');
    assert.match(routes, new RegExp(`'${key}'[\\s\\S]{0,180}'slugs'\\s*=>\\s*array\\(\\s*${ordered}`), key);
  }
  const pageMap = routes.slice(routes.indexOf('function rayton_v2_page_map'));
  assert.ok(pageMap.indexOf("'financing'") < pageMap.indexOf("'calculator'"), 'calculator slug ownership stays with financing');
  assert.match(routes, /foreach\s*\(\s*\$definition\['slugs'\]\s+as\s+\$slug/);
  assert.match(routes, /foreach\s*\(\s*\$map\[\s*\$key\s*\]\['slugs'\]\s+as\s+\$slug/);
  assert.match(routes, /\$translated_id\s*=\s*\(int\)\s*pll_get_post/);
  assert.match(routes, /\$translated_id\s*===\s*\$current_id/);
});

test('required shared-chrome routes cannot emit empty URL attributes', () => {
  const routes = read('inc/routes.php');
  const header = read('header.php');
  for (const key of ['home', 'ses', 'uze', 'projects', 'financing', 'investments', 'blog', 'youtube', 'about', 'contacts']) {
    assert.match(routes, new RegExp(`'${key}'[\\s\\S]{0,180}'required'\\s*=>\\s*true`), key);
    assert.match(header, new RegExp(`rayton_v2_page_url\\(\\s*'${key}'`), key);
  }
  assert.match(routes, /trailingslashit\s*\(\s*\$base_url\s*\)\s*\.\s*trailingslashit/);
});

test('Rayton TV has an internal route fallback and header links stay inside the site', () => {
  const routes = read('inc/routes.php');
  const header = read('header.php');
  assert.match(routes, /function\s+rayton_v2_virtual_page_key\s*\(/);
  assert.match(routes, /function\s+rayton_v2_virtual_page_template\s*\(/);
  assert.match(routes, /status_header\s*\(\s*200\s*\)/);
  assert.match(routes, /template-virtual-page\.php/);
  assert.match(header, /class="rh-news-card" href="<\?php echo esc_url\( rayton_v2_page_url\( 'youtube' \) \)/);
});

test('theme routes and language links stay on packaged pages when WordPress mappings are incomplete', () => {
  const routes = read('inc/routes.php');
  assert.match(routes, /function\s+rayton_v2_page_url_for_locale\s*\(/);
  assert.match(routes, /function\s+rayton_v2_language_base_url\s*\(/);
  assert.match(routes, /home_url\(\s*'\/'\s*\.\s*\$locale\s*\.\s*'\/'\s*\)/);
  assert.doesNotMatch(routes, /\$base_url\s*=\s*function_exists\(\s*'pll_home_url'/);
  assert.match(routes, /'blog'\s*=>\s*array\([^\n]*'part'\s*=>\s*'blog'/);
  assert.doesNotMatch(routes, /['"]blog['"]\s*===\s*\$virtual_key[\s\S]{0,180}home\.php/);
  assert.match(routes, /rayton_v2_page_url_for_locale\(\s*\$current_key\s*,\s*\$language\['slug'\]/);
});

test('English packaged pages use server-rendered approved redesign dictionaries', () => {
  const i18n = read('inc/i18n.php');
  const translations = JSON.parse(read('assets/i18n/en.json'));
  assert.match(read('functions.php'), /inc\/i18n\.php/);
  assert.match(i18n, /function\s+rayton_v2_translate_page_markup\s*\(/);
  assert.match(i18n, /'en'\s*!==\s*rayton_v2_current_locale\s*\(\s*\)/);
  assert.match(i18n, /assets\/i18n\/en\.json/);
  assert.ok(Object.keys(translations.common || {}).length > 100);
  for (const page of ['home', 'solutions', 'ses', 'ses-industrial', 'ses-roof', 'ses-consumption', 'uze', 'hybrid', 'autonomous', 'services', 'financing', 'projects', 'youtube', 'about', 'contacts', 'calculator', 'faq', 'investments']) {
    assert.ok(Object.hasOwn(translations.pages || {}, page), page);
  }
  assert.match(read('template-parts/content-page.php'), /rayton_v2_render_packaged_page\s*\(/);
  assert.match(read('front-page.php'), /rayton_v2_render_packaged_page\s*\(/);
  assert.match(read('template-virtual-page.php'), /rayton_v2_render_packaged_page\s*\(/);
});

test('packaged Page routes bypass an incorrect posts-index classification', () => {
  const routes = read('inc/routes.php');
  assert.match(routes, /function\s+rayton_v2_packaged_page_key\s*\(/);
  assert.match(routes, /\$page_key\s*=\s*rayton_v2_current_page_key\s*\(\s*\)/);
  const router = routes.slice(
    routes.indexOf('function rayton_v2_virtual_page_template'),
    routes.indexOf("add_filter( 'template_include'")
  );

	assert.match(router, /rayton_v2_packaged_page_key\s*\(\s*\)/);
  assert.match(router, /\$wp_query->is_home\s*=\s*false/);
  assert.match(router, /\$wp_query->is_posts_page\s*=\s*false/);
	assert.match(router, /\$wp_query->is_single\s*=\s*false/);
	assert.match(router, /\$wp_query->is_page\s*=\s*true/);
	assert.match(router, /\$wp_query->is_singular\s*=\s*true/);
  assert.match(router, /return\s+get_theme_file_path\(\s*'template-virtual-page\.php'\s*\)/);
  const notFoundBlock = router.slice(router.indexOf('if ( is_404() )'), router.indexOf('/*'));
  assert.doesNotMatch(notFoundBlock, /return\s+get_theme_file_path/);
});

test('single template recovers Polylang Pages misclassified by production rewrites', () => {
	const single = read('single.php');
	assert.match(single, /rayton_v2_packaged_page_key\s*\(\s*\)/);
	assert.match(single, /rayton_v2_render_packaged_page\s*\(/);
	assert.match(single, /\$rayton_page_map\[\s*\$rayton_page_key\s*\]\['part'\]/);
	assert.ok(single.indexOf('rayton_v2_render_packaged_page') < single.indexOf('<main class="site-main single-post">'));
});

test('desktop Media hover bridge covers the entire panel offset', () => {
  const css = fs.readFileSync(path.join(root, 'assets/css/header.css'), 'utf8');
  assert.match(css, /\.rh-media-panel\s*\{[^}]*top:calc\(100% \+ 24px\)/s);
  assert.match(css, /\.rh-media-panel::before\s*\{\s*height:26px;\s*\}/);
});

test('shared header and footer labels use the locale UI dictionary', () => {
  const routes = read('inc/routes.php');
  assert.match(routes, /function\s+rayton_v2_ui\s*\(/);
  assert.match(routes, /'en'\s*=>\s*array\s*\(/);
  assert.match(routes, /'ru'\s*=>\s*array\s*\(/);
  assert.match(read('header.php'), /rayton_v2_ui\s*\(/);
  assert.match(read('template-parts/footer-chrome.php'), /rayton_v2_ui\s*\(/);
});

test('WordPress header preserves the full interactive chrome and hides Russian from the switcher', () => {
  const header = read('header.php');
  const headerScript = read('assets/js/header.js');
  const routes = read('inc/routes.php');

  assert.match(header, /class="rh-dropdown rh-media"/);
  assert.match(header, /id="header-notifications"/);
  assert.match(header, /896-22555-imgBell\.svg/);
  assert.match(header, /class="rh-dropdown rh-contact"/);
  assert.match(header, /id="header-contact"/);
  assert.match(headerScript, /pointerenter/);
  assert.match(headerScript, /pointerleave/);
  assert.match(routes, /in_array\(\s*\$language\['slug'\]\s*,\s*array\(\s*'uk'\s*,\s*'en'\s*\)/);
});

test('UZE model buttons have packaged modal markup and behaviour', () => {
  const uze = read('template-parts/pages/uze.php');
  const assets = read('inc/assets.php');
  const modalScript = fs.readFileSync(path.join(root, 'assets/js/uze-modal.js'), 'utf8');

  assert.match(uze, /data-uze-model=/);
  assert.match(uze, /id="uze-modal"/);
  assert.match(uze, /data-uze-modal-close/);
  assert.match(uze, /rayton_v2_page_url\(\s*'contacts'/);
  assert.match(assets, /rayton-v2-uze-modal/);
  assert.match(assets, /assets\/js\/uze-modal\.js/);
  assert.match(assets, /['"]assetsUrl['"]\s*=>\s*untrailingslashit/);
  assert.match(modalScript, /config\.assetsUrl/);
  assert.match(modalScript, /closest\(\s*['"]\[data-uze-model\]/);
});

test('converted theme code contains no static-site routing or document metadata', () => {
  const checked = themeFiles().filter(file => /\.(?:php|js)$/i.test(file));
  const joined = checked.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(joined, /(?:href|src)=["'](?:\.\.\/)*assets\//i);
  assert.doesNotMatch(joined, /(?:href|action)=["'][^"']*\.html(?:[?#]|["'])/i);
  assert.doesNotMatch(joined, /https?:\/\/(?:www\.)?rayton\.com\.ua/i);
  assert.doesNotMatch(joined, /localStorage/i);
  assert.doesNotMatch(joined, /<title(?:\s|>)/i);
  assert.doesNotMatch(joined, /<meta[^>]+name=["']description["']/i);
  assert.doesNotMatch(joined, /project\.html\?id=/i);
});

test('projects use the current local catalogue on the Projects Page hash route', () => {
  const projects = read('template-parts/pages/projects.php');
  const assets = read('inc/assets.php');
  assert.match(projects, /projects-grid/);
  assert.match(assets, /projects-data\.js/);
  assert.match(assets, /projects\.js/);
  assert.match(assets, /['"]projectsUrl['"]\s*=>\s*rayton_v2_page_url/);
  assert.match(assets, /wp_localize_script\s*\(/);
});

test('theme PHP uses only project hashes backed by the local dataset', () => {
  const projectData = read('assets/js/projects-data.js');
  const projectIds = new Set([...projectData.matchAll(/^\s*\['([^']+)'/gm)].map(match => match[1]));
  assert.equal(projectIds.size, 12);

  const php = themeFiles()
    .filter(file => file.endsWith('.php'))
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');
  assert.doesNotMatch(php, /#project-slug/);

  const hashes = [...php.matchAll(/rayton_v2_page_url\(\s*'projects'\s*,\s*'#([^']+)'\s*\)/g)].map(match => match[1]);
  assert.ok(hashes.length > 0, 'projects page exposes concrete hash details');
  for (const hash of hashes) assert.ok(projectIds.has(hash), `unknown project hash: ${hash}`);
});
