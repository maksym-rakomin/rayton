'use strict';
// Renders the flattened Figma model to an absolutely-positioned HTML reference page.
const fs = require('fs');
const path = require('path');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function inv2x3(m) {
  const det = m.m00 * m.m11 - m.m01 * m.m10;
  if (!det) return null;
  const a = m.m11 / det, b = -m.m01 / det, c = -m.m10 / det, d = m.m00 / det;
  return { m00: a, m01: b, m02: -(a * m.m02 + b * m.m12), m10: c, m11: d, m12: -(c * m.m02 + d * m.m12) };
}
const apply = (m, x, y) => ({ x: m.m00 * x + m.m01 * y + m.m02, y: m.m10 * x + m.m11 * y + m.m12 });

function linearGradientCSS(p, w, h) {
  const inv = p.transform ? inv2x3(p.transform) : null;
  if (!inv || !w || !h) return `linear-gradient(180deg, ${p.stops.map(s => `${s.color} ${(s.pos * 100).toFixed(2)}%`).join(', ')})`;
  const a = apply(inv, 0, 0), b = apply(inv, 1, 0);
  const sx = a.x * w, sy = a.y * h, ex = b.x * w, ey = b.y * h;
  const dx = ex - sx, dy = ey - sy;
  const L = Math.hypot(dx, dy) || 1;
  const ang = Math.atan2(dx, -dy); // CSS: 0deg = to top, clockwise
  const cssAngle = (ang * 180 / Math.PI + 360) % 360;
  const Lc = Math.abs(w * Math.sin(ang)) + Math.abs(h * Math.cos(ang));
  const ux = dx / L, uy = dy / L;
  const t0 = (sx - w / 2) * ux + (sy - h / 2) * uy;
  const stops = p.stops.map(s => {
    const t = t0 + s.pos * L;
    const pct = ((t + Lc / 2) / Lc) * 100;
    return `${s.color} ${pct.toFixed(2)}%`;
  });
  return `linear-gradient(${cssAngle.toFixed(2)}deg, ${stops.join(', ')})`;
}

function radialGradientCSS(p, w, h) {
  const inv = p.transform ? inv2x3(p.transform) : null;
  if (!inv || !w || !h) return `radial-gradient(circle, ${p.stops.map(s => `${s.color} ${(s.pos * 100).toFixed(2)}%`).join(', ')})`;
  const c = apply(inv, 0.5, 0.5), rx = apply(inv, 1, 0.5), ry = apply(inv, 0.5, 1);
  const cx = c.x * w, cy = c.y * h;
  const RX = Math.hypot((rx.x - c.x) * w, (rx.y - c.y) * h);
  const RY = Math.hypot((ry.x - c.x) * w, (ry.y - c.y) * h);
  const stops = p.stops.map(s => `${s.color} ${(s.pos * 100).toFixed(2)}%`);
  return `radial-gradient(${RX.toFixed(2)}px ${RY.toFixed(2)}px at ${cx.toFixed(2)}px ${cy.toFixed(2)}px, ${stops.join(', ')})`;
}

function imageCSS(p, w, h, imgUrl) {
  const url = imgUrl(p.image);
  if (!url) return null;
  let size = 'cover', pos = 'center', repeat = 'no-repeat';
  if (p.scaleMode === 'FIT') size = 'contain';
  else if (p.scaleMode === 'STRETCH') { size = '100% 100%'; }
  else if (p.scaleMode === 'TILE') { repeat = 'repeat'; size = 'auto'; }
  return { image: `url('${url}')`, size, pos, repeat };
}

