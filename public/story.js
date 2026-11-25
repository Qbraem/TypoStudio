/* Studio Typo · Story mode (v1.1)
   A full 9:16 story composer on top of the sticker editor: background (photo / colour / gradient, blur, dim),
   photo layers with frames, title layers (any Studio Typo design, rendered with drawLayers), effects, grain,
   vignette and light leak. Saving/sharing the finished story is part of Studio Typo Pro.
   Uses the globals of index.html (cur, clone, drawLayers, FRAME, ensureFonts, canUse, openPaywall, toast, …). */
(function(){
"use strict";
const SW=1080,SH=1920;
const $s=id=>document.getElementById(id);
const IC={
  close:'<path d="M6 6l12 12M18 6L6 18"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  down:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  share:'<path d="M12 15V3"/><path d="M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  bg:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M3.5 15l5-4.5 4 3.5 3-2.5 5 4"/>',
  photo:'<rect x="3" y="5" width="14" height="14" rx="2.5"/><circle cx="8" cy="10" r="1.6"/><path d="M3 16l4-3.5 3 2.5 2-1.5 5 4"/><path d="M19.5 3v5M17 5.5h5"/>',
  text:'<path d="M4 7V5h16v2"/><path d="M12 5v14"/><path d="M9 19h6"/>',
  fx:'<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  frame:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><rect x="7" y="6" width="10" height="9"/>',
  crop:'<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M2 6h14a2 2 0 0 1 2 2v14"/>',
  shadow:'<rect x="3" y="3" width="13" height="13" rx="2"/><path d="M8 21h11a2 2 0 0 0 2-2V8"/>',
  front:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  back:'<rect x="4" y="4" width="12" height="12" rx="2"/><path d="M20 9v10a1 1 0 0 1-1 1H9"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  up:'<path d="M12 19V5M6 11l6-6 6 6"/>',dn:'<path d="M12 5v14M6 13l6 6 6-6"/>',
  eye:'<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>',
  eyeOff:'<path d="M3 3l18 18"/><path d="M10.6 5.6A10.4 10.4 0 0 1 12 5.5c6.4 0 10 6.5 10 6.5a17.6 17.6 0 0 1-3.3 4M6.6 6.6C3.8 8.4 2 12 2 12s3.6 6.5 10 6.5c1.6 0 3-.4 4.3-1"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',swap:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  grain:'<circle cx="6" cy="6" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="18" cy="5" r="1"/><circle cx="8" cy="13" r="1"/><circle cx="15" cy="14" r="1"/><circle cx="5" cy="19" r="1"/><circle cx="12" cy="19" r="1"/><circle cx="19" cy="18" r="1"/>',
  vig:'<rect x="3" y="3" width="18" height="18" rx="3"/><ellipse cx="12" cy="12" rx="5.5" ry="6.5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
  drop:'<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>',
  lib:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  stk:'<path d="M20 12.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6.5z"/><path d="M20 12.5h-5.5a2 2 0 0 0-2 2V20"/>'
};
const svg=(k,w=1.9)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
const uidS=()=>Math.random().toString(36).slice(2,9);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const BUNDLED=["golden","sunset","pier","pool","agave","xmas"];
const GRADS=[["#3B2416","#F26B50"],["#1C1714","#E9B77C"],["#F6E9D7","#E9B77C"],["#7FC8E8","#F6E9D7"],["#111111","#3B2416"],["#D9473A","#F6B26B"],["#A8B89A","#F6E9D7"],["#2A2E45","#C98A4B"]];
const COLORS=["#120D0A","#3B2416","#F6E9D7","#FFFFFF","#E9B77C","#F26B50","#D9473A","#7FC8E8","#A8B89A","#111111"];
const FRAMES=[["none","None"],["rounded","Rounded"],["border","Border"],["polaroid","Polaroid"],["film","Film"]];
const ASPECTS=[["orig","Original"],["4:5","4:5"],["1:1","1:1"],["3:4","3:4"],["9:16","9:16"],["16:9","16:9"]];
const FX=[["none","Original"],["warm","Warm film"],["faded","Faded"],["bw","B&W"],["golden","Golden"],["cool","Cool"]];

/* ---------- document ---------- */
function blank(){return{v:1,bg:{type:"gradient",grad:0,color:"#3B2416",photo:null,blur:0,dim:0,z:1,ox:0,oy:0},layers:[],fx:{name:"none",amount:.7,grain:false,vig:false,leak:false}}}
let S=blank();
const ST={open:false,sel:null,tool:null,hist:[],fut:[],picking:false,editing:null,prevCur:null,pending:null,loaded:false,gesture:false};
const IMG=new Map(); // key -> {src:canvas|img, w, h}

/* ---------- storage (IndexedDB: the story + its photos) ---------- */
const DB={db:null,
  open(){if(this.db)return Promise.resolve(this.db);return new Promise((res,rej)=>{try{const r=indexedDB.open("typoStudio.story",1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>{this.db=r.result;res(this.db)};r.onerror=()=>rej(r.error)}catch(e){rej(e)}})},
  async get(k){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction("kv").objectStore("kv").get(k);t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error)})},
  async set(k,v){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction("kv","readwrite");t.objectStore("kv").put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})},
  async del(k){const db=await this.open();return new Promise(res=>{const t=db.transaction("kv","readwrite");t.objectStore("kv").delete(k);t.oncomplete=()=>res();t.onerror=()=>res()})}
};
let saveT=0;
function persist(){clearTimeout(saveT);saveT=setTimeout(()=>{DB.set("doc",JSON.stringify(S)).catch(()=>{})},400)}
async function loadDoc(){
  if(ST.loaded)return;ST.loaded=true;
  try{const j=await DB.get("doc");if(j){const d=JSON.parse(j);if(d&&d.v===1&&Array.isArray(d.layers)){S=Object.assign(blank(),d);S.bg=Object.assign(blank().bg,d.bg);S.fx=Object.assign(blank().fx,d.fx)}}}catch(e){}
  const keys=new Set(S.layers.filter(L=>L.t==="photo").map(L=>L.key));if(S.bg.type==="photo"&&S.bg.photo&&S.bg.photo!=="copy")keys.add(S.bg.photo);
  await Promise.all([...keys].map(k=>ensureImg(k).catch(()=>{})));
  if(!S.layers.some(L=>L.t==="title"))S.layers.push(newTitle(cur));
}
function imgFromUrl(url){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=url})}
async function ensureImg(key){
  if(IMG.has(key))return IMG.get(key);
  let im;
  if(key.startsWith("b:"))im=await imgFromUrl(`/img/bg-${key.slice(2)}.jpg?v=3`);
  else{const blob=await DB.get("img:"+key);if(!blob)throw new Error("missing");const u=URL.createObjectURL(blob);im=await imgFromUrl(u)}
  const o={src:im,w:im.naturalWidth,h:im.naturalHeight};IMG.set(key,o);return o;
}
async function importFile(file){
  const u=URL.createObjectURL(file);let im;try{im=await imgFromUrl(u)}finally{setTimeout(()=>URL.revokeObjectURL(u),2000)}
  const M=2160,f=Math.min(1,M/Math.max(im.naturalWidth,im.naturalHeight));
  const c=document.createElement("canvas");c.width=Math.max(1,Math.round(im.naturalWidth*f));c.height=Math.max(1,Math.round(im.naturalHeight*f));
  const x=c.getContext("2d");x.imageSmoothingQuality="high";x.drawImage(im,0,0,c.width,c.height);
  const key="u"+uidS();IMG.set(key,{src:c,w:c.width,h:c.height});
  c.toBlob(b=>{if(b)DB.set("img:"+key,b).catch(()=>{})},"image/jpeg",.9);
  return key;
}
function pickFile(){return new Promise(res=>{const old=$s("stFileIn");if(old)old.remove();const i=document.createElement("input");i.type="file";i.accept="image/*";i.id="stFileIn";
  i.style.cssText="position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none";document.body.appendChild(i);
  i.onchange=()=>{const f=i.files&&i.files[0];i.remove();res(f||null)};i.addEventListener("cancel",()=>{i.remove();res(null)});i.click()})}

/* ---------- layers ---------- */
function newTitle(d){return{id:uidS(),t:"title",d:clone(d),x:SW/2,y:SH*.2,s:.82,rot:0,hidden:false}}
function newPhoto(key){const n=S.layers.filter(L=>L.t==="photo").length;return{id:uidS(),t:"photo",key,x:SW/2+(n?((n%2)?80:-80):0),y:SH*.56+(n?50*n:0),w:SW*.52,rot:n?(n%2?5:-5):-4,frame:"rounded",aspect:"orig",shadow:true,cap:"",hidden:false}}
const layerById=id=>S.layers.find(L=>L.id===id);
const selL=()=>ST.sel?layerById(ST.sel):null;
const firstPhoto=()=>S.layers.find(L=>L.t==="photo"&&!L.hidden&&IMG.has(L.key));

/* ---------- history ---------- */
function snapS(){ST.hist.push(JSON.stringify(S));if(ST.hist.length>60)ST.hist.shift();ST.fut=[];updTop()}
function undoS(){if(ST.editing){const h=hist.pop();if(h){cur=JSON.parse(h);const L=layerById(ST.editing);if(L){L.d=cur;ttCache.delete(L.id)}if(!layer())sel=Math.max(0,cur.layers.length-1);renderLayerChips();renderTool();draw();updTop()}return}
  if(!ST.hist.length)return;ST.fut.push(JSON.stringify(S));S=JSON.parse(ST.hist.pop());if(ST.sel&&!layerById(ST.sel))ST.sel=null;invalidate();changed(false);renderPanel();toast("Undone")}
function changed(save=true){if(save)persist();draw();updTop();syncEmpty()}

/* ---------- colour science: CSS-filter matrices, mixed by amount ---------- */
const I3=()=>[1,0,0,0, 0,1,0,0, 0,0,1,0];
function mul(a,b){const r=new Array(12);for(let i=0;i<3;i++){for(let j=0;j<3;j++)r[i*4+j]=a[i*4]*b[j]+a[i*4+1]*b[4+j]+a[i*4+2]*b[8+j];r[i*4+3]=a[i*4]*b[3]+a[i*4+1]*b[7]+a[i*4+2]*b[11]+a[i*4+3]}return r}
const M={
  sepia:a=>{const k=1-a;return[.393+.607*k,.769-.769*k,.189-.189*k,0, .349-.349*k,.686+.314*k,.168-.168*k,0, .272-.272*k,.534-.534*k,.131+.869*k,0]},
  sat:s=>[.213+.787*s,.715-.715*s,.072-.072*s,0, .213-.213*s,.715+.285*s,.072-.072*s,0, .213-.213*s,.715-.715*s,.072+.928*s,0],
  con:c=>[c,0,0,128*(1-c), 0,c,0,128*(1-c), 0,0,c,128*(1-c)],
  bri:b=>[b,0,0,0, 0,b,0,0, 0,0,b,0],
  lift:L=>{const s=(255-L)/255;return[s,0,0,L, 0,s,0,L, 0,0,s,L]},
  tint:(r,g,b)=>[r,0,0,0, 0,g,0,0, 0,0,b,0],
  hue:deg=>{const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return[.213+c*.787-s*.213,.715-c*.715-s*.715,.072-c*.072+s*.928,0, .213-c*.213+s*.143,.715+c*.285+s*.140,.072-c*.072-s*.283,0, .213-c*.213-s*.787,.715-c*.715+s*.715,.072+c*.928+s*.072,0]}
};
const PRESET={
  none:[],
  warm:[M.sepia(.32),M.sat(1.22),M.con(.95),M.bri(1.04),M.lift(10),M.tint(1.03,1,.94)],
  faded:[M.con(.8),M.sat(.75),M.bri(1.05),M.lift(26)],
  bw:[M.sat(0),M.con(1.12)],
  golden:[M.sepia(.5),M.sat(1.5),M.hue(-8),M.bri(1.04)],
  cool:[M.sat(.88),M.tint(.93,1,1.09),M.con(1.04),M.lift(6)]
};
function fxMatrix(name,amt){const ops=PRESET[name]||[];if(!ops.length||amt<=0)return null;let m=I3();for(const o of ops)m=mul(o,m);const id=I3();return m.map((v,i)=>id[i]+(v-id[i])*amt)}
function applyMatrix(c,m){if(!m)return c;const x=c.getContext("2d"),d=x.getImageData(0,0,c.width,c.height),p=d.data;
  for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2];p[i]=m[0]*r+m[1]*g+m[2]*b+m[3];p[i+1]=m[4]*r+m[5]*g+m[6]*b+m[7];p[i+2]=m[8]*r+m[9]*g+m[10]*b+m[11]}
  x.putImageData(d,0,0);return c}

