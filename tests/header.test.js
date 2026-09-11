'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const media = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/media.json'), 'utf8'));
const latestArticle = [...media.articles].sort((a, b) => b.date.localeCompare(a.date))[0];
const latestVideo = media.videos[0];
const pages = [
  ...fs.readdirSync(root)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(root, file)),
  ...fs.readdirSync(path.join(root, 'articles'))
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(root, 'articles', file))
];

const pagesWithHeader = pages.filter(file => fs.readFileSync(file, 'utf8').includes('id="site-header"'));

test('shared header is populated on every page that uses it', () => {
  assert.ok(pagesWithHeader.length > 30);
  for (const file of pagesWithHeader) {
    const html = fs.readFileSync(file, 'utf8');
    assert.equal((html.match(/id="site-header"/g) || []).length, 1, path.relative(root, file));
    assert.doesNotMatch(html, /\{\{latest/);
    assert.doesNotMatch(html, /data-locale="ru"/);
    assert.match(html, /id="header-notifications"/);
    assert.match(html, /id="header-contact"/);
    assert.match(html, new RegExp(latestVideo.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('Russian translations stay in code but cannot be selected on the frontend', () => {
  const dictionary = fs.readFileSync(path.join(root, 'assets/js/locales/header.js'), 'utf8');
  const i18n = fs.readFileSync(path.join(root, 'assets/js/i18n.js'), 'utf8');
  assert.match(dictionary, /\bru:\s*\{\s*header:/);
  assert.match(i18n, /supported\s*=\s*\['uk',\s*'en'\]/);
});

test('latest media links and nested asset paths are generated correctly', () => {
  const rootPage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const articlePage = fs.readFileSync(path.join(root, latestArticle.url), 'utf8');

  assert.match(rootPage, new RegExp(`href="${latestArticle.url}"`));
  assert.match(rootPage, /src="assets\/icons\/header\/896-22555-imgBell\.svg"/);
  assert.match(articlePage, new RegExp(`href="\.\.\/${latestArticle.url}"`));
  assert.match(articlePage, /src="\.\.\/assets\/icons\/header\/896-22555-imgBell\.svg"/);
});

test('all Figma-exported header assets are present', () => {
  for (const file of [
    '896-22555-imgBell.svg',
    '896-22663-imgBellOpen.svg',
    '896-22689-imgPolygon2.svg',
    '896-22718-imgVideoPlayCircle.svg',
    '896-22719-imgVideoPlayTriangle.svg'
  ]) {
    assert.ok(fs.existsSync(path.join(root, 'assets/icons/header', file)), file);
  }
});