function bgLayers(node, imgUrl) {
  const imgs = [], sizes = [], poss = [], reps = [];
  let solid = null;
  // Figma paints: first = bottom. CSS background layers: first = top → reverse.
  const fills = (node.fills || []).slice().reverse();
  for (const p of fills) {
    if (p.type === 'SOLID') {
      const col = p.opacity < 1 ? mixAlpha(p.color, p.opacity) : p.color;
      if (imgs.length === 0) solid = col;
      else { imgs.push(`linear-gradient(${col}, ${col})`); sizes.push('auto'); poss.push('0 0'); reps.push('repeat'); }
    } else if (p.type === 'GRADIENT_LINEAR') {
      imgs.push(linearGradientCSS(p, node.w, node.h)); sizes.push('auto'); poss.push('0 0'); reps.push('no-repeat');
    } else if (p.type === 'GRADIENT_RADIAL' || p.type === 'GRADIENT_DIAMOND' || p.type === 'GRADIENT_ANGULAR') {
      imgs.push(radialGradientCSS(p, node.w, node.h)); sizes.push('auto'); poss.push('0 0'); reps.push('no-repeat');
    } else if (p.type === 'IMAGE') {
      const i = imageCSS(p, node.w, node.h, imgUrl);
      if (i) { imgs.push(i.image); sizes.push(i.size); poss.push(i.pos); reps.push(i.repeat); }
    }
  }
  const css = [];
  if (imgs.length) {
    css.push(`background-image:${imgs.join(',')}`);
    css.push(`background-size:${sizes.join(',')}`);
    css.push(`background-position:${poss.join(',')}`);
    css.push(`background-repeat:${reps.join(',')}`);
  }
  if (solid) css.push(`background-color:${solid}`);
  return css;
}

function mixAlpha(color, op) {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (m) {
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${op})`;
  }
  const r = /^rgba?\(([^)]+)\)$/.exec(color);
  if (r) { const parts = r[1].split(',').map(s => s.trim()); const a = parts[3] ? parseFloat(parts[3]) : 1; return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${(a * op).toFixed(3)})`; }
  return color;
}

function effectsCSS(node) {
  const shadows = [], filters = [], backdrop = [];
  for (const e of node.effects || []) {
    if (e.type === 'DROP_SHADOW') shadows.push(`${e.x}px ${e.y}px ${e.radius}px ${e.spread}px ${e.color}`);
    else if (e.type === 'INNER_SHADOW') shadows.push(`inset ${e.x}px ${e.y}px ${e.radius}px ${e.spread}px ${e.color}`);
    else if (e.type === 'BACKGROUND_BLUR') backdrop.push(`blur(${(e.radius / 2).toFixed(2)}px)`);
    else if (e.type === 'FOREGROUND_BLUR' || e.type === 'LAYER_BLUR') filters.push(`blur(${(e.radius / 2).toFixed(2)}px)`);
  }
  const css = [];
  if (shadows.length) css.push(`box-shadow:${shadows.join(',')}`);
  if (filters.length) css.push(`filter:${filters.join(' ')}`);
  if (backdrop.length) css.push(`backdrop-filter:${backdrop.join(' ')};-webkit-backdrop-filter:${backdrop.join(' ')}`);
  return css;
}

const WEIGHT = { Thin: 100, ExtraLight: 200, Light: 300, Regular: 400, Medium: 500, SemiBold: 600, Bold: 700, ExtraBold: 800, Black: 900 };
function fontCSS(t) {
  const css = [];
  css.push(`font-family:'${t.fontFamily || 'Montserrat'}', sans-serif`);
  const st = (t.fontStyle || 'Regular');
  const italic = /italic/i.test(st);
  const w = WEIGHT[st.replace(/\s*italic/i, '')] || 400;
  css.push(`font-weight:${w}`);
  if (italic) css.push('font-style:italic');
  if (t.fontSize) css.push(`font-size:${t.fontSize}px`);
  if (t.lineHeight) css.push(`line-height:${t.lineHeight.u === 'PIXELS' ? t.lineHeight.v + 'px' : (t.lineHeight.v / 100)}`);
  if (t.letterSpacing && t.letterSpacing.v) css.push(`letter-spacing:${t.letterSpacing.u === 'PERCENT' ? (t.letterSpacing.v / 100 * (t.fontSize || 16)).toFixed(3) + 'px' : t.letterSpacing.v + 'px'}`);
  if (t.textCase === 'UPPER') css.push('text-transform:uppercase');
  else if (t.textCase === 'LOWER') css.push('text-transform:lowercase');
  else if (t.textCase === 'TITLE') css.push('text-transform:capitalize');
  if (t.decoration === 'UNDERLINE') css.push('text-decoration:underline');
  else if (t.decoration === 'STRIKETHROUGH') css.push('text-decoration:line-through');
  css.push(`text-align:${{ LEFT: 'left', RIGHT: 'right', CENTER: 'center', JUSTIFIED: 'justify' }[t.align] || 'left'}`);
  return css;
}