/* ---------- blur: downscale + 3-pass box blur + smooth upscale (works on every iOS version) ---------- */
function boxBlur(c,r){if(r<1)return;const x=c.getContext("2d"),w=c.width,h=c.height,d=x.getImageData(0,0,w,h),a=d.data,t=new Uint8ClampedArray(a.length);
  const pass=(src,dst,horiz)=>{const n=horiz?w:h,m=horiz?h:w,div=2*r+1;
    for(let j=0;j<m;j++){let sr=0,sg=0,sb=0;const idx=i=>horiz?(j*w+clamp(i,0,n-1))*4:(clamp(i,0,n-1)*w+j)*4;
      for(let i=-r;i<=r;i++){const q=idx(i);sr+=src[q];sg+=src[q+1];sb+=src[q+2]}
      for(let i=0;i<n;i++){const o=idx(i);dst[o]=sr/div;dst[o+1]=sg/div;dst[o+2]=sb/div;dst[o+3]=255;const qa=idx(i+r+1),qb=idx(i-r);sr+=src[qa]-src[qb];sg+=src[qa+1]-src[qb+1];sb+=src[qa+2]-src[qb+2]}}};
  for(let k=0;k<3;k++){pass(a,t,true);pass(t,a,false)}x.putImageData(d,0,0)}
function cover(src,sw,sh,W,H,over=1){const c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");x.imageSmoothingQuality="high";
  const f=Math.max(W/sw,H/sh)*over,dw=sw*f,dh=sh*f;x.drawImage(src,(W-dw)/2,(H-dh)/2,dw,dh);return c}
const bgCache={key:"",c:null},baseCache={key:"",c:null};
function bgSource(){const b=S.bg;if(b.type!=="photo")return null;if(b.photo==="copy"){const p=firstPhoto();return p?{key:p.key,o:IMG.get(p.key)}:null}const o=b.photo&&IMG.get(b.photo);return o?{key:b.photo,o}:null}
function bgBase(src){const key=[src.key,S.fx.name,S.fx.amount].join("|");if(baseCache.key===key)return baseCache.c; // the photo with its effect, ≤1800px
  const o=src.o,f=Math.min(1,1800/Math.max(o.w,o.h)),c=document.createElement("canvas");c.width=Math.round(o.w*f);c.height=Math.round(o.h*f);const x=c.getContext("2d");x.imageSmoothingQuality="high";x.drawImage(o.src,0,0,c.width,c.height);
  applyMatrix(c,fxMatrix(S.fx.name,S.fx.amount));baseCache.key=key;baseCache.c=c;return c}
function bgGeom(c,W,H){const b=S.bg,k=W/SW,z=Math.max(1,b.z||1),f=Math.max(W/c.width,H/c.height)*z,dw=c.width*f,dh=c.height*f,mx=(dw-W)/2,my=(dh-H)/2;
  const ox=clamp((b.ox||0)*k,-mx,mx),oy=clamp((b.oy||0)*k,-my,my);return{x:(W-dw)/2+ox,y:(H-dh)/2+oy,w:dw,h:dh}}
function clampBg(){const src=bgSource();if(!src)return;const c=bgBase(src),g=bgGeom(c,SW,SH);S.bg.ox=g.x+g.w/2-SW/2;S.bg.oy=g.y+g.h/2-SH/2}
function drawBgPhoto(ctx,W,H){const src=bgSource();if(!src)return false;const c=bgBase(src),g=bgGeom(c,W,H),b=S.bg,r=(b.blur||0)*W/SW;
  if(r<.8){ctx.imageSmoothingQuality="high";ctx.drawImage(c,g.x,g.y,g.w,g.h);return true}
  const key=[baseCache.key,b.blur,W,H,Math.round(g.x),Math.round(g.y),Math.round(g.w)].join("|");
  if(bgCache.key!==key){const f=Math.max(1,r/3),w=Math.max(8,Math.round(W/f)),h=Math.max(8,Math.round(H/f)),sm=document.createElement("canvas");sm.width=w;sm.height=h;
    const x=sm.getContext("2d");x.imageSmoothingQuality="high";const m=1.06;x.drawImage(c,(g.x-(g.w*(m-1))/2)/f,(g.y-(g.h*(m-1))/2)/f,g.w*m/f,g.h*m/f);boxBlur(sm,Math.max(1,Math.round(r/f)));bgCache.key=key;bgCache.c=sm}
  ctx.imageSmoothingQuality="high";ctx.drawImage(bgCache.c,0,0,W,H);return true}
const phCache=new Map(); // photo key|fx|size -> filtered canvas
function photoCanvas(L,iw,ih){const o=IMG.get(L.key);if(!o)return null;const m=fxMatrix(S.fx.name,S.fx.amount);
  const W=Math.max(8,Math.round(iw)),H=Math.max(8,Math.round(ih)),bw=Math.ceil(W/64)*64;const key=[L.key,L.aspect,S.fx.name,S.fx.amount,bw].join("|");
  let c=phCache.get(key);if(c)return c;const Hb=Math.round(bw*H/W);c=cover(o.src,o.w,o.h,bw,Hb);applyMatrix(c,m);if(phCache.size>24)phCache.clear();phCache.set(key,c);return c}
function invalidate(){bgCache.key="";baseCache.key="";phCache.clear();ttCache.clear();if(typeof stCache!=="undefined")stCache.clear()}

/* ---------- title bitmaps (drawLayers draws with destination-out for cut-outs/texture, so each title gets its own canvas) ---------- */
const ttCache=new Map();
function titleBitmap(L,px){ // px = canvas px per design unit
  const key=JSON.stringify(L.d)+"|"+px.toFixed(3)+"|"+(typeof liveVals==="function"?JSON.stringify(liveVals()):"");
  let t=ttCache.get(L.id);if(t&&t.key===key)return t;
  if(ST.gesture&&t)return t; // keep the old bitmap while pinching; re-render when the gesture ends
  const S0=Math.min(4096,Math.ceil(2000*px)),c=document.createElement("canvas");c.width=c.height=S0;
  let boxes=[];try{boxes=drawLayers(c.getContext("2d"),L.d,px,S0/2,S0/2)||[]}catch(e){}
  const tr=trimO(c);t={key,c:tr.c,ox:tr.x0-S0/2,oy:tr.y0-S0/2,px,boxes};ttCache.set(L.id,t);return t}
function trimO(c){const w=c.width,h=c.height,d=c.getContext("2d").getImageData(0,0,w,h).data;let x0=w,y0=h,x1=-1,y1=-1;
  for(let y=0;y<h;y+=1){const row=y*w*4;for(let x=0;x<w;x+=2){if(d[row+x*4+3]>6){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}}}
  if(x1<0){const e=document.createElement("canvas");e.width=e.height=2;return{c:e,x0:w/2,y0:h/2}}
  x0=Math.max(0,x0-4);y0=Math.max(0,y0-4);x1=Math.min(w-1,x1+5);y1=Math.min(h-1,y1+4);
  const o=document.createElement("canvas");o.width=x1-x0+1;o.height=y1-y0+1;o.getContext("2d").drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);return{c:o,x0,y0}}

/* ---------- geometry of a layer (in story units) ---------- */
function aspectOf(L){const o=IMG.get(L.key);if(L.aspect==="orig"||!L.aspect)return o?o.w/o.h:1;const [a,b]=L.aspect.split(":").map(Number);return a/b}
function photoBox(L){const w=L.w,h=w/aspectOf(L);let l=0,r=0,t=0,b=0;
  if(L.frame==="polaroid"){l=r=t=w*.045;b=w*.2}else if(L.frame==="border"){l=r=t=b=w*.035}else if(L.frame==="film"){l=r=w*.075;t=b=w*.04}
  return{w,h,l,r,t,b,W:w+l+r,H:h+t+b}}
function bounds(L,k){ // half sizes + centre offset in story units
  if(L.t==="photo"){const B=photoBox(L);return{hw:B.W/2,hh:B.H/2,dx:0,dy:0}}
  if(L.t==="stk"){const d=STK[L.kind]||{r:1};return{hw:L.w/2,hh:L.w*d.r/2,dx:0,dy:0}}
  const px=L.s*SW*k/FRAME,t=titleBitmap(L,px),sc=1/k;return{hw:t.c.width*sc/2*(px/t.px),hh:t.c.height*sc/2*(px/t.px),dx:(t.ox+t.c.width/2)*sc*(px/t.px),dy:(t.oy+t.c.height/2)*sc*(px/t.px)}}

/* ---------- paper stickers (stamp, note, sticky note, ticket, postcard, frame, postmark, tape) ---------- */
const PAPERS=["#F4E9D2","#FFFFFF","#F2DD6E","#C9A57A","#F2C4B8","#CFE2EE","#CBD5B5","#1F1A17","#E0412F","#23704A","#1F3E8C","#C9C5F0","#E8642C","#F3A6C8"];
const INKS=["#23336B","#2A1D14","#C4452F","#111111","#FFFFFF","#8A5A2B","#23704A","#E8642C","#F2DD6E"];
const STK_FONTS={layers:[["DM Serif Display",400],["DM Sans",700],["Caveat",700],["Homemade Apple",400],["Great Vibes",400],["Playfair Display",700],["Bebas Neue",400]].concat(window.STK_PACK_FONTS||[]).map(([font,weight])=>({font,weight,text:"Aa",italic:false}))};
let stkFontsOk=false;
function stkFonts(){if(stkFontsOk)return;stkFontsOk=true;ensureFonts(STK_FONTS).then(()=>{stCache.clear();draw()}).catch(()=>{})}
const F=(w,px,f)=>`${w} ${px}px "${f}", serif`;
function lines(x,txt,maxW){const out=[];String(txt||"").split("\n").forEach(par=>{const ws=par.split(/\s+/).filter(Boolean);if(!ws.length){out.push("");return}let l=ws[0];for(let i=1;i<ws.length;i++){const t=l+" "+ws[i];if(x.measureText(t).width>maxW){out.push(l);l=ws[i]}else l=t}out.push(l)});return out}
function fit(x,txt,font,px,maxW,min=.45){let p=px;x.font=font(p);while(p>px*min&&Math.max(...String(txt).split("\n").map(s=>x.measureText(s).width))>maxW){p*=.94;x.font=font(p)}return p}
function spaced(x,txt,cx,y,sp){const s=String(txt).toUpperCase(),w=[...s].reduce((a,c)=>a+x.measureText(c).width+sp,-sp);let px=cx-w/2;x.textAlign="left";for(const c of s){x.fillText(c,px,y);px+=x.measureText(c).width+sp}x.textAlign="center"}
function scallop(x,X,Y,W,H,r){x.save();x.globalCompositeOperation="destination-out";const n=Math.max(4,Math.round(W/(r*2.7))),m=Math.max(4,Math.round(H/(r*2.7)));
  for(let i=0;i<=n;i++){x.beginPath();x.arc(X+i*W/n,Y,r,0,7);x.arc(X+i*W/n,Y+H,r,0,7);x.fill()}for(let j=0;j<=m;j++){x.beginPath();x.arc(X,Y+j*H/m,r,0,7);x.arc(X+W,Y+j*H/m,r,0,7);x.fill()}x.restore()}
