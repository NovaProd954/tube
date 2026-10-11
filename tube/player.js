const Player=(()=>{
const $=s=>document.querySelector(s),v=$('#vel'),a=$('#ael');
let D=null,mode='sim',cand=[],qi=0,order=[],ei=0,sb=[],simT=0,simIv=0,playing=false,aOnly=false,rate=1,stalled=0,cb={},lastSave=0,lastMs=0,tracks={},subOn=-1;
const can=m=>{if(!m)return true;const x=v.canPlayType(m);return x==='probably'||x==='maybe'},mm=s=>s.mime?(s.codec?`${s.mime}; codecs="${s.codec}"`:s.mime):'';
const useA=()=>mode==='dual'||aOnly,M=()=>useA()?a:v;
const dur=()=>{if(mode==='sim')return D?D.sec:0;const d=M().duration;return Number.isFinite(d)&&d>0?d:(D?D.sec:0)},cur=()=>mode==='sim'?simT:(M().currentTime||0);
function build(d){
const L=[];
d.combined.filter(s=>can(mm(s))).forEach(s=>L.push({h:s.h,type:'prog',v:s.url,label:s.label||s.h+'p',p:/avc1|mp4a/.test(s.codec)?0:1}));
const au=d.audio.filter(s=>can(mm(s))).sort((x,y)=>y.br-x.br)[0];
if(au)d.video.filter(s=>can(mm(s))).forEach(s=>L.push({h:s.h,type:'dual',v:s.url,a:au.url,label:(s.label||s.h+'p'),p:/avc1/.test(s.codec)?0:1,hd:1}));
L.sort((x,y)=>y.h-x.h||(x.type===y.type?x.p-y.p:x.type==='prog'?-1:1));
const seen=new Set();return L.filter(x=>{const k=x.h+x.type;if(seen.has(k))return false;seen.add(k);return true})}
const mkOrder=i=>{const o=[i];for(let k=i+1;k<cand.length;k++)o.push(k);for(let k=i-1;k>=0;k--)o.push(k);return o};
function pickQ(pref){const i=cand.findIndex(c=>c.h<=pref);return i<0?cand.length-1:i}
function apply(t0,autoplay=true){
const c=cand[order[ei]];qi=order[ei];stalled=0;
v.pause();a.pause();
mode=c.type==='dual'?'dual':'prog';aOnly=false;
v.muted=mode==='dual';v.poster=D.th||'';
v.src=c.v;v.load();
if(mode==='dual'){a.src=c.a;a.load()}else{a.removeAttribute('src');a.load()}
const set=t=>{try{if(t>0){v.currentTime=t;if(mode==='dual')a.currentTime=t}}catch{}};
if(t0>0)v.addEventListener('loadedmetadata',()=>set(t0),{once:true});
v.playbackRate=a.playbackRate=rate;
if(autoplay)playAll();else{playing=false;cb.state&&cb.state(false)}
cb.quality&&cb.quality(c)}
function playAll(){playing=true;const ok=e=>{const q=e.play();q&&q.catch(()=>{if(e===M()){playing=false;cb.state&&cb.state(false)}})};if(aOnly)ok(a);else if(mode==='dual'){ok(v);ok(a)}else ok(v);cb.state&&cb.state(true);ms()}
function pauseAll(){playing=false;v.pause();a.pause();cb.state&&cb.state(false)}
function tick(){
const t=cur(),d=dur();
if(mode==='dual'&&!aOnly&&!stalled&&Math.abs(v.currentTime-a.currentTime)>.35)v.currentTime=a.currentTime;
if(sb.length&&Store.pref('sb')){const s=sb.find(x=>t>=x.a&&t<x.b-.4);if(s){seek(Math.min(s.b,d||s.b));cb.skip&&cb.skip(s.c);return}}
const now=performance.now();
if(D&&!D.live&&t>5&&now-lastSave>5000){lastSave=now;Store.setProg(D.id,t>d-10?0:t)}
if(now-lastMs>1000){lastMs=now;ms2(t,d)}
cb.tick&&cb.tick(t,d)}
function seek(t){t=Math.max(0,Math.min(t,dur()||t));if(mode==='sim')simT=t;else{try{if(useA()){a.currentTime=t;if(mode==='dual')v.currentTime=t}else v.currentTime=t}catch{}}tick()}
function onErr(){if(mode==='sim')return;if(ei+1<order.length){const t=cur();ei++;cb.retry&&cb.retry(cand[order[ei]]);apply(t)}else cb.fail&&cb.fail()}
[v,a].forEach(e=>{
e.addEventListener('timeupdate',x=>{if(x.target===M())tick()});
e.addEventListener('ended',x=>{if(x.target===M()&&mode!=='sim'){playing=false;cb.state&&cb.state(false);cb.end&&cb.end()}});
e.addEventListener('error',x=>{if(x.target===M()&&(x.target.getAttribute('src')))onErr()});
e.addEventListener('waiting',()=>{if(mode==='dual'&&!aOnly&&playing&&!stalled){stalled=1;v.pause();a.pause()}});
e.addEventListener('canplay',()=>{if(stalled&&v.readyState>=3&&a.readyState>=3){stalled=0;v.play().catch(()=>{});a.play().catch(()=>{})}});
e.addEventListener('progress',x=>{if(x.target===M()&&cb.buf){const b=x.target.buffered,d=dur();if(b.length&&d)cb.buf(b.end(b.length-1)/d)}});
e.addEventListener('pause',x=>{if(x.target===M()&&x.target.paused&&!stalled&&playing&&mode!=='sim'&&!x.target.ended){playing=false;if(mode==='dual')v.pause();cb.state&&cb.state(false)}});
e.addEventListener('play',x=>{if(x.target===M()&&!playing&&mode!=='sim'){playing=true;if(mode==='dual')v.play().catch(()=>{});cb.state&&cb.state(true)}})});
function ms(){if(!('mediaSession' in navigator)||!D)return;try{navigator.mediaSession.metadata=new MediaMetadata({title:D.title,artist:D.chn,artwork:D.th?[{src:D.th,sizes:'320x180'}]:[]});const h=navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);h('play',()=>api.play());h('pause',()=>api.pause());h('seekbackward',()=>seek(cur()-10));h('seekforward',()=>seek(cur()+10));h('seekto',e=>seek(e.seekTime));h('nexttrack',()=>cb.next&&cb.next());h('previoustrack',()=>seek(0))}catch{}}
function ms2(t,d){if(!('mediaSession' in navigator)||!navigator.mediaSession.setPositionState||!d)return;try{navigator.mediaSession.setPositionState({duration:d,position:Math.min(t,d),playbackRate:rate})}catch{}}
function vtt(x){const o=[],ts=s=>s.split(':').reduce((p,c)=>p*60+parseFloat(c),0);x.replace(/\r/g,'').split(/\n\n+/).forEach(b=>{const l=b.split('\n'),i=l.findIndex(z=>z.includes('-->'));if(i<0)return;const m=l[i].match(/([\d:.]+)\s*-->\s*([\d:.]+)/);if(!m)return;const tx=l.slice(i+1).join('\n').replace(/<[^>]+>/g,'').trim();if(tx)o.push([ts(m[1]),ts(m[2]),tx])});return o}
const api={
on:(n,f)=>{cb[n]=f},
load(d,o={}){
clearInterval(simIv);D=d;sb=[];tracks={};subOn=-1;ei=0;lastSave=0;
v.removeAttribute('src');a.removeAttribute('src');
const start=o.start||0;
if(o.sim){mode='sim';cand=[];simT=start;playing=true;aOnly=false;cb.state&&cb.state(true);simIv=setInterval(()=>{if(!playing)return;simT+=.25;if(simT>=d.sec){simT=d.sec;playing=false;cb.state&&cb.state(false);cb.end&&cb.end();return}cb.tick&&cb.tick(simT,d.sec)},250);return{ok:true}}
cand=d.live&&d.hls?[{h:0,type:'hls',v:d.hls,label:'Live',p:0}]:build(d);
if(!cand.length)return{ok:false,reason:'No playable stream for this device'};
order=mkOrder(pickQ(o.pref||720));apply(start);ms();return{ok:true}},
play(){if(mode==='sim'){playing=true;cb.state&&cb.state(true)}else playAll()},
pause(){if(mode==='sim'){playing=false;cb.state&&cb.state(false)}else pauseAll()},
toggle(){playing?api.pause():api.play()},
seek,cur,dur,
playing:()=>playing,mode:()=>mode,
rate:r=>{if(r===undefined)return rate;rate=r;v.playbackRate=a.playbackRate=r},
quals:()=>cand.map((c,i)=>({i,label:c.label+(c.type==='dual'?' · HD':''),on:i===qi})),
setQ(i){if(mode==='sim'||!cand[i])return;const t=cur(),was=playing;order=mkOrder(i);ei=0;apply(t,was)},
audioOnly:()=>aOnly,
setAudioOnly(b){if(mode==='sim'||!D)return false;const t=cur();if(b){const au=D.audio.filter(s=>can(mm(s))).sort((x,y)=>y.br-x.br)[0];if(!au)return false;const was=playing;v.pause();aOnly=true;a.src=au.url;a.load();a.playbackRate=rate;a.addEventListener('loadedmetadata',()=>{try{a.currentTime=t}catch{}},{once:true});was?playAll():0;return true}aOnly=false;a.pause();if(mode!=='dual'){a.removeAttribute('src');a.load()}const was=playing;apply(t,was);return true},
setSb:l=>{sb=l||[]},sbList:()=>sb,
async setSub(i){const el=v;[...el.textTracks].forEach(t=>t.mode='disabled');subOn=i;if(i<0||!D||!D.subs_[i])return;const s=D.subs_[i];try{if(!tracks[s.url]){const r=await fetch(s.url);const txt=await r.text();const tr=el.addTextTrack('subtitles',s.name,s.code||'en');vtt(txt).forEach(c=>{try{tr.addCue(new VTTCue(c[0],c[1],c[2]))}catch{}});tracks[s.url]=tr}[...el.textTracks].forEach(t=>t.mode='disabled');tracks[s.url].mode='showing'}catch{}},
subOn:()=>subOn,
async pip(){try{if(document.pictureInPictureEnabled&&v.requestPictureInPicture){if(document.pictureInPictureElement)await document.exitPictureInPicture();else await v.requestPictureInPicture();return true}if(v.webkitSupportsPresentationMode&&v.webkitSupportsPresentationMode('picture-in-picture')){v.webkitSetPresentationMode(v.webkitPresentationMode==='picture-in-picture'?'inline':'picture-in-picture');return true}}catch{}return false},
stop(){clearInterval(simIv);playing=false;v.pause();a.pause();v.removeAttribute('src');v.load();a.removeAttribute('src');a.load();D=null;sb=[]},
d:()=>D,video:v,audio:a
};
return api})();
