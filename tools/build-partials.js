#!/usr/bin/env node
/* Injects the shared partials into every page:
     <!--@sprite-->  →  assets/icons/sprite.svg
     <!--@footer-->  →  the <footer class="site-footer"> block from index.html
   Run after editing the sprite or the footer:  node tools/build-partials.js   */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sprite = fs.readFileSync(path.join(root, 'assets/icons/sprite.svg'), 'utf8').trim();

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const slice = (from, to) => {
  const a = index.indexOf(from);
  const b = index.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error('block not found in index.html: ' + from);
  return index.slice(a, b + to.length);
};

const footer = slice('<footer class="site-footer">', '</footer>');
const header = slice('<header class="site-header"', '<div class="mega-backdrop" hidden></div>');

const SPRITE_RE = /<!--@sprite-->|<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="0" height="0"[\s\S]*?<\/svg>/;
const FOOTER_RE = /<!--@footer-->|<footer class="site-footer">[\s\S]*?<\/footer>/;
const HEADER_RE = /<!--@header-->|<header class="site-header"[\s\S]*?<\/header>(\s*<div class="mega-backdrop" hidden><\/div>)?/;

for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
  const p = path.join(root, file);
  let html = fs.readFileSync(p, 'utf8');
  const touched = [];
  if (SPRITE_RE.test(html)) { html = html.replace(SPRITE_RE, sprite); touched.push('sprite'); }
  if (file !== 'index.html' && HEADER_RE.test(html)) { html = html.replace(HEADER_RE, header); touched.push('header'); }
  if (file !== 'index.html' && FOOTER_RE.test(html)) { html = html.replace(FOOTER_RE, footer); touched.push('footer'); }
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
  for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
    const p = path.join(root, file);
    const html = fs.readFileSync(p, 'utf8')
      .replace(/(href="assets\/css\/[a-z]+\.css)(\?v=\d+)?"/g, `$1?v=${stamp}"`)
      .replace(/(src="assets\/js\/main\.js)(\?v=\d+)?"/g, `$1?v=${stamp}"`);
    fs.writeFileSync(p, html);
  }
  console.log('asset version →', stamp);
}