function wave(x,X,Y,W,amp,n){x.beginPath();for(let i=0;i<=40;i++){const t=i/40;x.lineTo(X+t*W,Y+Math.sin(t*Math.PI*2*n)*amp)}x.stroke()}
const STK={
  stamp:{name:"Stamp",r:1.24,w:.5,paper:"#F4E9D2",ink:"#23336B",f:{top:"Current mood",title:"taking\na break",bottom:"September\nout of office"},big:["title","bottom"],
    draw(x,W,H,L){const u=W/100,f=L.f,p=L.paper,ink=L.ink;x.fillStyle=p;x.fillRect(0,0,W,H);scallop(x,0,0,W,H,2.2*u);
      x.strokeStyle=ink;x.lineWidth=.45*u;x.strokeRect(7*u,7*u,W-14*u,H-14*u);x.fillStyle=ink;x.textAlign="center";x.textBaseline="middle";
      x.save();x.translate(W/2,H*.15);x.lineWidth=.9*u;x.lineCap="round";for(let i=-3;i<=3;i++){x.save();x.rotate(i*.33);x.beginPath();x.moveTo(0,1.5*u);x.quadraticCurveTo(1.2*u,-3*u,0,-7.5*u);x.stroke();x.restore()}x.restore();
      x.font=F(700,4*u,"DM Sans");spaced(x,f.top,W/2,H*.27,.55*u);
      const tl=String(f.title).split("\n"),tp=fit(x,tl.join("\n"),q=>F(400,q,"DM Serif Display"),17*u,W*.74);tl.forEach((t,i)=>x.fillText(t,W/2,H*.47+(i-(tl.length-1)/2)*tp*.92));
      x.font=F(700,3.7*u,"DM Sans");String(f.bottom).split("\n").forEach((t,i,a)=>spaced(x,t,W/2,H*.72+(i-(a.length-1)/2)*5*u,.45*u));
      x.lineWidth=.6*u;for(let i=0;i<3;i++)wave(x,W*.62,H*.85+i*2.2*u,W*.26,.8*u,2.5)}},
  ministamp:{name:"Mini stamp",r:.7,w:.48,paper:"#F4E9D2",ink:"#2A1D14",f:{text:"Some places\ndeserve a stamp"},big:["text"],
    draw(x,W,H,L){const u=W/100;x.fillStyle=L.paper;x.fillRect(0,0,W,H);scallop(x,0,0,W,H,2.1*u);x.strokeStyle=L.ink;x.globalAlpha=.35;x.lineWidth=.35*u;x.strokeRect(6*u,6*u,W-12*u,H-12*u);x.globalAlpha=1;
      x.fillStyle=L.ink;x.textAlign="center";x.textBaseline="middle";const tl=String(L.f.text).split("\n"),tp=fit(x,tl.join("\n"),q=>F(700,q,"Caveat"),13*u,W*.78);tl.forEach((t,i)=>x.fillText(t,W/2,H*.53+(i-(tl.length-1)/2)*tp*1.02));
      x.save();x.globalAlpha=.55;x.strokeStyle=L.ink;x.lineWidth=.55*u;x.beginPath();x.arc(W*.12,H*.14,9*u,0,7);x.stroke();x.beginPath();x.arc(W*.12,H*.14,6.8*u,0,7);x.stroke();for(let i=0;i<3;i++)wave(x,W*.22,H*.08+i*2.6*u,W*.26,.9*u,2.5);x.restore()}},
  note:{name:"Note",r:1.28,w:.6,paper:"#FBF8F1",ink:"#2A2E45",f:{text:"We write notes that feel lighter. Little words to remember the slow days, the sun and the people who make them good.",sign:"With love, me"},big:["text"],
    draw(x,W,H,L){const u=W/100;x.fillStyle=L.paper;x.fillRect(0,0,W,H);const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"rgba(255,255,255,.25)");g.addColorStop(1,"rgba(0,0,0,.05)");x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle=L.ink;x.textAlign="left";x.textBaseline="alphabetic";x.font=F(400,4.6*u,"Homemade Apple");const ls=lines(x,L.f.text,W*.8);let y=H*.17;const lh=7.4*u;ls.slice(0,Math.floor((H*.66)/lh)).forEach(t=>{x.fillText(t,W*.1,y);y+=lh});
      x.font=F(400,4.4*u,"Homemade Apple");x.textAlign="right";x.fillText(L.f.sign||"",W*.9,H*.9);
      x.save();x.translate(W*.78,-H*.02);x.rotate(.12);x.strokeStyle="#8d9095";x.lineWidth=1.1*u;x.lineCap="round";x.beginPath();x.moveTo(0,11*u);x.lineTo(0,-1*u);x.arc(2.6*u,-1*u,2.6*u,Math.PI,0);x.lineTo(5.2*u,15*u);x.arc(1.4*u,15*u,3.8*u,0,Math.PI);x.lineTo(-2.4*u,3*u);x.stroke();x.restore()}},
  sticky:{name:"Sticky note",r:1,w:.56,paper:"#F2DD6E",ink:"#25306B",f:{top:"Coffee thoughts",text:"Your urgency isn't always their emergency.",bottom:"Monday · 9 am"},big:["text"],
    draw(x,W,H,L){const u=W/100;x.fillStyle=L.paper;x.fillRect(0,0,W,H);const g=x.createLinearGradient(0,H*.6,W,H);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.12)");x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle=L.ink;x.textAlign="center";x.textBaseline="middle";x.font=F(700,3.6*u,"DM Sans");spaced(x,L.f.top,W/2,H*.12,.6*u);spaced(x,L.f.bottom,W/2,H*.9,.6*u);
      let px=12*u;x.font=F(700,px,"Caveat");let ls=lines(x,L.f.text,W*.8);while(ls.length*px*1.05>H*.62&&px>5*u){px*=.92;x.font=F(700,px,"Caveat");ls=lines(x,L.f.text,W*.8)}ls.forEach((t,i)=>x.fillText(t,W/2,H*.51+(i-(ls.length-1)/2)*px*1.02))}},
  ticket:{name:"Ticket",r:.44,w:.68,paper:"#F4E9D2",ink:"#2A1D14",f:{label:"Admit one",title:"Ibiza",date:"19.06.2026",code:"No. 0042"},big:[],
    draw(x,W,H,L){const u=W/100,sx=W*.74;x.fillStyle=L.paper;x.fillRect(0,0,W,H);x.save();x.globalCompositeOperation="destination-out";x.beginPath();x.arc(sx,0,3.2*u,0,7);x.arc(sx,H,3.2*u,0,7);x.fill();x.beginPath();x.arc(0,H/2,2.4*u,0,7);x.arc(W,H/2,2.4*u,0,7);x.fill();x.restore();
      x.strokeStyle=L.ink;x.globalAlpha=.5;x.setLineDash([1.4*u,1.4*u]);x.lineWidth=.45*u;x.beginPath();x.moveTo(sx,5*u);x.lineTo(sx,H-5*u);x.stroke();x.setLineDash([]);x.globalAlpha=1;
      x.fillStyle=L.ink;x.textBaseline="middle";x.textAlign="left";x.font=F(700,2.6*u,"DM Sans");spaced(x,L.f.label,W*.2,H*.18,.5*u);x.textAlign="left";x.font=F(700,2.4*u,"DM Sans");x.globalAlpha=.7;x.fillText("DATE",W*.06,H*.78);x.fillText("FROM",W*.3,H*.78);x.globalAlpha=1;
      x.font=F(700,3*u,"DM Sans");x.fillText(L.f.date,W*.06,H*.88);x.fillText("Gate 7",W*.3,H*.88);
      const tp=fit(x,L.f.title,q=>F(400,q,"Bebas Neue"),19*u,W*.62);x.font=F(400,tp,"Bebas Neue");x.fillText(L.f.title,W*.06,H*.5);
      x.lineWidth=.35*u;x.beginPath();x.moveTo(W*.06,H*.68);x.lineTo(W*.68,H*.68);x.stroke();
      x.save();x.translate(W*.87,H/2);x.rotate(-Math.PI/2);x.textAlign="center";x.font=F(400,7*u,"Bebas Neue");x.fillText(L.f.code,0,0);x.restore();
      x.save();x.translate(W*.87,H*.16);x.lineWidth=.5*u;x.beginPath();x.arc(0,0,2.3*u,0,7);x.stroke();for(let i=0;i<8;i++){x.rotate(Math.PI/4);x.beginPath();x.moveTo(3.2*u,0);x.lineTo(4.4*u,0);x.stroke()}x.restore()}},
  postcard:{name:"Postcard",r:.66,w:.82,paper:"#F4E9D2",ink:"#2A1D14",f:{hello:"Welcome to",place:"Last Minute",msg:"Sun, salt and slow mornings. Wish you were here!"},big:["msg"],
    draw(x,W,H,L){const u=W/100,dv=W*.56;x.fillStyle=L.paper;x.fillRect(0,0,W,H);
      const sw=2.2*u;x.save();x.beginPath();x.rect(0,H-sw*1.6,W,sw*1.6);x.clip();for(let i=-2;i<W/sw+2;i++){x.fillStyle=i%2?"#2B4C8C":"#C4452F";x.beginPath();x.moveTo(i*sw*2,H);x.lineTo(i*sw*2+sw,H);x.lineTo(i*sw*2+sw*2.6,H-sw*1.6);x.lineTo(i*sw*2+sw*1.6,H-sw*1.6);x.fill()}x.restore();
      x.strokeStyle=L.ink;x.globalAlpha=.35;x.lineWidth=.35*u;x.beginPath();x.moveTo(dv,8*u);x.lineTo(dv,H-10*u);x.stroke();for(let i=0;i<4;i++){x.beginPath();x.moveTo(dv+5*u,H*.5+i*6.5*u);x.lineTo(W-6*u,H*.5+i*6.5*u);x.stroke()}x.globalAlpha=1;
      x.setLineDash([1*u,1*u]);x.strokeRect(W-21*u,7*u,14*u,17*u);x.setLineDash([]);x.save();x.translate(W-14*u,15.5*u);x.lineWidth=.5*u;x.beginPath();x.arc(0,0,2.6*u,0,7);x.stroke();x.restore();
      x.fillStyle="#C4452F";x.textAlign="left";x.textBaseline="alphabetic";x.font=F(400,6.4*u,"Great Vibes");x.fillText(L.f.hello,6*u,22*u);
      x.fillStyle=L.ink;const pp=fit(x,L.f.place,q=>F(700,q,"Playfair Display"),8.5*u,dv-12*u);x.font=F(700,pp,"Playfair Display");x.fillText(L.f.place,6*u,22*u+pp*1.05);
      x.font=F(700,2.5*u,"DM Sans");x.globalAlpha=.75;const ls=lines(x,L.f.msg,dv-13*u);ls.slice(0,7).forEach((t,i)=>x.fillText(t,6*u,22*u+pp*1.05+7*u+i*3.6*u));x.globalAlpha=1}},
  frame:{name:"Stamp frame",r:1.25,w:.74,paper:"#FFFFFF",ink:"#2A1D14",f:{},big:[],
    draw(x,W,H,L){const u=W/100;x.fillStyle=L.paper;x.fillRect(0,0,W,H);scallop(x,0,0,W,H,2.4*u);x.save();x.globalCompositeOperation="destination-out";x.fillRect(9*u,9*u,W-18*u,H-18*u);x.restore()}},
  postmark:{name:"Postmark",r:.48,w:.5,paper:null,ink:"#2A1D14",f:{place:"Welcome to Paris",date:"24 NOV 2026"},big:[],
    draw(x,W,H,L){const u=W/100,R=H*.44,cx=R+1*u,cy=H/2;x.strokeStyle=L.ink;x.fillStyle=L.ink;x.globalAlpha=.85;x.lineWidth=.7*u;x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();x.beginPath();x.arc(cx,cy,R*.66,0,7);x.stroke();
      x.font=F(700,3.2*u,"DM Sans");x.textAlign="center";x.textBaseline="middle";const t=String(L.f.place).toUpperCase()+" · ",n=t.length;for(let i=0;i<n;i++){const a=-Math.PI/2+(i/n)*Math.PI*2;x.save();x.translate(cx+Math.cos(a)*R*.83,cy+Math.sin(a)*R*.83);x.rotate(a+Math.PI/2);x.fillText(t[i],0,0);x.restore()}
      x.font=F(700,3.4*u,"DM Sans");x.fillText(L.f.date,cx,cy);x.lineWidth=.7*u;for(let i=0;i<4;i++)wave(x,cx+R*1.1,cy-6*u+i*4*u,W-cx-R*1.1-2*u,1.2*u,3);x.globalAlpha=1}},
  tape:{name:"Tape",r:.26,w:.34,paper:"#E8C46A",ink:"#2A1D14",f:{},big:[],
    draw(x,W,H,L){const u=W/100;x.globalAlpha=.78;x.fillStyle=L.paper;x.beginPath();x.moveTo(0,0);for(let i=0;i<=8;i++)x.lineTo((i%2?2.5:0)*u,i*H/8);x.lineTo(W,H);for(let i=8;i>=0;i--)x.lineTo(W-(i%2?2.5:0)*u,i*H/8);x.closePath();x.fill();
      x.globalAlpha=.12;x.strokeStyle="#fff";x.lineWidth=.6*u;for(let i=0;i<4;i++){x.beginPath();x.moveTo(5*u,H*(.2+i*.2));x.lineTo(W-5*u,H*(.2+i*.2));x.stroke()}x.globalAlpha=1}}
};
const STK_TRAVEL=["stamp","ministamp","sticky","note","ticket","postcard","frame","postmark","tape"];STK_TRAVEL.forEach(k=>STK[k].cat="travel");
if(window.STK_PACK)Object.assign(STK,window.STK_PACK({F,fit,lines,spaced,scallop,wave}));
const STK_CATS=(window.STK_CATS||[["travel","Travel & paper"]]).filter(([c])=>Object.values(STK).some(d=>d.cat===c));
const STK_ORDER=Object.keys(STK);const stkOf=c=>STK_ORDER.filter(k=>STK[k].cat===c&&!STK[k].hidden);
const STK_FIELDS={top:"Top line",title:"Title",bottom:"Bottom lines",text:"Text",sign:"Signature",label:"Label",date:"Date",code:"Number",hello:"Greeting",place:"Place",msg:"Message",t1:"Time 1",t2:"Time 2",t3:"Time 3",d1:"Day 1",d2:"Day 2",d3:"Day 3"};
function newStk(kind){const k=STK[kind];return{id:uidS(),t:"stk",kind,x:SW/2,y:SH*.5,w:SW*k.w,rot:k.rot!=null?k.rot:kind==="tape"?-8:kind==="frame"?0:-3,paper:k.paper,ink:k.ink,f:clone(k.f),shadow:!k.noShadow&&kind!=="postmark"&&kind!=="tape",hidden:false}}
const stCache=new Map();const STM=.1; // margin around a sticker canvas (room for shadows & postmarks)
function stkBitmap(L,pxW){stkFonts();const def=STK[L.kind];if(!def)return null;const key=JSON.stringify([L.kind,L.paper,L.ink,L.f])+"|"+Math.round(pxW);let t=stCache.get(L.id);if(t&&t.key===key)return t;if(ST.gesture&&t)return t;
  const W=Math.max(8,Math.round(pxW)),H=Math.round(W*def.r),m=Math.round(W*STM),c=document.createElement("canvas");c.width=W+2*m;c.height=H+2*m;const x=c.getContext("2d");x.translate(m,m);try{def.draw(x,W,H,L)}catch(e){}
  t={key,c,W,H,m};stCache.set(L.id,t);return t}
