const fs=require('fs');
const doc=JSON.parse(fs.readFileSync('doc.json','utf8'));
const nc=doc.nodeChanges;
const key=g=>g?`${g.sessionID}:${g.localID}`:null;
const byId=new Map();
for(const n of nc){ byId.set(key(n.guid), n); }
// children
for(const n of nc){ n.__children=[]; }
const roots=[];
for(const n of nc){
  const p=n.parentIndex&&n.parentIndex.guid?byId.get(key(n.parentIndex.guid)):null;
  if(p){ p.__children.push(n); } else roots.push(n);
}
const posOf=n=>(n.parentIndex&&n.parentIndex.position)||'';
for(const n of nc){ n.__children.sort((a,b)=>posOf(a)<posOf(b)?-1:posOf(a)>posOf(b)?1:0); }
module.exports={doc,nc,byId,roots,key};
if(require.main===module){
  const types={}; for(const n of nc) types[n.type]=(types[n.type]||0)+1;
  console.log('types:',JSON.stringify(types,null,1));
  console.log('roots:',roots.length, roots.map(r=>`${r.type}:${r.name}`).slice(0,10));
  const doc0=roots[0];
  const walk=(n,d)=>{
    if(d>2) return;
    const sz=n.size?` ${Math.round(n.size.x)}x${Math.round(n.size.y)}`:'';
    const tr=n.transform?` @${Math.round(n.transform.m02)},${Math.round(n.transform.m12)}`:'';
    console.log('  '.repeat(d)+`${n.type} "${n.name}"${sz}${tr} kids=${n.__children.length}`);
    for(const c of n.__children) walk(c,d+1);
  };
  for(const r of roots) walk(r,0);
}
