(()=>{
const D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>[...r.querySelectorAll(s)],app=$('#app'),R=D.documentElement,{esc,fmtDur,compact}=U;
const ic=(n,c='')=>`<svg${c?` class="${c}"`:''}><use href="#i-${n}"/></svg>`;
const hue=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))%360;return h};
const ini=n=>String(n).split(/\s+/).slice(0,2).map(w=>(w[0]||'').toUpperCase()).join('')||'?';
const bgu=u=>`url('${encodeURI(u).replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29')}')`;
const ITEMS=new Map(),reg=v=>(ITEMS.set(v.id,v),v);
const DEMO=V.map((v,i)=>({id:'demo'+i,n:i,cat:v.cat,title:v.title,chn:CH[v.ch][0],chId:'demo:'+v.ch,av:null,vw:v.views,age:v.age,dur:v.live?'':v.dur,sec:v.sec,th:null,live:!!v.live,short:false,pr:v.pr,tt:v.tt,ini:CH[v.ch][2]}));
const DSH=SH.map((s,i)=>({id:'demos'+i,n:100+i,cat:s.cat,title:s.cap,chn:CH[s.ch][0],chId:'demo:'+s.ch,vw:s.likes,likes:s.likes,cm:s.cm,sec:30,dur:'0:30',short:true,th:null,ini:CH[s.ch][2]}));
[...DEMO,...DSH].forEach(reg);
const isDemo=()=>Engine.state().kind==='demo';
const avh=v=>v.av?`<img class="av" src="${esc(v.av)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="">`:`<div class="av" style="background:hsl(${hue(v.chId||v.chn)} 48% 42%)">${esc(v.ini||ini(v.chn))}</div>`;
const ttH=t=>{const[a,b]=String(t).split('\n');return b?`${esc(a)}<br><i>${esc(b)}</i>`:`<i>${esc(a)}</i>`};
const pct=v=>v.pr!=null?v.pr:(v.sec&&Store.prog(v.id)?Math.min(100,Math.round(Store.prog(v.id)/v.sec*100)):0);
const thumb=v=>{const p=pct(v),x=(v.live?'<span class="dur live">LIVE</span>':v.dur?`<span class="dur">${esc(v.dur)}</span>`:'')+(p?`<i class="wp"><i style="width:${p}%"></i></i>`:'');
return v.th?`<div class="th"><img src="${esc(v.th)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="">${x}</div>`:`<div class="th" style="background-image:${art({id:v.n,cat:v.cat},320,180)}"><span class="tt">${ttH(v.tt||v.title)}</span>${x}</div>`};
const metaTx=v=>[v.chn,v.live?(v.vw?v.vw+' watching':''):(v.vw?v.vw+' views':''),v.age].filter(Boolean).join(' · ');
const card=v=>{reg(v);return`<article class="card" data-act="open" data-id="${esc(v.id)}">${thumb(v)}<div class="meta"><button class="avb" data-act="chopen" data-cid="${esc(v.chId)}" data-n="${esc(v.chn)}" aria-label="Channel">${avh(v)}</button><div class="mt"><h3>${esc(v.title)}</h3><p>${esc(metaTx(v))}</p></div><button class="ib sm" data-act="menu" data-id="${esc(v.id)}" aria-label="More">${ic('morev')}</button></div></article>`};
const hc=v=>{reg(v);return`<div class="hc" data-act="open" data-id="${esc(v.id)}">${thumb(v)}<h3>${esc(v.title)}</h3><p>${esc(v.chn)}</p></div>`};
const visible=v=>!Store.hidden(v.id)&&!Store.hidden('ch:'+v.chId);
const shortBg=s=>s.th?bgu(s.th):art({id:s.n,cat:s.cat},180,320);
const skel=n=>Array(n).fill('<div class="card sk"><div class="th"></div><div class="meta"><div class="av"></div><div class="mt"><h3></h3><p></p></div></div></div>').join('');
const errBox=m=>`<div class="empty">${esc(m)}<br><button class="pill" data-act="retry">Retry</button><button class="pill" data-act="engsheet">Engine settings</button></div>`;
let CATQ={Tech:'technology',Cooking:'cooking recipes',Travel:'travel vlog',Music:'music',Film:'movie trailers',Fitness:'workout'},cat='All',homeTok=0;const feed=$('#feed');
const drawChips=()=>{$('#chips').innerHTML=`<button class="chip ex" data-act="toast" data-m="Explore" aria-label="Explore">${ic('compass')}</button>`+CATS.map(c=>`<button class="chip${c===cat?' on':''}" data-act="chip" data-c="${c}">${c}</button>`).join('')};
const shelf=l=>`<section class="shelf"><h2><span class="rd">${ic('shorts')}</span>Shorts</h2><div class="row">${l.slice(0,8).map(s=>{reg(s);return`<div class="sh" data-act="shelf" data-id="${esc(s.id)}" style="background-image:${shortBg(s)}"><button class="kb" data-act="menu" data-id="${esc(s.id)}" aria-label="More">${ic('morev')}</button><span>${esc(s.title)}<small>${esc(s.vw)} views</small></span></div>`}).join('')}</div></section>`;
async function loadHome(){const tok=++homeTok;feed.innerHTML=skel(3);
try{let items;if(isDemo())items=DEMO.filter(v=>cat==='All'||v.cat===cat);else items=cat==='All'?await Engine.home():await Engine.search(CATQ[cat],'videos');
if(tok!==homeTok)return;items=items.filter(v=>v.type!=='channel'&&visible(v));const sh=isDemo()?DSH:items.filter(v=>v.short),rest=items.filter(v=>!v.short||isDemo());
if(!rest.length&&!sh.length){feed.innerHTML=errBox('Nothing to show');return}
feed.innerHTML=rest.slice(0,2).map(card).join('')+(sh.length>=3?shelf(sh):'')+rest.slice(2).map(card).join('')}
catch(e){if(tok===homeTok)feed.innerHTML=errBox('Could not load videos from the engine')}}
let sf='All';const SCH=['All','Today','Videos','Shorts'];
function seedDemo(){if(isDemo()&&!Store.subIds().length)[0,1,2,4,5,7,9].forEach(i=>Store.sub('demo:'+i,CH[i][0],null))}
async function renderSubs(){const ids=Store.subIds(),subs=Store.D.subs;
$('#chan').innerHTML=ids.map(id=>{const s=subs[id];return`<button class="cb" data-act="chopen" data-cid="${esc(id)}" data-n="${esc(s.n)}">${avh({chId:id,chn:s.n,av:s.a,ini:id.startsWith('demo:')?CH[+id.slice(5)][2]:null})}<span>${esc(s.n)}</span></button>`}).join('')||'<div class="empty" style="padding:8px 16px">No subscriptions yet</div>';
$('#schips').innerHTML=SCH.map(c=>`<button class="chip${c===sf?' on':''}" data-act="schip" data-c="${c}">${c}</button>`).join('');
const out=$('#subfeed');out.innerHTML=skel(2);let items=[];
try{items=isDemo()?DEMO.filter(v=>ids.includes(v.chId)):await Engine.feed(ids)}catch{out.innerHTML=errBox('Could not load your subscription feed');return}
items=items.filter(visible).filter(v=>sf==='All'||(sf==='Today'&&/hour|minute|just/.test(v.age))||(sf==='Videos'&&!v.short)||(sf==='Shorts'&&v.short));
out.innerHTML=items.length?items.map(card).join(''):`<div class="empty">${ids.length?'No videos match':'Subscribe to channels or import a NewPipe export in You > Settings'}</div>`}
function renderYou(){$('#hist').innerHTML=Store.D.hist.slice(0,8).map(hc).join('')||'<div class="empty" style="padding:6px 16px;text-align:left">Videos you watch will show up here</div>';
$('#pls').innerHTML=[['Watch later','later','clock'],['Liked videos','liked','like']].map(([n,k,i])=>{const l=Store.D[k],f=l[0];return`<div class="pl" data-act="olist" data-l="${k}"><div class="th" ${f&&f.th?'':f&&f.n!=null?`style="background-image:${art({id:f.n,cat:f.cat},320,180)}"`:''}>${f&&f.th?`<img src="${esc(f.th)}" loading="lazy" referrerpolicy="no-referrer" alt="">`:''}<div class="pc">${ic(i)}<span>${l.length}</span></div></div><h3>${n}</h3><p>Private · Playlist</p></div>`}).join('');
['hist','later','liked'].forEach(k=>$('#n-'+k).textContent=Store.D[k].length||'');
$('#set-q').textContent=Store.pref('q')+'p';
const e=Engine.state();$('#set-eng').textContent=e.kind==='demo'?'Demo mode (no engine connected)':`${e.kind==='local'?'Tube Engine':e.kind==='piped'?'Piped (NewPipe Extractor)':'Custom'} · ${e.name} · ${e.ms} ms`;
$$('[data-act=ptog]').forEach(b=>b.classList.toggle('on',!!Store.pref(b.dataset.k)))}
let SF=[];
const as=$('#as'),cs=$('#cs'),scrim=$('#scrim');
function sheet(title,rows){SF=rows;$('#asl').innerHTML=(title?`<div class="ast">${esc(title)}</div>`:'')+rows.map((r,i)=>`<button class="ar" data-act="asfn" data-i="${i}">${r.i?ic(r.i):''}<span>${esc(r.t)}</span>${r.on?`<em class="ck">${ic('check')}</em>`:r.r?`<em class="rt">${esc(r.r)}</em>`:''}</button>`).join('');as.classList.add('open');scrim.classList.add('show')}
const closeSheets=()=>{as.classList.remove('open');cs.classList.remove('open');scrim.classList.remove('show')};
let tt;const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)};
const LS=localStorage;
let queue=[],ctx=null;
function itemMenu(v){ctx=v;const l=Store.has('later',v.id);
sheet('',[{i:'queue',t:'Play next in queue',f:()=>{queue.push(v);toast('Added to queue')}},{i:'clock',t:l?'Remove from Watch later':'Save to Watch later',f:()=>{toast(Store.toggle('later',v)?'Saved to Watch later':'Removed from Watch later');renderYou()}},{i:'dl',t:'Download video',f:()=>download(v,false)},{i:'upload',t:'Download audio only',f:()=>download(v,true)},{i:'share',t:'Share',f:()=>share(v)},{i:'ban',t:'Not interested',f:()=>{Store.hide(v.id);$$(`[data-id="${CSS.escape(v.id)}"]`).forEach(e=>e.closest('.card,.sh,.hc')&&e.closest('.card,.sh,.hc').remove());toast('Okay, we will show fewer videos like this')}},{i:'xc',t:"Don't recommend channel",f:()=>{Store.hide('ch:'+v.chId);loadHome();toast('Channel hidden from recommendations')}},{i:'flag',t:'Report',f:()=>toast('Reporting is not available in Tube')}])}
async function download(v,audio){if(v.id.startsWith('demo')){toast('Downloads need a connected engine');return}toast('Preparing download...');
try{const d=await Engine.video(v.id),pick=audio?[...d.audio].sort((a,b)=>b.br-a.br)[0]:[...d.combined].sort((a,b)=>b.h-a.h)[0];if(!pick){toast(audio?'No audio stream found':'No single-file stream; HD needs separate video and audio');return}
const ext=/webm/.test(pick.mime)?'webm':audio?'m4a':'mp4',u=new URL(pick.url,location.href);if(Engine.state().kind==='local')u.searchParams.set('dl',(v.title.replace(/[^\w\- ]+/g,'').trim()||v.id)+'.'+ext);
const a=D.createElement('a');a.href=u.href;a.download='';a.rel='noopener';D.body.appendChild(a);a.click();a.remove()}catch{toast('Download failed')}}
async function share(v){const url='https://youtu.be/'+v.id;try{if(navigator.share)await navigator.share({title:v.title,url});else{await navigator.clipboard.writeText(url);toast('Link copied')}}catch{}}
const pg=$('#pg'),pgc=$('#pgc');
function pageOpen(title,html){$('#pgt').textContent=title;pgc.innerHTML=html;pgc.scrollTop=0;pg.classList.add('open')}
async function openChannel(id,name){if(!id||id==='demo:undefined'){toast('Channel unavailable');return}
pageOpen(name||'Channel',skel(2));let ch;
try{if(id.startsWith('demo:')){const k=+id.slice(5);ch={id,name:CH[k][0],av:null,banner:null,desc:'',subs:CH[k][3],items:DEMO.filter(v=>v.chId===id),ini:CH[k][2],demo:1}}else ch=await Engine.channel(id)}catch{pgc.innerHTML=errBox('Could not load this channel');return}
const on=Store.isSub(id);
pgc.innerHTML=`<div class="chh">${ch.banner?`<div class="ban" style="background-image:${bgu(ch.banner)}"></div>`:''}<div class="row1">${avh({chId:id,chn:ch.name,av:ch.av,ini:ch.ini}).replace('class="av"','class="av xl"')}<div><h2>${esc(ch.name)}</h2><p>${ch.subs>=0&&ch.subs!=null?esc(typeof ch.subs==='number'?compact(ch.subs):ch.subs)+' subscribers':''}</p></div></div>${ch.desc?`<p style="margin-top:10px;color:var(--fg2);font-size:13px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(ch.desc)}</p>`:''}<button class="subb${on?' on':''}" data-act="csub" data-cid="${esc(id)}" data-n="${esc(ch.name)}" data-a="${esc(ch.av||'')}">${on?ic('bell')+'Subscribed'+ic('down'):'Subscribe'}</button></div><div class="chtab"><b>Videos</b></div>${ch.items.filter(visible).map(card).join('')||'<div class="empty">No videos</div>'}`}
function openList(k){const t={hist:'Watch history',later:'Watch later',liked:'Liked videos'}[k],l=Store.D[k];pageOpen(t,l.length?l.map(card).join(''):'<div class="empty">Nothing here yet</div>')}
const q=$('#q'),sres=$('#sres'),srch=$('#srch');let sq=0,sTok=0;
const SUG=['tiny language model','weather app tutorial','lo-fi focus music','japan coast walk','sourdough for beginners','night train alps','morning mobility flow','native app feel','strength basics','moon mission'];
async function sugs(){const t=q.value.trim().toLowerCase(),tok=++sTok;$('.sf').classList.toggle('has',!!q.value);let l;
if(!t)l=isDemo()?SUG.slice(0,7):[];
else if(isDemo())l=[...new Set(SUG.concat(DEMO.map(v=>v.title.toLowerCase())).filter(s=>s.includes(t)))].slice(0,9);
else{l=await Engine.suggest(q.value.trim());if(tok!==sTok)return}
sres.innerHTML=l.map(s=>{const i=t?s.toLowerCase().indexOf(t):-1,tx=t&&i===0?esc(s.slice(0,t.length))+'<b>'+esc(s.slice(t.length))+'</b>':esc(s);return`<div class="sug" data-act="sugpick" data-s="${esc(s)}">${ic(t?'search':'clock')}<span>${tx}</span><button class="ib" data-act="sugfill" data-s="${esc(s)}" aria-label="Use suggestion">${ic('arrow')}</button></div>`}).join('')||(t?'':'<div class="empty">Search for videos and channels</div>')}
async function results(term){q.value=term;q.blur();$('.sf').classList.add('has');const tok=++sTok;sres.innerHTML=skel(2);let r=[];
try{if(isDemo()){const w=term.toLowerCase().split(/\s+/).filter(Boolean);r=DEMO.filter(v=>{const x=(v.title+' '+v.chn+' '+v.cat).toLowerCase();return w.every(y=>x.includes(y))})}else r=await Engine.search(term,'all')}catch{if(tok===sTok)sres.innerHTML=errBox('Search failed');return}
if(tok!==sTok)return;r=r.filter(x=>x.type==='channel'||visible(x));
sres.innerHTML=r.length?r.map(x=>x.type==='channel'?`<button class="chr" data-act="chopen" data-cid="${esc(x.id)}" data-n="${esc(x.name)}">${avh({chId:x.id,chn:x.name,av:x.av})}<div><b>${esc(x.name)}</b><span>${x.subs>=0&&x.subs!=null?esc(compact(x.subs))+' subscribers':'Channel'}</span></div></button>`:card(x)).join(''):`<div class="empty">No results for “${esc(term)}”</div>`;sres.scrollTop=0}
function openS(){srch.classList.add('open');q.value='';sugs();setTimeout(()=>q.focus({preventScroll:true}),260)}
const closeS=()=>{srch.classList.remove('open');q.blur()};
q.addEventListener('input',()=>{clearTimeout(sq);sq=setTimeout(sugs,isDemo()?0:180)});
q.addEventListener('keydown',e=>{if(e.key==='Enter'&&q.value.trim())results(q.value.trim())});
const LI={home:0,shorts:1,subs:3,you:4};let cur='home',isOpen=false,shortsLoaded=false;
const sbw=()=>app.classList.toggle('sbw',cur==='shorts'||isOpen);
function go(t){
if(t===cur){const sc=$('#sc-'+t);sc&&sc.scrollTo({top:0,behavior:'smooth'});const h=$('#hd-'+t);h&&h.classList.remove('hide');return}
$('#v-'+cur).classList.remove('active');$('#v-'+t).classList.add('active');cur=t;$('#lens').style.transform=`translateX(${LI[t]*100}%)`;$('#tabs').classList.remove('min');
$$('.tb[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===t));app.classList.toggle('sd',t==='shorts');sbw();
if(t==='shorts'){loadShorts()}else svPause();
if(t==='subs')renderSubs();if(t==='you')renderYou()}
const snap=$('#snap');let sv=null,svItem=null,shortsList=[],stok=0;
const svEl=()=>{if(!sv){sv=D.createElement('video');sv.id='svid';sv.playsInline=true;sv.loop=true;sv.setAttribute('webkit-playsinline','');sv.addEventListener('timeupdate',()=>{const i=snap.querySelector('.short.on .sbar i');if(i&&sv.duration)i.style.transform=`scaleX(${sv.currentTime/sv.duration})`})}return sv};
function svPause(){if(sv)sv.pause()}
async function playShort(slide){const it=shortsList[+slide.dataset.i];if(!it)return;const tok=++stok;
if(isDemo()){slide.classList.add('on');return}
try{const d=await Engine.video(it.id);if(tok!==stok)return;const c=[...d.combined].sort((a,b)=>Math.abs(a.h-480)-Math.abs(b.h-480))[0];if(!c){slide.querySelector('.scap').textContent='Not playable in Shorts view';return}
const v=svEl();slide.insertBefore(v,slide.firstChild);v.src=c.url;v.muted=false;slide.querySelector('.sbar i').style.animation='none';const p=v.play();p&&p.catch(()=>{v.muted=true;v.play().catch(()=>{})})}catch{}}
const sio=new IntersectionObserver(es=>es.forEach(e=>{e.target.classList.toggle('on',e.isIntersecting);if(e.isIntersecting&&cur==='shorts')playShort(e.target);else if(!e.isIntersecting&&sv&&sv.parentNode===e.target)sv.pause()}),{root:snap,threshold:.65});
function drawShorts(l){shortsList=l;snap.innerHTML=l.length?l.map((s,i)=>{reg(s);return`<article class="short" data-i="${i}" data-act="pz" style="background-image:${shortBg(s)}"><div class="scap">${esc(s.title)}</div><div class="pzi">${ic('play')}</div><div class="rail"><button class="rb lk" data-act="slike">${ic('like')}<span>${esc(s.vw||'Like')}</span></button><button class="rb" data-act="toast" data-m="Dislike noted">${ic('like','flip')}<span>Dislike</span></button><button class="rb" data-act="cmt" data-id="${esc(s.id)}">${ic('cmt')}<span>${esc(s.cm||'')}</span></button><button class="rb" data-act="share" data-id="${esc(s.id)}">${ic('share')}<span>Share</span></button><button class="rb" data-act="chopen" data-cid="${esc(s.chId)}" data-n="${esc(s.chn)}"><div class="rch" style="background:hsl(${hue(s.chId||s.chn)} 48% 42%)">${esc(s.ini||ini(s.chn))}</div></button></div><div class="sinfo"><div class="who">${avh(s)}${esc(s.chn)}<button data-act="toast" data-m="Subscribed">Subscribe</button></div><p>${esc(s.title)}</p></div><div class="sbar"><i></i></div></article>`}).join(''):'<div class="shorts-empty">No Shorts could be loaded</div>';$$('.short',snap).forEach(s=>sio.observe(s))}
async function loadShorts(){if(shortsLoaded){const on=snap.querySelector('.short.on');on&&playShort(on);return}shortsLoaded=true;
if(isDemo())return drawShorts(DSH);snap.innerHTML='<div class="shorts-empty">Loading Shorts...</div>';
try{let l=(await Engine.search('shorts','videos')).filter(v=>v.type!=='channel'&&v.short&&visible(v));drawShorts(l)}catch{shortsLoaded=false;snap.innerHTML='<div class="shorts-empty">Could not load Shorts</div>'}}
const P={item:null,d:null,tok:0,rel:[]};const vid=$('#vid'),sheetEl=$('#sheet'),trk=$('#trk');let uit;
const SBCOL={sponsor:'#00d400',selfpromo:'#ffe600',interaction:'#cc00ff',intro:'#00e5ff',outro:'#2f6bff'};
function setProg(t,d){const f=d?Math.min(1,t/d):0;$('#fill').style.transform=$('#mfill').style.transform=`scaleX(${f})`;$('#knob').style.transform=`translateX(${f*trk.clientWidth}px)`;let ch='';const c=P.d&&P.d.chapters;if(c&&c.length){const k=[...c].reverse().find(x=>x.s<=t);if(k)ch=' · '+k.t}$('#vtime').textContent=`${fmtDur(t)||'0:00'} / ${P.d&&P.d.live?'LIVE':fmtDur(d)||'0:00'}${ch}`}
function setPlay(b){$$('[data-pp]').forEach(x=>x.firstElementChild.firstElementChild.setAttribute('href',b?'#i-pause':'#i-play'));if(b)showUI()}
function showUI(){vid.classList.add('ui');clearTimeout(uit);if(Player.playing())uit=setTimeout(()=>vid.classList.remove('ui'),2800)}
Player.on('tick',setProg);Player.on('state',setPlay);Player.on('buf',f=>{$('#bufb').style.transform=`scaleX(${f})`});
Player.on('skip',c=>toast('Skipped '+({sponsor:'sponsor',selfpromo:'self promotion',interaction:'interaction reminder',intro:'intro',outro:'outro'}[c]||c)));
Player.on('end',()=>next());Player.on('next',()=>next());
Player.on('retry',c=>toast('Trying '+c.label+'...'));Player.on('fail',()=>toast('Playback failed. Check the engine or pick another quality.'));
function drawSb(l,d){$('#sbms').innerHTML=d?l.map(s=>`<i style="left:${s.a/d*100}%;width:${Math.max(.4,(s.b-s.a)/d*100)}%;background:${SBCOL[s.c]||'#0f0'}"></i>`).join(''):''}
function subUI(){const b=$('#subb'),on=Store.isSub(P.item.chId);b.classList.toggle('on',on);b.innerHTML=on?`${ic('bell')}Subscribed${ic('down')}`:'Subscribe'}
function fillInfo(v,d){const x=d||v;vid.style.backgroundImage=v.th?bgu(v.th):art({id:v.n,cat:v.cat},320,180);$('#vti').textContent=v.title;const a=$('#vav');a.outerHTML=avh(v).replace('class="av"','class="av" id="vav"');
$('#vch').textContent=v.chn;$('#vsubs').textContent=d&&d.subs>=0?compact(d.subs)+' subscribers':(v.id.startsWith('demo')?CH[+v.chId.slice(5)][3]+' subscribers':'');
const meta=[x.views!=null&&x.views>=0?compact(x.views)+' views':v.vw?v.vw+' views':'',x.age||v.age].filter(Boolean).join('  ');$('#vst').textContent=d&&d.live?'Streaming live':meta;
$('#lk').textContent=d&&d.likes>=0?compact(d.likes):'48K';$('#dk').textContent='';subUI();
$('#vdtx').innerHTML=d?`${esc(d.desc.slice(0,220))}${d.desc.length>220?' <em>…more</em>':''}`:'A calm, practical walkthrough from idea to finished result. Chapters, notes and source files are linked below. <em>…more</em>';
$('#vdesc').dataset.open='0';$('#cm1').textContent='Tap to load comments';$('#cmn').textContent='';
$('#blike').classList.toggle('on',Store.has('liked',v.id));$('#bdis').classList.remove('on');
$('#mth').style.backgroundImage=v.th?bgu(v.th):art({id:v.n,cat:v.cat},320,180);$('#mti').textContent=v.title;$('#mch').textContent=v.chn}
function related(v,d){let l=d&&d.related&&d.related.length?d.related:null;const put=a=>{if(P.item&&P.item.id===v.id)$('#rel').innerHTML=a.filter(x=>x.id!==v.id&&visible(x)).slice(0,10).map(card).join('')};
if(isDemo()){put([...DEMO].sort((a,b)=>(b.cat===v.cat)-(a.cat===v.cat)));return}
if(l){P.rel=l;put(l);return}
Engine.search(v.title,'videos').then(r=>{r=r.filter(x=>x.type!=='channel');P.rel=r;put(r)}).catch(()=>{})}
async function openP(v,resume){
if(resume&&P.item&&P.item.id===v.id){sheetEl.classList.add('open');$('#mini').classList.remove('show');isOpen=true;sbw();showUI();return}
const tok=++P.tok;P.item=v;P.d=null;P.rel=[];fillInfo(v,null);drawSb([],0);$('#rel').innerHTML=skel(1);vid.classList.remove('ao');
sheetEl.classList.add('open');$('#mini').classList.remove('show');isOpen=true;sbw();showUI();Store.addHist(v);
const start=(()=>{const p=Store.prog(v.id);return p>10&&v.sec&&p<v.sec-15?p:0})();
if(isDemo()||v.id.startsWith('demo')){const d={id:v.id,title:v.title,chn:v.chn,sec:v.sec,th:null,live:false,combined:[],video:[],audio:[],subs_:[],chapters:[],related:[]};P.d=d;Player.load(d,{sim:true,start});setProg(start,v.sec);related(v,d);return}
setProg(0,0);$('#vtime').textContent='Loading...';
try{const d=await Engine.video(v.id);if(tok!==P.tok)return;P.d=d;fillInfo(v,d);const r=Player.load(d,{start,pref:Store.pref('q')});if(!r.ok){toast(r.reason);return}setProg(start,d.sec);related(v,d);
if(Store.pref('sb')&&!d.live)Engine.sponsor(v.id).then(l=>{if(tok===P.tok){Player.setSb(l);drawSb(l,d.sec)}});
if(Store.pref('ryd'))Engine.dislikes(v.id).then(r=>{if(r&&tok===P.tok){$('#dk').textContent=compact(r.dislikes);if(d.likes<0)$('#lk').textContent=compact(r.likes)}})}
catch(e){if(tok===P.tok){$('#vtime').textContent='Unavailable';toast(Engine.state().kind==='piped'?'Could not load this video. Trying another instance may help.':'Could not load this video')}}}
function minimize(){sheetEl.classList.remove('open');if(P.item)$('#mini').classList.add('show');isOpen=false;sbw();if(document.pictureInPictureElement==null&&P.item&&!Player.audioOnly()&&Player.mode()!=='sim'&&Player.playing()&&Store.pref('bg')===0)Player.pause()}
function closeP(){Player.stop();P.item=null;P.d=null;$('#mini').classList.remove('show');sheetEl.classList.remove('open');isOpen=false;sbw()}
function next(){const n=queue.shift();if(n)return openP(n);if(!Store.pref('auto'))return;const r=P.rel.filter(x=>x.id!==(P.item&&P.item.id)&&visible(x))[0]||(isDemo()?DEMO[(DEMO.findIndex(x=>x.id===P.item.id)+1)%DEMO.length]:null);if(r)openP(r)}
const vw=$('#vwrap');let sy=null,dy=0,lastTap=0,lastX=0;
vw.addEventListener('pointerdown',e=>{if(e.target.closest('button,.trk'))return;sy=e.clientY;dy=0;vw.setPointerCapture(e.pointerId);sheetEl.classList.add('drag')});
vw.addEventListener('pointermove',e=>{if(sy==null)return;dy=Math.max(0,e.clientY-sy);sheetEl.style.transform=`translate3d(0,${dy}px,0)`});
const ripple=s=>{const e=$(s==='l'?'#dtl':'#dtr');e.classList.remove('show');void e.offsetWidth;e.classList.add('show')};
const endDrag=e=>{if(sy==null)return;sy=null;sheetEl.classList.remove('drag');sheetEl.style.transform='';if(dy>110){minimize();return}if(dy<6){const now=Date.now(),r=vid.getBoundingClientRect(),x=(e.clientX-r.left)/r.width;if(now-lastTap<320&&Math.abs(x-lastX)<.25&&(x<.34||x>.66)){const L=x<.34;Player.seek(Player.cur()+(L?-10:10));ripple(L?'l':'r');lastTap=0;return}lastTap=now;lastX=x;if(vid.classList.contains('ui')){vid.classList.remove('ui');clearTimeout(uit)}else showUI()}};
vw.addEventListener('pointerup',endDrag);vw.addEventListener('pointercancel',()=>{sy=null;sheetEl.classList.remove('drag');sheetEl.style.transform=''});
const SPEEDS=[.5,.75,1,1.25,1.5,1.75,2],QP=[144,240,360,480,720,1080,1440,2160];
function vset(){const e=Player.mode()==='sim';sheet('Player',[{i:'vid',t:'Quality',r:e?'Demo':(Player.quals().find(x=>x.on)||{label:''}).label,f:()=>setTimeout(qualSheet,60)},{i:'play',t:'Playback speed',r:Player.rate()+'x',f:()=>setTimeout(speedSheet,60)},{i:Player.audioOnly()?'check':'live',t:Player.audioOnly()?'Audio only: on':'Audio only (background play)',f:()=>{if(e)return toast('Needs a connected engine');if(!Player.setAudioOnly(!Player.audioOnly()))toast('No audio stream available');vid.classList.toggle('ao',Player.audioOnly());toast(Player.audioOnly()?'Audio only: keeps playing with the screen locked':'Video restored')}},{i:'flag',t:Store.pref('sb')?'SponsorBlock: on':'SponsorBlock: off',f:()=>{Store.pref('sb',Store.pref('sb')?0:1);toast(Store.pref('sb')?'SponsorBlock on':'SponsorBlock off')}},{i:'dl',t:'Download',f:()=>P.item&&download(P.item,false)}])}
function qualSheet(){const q=Player.quals();if(!q.length)return toast('Quality is chosen automatically in demo mode');sheet('Quality',q.map(x=>({t:x.label,on:x.on,f:()=>Player.setQ(x.i)})))}
function speedSheet(){sheet('Playback speed',SPEEDS.map(s=>({t:s===1?'Normal':s+'x',on:Player.rate()===s,f:()=>Player.rate(s)})))}
function subSheet(){const d=P.d;if(!d||!d.subs_||!d.subs_.length)return toast('No captions for this video');sheet('Captions',[{t:'Off',on:Player.subOn()<0,f:()=>Player.setSub(-1)},...d.subs_.map((s,i)=>({t:s.name,on:Player.subOn()===i,f:()=>Player.setSub(i)}))])}
function engSheet(){const e=Engine.state(),m=LS.getItem('eng')||'auto';
sheet('Engine',[{i:'live',t:'Automatic',r:m==='auto'?'Selected':'',on:m==='auto',f:()=>engApply('auto')},{i:'set',t:'Custom server URL...',r:LS.getItem('engUrl')||'',on:m==='custom',f:()=>{const u=prompt('Engine or Piped API URL (for example http://127.0.0.1:8787)',LS.getItem('engUrl')||'http://127.0.0.1:8787');if(u&&/^https?:\/\//.test(u.trim()))engApply('custom',u.trim().replace(/\/$/,''))}},{i:'play',t:'Demo mode (offline sample data)',on:m==='demo',f:()=>engApply('demo')},{i:'help',t:`Status: ${e.kind==='demo'?'not connected':e.name}`,f:()=>{}}])}
async function engApply(m,u){Engine.set(m,u);Engine.clear();toast('Connecting...');const s=await Engine.init();toast(s.kind==='demo'?(m==='demo'?'Demo mode':'Engine unreachable. Using demo mode.'):'Connected to '+s.name);seedDemo();shortsLoaded=false;snap.innerHTML='';loadHome();renderSubs();renderYou();if(cur==='shorts')loadShorts()}
function qPrefSheet(){sheet('Default quality',QP.filter(x=>x<=1080).map(x=>({t:x+'p',on:Store.pref('q')===x,f:()=>{Store.pref('q',x);renderYou()}})))}
app.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const d=t.dataset;
switch(d.act){
case 'tab':go(d.t);break;
case 'create':sheet('Create',[{i:'shorts',t:'Create a Short',f:()=>toast('Creating is not available in Tube')},{i:'upload',t:'Import subscriptions',f:()=>$('#imp').click()},{i:'live',t:'Engine settings',f:engSheet}]);break;
case 'menu':e.stopPropagation();{const v=ITEMS.get(d.id);if(v)itemMenu(v);else sheet('',[{i:'live',t:'Engine settings',f:engSheet}])}break;
case 'asfn':{const r=SF[+d.i];closeSheets();r&&r.f&&r.f();break}
case 'srch':openS();break;
case 'sback':closeS();break;
case 'sclr':q.value='';sugs();q.focus();break;
case 'sugpick':results(d.s);break;
case 'sugfill':e.stopPropagation();q.value=d.s;sugs();q.focus();break;
case 'open':{const v=ITEMS.get(d.id);if(v)openP(v);break}
case 'chopen':e.stopPropagation();openChannel(d.cid,d.n);break;
case 'vchopen':if(P.item){minimize();openChannel(P.item.chId,P.item.chn)}break;
case 'pgback':pg.classList.remove('open');break;
case 'olist':openList(d.l);break;
case 'csub':{const on=Store.sub(d.cid,d.n,d.a);t.classList.toggle('on',on);t.innerHTML=on?ic('bell')+'Subscribed'+ic('down'):'Subscribe';toast(on?'Subscribed to '+d.n:'Unsubscribed');renderSubs();break}
case 'retry':if(cur==='subs')renderSubs();else{Engine.clear();loadHome()}break;
case 'chip':cat=d.c;drawChips();loadHome();$('#sc-home').scrollTop=0;break;
case 'schip':sf=d.c;renderSubs();break;
case 'shelf':go('shorts');(async()=>{await loadShorts();const i=shortsList.findIndex(s=>s.id===d.id);if(i>=0)snap.scrollTop=i*snap.clientHeight})();break;
case 'pz':{t.classList.toggle('pz');if(sv&&sv.parentNode===t)t.classList.contains('pz')?sv.pause():sv.play().catch(()=>{});if(sv&&sv.parentNode===t&&sv.muted)sv.muted=false;break}
case 'slike':t.classList.toggle('on');break;
case 'share':{const v=ITEMS.get(d.id);v&&share(v);break}
case 'toast':toast(d.m);break;
case 'min':minimize();break;
case 'pp':if(Player.mode()!=='sim'&&Player.cur()>=Player.dur()-.2&&Player.dur()>0)Player.seek(0);Player.toggle();showUI();break;
case 'vprev':Player.seek(0);showUI();break;
case 'vnext':next();break;
case 'mpp':if(P.item)Player.toggle();break;
case 'mopen':if(P.item)openP(P.item,true);break;
case 'mclose':closeP();break;
case 'seek':{const r=t.getBoundingClientRect();Player.seek(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*(Player.dur()||0));showUI();break}
case 'pip':Player.pip().then(ok=>{if(!ok)toast('Picture in picture is not supported here')});break;
case 'vset':vset();break;
case 'subsheet':subSheet();break;
case 'sub':if(P.item){const on=Store.sub(P.item.chId,P.item.chn,P.item.av);toast(on?'Subscribed to '+P.item.chn:'Unsubscribed');subUI();renderSubs()}break;
case 'like':if(P.item){const on=Store.toggle('liked',P.item);$('#blike').classList.toggle('on',on);$('#bdis').classList.remove('on');toast(on?'Added to Liked videos':'Removed from Liked videos')}break;
case 'dis':$('#bdis').classList.toggle('on');$('#blike').classList.remove('on');break;
case 'desc':{const o=t.dataset.open==='1';t.dataset.open=o?'0':'1';const dd=P.d;if(dd&&dd.desc!=null){let h=esc(o?dd.desc.slice(0,220):dd.desc).replace(/\n/g,'<br>');if(!o&&dd.chapters.length)h+='<br><br><b>Chapters</b><br>'+dd.chapters.map(c=>`${fmtDur(c.s)}  ${esc(c.t)}`).join('<br>');$('#vdtx').innerHTML=h}break}
case 'cmt':{cs.classList.add('open');scrim.classList.add('show');loadComments(d.id?ITEMS.get(d.id):P.item);break}
case 'ccl':closeSheets();break;
case 'engsheet':engSheet();break;
case 'qsheet':qPrefSheet();break;
case 'ptog':{const k=d.k,on=!Store.pref(k);Store.pref(k,on?1:0);t.classList.toggle('on',on);break}
case 'seg':localStorage.setItem('theme',d.v);applyTheme();$$('#seg button').forEach(b=>b.classList.toggle('on',b===t));break;
case 'gseg':applyGlassMode(d.v,t);break;
case 'impsubs':$('#imp').click();break;
case 'expsubs':{const b=new Blob([Store.exportSubs()],{type:'application/json'}),a=D.createElement('a');a.href=URL.createObjectURL(b);a.download='tube-subscriptions.json';D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);break}
case 'clrhist':if(confirm('Clear watch history and resume positions?')){Store.clearHist();renderYou();toast('Watch history cleared')}break;
}});
async function loadComments(v){if(!v)return;const list=$('#clist');list.innerHTML='<div class="empty">Loading comments...</div>';
if(v.id.startsWith('demo')){list.innerHTML=CM.map(c=>cm({a:'@'+CH[c[0]][0].toLowerCase().replace(/\W/g,''),t:c[1],when:c[3],likes:c[2],id:'demo:'+c[0],ini:CH[c[0]][2]})).join('');$('#cmn2').textContent='482';return}
const r=await Engine.comments(v.id);$('#cmn2').textContent=r.count?compact(r.count):'';
list.innerHTML=r.disabled?'<div class="empty">Comments are turned off</div>':r.items.length?r.items.map(cm).join(''):`<div class="empty">${r.failed?'Could not load comments':'No comments yet'}</div>`;
if(r.items[0]&&P.item&&P.item.id===v.id){$('#cm1').textContent=r.items[0].t;$('#cmn').textContent=r.count?compact(r.count):''}}
const cm=c=>`<div class="cm">${avh({chId:c.id||c.a,chn:c.a.replace(/^@/,''),av:c.av,ini:c.ini})}<div><small>${esc(c.pin?'Pinned · ':'')}${esc(c.a)} · ${esc(c.when)}</small><p>${esc(c.t)}</p><div class="lk2"><span style="display:flex;align-items:center;gap:6px">${ic('like')}${esc(typeof c.likes==='number'?compact(c.likes):c.likes)}</span>${ic('like','flip')}${ic('cmt')}${c.heart?'<span style="color:var(--red)">♥</span>':''}</div></div></div>`;
$('#imp').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;const n=Store.importSubs(await f.text());e.target.value='';toast(n<0?'Could not read that file':n+' subscriptions imported');renderSubs();renderYou()});
function bind(sc,hd){let last=0,tk=0;sc.addEventListener('scroll',()=>{monitor();if(tk)return;tk=requestAnimationFrame(()=>{tk=0;const y=sc.scrollTop,d=y-last;if(Math.abs(d)>8){hd.classList.toggle('hide',d>0&&y>60);$('#tabs').classList.toggle('min',d>0&&y>90);last=y}if(y<=4){hd.classList.remove('hide');$('#tabs').classList.remove('min')}})},{passive:true})}
const RT=R;let lvl=RT.classList.contains('glass-off')?2:RT.classList.contains('glass-lite')?1:0,gm=LS.getItem('glass')||'auto',win=0,mon=0;
function monitor(){if(mon||gm!=='auto'||lvl>=2||win>=4||D.hidden)return;mon=1;const d=[];let l=performance.now();const f=t=>{const x=t-l;l=t;if(x<200)d.push(x);if(d.length<50)return requestAnimationFrame(f);mon=0;win++;d.splice(0,6);d.sort((p,q)=>p-q);if(d[Math.floor(d.length*.75)]>26){lvl=Math.min(2,lvl+1);LS.setItem('glasslvl',lvl);setGlass(lvl)}};requestAnimationFrame(f)}
function applyGlassMode(m,t){gm=m;LS.setItem('glass',gm);win=0;if(gm==='auto'){LS.removeItem('glasslvl');lvl=0}else lvl=gm==='off'?2:0;setGlass(lvl);$$('#gseg button').forEach(b=>b.classList.toggle('on',b===t||b.dataset.v===gm&&!t))}
bind($('#sc-home'),$('#hd-home'));bind($('#sc-subs'),$('#hd-subs'));bind($('#sc-you'),$('#hd-you'));
$$('#gseg button').forEach(b=>b.classList.toggle('on',b.dataset.v===gm));
const th=LS.getItem('theme')||'auto';$$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.v===th));
(async()=>{drawChips();feed.innerHTML=skel(3);const s=await Engine.init();seedDemo();toast(s.kind==='demo'?'Engine not reachable. Showing demo content.':'Connected to '+s.name);loadHome();renderSubs();renderYou()})();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');
window.__tube={go,openP:id=>openP(ITEMS.get(id)),minimize,openS,results,sheet,closeSheets,itemMenu:id=>itemMenu(ITEMS.get(id)),openChannel,openList,vset,qualSheet,subSheet,engSheet,speedSheet,toast,P,Store,getLvl:()=>lvl,cs:()=>{cs.classList.add('open');scrim.classList.add('show');loadComments(P.item)},openComments:id=>{cs.classList.add('open');scrim.classList.add('show');loadComments(ITEMS.get(id)||P.item)},ITEMS,loadHome,renderSubs};
})();