function drawStk(x,L,k){const t=stkBitmap(L,L.w*k);if(!t)return;const f=L.w*k/t.W;if(L.shadow){x.shadowColor="rgba(0,0,0,.35)";x.shadowBlur=26*k;x.shadowOffsetY=10*k}
  x.drawImage(t.c,(-t.W/2-t.m)*f,(-t.H/2-t.m)*f,t.c.width*f,t.c.height*f);x.shadowColor="transparent"}
function stkThumb(kind){const L=newStk(kind),def=STK[kind];if(kind==="postmark")L.ink="#F6E9D7";const W=120,H=Math.round(W*def.r),m=Math.round(W*STM),c=document.createElement("canvas");c.width=W+2*m;c.height=H+2*m;const x=c.getContext("2d");x.translate(m,m);try{def.draw(x,W,H,L)}catch(e){}return c}

/* ---------- story titles: typography only, edited like any other title ---------- */
function storyTitles(){if(typeof L!=="function"||typeof D!=="function")return[];return[
  D("sx1","Story","Film title",[L("aftersun","Montserrat",320,0,-30,{weight:800,spacing:-10}),L("Directed by you   |   Starring the weekend   |   2026","DM Sans",30,0,135,{weight:700,spacing:5,upper:true})],{colors:{main:"#FFFFFF",accent:"#F26B50"}}),
  D("sx2","Story","Current mood",[L("Current mood","DM Sans",42,0,-230,{weight:700,spacing:16,upper:true,color:"accent"}),L("taking","DM Serif Display",230,0,-75),L("a break","DM Serif Display",230,0,120),L("September · out of office","DM Sans",38,0,275,{weight:700,spacing:10,upper:true,color:"accent"})],{colors:{main:"#F6E9D7",accent:"#E9B77C"}}),
  D("sx3","Story","Postcard title",[L("Welcome to","Great Vibes",150,-90,-85,{rotate:-4,color:"accent"}),L("Last Minute","Playfair Display",200,0,70,{weight:400})],{colors:{main:"#FFFFFF",accent:"#F26B50"}}),
  D("sx4","Story","Handwritten caption",[L("One of Mallorca's most","Caveat",118,0,-62,{weight:400}),L("beautiful walks","Caveat",118,0,62,{weight:400})],{colors:{main:"#FFFFFF",accent:"#F26B50"}}),
  D("sx5","Story","Coffee thoughts",[L("Coffee thoughts","DM Sans",40,0,-230,{weight:700,spacing:16,upper:true,color:"accent"}),L("Your urgency","Homemade Apple",105,0,-85),L("isn't always","Homemade Apple",105,0,45),L("their emergency.","Homemade Apple",105,0,175)],{colors:{main:"#FFFFFF",accent:"#E9B77C"}})
]}
let STT=null;const sTitles=()=>STT||(STT=storyTitles());

/* ---------- renderer ---------- */
let grainTile=null;
function grain(){if(grainTile)return grainTile;const c=document.createElement("canvas");c.width=c.height=256;const x=c.getContext("2d"),d=x.createImageData(256,256);
  for(let i=0;i<d.data.length;i+=4){const v=128+(Math.random()-.5)*190;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);return grainTile=c}
function rrect(x,X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
function render(ctx,W,H,o={}){
  const k=W/SW,b=S.bg;ctx.save();ctx.clearRect(0,0,W,H);
  // background
  const bc=b.type==="photo"?drawBgPhoto(ctx,W,H):false;
  if(bc){}
  else if(b.type==="color"){ctx.fillStyle=b.color;ctx.fillRect(0,0,W,H)}
  else{const g=GRADS[b.grad]||GRADS[0],lg=ctx.createLinearGradient(0,0,W*.35,H);lg.addColorStop(0,g[0]);lg.addColorStop(1,g[1]);ctx.fillStyle=lg;ctx.fillRect(0,0,W,H)}
  if(b.dim>0&&(bc||b.type!=="color")){ctx.fillStyle=`rgba(0,0,0,${b.dim})`;ctx.fillRect(0,0,W,H)}
  // layers
  for(const L of S.layers){if(L.hidden)continue;ctx.save();ctx.translate(L.x*k,L.y*k);ctx.rotate((L.rot||0)*Math.PI/180);
    if(L.t==="photo")drawPhoto(ctx,L,k);else if(L.t==="stk")drawStk(ctx,L,k);else drawTitle(ctx,L,k);ctx.restore()}
  // finishing
  if(S.fx.leak){const g=ctx.createRadialGradient(W*.05,H*.08,0,W*.05,H*.08,W*.95);g.addColorStop(0,"rgba(255,140,60,.55)");g.addColorStop(.45,"rgba(255,90,60,.18)");g.addColorStop(1,"rgba(255,90,60,0)");ctx.globalCompositeOperation="screen";ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation="source-over"}
  if(S.fx.vig){const g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.56);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.6)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  if(S.fx.grain){const p=ctx.createPattern(grain(),"repeat"),sc=Math.max(.6,k*1.6);ctx.save();ctx.globalAlpha=.16;ctx.globalCompositeOperation="overlay";ctx.scale(sc,sc);ctx.fillStyle=p;ctx.fillRect(0,0,W/sc,H/sc);ctx.restore()}
  // editor-only overlays
  if(o.sel&&ST.editing){const L=layerById(ST.editing);if(L)drawLineSel(ctx,L,k,o.dpr)}
  else if(o.sel){const L=selL();if(L&&!L.hidden){const B=bounds(L,k),p=10*(o.dpr||1);ctx.save();ctx.translate(L.x*k,L.y*k);ctx.rotate((L.rot||0)*Math.PI/180);
    const X=(B.dx-B.hw)*k-p,Y=(B.dy-B.hh)*k-p,w=B.hw*2*k+2*p,h=B.hh*2*k+2*p;ctx.lineWidth=1.5*(o.dpr||1);ctx.setLineDash([6*(o.dpr||1),5*(o.dpr||1)]);
    ctx.strokeStyle="rgba(0,0,0,.5)";ctx.strokeRect(X+1,Y+1,w,h);ctx.strokeStyle="#fff";ctx.strokeRect(X,Y,w,h);ctx.restore()}}
  if(o.guideX){ctx.save();ctx.strokeStyle="rgba(242,107,80,.95)";ctx.lineWidth=1.5*(o.dpr||1);ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();ctx.restore()}
  if(o.safe){ctx.save();ctx.setLineDash([5*(o.dpr||1),6*(o.dpr||1)]);ctx.strokeStyle="rgba(246,233,215,.42)";ctx.lineWidth=1*(o.dpr||1);[.12,.8].forEach(f=>{ctx.beginPath();ctx.moveTo(0,H*f);ctx.lineTo(W,H*f);ctx.stroke()});ctx.restore()}
  ctx.restore()}
function drawPhoto(x,L,k){const B=photoBox(L),Wf=B.W*k,Hf=B.H*k,X=-Wf/2,Y=-Hf/2;
  if(L.shadow){x.shadowColor="rgba(0,0,0,.42)";x.shadowBlur=34*k;x.shadowOffsetY=14*k}
  const inner=[X+B.l*k,Y+B.t*k,B.w*k,B.h*k];
  if(L.frame==="polaroid"||L.frame==="border"){x.fillStyle=L.frame==="polaroid"?"#F7F1E6":"#FFFFFF";x.fillRect(X,Y,Wf,Hf)}
  else if(L.frame==="film"){x.fillStyle="#141210";x.fillRect(X,Y,Wf,Hf)}
  const pc=photoCanvas(L,inner[2],inner[3]);
  if(L.frame==="rounded"){x.save();rrect(x,...inner,B.w*k*.06);if(L.shadow){x.fillStyle="#000";x.fill()}x.shadowColor="transparent";x.clip();if(pc)x.drawImage(pc,...inner);x.restore()}
  else{if(L.frame==="none"&&L.shadow&&pc){x.drawImage(pc,...inner)}x.shadowColor="transparent";if(pc)x.drawImage(pc,...inner);else{x.fillStyle="#3a2a1f";x.fillRect(...inner)}}
  x.shadowColor="transparent";
  if(L.frame==="film"){x.fillStyle="#E9DCC6";const n=Math.max(4,Math.round(B.H/90)),hw=B.l*k*.42,hh=hw*.72;for(let i=0;i<n;i++){const yy=Y+(i+.5)*Hf/n-hh/2;rrect(x,X+B.l*k*.29,yy,hw,hh,hh*.25);x.fill();rrect(x,X+Wf-B.r*k*.29-hw,yy,hw,hh,hh*.25);x.fill()}}
  if(L.frame==="polaroid"&&L.cap){x.fillStyle="#3a2a1f";x.textAlign="center";x.textBaseline="middle";const fs=B.w*k*.085;x.font=`${fs}px Yellowtail, cursive`;x.fillText(L.cap,0,Y+Hf-B.b*k*.5,B.w*k*.92)}}
function drawTitle(x,L,k){fontsFor(L);const px=L.s*SW*k/FRAME,t=titleBitmap(L,px),f=px/t.px;x.drawImage(t.c,t.ox*f,t.oy*f,t.c.width*f,t.c.height*f)}

/* ---------- on-screen canvas ---------- */
let rq=false,guide=false;
function draw(){if(rq||!ST.open)return;rq=true;requestAnimationFrame(()=>{rq=false;const cv=$s("stCanvas"),wrap=$s("stCanvasWrap");if(!cv||!wrap)return;
  const r=wrap.getBoundingClientRect();if(r.width<10||r.height<10)return;
  let cw=r.width,ch=cw*16/9;if(ch>r.height){ch=r.height;cw=ch*9/16}cw=Math.floor(cw);ch=Math.floor(ch);
  cv.style.width=cw+"px";cv.style.height=ch+"px";
  const dpr=Math.min(2,window.devicePixelRatio||1),W=Math.round(cw*dpr),H=Math.round(ch*dpr);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  const box=$s("stCanvasBox");box.style.width=cw+"px";box.style.height=ch+"px";
  render(cv.getContext("2d"),W,H,{sel:true,dpr,guideX:guide,safe:ST.tool===null&&!ST.gesture&&!ST.sel});
  placeChrome(cw,ch,dpr)})}
