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
    'about', 'contacts', 'calculator', 'faq', 'investments'
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
    'project.html': 'projects-hash-detail', 'blog.html': 'wordpress-posts',
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

test('locale routing renders redesign only for verified Ukrainian pages', () => {
  const routes = read('inc/routes.php');
  const content = read('template-parts/content-page.php');
  assert.match(routes, /function\s+rayton_v2_current_locale\s*\(/);
  assert.match(routes, /pll_current_language\s*\(/);
  assert.match(routes, /determine_locale\s*\(/);
  assert.match(routes, /function\s+rayton_v2_page_map\s*\(/);
  assert.match(routes, /function\s+rayton_v2_page_url\s*\(/);
  assert.match(content, /rayton_v2_current_locale\s*\(\s*\)\s*!==\s*['"]uk['"]/);
  assert.match(content, /the_content\s*\(\s*\)/);
  assert.match(content, /get_template_part\s*\(/);
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
});

test('required shared-chrome routes cannot emit empty URL attributes', () => {
  const routes = read('inc/routes.php');
  const header = read('header.php');
  for (const key of ['home', 'ses', 'uze', 'projects', 'financing', 'investments', 'blog', 'youtube', 'about', 'contacts']) {
    assert.match(routes, new RegExp(`'${key}'[\\s\\S]{0,180}'required'\\s*=>\\s*true`), key);
    assert.match(header, new RegExp(`rayton_v2_page_url\\(\\s*'${key}'`), key);
  }
  assert.match(routes, /home_url\s*\(\s*'\/'\s*\.\s*trailingslashit/);
});

test('shared header and footer labels use the locale UI dictionary', () => {
  const routes = read('inc/routes.php');
  assert.match(routes, /function\s+rayton_v2_ui\s*\(/);
  assert.match(routes, /'en'\s*=>\s*array\s*\(/);
  assert.match(routes, /'ru'\s*=>\s*array\s*\(/);
  assert.match(read('header.php'), /rayton_v2_ui\s*\(/);
  assert.match(read('template-parts/footer-chrome.php'), /rayton_v2_ui\s*\(/);
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