function textHTML(node) {
  const t = node.text;
  const chars = t.characters || '';
  if (!t.styleOverrides || !t.charStyleIDs) return esc(chars).replace(/\n/g, '<br>');
  const table = new Map(t.styleOverrides.map(s => [s.id, s]));
  const ids = t.charStyleIDs;
  let out = '', i = 0;
  const arr = Array.from(chars);
  while (i < arr.length) {
    const id = ids[i] || 0;
    let j = i;
    while (j < arr.length && (ids[j] || 0) === id) j++;
    const seg = esc(arr.slice(i, j).join('')).replace(/\n/g, '<br>');
    const s = table.get(id);
    if (s && id) {
      const css = [];
      if (s.fontStyle) { const w = WEIGHT[s.fontStyle.replace(/\s*italic/i, '')] || 400; css.push(`font-weight:${w}`); if (/italic/i.test(s.fontStyle)) css.push('font-style:italic'); }
      if (s.fontSize) css.push(`font-size:${s.fontSize}px`);
      if (s.fills && s.fills[0] && s.fills[0].color) css.push(`color:${s.fills[0].opacity < 1 ? mixAlpha(s.fills[0].color, s.fills[0].opacity) : s.fills[0].color}`);
      if (s.lineHeight) css.push(`line-height:${s.lineHeight.u === 'PIXELS' ? s.lineHeight.v + 'px' : s.lineHeight.v / 100}`);
      if (s.decoration === 'UNDERLINE') css.push('text-decoration:underline');
      out += `<span style="${css.join(';')}">${seg}</span>`;
    } else out += seg;
    i = j;
  }
  return out;
}

function svgFor(node) {
  const paths = [];
  const fill = (node.fills || []).find(f => f.type === 'SOLID');
  const fillCol = fill ? (fill.opacity < 1 ? mixAlpha(fill.color, fill.opacity) : fill.color) : '#000';
  const grad = (node.fills || []).find(f => f.type !== 'SOLID');
  for (const g of node.fillGeometry || []) {
    paths.push(`<path d="${g.d}" fill="${grad ? 'url(#g' + node.id + ')' : fillCol}" fill-rule="${g.rule === 'EVENODD' ? 'evenodd' : 'nonzero'}"/>`);
  }
  const sfill = (node.strokes || []).find(f => f.type === 'SOLID');
  const strokeCol = sfill ? (sfill.opacity < 1 ? mixAlpha(sfill.color, sfill.opacity) : sfill.color) : '#000';
  for (const g of node.strokeGeometry || []) {
    paths.push(`<path d="${g.d}" fill="${strokeCol}" fill-rule="${g.rule === 'EVENODD' ? 'evenodd' : 'nonzero'}"/>`);
  }
  if (!paths.length) return null;
  let defs = '';
  if (grad && grad.stops) {
    const inv = grad.transform ? inv2x3(grad.transform) : null;
    if (inv && grad.type === 'GRADIENT_LINEAR') {
      const a = apply(inv, 0, 0), b = apply(inv, 1, 0);
      defs = `<defs><linearGradient id="g${node.id}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}">${grad.stops.map(s => `<stop offset="${s.pos}" stop-color="${s.color}"/>`).join('')}</linearGradient></defs>`;
    } else {
      defs = `<defs><linearGradient id="g${node.id}" x1="0" y1="0" x2="0" y2="1">${grad.stops.map(s => `<stop offset="${s.pos}" stop-color="${s.color}"/>`).join('')}</linearGradient></defs>`;
    }
  }
  return `<svg width="${node.w}" height="${node.h}" viewBox="0 0 ${node.w} ${node.h}" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;left:0;top:0;overflow:visible">${defs}${paths.join('')}</svg>`;
}

