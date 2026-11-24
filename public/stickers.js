/* Studio Typo – Story Builder sticker pack (categories). Original designs, drawn on canvas.
   Every sticker: {name,cat,r (h/w),w (share of story width),paper,ink,f (editable text),big,draw(x,W,H,L)} */
window.STK_CATS=[["xmas","Christmas"],["winter","Winter sport"],["outdoor","Outdoor"],["morning","Morning"],["weather","Weather"],["socials","Socials"],["urban","Urban"],["pack","Packaging"],["love","Love"],["pride","Pride"],["kudos","Kudos"],["travel","Travel & paper"]];
window.STK_PACK_FONTS=[["Archivo Black",400],["Pacifico",400],["Yellowtail",400],["Satisfy",400],["Kaushan Script",400],["Shrikhand",400],["Fraunces",900],["Young Serif",400],["Rye",400],["Abril Fatface",400],["Bowlby One",400],["Fredoka",700],["Luckiest Guy",400],["Gochi Hand",400],["Sansita Swashed",800],["Sacramento",400],["Lilita One",400]];
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
const ff=(w,f)=>p=>F(w,p,f);
const BLK=ff(400,"Archivo Black"),SANS=ff(700,"DM Sans"),SER=ff(400,"DM Serif Display"),YS=ff(400,"Young Serif"),BEB=ff(400,"Bebas Neue"),FRA=ff(900,"Fraunces"),CAV=ff(700,"Caveat");

return {
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
linkbio:{name:"Speech bubble",cat:"socials",r:.6,w:.44,paper:"#FFFFFF",ink:"#111111",f:{text:"Link in bio"},big:[],
  draw(x,W,H,L){const u=W/100,P=()=>{RR(x,3*u,3*u,W-6*u,H*.72,10*u);x.moveTo(W*.36,H*.72);x.lineTo(W*.16,H-3*u);x.lineTo(W*.22,H*.72)};line(x,P,L.ink,3.2*u);cut(x,P,L.paper,0);x.fillStyle=L.ink;T(x,L.f.text,BLK,11*u,W/2,3*u+H*.36,W*.8)}},
likes:{name:"Like count",cat:"socials",r:.5,w:.34,paper:"#FF3040",ink:"#FFFFFF",f:{text:"1.2K"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>{RR(x,2*u,2*u,W-4*u,H*.74,10*u);x.moveTo(W*.42,H*.74);x.lineTo(W*.5,H-3*u);x.lineTo(W*.58,H*.74)},L.paper,0);x.fillStyle=L.ink;x.beginPath();heart(x,W*.27,2*u+H*.36,9*u);x.fill();T(x,L.f.text,ff(700,"DM Sans"),20*u,W*.62,2*u+H*.37,W*.5)}},
follow:{name:"Follow button",cat:"socials",r:.3,w:.4,paper:"#3797F0",ink:"#FFFFFF",f:{text:"Follow"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,7*u),L.paper,2*u);x.fillStyle=L.ink;T(x,"+ "+L.f.text,SANS,13*u,W/2,H/2,W*.8)}},
newpost:{name:"New post",cat:"socials",r:1,w:.34,paper:"#FF5FA2",ink:"#FFFFFF",f:{text:"New\npost!"},big:["text"],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>burst(x,c,c,46*u,34*u,12),L.paper,3*u);x.save();x.translate(c,c+2*u);x.rotate(-.12);x.fillStyle=L.ink;T(x,String(L.f.text).toUpperCase(),ff(400,"Luckiest Guy"),20*u,0,0,W*.56,{lh:.92,maxH:H*.5});x.restore()}},
dms:{name:"DM pill",cat:"socials",r:.4,w:.5,paper:"#111111",ink:"#F2DD6E",f:{text:"Slide into\nmy DMs"},big:["text"],rot:4,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,H),L.paper,2*u);x.save();x.translate(W*.2,H/2);x.rotate(-.35);x.fillStyle=L.ink;x.beginPath();poly(x,[[0,.5],[1,0],[.62,1],[.45,.62]],-8*u,-7*u,16*u,14*u);x.fill();x.restore();x.fillStyle=L.ink;T(x,L.f.text,BLK,9*u,W*.6,H/2,W*.56,{lh:1.02,maxH:H*.6})}},
tapmore:{name:"Tap for more",cat:"socials",r:.28,w:.48,paper:"#F2DD6E",ink:"#111111",f:{text:"Tap for more"},big:[],rot:-3,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,6*u),L.paper,2*u);x.fillStyle=L.ink;T(x,L.f.text,SANS,11*u,W*.44,H/2,W*.66);line(x,()=>{x.moveTo(W*.84,H*.32);x.lineTo(W*.9,H*.5);x.lineTo(W*.84,H*.68)},L.ink,2*u)}},
mention:{name:"Mention",cat:"socials",r:.26,w:.46,paper:"#FFFFFF",ink:"#D62976",f:{text:"@yourname"},big:[],rot:0,noInk:true,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,5*u),L.paper,0);const g=x.createLinearGradient(W*.1,0,W*.9,0);g.addColorStop(0,"#F58529");g.addColorStop(.5,"#DD2A7B");g.addColorStop(1,"#8134AF");x.fillStyle=g;T(x,String(L.f.text).toUpperCase(),BLK,11*u,W/2,H/2,W*.84)}},