const fontReady=new Set();
function fontsFor(L){const k=L.id+"|"+JSON.stringify(L.d);if(fontReady.has(k))return true;
  ensureFonts(L.d).then(()=>{if(fontReady.has(k))return;fontReady.add(k);ttCache.delete(L.id);draw()}).catch(()=>{});return false}
function placeChrome(cw,ch,dpr){const L=selL(),del=$s("stDel"),mini=$s("stMini");if(!del)return;updTop();
  if(!L||L.hidden||ST.editing||ST.picking){del.hidden=true;mini.hidden=true;return}
  const k=cw/SW,B=bounds(L,k*dpr),a=(L.rot||0)*Math.PI/180,co=Math.cos(a),si=Math.sin(a),p=10/k;
  const cx=B.dx+B.hw+p,cy=B.dy-B.hh-p;const X=(L.x+cx*co-cy*si)*k,Y=(L.y+cx*si+cy*co)*k;
  del.hidden=false;del.style.left=clamp(X,14,cw-14)+"px";del.style.top=clamp(Y,14,ch-14)+"px";
  // floating mini toolbar: just above the dock (iPhone / cover screen) or at the top of the canvas (Duo open)
  renderMini(L);const panelOpen=!!ST.tool&&!wide();mini.hidden=ST.gesture||panelOpen;if(mini.hidden)return;
  const mh=mini.offsetHeight||46,mw=mini.offsetWidth||220,box=$s("stCanvasBox").getBoundingClientRect();
  let my=10;if(!wide()){const d=$s("stDock").getBoundingClientRect();my=Math.min(ch-mh-10,d.top-box.top-mh-12)}
  mini.style.top=my+"px";mini.style.left=clamp((cw-mw)/2,6,cw-mw-6)+"px"}

/* ---------- lines inside a title (while editing it) ---------- */
function toDesign(L,px,py){const a=-(L.rot||0)*Math.PI/180,dx=px-L.x,dy=py-L.y,u=L.s*SW/FRAME;return{x:(dx*Math.cos(a)-dy*Math.sin(a))/u,y:(dx*Math.sin(a)+dy*Math.cos(a))/u}}
function lineAt(L,px,py){const t=ttCache.get(L.id);if(!t||!t.boxes)return -1;const p=toDesign(L,px,py),d=L.d;
  for(let i=d.layers.length-1;i>=0;i--){const Ly=d.layers[i],B=t.boxes[i];if(!B)continue;const a=-(Ly.rotate||0)*Math.PI/180,x=p.x-Ly.x,y=p.y-Ly.y,lx=x*Math.cos(a)-y*Math.sin(a),ly=x*Math.sin(a)+y*Math.cos(a),pad=24;
    if(lx>=-B.l-pad&&lx<=B.r+pad&&ly>=-B.t-pad&&ly<=B.b+pad)return i}return -1}
function drawLineSel(ctx,L,k,dpr){const t=ttCache.get(L.id),i=sel,Ly=L.d.layers[i],B=t&&t.boxes&&t.boxes[i];if(!Ly||!B)return;const u=L.s*SW/FRAME*k,p=8*(dpr||1);
  ctx.save();ctx.translate(L.x*k,L.y*k);ctx.rotate((L.rot||0)*Math.PI/180);ctx.translate(Ly.x*u,Ly.y*u);ctx.rotate((Ly.rotate||0)*Math.PI/180);
  ctx.lineWidth=1.5*(dpr||1);ctx.setLineDash([6*(dpr||1),5*(dpr||1)]);ctx.strokeStyle="rgba(0,0,0,.5)";ctx.strokeRect(-B.l*u-p+1,-B.t*u-p+1,(B.l+B.r)*u+2*p,(B.t+B.b)*u+2*p);
  ctx.strokeStyle="#fff";ctx.strokeRect(-B.l*u-p,-B.t*u-p,(B.l+B.r)*u+2*p,(B.t+B.b)*u+2*p);ctx.restore()}

/* ---------- hit test & gestures ---------- */
function hit(px,py){const cv=$s("stCanvas"),k=cv.clientWidth/SW;
  for(let i=S.layers.length-1;i>=0;i--){const L=S.layers[i];if(L.hidden)continue;const B=bounds(L,k*Math.min(2,window.devicePixelRatio||1)),a=-(L.rot||0)*Math.PI/180,dx=px-L.x,dy=py-L.y;
    const lx=dx*Math.cos(a)-dy*Math.sin(a)-B.dx,ly=dx*Math.sin(a)+dy*Math.cos(a)-B.dy,pad=18;
    if(Math.abs(lx)<=B.hw+pad&&Math.abs(ly)<=B.hh+pad)return L}return null}
function gestures(){const cv=$s("stCanvas"),pts=new Map();let g=null,lastTap={t:0,id:null};
  const unit=e=>{const r=cv.getBoundingClientRect(),k=SW/r.width;return{x:(e.clientX-r.left)*k,y:(e.clientY-r.top)*k}};
  const two=()=>{const [a,b]=[...pts.values()];return{d:Math.hypot(b.x-a.x,b.y-a.y),a:Math.atan2(b.y-a.y,b.x-a.x),cx:(a.x+b.x)/2,cy:(a.y+b.y)/2}};
  cv.addEventListener("pointerdown",e=>{e.preventDefault();cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);const u=unit(e);pts.set(e.pointerId,u);
    if(pts.size===1){const L=hit(u.x,u.y);
      if(ST.editing&&(!L||L.id!==ST.editing)){finishEdit();g=null;return}
      if(ST.editing){const i=lineAt(L,u.x,u.y);if(i>=0){if(i!==sel){sel=i;selShown=true;renderLayerChips();renderTool();hapt()}const Ly=L.d.layers[i],q=toDesign(L,u.x,u.y);
          g={mode:"line",L,Ly,sx:q.x,sy:q.y,ox:Ly.x,oy:Ly.y,moved:false,hs:false};draw();return}g=null;return}
      if(!L){const had=!!ST.sel;if(had){ST.sel=null;renderPanel();draw()}
        g=bgSource()&&!ST.editing?{mode:"bg",sx:u.x,sy:u.y,ox:S.bg.ox||0,oy:S.bg.oy||0,snap:JSON.stringify(S),moved:false}:null;return}
      const now=Date.now();if(L.t==="title"&&lastTap.id===L.id&&now-lastTap.t<320){lastTap={t:0,id:null};editTitle(L.id);return}lastTap={t:now,id:L.id};
      if(ST.sel!==L.id){ST.sel=L.id;renderPanel()}g={mode:"drag",L,sx:u.x,sy:u.y,ox:L.x,oy:L.y,snap:JSON.stringify(S),moved:false};ST.gesture=false;draw()}
    else if(pts.size===2){if((g&&g.mode==="bg")||(!selL()&&bgSource()&&!ST.editing)){const t=two();g={mode:"bgpinch",d0:t.d,cx:t.cx,cy:t.cy,z0:S.bg.z||1,ox:S.bg.ox||0,oy:S.bg.oy||0,snap:g?g.snap:JSON.stringify(S),moved:true};ST.gesture=true;return}
      const L=selL()||(g&&g.L);if(!L)return;const t=two();g={mode:"pinch",L,d0:t.d,a0:t.a,cx:t.cx,cy:t.cy,ox:L.x,oy:L.y,w0:L.w,s0:L.s,r0:L.rot||0,snap:g?g.snap:JSON.stringify(S),moved:true};ST.gesture=true}});
  cv.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;const u=unit(e);pts.set(e.pointerId,u);if(!g)return;
    if(g.mode==="line"&&pts.size===1){const q=toDesign(g.L,u.x,u.y),dx=q.x-g.sx,dy=q.y-g.sy;if(!g.moved&&Math.hypot(dx,dy)*g.L.s*SW/FRAME<6)return;if(!g.moved){g.moved=true;snap()}
      g.Ly.x=Math.round(g.ox+dx);g.Ly.y=Math.round(g.oy+dy);ttCache.delete(g.L.id);draw();return}
    if(g.mode==="bg"&&pts.size===1){const dx=u.x-g.sx,dy=u.y-g.sy;if(!g.moved&&Math.hypot(dx,dy)<6)return;g.moved=true;ST.gesture=true;S.bg.ox=g.ox+dx;S.bg.oy=g.oy+dy;draw();return}
    if(g.mode==="bgpinch"&&pts.size===2){const t=two();S.bg.z=clamp(g.z0*t.d/g.d0,1,5);S.bg.ox=g.ox+(t.cx-g.cx);S.bg.oy=g.oy+(t.cy-g.cy);draw();return}
    if(g.mode==="drag"&&pts.size===1){const dx=u.x-g.sx,dy=u.y-g.sy;if(!g.moved&&Math.hypot(dx,dy)<6)return;g.moved=true;ST.gesture=true;let nx=g.ox+dx;guide=Math.abs(nx-SW/2)<14;if(guide)nx=SW/2;g.L.x=clamp(nx,-SW*.3,SW*1.3);g.L.y=clamp(g.oy+dy,-SH*.2,SH*1.2);draw()}
    else if(g.mode==="pinch"&&pts.size===2){const t=two(),f=clamp(t.d/g.d0,.15,8);
      if(g.L.t!=="title")g.L.w=clamp(g.w0*f,SW*.08,SW*2.2);else g.L.s=clamp(g.s0*f,.12,3.2);
      let r=g.r0+(t.a-g.a0)*180/Math.PI;r=((r+180)%360+360)%360-180;for(const s of[0,90,-90,180,-180])if(Math.abs(r-s)<4)r=s;g.L.rot=r;
      g.L.x=g.ox+(t.cx-g.cx);g.L.y=g.oy+(t.cy-g.cy);draw()}});
  const end=e=>{pts.delete(e.pointerId);if(pts.size===0&&g&&g.mode==="line"){if(g.moved){renderTool(true);updTop()}g=null;draw();return}if(pts.size===0){if(g&&g.moved){if(g.mode==="bg"||g.mode==="bgpinch")clampBg();ST.hist.push(g.snap);if(ST.hist.length>60)ST.hist.shift();ST.fut=[];ST.gesture=false;guide=false;changed();
      if(ST.tool)renderPanel()}g=null;ST.gesture=false;guide=false;draw()}
    else if(pts.size===1&&g&&g.mode==="bgpinch"){const [u]=[...pts.values()];g={mode:"bg",sx:u.x,sy:u.y,ox:S.bg.ox,oy:S.bg.oy,snap:g.snap,moved:true}}
    else if(pts.size===1&&g&&g.mode==="pinch"){const [u]=[...pts.values()];g={mode:"drag",L:g.L,sx:u.x,sy:u.y,ox:g.L.x,oy:g.L.y,snap:g.snap,moved:true}}};
  cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",end);
  cv.addEventListener("wheel",e=>{const L=selL();if(!L){if(!bgSource())return;e.preventDefault();S.bg.z=clamp((S.bg.z||1)*Math.exp(-e.deltaY*.0015),1,5);draw();clearTimeout(ST.wt);ST.wt=setTimeout(()=>{clampBg();changed()},300);return}e.preventDefault();const f=Math.exp(-e.deltaY*.0015);if(L.t!=="title")L.w=clamp(L.w*f,SW*.08,SW*2.2);else L.s=clamp(L.s*f,.12,3.2);draw();clearTimeout(ST.wt);ST.wt=setTimeout(()=>changed(),300)},{passive:false})}

