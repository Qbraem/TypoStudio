/* Studio Typo – Story Builder sticker pack (categories). Original designs, drawn on canvas.
   Every sticker: {name,cat,r (h/w),w (share of story width),paper,ink,f (editable text),big,draw(x,W,H,L)} */
window.STK_CATS=[["xmas","Christmas"],["winter","Winter sport"],["outdoor","Outdoor"],["morning","Morning"],["weather","Weather"],["socials","Socials"],["urban","Urban"],["pack","Packaging"],["love","Love"],["pride","Pride"],["kudos","Kudos"],["travel","Travel & paper"]];
window.STK_PACK_FONTS=[["Archivo Black",400],["Pacifico",400],["Yellowtail",400],["Satisfy",400],["Kaushan Script",400],["Shrikhand",400],["Fraunces",900],["Young Serif",400],["Rye",400],["Abril Fatface",400],["Bowlby One",400],["Fredoka",700],["Luckiest Guy",400],["Gochi Hand",400],["Sansita Swashed",800],["Sacramento",400],["Lilita One",400],["Anton",400],["Bagel Fat One",400],["Cherry Bomb One",400]];
window.STK_PACK=function(h){
const {F,fit,spaced,scallop}=h,PI=Math.PI,E="#FFFFFF";
const RB=["#E40303","#FF8C00","#FFED00","#008026","#24408E","#732982"];
/* ---- paths ---- */
function RR(x,X,Y,W,H,r){r=Math.min(r,W/2,H/2);x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
function burst(x,cx,cy,R,r,n,ry=1){for(let i=0;i<n*2;i++){const a=-PI/2+i*PI/n,q=i%2?r:R;x.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q*ry)}x.closePath()}
function wavy(x,cx,cy,R,amp,n){for(let i=0;i<=240;i++){const a=i/240*2*PI,q=R+amp*Math.cos(a*n);x.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q)}x.closePath()}
function shield(x,X,Y,W,H,r){x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.lineTo(X+W,Y+H*.58);x.bezierCurveTo(X+W,Y+H*.86,X+W*.66,Y+H*.95,X+W/2,Y+H);x.bezierCurveTo(X+W*.34,Y+H*.95,X,Y+H*.86,X,Y+H*.58);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
function arch(x,X,Y,W,H,r){const R=W/2;x.moveTo(X,Y+R);x.arc(X+R,Y+R,R,PI,0);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.closePath()}
function notch(x,X,Y,W,H,r){x.moveTo(X+r,Y);x.lineTo(X+W-r,Y);x.arc(X+W,Y,r,PI,PI/2,true);x.lineTo(X+W,Y+H-r);x.arc(X+W,Y+H,r,-PI/2,PI,true);x.lineTo(X+r,Y+H);x.arc(X,Y+H,r,0,-PI/2,true);x.lineTo(X,Y+r);x.arc(X,Y,r,PI/2,0,true);x.closePath()}
function heart(x,cx,cy,s){x.moveTo(cx,cy+s*.95);x.bezierCurveTo(cx-s*1.3,cy+s*.05,cx-s*1.05,cy-s*1.05,cx,cy-s*.45);x.bezierCurveTo(cx+s*1.05,cy-s*1.05,cx+s*1.3,cy+s*.05,cx,cy+s*.95);x.closePath()}
function poly(x,pts,X,Y,W,H){pts.forEach(([a,b],i)=>i?x.lineTo(X+a*W,Y+b*H):x.moveTo(X+a*W,Y+b*H));x.closePath()}
/* ---- painting ---- */
// die-cut: white (or edge-coloured) border of width b around the path, then the fill
function cut(x,path,fill,b,edge=E){x.save();x.lineJoin="round";x.lineCap="round";x.beginPath();path();if(b){x.strokeStyle=edge;x.lineWidth=b*2;x.stroke();x.fillStyle=edge;x.fill()}if(fill){x.fillStyle=fill;x.fill()}x.restore()}
function line(x,path,col,lw){x.save();x.lineJoin="round";x.lineCap="round";x.beginPath();path();x.strokeStyle=col;x.lineWidth=lw;x.stroke();x.restore()}
function clip(x,path){x.beginPath();path();x.clip()}
function hole(x,path){x.save();x.globalCompositeOperation="destination-out";x.beginPath();path();x.fill();x.restore()}
function T(x,txt,font,px,cx,cy,maxW,o={}){const ls=String(txt==null?"":txt).split("\n"),lh=o.lh||1.02;let p=fit(x,ls.join("\n"),font,px,maxW,o.min||.3);if(o.maxH)while(ls.length*p*lh>o.maxH&&p>2){p*=.94}x.font=font(p);x.textAlign=o.align||"center";x.textBaseline="middle";
  ls.forEach((t,i)=>{const y=cy+(i-(ls.length-1)/2)*p*lh;if(o.stroke){x.lineJoin="round";x.strokeStyle=o.stroke;x.lineWidth=o.sw||p*.22;x.strokeText(t,cx,y)}if(o.shadow){const f=x.fillStyle;x.fillStyle=o.shadow;x.fillText(t,cx+(o.sx||p*.05),y+(o.sy||p*.05));x.fillStyle=f}x.fillText(t,cx,y)});return p}
function S(x,txt,font,px,cx,cy,sp,maxW){x.font=font(px);let p=px;const w=()=>[...String(txt).toUpperCase()].reduce((a,c)=>a+x.measureText(c).width+sp*p/px,0);while(maxW&&w()>maxW&&p>2){p*=.94;x.font=font(p)}x.textBaseline="middle";spaced(x,txt,cx,cy,sp*p/px)}
// text along an arc; bottom=true reads left-to-right along the lower half
function arcT(x,s,cx,cy,R,ac,sp,bottom){s=String(s==null?"":s);const cs=[...s],ws=cs.map(c=>x.measureText(c).width),tot=ws.reduce((a,w)=>a+w+sp,-sp)/R;x.textAlign="center";x.textBaseline="middle";let a=bottom?ac+tot/2:ac-tot/2;
  cs.forEach((c,i)=>{const aw=ws[i]/R,m=bottom?a-aw/2:a+aw/2;x.save();x.translate(cx+Math.cos(m)*R,cy+Math.sin(m)*R);x.rotate(bottom?m-PI/2:m+PI/2);x.fillText(c,0,0);x.restore();a+=(bottom?-1:1)*(ws[i]+sp)/R})}
function arcFit(x,s,font,px,R,maxA,sp){let p=px;x.font=font(p);const tot=()=>[...String(s)].reduce((a,c)=>a+x.measureText(c).width+sp*p/px,0)/R;while(tot()>maxA&&p>2){p*=.94;x.font=font(p)}return sp*p/px}
function ring(x,s,cx,cy,R){s=String(s||" ");const cs=[...s],ws=cs.map(c=>x.measureText(c).width),sum=ws.reduce((a,b)=>a+b,0);if(sum>2*PI*R*.96){x.font=x.font.replace(/([\d.]+)px/,(m,n)=>(n*2*PI*R*.94/sum)+"px");return ring(x,s,cx,cy,R)}
  const sp=(2*PI*R-sum)/cs.length;x.textAlign="center";x.textBaseline="middle";let a=-PI/2;cs.forEach((c,i)=>{const m=a+ws[i]/R/2;x.save();x.translate(cx+Math.cos(m)*R,cy+Math.sin(m)*R);x.rotate(m+PI/2);x.fillText(c,0,0);x.restore();a+=(ws[i]+sp)/R})}
// draw one of the app's ornaments (drawShape) in a colour, on its own layer so its cut-outs don't punch through the sticker
function ico(x,shape,cx,cy,s,col){if(typeof drawShape!=="function")return;const n=Math.max(4,Math.ceil(s*2.6)),c=document.createElement("canvas");c.width=c.height=n;const g=c.getContext("2d");g.translate(n/2,n/2);g.fillStyle=g.strokeStyle=col;drawShape(g,shape,s);x.drawImage(c,cx-n/2,cy-n/2)}
function mountains(x,X,Y,W,H,col,snow,line,shade){const pk=[[0,1],[.16,.5],[.27,.64],[.5,0],[.7,.48],[.8,.36],[1,1]];x.beginPath();poly(x,pk,X,Y,W,H);x.fillStyle=col;x.fill();if(shade){x.save();x.beginPath();poly(x,[[.5,0],[.7,.48],[.62,.56],[.58,.34],[.62,1],[.5,1],[.54,.3]],X,Y,W,H);x.fillStyle=shade;x.fill();x.restore()}if(line){x.strokeStyle=line;x.lineWidth=W*.022;x.lineJoin="round";x.stroke()}
  if(snow){x.beginPath();poly(x,[[.5,0],[.6,.24],[.55,.2],[.5,.27],[.45,.19],[.41,.23]],X,Y,W,H);x.fillStyle=snow;x.fill();x.beginPath();poly(x,[[.8,.36],[.86,.5],[.82,.47],[.78,.51],[.75,.43]],X,Y,W,H);x.fill()}}
function pine(x,cx,by,hh,col,edge,lw){const w=hh*.62;x.beginPath();x.moveTo(cx,by-hh);x.lineTo(cx+w*.3,by-hh*.62);x.lineTo(cx+w*.18,by-hh*.62);x.lineTo(cx+w*.42,by-hh*.3);x.lineTo(cx+w*.26,by-hh*.3);x.lineTo(cx+w*.5,by-hh*.08);x.lineTo(cx+w*.07,by-hh*.08);x.lineTo(cx+w*.07,by);x.lineTo(cx-w*.07,by);x.lineTo(cx-w*.07,by-hh*.08);x.lineTo(cx-w*.5,by-hh*.08);x.lineTo(cx-w*.26,by-hh*.3);x.lineTo(cx-w*.42,by-hh*.3);x.lineTo(cx-w*.18,by-hh*.62);x.lineTo(cx-w*.3,by-hh*.62);x.closePath();
  if(edge){x.save();x.lineJoin="round";x.strokeStyle=edge;x.lineWidth=lw;x.stroke();x.restore()}x.fillStyle=col;x.fill()}
function mix(a,b,t){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),A=p(a),B=p(b);return"#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("")}
function halftone(x,X,Y,W,H,step,col,from,to){x.fillStyle=col;for(let yy=Y;yy<Y+H+step;yy+=step)for(let xx=X+((Math.round((yy-Y)/step)%2)?step/2:0);xx<X+W+step;xx+=step){const t=Math.min(1,Math.max(0,(yy-Y)/H)),r=step*.5*(from+(to-from)*t);if(r>.2){x.beginPath();x.arc(xx,yy,r,0,7);x.fill()}}}
function skis(x,cx,cy,s,col){x.save();x.translate(cx,cy);x.fillStyle=col;[-.62,.62].forEach(a=>{x.save();x.rotate(a);x.beginPath();RR(x,-s*.09,-s,s*.18,s*2,s*.09);x.fill();x.restore()});x.restore()}
function pole(x,cx,cy,s,col){x.save();x.strokeStyle=x.fillStyle=col;x.lineWidth=s*.07;x.lineCap="round";x.beginPath();x.moveTo(cx,cy-s*.55);x.lineTo(cx,cy+s*.55);x.stroke();x.beginPath();x.arc(cx,cy+s*.4,s*.13,0,7);x.lineWidth=s*.05;x.stroke();x.beginPath();RR(x,cx-s*.06,cy-s*.62,s*.12,s*.22,s*.05);x.fill();x.restore()}
function rnd(seed){let s=seed;return()=>(s=(s*16807)%2147483647)/2147483647}
function sparkle(x,cx,cy,s,col,lw){x.save();x.strokeStyle=col;x.lineWidth=lw;x.lineCap="round";x.beginPath();for(let i=0;i<4;i++){const a=i*PI/4;x.moveTo(cx-Math.cos(a)*s*(i%2?.6:1),cy-Math.sin(a)*s*(i%2?.6:1));x.lineTo(cx+Math.cos(a)*s*(i%2?.6:1),cy+Math.sin(a)*s*(i%2?.6:1))}x.stroke();x.restore()}
function arrow(x,cx,cy,s,ang,col,lw){x.save();x.translate(cx,cy);x.rotate(ang);x.strokeStyle=col;x.lineWidth=lw;x.lineCap="butt";x.lineJoin="miter";x.beginPath();x.moveTo(-s,0);x.lineTo(s-lw*.5,0);x.stroke();x.beginPath();x.moveTo(s*.2,-s*.8);x.lineTo(s,0);x.lineTo(s*.2,s*.8);x.stroke();x.restore()}
function heartIn(x,txt,font,px,cx,cy,maxW,heartCol){const parts=String(txt).split("\u2665");let p=px;const w=()=>{x.font=font(p);return parts.reduce((a,t)=>a+x.measureText(t).width,0)+(parts.length-1)*p*.95};while(w()>maxW&&p>2)p*=.94;let X=cx-w()/2;x.textAlign="left";x.textBaseline="middle";const col=x.fillStyle;
  parts.forEach((t,i)=>{x.fillStyle=col;x.fillText(t,X,cy);X+=x.measureText(t).width;if(i<parts.length-1){x.fillStyle=heartCol;x.beginPath();heart(x,X+p*.47,cy-p*.02,p*.42);x.fill();X+=p*.95}});x.fillStyle=col;return p}
function torn(x,X,Y,W,H,seed,j){const r=rnd(seed),P=[],n=Math.round((W+H)/(j*2.2));const per=2*(W+H);for(let i=0;i<n;i++){let d=i/n*per,px,py;if(d<W){px=X+d;py=Y}else if(d<W+H){px=X+W;py=Y+d-W}else if(d<2*W+H){px=X+W-(d-W-H);py=Y+H}else{px=X;py=Y+H-(d-2*W-H)}P.push([px+(r()-.5)*j,py+(r()-.5)*j])}x.moveTo(P[0][0],P[0][1]);P.forEach(q=>x.lineTo(q[0],q[1]));x.closePath()}
function union(x,parts,fill,ink,lw){x.save();x.lineJoin="round";x.lineCap="round";x.strokeStyle=ink;x.lineWidth=lw*2;parts.forEach(f=>{x.beginPath();f();x.stroke()});x.fillStyle=fill;parts.forEach(f=>{x.beginPath();f();x.fill()});x.restore()}
function rot(x,cx,cy,a,f){return()=>{x.save();x.translate(cx,cy);x.rotate(a);f();x.restore()}}
function eye(x,cx,cy,r,ink,lw,lx,ly){x.save();x.beginPath();x.ellipse(cx,cy,r*.82,r,0,0,7);x.fillStyle="#FFFFFF";x.fill();x.strokeStyle=ink;x.lineWidth=lw;x.stroke();x.fillStyle=ink;x.beginPath();x.ellipse(cx+r*lx,cy+r*ly,r*.36,r*.44,0,0,7);x.fill();x.restore()}
function italic(x,f){x.save();x.transform(1,0,-.2,1,0,0);f();x.restore()}
let NOISE=null;function noiseTile(){if(NOISE)return NOISE;const c=document.createElement("canvas");c.width=c.height=160;const g=c.getContext("2d"),d=g.createImageData(160,160),r=rnd(77);for(let i=0;i<d.data.length;i+=4){const v=r(),w=v>.5;d.data[i]=d.data[i+1]=d.data[i+2]=w?255:0;d.data[i+3]=Math.round(Math.abs(v-.5)*2*70)}g.putImageData(d,0,0);NOISE=c;return c}
// paper craft finish: crumple shading + grain, only on painted pixels
function paperFx(x,W,H,seed){x.save();x.globalCompositeOperation="source-atop";const r=rnd(seed||13);for(let i=0;i<9;i++){x.beginPath();x.moveTo(r()*W,r()*H);x.lineTo(r()*W*1.4-W*.2,r()*H*1.4-H*.2);x.lineTo(r()*W*1.4-W*.2,r()*H*1.4-H*.2);x.closePath();x.fillStyle=i%2?"rgba(255,255,255,.07)":"rgba(0,0,0,.055)";x.fill()}
  const sc=Math.max(.5,W/420);x.globalAlpha=.55;x.translate(0,0);x.scale(sc,sc);x.fillStyle=x.createPattern(noiseTile(),"repeat");x.fillRect(0,0,W/sc,H/sc);x.restore()}
const MONO=p=>`700 ${p}px "Courier New", ui-monospace, monospace`;
const ff=(w,f)=>p=>F(w,p,f);
const BLK=ff(400,"Archivo Black"),SANS=ff(700,"DM Sans"),SER=ff(400,"DM Serif Display"),YS=ff(400,"Young Serif"),BEB=ff(400,"Bebas Neue"),FRA=ff(900,"Fraunces"),CAV=ff(700,"Caveat");

const P={
/* ================= CHRISTMAS ================= */
airtree:{name:"Car tree",cat:"xmas",r:1.55,w:.34,paper:"#23704A",ink:"#D8322B",f:{top:"Smells like",bottom:"Christmas"},big:[],rot:4,
  draw(x,W,H,L){const u=W/100,Y=H*.1,TH=H-Y;line(x,()=>{x.moveTo(W/2,0);x.lineTo(W*.46,Y+5*u);x.moveTo(W/2,0);x.lineTo(W*.54,Y+5*u)},L.ink,.8*u);
    const R=[[.5,0],[.66,.17],[.6,.17],[.77,.35],[.69,.35],[.87,.55],[.78,.55],[.97,.78],[.7,.78],[.7,.99]],P=R.concat(R.slice(1).reverse().map(([a,b])=>[1-a,b]));
    cut(x,()=>poly(x,P,0,Y,W,TH),L.paper,0);x.save();clip(x,()=>poly(x,P,0,Y,W,TH));x.globalAlpha=.12;halftone(x,0,Y,W,TH,2.4*u,"#000",.0,.7);x.restore();
    hole(x,()=>x.arc(W/2,Y+6.5*u,2.2*u,0,7));
    const band=(cy,hh,txt,ww)=>{x.save();x.translate(W/2,cy);x.rotate(-.03);x.fillStyle="#FFFDF8";x.fillRect(-ww/2,-hh/2,ww,hh);x.fillStyle=L.ink;S(x,txt,ff(400,"Gochi Hand"),hh*.72,0,hh*.04,.5*u,ww*.9);x.restore()};
    band(Y+TH*.47,14*u,L.f.top,W*.7);band(Y+TH*.885,11*u,L.f.bottom,W*.38)}},
hoho:{name:"Ho ho ho",cat:"xmas",r:.68,w:.42,paper:"#FFF8F0",ink:"#D8322B",f:{text:"Ho, Ho,\nHo!"},big:["text"],
  draw(x,W,H,L){const u=W/100;cut(x,()=>notch(x,0,0,W,H,9*u),L.paper,0);line(x,()=>notch(x,6*u,6*u,W-12*u,H-12*u,7*u),L.ink,1.4*u);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Young Serif"),20*u,W/2,H/2,W*.7,{lh:.95,maxH:H*.66})}},
merryring:{name:"Ring badge",cat:"xmas",r:1,w:.4,paper:"#FFF8F0",ink:"#D8322B",f:{text:"Merry & bright! Merry & bright!"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,48*u,0,7),L.ink,0);cut(x,()=>x.arc(c,c,31*u,0,7),L.paper,0);x.fillStyle=L.paper;x.font=BLK(8.6*u);ring(x,String(L.f.text).toUpperCase()+" ",c,c,39.5*u);sparkle(x,c,c,9*u,L.ink,2.4*u)}},
jingle:{name:"Starburst",cat:"xmas",r:1,w:.42,paper:"#C9C5F0",ink:"#D8322B",f:{text:"Jingle\nall the way"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>burst(x,c,c,49*u,38*u,16),L.ink,0);cut(x,()=>burst(x,c,c,44.5*u,34.5*u,16),L.paper,0);x.save();x.translate(c,c);x.rotate(-.14);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Kaushan Script"),17*u,0,0,W*.62,{lh:.95,maxH:H*.5});x.restore()}},
staywarm:{name:"Holiday stamp",cat:"xmas",r:1.22,w:.34,paper:"#E0412F",ink:"#FFF3E6",f:{text:"Stay warm"},big:[],
  draw(x,W,H,L){const u=W/100;x.fillStyle=L.paper;x.fillRect(0,0,W,H);scallop(x,0,0,W,H,2.6*u);line(x,()=>x.rect(7*u,7*u,W-14*u,H-14*u),L.ink,.7*u);x.fillStyle=L.ink;x.save();x.translate(W*.3,H*.2);x.rotate(-.12);T(x,L.f.text,CAV,11*u,0,0,W*.5);x.restore();
    ico(x,"snowflake",W*.5,H*.6,26*u,L.ink);ico(x,"tree",W*.78,H*.28,9*u,L.ink)}},
lights:{name:"Fairy lights",cat:"xmas",r:.82,w:.52,paper:"#A9D2DB",ink:"#16332B",f:{},big:[],
  draw(x,W,H,L){const u=W/100,bl=[[.3,.32,.27],[.55,.26,.25],[.75,.34,.22],[.66,.62,.27],[.38,.62,.28],[.2,.5,.2],[.86,.6,.12]];cut(x,()=>bl.forEach(([a,b,r])=>{x.moveTo(a*W+r*W,b*H);x.arc(a*W,b*H,r*W,0,7)}),L.paper,0);
    x.save();x.strokeStyle=L.ink;x.lineWidth=1.1*u;x.lineCap="round";x.beginPath();const pt=t=>[W*(.1+.8*t),H*(.5+Math.sin(t*PI*3.2)*.22)+Math.cos(t*9)*3*u];for(let i=0;i<=60;i++){const[a,b]=pt(i/60);i?x.lineTo(a,b):x.moveTo(a,b)}x.stroke();
    const C=["#F2B33D","#E0412F","#3A6FD8","#5DBB63","#F27FB2"];for(let i=0;i<12;i++){const t=.04+i*.083,[a,b]=pt(t),[a2,b2]=pt(t+.01),ang=Math.atan2(b2-b,a2-a)+(i%2?PI/2:-PI/2);x.save();x.translate(a,b);x.rotate(ang+PI/2);x.fillStyle=L.ink;x.fillRect(-1.2*u,-1*u,2.4*u,2.4*u);x.fillStyle=C[i%5];x.beginPath();x.ellipse(0,-4.4*u,2.4*u,3.6*u,0,0,7);x.fill();x.restore()}
    x.restore();const r=rnd(7);for(let i=0;i<14;i++){const a=W*(.12+r()*.76),b=H*(.12+r()*.76);x.fillStyle="#F7E27A";x.fillRect(a,b,1.1*u,1.1*u)}}},
season:{name:"Season tag",cat:"xmas",r:.48,w:.6,paper:"#C9C5F0",ink:"#D8322B",f:{top:"'Tis the season\nto be cosy",title:"Merry everything"},big:["top"],rot:6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>notch(x,0,0,W,H,5*u),L.paper,0);line(x,()=>notch(x,4*u,4*u,W-8*u,H-8*u,4.5*u),L.ink,1.1*u);x.fillStyle=L.ink;T(x,String(L.f.top).toUpperCase(),BLK,6.6*u,W/2,H*.38,W*.82,{lh:1.05,maxH:H*.42});
    x.fillStyle="#1E2F5C";T(x,L.f.title,ff(400,"Sacramento"),11*u,W*.56,H*.76,W*.76)}},
asterisk:{name:"Asterisk",cat:"xmas",r:1,w:.22,paper:"#E0412F",ink:"#FFFFFF",f:{},big:[],rot:12,
  draw(x,W,H,L){const u=W/100,c=W/2,bars=()=>[0,PI/3,-PI/3].forEach(a=>{x.save();x.translate(c,c);x.rotate(a);RR(x,-8*u,-40*u,16*u,80*u,8*u);x.restore()});
    x.save();x.lineJoin="round";x.beginPath();bars();x.strokeStyle=E;x.lineWidth=12*u;x.stroke();x.fillStyle=E;x.fill();x.restore();
    [0,PI/3,-PI/3].forEach(a=>{x.save();x.translate(c,c);x.rotate(a);x.beginPath();RR(x,-8*u,-40*u,16*u,80*u,8*u);x.fillStyle=L.paper;x.fill();x.restore()});
    [0,PI/3,-PI/3].forEach(a=>{x.save();x.translate(c,c);x.rotate(a);x.strokeStyle=L.ink;x.lineWidth=1.6*u;x.lineCap="round";x.beginPath();x.moveTo(0,-31*u);x.lineTo(0,31*u);x.stroke();x.restore()})}},
holidays:{name:"Happy Holidays",cat:"xmas",r:.66,w:.62,paper:null,ink:"#FFFFFF",f:{text:"Happy\nHolidays"},big:["text"],noShadow:true,rot:-6,
  draw(x,W,H,L){const u=W/100;x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Yellowtail"),30*u,W/2,H*.52,W*.84,{lh:.9,maxH:H*.82,shadow:"#D8322B",sx:1.6*u,sy:1.6*u});
    [[.08,.14,6],[.92,.2,5],[.12,.86,4],[.88,.88,6.5],[.8,.6,3]].forEach(([a,b,s])=>sparkle(x,W*a,H*b,s*u,L.ink,.9*u))}},
xmasarch:{name:"Christmas at",cat:"xmas",r:.62,w:.62,paper:null,ink:"#EE6146",f:{top:"Christmas",bottom:"at home"},big:[],noShadow:true,rot:0,
  draw(x,W,H,L){const u=W/100;x.fillStyle=L.ink;const sp=arcFit(x,String(L.f.top).toUpperCase(),ff(400,"Abril Fatface"),17*u,70*u,1.25,1.2*u);arcT(x,String(L.f.top).toUpperCase(),W/2,H*.2+70*u,70*u,-PI/2,sp,false);
    x.fillStyle=L.ink;S(x,L.f.bottom,ff(400,"Abril Fatface"),10*u,W/2,H*.62,1.6*u,W*.8);line(x,()=>{x.moveTo(W*.2,H*.78);x.lineTo(W*.8,H*.78)},L.ink,.8*u);[.38,.5,.62].forEach(a=>ico(x,"star",W*a,H*.9,2.6*u,L.ink))}},

/* ================= WINTER SPORT ================= */
skiclub:{name:"Ski club",cat:"winter",r:1.02,w:.4,paper:"#FBF6EE",ink:"#8E2B2B",f:{top:"Ski club",bottom:"Zermatt"},big:[],
  draw(x,W,H,L){const u=W/100,b=3*u;cut(x,()=>arch(x,b,b,W-2*b,H-2*b,10*u),L.paper,b);line(x,()=>arch(x,8*u,8*u,W-16*u,H-16*u,7*u),L.ink,.9*u);
    x.fillStyle=L.ink;const t=String(L.f.top).toUpperCase(),sp=arcFit(x,t,YS,10.5*u,30*u,1.9,1.2*u);arcT(x,t,W/2,8*u+42*u,30*u,-PI/2,sp,false);
    skis(x,W/2,H*.56,15*u,L.ink);pole(x,W*.24,H*.56,22*u,L.ink);pole(x,W*.76,H*.56,22*u,L.ink);x.fillStyle=L.ink;S(x,L.f.bottom,YS,9.5*u,W/2,H*.82,1.4*u,W*.66)}},
apres:{name:"Mountain shield",cat:"winter",r:1.2,w:.46,paper:"#7FB0CF",ink:"#16191D",f:{title:"Après\nski.",place:"Val Thorens"},big:["title"],
  draw(x,W,H,L){const u=W/100;cut(x,()=>shield(x,1.5*u,1.5*u,W-3*u,H-3*u,12*u),"#283740",0);x.save();clip(x,()=>shield(x,7*u,7*u,W-14*u,H-14*u,8*u));x.fillStyle=L.paper;x.fillRect(0,0,W,H);
    x.fillStyle="#E5622E";x.beginPath();x.arc(W*.3,H*.7,13*u,0,7);x.fill();mountains(x,-W*.04,H*.52,W*1.12,H*.52,"#E7DCC3",null,"#111","#16191D");x.restore();
    x.fillStyle=L.ink;const ls=String(L.f.title).split("\n"),p=fit(x,ls.join("\n"),BLK,19*u,W*.76);x.font=BLK(p);x.textAlign="left";x.textBaseline="alphabetic";ls.forEach((t,i)=>x.fillText(t,13*u,13*u+p*.9+i*p*.86));
    x.font=BLK(Math.min(8*u,p*.45));x.fillText(L.f.place,13.5*u,13*u+p*.9+(ls.length-1)*p*.86+p*.55)}},
gondola:{name:"Gondola",cat:"winter",r:1,w:.36,paper:"#F3EDE4",ink:"#C0352B",f:{top:"Up we go",bottom:"est. 2026"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,46*u,0,7),L.paper,3*u);line(x,()=>x.arc(c,c,41*u,0,7),L.ink,.8*u);
    x.fillStyle=L.ink;const t=String(L.f.top).toUpperCase(),sp=arcFit(x,t,BLK,8*u,33*u,2.2,1*u);arcT(x,t,c,c,33*u,-PI/2,sp,false);x.font=SANS(5*u);arcT(x,String(L.f.bottom).toUpperCase(),c,c,34.5*u,PI/2,.8*u,true);
    x.save();x.beginPath();x.arc(c,c,28*u,0,7);x.clip();line(x,()=>{x.moveTo(c-30*u,c-17*u);x.lineTo(c+30*u,c-23*u)},L.ink,1.1*u);line(x,()=>{x.moveTo(c,c-20*u);x.lineTo(c,c-8*u);x.moveTo(c-4*u,c-8*u);x.lineTo(c+4*u,c-8*u)},L.ink,1.6*u);
    x.beginPath();RR(x,c-13*u,c-8*u,26*u,30*u,4*u);x.fillStyle=L.ink;x.fill();x.fillStyle=L.paper;[[-10,-4],[1,-4]].forEach(([a,b])=>{x.beginPath();RR(x,c+a*u,c+b*u,9*u,12*u,1.6*u);x.fill()});x.fillRect(c-11*u,c+12*u,22*u,1*u);x.restore()}},