function renderNode(node, imgUrl) {
  const css = [`position:absolute`, `left:${node.x}px`, `top:${node.y}px`];
  if (node.w != null) css.push(`width:${node.w}px`);
  if (node.h != null) css.push(`height:${node.h}px`);
  if (!node.visible) css.push('display:none');
  if (node.opacity !== 1) css.push(`opacity:${node.opacity}`);
  if (node.radius) {
    const r = node.radius;
    css.push(`border-radius:${r[0]}px ${r[1]}px ${r[2]}px ${r[3]}px`);
  }
  if (node.m) {
    const t = node.m;
    css.push(`transform:matrix(${t.a},${t.b},${t.c},${t.d},0,0)`, 'transform-origin:0 0');
  }
  const hasGeom = (node.fillGeometry && node.fillGeometry.length) || (node.strokeGeometry && node.strokeGeometry.length);
  const isShape = ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'REGULAR_POLYGON'].includes(node.type);
  const useSvg = hasGeom && (isShape || (node.type === 'ELLIPSE' && node.arc));

  if (!useSvg && node.type !== 'TEXT') css.push(...bgLayers(node, imgUrl));
  css.push(...effectsCSS(node));
  if (node.type === 'ELLIPSE' && !useSvg) css.push('border-radius:50%');

  // strokes as borders
  if (node.strokes && node.strokes.length && !useSvg) {
    const s = node.strokes.find(x => x.type === 'SOLID');
    if (s) {
      const col = s.opacity < 1 ? mixAlpha(s.color, s.opacity) : s.color;
      const b = node.borders;
      const inset = node.strokeAlign !== 'OUTSIDE';
      if (b && (b[0] !== b[1] || b[1] !== b[2] || b[2] !== b[3])) {
        const sh = [];
        if (b[0]) sh.push(`inset 0 ${b[0]}px 0 0 ${col}`);
        if (b[2]) sh.push(`inset 0 -${b[2]}px 0 0 ${col}`);
        if (b[3]) sh.push(`inset ${b[3]}px 0 0 0 ${col}`);
        if (b[1]) sh.push(`inset -${b[1]}px 0 0 0 ${col}`);
        if (sh.length) {
          const prev = css.find(c => c.startsWith('box-shadow:'));
          if (prev) css[css.indexOf(prev)] = prev + ',' + sh.join(',');
          else css.push(`box-shadow:${sh.join(',')}`);
        }
      } else {
        const wgt = (node.strokeWeight != null ? node.strokeWeight : (b ? b[0] : 1)) || 1;
        const sh = `${inset ? 'inset ' : ''}0 0 0 ${wgt}px ${col}`;
        const prev = css.find(c => c.startsWith('box-shadow:'));
        if (prev) css[css.indexOf(prev)] = prev + ',' + sh;
        else css.push(`box-shadow:${sh}`);
      }
    }
  }

  let inner = '';
  if (useSvg) inner = svgFor(node) || '';
  else if (node.type === 'TEXT' && node.text) {
    css.push(...fontCSS(node.text));
    const f = (node.fills || []).find(x => x.type === 'SOLID');
    if (f) css.push(`color:${f.opacity < 1 ? mixAlpha(f.color, f.opacity) : f.color}`);
    css.push('display:flex', 'flex-direction:column', 'white-space:pre-wrap', 'word-break:normal');
    css.push(`justify-content:${node.text.valign === 'CENTER' ? 'center' : node.text.valign === 'BOTTOM' ? 'flex-end' : 'flex-start'}`);
    if (node.text.autoResize === 'WIDTH_AND_HEIGHT') css.push('white-space:pre');
    inner = `<div style="width:100%">${textHTML(node)}</div>`;
  }
  if (node.clips) css.push('overflow:hidden');

  return { css: css.join(';'), inner };
}

function render(flat, opts) {
  const imgUrl = opts.imgUrl;
  const byId = new Map(flat.map(n => [n.id, n]));
  const kids = new Map();
  for (const n of flat) { if (!kids.has(n.parent)) kids.set(n.parent, []); kids.get(n.parent).push(n); }
  const out = [];
  // coordinates in the flat model are absolute; re-base each node against its parent's origin
  function emit(n) {
    const { css, inner } = renderNode(Object.assign({}, n, { x: n.lx, y: n.ly }), imgUrl);
    out.push(`<div data-n="${esc(n.name)}" data-t="${n.type}" style="${css}">`);
    if (inner) out.push(inner);
    for (const c of kids.get(n.id) || []) emit(c);
    out.push('</div>');
  }
  const root = flat[0];
  emit(root);
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#fff}img{display:block}</style>
</head><body><div style="position:relative;width:${root.w}px;height:${root.h}px;margin:0 auto">${out.join('')}</div></body></html>`;
}

module.exports = { render };

if (require.main === module) {
  const [, , input, output] = process.argv;
  const flat = JSON.parse(fs.readFileSync(input, 'utf8'));
  const imgDir = path.resolve('fig/images');
  const html = render(flat, { imgUrl: h => h ? `images/${h}` : null });
  fs.writeFileSync(output, html);
  console.log('wrote', output, (html.length / 1024).toFixed(0) + 'kb');
}