/* ---------- UI ---------- */
function build(){if($s("storyEd"))return;
  const el=document.createElement("div");el.className="storyEd hidden";el.id="storyEd";el.setAttribute("role","dialog");el.setAttribute("aria-label","Story editor");
  el.innerHTML=`
  <div class="sStageCol"><div class="sCanvasWrap" id="stCanvasWrap"><div class="sCanvasBox" id="stCanvasBox"><canvas id="stCanvas" aria-label="Your story"></canvas>
    <button class="sDel" id="stDel" hidden aria-label="Delete layer"><svg viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8"/></svg></button>
    <div class="sMini" id="stMini" hidden role="toolbar" aria-label="Layer tools"></div>
    <button class="sEmpty" id="stEmpty" hidden><span class="sEmptyIc">${svg("photo",1.7)}</span><b>Add your photo</b><small>It fills your whole story, just like in Instagram</small></button>
  </div></div></div>
  <div class="sSide">
    <header class="sTop">
      <div class="sSeg sGlass" role="tablist" aria-label="Mode"><button role="tab" aria-selected="false" id="stToSticker">Typo Templates</button><button role="tab" aria-selected="true" class="on">Story Builder</button></div>
      <span class="sFlex"></span>
      <button class="sBtn sGlass" id="stUndo" aria-label="Undo" disabled>${svg("undo",2.1)}</button>
      <button class="sSave" id="stSave" aria-label="Save story">${svg("down",2.2)}<span class="sSaveL">Save</span><i class="sLock" id="stLock">${svg("lock",2.6)}</i></button>
    </header>
    <section class="sPanel" id="stPanel" hidden></section>
    <section class="sPanel sEdit" id="stEdit" hidden aria-label="Edit text"><div class="sEdChips" id="stEdChips" hidden></div><div class="sEdBody" id="stEdBody"></div></section>
    <div class="sEdTip" id="stEdTip" hidden>Tap a line on your story, then pick a tool</div>
    <section class="sPanel sLib" id="stLib" hidden aria-label="Library"><div class="sHead"><b>Add a design</b><button class="sChip" id="stLibClose">Close</button></div><div id="stLibHost"></div></section>
    <nav class="sDock sGlass" id="stDock" aria-label="Story tools">
      <div class="sDockTools">${[["bg","Background"],["photo","Stickers"],["text","Text"],["fx","Effects"],["layers","Layers"]].map(([k,l])=>`<button data-tool="${k}" aria-pressed="false">${svg(k==="photo"?"stk":k)}<span>${l}</span></button>`).join("")}</div>
      <div class="sDockEdit" id="stDockEdit" hidden><button class="sDone" id="stDone">${svg("check",2.4)}<span>Done</span></button><div class="sEdNav" id="stEdNav"></div></div>
    </nav>
  </div>`;
  document.body.appendChild(el);
  $s("stToSticker").onclick=close;$s("stUndo").onclick=undoS;
  $s("stDone").onclick=()=>{hapt();finishEdit()};$s("stLibClose").onclick=()=>{hapt();stopPick()};
  $s("stEdNav").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;e.stopPropagation();if(b.dataset.gk){hapt();setToolGrp(b.dataset.gk);renderPanel();draw()}});
  $s("stSave").onclick=()=>exportStory("save");
  $s("stDock").addEventListener("click",e=>{const b=e.target.closest("button[data-tool]");if(!b)return;hapt();setTool(ST.tool===b.dataset.tool&&!wide()?null:b.dataset.tool)});
  $s("stDel").addEventListener("click",e=>{e.stopPropagation();const L=selL();if(!L)return;snapS();S.layers=S.layers.filter(x=>x!==L);ST.sel=null;toast("Deleted · tap ↶ to undo");changed();renderPanel()});
  $s("stEmpty").onclick=addBgPhoto;
  $s("stMini").addEventListener("click",e=>{const b=e.target.closest("button[data-a]");if(!b)return;e.stopPropagation();miniAction(b.dataset.a)});
  $s("stPanel").addEventListener("click",panelClick);$s("stPanel").addEventListener("input",panelInput);$s("stPanel").addEventListener("change",panelChange);
  gestures();
  if(window.ResizeObserver)new ResizeObserver(()=>draw()).observe($s("stCanvasWrap"));
  WIDE.addEventListener&&WIDE.addEventListener("change",()=>{if(ST.open){if(wide()&&!ST.tool)ST.tool="bg";renderPanel();draw()}});
}
const wide=()=>WIDE.matches;
function updTop(){if(!$s("stUndo"))return;$s("stUndo").disabled=ST.editing?!hist.length:!ST.hist.length;$s("stLock").hidden=canUse()}
function syncEmpty(){const e=$s("stEmpty");if(e)e.hidden=!!bgSource()||S.layers.some(L=>L.t==="photo")||S.bg.type!=="gradient"||!!ST.editing}
function setTool(t){ST.tool=t;if(t)ST.lastTool=t;renderPanel();draw()}
function renderMini(L){const m=$s("stMini");const key=L.id+L.t+(L.shadow?1:0)+(L.kind||"");if(m.dataset.k===key)return;m.dataset.k=key;
  const b=(a,ic,l,on)=>`<button data-a="${a}"${on?' class="on"':""}>${svg(ic)}<span>${l}</span></button>`;
  const i=(a,ic,l)=>`<button data-a="${a}" class="io" aria-label="${l}">${svg(ic)}</button>`;
  if(L.t==="stk"){m.innerHTML=b("sedit","edit",STK[L.kind]&&Object.keys(STK[L.kind].f).length?"Edit":"Colour")+b("shadow","shadow","Shadow",L.shadow)+i("dup","copy","Duplicate")+i("front","front","Bring to front")+i("back","back","Send to back");return}
  m.innerHTML=L.t==="photo"?b("frame","frame","Frame")+b("crop","crop","Crop")+b("shadow","shadow","Shadow",L.shadow)+i("front","front","Bring to front")+i("back","back","Send to back")
    :b("edit","edit","Edit text")+i("dup","copy","Duplicate")+i("front","front","Bring to front")+i("back","back","Send to back")}
function miniAction(a){const L=selL();if(!L)return;hapt();
  if(a==="frame"||a==="crop"){setTool("photo");setTimeout(()=>{const s=$s("stPanel").querySelector(a==="crop"?"[data-sec=aspect]":"[data-sec=frame]");s&&s.scrollIntoView({block:"nearest"})},30);return}
  if(a==="edit"){editTitle(L.id);return}
  if(a==="sedit"){setTool("photo");return}
  snapS();
  if(a==="shadow"){L.shadow=!L.shadow;$s("stMini").dataset.k=""}
  else if(a==="front"){S.layers=S.layers.filter(x=>x!==L);S.layers.push(L)}
  else if(a==="back"){S.layers=S.layers.filter(x=>x!==L);S.layers.unshift(L)}
  else if(a==="dup"){const n=JSON.parse(JSON.stringify(L));n.id=uidS();n.x+=40;n.y+=60;S.layers.push(n);ST.sel=n.id}
  changed();renderPanel()}