liftpass:{name:"Lift pass",cat:"winter",r:1.36,w:.3,paper:"#F2DD6E",ink:"#16191D",f:{label:"Day pass",place:"Les 3 Vallées",date:"24.12.2026"},big:[],rot:-6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,8*u),L.paper,0);hole(x,()=>RR(x,W/2-9*u,6*u,18*u,5*u,2.5*u));x.fillStyle=L.ink;S(x,"Ski pass",SANS,6*u,W/2,H*.15,1.4*u,W*.8);
    T(x,String(L.f.label).toUpperCase(),BEB,22*u,W/2,H*.27,W*.84);mountains(x,W*.14,H*.38,W*.72,H*.22,L.ink,L.paper);x.fillStyle=L.ink;T(x,L.f.place,SANS,7*u,W/2,H*.67,W*.84);T(x,L.f.date,SANS,5.4*u,W/2,H*.74,W*.8);
    const r=rnd(42);let a=12*u;while(a<W-12*u){const w=(r()<.5?.7:1.6)*u;x.fillRect(a,H*.8,w,H*.12);a+=w+(.8+r()*1.4)*u}}},
powder:{name:"Script tag",cat:"winter",r:.34,w:.58,paper:"#F6EFE6",ink:"#C8322B",f:{text:"Powder & Sun"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,3*u),L.paper,2*u);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Satisfy"),17*u,W/2,H*.5,W*.84)}},
snowday:{name:"Retro label",cat:"winter",r:.56,w:.5,paper:"#C8452F",ink:"#F3E3C7",f:{top:"Weekend",title:"Snow day",bottom:"Mountain club"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,4*u),L.paper,0);line(x,()=>RR(x,4*u,4*u,W-8*u,H-8*u,2.5*u),L.ink,.6*u);x.fillStyle=L.ink;S(x,L.f.top,SANS,5*u,W*.3,H*.22,1*u,W*.4);
    x.save();x.translate(W/2,H*.52);x.rotate(-.06);T(x,L.f.title,ff(400,"Yellowtail"),24*u,0,0,W*.84);x.restore();[.14,.2,.26].forEach(a=>ico(x,"star",W*a,H*.8,2.2*u,L.ink));x.font=SANS(3.8*u);x.textAlign="right";x.fillText(String(L.f.bottom).toUpperCase(),W*.88,H*.8)}},

