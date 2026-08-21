#!/usr/bin/env node
/* Screenshots a page and the matching Figma reference render, then writes
   side-by-side slices into _design/compare/.  Usage:
     node tools/compare.js index.html home 7353                            */
const { execFileSync } = require('child_process');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [page, ref, heightArg] = process.argv.slice(2);
const height = parseInt(heightArg || '7400', 10);

function shot(url, out, h) {
  execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=1536,${h}`,
    `--screenshot=${out}`, '--virtual-time-budget=15000', url], { stdio: 'ignore' });
}

fs.mkdirSync('_design/compare', { recursive: true });
shot(`http://localhost:4173/${page}`, `_design/shots/mine-${ref}.png`, height);
shot(`http://localhost:4173/_design/${ref}.html`, `_design/shots/${ref}.png`, height);
console.log('shots done');
