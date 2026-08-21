'use strict';
const { nc, byId, roots, key } = require('./tree.js');
const { blobToPath } = require('./paths.js');
const doc = require('./tree.js').doc;

const getBlob = idx => { const b = doc.blobs[idx]; return Buffer.from(b.bytes.data || b.bytes); };

const SKIP = new Set(['__children', 'guid', 'parentIndex', 'phase', 'editInfo', 'derivedSymbolData',
  'symbolData', 'prototypeInteractions', 'sharedSymbolMappings', 'overrideStash', 'overrideStashV2',
  'variableConsumptionMap', 'guidPath', 'sharedComponentMasterData', 'symbolLinks', 'blobRef',
  'connectorStart', 'connectorEnd', 'sourceCodeCollaborativeTextVersion']);

function baseProps(n) {
  const o = {};
  for (const k of Object.keys(n)) { if (!SKIP.has(k) && !k.endsWith('Tag')) o[k] = n[k]; }
  return o;
}

function ovKey(arr) { return arr.join('/'); }

// Build override maps for an instance placed at `prefix`
function instanceMaps(inst, prefix) {
  const symId = inst.symbolData ? key(inst.symbolData.symbolID) : null;
  const overrides = new Map(), derived = new Map();
  const add = (map, entry) => {
    if (!entry.guidPath || !entry.guidPath.guids) return;
    const g = entry.guidPath.guids.map(key);
    let path;
    if (g.length === 1 && g[0] === symId) path = prefix.slice();
    else path = prefix.concat(g);
    const k = ovKey(path);
    map.set(k, Object.assign({}, map.get(k) || {}, entry));
  };
  if (inst.symbolData && inst.symbolData.symbolOverrides) for (const e of inst.symbolData.symbolOverrides) add(overrides, e);
  if (inst.derivedSymbolData) for (const e of inst.derivedSymbolData) add(derived, e);
  return { overrides, derived };
}

let uid = 0;

/**
 * master   – definition node from the scene graph
 * chain    – override-path chain of enclosing instance guids
 * selfKey  – override key for this node (chain ++ [own guid], or the chain itself for an instance root)
 * ovList   – [{overrides, derived}] ordered outermost -> innermost
 */
function resolve(master, chain, selfKey, ovList) {
  const k = ovKey(selfKey);
  let p = baseProps(master);
  // innermost first, outermost last (outer wins)
  for (let i = ovList.length - 1; i >= 0; i--) {
    const o = ovList[i].overrides.get(k);
    if (o) p = Object.assign(p, baseProps(o));
  }
  for (let i = ovList.length - 1; i >= 0; i--) {
    const d = ovList[i].derived.get(k);
    if (d) {
      if (d.size) p.size = d.size;
      if (d.transform) p.transform = d.transform;
      if (d.fillGeometry) p.fillGeometry = d.fillGeometry;
      if (d.strokeGeometry) p.strokeGeometry = d.strokeGeometry;
      if (d.derivedTextData) p.derivedTextData = d.derivedTextData;
    }
  }

  const node = { id: 'n' + (uid++), srcGuid: key(master.guid), props: p, type: p.type, name: p.name, children: [] };

  if (p.type === 'INSTANCE') {
    let symGuid = null;
    for (let i = ovList.length - 1; i >= 0; i--) {
      const o = ovList[i].overrides.get(k);
      if (o && o.overriddenSymbolID) { symGuid = key(o.overriddenSymbolID); break; }
    }
    if (!symGuid && master.symbolData) symGuid = key(master.symbolData.symbolID);
    const sym = symGuid ? byId.get(symGuid) : null;
    if (!sym) { node.unresolved = symGuid; return node; }
    node.symbol = sym.name;
    const nextOv = ovList.concat([instanceMaps(master, selfKey)]);
    for (const c of sym.__children) {
      node.children.push(resolve(c, selfKey, selfKey.concat([key(c.guid)]), nextOv));
    }
    return node;
  }

  for (const c of master.__children) {
    node.children.push(resolve(c, chain, chain.concat([key(c.guid)]), ovList));
  }
  return node;
}

// ---------- flattening to render model ----------
const hex = c => {
  const h = [c.r, c.g, c.b].map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
  return '#' + h;
};
const rgba = c => (c.a >= 0.999 ? hex(c) : `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, ${+c.a.toFixed(3)})`);

const imgHash = img => {
  if (!img || !img.hash) return null;
  const b = Buffer.from(img.hash.data || img.hash);
  return b.toString('hex');
};

function paint(p) {
  if (p.visible === false) return null;
  const o = { type: p.type, opacity: p.opacity == null ? 1 : +p.opacity.toFixed(3), blendMode: p.blendMode };
  if (p.color) { o.color = rgba(p.color); o.hex = hex(p.color); o.alpha = +(p.color.a ?? 1).toFixed(3); }
  if (p.stops) o.stops = p.stops.map(s => ({ color: rgba(s.color), pos: +s.position.toFixed(4) }));
  if (p.transform) o.transform = p.transform;
  if (p.image) o.image = imgHash(p.image);
  if (p.imageScaleMode) o.scaleMode = p.imageScaleMode;
  if (p.video) o.video = imgHash(p.video);
  return o;
}

