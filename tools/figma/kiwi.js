'use strict';
const fs = require('fs');
const zlib = require('zlib');

class ByteBuffer {
  constructor(data) { this.d = data; this.i = 0; }
  get remaining() { return this.d.length - this.i; }
  readByte() { if (this.i >= this.d.length) throw new Error('OOB byte'); return this.d[this.i++]; }
  readBytes(n) { if (this.i + n > this.d.length) throw new Error('OOB bytes'); const r = this.d.subarray(this.i, this.i + n); this.i += n; return r; }
  readVarUint() {
    let value = 0, shift = 0, b;
    do {
      b = this.readByte();
      value |= (b & 127) * Math.pow(2, shift);
      shift += 7;
    } while (b & 128 && shift < 35);
    return value >>> 0;
  }
  readVarInt() { const v = this.readVarUint(); return (v & 1) ? ~(v >>> 1) : (v >>> 1); }
  readVarUint64() {
    let value = 0n, shift = 0n, b;
    for (;;) { b = this.readByte(); value |= BigInt(b & 127) << shift; shift += 7n; if (!(b & 128)) break; }
    return value;
  }
  readVarInt64() { const v = this.readVarUint64(); return (v & 1n) ? ~(v >> 1n) : (v >> 1n); }
  readVarFloat() {
    if (this.i + 1 > this.d.length) throw new Error('OOB float');
    const first = this.d[this.i];
    if (first === 0) { this.i++; return 0; }
    if (this.i + 4 > this.d.length) throw new Error('OOB float4');
    let bits = first | (this.d[this.i + 1] << 8) | (this.d[this.i + 2] << 16) | (this.d[this.i + 3] << 24);
    this.i += 4;
    bits = (bits << 23) | (bits >>> 9);
    const buf = Buffer.allocUnsafe(4);
    buf.writeInt32LE(bits | 0, 0);
    return buf.readFloatLE(0);
  }
  readString() {
    const start = this.i;
    while (this.i < this.d.length && this.d[this.i] !== 0) this.i++;
    const s = this.d.toString('utf8', start, this.i);
    this.i++; // skip null
    return s;
  }
}

const BUILTIN = { '-1': 'bool', '-2': 'byte', '-3': 'int', '-4': 'uint', '-5': 'float', '-6': 'string', '-7': 'int64', '-8': 'uint64' };
const KIND = ['ENUM', 'STRUCT', 'MESSAGE'];

function decodeSchema(bytes) {
  const bb = new ByteBuffer(bytes);
  const defCount = bb.readVarUint();
  const defs = [];
  for (let i = 0; i < defCount; i++) {
    const name = bb.readString();
    const kind = bb.readByte();
    const fieldCount = bb.readVarUint();
    const fields = [];
    for (let j = 0; j < fieldCount; j++) {
      const fname = bb.readString();
      const type = bb.readVarInt();
      const isArray = !!(bb.readByte() & 1);
      const value = bb.readVarUint();
      fields.push({ name: fname, type, isArray, value });
    }
    defs.push({ name, kind: KIND[kind] || kind, fields });
  }
  return defs;
}

function makeDecoder(defs) {
  const byIndex = defs;
  const byName = new Map(defs.map((d, i) => [d.name, i]));

  function decodeValue(bb, type) {
    if (type < 0) {
      switch (type) {
        case -1: return !!bb.readByte();
        case -2: return bb.readByte();
        case -3: return bb.readVarInt();
        case -4: return bb.readVarUint();
        case -5: return bb.readVarFloat();
        case -6: return bb.readString();
        case -7: { const v = bb.readVarInt64(); return (v >= -9007199254740991n && v <= 9007199254740991n) ? Number(v) : v.toString(); }
        case -8: { const v = bb.readVarUint64(); return (v <= 9007199254740991n) ? Number(v) : v.toString(); }
        default: throw new Error('unknown builtin ' + type);
      }
    }
    return decodeDef(bb, type);
  }

  function decodeDef(bb, idx) {
    const def = byIndex[idx];
    if (!def) throw new Error('bad def index ' + idx);
    if (def.kind === 'ENUM') {
      const v = bb.readVarUint();
      const f = def.fields.find(x => x.value === v);
      return f ? f.name : v;
    }
    if (def.kind === 'STRUCT') {
      const o = {};
      for (const f of def.fields) o[f.name] = readField(bb, f);
      return o;
    }
    // MESSAGE
    const o = {};
    for (;;) {
      const id = bb.readVarUint();
      if (id === 0) break;
      const f = def.fields.find(x => x.value === id);
      if (!f) throw new Error(`unknown field id ${id} in ${def.name}`);
      o[f.name] = readField(bb, f);
    }
    return o;
  }

  function readField(bb, f) {
    if (f.isArray) {
      const n = bb.readVarUint();
      if (f.type === -2) return bb.readBytes(n); // byte[]
      const arr = new Array(n);
      for (let k = 0; k < n; k++) arr[k] = decodeValue(bb, f.type);
      return arr;
    }
    return decodeValue(bb, f.type);
  }

  return { decodeDef, byName, byIndex };
}

function parseFig(path) {
  const buf = fs.readFileSync(path);
  const magic = buf.toString('ascii', 0, 8);
  if (magic !== 'fig-kiwi') throw new Error('not a fig-kiwi file: ' + magic);
  const version = buf.readUInt32LE(8);
  let off = 12;
  const chunks = [];
  while (off + 4 <= buf.length) {
    const len = buf.readUInt32LE(off); off += 4;
    if (len === 0 || off + len > buf.length) break;
    const raw = buf.subarray(off, off + len); off += len;
    let out;
    if (raw.length >= 4 && raw.readUInt32LE(0) === 0xFD2FB528) {
      out = zlib.zstdDecompressSync(raw, { maxOutputLength: 1 << 30 });
    } else {
      try { out = zlib.inflateRawSync(raw); }
      catch (e) { try { out = zlib.inflateSync(raw); } catch (e2) { out = raw; } }
    }
    chunks.push(out);
  }
  return { version, chunks };
}

module.exports = { ByteBuffer, decodeSchema, makeDecoder, parseFig, BUILTIN };

if (require.main === module) {
  const { version, chunks } = parseFig(process.argv[2]);
  console.error('version', version, 'chunks', chunks.map(c => c.length));
  const defs = decodeSchema(chunks[0]);
  console.error('definitions:', defs.length);
  fs.writeFileSync(process.argv[3] || 'schema.json', JSON.stringify(defs, null, 1));
  const dec = makeDecoder(defs);
  const rootIdx = dec.byName.get('Message');
  console.error('Message index', rootIdx);
  const bb = new ByteBuffer(chunks[1]);
  const msg = dec.decodeDef(bb, rootIdx);
  console.error('decoded, remaining bytes:', bb.remaining);
  console.error('top keys:', Object.keys(msg));
  fs.writeFileSync(process.argv[4] || 'doc.json', JSON.stringify(msg));
  console.error('nodeChanges:', msg.nodeChanges ? msg.nodeChanges.length : 'n/a');
}