function thumbOf(key){const o=IMG.get(key);if(!o)return"";if(!o.thumb){const c=cover(o.src,o.w,o.h,96,128);o.thumb=c.toDataURL("image/jpeg",.7)}return o.thumb}
function row(label,inner,sec){return`<div class="sRow"${sec?` data-sec="${sec}"`:""}>${label?`<div class="sLabel">${label}</div>`:""}${inner}</div>`}
function chip(l,on,attrs){return`<button class="sChip${on?" on":""}" ${attrs}>${l}</button>`}
function slider(label,name,v,min,max,step,fmt){return`<label class="sSlide"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-k="${name}"><output>${fmt(v)}</output></label>`}
function renderPanel(){const p=$s("stPanel");if(!p)return;
  const ed=!!ST.editing;if(wide()&&!ed&&!ST.picking&&!ST.tool)ST.tool=ST.lastTool||"bg";$s("stEdit").dataset.g=toolGrp||"";$s("stEdit").hidden=!ed||(!wide()&&!toolGrp);$s("stEdTip").hidden=!ed||wide()||!!toolGrp;$s("stDockEdit").hidden=!ed;document.querySelector("#storyEd .sDockTools").hidden=ed;$s("stLib").hidden=!ST.picking;syncEmpty();
  if(ed||ST.picking){p.hidden=true;return}
  document.querySelectorAll("#stDock button").forEach(b=>{const on=b.dataset.tool===ST.tool;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)});
  if(!ST.tool){p.hidden=true;return}p.hidden=false;let h="";const t=ST.tool,L=selL();
  if(t==="bg"){const b=S.bg;h+=`<div class="sHead"><b>Background</b><div class="sChips">${chip("Photo",b.type==="photo",'data-bgt="photo"')}${chip("Colour",b.type==="color",'data-bgt="color"')}${chip("Gradient",b.type==="gradient",'data-bgt="gradient"')}</div></div>`;
    if(b.type==="photo"){const fp=firstPhoto();let th="";
      if(fp)th+=`<button class="sThumb${b.photo==="copy"?" on":""}" data-bgp="copy" aria-label="Blurred copy of your photo"><img src="${thumbOf(fp.key)}" alt=""><i>Blur copy</i></button>`;
      [...new Set([S.bg.photo,...S.layers.filter(x=>x.t==="photo").map(x=>x.key)])].filter(k=>k&&k!=="copy"&&!k.startsWith("b:")&&IMG.has(k)).forEach(k=>{th+=`<button class="sThumb${b.photo===k?" on":""}" data-bgp="${k}"><img src="${thumbOf(k)}" alt=""></button>`});
      BUNDLED.forEach(n=>{th+=`<button class="sThumb${b.photo==="b:"+n?" on":""}" data-bgp="b:${n}"><img src="/img/th-${n}.jpg?v=3" alt=""></button>`});
      th=`<button class="sThumb add" data-act="bgUpload" aria-label="Upload your photo">${svg("plus",2)}</button>`+th;
      h+=row("",`<div class="sStrip">${th}</div>`)+slider("Blur","blur",b.blur,0,40,1,v=>v)+slider("Dim","dim",Math.round(b.dim*100),0,70,1,v=>v+"%")}
    else if(b.type==="color"){h+=row("",`<div class="sSw">${COLORS.map(c=>`<button class="sDot${b.color===c?" on":""}" data-col="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}<label class="sDot pick" aria-label="Pick a colour"><input type="color" value="${b.color}" data-k="color"></label></div>`)}
    else{h+=row("",`<div class="sSw">${GRADS.map((g,i)=>`<button class="sDot gr${b.grad===i?" on":""}" data-grad="${i}" style="background:linear-gradient(160deg,${g[0]},${g[1]})" aria-label="Gradient ${i+1}"></button>`).join("")}</div>`)+slider("Dim","dim",Math.round(b.dim*100),0,70,1,v=>v+"%")}}
  else if(t==="photo"&&L&&L.t==="stk"){const def=STK[L.kind];
    h+=`<div class="sHead"><b>${def.name}</b><div class="sChips">${chip(svg("plus",2)+"Add",false,'data-act="stkAll"')}${chip(svg("copy")+"Duplicate",false,'data-act="dupS"')}${chip(svg("trash")+"Delete",false,'data-act="del" class="warn"')}</div></div>`;
    Object.keys(def.f).forEach(n=>{const v=String(L.f[n]==null?"":L.f[n]).replace(/&/g,"&amp;").replace(/</g,"&lt;");const big=def.big.includes(n)||/\n/.test(L.f[n]);
      h+=row(STK_FIELDS[n]||n,big?`<textarea class="sInp sTa" rows="${n==="text"&&L.kind==="note"?4:2}" data-k="f:${n}">${v}</textarea>`:`<input class="sInp sTx" maxlength="60" value="${v.replace(/"/g,"&quot;")}" data-k="f:${n}">`)});
    const sw=(a,b,c)=>[...new Set([b,c,...a].filter(Boolean))];if(def.paper)h+=row(L.kind==="tape"?"Colour":"Paper",`<div class="sSw">${sw(PAPERS,def.paper,L.paper).map(c=>`<button class="sDot${L.paper===c?" on":""}" data-paper="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}</div>`);
    if(!def.noInk&&!["frame","tape"].includes(L.kind))h+=row("Ink",`<div class="sSw">${sw(INKS,def.ink,L.ink).map(c=>`<button class="sDot${L.ink===c?" on":""}" data-ink="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}</div>`);
    h+=`<div class="sRow sTogRow"><span>${svg("shadow")}Shadow</span><button class="sTog${L.shadow?" on":""}" role="switch" aria-checked="${L.shadow}" data-act="shadow" aria-label="Shadow"><i></i></button></div>`}
  else if(t==="photo"){
    if(L&&L.t==="photo"){h+=`<div class="sHead"><b>Photo sticker</b><div class="sChips">${chip(svg("swap")+"Replace",false,'data-act="replace"')}${chip(svg("trash")+"Delete",false,'data-act="del" class="warn"')}</div></div>`;
      h+=row("Frame",`<div class="sFrames">${FRAMES.map(([v,l])=>`<button class="sFrame f-${v}${L.frame===v?" on":""}" data-frame="${v}"><span><img src="${thumbOf(L.key)}" alt=""></span>${l}</button>`).join("")}</div>`,"frame");
      h+=row("Crop",`<div class="sChips wrap">${ASPECTS.map(([v,l])=>chip(l,(L.aspect||"orig")===v,`data-asp="${v}"`)).join("")}</div>`,"aspect");
      h+=`<div class="sRow sTogRow"><span>${svg("shadow")}Shadow</span><button class="sTog${L.shadow?" on":""}" role="switch" aria-checked="${L.shadow}" data-act="shadow" aria-label="Shadow"><i></i></button></div>`;
      if(L.frame==="polaroid")h+=row("Caption",`<input class="sInp" maxlength="40" placeholder="Write on the polaroid…" value="${(L.cap||"").replace(/"/g,"&quot;")}" data-k="cap">`)}
    else{const ph=S.layers.filter(x=>x.t==="photo");h+=`<div class="sHead"><b>Stickers</b><span class="sSub">Tap to add</span></div>`;
      if(!STK_CATS.some(([c])=>c===ST.stkCat))ST.stkCat=STK_CATS[0][0];h+=`<div class="sChips sCats">${STK_CATS.map(([c,l])=>chip(l,ST.stkCat===c,`data-stkcat="${c}"`)).join("")}${chip("Photos",ST.stkCat==="photos",`data-stkcat="photos"`)}</div>`;
      h+=STK_CATS.map(([c,l])=>`<section class="sStkSec" data-sec="${c}"><div class="sLabel">${l}</div><div class="sStk">${stkOf(c).map(k=>`<button class="sStkBtn" data-stk="${k}"><span data-stkth="${k}"></span><i>${STK[k].name}</i></button>`).join("")}</div></section>`).join("");
      h+=`<div class="sLabel sStkSec" data-sec="photos">Photo stickers</div>`;
      h+=`<div class="sStrip">${ph.map(x=>`<button class="sThumb" data-selp="${x.id}"><img src="${thumbOf(x.key)}" alt=""></button>`).join("")}<button class="sThumb add big" data-act="addPhoto">${svg("plus",2)}<i>Photo sticker</i></button></div>`;
      h+=`<p class="sHint">${ph.length?"Tap a photo sticker on your story to frame, crop or move it. Pinch to resize, twist to rotate.":"Add an extra photo on top of your story, like a sticker. Your main photo is set under Background."}</p>`}}
  else if(t==="text"){h+=`<div class="sHead"><b>Text</b></div>`;
    if(L&&L.t==="title")h+=`<div class="sBig"><button class="sBigBtn pri" data-act="editT">${svg("edit")}<span><b>Edit this text</b><small>Change words, fonts and colours</small></span></button><button class="sBigBtn" data-act="dupT">${svg("copy")}<span><b>Duplicate</b><small>Use it twice</small></span></button></div>`;
    h+=`<div class="sBig"><button class="sBigBtn" data-act="addCur"><span class="sCurTh" id="stCurTh"></span><span><b>Add current design</b><small>${(cur.name||"Your design").replace(/</g,"&lt;")}</small></span></button><button class="sBigBtn" data-act="pickLib">${svg("lib")}<span><b>Choose from Library</b><small>230+ designs</small></span></button></div>`;
    h+=`<div class="sLabel">Story titles</div><div class="sStrip sTitles">${sTitles().map((d,i)=>`<button class="sTitleBtn" data-stt="${i}" aria-label="${d.name}"><span data-sttth="${i}"></span></button>`).join("")}</div>`;
    h+=`<p class="sHint">Tip: double-tap a title on your story to edit its text.</p>`}
  else if(t==="fx"){const f=S.fx,src=firstPhoto()||bgSource()&&{key:bgSource().key};
    h+=`<div class="sHead"><b>Effects</b><span class="sSub">On your photos &amp; background</span></div>`;
    h+=`<div class="sStrip fx">${FX.map(([v,l])=>`<button class="sFx${f.name===v?" on":""}" data-fx="${v}"><canvas width="96" height="128" data-fxprev="${v}"></canvas><span>${l}</span></button>`).join("")}</div>`;
    if(f.name!=="none")h+=slider("Amount","amount",Math.round(f.amount*100),0,100,1,v=>v);
    h+=`<div class="sChips">${chip(svg("grain")+"Grain",f.grain,'data-fxt="grain"')}${chip(svg("vig")+"Vignette",f.vig,'data-fxt="vig"')}${chip(svg("sun")+"Light leak",f.leak,'data-fxt="leak"')}</div>`;
    p.innerHTML=h;fxPreviews(src&&src.key);return}
  else if(t==="layers"){h+=`<div class="sHead"><b>Layers</b><span class="sSub">Top to bottom</span></div><div class="sLayers">`;
    [...S.layers].reverse().forEach(x=>{const nm=x.t==="title"?(x.d.name||firstText(x.d)||"Title"):x.t==="stk"?(STK[x.kind]||{}).name:"Photo",sub=x.t==="title"?"Title":x.t==="stk"?"Sticker":(FRAMES.find(f=>f[0]===x.frame)||[0,""])[1]+" photo";
      h+=`<div class="sLay${ST.sel===x.id?" on":""}" data-lay="${x.id}"><span class="sLayTh${x.t==="title"?" t":""}">${x.t==="photo"?`<img src="${thumbOf(x.key)}" alt="">`:x.t==="stk"?`<span data-lstk="${x.kind}"></span>`:`<canvas width="88" height="88" data-tth="${x.id}"></canvas>`}</span>
        <span class="sLayTx"><b>${String(nm).replace(/</g,"&lt;")}</b><small>${sub}</small></span>
        <button data-lup="${x.id}" aria-label="Move up">${svg("up")}</button><button data-ldn="${x.id}" aria-label="Move down">${svg("dn")}</button>
        <button data-lvis="${x.id}" aria-label="${x.hidden?"Show":"Hide"}">${svg(x.hidden?"eyeOff":"eye")}</button></div>`});
    h+=`</div><button class="sReset" data-act="reset">Start a new story</button>`;p.innerHTML=h;layerThumbs();p.querySelectorAll("[data-lstk]").forEach(el=>el.appendChild(stkThumb(el.dataset.lstk)));return}
  p.innerHTML=h;if(t==="text"){curThumb();titleThumbs()}if(t==="photo"){stkThumbs();stkGallery()}}
let stkIO=null;
function stkThumbs(){const p=$s("stPanel"),els=[...document.querySelectorAll("#stPanel [data-stkth]")];if(!els.length)return;
  const fill=el=>{if(el.dataset.done)return;el.dataset.done="1";el.innerHTML="";el.appendChild(stkThumb(el.dataset.stkth))};
  const go=()=>{if(stkIO)stkIO.disconnect();if(!("IntersectionObserver" in window)){els.forEach(fill);return}
    stkIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){fill(e.target);stkIO.unobserve(e.target)}}),{root:p,rootMargin:"300px 0px"});els.forEach(el=>stkIO.observe(el))};
  stkFonts();ensureFonts(STK_FONTS).then(go,go)}
// one long list: sticky category chips jump to a section and follow the scroll
function stkGallery(){const p=$s("stPanel"),bar=p.querySelector(".sCats");if(!bar)return;const secs=[...p.querySelectorAll(".sStkSec")];
  const top=el=>el.getBoundingClientRect().top-p.getBoundingClientRect().top+p.scrollTop-bar.offsetHeight-10;
  const mark=c=>{if(ST.stkCat===c&&bar.querySelector(".on")?.dataset.stkcat===c)return;ST.stkCat=c;bar.querySelectorAll("[data-stkcat]").forEach(b=>{const on=b.dataset.stkcat===c;b.classList.toggle("on",on);if(on)bar.scrollTo({left:b.offsetLeft-bar.clientWidth/2+b.offsetWidth/2,behavior:"smooth"})})};
  stkGallery.jump=(c,smooth)=>{const sec=secs.find(x=>x.dataset.sec===c);if(!sec)return;p.scrollTo({top:Math.max(0,top(sec)),behavior:smooth?"smooth":"auto"});mark(c)};
  let raf=0;p.onscroll=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!p.contains(bar))return;let cur=secs[0];for(const x of secs){if(top(x)<=p.scrollTop+4)cur=x}if(p.scrollTop+p.clientHeight>=p.scrollHeight-4)cur=secs[secs.length-1];mark(cur.dataset.sec)})};
  if(ST.stkCat&&ST.stkCat!==(secs[0]&&secs[0].dataset.sec))stkGallery.jump(ST.stkCat,false)}
function titleThumbs(){document.querySelectorAll("#stPanel [data-sttth]").forEach(el=>{const d=sTitles()[+el.dataset.sttth];if(!d)return;ensureFonts(d).then(()=>{try{const c=drawExport(d,.07);el.innerHTML="";el.appendChild(c)}catch(e){}})})}
function firstText(d){const l=(d.layers||[]).find(x=>x.text);return l?l.text:""}
function curThumb(){const el=$s("stCurTh");if(!el)return;ensureFonts(cur).then(()=>{try{const c=drawExport(cur,.06);el.innerHTML="";el.appendChild(c)}catch(e){}})}
function layerThumbs(){document.querySelectorAll("#stPanel canvas[data-tth]").forEach(c=>{const L=layerById(c.dataset.tth);if(!L)return;ensureFonts(L.d).then(()=>{try{const e=drawExport(L.d,.05),x=c.getContext("2d"),f=Math.min(88/e.width,88/e.height);x.clearRect(0,0,88,88);x.drawImage(e,(88-e.width*f)/2,(88-e.height*f)/2,e.width*f,e.height*f)}catch(err){}})})}
function fxPreviews(key){const o=key&&IMG.get(key);document.querySelectorAll("#stPanel canvas[data-fxprev]").forEach(c=>{const x=c.getContext("2d");
  if(o){const cv=cover(o.src,o.w,o.h,96,128);applyMatrix(cv,fxMatrix(c.dataset.fxprev,c.dataset.fxprev==="none"?0:.85));x.drawImage(cv,0,0)}
  else{const g=x.createLinearGradient(0,0,96,128);g.addColorStop(0,"#E9B77C");g.addColorStop(1,"#3B2416");x.fillStyle=g;x.fillRect(0,0,96,128);const m=fxMatrix(c.dataset.fxprev,.85);if(m)applyMatrix(c,m)}})}

async function panelClick(e){const b=e.target.closest("button,[data-lay]");if(!b)return;const L=selL(),d=b.dataset;hapt();
  if(d.bgt){snapS();S.bg.type=d.bgt;if(d.bgt==="photo"&&!bgSource()){if(firstPhoto())S.bg.photo="copy";else{renderPanel();changed();return addBgPhoto()}}changed();renderPanel();return}
  if(d.bgp){snapS();S.bg.photo=d.bgp;S.bg.z=1;S.bg.ox=0;S.bg.oy=0;if(d.bgp!=="copy")await ensureImg(d.bgp).catch(()=>toast("Couldn't load that photo"));changed();renderPanel();return}
  if(d.col){snapS();S.bg.color=d.col;changed();renderPanel();return}
  if(d.grad!=null){snapS();S.bg.grad=+d.grad;changed();renderPanel();return}
  if(d.frame&&L){snapS();L.frame=d.frame;$s("stMini").dataset.k="";changed();renderPanel();return}
  if(d.asp&&L){snapS();L.aspect=d.asp;changed();renderPanel();return}
  if(d.stkcat){stkGallery.jump&&stkGallery.jump(d.stkcat,true);return}
  if(d.stk){snapS();const n=newStk(d.stk);n.y=SH*(.42+((S.layers.filter(x=>x.t==="stk").length%3)*.08));S.layers.push(n);ST.sel=n.id;if(!wide())ST.tool=null;changed();renderPanel();toast(STK[d.stk].name+" added");return}
  if(d.paper&&L){snapS();L.paper=d.paper;changed();renderPanel();return}
  if(d.ink&&L){snapS();L.ink=d.ink;changed();renderPanel();return}
  if(d.stt!=null){const tt=sTitles()[+d.stt];if(!tt)return;snapS();const n=newTitle(tt);n.y=S.layers.some(x=>x.t==="title")?SH*.72:SH*.22;S.layers.push(n);ST.sel=n.id;if(!wide())ST.tool=null;changed();renderPanel();toast("Added to your story");return}
  if(d.selp){ST.sel=d.selp;renderPanel();draw();return}
  if(d.fx){snapS();S.fx.name=d.fx;changed();renderPanel();return}
  if(d.fxt){snapS();S.fx[d.fxt]=!S.fx[d.fxt];changed();renderPanel();return}
  if(d.lup||d.ldn){const id=d.lup||d.ldn,i=S.layers.findIndex(x=>x.id===id),j=i+(d.lup?1:-1);if(j<0||j>=S.layers.length)return;snapS();[S.layers[i],S.layers[j]]=[S.layers[j],S.layers[i]];changed();renderPanel();return}
  if(d.lvis){const x=layerById(d.lvis);snapS();x.hidden=!x.hidden;changed();renderPanel();return}
  if(d.lay){ST.sel=d.lay;renderPanel();draw();return}
  switch(d.act){
    case"addPhoto":return addPhoto();
    case"bgUpload":return addBgPhoto();
    case"replace":{if(!L)return;const f=await pickFile();if(!f)return;const k=await importFile(f);snapS();L.key=k;invalidate();changed();renderPanel();return}
    case"del":{if(!L)return;snapS();S.layers=S.layers.filter(x=>x!==L);ST.sel=null;changed();renderPanel();return}
    case"shadow":{if(!L)return;snapS();L.shadow=!L.shadow;$s("stMini").dataset.k="";changed();renderPanel();return}
    case"stkAll":{ST.sel=null;renderPanel();draw();return}
    case"dupS":{if(!L)return;snapS();const n=JSON.parse(JSON.stringify(L));n.id=uidS();n.x+=40;n.y+=60;S.layers.push(n);ST.sel=n.id;changed();renderPanel();return}
    case"editT":return L&&editTitle(L.id);
    case"dupT":{if(!L)return;snapS();const n=JSON.parse(JSON.stringify(L));n.id=uidS();n.y+=160;S.layers.push(n);ST.sel=n.id;changed();renderPanel();return}
    case"addCur":{snapS();const n=newTitle(cur);n.y=S.layers.some(x=>x.t==="title")?SH*.78:SH*.2;S.layers.push(n);ST.sel=n.id;if(!wide())ST.tool=null;changed();renderPanel();toast("Added to your story");return}
    case"pickLib":return startPick();
    case"reset":{if(!confirm("Start a new story? Your current story will be cleared."))return;snapS();const keep=S.layers.find(x=>x.t==="title");S=blank();S.layers.push(keep?Object.assign(JSON.parse(JSON.stringify(keep)),{x:SW/2,y:SH*.2,rot:0}):newTitle(cur));ST.sel=null;invalidate();changed();renderPanel();return}
  }}
