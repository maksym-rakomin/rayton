#!/usr/bin/env node
/* Injects the shared partials into every page:
     <!--@sprite-->  →  assets/icons/sprite.svg
     <!--@footer-->  →  the <footer class="site-footer"> block from index.html
   Run after editing the sprite or the footer:  node tools/build-partials.js   */
const fs = require('fs');
const path = require('path');

const headerOnly = process.argv.includes('--header-only');
const root = path.resolve(__dirname, '..');
const sprite = fs.readFileSync(path.join(root, 'assets/icons/sprite.svg'), 'utf8').trim();
const media = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/media.json'), 'utf8'));

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const slice = (from, to) => {
  const a = index.indexOf(from);
  const b = index.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error('block not found in index.html: ' + from);
  return index.slice(a, b + to.length);
};

const footer = slice('<footer class="site-footer">', '</footer>');
const headerTemplate = fs.readFileSync(path.join(root, 'assets/partials/header.html'), 'utf8').trim();

const htmlFiles = [
  ...fs.readdirSync(root).filter(file => file.endsWith('.html')).map(file => path.join(root, file)),
  ...fs.readdirSync(path.join(root, 'articles')).filter(file => file.endsWith('.html')).map(file => path.join(root, 'articles', file))
];

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const latestArticle = [...media.articles].sort((a, b) => b.date.localeCompare(a.date))[0];
const latestVideo = media.videos[0];
const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
const articleDate = new Date(`${latestArticle.date}T00:00:00Z`);
const latestArticleDate = `${String(articleDate.getUTCDate()).padStart(2, '0')} ${months[articleDate.getUTCMonth()]} ${articleDate.getUTCFullYear()}`;

function prefixLocalLinks(fragment, prefix) {
  if (!prefix) return fragment;
  return fragment.replace(/\b(href|src)="([^"#][^"]*)"/g, (match, attr, target) => {
    if (/^(?:[a-z]+:|\/)/i.test(target)) return match;
    return `${attr}="${prefix}${target}"`;
  });
}

function renderHeader(prefix) {
  const values = {
    latestArticleUrl: latestArticle.url,
    latestArticleImage: latestArticle.image,
    latestArticleTitle: latestArticle.title,
    latestArticleDateIso: latestArticle.date,
    latestArticleDate,
    latestVideoUrl: latestVideo.url,
    latestVideoImage: latestVideo.thumbnail,
    latestVideoTitle: latestVideo.title,
    latestVideoDuration: latestVideo.duration
  };
  const populated = headerTemplate.replace(/\{\{([A-Za-z]+)\}\}/g, (_, key) => escapeHtml(values[key]));
  return prefixLocalLinks(populated, prefix);
}

const SPRITE_RE = /<!--@sprite-->|<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="0" height="0"[\s\S]*?<\/svg>/;
const FOOTER_RE = /<!--@footer-->|<footer class="site-footer">[\s\S]*?<\/footer>/;
const HEADER_RE = /<!--@header-->|<header class="site-header"[\s\S]*?<\/header>(\s*<div class="mega-backdrop" hidden><\/div>)?/;

for (const p of htmlFiles) {
  const file = path.relative(root, p);
  const depth = file.split(path.sep).length - 1;
  const prefix = '../'.repeat(depth);
  let html = fs.readFileSync(p, 'utf8');
  const touched = [];
  if (!headerOnly && SPRITE_RE.test(html)) { html = html.replace(SPRITE_RE, sprite); touched.push('sprite'); }
  if (HEADER_RE.test(html)) { html = html.replace(HEADER_RE, renderHeader(prefix)); touched.push('header'); }
  if (!headerOnly && file !== 'index.html' && FOOTER_RE.test(html)) { html = html.replace(FOOTER_RE, prefixLocalLinks(footer, prefix)); touched.push('footer'); }
  if (touched.length) { fs.writeFileSync(p, html); console.log(file, '←', touched.join(' + ')); }
  else console.log(file, '– nothing to inject');
}

/* --- asset cache-busting -------------------------------------------------
   Bumps ?v= on the CSS/JS links (WordPress does the same through the $ver
   argument of wp_enqueue_style/script).

   Opt-in: `node tools/build-partials.js --bump`. Without the flag the version
   stays put, so routine partial syncing does not churn every page in git.   */
if (process.argv.includes('--bump')) {
  const stamp = String(Math.floor(Date.now() / 1000));
  for (const p of htmlFiles) {
    const html = fs.readFileSync(p, 'utf8')
      .replace(/(href="assets\/css\/[a-z]+\.css)(\?v=\d+)?"/g, `$1?v=${stamp}"`)
      .replace(/(src="assets\/js\/[a-z/-]+\.js)(\?v=\d+)?"/g, `$1?v=${stamp}"`);
    fs.writeFileSync(p, html);
  }
  console.log('asset version →', stamp);
}
