const Store=(()=>{
const g=(k,d)=>{try{const v=JSON.parse(localStorage.getItem('t.'+k));return v==null?d:v}catch{return d}},s=(k,v)=>{try{localStorage.setItem('t.'+k,JSON.stringify(v))}catch{}};
const D={subs:g('subs',{}),hist:g('hist',[]),later:g('later',[]),liked:g('liked',[]),prog:g('prog',{}),hide:g('hide',[]),pref:Object.assign({q:720,sb:1,ryd:1,auto:1,bg:1},g('pref',{}))};
const slim=v=>({id:v.id,title:v.title,chn:v.chn,chId:v.chId,av:v.av||null,vw:v.vw||'',age:v.age||'',dur:v.dur||'',sec:v.sec||0,th:v.th||null,live:!!v.live,short:!!v.short,n:v.n,cat:v.cat});
function save(k){s(k,D[k])}
const api={
D,pref:(k,v)=>{if(v===undefined)return D.pref[k];D.pref[k]=v;save('pref')},
isSub:id=>!!D.subs[id],
sub:(id,n,a)=>{if(!id)return false;if(D.subs[id]){delete D.subs[id];save('subs');return false}D.subs[id]={n,a:a||null};save('subs');return true},
subIds:()=>Object.keys(D.subs),
addHist:v=>{D.hist=[slim(v),...D.hist.filter(x=>x.id!==v.id)].slice(0,200);save('hist')},
clearHist:()=>{D.hist=[];D.prog={};save('hist');save('prog')},
prog:id=>D.prog[id]||0,
setProg:(id,t)=>{D.prog[id]=Math.floor(t);const k=Object.keys(D.prog);if(k.length>300)delete D.prog[k[0]];save('prog')},
has:(l,id)=>D[l].some(x=>x.id===id),
toggle:(l,v)=>{const h=D[l].some(x=>x.id===v.id);D[l]=h?D[l].filter(x=>x.id!==v.id):[slim(v),...D[l]].slice(0,500);save(l);return!h},
hidden:id=>D.hide.includes(id),
hide:id=>{D.hide.push(id);D.hide=D.hide.slice(-500);save('hide')},
exportSubs:()=>JSON.stringify({app_version:'tube',app_version_int:1,subscriptions:Object.entries(D.subs).filter(([id])=>/^UC/.test(id)).map(([id,x])=>({service_id:0,url:'https://www.youtube.com/channel/'+id,name:x.n}))},null,1),
importSubs:txt=>{let n=0;const add=(id,name)=>{if(/^UC[\w-]{22}$/.test(id)&&!D.subs[id]){D.subs[id]={n:name||id,a:null};n++}};const t=txt.trim();
if(t[0]==='{'){let j;try{j=JSON.parse(t)}catch{return-1}(j.subscriptions||[]).forEach(x=>{const m=(x.url||'').match(/channel\/(UC[\w-]{22})/);if(m&&(x.service_id===0||x.service_id==null))add(m[1],x.name)})}
else t.split(/\r?\n/).slice(1).forEach(l=>{const c=l.split(',');if(c[0])add(c[0].trim(),(c.slice(2).join(',')||'').replace(/^"|"$/g,''))});
save('subs');return n}
};
return api})();
