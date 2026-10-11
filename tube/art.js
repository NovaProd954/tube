const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const PAL={
land:[['#1d2b53','#c05a3b','#ffb36b','#2b1d3a'],['#0f2a43','#2f7d8c','#ffd9a0','#0b1e2d'],['#2b1b4a','#d4556b','#ffc27a','#1a1030'],['#0e3b5a','#4aa3c7','#eaf6ff','#0a2a40']],
tech:[['#050816','#0b2a5b','#35a7ff'],['#07110f','#0b3d2e','#31e08a'],['#12071a','#3b0f4f','#ff5fb0'],['#0a0a0a','#2a2a2a','#ffb02e']],
cook:[['#7a4a2a','#a8703f'],['#26262a','#3a3a41'],['#cdbb9a','#e6d9bd']],
music:[['#0b0220','#5b21b6','#ff3d9a','#22d3ee'],['#021a1a','#0f766e','#facc15','#fb7185'],['#1a0b00','#c2410c','#fde047','#f43f5e']],
film:[['#06222b','#0f5a63','#f08a3c'],['#101526','#2c3e73','#ffb86b'],['#1a0d0d','#5a2222','#f2c14e']],
fit:[['#111','#d94f04','#ffb703'],['#0a1b3a','#1d4ed8','#f97316'],['#0c0c0c','#46464a','#ef4444']]
};
const lg=(id,a,b,x2=0,y2=1)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const rg=(id,c,o=1)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const SCENES={
land:(w,h,r)=>{const p=pick(PAL.land,r),sx=w*(.3+r()*.4),sy=h*.52;
let s=`<defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset=".55" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/></linearGradient>${rg('b',p[2])}</defs><rect width="${w}" height="${h}" fill="url(#a)"/><circle cx="${sx}" cy="${sy}" r="${h*.62}" fill="url(#b)" opacity=".8"/><circle cx="${sx}" cy="${sy}" r="${h*.05}" fill="#fff7e2"/>`;
for(let i=0;i<4;i++)s+=`<ellipse cx="${r()*w}" cy="${h*(.1+r()*.3)}" rx="${w*(.12+r()*.12)}" ry="${h*.035}" fill="#fff" opacity=".16" filter="url(#bs)"/>`;
for(let L=0;L<3;L++){const base=h*(.6+L*.1),amp=h*(.22-L*.05),n=8;let d=`M0 ${h}L0 ${base}`;for(let i=1;i<=n;i++)d+=`L${(w/n*i).toFixed(1)} ${(base-r()*amp).toFixed(1)}`;s+=`<path d="${d}L${w} ${h}Z" fill="${p[3]}" opacity="${.45+L*.26}"/>`}
return s},
tech:(w,h,r)=>{const p=pick(PAL.tech,r),L=w>h,cx=L?w*.74:w*.5,cy=L?h*.5:h*.56,pw=L?h*.5:w*.52,ph=L?h*.88:h*.6;
let s=`<defs>${lg('a',p[0],p[1],1,1)}${rg('g',p[2],.7)}${lg('s',p[1],p[0])}</defs><rect width="${w}" height="${h}" fill="url(#a)"/>`;
for(let i=0;i<10;i++)s+=`<path d="M0 ${h/10*i}H${w}" stroke="${p[2]}" stroke-opacity=".07"/>`;
s+=`<circle cx="${cx}" cy="${cy}" r="${Math.max(w,h)*.5}" fill="url(#g)"/><rect x="${cx-pw/2}" y="${cy-ph/2}" width="${pw}" height="${ph}" rx="${pw*.14}" fill="#09090b" stroke="${p[2]}" stroke-opacity=".55" stroke-width="1.5"/><rect x="${cx-pw/2+4}" y="${cy-ph/2+4}" width="${pw-8}" height="${ph-8}" rx="${pw*.11}" fill="url(#s)"/>`;
for(let i=0;i<7;i++)s+=`<rect x="${cx-pw/2+pw*.12}" y="${cy-ph/2+ph*.14+i*ph*.1}" width="${pw*(.25+r()*.5)}" height="${ph*.035}" rx="2" fill="${i%3?p[2]:'#fff'}" opacity="${.35+r()*.5}"/>`;
return s},
cook:(w,h,r)=>{const t=pick(PAL.cook,r),cx=w*(w>h?.64:.5),cy=h*.5,R=Math.min(w,h)*.38;let s=`<rect width="${w}" height="${h}" fill="${t[0]}"/>`;
for(let i=0;i<8;i++)s+=`<rect y="${h/8*i}" width="${w}" height="${h/8}" fill="${t[1]}" opacity="${i%2?.5:.14}"/><path d="M0 ${h/8*i}H${w}" stroke="#000" stroke-opacity=".2"/>`;
s+=`<ellipse cx="${cx+6}" cy="${cy+10}" rx="${R*1.05}" ry="${R*1.02}" fill="#000" opacity=".4" filter="url(#bl)"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#f6f1e8"/><circle cx="${cx}" cy="${cy}" r="${R*.82}" fill="#e9e0d0"/><circle cx="${cx}" cy="${cy}" r="${R*.72}" fill="#f8f4ec"/>`;
const f=pick(['#e8b04a','#c8742f','#d9a066'],r);
for(let i=0;i<7;i++)s+=`<circle cx="${cx+(r()-.5)*R*.12}" cy="${cy+(r()-.5)*R*.12}" r="${R*(.6-i*.075)}" fill="none" stroke="${f}" stroke-width="${R*.09}" opacity="${.95-i*.06}"/>`;
for(let i=0;i<6;i++){const a=r()*6.28,d=r()*R*.45;s+=`<circle cx="${cx+Math.cos(a)*d}" cy="${cy+Math.sin(a)*d}" r="${R*.08}" fill="${i%2?'#c0392b':'#2f8f4e'}"/>`}
for(let i=0;i<3;i++){const a=r()*6.28,x=cx+Math.cos(a)*R*.3,y=cy+Math.sin(a)*R*.3;s+=`<ellipse cx="${x}" cy="${y}" rx="${R*.12}" ry="${R*.06}" fill="#2f8f4e" transform="rotate(${r()*180} ${x} ${y})"/>`}
return s},
music:(w,h,r)=>{const p=pick(PAL.music,r),L=w>h,n=L?26:16,bw=w/(n*1.5);
let s=`<defs>${lg('a',p[0],p[1],1,1)}<linearGradient id="b" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient>${rg('g',p[2],.55)}</defs><rect width="${w}" height="${h}" fill="url(#a)"/><circle cx="${w/2}" cy="${h/2}" r="${Math.max(w,h)*.5}" fill="url(#g)"/>`;
for(let i=0;i<n;i++){const x=w*.06+i*(w*.88/n),hh=h*(.1+.5*Math.abs(Math.sin(i*.55+r()*2))*(1-Math.abs(i/n-.5)*.9));s+=`<rect x="${x}" y="${h*.62-hh}" width="${bw}" height="${hh}" rx="${bw/2}" fill="url(#b)"/><rect x="${x}" y="${h*.64}" width="${bw}" height="${hh*.35}" rx="${bw/2}" fill="url(#b)" opacity=".18"/>`}
return s},
film:(w,h,r)=>{const p=pick(PAL.film,r),L=w>h,mx=w*(L?.72:.5),my=h*.4,x=w*(L?.34:.5);
let s=`<defs>${lg('a',p[0],p[1],1,1)}${rg('g',p[2],.8)}</defs><rect width="${w}" height="${h}" fill="url(#a)"/><circle cx="${mx}" cy="${my}" r="${h*.5}" fill="url(#g)"/><circle cx="${mx}" cy="${my}" r="${h*.2}" fill="${p[2]}" opacity=".92"/><ellipse cx="${mx}" cy="${my}" rx="${w*.6}" ry="2.2" fill="${p[2]}" opacity=".5" filter="url(#bs)"/><rect y="${h*.8}" width="${w}" height="${h*.2}" fill="#05070a" opacity=".85"/>`;
s+=`<path d="M${x-h*.22} ${h}C${x-h*.22} ${h*.74} ${x-h*.11} ${h*.64} ${x} ${h*.64}C${x+h*.11} ${h*.64} ${x+h*.22} ${h*.74} ${x+h*.22} ${h}Z" fill="#05070a"/><circle cx="${x}" cy="${h*.54}" r="${h*.085}" fill="#05070a"/>`;
if(L)s+=`<rect width="${w}" height="${h*.09}" fill="#000"/><rect y="${h*.91}" width="${w}" height="${h*.09}" fill="#000"/>`;
return s},
fit:(w,h,r)=>{const p=pick(PAL.fit,r),y=h*.46,u=Math.min(w,h),pw=w>h?w*.035:w*.05;
let s=`<defs>${lg('a',p[0],p[1],1,1)}</defs><rect width="${w}" height="${h}" fill="url(#a)"/>`;
for(let i=0;i<5;i++)s+=`<path d="M${w*(i*.28-.2)} ${h}L${w*(i*.28+.1)} 0H${w*(i*.28+.22)}L${w*(i*.28-.08)} ${h}Z" fill="${p[2]}" opacity=".12"/>`;
s+=`<rect y="${h*.8}" width="${w}" height="${h*.2}" fill="#000" opacity=".55"/><ellipse cx="${w/2}" cy="${h*.84}" rx="${w*.4}" ry="${h*.04}" fill="#000" opacity=".5" filter="url(#bl)"/><rect x="${w*.06}" y="${y-h*.018}" width="${w*.88}" height="${h*.036}" rx="3" fill="#d4d8de"/>`;
[[.5,.2],[.4,.25],[.3,.295]].forEach(([k,o])=>{[w*o,w*(1-o)-pw].forEach(x=>{s+=`<rect x="${x}" y="${y-u*k/2}" width="${pw}" height="${u*k}" rx="4" fill="#15161a"/><rect x="${x+2}" y="${y-u*k/2+3}" width="${pw*.22}" height="${u*k-6}" rx="1" fill="#fff" opacity=".18"/>`})});
return s},
moon:(w,h,r)=>{let s=`<defs>${lg('a','#02040c','#0d1f4a')}<radialGradient id="m" cx=".4" cy=".35"><stop offset="0" stop-color="#f6f3ea"/><stop offset="1" stop-color="#a9a69c"/></radialGradient>${rg('g','#9ec5ff',.45)}</defs><rect width="${w}" height="${h}" fill="url(#a)"/>`;
for(let i=0;i<70;i++)s+=`<circle cx="${r()*w}" cy="${r()*h}" r="${.4+r()*1.1}" fill="#fff" opacity="${.3+r()*.7}"/>`;
const cx=w*(w>h?.66:.5),cy=h*.55,R=h*.4;
s+=`<circle cx="${cx}" cy="${cy}" r="${R*1.5}" fill="url(#g)"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#m)"/>`;
for(let i=0;i<7;i++){const a=r()*6.28,d=r()*R*.7;s+=`<circle cx="${cx+Math.cos(a)*d}" cy="${cy+Math.sin(a)*d}" r="${R*(.05+r()*.1)}" fill="#6f6c64" opacity=".28"/>`}
s+=`<path d="M0 ${h}L0 ${h*.9}Q${w*.5} ${h*.82} ${w} ${h*.9}L${w} ${h}Z" fill="#05070f"/>`;
return s}
};
const SCN={107:"moon",4:'land',6:'moon',12:'tech'};
const CSC={Tech:'tech',Cooking:'cook',Travel:'land',Music:'music',Film:'film',Fitness:'fit'};
const artC={};
function art(v,w,h){const k=v.id+'-'+w;if(artC[k])return artC[k];const r=rng(v.id*7919+13),n=SCN[v.id]||CSC[v.cat];
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="vg" cx=".5" cy=".5" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></radialGradient><filter id="bl"><feGaussianBlur stdDeviation="6"/></filter><filter id="bs"><feGaussianBlur stdDeviation="2"/></filter></defs>${SCENES[n](w,h,r)}<rect width="${w}" height="${h}" fill="url(#vg)"/></svg>`;
return artC[k]=`url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g,'%27')}')`}