let inpT=0,inpSnap=null;
function panelInput(e){const t=e.target,k=t.dataset.k;if(!k)return;if(!inpSnap)inpSnap=JSON.stringify(S);const L=selL();
  if(k==="blur"){S.bg.blur=+t.value}else if(k==="dim"){S.bg.dim=+t.value/100}else if(k==="amount"){S.fx.amount=+t.value/100}
  else if(k==="cap"&&L){L.cap=t.value}else if(k.startsWith("f:")&&L&&L.f){L.f[k.slice(2)]=t.value}else if(k==="color"){S.bg.color=t.value}
  const o=t.parentElement&&t.parentElement.querySelector("output");if(o)o.textContent=k==="dim"?t.value+"%":t.value;
  draw();clearTimeout(inpT);inpT=setTimeout(commitInput,500)}
function panelChange(e){if(e.target.dataset.k)commitInput()}
function commitInput(){clearTimeout(inpT);if(inpSnap){ST.hist.push(inpSnap);if(ST.hist.length>60)ST.hist.shift();ST.fut=[];inpSnap=null;changed()}}

async function addBgPhoto(){const f=await pickFile();if(!f)return;let k;try{k=await importFile(f)}catch(e){toast("Couldn't open that photo");return}
  snapS();Object.assign(S.bg,{type:"photo",photo:k,blur:0,dim:0,z:1,ox:0,oy:0});invalidate();changed();renderPanel();hapt("MEDIUM")}
async function addPhoto(){const f=await pickFile();if(!f)return;let k;try{k=await importFile(f)}catch(e){toast("Couldn't open that photo");return}
  snapS();const L=newPhoto(k);
  // photo stickers go under the titles
  const ti=S.layers.findIndex(x=>x.t==="title");if(ti>=0)S.layers.splice(ti,0,L);else S.layers.push(L);
  ST.sel=L.id;invalidate();changed();if(ST.tool==="photo"||wide())setTool("photo");else renderPanel();hapt("MEDIUM")}

/* ---------- titles: edit them right here, with the editor's own tools moved into the story ---------- */
const HOME=new Map();
function mount(id,host){const n=$(id);if(!n||!host)return;if(!HOME.has(id))HOME.set(id,{p:n.parentNode,nx:n.nextSibling,hid:n.classList.contains("hidden")});n.classList.remove("hidden");host.appendChild(n)}
function unmount(id){const h=HOME.get(id),n=$(id);if(!h||!n)return;h.p.insertBefore(n,h.nx&&h.nx.parentNode===h.p?h.nx:null);if(h.hid)n.classList.add("hidden");HOME.delete(id)}
function startPick(){stopEdit();ST.picking=true;ST.tool=null;mount("tab-lib",$s("stLibHost"));if(typeof renderLibrary==="function")renderLibrary();$s("stLib").hidden=false;$s("stPanel").hidden=true;renderPanel();draw()}
function stopPick(){if(!ST.picking)return;ST.picking=false;unmount("tab-lib");$s("stLib").hidden=true;renderPanel();draw()}
function addPicked(d){if(!canUse()&&d.pro){openPaywall("save");return true}stopPick();snapS();const n=newTitle(d);n.y=S.layers.some(x=>x.t==="title")?SH*.78:SH*.2;S.layers.push(n);ST.sel=n.id;if(!wide())ST.tool=null;changed();renderPanel();toast("Added to your story");return true}
function editTitle(id){const L=layerById(id);if(!L)return;stopPick();if(ST.editing)finishEdit();snapS();
  ST.editing=id;ST.sel=id;ST.ed={cur,sel,tab,hist,toolGrp,selShown};
  cur=L.d;sel=firstTextLayer();selShown=true;hist=[];tab="edit";toolGrp=null;
  mount("layerChips",$s("stEdChips"));mount("toolBody",$s("stEdBody"));mount("toolNav",$s("stEdNav"));
  if(wide())toolGrp="text";renderLayerChips();renderTool();if(wide())setToolGrp("text");ST.tool=null;renderPanel();draw()}
function finishEdit(){if(!ST.editing)return;const L=layerById(ST.editing);if(L){L.d=cur;ttCache.delete(L.id)}
  unmount("layerChips");unmount("toolBody");unmount("toolNav");
  const e=ST.ed||{};cur=e.cur||cur;sel=e.sel||0;tab=e.tab||"lib";hist=e.hist||[];toolGrp=e.toolGrp||null;selShown=e.selShown!==false;ST.editing=null;ST.ed=null;
  try{updUndo();if(tab==="edit"){renderLayerChips();renderTool()}schedulePreview()}catch(err){}
  changed();renderPanel()}
function stopEdit(){if(ST.editing)finishEdit()}
// the editor's tools call schedulePreview(); while a story title is being edited, redraw the story too
if(typeof schedulePreview==="function"){const sp=schedulePreview;schedulePreview=function(n){sp(n);if(ST.editing&&ST.open){const L=layerById(ST.editing);if(L){L.d=cur;ttCache.delete(L.id)}draw()}}}

/* ---------- export ---------- */
async function renderExport(){await Promise.all(S.layers.filter(L=>L.t==="title").map(L=>ensureFonts(L.d)).concat([ensureFonts(STK_FONTS)]));stCache.clear();
  const c=document.createElement("canvas");c.width=SW;c.height=SH;ttCache.clear();render(c.getContext("2d"),SW,SH,{});ttCache.clear();
  return new Promise(r=>c.toBlob(b=>r(b),"image/jpeg",.93))}
async function exportStory(mode){
  if(!canUse()){ST.pending=mode;openPaywall("story");return}
  const btn=$s("stSave");if(btn.classList.contains("busy"))return;btn.classList.add("busy");
  try{const blob=await renderExport();if(!blob)throw new Error("render");const name=`studio-typo-story-${Date.now().toString(36)}.jpg`;
    if(NATIVE&&NP.Filesystem){const w=await NP.Filesystem.writeFile({path:name,data:await blobToBase64(blob),directory:"CACHE"});
      if(mode==="share"){await NP.Share.share({files:[w.uri]})}
      else{try{await NP.Media.savePhoto({path:w.uri});hapt("MEDIUM");saved(blob)}catch(e){await NP.Share.share({files:[w.uri]}).catch(()=>{})}}}
    else{const file=new File([blob],name,{type:"image/jpeg"});
      if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file]})}catch(e){}}
      else{const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);saved(blob,"Downloaded ✓")}}}
  catch(e){toast("Couldn't save your story. Please try again.")}
  finally{btn.classList.remove("busy")}}
function saved(blob,title){const u=URL.createObjectURL(blob);const w=document.createElement("div");w.className="sSaved";w.id="stSaved";
  w.innerHTML=`<div class="sSavedBox"><img src="${u}" alt="Your story"><div><b>${title||"Saved to Photos ✓"}</b><span>Your story is ready to post.</span>
    <div class="sSavedBtns"><button class="pri" id="stOpenIg">${typeof IG_READY!=="undefined"&&IG_READY?"Post to Story":"Open Instagram"}</button><button id="stShare">${svg("share",2)}Share</button><button id="stSavedOk">Done</button></div></div></div>`;
  document.body.appendChild(w);const done=()=>{w.remove();URL.revokeObjectURL(u)};
  w.onclick=e=>{if(e.target===w)done()};$s("stSavedOk").onclick=done;$s("stShare").onclick=()=>{done();exportStory("share")};
  $s("stOpenIg").onclick=async()=>{done();if(typeof IG_READY!=="undefined"&&IG_READY){igShare({background:await blobToBase64(blob)});return}if(NATIVE)window.location.href="instagram://story-camera";else window.open("https://www.instagram.com/","_blank","noopener")}}

/* ---------- open / close ---------- */
function show(){const el=$s("storyEd");el.classList.remove("hidden");ST.open=true;document.documentElement.classList.add("storyOpen");if(typeof syncGlass==="function")syncGlass();updTop();syncEmpty();renderPanel();draw()}
function hide(){const el=$s("storyEd");if(el)el.classList.add("hidden");ST.open=false;document.documentElement.classList.remove("storyOpen");if(typeof syncGlass==="function")syncGlass()}
async function open(){if(typeof track==="function")track("story");build();await loadDoc();if(wide()&&!ST.tool)ST.tool="bg";show();
  try{if(!localStorage.getItem("typoStudio.storyIntro")){localStorage.setItem("typoStudio.storyIntro","1");setTimeout(()=>toast("New: make your whole story here ✨"),400)}}catch(e){}}
function close(){stopEdit();stopPick();hide();persist();hapt()}
function onPro(){updTop();if(isPro()&&ST.pending&&ST.open){const m=ST.pending;ST.pending=null;setTimeout(()=>exportStory(m),450)}}

window.STORY={open,close,get picking(){return ST.picking&&ST.open},addPicked,get open_(){return ST.open},onPro,
  sheet(cat,bg){return ensureFonts(STK_FONTS).then(()=>{const ks=cat?stkOf(cat):STK_ORDER,cols=4,cw=300,c=document.createElement("canvas");c.width=cols*cw;c.height=Math.ceil(ks.length/cols)*cw;const x=c.getContext("2d");x.fillStyle=bg||"#7a5a40";x.fillRect(0,0,c.width,c.height);
    ks.forEach((k,i)=>{const L=newStk(k),d=STK[k],W=200,H=W*d.r,sc=Math.min(1,240/H);x.save();x.translate((i%cols)*cw+cw/2,Math.floor(i/cols)*cw+cw/2-10);x.scale(sc,sc);x.rotate((L.rot||0)*Math.PI/180);if(L.shadow){x.shadowColor="rgba(0,0,0,.35)";x.shadowBlur=12;x.shadowOffsetY=5}const t=document.createElement("canvas");t.width=W;t.height=H;d.draw(t.getContext("2d"),W,H,L);x.drawImage(t,-W/2,-H/2);x.restore();x.fillStyle="#fff";x.font="14px sans-serif";x.textAlign="center";x.fillText(d.name,(i%cols)*cw+cw/2,Math.floor(i/cols)*cw+cw-8)});return c.toDataURL("image/png")})}};
if(typeof PW_REASON==="object")PW_REASON.story="Saving stories is part of Studio Typo Pro";
})();