/* ================= OUTDOOR ================= */
pennant:{name:"Pennant",cat:"outdoor",r:.46,w:.5,paper:"#E8642C",ink:"#16191D",f:{text:"Stay\nwild"},big:["text"],rot:-10,
  draw(x,W,H,L){const u=W/100,b=2.5*u,P=()=>{x.moveTo(b+6*u,b);x.lineTo(W-b,H/2);x.lineTo(b+6*u,H-b);x.closePath()};cut(x,P,L.paper,b);cut(x,()=>RR(x,b,b-1*u,9*u,H-2*b+2*u,2*u),L.ink,0);
    line(x,()=>{x.moveTo(16*u,9*u);x.lineTo(W-14*u,H/2);x.lineTo(16*u,H-9*u);x.closePath()},L.ink,1.2*u);x.save();x.translate(W*.4,H/2);x.rotate(-.18);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,14*u,0,0,W*.38,{lh:.95,maxH:H*.46});x.restore()}},
mtnarch:{name:"Mountain arch",cat:"outdoor",r:1.08,w:.4,paper:"#FBF6EE",ink:"#1F3A6B",f:{top:"Mountain air",bottom:"Outdoor club"},big:[],
  draw(x,W,H,L){const u=W/100,b=2.5*u;cut(x,()=>arch(x,b,b,W-2*b,H-2*b,8*u),L.paper,b);line(x,()=>arch(x,7*u,7*u,W-14*u,H-14*u,5*u),L.ink,2.6*u);
    x.fillStyle=L.ink;const t=String(L.f.top).toUpperCase(),sp=arcFit(x,t,BLK,8.5*u,33*u,2.3,1.2*u);arcT(x,t,W/2,7*u+43*u,33*u,-PI/2,sp,false);
    x.save();clip(x,()=>arch(x,18*u,22*u,W-36*u,H-40*u,2*u));x.fillStyle="#E5503B";x.beginPath();x.arc(W/2,H*.56,16*u,0,7);x.fill();x.restore();
    mountains(x,W*.17,H*.48,W*.66,H*.3,L.ink,L.paper);pine(x,W*.16,H*.8,14*u,L.ink);pine(x,W*.84,H*.8,14*u,L.ink);x.fillStyle="#E5503B";S(x,L.f.bottom,SANS,4.8*u,W/2,H*.87,1*u,W*.62)}},
pinering:{name:"Pine badge",cat:"outdoor",r:1,w:.38,paper:"#1E3C3A",ink:"#F2E6D0",f:{top:"Inspired by nature",bottom:"Est. 2026"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,46*u,0,7),L.paper,3.5*u,"#E8DFCF");x.fillStyle=L.ink;const t=String(L.f.top).toUpperCase(),sp=arcFit(x,t,BLK,8*u,35*u,3.4,1*u);arcT(x,t,c,c,35*u,-PI/2,sp,false);
    x.font=SANS(5.6*u);arcT(x,String(L.f.bottom).toUpperCase(),c,c,36.5*u,PI/2,1*u,true);[[-11,12,15],[0,9,22],[11,12,15]].forEach(([a,b,s])=>pine(x,c+a*u,c+b*u,s*u*1.3,"#E5582B"));[-28,28].forEach(a=>ico(x,"star",c+a*u,c+18*u,2*u,L.ink))}},
ooo:{name:"Halftone hills",cat:"outdoor",r:1,w:.4,paper:"#2E6E5E",ink:"#F2EBDD",f:{text:"Out of office"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,6*u),L.paper,0);x.save();clip(x,()=>RR(x,0,0,W,H,6*u));
    [[.08,.86,.3],[.3,.6,.55],[.52,.95,.8]].forEach(([y0,a,b],i)=>{x.save();clip(x,()=>poly(x,[[0,1],[0,y0+.3],[.25,y0+.05],[.42,y0+.22],[.66,y0],[1,y0+.28],[1,1]],0,H*(.05+i*.07),W,H*.62));halftone(x,0,H*(y0+i*.07),W,H*.6,2.2*u,L.ink,a*.9,b*.2);x.restore()});
    x.beginPath();poly(x,[[0,1],[0,.72],[.3,.56],[.55,.68],[.78,.58],[1,.7],[1,1]],0,0,W,H);x.fillStyle=L.ink;x.fill();[[.66,.68,16],[.76,.66,22],[.86,.7,14]].forEach(([a,b,s])=>pine(x,W*a,H*b+2*u,s*u,L.paper));
    x.fillStyle=L.paper;T(x,String(L.f.text).toUpperCase(),BLK,9*u,W/2,H*.86,W*.82);x.restore()}},
retrostripe:{name:"Retro stripes",cat:"outdoor",r:.66,w:.46,paper:"#5D8896",ink:"#F2B33D",f:{text:"wanderlust"},big:[],
  draw(x,W,H,L){const u=W/100;const b=2.5*u;x.save();cut(x,()=>RR(x,b,b,W-2*b,H-2*b,5*u),L.paper,b);clip(x,()=>RR(x,b,b,W-2*b,H-2*b,5*u));["#C8452F","#E5762E","#F2B33D"].forEach((c,i)=>{x.fillStyle=c;x.fillRect(W*.42,H*(.14+i*.1),W,H*.07)});
    x.fillStyle="#F2B33D";x.beginPath();x.arc(W*.34,H*.42,11*u,0,7);x.fill();x.beginPath();poly(x,[[0,1],[0,.66],[.14,.56],[.3,.4],[.46,.52],[.6,.34],[.82,.56],[1,.5],[1,1]],0,0,W,H);x.fillStyle="#16191D";x.fill();
    x.fillStyle="#F3EEE4";x.beginPath();poly(x,[[.3,.4],[.36,.47],[.32,.46],[.27,.49],[.25,.45]],0,0,W,H);x.fill();x.beginPath();poly(x,[[.6,.34],[.68,.42],[.63,.41],[.58,.45],[.54,.4]],0,0,W,H);x.fill();
    x.fillStyle=L.ink;T(x,L.f.text,ff(700,"Fredoka"),17*u,W/2,H*.78,W*.84);x.restore()}},
takehike:{name:"Trail sign",cat:"outdoor",r:.3,w:.6,paper:"#E8642C",ink:"#16191D",f:{text:"Take a hike"},big:[],rot:-4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,1.5*u,1.5*u,W-3*u,H-3*u,2.5*u),L.paper,1.5*u);line(x,()=>RR(x,4*u,4*u,W-8*u,H-8*u,1.5*u),L.ink,1.6*u);
    x.save();x.fillStyle=L.ink;x.beginPath();poly(x,[[0,1],[.5,0],[1,1]],8*u,H*.28,16*u,H*.44);x.fill();x.fillStyle=L.paper;x.beginPath();poly(x,[[0,1],[.5,.2],[1,1]],14*u,H*.48,4*u,H*.24);x.fill();x.restore();
    x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,13*u,W*.58,H/2,W*.64)}},
donorth:{name:"Forest type",cat:"outdoor",r:.76,w:.5,paper:"#2F6B45",ink:"#F3EBD9",f:{text:"Do\nwander"},big:["text"],
  draw(x,W,H,L){const u=W/100,tr=[[.18,.93,40,.5],[.82,.93,44,.5],[.34,.95,56,.25],[.66,.95,60,.25],[.5,.96,70,0],[.1,.96,28,0],[.9,.96,26,0]];
    tr.forEach(([a,b,s])=>pine(x,W*a,H*b,s*u,E,E,6*u));tr.forEach(([a,b,s,t])=>pine(x,W*a,H*b,s*u,mix(L.paper,"#FFFFFF",t)));
    x.fillStyle=L.ink;T(x,L.f.text,FRA,22*u,W/2,H*.7,W*.62,{lh:.84,maxH:H*.46,stroke:L.paper,sw:3*u})}},

/* ================= MORNING ================= */
brewpill:{name:"Coffee pill",cat:"morning",r:.3,w:.6,paper:"#1F3E8C",ink:"#FFFFFF",f:{text:"But first, coffee"},big:[],rot:-5,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,H),L.paper,2*u);line(x,()=>RR(x,5.5*u,5.5*u,W-11*u,H-11*u,H),L.ink,.6*u);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Kaushan Script"),11*u,W/2,H*.52,W*.8)}},
gm:{name:"Good morning",cat:"morning",r:1,w:.4,paper:"#F7C843",ink:"#2A1D14",f:{text:"Good\nmorning"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>burst(x,c,c,46*u,39*u,22),L.paper,3*u);x.fillStyle=L.ink;x.save();x.translate(c,c);x.rotate(-.1);T(x,L.f.text,ff(400,"Shrikhand"),17*u,0,0,W*.66,{lh:.96,maxH:H*.56});x.restore()}},
needcoffee:{name:"Doodle note",cat:"morning",r:.58,w:.42,paper:"#FFFFFF",ink:"#111111",f:{text:"Need\ncoffee"},big:["text"],rot:-4,
  draw(x,W,H,L){const u=W/100,r=rnd(11),P=[];for(let i=0;i<=24;i++){const t=i/24;P.push([.03+t*.94,.06+(r()-.5)*.03])}for(let i=0;i<=10;i++)P.push([.97+(r()-.5)*.02,.06+i/10*.88]);for(let i=24;i>=0;i--)P.push([.03+i/24*.94,.94+(r()-.5)*.03]);
    cut(x,()=>poly(x,P,0,0,W,H),L.paper,0);line(x,()=>poly(x,P,0,0,W,H),L.ink,1.2*u);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),ff(400,"Gochi Hand"),22*u,W*.42,H/2,W*.62,{lh:.95,maxH:H*.78});
    x.save();x.strokeStyle=L.ink;x.lineWidth=1.2*u;x.lineJoin=x.lineCap="round";x.beginPath();RR(x,W*.76,H*.42,W*.13,H*.3,1.5*u);x.moveTo(W*.89,H*.48);x.arc(W*.89,H*.56,H*.08,-PI/2,PI/2);x.moveTo(W*.79,H*.32);x.quadraticCurveTo(W*.76,H*.25,W*.8,H*.2);x.moveTo(W*.85,H*.32);x.quadraticCurveTo(W*.82,H*.25,W*.86,H*.2);x.stroke();x.restore()}},
mug:{name:"Mug",cat:"morning",r:.82,w:.42,paper:"#E8732C",ink:"#FFFFFF",f:{top:"Made with",text:"love &\ncaffeine"},big:["text"],
  draw(x,W,H,L){const u=W/100,b=2.5*u;x.save();x.lineCap="round";x.strokeStyle=E;x.lineWidth=13*u+2*b;x.beginPath();x.arc(W*.74,H*.5,15*u,-PI/2.4,PI/2.4);x.stroke();x.strokeStyle=L.paper;x.lineWidth=11*u;x.stroke();x.restore();
    cut(x,()=>{x.moveTo(b,b+2*u);x.lineTo(W*.74,b+2*u);x.lineTo(W*.7,H-12*u);x.quadraticCurveTo(W*.69,H-b,W*.56,H-b);x.lineTo(W*.18,H-b);x.quadraticCurveTo(W*.05,H-b,W*.04,H-12*u);x.closePath()},L.paper,b);
    x.fillStyle=L.ink;S(x,L.f.top,SANS,5.4*u,W*.38,H*.2,1*u,W*.56);T(x,L.f.text,ff(900,"Fraunces"),15*u,W*.38,H*.53,W*.58,{lh:.92,maxH:H*.5})}},
togo:{name:"To-go cup",cat:"morning",r:1.42,w:.24,paper:"#1F3E8C",ink:"#FFFFFF",f:{text:"Oat latte"},big:[],rot:8,
  draw(x,W,H,L){const u=W/100,b=3*u,C=()=>{x.moveTo(W*.16,H*.16);x.lineTo(W*.84,H*.16);x.lineTo(W*.74,H-b);x.lineTo(W*.26,H-b);x.closePath();RR(x,W*.08,H*.08,W*.84,H*.1,3*u);RR(x,W*.2,b,W*.6,H*.08,3*u)};cut(x,C,L.paper,b);
    x.save();x.strokeStyle=L.ink;x.lineWidth=1.8*u;x.lineJoin="round";x.beginPath();RR(x,W*.08,H*.08,W*.84,H*.1,3*u);x.stroke();x.beginPath();x.moveTo(W*.19,H*.4);x.lineTo(W*.81,H*.4);x.lineTo(W*.77,H*.64);x.lineTo(W*.23,H*.64);x.closePath();x.stroke();x.restore();
    x.fillStyle=L.ink;x.save();x.translate(W/2,H*.52);T(x,String(L.f.text).toUpperCase(),BEB,14*u,0,0,W*.52);x.restore()}},
rise:{name:"Oval",cat:"morning",r:.56,w:.44,paper:"#2B4FC7",ink:"#FFFFFF",f:{text:"Rise &\nshine"},big:["text"],rot:-8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.ellipse(W/2,H/2,W/2-2.5*u,H/2-2.5*u,0,0,7),L.paper,2.5*u);x.save();x.translate(W/2,H/2);x.rotate(-.08);x.fillStyle=L.ink;T(x,L.f.text,ff(700,"Fredoka"),15*u,0,0,W*.66,{lh:.9,maxH:H*.62});x.restore()}},

