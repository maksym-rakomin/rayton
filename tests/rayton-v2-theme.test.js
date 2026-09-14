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

test('Rayton V2 exposes the required classic-theme files and identity', () => {
  for (const file of [
    'style.css',
    'functions.php',
    'header.php',
    'footer.php',
    'index.php',
    'front-page.php',
    'page.php',
    'home.php',
    'single.php',
    'archive.php',
    'search.php',
    '404.php',
    'inc/theme.php',
    'inc/assets.php'
  ]) {
    assert.ok(fs.existsSync(path.join(theme, file)), file);
  }

  assert.match(read('style.css'), /Theme Name:\s*Rayton V2/i);
});

test('theme setup and public assets are registered through WordPress hooks', () => {
  const functions = read('functions.php');
  const setup = read('inc/theme.php');
  const assets = read('inc/assets.php');

  assert.match(functions, /require_once/);
  assert.match(setup, /function\s+rayton_v2_setup\s*\(/);
  assert.match(setup, /add_action\s*\(\s*['"]after_setup_theme['"]\s*,\s*['"]rayton_v2_setup['"]/);
  assert.match(assets, /function\s+rayton_v2_asset_url\s*\(/);
  assert.match(assets, /function\s+rayton_v2_enqueue_assets\s*\(/);
  assert.match(assets, /add_action\s*\(\s*['"]wp_enqueue_scripts['"]\s*,\s*['"]rayton_v2_enqueue_assets['"]/);
  assert.match(assets, /wp_enqueue_style\s*\(/);
  assert.match(assets, /filemtime\s*\(/);
  assert.match(assets, /get_theme_file_uri\s*\(/);
});

test('document hooks and safe content fallbacks are present', () => {
  assert.match(read('header.php'), /wp_head\s*\(\s*\)/);
  assert.match(read('header.php'), /wp_body_open\s*\(\s*\)/);
  assert.match(read('footer.php'), /wp_footer\s*\(\s*\)/);

  for (const file of ['index.php', 'single.php']) {
    const template = read(file);
    assert.match(template, /get_header\s*\(\s*\)/, file);
    assert.match(template, /get_footer\s*\(\s*\)/, file);
    assert.match(template, /have_posts\s*\(\s*\)/, file);
    assert.match(template, /the_content\s*\(\s*\)/, file);
  }

  const frontPage = read('front-page.php');
  assert.match(frontPage, /get_header\s*\(\s*\)/);
  assert.match(frontPage, /get_footer\s*\(\s*\)/);
  assert.match(frontPage, /have_posts\s*\(\s*\)/);
  assert.match(frontPage, /rayton_v2_render_packaged_page\(\s*'home'\s*\)/);

  const page = read('page.php');
  assert.match(page, /get_header\s*\(\s*\)/);
  assert.match(page, /get_footer\s*\(\s*\)/);
  assert.match(page, /have_posts\s*\(\s*\)/);
  assert.match(page, /template-parts\/content/);
  assert.match(read('template-parts/content-page.php'), /the_content\s*\(\s*\)/);

  for (const file of ['archive.php', 'search.php']) {
    const template = read(file);
    assert.match(template, /get_header\s*\(\s*\)/, file);
    assert.match(template, /get_footer\s*\(\s*\)/, file);
    assert.match(template, /have_posts\s*\(\s*\)/, file);
    assert.match(template, /the_excerpt\s*\(\s*\)/, file);
    assert.doesNotMatch(template, /is_singular\s*\(/, file);
  }

  const home = read('home.php');
  assert.match(home, /get_header\s*\(\s*\)/);
  assert.match(home, /get_footer\s*\(\s*\)/);
  assert.match(home, /rayton_v2_render_packaged_page\(\s*'blog'\s*\)/);
  assert.match(read('template-parts/pages/blog.php'), /new\s+WP_Query\s*\(/);
  assert.match(read('template-parts/pages/blog.php'), /the_excerpt\s*\(\s*\)/);

  assert.match(read('404.php'), /get_header\s*\(\s*\)/);
  assert.match(read('404.php'), /get_footer\s*\(\s*\)/);
});
