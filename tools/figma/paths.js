const ARITY={0:0,1:2,2:2,3:4,4:6};
const CMD={0:'Z',1:'M',2:'L',3:'Q',4:'C'};
function blobToPath(buf, prec=3){
  let i=0,out='';
  while(i<buf.length){
    const c=buf[i++]; const a=ARITY[c];
    if(a===undefined) throw new Error('bad cmd '+c+' @'+(i-1));
    const nums=[];
    for(let k=0;k<a;k++){ nums.push(+buf.readFloatLE(i).toFixed(prec)); i+=4; }
    out+=CMD[c]+(nums.length?nums.join(' '):'');
    if(i<buf.length) out+=' ';
  }
  return out.trim();
}
module.exports={blobToPath};
if(require.main===module){
  const {nc,doc}=require('./tree.js');
  const getBuf=idx=>{const b=doc.blobs[idx];return Buffer.from(b.bytes.data||b.bytes);};
  let ok=0,fail=0,errs=new Set();
  for(const n of nc){
    for(const key of ['fillGeometry','strokeGeometry']){
      if(!n[key]) continue;
      for(const p of n[key]){
        try{ blobToPath(getBuf(p.commandsBlob)); ok++; }catch(e){ fail++; errs.add(e.message.replace(/@\d+/,'')); }
      }
    }
  }
  console.log('paths ok:',ok,'fail:',fail, [...errs].slice(0,5));
}