/* ================= WEATHER ================= */
temp:{name:"Temperature",cat:"weather",r:1,w:.34,paper:"#8EC5E8",ink:"#14305A",f:{title:"21°",text:"Sunny"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,46*u,0,7),L.paper,3.5*u);ico(x,"sun",W*.7,H*.28,13*u,"#F7C843");x.fillStyle=L.ink;T(x,L.f.title,ff(400,"Bowlby One"),30*u,c,H*.53,W*.72);S(x,L.f.text,SANS,6*u,c,H*.77,1.2*u,W*.6)}},
rainy:{name:"Rain cloud",cat:"weather",r:.84,w:.44,paper:"#D9E5EF",ink:"#1E2F5C",f:{text:"Rainy day\nmood"},big:["text"],
  draw(x,W,H,L){const u=W/100,b=3*u,cl=[[.28,.42,.2],[.5,.3,.25],[.72,.42,.2],[.5,.52,.2],[.2,.55,.14],[.8,.55,.14]],dr=[[.3,.86],[.5,.92],[.7,.86]];
    cut(x,()=>{x.moveTo(W*.2,H*.69);x.lineTo(W*.8,H*.69);cl.forEach(([a,c2,r])=>{x.moveTo(a*W+r*W,c2*H);x.arc(a*W,c2*H,r*W,0,7)});x.moveTo(W*.14,H*.6);x.rect(W*.14,H*.55,W*.72,H*.14)},L.paper,b);
    dr.forEach(([a,c2])=>cut(x,()=>{const cx=W*a,cy=H*c2,s=4.5*u;x.moveTo(cx,cy-s*1.9);x.bezierCurveTo(cx+s*.4,cy-s,cx+s,cy-s*.3,cx+s,cy+s*.2);x.arc(cx,cy+s*.2,s,0,PI);x.bezierCurveTo(cx-s,cy-s*.3,cx-s*.4,cy-s,cx,cy-s*1.9)},"#5B8BD0",2*u));
    x.fillStyle=L.ink;T(x,L.f.text,CAV,15*u,W/2,H*.46,W*.66,{lh:.9,maxH:H*.36})}},
forecast:{name:"Forecast",cat:"weather",r:.62,w:.54,paper:"#FFFFFF",ink:"#1E2F5C",f:{top:"Weekend forecast",d1:"Sat 18°",d2:"Sun 15°",d3:"Mon 11°"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,8*u),L.paper,0);x.fillStyle=L.ink;S(x,L.f.top,SANS,5*u,W/2,H*.15,1.1*u,W*.84);line(x,()=>{x.moveTo(8*u,H*.26);x.lineTo(W-8*u,H*.26)},L.ink+"33",.5*u);
    [["sun","#F2A93B","d1"],["partsun","#7BA7D9","d2"],["rain","#5B8BD0","d3"]].forEach(([s,c,k],i)=>{const cx=W*(.2+i*.3);ico(x,s,cx,H*.52,11*u,c);x.fillStyle=L.ink;T(x,L.f[k],SANS,6*u,cx,H*.82,W*.28)})}},
sunsout:{name:"Sunshine",cat:"weather",r:1,w:.36,paper:"#F7C843",ink:"#B5461F",f:{text:"Sun's\nout"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>{x.arc(c,c,32*u,0,7);for(let k=0;k<12;k++){const a=k*PI/6;x.moveTo(c+Math.cos(a-.12)*30*u,c+Math.sin(a-.12)*30*u);x.lineTo(c+Math.cos(a)*46*u,c+Math.sin(a)*46*u);x.lineTo(c+Math.cos(a+.12)*30*u,c+Math.sin(a+.12)*30*u);x.closePath()}},L.paper,2.5*u);
    x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Shrikhand"),15*u,c,c,W*.48,{lh:.92,maxH:H*.42})}},
cosy:{name:"Umbrella pill",cat:"weather",r:.34,w:.56,paper:"#3A5BA0",ink:"#FFFFFF",f:{text:"100% chance\nof cosy"},big:["text"],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,H),L.paper,2*u);ico(x,"umbrella",W*.19,H*.5,9*u,L.ink);x.fillStyle=L.ink;T(x,L.f.text,SANS,8*u,W*.58,H*.5,W*.58,{lh:1.05,maxH:H*.66})}},
letitsnow:{name:"Snow badge",cat:"weather",r:1,w:.34,paper:"#DCEBF5",ink:"#1E2F5C",f:{text:"Let it\nsnow"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>wavy(x,c,c,44*u,2.6*u,14),L.paper,2.5*u);ico(x,"snowflake",c,H*.27,8*u,L.ink);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Young Serif"),15*u,c,H*.6,W*.6,{lh:.95,maxH:H*.42})}},

/* ================= SOCIALS ================= */
linkbio:{name:"Speech bubble",cat:"socials",hidden:true,r:.6,w:.44,paper:"#FFFFFF",ink:"#111111",f:{text:"Link in bio"},big:[],
  draw(x,W,H,L){const u=W/100,P=()=>{RR(x,3*u,3*u,W-6*u,H*.72,10*u);x.moveTo(W*.36,H*.72);x.lineTo(W*.16,H-3*u);x.lineTo(W*.22,H*.72)};line(x,P,L.ink,3.2*u);cut(x,P,L.paper,0);x.fillStyle=L.ink;T(x,L.f.text,BLK,11*u,W/2,3*u+H*.36,W*.8)}},
likes:{name:"Like count",cat:"socials",r:.5,w:.34,paper:"#FF3040",ink:"#FFFFFF",f:{text:"1.2K"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>{RR(x,2*u,2*u,W-4*u,H*.74,10*u);x.moveTo(W*.42,H*.74);x.lineTo(W*.5,H-3*u);x.lineTo(W*.58,H*.74)},L.paper,0);x.fillStyle=L.ink;x.beginPath();heart(x,W*.27,2*u+H*.36,9*u);x.fill();T(x,L.f.text,ff(700,"DM Sans"),20*u,W*.62,2*u+H*.37,W*.5)}},
follow:{name:"Follow button",cat:"socials",hidden:true,r:.3,w:.4,paper:"#3797F0",ink:"#FFFFFF",f:{text:"Follow"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,7*u),L.paper,2*u);x.fillStyle=L.ink;T(x,"+ "+L.f.text,SANS,13*u,W/2,H/2,W*.8)}},
newpost:{name:"New post",cat:"socials",hidden:true,r:1,w:.34,paper:"#FF5FA2",ink:"#FFFFFF",f:{text:"New\npost!"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>burst(x,c,c,46*u,34*u,12),L.paper,3*u);x.save();x.translate(c,c+2*u);x.rotate(-.12);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),ff(400,"Luckiest Guy"),20*u,0,0,W*.56,{lh:.92,maxH:H*.5});x.restore()}},
dms:{name:"DM pill",cat:"socials",hidden:true,r:.4,w:.5,paper:"#111111",ink:"#F2DD6E",f:{text:"Slide into\nmy DMs"},big:["text"],rot:4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,H),L.paper,2*u);x.save();x.translate(W*.2,H/2);x.rotate(-.35);x.fillStyle=L.ink;x.beginPath();poly(x,[[0,.5],[1,0],[.62,1],[.45,.62]],-8*u,-7*u,16*u,14*u);x.fill();x.restore();x.fillStyle=L.ink;T(x,L.f.text,BLK,9*u,W*.6,H/2,W*.56,{lh:1.02,maxH:H*.6})}},
tapmore:{name:"Tap for more",cat:"socials",hidden:true,r:.28,w:.48,paper:"#F2DD6E",ink:"#111111",f:{text:"Tap for more"},big:[],rot:-3,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,6*u),L.paper,2*u);x.fillStyle=L.ink;T(x,L.f.text,SANS,11*u,W*.44,H/2,W*.66);line(x,()=>{x.moveTo(W*.84,H*.32);x.lineTo(W*.9,H*.5);x.lineTo(W*.84,H*.68)},L.ink,2*u)}},
mention:{name:"Mention",cat:"socials",hidden:true,r:.26,w:.46,paper:"#FFFFFF",ink:"#D62976",f:{text:"@yourname"},big:[],rot:0,noInk:true,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,5*u),L.paper,0);const g=x.createLinearGradient(W*.1,0,W*.9,0);g.addColorStop(0,"#F58529");g.addColorStop(.5,"#DD2A7B");g.addColorStop(1,"#8134AF");x.fillStyle=g;T(x,String(L.f.text).toUpperCase(),BLK,11*u,W/2,H/2,W*.84)}},

/* ---- socials v2: like, live, follow, friends, invited, streaming, binge ---- */
ransom:{name:"Cut-out letters",cat:"socials",r:.56,w:.6,paper:null,ink:"#111111",f:{text:"Follow me"},big:[],noInk:true,rot:-3,
  draw(x,W,H,L){const u=W/100,words=String(L.f.text||" ").toUpperCase().split(/\s+/).filter(Boolean),ls=[];words.forEach(w=>{const l=ls[ls.length-1];if(l&&(l+" "+w).length<=8&&ls.length)ls[ls.length-1]=l+" "+w;else ls.push(w)});const lines=ls.slice(0,3),n=Math.max(...lines.map(l=>l.length));
    const px=Math.min((W*.96)/(n*.86),(H*.94)/(lines.length*1.22)),seed=[...L.f.text].reduce((a,c)=>a+c.charCodeAt(0),7),r=rnd(seed);
    const FS=[BLK,ff(400,"Abril Fatface"),ff(400,"Bagel Fat One"),ff(400,"Young Serif"),ff(400,"Anton"),ff(400,"Rye"),ff(400,"Shrikhand"),SANS],PA=[["#F4EEDC","#111"],["#111","#F4EEDC"],["#E4322B","#FFF"],["#F6D23C","#111"],["#F5A3C7","#B3122E"],["#2F55E8","#FFF"],["#FFFFFF","#E4322B"],["#C9E265","#111"]];
    lines.forEach((ln,li)=>{const cy=H/2+(li-(lines.length-1)/2)*px*1.22;let X=W/2-ln.length*px*.86/2;[...ln].forEach(ch=>{if(ch===" "){X+=px*.86;return}const cx=X+px*.43,[pc,ic]=PA[Math.floor(r()*PA.length)],f=FS[Math.floor(r()*FS.length)],a=(r()-.5)*.36,sz=px*(.86+r()*.22);
      x.save();x.translate(cx,cy+(r()-.5)*px*.12);x.rotate(a);x.shadowColor="rgba(0,0,0,.28)";x.shadowBlur=px*.08;x.shadowOffsetY=px*.04;x.beginPath();torn(x,-sz*.42,-sz*.56,sz*.84,sz*1.1,Math.floor(r()*999),sz*.06);x.fillStyle=pc;x.fill();x.shadowColor="transparent";
      x.fillStyle=ic;x.font=f(sz*.74);x.textAlign="center";x.textBaseline="middle";const w=x.measureText(ch).width;if(w>sz*.72)x.font=f(sz*.74*sz*.72/w);x.fillText(ch,0,sz*.04);x.restore();X+=px*.86})})}},
receipt:{name:"Receipt",cat:"socials",r:1.5,w:.3,paper:"#F7F5EF",ink:"#222222",f:{top:"Weekend recap",text:"Likes 1.2K\nComments 86\nNew friends 3\nRegrets 0",bottom:"Thank you, come again"},big:["text"],rot:4,
  draw(x,W,H,L){const u=W/100,t=3.4*u,P=()=>{x.moveTo(0,t);for(let i=0;i<=14;i++)x.lineTo(i*W/14,i%2?0:t);for(let i=14;i>=0;i--)x.lineTo(i*W/14,H-(i%2?0:t));x.closePath()};cut(x,P,L.paper,0);x.fillStyle=L.ink;x.textBaseline="middle";
    x.font=MONO(6.4*u);x.textAlign="center";x.fillText(String(L.f.top).toUpperCase(),W/2,12*u,W-12*u);x.font=MONO(4.4*u);x.fillText("24.11 \u00b7 22:04 \u00b7 #0042",W/2,20*u);x.fillText("- - - - - - - - - - - - -",W/2,27*u);
    const ls=String(L.f.text).split("\n").slice(0,7);x.font=MONO(5.2*u);ls.forEach((ln,i)=>{const y=36*u+i*9*u,k=ln.lastIndexOf(" "),a=k>0?ln.slice(0,k):ln,b=k>0?ln.slice(k+1):"";x.textAlign="left";x.fillText(a.toUpperCase(),7*u,y,W*.6);x.textAlign="right";x.fillText(b.toUpperCase(),W-7*u,y);const aw=Math.min(x.measureText(a.toUpperCase()).width,W*.6),bw=x.measureText(b.toUpperCase()).width;x.save();x.globalAlpha=.5;x.textAlign="left";let d=7*u+aw+2*u;while(d<W-7*u-bw-3*u){x.fillText(".",d,y);d+=2.4*u}x.restore()});
    const yb=36*u+ls.length*9*u;x.textAlign="center";x.fillText("- - - - - - - - - - - - -",W/2,yb);x.font=MONO(6*u);x.textAlign="left";x.fillText("TOTAL",7*u,yb+9*u);x.textAlign="right";x.fillText("VIBES",W-7*u,yb+9*u);
    const r=rnd(8);let a=10*u;while(a<W-10*u){const w=(r()<.5?.6:1.4)*u;x.fillRect(a,H-30*u,w,12*u);a+=w+(.6+r()*1)*u}x.font=MONO(3.8*u);x.textAlign="center";x.fillText(String(L.f.bottom).toUpperCase(),W/2,H-11*u,W-10*u)}},
comment:{name:"Comment",cat:"socials",r:.36,w:.6,paper:"#FFFFFF",ink:"#111111",f:{top:"yourfriend",text:"obsessed with this!!"},big:[],rot:-4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>torn(x,2*u,2*u,W-4*u,H-4*u,51,2.6*u),L.paper,0);const g=x.createLinearGradient(6*u,H*.2,20*u,H*.6);g.addColorStop(0,"#F58529");g.addColorStop(.5,"#DD2A7B");g.addColorStop(1,"#8134AF");x.fillStyle=g;x.beginPath();x.arc(14*u,H*.42,7*u,0,7);x.fill();x.fillStyle="#E9E2D3";x.beginPath();x.arc(14*u,H*.42,5.6*u,0,7);x.fill();x.fillStyle="#9A8F7C";T(x,String(L.f.top||"?")[0].toUpperCase(),SANS,6*u,14*u,H*.43,8*u);
    x.fillStyle=L.ink;x.textAlign="left";x.textBaseline="middle";x.font=SANS(5.2*u);x.fillText(L.f.top,25*u,H*.3,W*.56);x.font=ff(500,"DM Sans")(6.4*u);const p=fit(x,L.f.text,ff(500,"DM Sans"),6.4*u,W*.62);x.font=ff(500,"DM Sans")(p);x.fillText(L.f.text,25*u,H*.52);x.fillStyle="#8A8A8A";x.font=SANS(4*u);x.fillText("Reply \u00b7 2m \u00b7 128 likes",25*u,H*.74);
    x.save();x.strokeStyle="#E4322B";x.fillStyle="#E4322B";x.beginPath();heart(x,W-10*u,H*.46,3.8*u);x.fill();x.restore()}},
doodle:{name:"Marker doodle",cat:"socials",r:.62,w:.46,paper:null,ink:"#FFFFFF",f:{text:"tap here!"},big:[],noShadow:true,rot:-6,
  draw(x,W,H,L){const u=W/100,sh="rgba(0,0,0,.35)";const go=(col,o)=>{x.save();x.translate(o,o);x.fillStyle=col;x.save();x.translate(W*.4,H*.3);x.rotate(-.08);T(x,L.f.text,ff(400,"Gochi Hand"),18*u,0,0,W*.76);x.restore();
      line(x,()=>{x.moveTo(W*.24,H*.5);x.bezierCurveTo(W*.2,H*.78,W*.5,H*.92,W*.82,H*.78);x.moveTo(W*.82,H*.78);x.lineTo(W*.72,H*.7);x.moveTo(W*.82,H*.78);x.lineTo(W*.73,H*.88)},col,2.4*u);
      line(x,()=>{for(let i=0;i<=40;i++){const a=i/40*PI*2.15,rr=1+(i%7)*.01;x.lineTo(W*.86+Math.cos(a)*9*u*rr,H*.5+Math.sin(a)*7*u*rr)}},col,1.4*u);x.restore()};go(sh,.8*u);go(L.ink,0)}},
