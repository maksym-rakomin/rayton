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

function filesBelow(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(absolute) : [absolute];
  });
}

test('blog, archive, search, and single templates use WordPress post data and navigation', () => {
  const listingTemplates = ['home.php', 'archive.php', 'search.php'];
  for (const file of listingTemplates) {
    const template = read(file);
    assert.match(template, /while\s*\(\s*have_posts\s*\(\s*\)\s*\)/, file);
    assert.match(template, /the_permalink\s*\(\s*\)/, file);
    assert.match(template, /the_title\s*\(\s*\)/, file);
    assert.match(template, /the_excerpt\s*\(\s*\)/, file);
    assert.match(template, /the_posts_pagination\s*\(/, file);
    assert.match(template, /content-none/, file);
  }

  const single = read('single.php');
  assert.match(single, /while\s*\(\s*have_posts\s*\(\s*\)\s*\)/);
  assert.match(single, /the_title\s*\(\s*\)/);
  assert.match(single, /the_content\s*\(\s*\)/);
  assert.match(single, /the_post_navigation\s*\(/);
  assert.doesNotMatch(single, /comments_template\s*\(/);

  const joined = [...listingTemplates, 'single.php'].map(read).join('\n');
  assert.doesNotMatch(joined, /91-mlrd|kyyivguma|article-[123]\.jpg/i);
});

test('one Caldera wrapper selects the exact production form for UK, EN, and RU', () => {
  const functions = read('functions.php');
  const forms = read('inc/forms.php');
  const part = read('template-parts/forms/enquiry.php');

  assert.match(functions, /inc\/forms\.php/);
  assert.match(forms, /function\s+rayton_v2_caldera_form_ids\s*\(/);
  assert.match(forms, /'uk'\s*=>\s*'CF62f6024bbb1dd'/);
  assert.match(forms, /'en'\s*=>\s*'CF630c5867c8dcd'/);
  assert.match(forms, /'ru'\s*=>\s*'CF65901a68cf806'/);
  assert.match(forms, /shortcode_exists\s*\(\s*'caldera_form'\s*\)/);
  assert.match(forms, /do_shortcode\s*\(/);
  assert.match(forms, /get_template_part\s*\(\s*'template-parts\/forms\/enquiry'/);
  assert.match(part, /rayton-enquiry/);
  assert.match(part, /tel:\+380732422343/);
  assert.match(part, /mailto:sales@rayton\.com\.ua/);
  assert.match(part, /form_unavailable/);
});

test('contact and investment pages delegate submission to Caldera without prototype success UI', () => {
  for (const file of ['template-parts/pages/contacts.php', 'template-parts/pages/investments.php']) {
    const template = read(file);
    assert.match(template, /rayton_v2_render_enquiry_form\s*\(/, file);
    assert.doesNotMatch(template, /<form\b/i, file);
    assert.doesNotMatch(template, /form-status|enctype=["']text\/plain|Відкриється ваша поштова програма/i, file);
  }

  const scripts = filesBelow(path.join(theme, 'assets/js')).map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(scripts, /contact-enquiry|investment-enquiry|FormData\s*\(/);
});

test('theme CSS does not suppress Caldera, error, status, honeypot, or Turnstile UI', () => {
  const styles = filesBelow(path.join(root, 'assets/css'))
    .concat(filesBelow(theme).filter(file => file.endsWith('.css')))
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n');
  assert.doesNotMatch(styles, /(?:turnstile|cf2-|caldera|honeypot|\.alert|\.has-error)[^{]*\{[^}]*display\s*:\s*none/is);
});

test('packaged interactive scripts use injected WordPress URLs and no static routes', () => {
  const assets = read('inc/assets.php');
  assert.match(assets, /rayton-v2-solar-calc/);
  assert.match(assets, /rayton-v2-calculator/);
  assert.match(assets, /['"]calculatorUrl['"]\s*=>\s*rayton_v2_page_url\(\s*'calculator'/);
  assert.match(assets, /['"]projectsUrl['"]\s*=>\s*rayton_v2_page_url\(\s*'projects'/);

  const scripts = filesBelow(path.join(theme, 'assets/js')).map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.doesNotMatch(scripts, /calculator\.html|project\.html|\?id=/i);
  assert.match(read('assets/js/calculator.js'), /config\.calculatorUrl/);
  assert.match(read('assets/js/projects.js'), /config\.projectsUrl/);

  const routes = read('inc/routes.php');
  assert.match(routes, /'financing'\s*=>\s*array\(\s*'slugs'\s*=>\s*array\(\s*'calculator'/);
  assert.match(routes, /'calculator'\s*=>\s*array\(\s*'slugs'\s*=>\s*array\(\s*'okupnist'/);
});
