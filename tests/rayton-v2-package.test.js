'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'tools/rayton-v2-assets.json');

test('asset allowlist exactly matches reachable PHP, JavaScript, and recursive CSS dependencies', () => {
	const { auditAssetDependencies } = require('../tools/build-rayton-v2.js');
	const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	const audit = auditAssetDependencies();

	assert.deepEqual(audit.missing, []);
	assert.deepEqual(audit.unused, []);

	const withoutHeaderLogo = config.assets.filter(asset => asset.destination !== 'assets/icons/header/871-28883-imgRaytonWhiteLogo.svg');
	assert.ok(auditAssetDependencies(withoutHeaderLogo).missing.includes('assets/icons/header/871-28883-imgRaytonWhiteLogo.svg'));

	const withoutCssFont = config.assets.filter(asset => asset.destination !== 'assets/fonts/montserrat-latin-400.woff2');
	assert.ok(auditAssetDependencies(withoutCssFont).missing.includes('assets/fonts/montserrat-latin-400.woff2'));

	const withCommentedOnlyImage = config.assets.concat({
		source: 'assets/img/company/demian.webp',
		destination: 'assets/img/company/demian.webp'
	});
	assert.ok(auditAssetDependencies(withCommentedOnlyImage).unused.includes('assets/img/company/demian.webp'));
});

test('operating documentation covers safe installation and rollback', () => {
	const install = fs.readFileSync(path.join(root, 'docs/RAYTON_V2_INSTALL.md'), 'utf8');
	assert.match(install, /full database.*wp-content.*backup/is);
	assert.match(install, /upload/i);
	assert.match(install, /Live Preview/i);
	assert.match(install, /Neve/);
	assert.match(install, /rollback/i);
});

test('asset allowlist contains only existing, safe source files', () => {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  assert.ok(Array.isArray(config.assets));

  for (const asset of config.assets) {
    assert.match(asset.source, /^assets\//);
    assert.match(asset.destination, /^assets\//);
    assert.doesNotMatch(asset.source, /(?:^|\/)\.\.|\.fig$|(?:^|\/)_design(?:\/|$)/);
    assert.ok(fs.existsSync(path.join(root, asset.source)), asset.source);
  }
});

test('builder creates one clean rayton-v2 ZIP root and an exact asset manifest', () => {
  const { buildThemeZip } = require('../tools/build-rayton-v2.js');
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'rayton-v2-package-'));
  const zipPath = path.join(temporaryDirectory, 'rayton-v2.zip');

  buildThemeZip({ outputPath: zipPath, stagingParent: temporaryDirectory });

  const entries = execFileSync('unzip', ['-Z1', zipPath], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
  assert.ok(entries.length > 0);
  assert.ok(entries.every(entry => entry.startsWith('rayton-v2/')));
  assert.ok(entries.every(entry => !/(?:^|\/)(?:tests?|\.git|\.idea|_design)(?:\/|$)|\.fig$/i.test(entry)));

  const manifestText = execFileSync('unzip', ['-p', zipPath, 'rayton-v2/asset-manifest.json'], { encoding: 'utf8' });
  const manifest = JSON.parse(manifestText);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  assert.deepEqual(manifest.assets, config.assets.map(asset => asset.destination).sort());

  const packagedMedia = entries
    .filter(entry => /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(entry))
    .map(entry => entry.replace(/^rayton-v2\//, ''))
    .sort();
  assert.deepEqual(packagedMedia, manifest.assets.filter(asset => /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(asset)).sort());

	const projectData = fs.readFileSync(path.join(root, 'wordpress/themes/rayton-v2/assets/js/projects-data.js'), 'utf8');
	const projectIds = new Set([...projectData.matchAll(/^\s*\['([^']+)'/gm)].map(match => match[1]));
	const packagedPhp = entries
		.filter(entry => entry.endsWith('.php'))
		.map(entry => execFileSync('unzip', ['-p', zipPath, entry], { encoding: 'utf8' }))
		.join('\n');
	assert.doesNotMatch(packagedPhp, /#project-slug/);
	for (const match of packagedPhp.matchAll(/rayton_v2_page_url\(\s*'projects'\s*,\s*'#([^']+)'\s*\)/g)) {
		assert.ok(projectIds.has(match[1]), `unknown packaged project hash: ${match[1]}`);
	}
});