riso:{name:"Riso print",cat:"socials",r:.66,w:.42,paper:"#F4EEDC",ink:"#FF48B0",f:{text:"Live\nnow"},big:["text"],rot:5,
  draw(x,W,H,L){const u=W/100;cut(x,()=>torn(x,3*u,3*u,W-6*u,H-6*u,91,3.4*u),L.paper,0);const t=String(L.f.text).toUpperCase(),o={lh:.86,maxH:H*.76};x.save();x.globalCompositeOperation="multiply";
    x.fillStyle="#2F7BE8";T(x,t,BLK,28*u,W/2+1.8*u,H/2+1.4*u,W*.8,o);x.fillStyle=L.ink;T(x,t,BLK,28*u,W/2,H/2,W*.8,o);x.restore();x.save();x.globalCompositeOperation="source-atop";x.globalAlpha=.25;halftone(x,0,0,W,H,1.8*u,L.paper,.6,.2);x.restore()}},
masking:{name:"Masking tape",cat:"socials",r:.2,w:.56,paper:"#E9DDBF",ink:"#2A2A2A",f:{text:"binge watching..."},big:[],rot:-7,
  draw(x,W,H,L){const u=W/100,r=rnd(17);x.save();x.globalAlpha=.92;cut(x,()=>{x.moveTo(1*u,0);x.lineTo(W-2*u,0);for(let i=0;i<=8;i++)x.lineTo(W-(i%2?3:0)*u-r()*u,i*H/8);x.lineTo(1*u,H);for(let i=8;i>=0;i--)x.lineTo((i%2?2.6:0)*u+r()*u,i*H/8);x.closePath()},L.paper,0);x.restore();
    x.save();x.globalAlpha=.1;line(x,()=>{for(let i=1;i<4;i++){x.moveTo(4*u,H*i/4);x.lineTo(W-4*u,H*i/4)}},"#000",.3*u);x.restore();x.fillStyle=L.ink;T(x,L.f.text,ff(700,"Caveat"),H*.62,W/2,H*.54,W*.86)}},
closefriends:{name:"Close friends",cat:"socials",r:.3,w:.5,paper:"#2BB24C",ink:"#FFFFFF",f:{text:"Close friends"},big:[],rot:3,
  draw(x,W,H,L){const u=W/100;cut(x,()=>torn(x,2*u,2*u,W-4*u,H-4*u,63,2.4*u),L.paper,0);x.fillStyle=L.ink;x.beginPath();x.arc(H*.5+1*u,H/2,H*.32,0,7);x.fill();x.fillStyle=L.paper;x.beginPath();burst(x,H*.5+1*u,H/2,H*.22,H*.09,5);x.fill();x.fillStyle=L.ink;T(x,L.f.text,SANS,10*u,H+W*.34,H/2,W-H-10*u)}},

tapestrip:{name:"Tape label",cat:"socials",r:.17,w:.62,paper:"#F4EEDC",ink:"#111111",f:{text:"More likes"},big:[],rot:-14,
  draw(x,W,H,L){const u=W/100,r=rnd(9);cut(x,()=>{x.moveTo(1*u,0);x.lineTo(W-1*u,0);for(let i=0;i<=6;i++)x.lineTo(W-(r()*1.6)*u,i*H/6);x.lineTo(1*u,H);for(let i=6;i>=0;i--)x.lineTo((r()*1.6)*u,i*H/6);x.closePath()},L.paper,0);x.fillStyle=L.ink;italic(x,()=>T(x,String(L.f.text).toUpperCase(),BLK,H*.66,W/2+H*.1,H*.54,W*.88))}},
peace:{name:"Peace hand",cat:"socials",r:1.12,w:.28,paper:"#A8F07A",ink:"#1B4D2B",f:{},big:[],rot:-8,
  draw(x,W,H,L){const u=W/100,lw=3.2*u,I=L.ink,fing=(cx,cy,a,len)=>rot(x,cx,cy,a,()=>RR(x,-8*u,-len,16*u,len+8*u,8*u));
    const parts=[fing(40*u,62*u,-.2,52*u),fing(60*u,62*u,.2,50*u),()=>x.arc(73*u,70*u,10*u,0,7),()=>x.arc(70*u,88*u,9*u,0,7),()=>RR(x,26*u,56*u,52*u,50*u,15*u),rot(x,30*u,78*u,-.5,()=>RR(x,-14*u,-8*u,40*u,16*u,8*u))];
    union(x,parts,L.paper,I,lw);line(x,()=>{x.moveTo(64*u,70*u);x.quadraticCurveTo(70*u,79*u,79*u,78*u);x.moveTo(62*u,88*u);x.lineTo(66*u,92*u)},I,lw);line(x,()=>{x.save();x.translate(30*u,78*u);x.rotate(-.5);RR(x,-14*u,-8*u,40*u,16*u,8*u);x.restore()},I,lw);
    x.fillStyle=L.paper;x.save();x.translate(30*u,78*u);x.rotate(-.5);x.fillRect(-12*u,-6.2*u,30*u,8*u);x.restore();line(x,()=>{x.moveTo(50*u,56*u);x.lineTo(50*u,64*u)},I,lw*.8)}},
torn:{name:"Torn paper",cat:"socials",r:.62,w:.44,paper:"#F5A3C7",ink:"#D7263D",f:{text:"binge\nmode"},big:["text"],rot:-6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>torn(x,4*u,4*u,W-8*u,H-8*u,21,5*u),mix(L.paper,"#FFFFFF",.6),0);cut(x,()=>torn(x,7*u,7*u,W-14*u,H-14*u,4,4*u),L.paper,0);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Bagel Fat One"),24*u,W/2,H*.5,W*.76,{lh:.82,maxH:H*.7})}},
torn2:{name:"Torn label",cat:"socials",r:.66,w:.4,paper:"#F6D23C",ink:"#1F6B3A",f:{text:"Don't\nstop\nnow"},big:["text"],rot:4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>torn(x,4*u,4*u,W-8*u,H-8*u,33,5*u),mix(L.paper,"#FFFFFF",.55),0);cut(x,()=>torn(x,7*u,7*u,W-14*u,H-14*u,12,4*u),L.paper,0);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),ff(400,"Cherry Bomb One"),22*u,W/2,H*.52,W*.74,{lh:.82,maxH:H*.74})}},
livestream:{name:"Live streaming",cat:"socials",r:.36,w:.5,paper:"#FFFFFF",ink:"#111111",f:{top:"Live",text:"Streaming"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100,R="#E8322E";cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,7*u),L.paper,0);cut(x,()=>{RR(x,7*u,H/2-9*u,22*u,18*u,4.5*u);x.moveTo(27*u,H/2);x.lineTo(36*u,H/2-8*u);x.lineTo(36*u,H/2+8*u);x.closePath()},R,0);
    x.fillStyle="#FFFFFF";x.beginPath();poly(x,[[0,0],[1,.5],[0,1]],15*u,H/2-5*u,8*u,10*u);x.fill();
    italic(x,()=>{x.fillStyle=R;x.font=BLK(12*u);x.textAlign="left";x.textBaseline="alphabetic";x.fillText(String(L.f.top).toUpperCase(),44*u+H*.1,H*.5);x.fillStyle=L.ink;const p=fit(x,String(L.f.text).toUpperCase(),BLK,8*u,W-50*u);x.font=BLK(p);x.fillText(String(L.f.text).toUpperCase(),44*u+H*.16,H*.5+p*1.1)})}},
livebadge:{name:"Live badge",cat:"socials",hidden:true,r:.42,w:.26,paper:"#FF2D55",ink:"#FFFFFF",f:{text:"Live"},big:[],rot:-8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,3*u,3*u,W-6*u,H-6*u,7*u),L.paper,3*u);x.fillStyle=L.ink;x.beginPath();x.arc(20*u,H/2,5*u,0,7);x.fill();line(x,()=>x.arc(20*u,H/2,9*u,-.9,.9),L.ink,2*u);line(x,()=>x.arc(20*u,H/2,9*u,PI-.9,PI+.9),L.ink,2*u);T(x,String(L.f.text).toUpperCase(),BLK,18*u,W*.62,H*.53,W*.56)}},
nametag:{name:"Name tag",cat:"socials",r:.66,w:.46,paper:"#E4322B",ink:"#111111",f:{top:"Hello, I'm",text:"Invited"},big:[],rot:-8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,6*u),L.paper,2*u);cut(x,()=>RR(x,6*u,H*.36,W-12*u,H*.52,2*u),"#FFFFFF",0);x.fillStyle="#FFFFFF";S(x,L.f.top,BLK,9*u,W/2,H*.2,.8*u,W*.84);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Kaushan Script"),15*u,W/2,H*.62,W*.8)}},
eyes:{name:"Googly eyes",cat:"socials",r:.72,w:.24,paper:"#FFFFFF",ink:"#111111",f:{},big:[],rot:-6,
  draw(x,W,H,L){const u=W/100;union(x,[()=>x.ellipse(30*u,H/2,24*u,30*u,0,0,7),()=>x.ellipse(70*u,H/2,24*u,30*u,0,0,7)],L.paper,L.ink,4*u);x.fillStyle=L.ink;[[34,0],[74,0]].forEach(([a])=>{x.beginPath();x.ellipse(a*u,H/2+3*u,10*u,12*u,0,0,7);x.fill()});x.fillStyle="#FFFFFF";[[37],[77]].forEach(([a])=>{x.beginPath();x.arc(a*u,H/2-1*u,3*u,0,7);x.fill()})}},
flame:{name:"Flame",cat:"socials",r:1.2,w:.2,paper:"#FF6A1F",ink:"#FFC93C",f:{},big:[],rot:0,
  draw(x,W,H,L){const u=W/100,F1=(s,oy)=>{x.moveTo(50*u,H*(.04+oy));x.bezierCurveTo(70*u,H*(.22+oy),95*u*s+50*u*(1-s),H*.45,90*u*s+50*u*(1-s),H*.68);x.bezierCurveTo(88*u*s+50*u*(1-s),H*.9,70*u,H*.96,50*u,H*.96);x.bezierCurveTo(30*u,H*.96,12*u*s+50*u*(1-s),H*.9,10*u*s+50*u*(1-s),H*.68);x.bezierCurveTo(8*u*s+50*u*(1-s),H*.5,24*u*s+50*u*(1-s),H*.4,32*u*s+50*u*(1-s),H*(.3+oy*.5));x.bezierCurveTo(36*u,H*(.42+oy*.3),44*u,H*(.4+oy*.3),44*u,H*(.3+oy*.2));x.bezierCurveTo(44*u,H*(.2+oy),48*u,H*(.1+oy),50*u,H*(.04+oy));x.closePath()};
    x.save();x.translate(50*u,H*.95);x.scale(.92,.92);x.translate(-50*u,-H*.95);cut(x,()=>F1(1,0),L.paper,4*u);cut(x,()=>{x.save();x.translate(50*u,H*.95);x.scale(.55,.55);x.translate(-50*u,-H*.95);F1(1,.1);x.restore()},L.ink,0);x.restore()}},
eyeglobe:{name:"Globe with eyes",cat:"socials",hidden:true,r:1,w:.26,paper:"#FFFFFF",ink:"#2F55E8",f:{},big:[],rot:6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.arc(46*u,54*u,40*u,0,7),L.paper,3*u);ico(x,"globe",46*u,54*u,38*u,L.ink);union(x,[()=>x.ellipse(58*u,28*u,11*u,14*u,0,0,7),()=>x.ellipse(79*u,28*u,11*u,14*u,0,0,7)],"#FFFFFF","#111",2.4*u);x.fillStyle="#111";[61,82].forEach(a=>{x.beginPath();x.arc(a*u,32*u,5.5*u,0,7);x.fill()})}},
ilove:{name:"I heart my",cat:"socials",hidden:true,r:.5,w:.48,paper:null,ink:"#111111",f:{text:"My friends"},big:[],noShadow:true,rot:-3,
  draw(x,W,H,L){const u=W/100;x.fillStyle=L.ink;x.lineJoin="round";x.font=BLK(22*u);x.textAlign="left";x.textBaseline="middle";x.strokeStyle="#FFFFFF";x.lineWidth=4*u;x.strokeText("I",33*u,H*.3);x.fillText("I",33*u,H*.3);
    cut(x,()=>heart(x,58*u,H*.3,12*u),"#E0313F",2*u);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,15*u,W/2,H*.74,W*.94,{stroke:"#FFFFFF",sw:4*u})}},
followcur:{name:"Follow pill",cat:"socials",hidden:true,r:.4,w:.42,paper:"#FFFFFF",ink:"#111111",f:{text:"Follow"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,13*u,8*u,W-16*u,H-14*u,H),L.paper,2.5*u);line(x,()=>RR(x,16*u,11*u,W-22*u,H-20*u,H),L.ink,1.6*u);x.fillStyle=L.ink;T(x,L.f.text,SANS,12*u,13*u+(W-16*u)/2,8*u+(H-14*u)/2,W*.6);
    const C=()=>poly(x,[[0,0],[0,1],[.28,.74],[.48,1.1],[.62,1.02],[.44,.68],[.8,.66]],3*u,2*u,9*u,12*u);cut(x,C,L.ink,1.4*u)}},
ringtext:{name:"Circle text",cat:"socials",hidden:true,r:1,w:.3,paper:"#FFFFFF",ink:"#111111",f:{text:"Friends & co. \u00b7 Friends & co. \u00b7 "},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,46*u,0,7),L.paper,0);x.fillStyle=L.ink;x.font=ff(400,"Young Serif")(10*u);ring(x,L.f.text,c,c,34*u);x.beginPath();heart(x,c,c+1*u,6*u);x.fill()}},
keynote:{name:"Key caps note",cat:"socials",hidden:true,r:.62,w:.44,paper:"#E9F56B",ink:"#111111",f:{text:"Please like\n& subscribe",code:"LIKE"},big:["text"],rot:6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,7*u),L.paper,0);line(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,7*u),L.ink,1.2*u);x.fillStyle=L.ink;T(x,L.f.text,SANS,10*u,10*u,H*.34,W*.8,{align:"left",lh:1.05,maxH:H*.4});
    [...String(L.f.code).replace(/\s/g,"").toUpperCase()].slice(0,6).forEach((ch,i)=>{const X=10*u+i*13*u,Y=H*.62;line(x,()=>RR(x,X,Y,11*u,11*u,2.4*u),L.ink,1*u);x.fillStyle=L.ink;T(x,ch,SANS,6.4*u,X+5.5*u,Y+5.8*u,9*u)})}},
