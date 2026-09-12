'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'wordpress/themes/rayton-v2/template-parts');
const pages = {
  index: 'home',
  solutions: 'solutions',
  ses: 'ses',
  'ses-industrial': 'ses-industrial',
  'ses-roof': 'ses-roof',
  'ses-consumption': 'ses-consumption',
  uze: 'uze',
  hybrid: 'hybrid',
  autonomous: 'autonomous',
  services: 'services',
  financing: 'financing',
  projects: 'projects',
  youtube: 'youtube',
  about: 'about',
  contacts: 'contacts',
  calculator: 'calculator',
  faq: 'faq',
  investments: 'investments'
};

const routes = {
  'index.html': 'home',
  'solutions.html': 'solutions',
  'ses.html': 'ses',
  'ses-industrial.html': 'ses-industrial',
  'ses-roof.html': 'ses-roof',
  'ses-consumption.html': 'ses-consumption',
  'uze.html': 'uze',
  'hybrid.html': 'hybrid',
  'autonomous.html': 'autonomous',
  'services.html': 'services',
  'financing.html': 'financing',
  'financing-raiffeisen.html': 'financing',
  'projects.html': 'projects',
  'project.html': 'projects',
  'blog.html': 'blog',
  'article.html': 'blog',
  'youtube.html': 'youtube',
  'about.html': 'about',
  'contacts.html': 'contacts',
  'calculator.html': 'calculator',
  'faq.html': 'faq',
  'investments.html': 'investments'
};

function phpAsset(asset) {
  return `<?php echo esc_url( rayton_v2_asset_url( '${asset}' ) ); ?>`;
}

function phpRoute(route, hash = '') {
  return `<?php echo esc_url( rayton_v2_page_url( '${route}', '${hash}' ) ); ?>`;
}

function transform(markup) {
  markup = markup.replace(/<img\b[^>]*\bsrc=["'](assets\/[^"'?#]+)(?:\?[^"']*)?["'][^>]*>/gi, match => {
    const asset = match.match(/\bsrc=["'](assets\/[^"'?#]+)/i)[1];
    return fs.existsSync(path.join(root, asset)) ? match : '';
  });
  markup = markup.replace(/assets\/[^\s"')?,]+/g, asset => phpAsset(asset));
  markup = markup.replace(/href=["']project\.html\?id=([^"'&]+)["']/gi, (match, id) => `href="${phpRoute('projects', `#${id}`)}"`);
  markup = markup.replace(/(href|action)=["'](?:\.\/)?([^"']+\.html)(#[^"']*)?["']/gi, (match, attribute, file, hash = '') => {
    const base = path.basename(file);
    if (base === 'project.html') {
      const id = (match.match(/[?&]id=([^&#"']+)/i) || [])[1] || 'project-slug';
      return `${attribute}="${phpRoute('projects', `#${id}`)}"`;
    }
    if (file.startsWith('articles/')) return `${attribute}="${phpRoute('blog')}"`;
    const route = routes[base] || 'home';
    return `${attribute}="${phpRoute(route, hash)}"`;
  });
  markup = markup.replace(/\saction=["']mailto:[^"']+["']/gi, '');
  markup = markup.replace(/https?:\/\/(?:www\.)?rayton\.com\.ua(\/[^\s"']*)?/gi, (match, pathname = '/') => `<?php echo esc_url( home_url( '${pathname}' ) ); ?>`);
  return markup;
}

function localizeFooter(markup) {
  const labels = {
    'Рішення': 'solutions',
    'Для бізнесу': 'business',
    'Компанія': 'company',
    'Контакти': 'contacts',
    'Проєкти': 'projects',
    'Блог': 'blog',
    'Фінансування': 'financing'
  };
  for (const [label, key] of Object.entries(labels)) {
    markup = markup.replaceAll(`>${label}<`, `><?php echo esc_html( rayton_v2_ui( '${key}' ) ); ?><`);
  }
  return markup;
}

fs.mkdirSync(path.join(output, 'pages'), { recursive: true });
for (const [source, destination] of Object.entries(pages)) {
  const html = fs.readFileSync(path.join(root, `${source}.html`), 'utf8');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
  if (!main) throw new Error(`Missing <main> in ${source}.html`);
  fs.writeFileSync(path.join(output, `pages/${destination}.php`), `<?php\n/** Generated from the ${source} static source; source remains read-only. */\n?>\n${transform(main[0])}\n`);
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sprite = index.match(/<!-- SVG sprite[^>]*-->\s*(<svg[\s\S]*?<\/svg>)/i);
const footer = index.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i);
if (!sprite || !footer) throw new Error('Missing shared sprite or footer');
fs.writeFileSync(path.join(output, 'sprite.php'), `<?php /** Shared inline icon sprite. */ ?>\n${sprite[1]}\n`);
fs.writeFileSync(path.join(output, 'footer-chrome.php'), `<?php /** Shared redesign footer chrome. */ ?>\n${localizeFooter(transform(footer[0]))}\n`);

process.stdout.write(`Converted ${Object.keys(pages).length} page parts plus shared sprite/footer.\n`);
