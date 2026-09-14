'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const routes = fs.readFileSync(
  path.resolve(__dirname, '../wordpress/themes/rayton-v2/inc/routes.php'),
  'utf8'
);

const blog = fs.readFileSync(
  path.resolve(__dirname, '../wordpress/themes/rayton-v2/template-parts/pages/blog.php'),
  'utf8'
);
const home = fs.readFileSync(
  path.resolve(__dirname, '../wordpress/themes/rayton-v2/home.php'),
  'utf8'
);

test('blog is a first-class packaged page instead of a special home.php redirect', () => {
  assert.match(routes, /'blog'\s*=>\s*array\([^\n]*'part'\s*=>\s*'blog'/);
  assert.doesNotMatch(routes, /'blog'\s*===\s*\$virtual_key[\s\S]{0,120}home\.php/);
  assert.match(home, /rayton_v2_render_packaged_page\(\s*'blog'\s*\)/);
});

test('blog routing recognizes production aliases and old pagination forms', () => {
  const virtualRoute = routes.slice(
    routes.indexOf('function rayton_v2_virtual_page_key'),
    routes.indexOf('function rayton_v2_virtual_page_template')
  );
  assert.match(virtualRoute, /2\s*===\s*count\(\s*\$segments\s*\).*ctype_digit\(\s*\$segments\[1\]\s*\)/s);
  assert.match(virtualRoute, /3\s*===\s*count\(\s*\$segments\s*\).*'page'\s*===\s*\$segments\[1\].*ctype_digit\(\s*\$segments\[2\]\s*\)/s);

  assert.match(routes, /'slugs'\s*=>\s*array\(\s*'blogs'\s*,\s*'blog'\s*\)/);
});

test('blog shell matches the approved local hero and uses WordPress posts', () => {
  assert.match(blog, /class="media-blog-hero"/);
  assert.match(blog, /class="container partner-project__grid"/);
  assert.match(blog, /assets\/img\/media\/article-8270\.jpg/);
  assert.match(blog, /new\s+WP_Query\s*\(/);
  assert.match(blog, /'post_type'\s*=>\s*'post'/);
  assert.match(blog, /'suppress_filters'\s*=>\s*false/);
  assert.match(blog, /the_post_thumbnail\s*\(/);
  assert.match(blog, /the_excerpt\s*\(/);
});

test('blog does not mutate the global request into a different WordPress template', () => {
  assert.doesNotMatch(routes, /rayton_v2_prepare_blog_request/);
  assert.doesNotMatch(routes, /rayton_v2_prepare_blog_query/);
});
