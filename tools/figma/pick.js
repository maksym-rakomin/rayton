const fs=require('fs');
const {build,toSVG}=require('./icons.js');
const specs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const cache={};
const load=f=>cache[f]||(cache[f]=(()=>{const flat=JSON.parse(fs.readFileSync(f,'utf8'));return {flat,...build(flat)};})());
fs.mkdirSync('picked',{recursive:true});
for(const s of specs){
  const {flat,kids}=load(s.file);
  const cands=flat.filter(n=>n.name===s.name && (!s.w||Math.abs(n.w-s.w)<0.6) && (!s.parent|| (flat.find(p=>p.id===n.parent)||{}).name===s.parent));
  const n=cands[s.idx||0];
  if(!n){console.log('MISS',s.out,s.name,'cands',cands.length);continue;}
  const svg=toSVG(n,kids,{mono:!!s.mono});
  if(!svg){console.log('EMPTY',s.out);continue;}
  fs.writeFileSync('picked/'+s.out+'.svg',svg);
  console.log('ok',s.out,n.w+'x'+n.h,'kids',(kids.get(n.id)||[]).length);
}
