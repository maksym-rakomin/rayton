'use strict';
// Compact, readable spec dump of a section subtree: geometry + auto-layout + paint + type.
const fs = require('fs');

const flat = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const target = process.argv[3];
const maxDepth = parseInt(process.argv[4] || '99', 10);

const kids = new Map();
for (const n of flat) { if (!kids.has(n.parent)) kids.set(n.parent, []); kids.get(n.parent).push(n); }
const byId = new Map(flat.map(n => [n.id, n]));

let root = flat.find(n => n.id === target) || flat.find(n => n.name === target);
if (!root) { const i = parseInt(target, 10); root = flat[i]; }
if (!root) { console.error('not found:', target); process.exit(1); }

const J = { MIN: 'start', MAX: 'end', CENTER: 'center', SPACE_BETWEEN: 'between', SPACE_EVENLY: 'evenly' };
const A = { MIN: 'start', MAX: 'end', CENTER: 'center', STRETCH: 'stretch', BASELINE: 'baseline' };

function paintStr(p) {
  if (p.type === 'SOLID') return p.color + (p.opacity < 1 ? `/${p.opacity}` : '');
  if (p.type === 'IMAGE') return `img(${p.image?.slice(0, 8) || 'unavailable'},${p.scaleMode})`;
  if (p.type.startsWith('GRADIENT')) return `${p.type.replace('GRADIENT_', '').toLowerCase()}(${(p.stops || []).map(s => s.color + '@' + (s.pos * 100).toFixed(0)).join(' ')})`;
  return p.type;
}

function line(n, d) {
  const pad = '  '.repeat(d);
  const bits = [];
  bits.push(`${n.type === 'ROUNDED_RECTANGLE' ? 'RECT' : n.type}`);
  bits.push(`"${(n.name || '').slice(0, 34)}"`);
  bits.push(`${n.w}×${n.h}`);
  bits.push(`@${n.lx},${n.ly}`);
  if (n.m) bits.push(`rot(${n.m.a},${n.m.b},${n.m.c},${n.m.d})`);
  if (n.layout) {
    const L = n.layout;
    bits.push(`[${L.mode[0]}${L.wrap === 'WRAP' ? 'w' : ''} gap:${L.gap}${L.counterGap != null && L.counterGap !== L.gap ? '/' + L.counterGap : ''} pad:${L.pt},${L.pr},${L.pb},${L.pl} j:${J[L.justify] || L.justify} a:${A[L.align] || L.align}${L.primarySizing === 'RESIZE_TO_FIT' ? ' hug' : ''}${L.counterSizing && L.counterSizing.startsWith('RESIZE') ? ' hugC' : ''}]`);
  }
  if (n.grow) bits.push('grow');
  if (n.alignSelf) bits.push(`self:${A[n.alignSelf] || n.alignSelf}`);
  if (n.positioning === 'ABSOLUTE') bits.push('ABS');
  if (n.gridColumnSpan > 1 || n.gridRowSpan > 1) bits.push(`span ${n.gridColumnSpan || 1}x${n.gridRowSpan || 1}`);
  if (n.radius) bits.push(`r:${n.radius.every(v => v === n.radius[0]) ? n.radius[0] : n.radius.join('/')}`);
  if (n.fills) bits.push(`fill:${n.fills.map(paintStr).join('+')}`);
  if (n.strokes) bits.push(`stroke:${n.strokes.map(paintStr).join('+')}${n.borders ? ' w:' + n.borders.join('/') : ' w:' + n.strokeWeight}${n.strokeAlign ? ' ' + n.strokeAlign[0] : ''}`);
  if (n.effects) bits.push(`fx:${n.effects.map(e => `${e.type === 'DROP_SHADOW' ? 'sh' : e.type === 'BACKGROUND_BLUR' ? 'bblur' : e.type === 'FOREGROUND_BLUR' ? 'blur' : e.type}(${e.x},${e.y},${e.radius},${e.spread},${e.color})`).join('+')}`);
  if (n.opacity !== 1) bits.push(`op:${n.opacity}`);
  if (!n.visible) bits.push('HIDDEN');
  if (n.clips === false) bits.push('noclip');
  if (n.fillGeometry) bits.push(`path×${n.fillGeometry.length}`);
  if (n.text) {
    const t = n.text;
    bits.push(`| ${t.fontStyle} ${t.fontSize}/${t.lineHeight ? t.lineHeight.v : '-'}${t.letterSpacing && t.letterSpacing.v ? ' ls' + t.letterSpacing.v + (t.letterSpacing.u === 'PERCENT' ? '%' : 'px') : ''} ${t.align.toLowerCase()}/${t.valign.toLowerCase()}${t.textCase && t.textCase !== 'ORIGINAL' ? ' ' + t.textCase : ''}${t.autoResize ? ' ' + t.autoResize : ''}`);
    bits.push(JSON.stringify(t.characters.length > 90 ? t.characters.slice(0, 90) + '…' : t.characters));
    if (t.styleOverrides) {
      const used = new Set(t.charStyleIDs || []);
      const so = t.styleOverrides.filter(s => used.has(s.id) && s.id);
      if (so.length) bits.push('OV:' + so.map(s => `${s.id}{${[s.fontStyle, s.fontSize, s.fills && s.fills[0] && s.fills[0].color, s.decoration !== 'NONE' ? s.decoration : null].filter(Boolean).join(',')}}`).join(' '));
    }
    if (t.lines && t.lines.length > 1) bits.push(`lines:${t.lines.length}`);
  }
  return pad + bits.join(' ');
}

function walk(n, d) {
  console.log(line(n, d));
  if (d >= maxDepth) return;
  for (const c of kids.get(n.id) || []) walk(c, d + 1);
}
walk(root, 0);