friendsarch:{name:"Arch badge",cat:"socials",r:.58,w:.46,paper:"#F3A6D8",ink:"#1A1A1A",f:{text:"Best friends"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100,c=W/2,cy=H-12*u,R1=42*u,R2=23*u,Rm=(R1+R2)/2,w=(R1-R2)/2,P=()=>{x.arc(c,cy,R1,PI,0);x.arc(c+Rm,cy,w,0,PI);x.arc(c,cy,R2,0,PI,true);x.arc(c-Rm,cy,w,0,PI);x.closePath()};
    union(x,[P],L.paper,L.ink,1.6*u);x.fillStyle=L.ink;const t=String(L.f.text).toUpperCase(),sp=arcFit(x,t,BLK,9*u,Rm,2.1,.8*u);arcT(x,t,c,cy,Rm,-PI/2,sp,false);[[-1],[1]].forEach(([s])=>ico(x,"star",c+s*Rm*Math.cos(.28),cy-Rm*Math.sin(.28),2.6*u,L.ink))}},
antisocial:{name:"Script oval",cat:"socials",hidden:true,r:.42,w:.5,paper:"#2F55E8",ink:"#FFFFFF",f:{top:"anti-social but",text:"always invited"},big:[],rot:-8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.ellipse(W/2,H/2,W/2-1*u,H/2-1*u,0,0,7),L.paper,0);x.fillStyle=L.ink;T(x,L.f.top,ff(400,"Young Serif"),8*u,W/2,H*.36,W*.7);T(x,L.f.text,ff(400,"Satisfy"),12*u,W/2,H*.62,W*.74)}},
invite:{name:"Invitation",cat:"socials",r:.6,w:.48,paper:"#1E2440",ink:"#F4E3C1",f:{top:"You're",text:"invited",bottom:"Movie night \u00b7 Fri 8 pm"},big:[],rot:4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>notch(x,0,0,W,H,7*u),L.paper,0);x.save();x.setLineDash([1.4*u,1.4*u]);line(x,()=>notch(x,5*u,5*u,W-10*u,H-10*u,5*u),L.ink,.6*u);x.restore();x.fillStyle=L.ink;S(x,L.f.top,SANS,5.4*u,W/2,H*.24,1.6*u,W*.6);
    T(x,L.f.text,ff(400,"Great Vibes"),22*u,W/2,H*.5,W*.8);S(x,L.f.bottom,SANS,4.2*u,W/2,H*.78,.8*u,W*.78);[.24,.76].forEach(a=>sparkle(x,W*a,H*.24,2.4*u,L.ink,.6*u))}},
/* ================= URBAN ================= */
cityclub:{name:"Run club box",cat:"urban",hidden:true,r:.78,w:.36,paper:"#111111",ink:"#FFFFFF",f:{top:"Antwerp run club",title:"ANT"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,4*u),L.paper,2*u);x.fillStyle=L.ink;S(x,L.f.top,SANS,5.6*u,W/2,H*.2,1*u,W*.84);line(x,()=>RR(x,14*u,H*.34,W-28*u,H*.5,2*u),L.ink,2*u);x.fillStyle=L.ink;T(x,L.f.title,BEB,34*u,W/2,H*.6,W*.6)}},
sundown:{name:"Sundown club",cat:"urban",hidden:true,r:.6,w:.48,paper:"#F4F1EA",ink:"#E2552B",f:{top:"Sun down",title:"Social club"},big:[],rot:6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,2*u),L.paper,2*u);x.fillStyle=L.ink;T(x,L.f.top,SER,15*u,W/2,H*.26,W*.84);x.save();x.beginPath();x.rect(0,0,W,H*.78);x.clip();x.beginPath();x.arc(W/2,H*.78,15*u,PI,0);x.fill();x.restore();
    x.fillStyle=L.paper;[0,1,2].forEach(i=>x.fillRect(W*.3,H*(.62+i*.055),W*.4,1.2*u));x.fillStyle=L.ink;T(x,L.f.title,ff(400,"Yellowtail"),11*u,W/2,H*.88,W*.8)}},
slowsunday:{name:"Club circle",cat:"urban",hidden:true,r:1,w:.34,paper:"#F2DD6E",ink:"#1E2F5C",f:{top:"Slow sunday runs",title:"26"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,46*u,0,7),L.paper,2.5*u);x.fillStyle=L.ink;const t=String(L.f.top).toUpperCase(),sp=arcFit(x,t,SANS,8*u,35*u,3.6,1*u);arcT(x,t,c,c,35*u,-PI/2,sp,false);
    x.fillStyle=L.ink;x.beginPath();x.arc(c,c+3*u,18*u,0,7);x.fill();x.fillStyle=L.paper;T(x,L.f.title,BEB,20*u,c,c+4*u,W*.3)}},
triclub:{name:"Triangle",cat:"urban",hidden:true,r:.9,w:.36,paper:"#111111",ink:"#FF6A2B",f:{title:"Run club",bottom:"Amsterdam"},big:[],
  draw(x,W,H,L){const u=W/100,b=2*u;cut(x,()=>poly(x,[[.5,.04],[.97,.96],[.03,.96]],0,0,W,H),L.paper,b);x.fillStyle=L.ink;T(x,String(L.f.title).toUpperCase(),BLK,9*u,W/2,H*.62,W*.5);S(x,"× × ×",SANS,6*u,W/2,H*.45,1*u);S(x,L.f.bottom,SANS,4.6*u,W/2,H*.78,1*u,W*.66)}},
nighttag:{name:"Bold tag",cat:"urban",hidden:true,r:1.3,w:.28,paper:"#FF5A1F",ink:"#111111",f:{title:"Night\nriders"},big:["title"],rot:-8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,8*u),L.paper,2.5*u);x.fillStyle=L.ink;T(x,String(L.f.title).toUpperCase(),BEB,34*u,W/2,H*.62,W*.8,{lh:.9,maxH:H*.62});ico(x,"bolt",W/2,H*.2,11*u,L.ink)}},
schedule:{name:"Timetable",cat:"urban",hidden:true,r:.56,w:.5,paper:"#FFFFFF",ink:"#111111",f:{t1:"12:30",t2:"13:00",t3:"13:30",text:"Lunch run crew"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,5*u),L.paper,0);x.fillStyle=L.ink;["t1","t2","t3"].forEach((k,i)=>{const y=H*(.2+i*.3);x.font=SANS(5.4*u);x.textAlign="left";x.textBaseline="middle";x.fillText(L.f[k],7*u,y);line(x,()=>{x.moveTo(25*u,y);x.lineTo(W-6*u,y)},L.ink+"55",.4*u)});
    cut(x,()=>RR(x,27*u,H*.3,W-34*u,H*.36,2.5*u),"#B8A9F5",0);x.fillStyle=L.ink;T(x,L.f.text,SANS,7*u,27*u+(W-34*u)/2,H*.48,W-42*u)}},
nextstop:{name:"Metro sign",cat:"urban",hidden:true,r:.4,w:.56,paper:"#1E2F5C",ink:"#FFFFFF",f:{top:"Next stop",title:"Weekend"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,3*u),L.paper,2*u);x.fillStyle=L.ink;x.textAlign="left";x.font=SANS(5*u);x.textBaseline="middle";x.fillText(String(L.f.top).toUpperCase(),23*u,H*.3);
    const p=fit(x,L.f.title,SANS,15*u,W*.68);x.font=SANS(p);x.fillText(L.f.title,23*u,H*.6);[["#E0412F",.32],["#F2B33D",.5],["#3FA34D",.68]].forEach(([c,y])=>{x.fillStyle=c;x.beginPath();x.arc(12*u,H*y,4*u,0,7);x.fill()});x.fillStyle=L.ink;x.fillRect(11.4*u,H*.32,1.2*u,H*.36)}},

/* ================= URBAN (wayfinding, city guides, signs) ================= */
wayfind:{name:"Airport sign",cat:"urban",r:1.18,w:.34,paper:"#FFD400",ink:"#111111",f:{title:"B",text:"Gates B1\u2013B12\nBaggage claim\nTaxi & trains",label:"Connecting flights",bottom:"250m"},big:["text"],rot:0,
  draw(x,W,H,L){const u=W/100,P=L.paper,I=L.ink;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,3*u),P,2*u);x.fillStyle=I;x.fillRect(7*u,7*u,22*u,22*u);x.fillStyle=P;T(x,L.f.title,SANS,19*u,18*u,18.5*u,18*u);arrow(x,36*u,18*u,6*u,-PI/2,I,2.2*u);
    x.fillStyle=I;x.font=SANS(4.6*u);x.textAlign="left";x.textBaseline="middle";String(L.f.text).split("\n").slice(0,4).forEach((t,i)=>{const y=10*u+i*6.4*u;x.lineWidth=.6*u;x.strokeStyle=I;x.strokeRect(45*u,y-1.8*u,3.6*u,3.6*u);x.fillText(t,51*u,y)});
    line(x,()=>{x.moveTo(7*u,35*u);x.lineTo(W-7*u,35*u)},I,.6*u);[[22,-PI*.75],[50,0],[78,-PI/4]].forEach(([cx,a])=>{x.fillStyle=I;x.beginPath();x.arc(cx*u,50*u,12*u,0,7);x.fill();arrow(x,cx*u,50*u,6*u,a,P,2.6*u)});
    x.fillStyle=I;x.fillRect(7*u,67*u,W-14*u,11*u);x.fillStyle=P;x.beginPath();x.arc(13.5*u,72.5*u,3.2*u,0,7);x.fill();x.fillStyle=I;T(x,"\u2708",SANS,4*u,13.5*u,72.8*u,5*u);x.fillStyle=P;x.font=SANS(5.4*u);x.textAlign="left";x.textBaseline="middle";x.fillText(L.f.label,20*u,72.8*u);
    x.fillStyle=I;const p=fit(x,L.f.bottom,SANS,22*u,W*.6);x.font=SANS(p);x.textAlign="left";x.fillText(L.f.bottom,7*u,H-17*u);arrow(x,W-17*u,H-17*u,7*u,-PI/4,I,3*u)}},
station:{name:"Station sign",cat:"urban",r:.7,w:.58,paper:"#1A1A1A",ink:"#FFFFFF",f:{title:"Central\nStation",code:"BDFMNQR",text:"Exit on Main Street"},big:["title"],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2.5*u,2.5*u,W-5*u,H-5*u,1*u),L.paper,2.5*u,"#1E4FBF");x.fillStyle=L.ink;x.fillRect(7*u,7*u,W-14*u,.5*u);
    const ls=String(L.f.title).split("\n").slice(0,2),p=fit(x,ls.join("\n"),SANS,10*u,W-16*u);x.font=SANS(p);x.textAlign="left";x.textBaseline="alphabetic";ls.forEach((t,i)=>x.fillText(t,8*u,10*u+p*.9+i*p*.98));
    const cs=[...String(L.f.code).replace(/\s/g,"")].slice(0,8),cy=10*u+p*.9+(ls.length-1)*p*.98+9*u,half=Math.ceil(cs.length/2);cs.forEach((c,i)=>{const cx=13.5*u+i*12*u;x.fillStyle=i<half&&cs.length>3?"#8E8E8E":"#F2F2F2";x.beginPath();x.arc(cx,cy,5.4*u,0,7);x.fill();x.fillStyle="#1A1A1A";T(x,c.toUpperCase(),SANS,6.6*u,cx,cy+.3*u,8*u)});
    x.fillStyle=L.ink;x.fillRect(7*u,H-15*u,W-14*u,.4*u);x.font=SANS(4.6*u);x.textAlign="left";x.textBaseline="middle";const t=String(L.f.text);x.fillText(t,8*u,H-9.5*u,W-16*u)}},
wink:{name:"Wink smiley",cat:"urban",r:1,w:.22,paper:"#F6C443",ink:"#111111",f:{},big:[],rot:-8,
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,45*u,0,7),L.paper,3*u);line(x,()=>x.arc(c,c,40*u,0,7),L.ink,6*u);x.fillStyle=L.ink;x.beginPath();x.ellipse(39*u,40*u,3.6*u,6*u,0,0,7);x.fill();
    line(x,()=>{x.moveTo(57*u,41*u);x.quadraticCurveTo(62*u,35*u,67*u,40*u)},L.ink,4*u);line(x,()=>{x.moveTo(29*u,55*u);x.quadraticCurveTo(46*u,76*u,70*u,52*u)},L.ink,6*u)}},
smile:{name:"Smiley",cat:"urban",r:1,w:.22,paper:"#F5795C",ink:"#D9452E",f:{},big:[],rot:6,
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,45*u,0,7),L.paper,2.5*u);x.fillStyle=L.ink;[[38,38],[62,38]].forEach(([a,b])=>{x.beginPath();x.ellipse(a*u,b*u,3.4*u,7*u,0,0,7);x.fill()});line(x,()=>x.arc(c,c+2*u,27*u,.2*PI,.8*PI),L.ink,4*u);line(x,()=>{x.moveTo(21*u,58*u);x.lineTo(26*u,54*u);x.moveTo(79*u,58*u);x.lineTo(74*u,54*u)},L.ink,3*u)}},
highlight:{name:"Highlight label",cat:"urban",r:.42,w:.52,paper:"#B9C6F5",ink:"#111111",f:{top:"Antwerp",title:"with",text:"you"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100,pd=3.6*u,t1=String(L.f.top).toUpperCase(),t2=String(L.f.title).toUpperCase(),t3=String(L.f.text).toUpperCase();let p=17*u;const m=q=>{x.font=SANS(q);return Math.max(x.measureText(t1).width+pd*2,x.measureText(t2).width+x.measureText(t3).width+pd*4.4)};while(m(p)>W-4*u&&p>3)p*=.95;p=Math.min(p,(H-5.2*u)/2.64);
    const rh=p*1.32,y1=H/2-rh-1.6*u,y2=H/2+1.6*u,X=2*u;x.font=SANS(p);x.textAlign="left";x.textBaseline="middle";const w1=x.measureText(t1).width+pd*2,w2=x.measureText(t2).width+pd*2,w3=x.measureText(t3).width+pd*2;
    cut(x,()=>RR(x,X,y1,w1,rh,1.6*u),L.paper,0);x.fillStyle=L.ink;x.fillText(t1,X+pd,y1+rh*.53);cut(x,()=>RR(x,X+w2*.5,y2,w2*.5+w3+pd*.4,rh,rh/2),L.paper,0);cut(x,()=>RR(x,X,y2,w2,rh,rh/2),L.ink,0);
    x.fillStyle=L.paper;x.fillText(t2,X+pd,y2+rh*.53);x.fillStyle=L.ink;x.fillText(t3,X+w2+pd*.6,y2+rh*.53)}},
cityguide:{name:"City guide",cat:"urban",r:1.32,w:.34,paper:"#2FA35A",ink:"#FFFFFF",f:{top:"Weekend guide",title:"Berlin"},big:[],rot:-5,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,1.2*u),L.paper,0);x.save();clip(x,()=>RR(x,0,0,W,H,1.2*u));x.fillStyle=L.ink;x.font=SANS(3.6*u);x.textAlign="left";x.textBaseline="middle";x.fillText(String(L.f.top).toUpperCase(),6*u,7*u);x.textAlign="right";x.fillText("No. 01",W-6*u,7*u);
    const nm=String(L.f.title);let ls=[nm,nm,nm],font=BLK;x.font=font(40*u);let p=Math.min(40*u,40*u*(W-10*u)/x.measureText(nm).width);
    if(p<20*u&&nm.length>4){const h2=Math.ceil(nm.length/2),a=nm.slice(0,h2),b=nm.slice(h2);ls=[a,b,a,b,a];x.font=font(40*u);p=Math.min(36*u,40*u*(W-10*u)/Math.max(x.measureText(a).width,x.measureText(b).width))}
    if(ls.length===3){const n=Math.max(3,Math.floor((H-30*u)/(p*.9)));ls=Array(n).fill(nm)}p=Math.min(p,(H-30*u)/(ls.length*.9));x.font=font(p);x.textAlign="left";x.textBaseline="alphabetic";ls.forEach((t,i)=>x.fillText(t,4*u,14*u+p*.78+i*p*.9));
    x.fillStyle="#FFFFFF";x.fillRect(6*u,H-16*u,18*u,11*u);x.fillStyle="#111";const r=rnd(5);let a=7.5*u;while(a<22.5*u){const w=(r()<.5?.5:1.1)*u;x.fillRect(a,H-14.5*u,w,7*u);a+=w+.6*u}x.restore()}},