function effect(e) {
  if (e.visible === false) return null;
  return {
    type: e.type, x: e.offset ? +e.offset.x.toFixed(2) : 0, y: e.offset ? +e.offset.y.toFixed(2) : 0,
    radius: +(e.radius || 0).toFixed(2), spread: +(e.spread || 0).toFixed(2),
    color: e.color ? rgba(e.color) : null, blendMode: e.blendMode,
    behind: !!e.showShadowBehindNode, blurOpType: e.blurOpType,
  };
}

function textInfo(p) {
  const td = p.textData; if (!td) return null;
  const t = {
    characters: td.characters,
    fontFamily: p.fontName ? p.fontName.family : null,
    fontStyle: p.fontName ? p.fontName.style : null,
    fontSize: p.fontSize,
    lineHeight: p.lineHeight ? { v: +p.lineHeight.value.toFixed(2), u: p.lineHeight.units } : null,
    letterSpacing: p.letterSpacing ? { v: +p.letterSpacing.value.toFixed(3), u: p.letterSpacing.units } : null,
    tracking: p.textTracking,
    align: p.textAlignHorizontal || 'LEFT',
    valign: p.textAlignVertical || 'TOP',
    textCase: p.textCase, decoration: p.textDecoration,
    autoResize: p.textAutoResize,
    paragraphSpacing: p.paragraphSpacing,
    maxLines: p.maxLines,
    truncation: p.textTruncation,
  };
  if (td.styleOverrideTable && td.styleOverrideTable.length) {
    t.styleOverrides = td.styleOverrideTable.map(s => ({
      id: s.styleID,
      fontStyle: s.fontName ? s.fontName.style : undefined,
      fontFamily: s.fontName ? s.fontName.family : undefined,
      fontSize: s.fontSize,
      fills: s.fillPaints ? s.fillPaints.map(paint).filter(Boolean) : undefined,
      lineHeight: s.lineHeight ? { v: +s.lineHeight.value.toFixed(2), u: s.lineHeight.units } : undefined,
      letterSpacing: s.letterSpacing ? { v: +s.letterSpacing.value.toFixed(3), u: s.letterSpacing.units } : undefined,
      textCase: s.textCase, decoration: s.textDecoration,
      hyperlink: s.hyperlink,
    }));
    t.charStyleIDs = td.characterStyleIDs;
  }
  const dtd = p.derivedTextData || td;
  if (dtd && dtd.baselines) t.lines = dtd.baselines.map(b => ({ y: +b.position.y.toFixed(2), h: +(b.lineHeight || 0).toFixed(2), w: +(b.width || 0).toFixed(2), from: b.firstCharacter, to: b.endCharacter }));
  return t;
}

function layout(p) {
  if (!p.stackMode || p.stackMode === 'NONE') return null;
  return {
    mode: p.stackMode,
    gap: p.stackSpacing || 0,
    counterGap: p.stackCounterSpacing,
    pt: p.stackVerticalPadding ?? p.stackPadding ?? 0,
    pr: p.stackPaddingRight ?? p.stackHorizontalPadding ?? p.stackPadding ?? 0,
    pb: p.stackPaddingBottom ?? p.stackVerticalPadding ?? p.stackPadding ?? 0,
    pl: p.stackHorizontalPadding ?? p.stackPadding ?? 0,
    justify: p.stackPrimaryAlignItems || 'MIN',
    align: p.stackCounterAlignItems || 'MIN',
    alignContent: p.stackCounterAlignContent,
    primarySizing: p.stackPrimarySizing,
    counterSizing: p.stackCounterSizing,
    wrap: p.stackWrap,
    reverseZ: p.stackReverseZIndex,
  };
}

function geom(p) {
  const out = {};
  for (const k of ['fillGeometry', 'strokeGeometry']) {
    if (p[k] && p[k].length) {
      out[k] = p[k].map(g => ({ d: blobToPath(getBlob(g.commandsBlob)), rule: g.windingRule }));
    }
  }
  return out;
}

const MUL = (a, b) => ({
  m00: a.m00 * b.m00 + a.m01 * b.m10,
  m01: a.m00 * b.m01 + a.m01 * b.m11,
  m02: a.m00 * b.m02 + a.m01 * b.m12 + a.m02,
  m10: a.m10 * b.m00 + a.m11 * b.m10,
  m11: a.m10 * b.m01 + a.m11 * b.m11,
  m12: a.m10 * b.m02 + a.m11 * b.m12 + a.m12,
});
const IDENT = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 };
const r2 = v => +v.toFixed(2);
const r4 = v => +v.toFixed(4);

