// Rebuild reference pages and export the actual icon geometry from the supplied .fig.
const fs = require('fs');
const path = require('path');
const { render } = require('./render');
const { build, toSVG } = require('./icons');
const root = path.resolve(__dirname, '../..');
const source = path.join(root, '_design/investments');
const doc = JSON.parse(fs.readFileSync(path.join(source, 'doc.json')));
const thumbnails = new Map();
function scan(value) {
  if (!value || typeof value !== 'object') return;
  if (value.image?.hash && value.imageThumbnail?.hash)
    thumbnails.set(Buffer.from(value.image.hash.data).toString('hex'), Buffer.from(value.imageThumbnail.hash.data).toString('hex'));
  for (const child of Object.values(value)) if (typeof child === 'object') scan(child);
}
scan(doc.nodeChanges);
const dest = path.join(root, 'assets/icons/business');
fs.mkdirSync(dest, { recursive: true });
for (const page of ['ses', 'uze']) {
  const flat = JSON.parse(fs.readFileSync(path.join(source, page + '.json')));
  const { kids } = build(flat);
  const pageHTML = fs.readFileSync(path.join(root, page + '.html'), 'utf8');
  const cardColors = page === 'ses'
    ? ['#ffd21f', '#e6e7ea', '#ffd21f', '#e6e7ea', '#e6e7ea', '#ffd21f', '#e6e7ea', '#ffd21f']
    : ['#ffd21f', '#e6e7ea', '#ffd21f', '#e6e7ea'];
  let cardIndex = 0;
  for (const n of flat) {
    if (n.w === 44 && n.h === 44 && n.type === 'FRAME' && pageHTML.includes(`business/${page}-${n.id}.svg`)) {
      let svg = toSVG(n, kids);
      if ((page === 'ses' && n.y === 1058 || page === 'uze' && n.y === 3919) && cardColors[cardIndex]) {
        svg = svg.replace(/fill="#[0-9a-f]{6}"/i, `fill="${cardColors[cardIndex++]}"`);
      }
      fs.writeFileSync(path.join(dest, `${page}-${n.id}.svg`), svg);
      console.log(page, n.id, n.x, n.y, (n.fills || []).map(f => f.color));
    }
  }
  let html = render(flat, { imgUrl: hash => {
    if (!hash) return null;
    return 'fig/images/' + (fs.existsSync(path.join(source, 'fig/images', hash)) ? hash : thumbnails.get(hash) || hash);
  }});
  html = html.replace(/<link[^>]+fonts\.(?:googleapis|gstatic)[^>]*>/g, '');
  html = html.replace('<style>', '<link rel="stylesheet" href="../../assets/css/fonts.css"><style>');
  fs.writeFileSync(path.join(source, page + '-reference.html'), html);
}