ridemore:{name:"Bike badge",cat:"urban",r:1.1,w:.32,paper:"#F2E9D2",ink:"#15343A",f:{top:"Ride more",bottom:"Drive less"},big:[],
  draw(x,W,H,L){const u=W/100,b=2.5*u,G="#3FA36B";cut(x,()=>RR(x,b,b,W-2*b,H-2*b,6*u),L.ink,b);x.save();clip(x,()=>RR(x,b+3*u,b+3*u,W-2*b-6*u,H-2*b-6*u,4*u));x.fillStyle=L.paper;x.fillRect(0,H*.27,W,H*.46);x.fillStyle=G;x.fillRect(0,H*.73,W,H);x.restore();
    x.fillStyle=L.paper;T(x,String(L.f.top).toUpperCase(),ff(400,"Anton"),15*u,W/2,H*.16,W*.8);x.fillStyle=L.paper;T(x,String(L.f.bottom).toUpperCase(),ff(400,"Anton"),15*u,W/2,H*.85,W*.8);
    const y=H*.58,lw=2.6*u;line(x,()=>{x.moveTo(42*u,y);x.arc(28*u,y,14*u,0,7);x.moveTo(86*u,y);x.arc(72*u,y,14*u,0,7)},L.ink,lw);
    line(x,()=>{x.moveTo(28*u,y);x.lineTo(48*u,y);x.lineTo(40*u,y-20*u);x.closePath();x.moveTo(48*u,y);x.lineTo(66*u,y-19*u);x.lineTo(40*u,y-19*u);x.moveTo(66*u,y-19*u);x.lineTo(72*u,y);x.moveTo(66*u,y-19*u);x.lineTo(62*u,y-25*u);x.lineTo(70*u,y-26*u);x.moveTo(35*u,y-22*u);x.lineTo(45*u,y-22*u)},L.ink,lw);
    [[16,H/u*.33],[86,H/u*.35],[12,H/u*.45],[90,H/u*.47]].forEach(([a,c],i)=>ico(x,"star",a*u,c*u,(i%2?1.6:2.2)*u,L.ink))}},
raffle:{name:"Raffle ticket",cat:"urban",r:.58,w:.5,paper:"#E8D9BE",ink:"#C9302C",f:{text:"good\nthings\nare\ncoming",code:"48645235"},big:["text"],rot:-4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.rect(0,0,W,H),L.paper,0);x.save();x.globalCompositeOperation="destination-out";for(let i=0;i<=12;i++){x.beginPath();x.arc(0,i*H/12,1.6*u,0,7);x.arc(W,i*H/12,1.6*u,0,7);x.fill()}x.restore();
    x.save();x.globalAlpha=.08;const r=rnd(3);for(let i=0;i<220;i++){x.fillStyle=r()<.5?"#000":"#fff";x.fillRect(r()*W,r()*H,.6*u,.6*u)}x.restore();
    line(x,()=>{x.rect(5*u,6*u,W-10*u,H-12*u);x.moveTo(20*u,6*u);x.lineTo(20*u,H-6*u);x.moveTo(W-20*u,6*u);x.lineTo(W-20*u,H-6*u)},L.ink,1*u);
    x.fillStyle=L.ink;[[12.5*u,-PI/2],[W-12.5*u,PI/2]].forEach(([cx,a])=>{x.save();x.translate(cx,H/2);x.rotate(a);T(x,L.f.code,SANS,6.6*u,0,0,H*.74);x.restore()});
    x.fillStyle="#1A1A1A";const ls=String(L.f.text).split("\n"),p=fit(x,ls.join("\n"),SANS,10*u,W-48*u);let pp=Math.min(p,(H-20*u)/(ls.length*1.05));x.font=SANS(pp);x.textAlign="left";x.textBaseline="middle";ls.forEach((t,i)=>x.fillText(t,27*u,H/2+(i-(ls.length-1)/2)*pp*1.05))}},
globe:{name:"Globe badge",cat:"urban",r:1,w:.3,paper:"#F26B2E",ink:"#1A1A1A",f:{text:"Weekend lover"},big:[],rot:10,
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,45*u,0,7),L.paper,2.5*u);x.fillStyle=L.ink;const t=String(L.f.text).toUpperCase(),sp=arcFit(x,t,BLK,9*u,33*u,2.6,1*u);arcT(x,t,c,c,33*u,-PI*.62,sp,false);
    x.fillStyle="#FFFFFF";x.beginPath();x.arc(c,c+8*u,17*u,0,7);x.fill();ico(x,"globe",c,c+8*u,16*u,L.ink);x.save();x.setLineDash([2*u,2*u]);line(x,()=>x.arc(c,c+8*u,24*u,PI*.95,PI*1.7),L.ink,1*u);x.restore();arrow(x,c+12*u,c-14*u,3*u,.4,L.ink,1*u)}},
iheart:{name:"I heart",cat:"urban",r:.92,w:.26,paper:"#FFFFFF",ink:"#111111",f:{text:"BXL"},big:[],rot:-4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,6*u),L.paper,2*u);const y=ff(400,"Young Serif");x.fillStyle=L.ink;x.font=y(38*u);x.textAlign="center";x.textBaseline="alphabetic";x.fillText("I",28*u,H*.47);x.fillStyle="#E0313F";x.beginPath();heart(x,64*u,H*.32,17*u);x.fill();
    x.fillStyle=L.ink;const p=fit(x,L.f.text,y,38*u,W-14*u);x.font=y(p);x.fillText(L.f.text,W/2,H*.88)}},
starbadge:{name:"Star badge",cat:"urban",r:1,w:.28,paper:"#111111",ink:"#FFFFFF",f:{text:"City lights \u00b7 late nights \u00b7 "},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,45*u,0,7),L.paper,2.5*u);line(x,()=>x.arc(c,c,29*u,0,7),L.ink,.6*u);x.fillStyle=L.ink;x.font=SANS(6*u);ring(x,String(L.f.text).toUpperCase(),c,c,36.5*u);x.beginPath();burst(x,c,c,18*u,5*u,8);x.fill()}},
plate:{name:"License plate",cat:"urban",r:.5,w:.5,paper:"#F4EEDC",ink:"#1E2F5C",f:{top:"Belgium",text:"I \u2665 BXL",bottom:"Capital of Europe"},big:[],rot:-6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,1*u,1*u,W-2*u,H-2*u,5*u),L.paper,0);line(x,()=>RR(x,3.5*u,3.5*u,W-7*u,H-7*u,3.5*u),L.ink,1.2*u);x.fillStyle="#9A9A9A";[[12,9],[W/u-12,9],[12,H/u-9],[W/u-12,H/u-9]].forEach(([a,b])=>{x.beginPath();x.arc(a*u,b*u,1.4*u,0,7);x.fill()});
    x.fillStyle=L.ink;S(x,L.f.top,SANS,5*u,W/2,H*.2,1.6*u,W*.6);x.fillStyle="#C8323F";heartIn(x,L.f.text,BLK,20*u,W/2,H*.54,W*.82,"#C8323F");x.fillStyle=L.ink;x.font=ff(400,"Satisfy")(6*u);x.textAlign="center";x.fillText(L.f.bottom,W/2,H*.82)}},

/* ================= PACKAGING ================= */
smallbatch:{name:"Wordmark",cat:"pack",r:.26,w:.56,paper:"#2B4FC7",ink:"#FFFFFF",f:{text:"Small Batch"},big:[],rot:-6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.rect(0,0,W,H),L.paper,0);x.fillStyle=L.ink;T(x,L.f.text,ff(700,"Fredoka"),15*u,W/2,H/2,W*.84)}},
local:{name:"Wavy seal",cat:"pack",r:1,w:.32,paper:"#CFE3B8",ink:"#1F4D3A",f:{title:"100%",text:"Local"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>wavy(x,c,c,44*u,3.2*u,12),L.paper,2.5*u);line(x,()=>wavy(x,c,c,37*u,2.6*u,12),L.ink,.8*u);x.fillStyle=L.ink;T(x,L.f.title,YS,19*u,c,c-8*u,W*.6);T(x,String(L.f.text).toUpperCase(),BLK,12*u,c,c+11*u,W*.56)}},
freshlabel:{name:"Zigzag label",cat:"pack",r:.58,w:.48,paper:"#B9D86A",ink:"#1F4D3A",f:{top:"Product",title:"fresh"},big:[],rot:-8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>burst(x,W/2,H/2,W*.48,W*.42,18,H/W),L.paper,0);x.fillStyle=L.ink;S(x,L.f.top,SANS,4.4*u,W/2,H*.32,1*u,W*.5);T(x,L.f.title,ff(800,"Sansita Swashed"),18*u,W/2,H*.58,W*.66)}},
dome:{name:"Dome label",cat:"pack",r:.66,w:.44,paper:"#1F5A3D",ink:"#F3EBD9",f:{top:"Market",title:"Original",bottom:"Since 2026"},big:[],
  draw(x,W,H,L){const u=W/100,P=()=>{x.moveTo(1*u,H-1*u);x.lineTo(1*u,W/2);x.arc(W/2,W/2,W/2-1*u,PI,0);x.lineTo(W-1*u,H-1*u);x.closePath()};cut(x,()=>arch(x,1*u,1*u,W-2*u,H-2*u,3*u),L.paper,0);x.fillStyle=L.ink;S(x,L.f.top,SANS,4.6*u,W/2,H*.3,1.4*u,W*.6);T(x,String(L.f.title).toUpperCase(),YS,15*u,W/2,H*.56,W*.84);
    line(x,()=>{x.moveTo(W*.2,H*.72);x.lineTo(W*.8,H*.72)},L.ink,.5*u);S(x,L.f.bottom,SANS,4*u,W/2,H*.82,1*u,W*.7)}},
recipes:{name:"Bordered pill",cat:"pack",r:.3,w:.56,paper:"#F3EBD9",ink:"#1F4D3A",f:{top:"Ideas & recipes",text:"@yourshop"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,H/2),L.paper,0);line(x,()=>RR(x,3*u,3*u,W-6*u,H-6*u,H/2),L.ink,.7*u);x.fillStyle=L.ink;T(x,String(L.f.top).toUpperCase(),BLK,7.6*u,W/2,H*.4,W*.76);T(x,L.f.text,SANS,5*u,W/2,H*.68,W*.7)}},
visitshop:{name:"Shop stamp",cat:"pack",r:1,w:.3,paper:"#E9D9BF",ink:"#D2462E",f:{top:"Visit",text:"our shop"},big:[],rot:-5,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.rect(0,0,W,H),L.paper,0);line(x,()=>x.rect(6*u,6*u,W-12*u,H-12*u),L.ink,2.6*u);line(x,()=>x.rect(11*u,11*u,W-22*u,H-22*u),L.ink,.8*u);x.fillStyle=L.ink;T(x,String(L.f.top).toUpperCase(),BLK,15*u,W/2,H*.36,W*.66);T(x,L.f.text,ff(400,"Kaushan Script"),14*u,W/2,H*.62,W*.66)}},
handmade:{name:"Handmade",cat:"pack",r:1,w:.3,paper:"#D2462E",ink:"#F1E2CA",f:{top:"Hand",text:"Crafted\ngoods"},big:["text"],rot:4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,1*u,1*u,W-2*u,H-2*u,2*u),L.paper,0);x.fillStyle=L.ink;T(x,L.f.top,ff(400,"Kaushan Script"),22*u,W/2,H*.3,W*.7);T(x,String(L.f.text).toUpperCase(),BEB,17*u,W/2,H*.67,W*.72,{lh:.92,maxH:H*.42})}},
popup:{name:"Pop-up shop",cat:"pack",r:.5,w:.56,paper:null,ink:"#D2462E",f:{text:"Pop-up shop",bottom:"This weekend"},big:[],noShadow:true,rot:-4,
  draw(x,W,H,L){const u=W/100;x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Pacifico"),18*u,W/2,H*.4,W*.92,{stroke:"#FFFFFF",sw:2.6*u});[.73,.79].forEach(y=>line(x,()=>{x.moveTo(W*.1,H*y);x.lineTo(W*.52,H*y)},L.ink,1.1*u));x.fillStyle=L.ink;S(x,L.f.bottom,SANS,5*u,W*.74,H*.76,.8*u,W*.4)}},

/* ================= LOVE ================= */
xoxo:{name:"Heart",cat:"love",r:.92,w:.32,paper:"#E0313F",ink:"#FFFFFF",f:{text:"xoxo"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>heart(x,W/2,H*.52,38*u),L.paper,3*u);x.save();x.translate(W/2,H*.46);x.rotate(-.12);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Pacifico"),17*u,0,0,W*.56);x.restore()}},
bemine:{name:"Candy heart",cat:"love",r:.92,w:.28,paper:"#F7B6C8",ink:"#D2335C",f:{text:"BE\nMINE"},big:["text"],rot:10,
  draw(x,W,H,L){const u=W/100;cut(x,()=>heart(x,W/2,H*.52,40*u),L.paper,0);x.save();clip(x,()=>heart(x,W/2,H*.52,40*u));const g=x.createRadialGradient(W*.35,H*.3,2*u,W/2,H/2,W*.6);g.addColorStop(0,"rgba(255,255,255,.45)");g.addColorStop(1,"rgba(0,0,0,.12)");x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();
    x.fillStyle=L.ink;x.globalAlpha=.9;T(x,String(L.f.text).toUpperCase(),ff(400,"Bowlby One"),12*u,W/2,H*.55,W*.46,{lh:.95,maxH:H*.34});x.globalAlpha=1}},
loveletter:{name:"Love letter",cat:"love",r:.66,w:.46,paper:"#F6EFE6",ink:"#C8323F",f:{text:"Love you more"},big:[],rot:-6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,1*u,1*u,W-2*u,H-2*u,2*u),L.paper,0);line(x,()=>{x.moveTo(2*u,2*u);x.lineTo(W/2,H*.56);x.lineTo(W-2*u,2*u)},"rgba(0,0,0,.18)",.8*u);line(x,()=>{x.moveTo(2*u,H-2*u);x.lineTo(W*.4,H*.5);x.moveTo(W-2*u,H-2*u);x.lineTo(W*.6,H*.5)},"rgba(0,0,0,.1)",.6*u);
    cut(x,()=>x.arc(W/2,H*.54,9*u,0,7),L.ink,0);x.fillStyle=L.paper;x.beginPath();heart(x,W/2,H*.545,4.6*u);x.fill();x.fillStyle=L.ink;T(x,L.f.text,CAV,9*u,W/2,H*.86,W*.8)}},