/* ================= URBAN ================= */
cityclub:{name:"Run club box",cat:"urban",r:.78,w:.36,paper:"#111111",ink:"#FFFFFF",f:{top:"Antwerp run club",title:"ANT"},big:[],
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,4*u),L.paper,2*u);x.fillStyle=L.ink;S(x,L.f.top,SANS,5.6*u,W/2,H*.2,1*u,W*.84);line(x,()=>RR(x,14*u,H*.34,W-28*u,H*.5,2*u),L.ink,2*u);x.fillStyle=L.ink;T(x,L.f.title,BEB,34*u,W/2,H*.6,W*.6)}},
sundown:{name:"Sundown club",cat:"urban",r:.6,w:.48,paper:"#F4F1EA",ink:"#E2552B",f:{top:"Sun down",title:"Social club"},big:[],rot:6,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,2*u),L.paper,2*u);x.fillStyle=L.ink;T(x,L.f.top,SER,15*u,W/2,H*.26,W*.84);x.save();x.beginPath();x.rect(0,0,W,H*.78);x.clip();x.beginPath();x.arc(W/2,H*.78,15*u,PI,0);x.fill();x.restore();
    x.fillStyle=L.paper;[0,1,2].forEach(i=>x.fillRect(W*.3,H*(.62+i*.055),W*.4,1.2*u));x.fillStyle=L.ink;T(x,L.f.title,ff(400,"Yellowtail"),11*u,W/2,H*.88,W*.8)}},
slowsunday:{name:"Club circle",cat:"urban",r:1,w:.34,paper:"#F2DD6E",ink:"#1E2F5C",f:{top:"Slow sunday runs",title:"26"},big:[],
  draw(x,W,H,L){const u=W/100,c=W/2;cut(x,()=>x.arc(c,c,46*u,0,7),L.paper,2.5*u);x.fillStyle=L.ink;const t=String(L.f.top).toUpperCase(),sp=arcFit(x,t,SANS,8*u,35*u,3.6,1*u);arcT(x,t,c,c,35*u,-PI/2,sp,false);
    x.fillStyle=L.ink;x.beginPath();x.arc(c,c+3*u,18*u,0,7);x.fill();x.fillStyle=L.paper;T(x,L.f.title,BEB,20*u,c,c+4*u,W*.3)}},
triclub:{name:"Triangle",cat:"urban",r:.9,w:.36,paper:"#111111",ink:"#FF6A2B",f:{title:"Run club",bottom:"Amsterdam"},big:[],
  draw(x,W,H,L){const u=W/100,b=2*u;cut(x,()=>poly(x,[[.5,.04],[.97,.96],[.03,.96]],0,0,W,H),L.paper,b);x.fillStyle=L.ink;T(x,String(L.f.title).toUpperCase(),BLK,9*u,W/2,H*.62,W*.5);S(x,"× × ×",SANS,6*u,W/2,H*.45,1*u);S(x,L.f.bottom,SANS,4.6*u,W/2,H*.78,1*u,W*.66)}},
nighttag:{name:"Bold tag",cat:"urban",r:1.3,w:.28,paper:"#FF5A1F",ink:"#111111",f:{title:"Night\nriders"},big:["title"],rot:-8,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,8*u),L.paper,2.5*u);x.fillStyle=L.ink;T(x,String(L.f.title).toUpperCase(),BEB,34*u,W/2,H*.62,W*.8,{lh:.9,maxH:H*.62});ico(x,"bolt",W/2,H*.2,11*u,L.ink)}},
schedule:{name:"Timetable",cat:"urban",r:.56,w:.5,paper:"#FFFFFF",ink:"#111111",f:{t1:"12:30",t2:"13:00",t3:"13:30",text:"Lunch run crew"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,0,0,W,H,5*u),L.paper,0);x.fillStyle=L.ink;["t1","t2","t3"].forEach((k,i)=>{const y=H*(.2+i*.3);x.font=SANS(5.4*u);x.textAlign="left";x.textBaseline="middle";x.fillText(L.f[k],7*u,y);line(x,()=>{x.moveTo(25*u,y);x.lineTo(W-6*u,y)},L.ink+"55",.4*u)});
    cut(x,()=>RR(x,27*u,H*.3,W-34*u,H*.36,2.5*u),"#B8A9F5",0);x.fillStyle=L.ink;T(x,L.f.text,SANS,7*u,27*u+(W-34*u)/2,H*.48,W-42*u)}},
nextstop:{name:"Metro sign",cat:"urban",r:.4,w:.56,paper:"#1E2F5C",ink:"#FFFFFF",f:{top:"Next stop",title:"Weekend"},big:[],rot:0,
  draw(x,W,H,L){const u=W/100;cut(x,()=>RR(x,2*u,2*u,W-4*u,H-4*u,3*u),L.paper,2*u);x.fillStyle=L.ink;x.textAlign="left";x.font=SANS(5*u);x.textBaseline="middle";x.fillText(String(L.f.top).toUpperCase(),23*u,H*.3);
    const p=fit(x,L.f.title,SANS,15*u,W*.68);x.font=SANS(p);x.fillText(L.f.title,23*u,H*.6);[["#E0412F",.32],["#F2B33D",.5],["#3FA34D",.68]].forEach(([c,y])=>{x.fillStyle=c;x.beginPath();x.arc(12*u,H*y,4*u,0,7);x.fill()});x.fillStyle=L.ink;x.fillRect(11.4*u,H*.32,1.2*u,H*.36)}},

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
};};
