'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repositoryRoot = path.resolve(__dirname, '..');
const themeSource = path.join(repositoryRoot, 'wordpress/themes/rayton-v2');
const allowlistPath = path.join(repositoryRoot, 'tools/rayton-v2-assets.json');
const forbiddenPath = /(?:^|\/)(?:tests?|\.git|\.idea|_design)(?:\/|$)|\.fig$/i;

function readAllowlist() {
  const config = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
  if (!Array.isArray(config.assets)) throw new Error('tools/rayton-v2-assets.json must contain an assets array');
  return config.assets;
}

function validateAsset(asset) {
  if (!asset || typeof asset.source !== 'string' || typeof asset.destination !== 'string') {
    throw new Error('Each asset needs string source and destination fields');
  }
  if (!asset.source.startsWith('assets/') || !asset.destination.startsWith('assets/')) {
    throw new Error(`Asset paths must stay below assets/: ${asset.source}`);
  }
  if (forbiddenPath.test(asset.source) || forbiddenPath.test(asset.destination) || asset.source.includes('..') || asset.destination.includes('..')) {
    throw new Error(`Forbidden asset path: ${asset.source}`);
  }
	if (!fs.existsSync(path.join(repositoryRoot, asset.source))) throw new Error(`Missing allowlisted asset: ${asset.source}`);
}

function walkFiles(directory) {
	const files = [];
	for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...walkFiles(absolutePath));
		else files.push(absolutePath);
	}
	return files;
}

function stripInactiveMarkup(contents) {
	return contents
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\/\*[\s\S]*?\*\//g, '');
}

function cleanReference(reference) {
	return reference.split(/[?#]/, 1)[0].replace(/^\/+/, '');
}

function directAssetReferences(contents) {
	const references = new Set();
	for (const match of stripInactiveMarkup(contents).matchAll(/assets\/[A-Za-z0-9_./@()-]+/g)) {
		references.add(cleanReference(match[0]));
	}
	return references;
}

function runtimeAssetReferences(contents) {
	const references = new Set();
	const activeContents = stripInactiveMarkup(contents);
	for (const match of activeContents.matchAll(/['"`]((?:fonts|icons|img)\/[A-Za-z0-9_./@()-]+)['"`]/g)) {
		references.add(`assets/${cleanReference(match[1])}`);
	}
	return references;
}

function cssAssetReferences(contents, stylesheetDestination) {
	const references = new Set();
	const activeContents = stripInactiveMarkup(contents);
	for (const match of activeContents.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
		const rawReference = match[2].trim();
		if (!rawReference || /^(?:data:|https?:|\/\/|#)/i.test(rawReference)) continue;
		if (rawReference.startsWith('/')) throw new Error(`Root-relative CSS asset is not package-safe: ${rawReference}`);
		const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(stylesheetDestination), cleanReference(rawReference)));
		if (!resolved.startsWith('assets/')) throw new Error(`CSS asset escapes the theme assets directory: ${rawReference}`);
		references.add(resolved);
	}
	return references;
}

function auditAssetDependencies(assets = readAllowlist()) {
	const byDestination = new Map();
	for (const asset of assets) {
		if (byDestination.has(asset.destination)) throw new Error(`Duplicate asset destination: ${asset.destination}`);
		byDestination.set(asset.destination, asset);
	}

	const required = new Set();
	const missing = new Set();
	const visited = new Set();

	function visitAsset(destination) {
		const normalizedDestination = cleanReference(destination);
		if (!normalizedDestination.startsWith('assets/') || visited.has(normalizedDestination)) return;
		visited.add(normalizedDestination);

		const themeFile = path.join(themeSource, normalizedDestination);
		const allowlisted = byDestination.get(normalizedDestination);
		let sourceFile = themeFile;
		if (!fs.existsSync(sourceFile) && allowlisted) sourceFile = path.join(repositoryRoot, allowlisted.source);
		if (!fs.existsSync(sourceFile)) {
			missing.add(normalizedDestination);
			return;
		}
		if (allowlisted) required.add(normalizedDestination);

		const extension = path.extname(normalizedDestination).toLowerCase();
		if (!['.css', '.js'].includes(extension)) return;
		const contents = fs.readFileSync(sourceFile, 'utf8');
		for (const reference of directAssetReferences(contents)) visitAsset(reference);
		if (extension === '.js') {
			for (const reference of runtimeAssetReferences(contents)) visitAsset(reference);
		}
		if (extension === '.css') {
			for (const reference of cssAssetReferences(contents, normalizedDestination)) visitAsset(reference);
		}
	}

	for (const sourceFile of walkFiles(themeSource)) {
		const extension = path.extname(sourceFile).toLowerCase();
		if (!['.php', '.css'].includes(extension)) continue;
		const contents = fs.readFileSync(sourceFile, 'utf8');
		for (const reference of directAssetReferences(contents)) visitAsset(reference);
		if (extension === '.css') {
			const destination = path.relative(themeSource, sourceFile).split(path.sep).join('/');
			for (const reference of cssAssetReferences(contents, destination)) visitAsset(reference);
		}
	}

	const themeAssetsDirectory = path.join(themeSource, 'assets');
	const unusedThemeAssets = fs.existsSync(themeAssetsDirectory)
		? walkFiles(themeAssetsDirectory)
			.map(sourceFile => path.relative(themeSource, sourceFile).split(path.sep).join('/'))
			.filter(destination => !visited.has(destination))
		: [];

	return {
		required: [...required].sort(),
		missing: [...missing].sort(),
		unused: assets.map(asset => asset.destination).filter(destination => !required.has(destination)).concat(unusedThemeAssets).sort()
	};
}

function buildThemeZip(options = {}) {
  if (!fs.existsSync(themeSource)) throw new Error(`Missing theme source: ${themeSource}`);

	const assets = readAllowlist();
	assets.forEach(validateAsset);
	const audit = auditAssetDependencies(assets);
	if (audit.missing.length) throw new Error(`Missing referenced assets:\n${audit.missing.join('\n')}`);
	if (audit.unused.length) throw new Error(`Unused allowlisted assets:\n${audit.unused.join('\n')}`);

  const ownsStagingParent = !options.stagingParent;
  const stagingParent = options.stagingParent || fs.mkdtempSync(path.join(os.tmpdir(), 'rayton-v2-build-'));
  const stagedTheme = path.join(stagingParent, 'rayton-v2');
  const outputPath = path.resolve(options.outputPath || path.join(repositoryRoot, 'dist/rayton-v2.zip'));

  fs.rmSync(stagedTheme, { recursive: true, force: true });
  fs.cpSync(themeSource, stagedTheme, {
    recursive: true,
    filter(sourcePath) {
      const relativePath = path.relative(themeSource, sourcePath).split(path.sep).join('/');
      return !relativePath || !forbiddenPath.test(relativePath);
    }
  });

  for (const asset of assets) {
    const destination = path.join(stagedTheme, asset.destination);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(repositoryRoot, asset.source), destination);
  }

  const manifest = { assets: assets.map(asset => asset.destination).sort() };
  fs.writeFileSync(path.join(stagedTheme, 'asset-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.rmSync(outputPath, { force: true });
  execFileSync('zip', ['-X', '-q', '-r', outputPath, 'rayton-v2'], { cwd: stagingParent });

  if (ownsStagingParent) fs.rmSync(stagingParent, { recursive: true, force: true });
  return outputPath;
}

if (require.main === module) {
  const outputPath = buildThemeZip();
  process.stdout.write(`${path.relative(repositoryRoot, outputPath)}\n`);
}

module.exports = { auditAssetDependencies, buildThemeZip };