mine:{name:"Love pill",cat:"love",r:.34,w:.44,paper:"#F3A6C8",ink:"#C8323F",f:{text:"all mine"},big:[],rot:-6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,H),L.paper,2*u);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Satisfy"),17*u,W*.46,H*.52,W*.62);x.beginPath();heart(x,W*.84,H*.48,4*u);x.fill()}},
sentlove:{name:"Love stamp",cat:"love",r:1.22,w:.3,paper:"#F7D9DE",ink:"#C8323F",f:{top:"Sent with",text:"love"},big:[],
  draw(x,W,H,L){const u=W/100;x.fillStyle=L.paper;x.fillRect(0,0,W,H);scallop(x,0,0,W,H,2.6*u);line(x,()=>x.rect(7*u,7*u,W-14*u,H-14*u),L.ink,.6*u);x.fillStyle=L.ink;x.beginPath();heart(x,W/2,H*.38,22*u);x.fill();x.fillStyle=L.ink;S(x,L.f.top,SANS,5.4*u,W/2,H*.68,1*u,W*.7);T(x,L.f.text,ff(400,"Great Vibes"),20*u,W/2,H*.82,W*.72)}},

hellodear:{name:"Heart note",cat:"love",r:.88,w:.42,paper:"#F7B8D2",ink:"#E0412F",f:{title:"Hello",text:"my dear"},big:[],rot:8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>heart(x,W/2,H*.5,40*u),L.paper,0);line(x,()=>heart(x,W/2,H*.5,35*u),L.ink,.8*u);x.save();x.translate(W/2,H*.46);x.rotate(-.1);x.fillStyle=L.ink;T(x,String(L.f.title).toUpperCase(),BLK,12.5*u,0,0,W*.54);T(x,String(L.f.text).toUpperCase(),BLK,6.4*u,1*u,10*u,W*.4);x.restore()}},
tulip:{name:"Tulip",cat:"love",r:1.05,w:.28,paper:"#F7C4B0",ink:"#E0412F",f:{},big:[],rot:-4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>{x.moveTo(50*u,4*u);x.bezierCurveTo(85*u,2*u,98*u,30*u,95*u,58*u);x.bezierCurveTo(92*u,90*u,62*u,H-2*u,42*u,H-3*u);x.bezierCurveTo(12*u,H-6*u,2*u,70*u,4*u,46*u);x.bezierCurveTo(6*u,18*u,24*u,5*u,50*u,4*u);x.closePath()},L.paper,0);
    const pk="#EE6FA8";x.fillStyle=pk;x.beginPath();x.moveTo(50*u,90*u);x.bezierCurveTo(30*u,92*u,12*u,84*u,14*u,72*u);x.bezierCurveTo(18*u,60*u,40*u,62*u,50*u,90*u);x.fill();x.beginPath();x.moveTo(52*u,90*u);x.bezierCurveTo(60*u,62*u,84*u,56*u,86*u,70*u);x.bezierCurveTo(88*u,84*u,70*u,92*u,52*u,90*u);x.fill();
    line(x,()=>{x.moveTo(51*u,50*u);x.lineTo(51*u,90*u)},pk,3*u);x.fillStyle=L.ink;x.beginPath();x.moveTo(30*u,22*u);x.lineTo(40*u,30*u);x.lineTo(50*u,16*u);x.lineTo(60*u,30*u);x.lineTo(70*u,22*u);x.bezierCurveTo(74*u,42*u,66*u,54*u,51*u,54*u);x.bezierCurveTo(36*u,54*u,27*u,42*u,30*u,22*u);x.fill()}},
selflove:{name:"Lilac oval",cat:"love",r:.52,w:.48,paper:"#C9A3CF",ink:"#8E1730",f:{title:"Self love",text:"is in"},big:[],rot:6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.ellipse(W/2,H/2,W/2-1*u,H/2-1*u,0,0,7),L.paper,0);x.fillStyle=L.ink;T(x,String(L.f.title).toUpperCase(),BLK,13*u,W/2,H*.42,W*.76);T(x,String(L.f.text).toUpperCase(),BLK,7*u,W/2,H*.68,W*.5)}},
loveair:{name:"Love circle",cat:"love",r:1,w:.36,paper:"#E8452E",ink:"#F7C4B0",f:{text:"Love is in the air \u00b7 Love is in the air \u00b7 "},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,48*u,0,7),L.paper,0);x.fillStyle=L.ink;x.font=SANS(8*u);ring(x,String(L.f.text).toUpperCase(),c,c,39*u);x.beginPath();heart(x,c,c+1*u,20*u);x.fill()}},
cute:{name:"Bubble word",cat:"love",r:.5,w:.42,paper:"#F7C4B0",ink:"#E0412F",f:{text:"Cute"},big:[],noShadow:false,rot:-6,
  draw(x,W,H,L){const u=W/100;x.fillStyle=L.ink;x.lineJoin="round";const f=ff(400,"Bagel Fat One"),t=String(L.f.text).toUpperCase(),p=fit(x,t,f,40*u,W*.8);x.font=f(p);x.textAlign="center";x.textBaseline="middle";x.strokeStyle=L.paper;x.lineWidth=p*.42;x.strokeText(t,W/2,H*.54);x.fillStyle=L.ink;x.fillText(t,W/2,H*.54)}},
sparkle4:{name:"Sparkle",cat:"love",r:1,w:.2,paper:"#F7C4B0",ink:"#F7C4B0",f:{},big:[],noInk:true,rot:0,
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>{x.moveTo(c,2*u);x.quadraticCurveTo(c+6*u,c-6*u,W-2*u,c);x.quadraticCurveTo(c+6*u,c+6*u,c,H-2*u);x.quadraticCurveTo(c-6*u,c+6*u,2*u,c);x.quadraticCurveTo(c-6*u,c-6*u,c,2*u);x.closePath()},L.paper,0)}},
cherries:{name:"Cherries & bow",cat:"love",r:1.18,w:.3,paper:"#F6C9D2",ink:"#C4161C",f:{},big:[],rot:0,
  draw(x,W,H,L){const u=W/100,I=L.ink;cut(x,()=>RR(x,3*u,3*u,W-6*u,H-6*u,22*u),L.paper,0);const lw=1.4*u;
    line(x,()=>{x.moveTo(50*u,24*u);x.bezierCurveTo(28*u,8*u,14*u,14*u,18*u,26*u);x.bezierCurveTo(22*u,36*u,40*u,30*u,50*u,24*u);x.moveTo(50*u,24*u);x.bezierCurveTo(72*u,8*u,86*u,14*u,82*u,26*u);x.bezierCurveTo(78*u,36*u,60*u,30*u,50*u,24*u);
      x.moveTo(47*u,26*u);x.bezierCurveTo(40*u,40*u,30*u,44*u,24*u,52*u);x.moveTo(53*u,26*u);x.bezierCurveTo(60*u,40*u,70*u,42*u,78*u,50*u);x.moveTo(49*u,26*u);x.quadraticCurveTo(40*u,50*u,30*u,76*u);x.moveTo(51*u,26*u);x.quadraticCurveTo(62*u,52*u,70*u,74*u)},I,lw);
    x.fillStyle=L.paper;x.beginPath();x.arc(50*u,24*u,4*u,0,7);x.fill();line(x,()=>x.arc(50*u,24*u,4*u,0,7),I,lw);
    [[29,94],[71,92]].forEach(([a,b])=>{x.fillStyle=I;x.beginPath();x.moveTo(a*u,(b-17)*u);x.bezierCurveTo((a+27)*u,(b-26)*u,(a+28)*u,(b+18)*u,a*u,(b+18)*u);x.bezierCurveTo((a-28)*u,(b+18)*u,(a-27)*u,(b-26)*u,a*u,(b-17)*u);x.fill();
      x.fillStyle="rgba(255,255,255,.75)";x.beginPath();x.ellipse((a-9)*u,(b-6)*u,5*u,2.4*u,-.5,0,7);x.fill()})}},
xoxooval:{name:"XOXO oval",cat:"love",r:.48,w:.46,paper:"#F2A9C4",ink:"#C4161C",f:{text:"XOXO",top:"Hugs and kisses"},big:[],rot:-4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>x.ellipse(W/2,H/2,W/2-1*u,H/2-1*u,0,0,7),L.paper,0);line(x,()=>x.ellipse(W/2,H/2,W/2-4*u,H/2-4*u,0,0,7),L.ink,.6*u);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),ff(400,"Rye"),17*u,W/2,H*.53,W*.6);
    S(x,L.f.top,ff(400,"Young Serif"),3.6*u,W/2,H*.18,.5*u,W*.5);S(x,L.f.top,ff(400,"Young Serif"),3.6*u,W/2,H*.84,.5*u,W*.5);[[11,1],[89,1]].forEach(([a])=>{x.beginPath();heart(x,a*u,H/2,2.6*u);x.fill()})}},
/* ================= PRIDE ================= */
rbheart:{name:"Rainbow heart",cat:"pride",r:.92,w:.3,paper:null,ink:"#FFFFFF",f:{},big:[],noInk:true,
  draw(x,W,H,L){const u=W/100;cut(x,()=>heart(x,W/2,H*.52,38*u),null,3*u);x.save();clip(x,()=>heart(x,W/2,H*.52,38*u));RB.forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,H*.17+i*H*.75/6,W,H*.75/6+1)});x.restore()}},
loveislove:{name:"Rainbow pill",cat:"pride",r:.3,w:.56,paper:"#FFFFFF",ink:"#111111",f:{text:"Love is love"},big:[],
  draw(x,W,H,L){const u=W/100;x.save();clip(x,()=>RR(x,0,0,W,H,H/2));RB.forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,i*H/6,W,H/6+1)});x.restore();cut(x,()=>RR(x,5*u,5*u,W-10*u,H-10*u,H/2),L.paper,0);x.fillStyle=L.ink;T(x,L.f.text,BLK,10*u,W/2,H/2,W*.76)}},
beyou:{name:"Rainbow arc",cat:"pride",r:.74,w:.44,paper:"#FFFFFF",ink:"#111111",f:{text:"Be you"},big:[],
  draw(x,W,H,L){const u=W/100,cx=W/2,cy=H*.68;cut(x,()=>{x.moveTo(3*u,cy);x.arc(cx,cy,cx-3*u,PI,0);x.closePath()},null,3*u);RB.forEach((c,i)=>{const R=cx-3*u-i*6.4*u;x.beginPath();x.moveTo(cx-R,cy);x.arc(cx,cy,R,PI,0);x.closePath();x.fillStyle=c;x.fill()});
    cut(x,()=>RR(x,W*.18,H*.62,W*.64,H*.32,H*.16),L.paper,0);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Shrikhand"),13*u,W/2,H*.78,W*.56)}},
proud:{name:"Pride circle",cat:"pride",r:1,w:.32,paper:"#FFFFFF",ink:"#111111",f:{text:"Proud"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,46*u,0,7),null,3*u);RB.forEach((col,i)=>{x.beginPath();x.moveTo(c,c);x.arc(c,c,46*u,-PI/2+i*PI/3,-PI/2+(i+1)*PI/3);x.closePath();x.fillStyle=col;x.fill()});cut(x,()=>x.arc(c,c,30*u,0,7),L.paper,0);x.fillStyle=L.ink;T(x,L.f.text,ff(400,"Shrikhand"),15*u,c,c,W*.5)}},
prideflag:{name:"Flag",cat:"pride",r:.72,w:.42,paper:null,ink:"#FFFFFF",f:{text:"Pride"},big:[],rot:-6,
  draw(x,W,H,L){const u=W/100,X=12*u,Y=8*u,FW=W-16*u,FH=H*.62,wv=(t)=>Math.sin(t*PI*2)*3*u,P=()=>{x.moveTo(X,Y+wv(0));for(let i=1;i<=30;i++)x.lineTo(X+i/30*FW,Y+wv(i/30));for(let i=30;i>=0;i--)x.lineTo(X+i/30*FW,Y+FH+wv(i/30));x.closePath()};
    cut(x,()=>{P();RR(x,4*u,4*u,5*u,H-8*u,2.5*u)},null,2.5*u);x.fillStyle="#6B4A2E";x.beginPath();RR(x,4*u,4*u,5*u,H-8*u,2.5*u);x.fill();x.save();clip(x,P);RB.forEach((c,i)=>{x.fillStyle=c;x.beginPath();for(let k=0;k<=30;k++)x.lineTo(X+k/30*FW,Y+i*FH/6+wv(k/30));for(let k=30;k>=0;k--)x.lineTo(X+k/30*FW,Y+(i+1)*FH/6+wv(k/30)+1);x.fill()});x.restore();
    x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,13*u,X+FW/2,Y+FH/2,FW*.8,{stroke:"#111",sw:2.6*u})}},

/* ================= KUDOS ================= */
yougot:{name:"Wavy cheer",cat:"kudos",r:1,w:.32,paper:"#F6D44A",ink:"#1E2F5C",f:{text:"You got\nthis!"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>wavy(x,c,c,42*u,3*u,10),L.paper,3.5*u);line(x,()=>wavy(x,c,c,42*u,3*u,10),L.ink,1.6*u);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,11*u,c,c,W*.62,{lh:1,maxH:H*.5})}},
welldone:{name:"Rosette",cat:"kudos",r:1.26,w:.28,paper:"#E0412F",ink:"#FFFFFF",f:{text:"Well\ndone"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;[[-1,"#1E2F5C"],[1,"#1E2F5C"]].forEach(([s,col])=>cut(x,()=>poly(x,[[.5+s*.04,.5],[.5+s*.3,.98],[.5+s*.19,.9],[.5+s*.08,.98],[.5-s*.08,.5]],0,0,W,H),col,2.5*u));
    cut(x,()=>burst(x,c,c*1.02,46*u,40*u,20),L.paper,2.5*u);line(x,()=>x.arc(c,c*1.02,32*u,0,7),L.ink,.8*u);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,12*u,c,c*1.02,W*.5,{lh:1,maxH:W*.44})}},
keepitup:{name:"Ribbon banner",cat:"kudos",r:.34,w:.58,paper:"#7FB6E0",ink:"#1E2F5C",f:{text:"Keep it up"},big:[],
  draw(x,W,H,L){const u=W/100,dk="#4F86B5";[0,1].forEach(s=>cut(x,()=>poly(x,s?[[1,.32],[.8,.32],[.8,.96],[1,.96],[.94,.64]]:[[0,.32],[.2,.32],[.2,.96],[0,.96],[.06,.64]],0,0,W,H),dk,2*u));
    cut(x,()=>RR(x,W*.1,H*.06,W*.8,H*.7,1*u),L.paper,2*u);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,11*u,W/2,H*.41,W*.7)}},
goalmet:{name:"Target",cat:"kudos",r:.5,w:.44,paper:"#BFE3C8",ink:"#1E2F5C",f:{text:"Goal met!"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,8*u),L.paper,2.5*u);line(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,8*u),L.ink,1.2*u);const cx=W*.22,cy=H/2;[14,9.5,5].forEach((r,i)=>{x.beginPath();x.arc(cx,cy,r*u,0,7);x.fillStyle=i%2?L.paper:"#E0412F";x.fill()});
    line(x,()=>{x.moveTo(cx,cy);x.lineTo(cx+12*u,cy-12*u)},L.ink,1.4*u);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),BLK,10*u,W*.66,H/2,W*.48)}}
};
for(const k in P){const d=P[k];if(d.cat==="socials"&&!d.hidden&&!d.clean&&d.paper!==null){const o=d.draw;let seed=[...k].reduce((a,c)=>a+c.charCodeAt(0),1);d.draw=function(x,W,H,L){o.call(this,x,W,H,L);paperFx(x,W,H,seed)}}}
return P;};