function flatten(node, parentAbs, out, depth, parentId) {
  const p = node.props;
  const t = p.transform ? { m00: p.transform.m00, m01: p.transform.m01, m02: p.transform.m02, m10: p.transform.m10, m11: p.transform.m11, m12: p.transform.m12 } : Object.assign({}, IDENT);
  const abs = MUL(parentAbs, t);
  const rotated = !(Math.abs(t.m00 - 1) < 1e-6 && Math.abs(t.m01) < 1e-6 && Math.abs(t.m10) < 1e-6 && Math.abs(t.m11 - 1) < 1e-6);
  const r = {
    id: node.id, parent: parentId, depth, type: node.type, name: node.name,
    symbol: node.symbol,
    x: r2(abs.m02), y: r2(abs.m12),           // absolute origin
    lx: r2(t.m02), ly: r2(t.m12),             // translation inside the parent
    m: rotated ? { a: r4(t.m00), b: r4(t.m10), c: r4(t.m01), d: r4(t.m11) } : undefined,
    w: p.size ? r2(p.size.x) : null, h: p.size ? r2(p.size.y) : null,
    visible: p.visible !== false,
    opacity: p.opacity == null ? 1 : +p.opacity.toFixed(3),
    blendMode: p.blendMode && p.blendMode !== 'NORMAL' ? p.blendMode : undefined,
    mask: p.mask || undefined,
    clips: p.frameMaskDisabled === true ? false : (node.type === 'FRAME' || node.type === 'SYMBOL' || node.type === 'INSTANCE' ? true : undefined),
    radius: p.rectangleCornerRadiiIndependent
      ? [p.rectangleTopLeftCornerRadius || 0, p.rectangleTopRightCornerRadius || 0, p.rectangleBottomRightCornerRadius || 0, p.rectangleBottomLeftCornerRadius || 0]
      : (p.cornerRadius ? [p.cornerRadius, p.cornerRadius, p.cornerRadius, p.cornerRadius] : undefined),
    fills: (p.fillPaints || []).map(paint).filter(Boolean),
    strokes: (p.strokePaints || []).map(paint).filter(Boolean),
    strokeWeight: p.strokeWeight,
    strokeAlign: p.strokeAlign,
    borders: (p.borderTopWeight != null || p.borderStrokeWeightsIndependent) ? [p.borderTopWeight ?? 0, p.borderRightWeight ?? 0, p.borderBottomWeight ?? 0, p.borderLeftWeight ?? 0] : undefined,
    effects: (p.effects || []).map(effect).filter(Boolean),
    layout: layout(p),
    grow: p.stackChildPrimaryGrow,
    alignSelf: p.stackChildAlignSelf,
    positioning: p.stackPositioning,
    hConstraint: p.horizontalConstraint, vConstraint: p.verticalConstraint,
    gridRowSpan: p.gridRowSpan, gridColumnSpan: p.gridColumnSpan,
    text: textInfo(p),
    arc: p.arcData,
  };
  Object.assign(r, geom(p));
  if (r.fills.length === 0) delete r.fills;
  if (r.strokes.length === 0) delete r.strokes;
  if (r.effects.length === 0) delete r.effects;
  if (!r.text) delete r.text;
  if (!r.layout) delete r.layout;
  for (const k of Object.keys(r)) if (r[k] === undefined || r[k] === null) delete r[k];
  out.push(r);
  for (const c of node.children) flatten(c, abs, out, depth + 1, node.id);
  return out;
}

function findNode(name, type) {
  const stack = [roots[0]];
  while (stack.length) {
    const n = stack.pop();
    if (n.name === name && (!type || n.type === type)) return n;
    for (const c of n.__children) stack.push(c);
  }
  return null;
}

module.exports = { resolve, flatten, findNode, instanceMaps, hex, rgba, imgHash, blobToPath, getBlob };

if (require.main === module) {
  const fs = require('fs');
  const targets = process.argv.slice(2);
  for (const name of targets) {
    const n = /^\d+:\d+$/.test(name) ? byId.get(name) : findNode(name);
    if (!n) { console.error('NOT FOUND', name); continue; }
    uid = 0;
    const tree = resolve(n, [], [], []);
    const flat = flatten(tree, { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 }, [], 0, null);
    // normalise so the root sits at 0,0
    const ox = flat[0].x, oy = flat[0].y;
    for (const f of flat) { f.x = +(f.x - ox).toFixed(2); f.y = +(f.y - oy).toFixed(2); }
    flat[0].lx = 0; flat[0].ly = 0;
    const file = process.env.OUT || ('out_' + Buffer.from(name).toString('hex').slice(0, 12) + '.json');
    fs.writeFileSync(file, JSON.stringify(flat, null, 1));
    console.log(name, '->', file, flat.length, 'nodes');
  }
}
