'use strict';
// Exports icon-like subtrees from a flattened page model to standalone SVG files.
const fs = require('fs');
const path = require('path');

const SHAPE = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'ELLIPSE', 'ROUNDED_RECTANGLE', 'STAR', 'LINE', 'REGULAR_POLYGON']);

function build(flat) {
  const byId = new Map(flat.map(n => [n.id, n]));
  const kids = new Map();
  for (const n of flat) { if (!kids.has(n.parent)) kids.set(n.parent, []); kids.get(n.parent).push(n); }
  return { byId, kids };
}

function descendants(id, kids, acc = []) {
  for (const c of kids.get(id) || []) { acc.push(c); descendants(c.id, kids, acc); }
  return acc;
}

function isIconRoot(n, kids) {
  if (n.w == null || n.w > 80 || n.h > 80 || n.w < 4) return false;
  const d = descendants(n.id, kids);
  if (!d.length) return SHAPE.has(n.type) && (n.fillGeometry || n.strokeGeometry);
  if (d.length > 40) return false;
  return d.every(x => SHAPE.has(x.type) || x.type === 'FRAME' || x.type === 'INSTANCE') &&
    d.some(x => x.fillGeometry || x.strokeGeometry);
}

function colorOf(node, key) {
  const p = (node[key] || []).find(f => f.type === 'SOLID');
  if (!p) return null;
  if (p.opacity != null && p.opacity < 1 && p.color.startsWith('#')) {
    const n = parseInt(p.color.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${p.opacity})`;
  }
  return p.color;
}

function toSVG(root, kids, opts = {}) {
  const parts = [];
  const paint = (n, mat) => {
    if (!n.visible) return;
    const g = [];
    const noFill = !(n.fills && n.fills.length);
    const isBox = n.type === 'FRAME' || n.type === 'INSTANCE' || n.type === 'SYMBOL';
    if (n.fillGeometry && !(isBox && noFill)) {
      const col = colorOf(n, 'fills') || (opts.mono ? 'currentColor' : '#000');
      for (const p of n.fillGeometry) g.push(`<path d="${p.d}" fill="${opts.mono ? 'currentColor' : col}"${p.rule === 'EVENODD' ? ' fill-rule="evenodd" clip-rule="evenodd"' : ''}/>`);
    }
    if (n.strokeGeometry) {
      const col = colorOf(n, 'strokes') || (opts.mono ? 'currentColor' : '#000');
      for (const p of n.strokeGeometry) g.push(`<path d="${p.d}" fill="${opts.mono ? 'currentColor' : col}"${p.rule === 'EVENODD' ? ' fill-rule="evenodd" clip-rule="evenodd"' : ''}/>`);
    }
    if (!g.length && n.type === 'ELLIPSE' && n.w) {
      const col = colorOf(n, 'fills');
      if (col) g.push(`<ellipse cx="${n.w / 2}" cy="${n.h / 2}" rx="${n.w / 2}" ry="${n.h / 2}" fill="${opts.mono ? 'currentColor' : col}"/>`);
    }
    if (!g.length && (n.type === 'ROUNDED_RECTANGLE' || isBox) && n.w) {
      const col = colorOf(n, 'fills');
      if (col) g.push(`<rect width="${n.w}" height="${n.h}" rx="${(n.radius && n.radius[0]) || 0}" fill="${opts.mono ? 'currentColor' : col}"/>`);
    }
    if (g.length) {
      const m = `matrix(${mat.a} ${mat.b} ${mat.c} ${mat.d} ${+mat.e.toFixed(3)} ${+mat.f.toFixed(3)})`;
      parts.push(`<g transform="${m}">${g.join('')}</g>`);
    }
  };
  const mul = (p, n) => {
    const l = n.m ? { a: n.m.a, b: n.m.b, c: n.m.c, d: n.m.d } : { a: 1, b: 0, c: 0, d: 1 };
    const e = n.lx, f = n.ly;
    return {
      a: p.a * l.a + p.c * l.b, b: p.b * l.a + p.d * l.b,
      c: p.a * l.c + p.c * l.d, d: p.b * l.c + p.d * l.d,
      e: p.a * e + p.c * f + p.e, f: p.b * e + p.d * f + p.f,
    };
  };
  const walk = (n, parentMat) => {
    const mat = mul(parentMat, n);
    paint(n, mat);
    for (const c of kids.get(n.id) || []) walk(c, mat);
  };
  // keep the root's own rotation (it defines which way the glyph points) but
  // re-anchor the rotated box to the SVG viewBox origin
  let rootMat = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  if (root.m) {
    const { a, b, c, d } = root.m;
    const pts = [[0, 0], [root.w, 0], [0, root.h], [root.w, root.h]]
      .map(([x, y]) => [a * x + c * y, b * x + d * y]);
    const minX = Math.min(...pts.map(p => p[0])), minY = Math.min(...pts.map(p => p[1]));
    rootMat = { a, b, c, d, e: -minX, f: -minY };
  }
  paint(root, rootMat);
  for (const c of kids.get(root.id) || []) walk(c, rootMat);
  if (!parts.length) return null;
  const w = +root.w.toFixed(2), h = +root.h.toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">${parts.join('')}</svg>`;
}

module.exports = { build, descendants, isIconRoot, toSVG };

if (require.main === module) {
  const files = process.argv.slice(2);
  const outDir = process.env.ICON_OUT || 'icons_out';
  fs.mkdirSync(outDir, { recursive: true });
  const seen = new Map();
  for (const f of files) {
    const flat = JSON.parse(fs.readFileSync(f, 'utf8'));
    const { kids } = build(flat);
    for (const n of flat) {
      if (!isIconRoot(n, kids)) continue;
      // skip if an ancestor already qualifies
      let p = n.parent, skip = false;
      while (p) { const par = flat.find(x => x.id === p); if (!par) break; if (isIconRoot(par, kids)) { skip = true; break; } p = par.parent; }
      if (skip) continue;
      const svg = toSVG(n, kids, { mono: false });
      if (!svg) continue;
      const key = svg.replace(/translate\([^)]*\)/g, '');
      if (seen.has(key)) continue;
      const base = (n.name || 'icon').toLowerCase().replace(/[^a-z0-9а-яіїєґ]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || 'icon';
      let name = base, i = 1;
      while (fs.existsSync(path.join(outDir, name + '.svg'))) name = base + '-' + (++i);
      seen.set(key, name);
      fs.writeFileSync(path.join(outDir, name + '.svg'), svg);
    }
  }
  console.log('icons written:', fs.readdirSync(outDir).length);
}
