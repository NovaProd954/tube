import json,sys,urllib.request,urllib.error
import fixtures
fixtures.start()
B='http://127.0.0.1:8787'
def get(p,h=None):
    r=urllib.request.urlopen(urllib.request.Request(B+p,headers=h or {}));return r
def js(p):return json.loads(get(p).read())
ok=0
def t(name,cond):
    global ok
    print(('PASS ' if cond else 'FAIL ')+name);ok+=0 if cond else 1
h=js('/healthcheck');t('healthcheck',h['ok'] and h['engine']=='tube-engine')
s=js('/search?q=tiny');t('search drops invalid ids',len(s['items'])==8)
it=s['items'][0];t('item schema',it['url'].startswith('/watch?v=') and it['uploaderUrl']=='/channel/'+'UC'+'a'*22 and it['duration']==1122 and it['thumbnail'].endswith('mqdefault.jpg'))
t('live item',s['items'][6]['duration']==-1 and s['items'][6]['livestream'])
t('short flag',s['items'][5]['isShort'] and not s['items'][0]['isShort'])
tr=js('/trending?region=US');t('trending',len(tr)==8)
d=js('/streams/'+it['url'][-11:])
t('detail meta',d['title'].startswith('Fixture') and d['uploaderSubscriberCount']==1800000 and d['duration']==24 and d['uploader']=='Nova Labs')
t('video streams mapped',len(d['videoStreams'])==2 and [v['videoOnly'] for v in d['videoStreams']]==[False,True] and d['videoStreams'][1]['height']==720)
t('mhtml/hls excluded from progressive',all('sb' not in v['url'] and 'm3u8' not in v['url'] for v in d['videoStreams']))
t('audio streams',len(d['audioStreams'])==1 and d['audioStreams'][0]['mimeType']=='audio/webm' and d['audioStreams'][0]['bitrate']==128000)
t('stream urls proxied',d['videoStreams'][0]['url'].startswith('/proxy?u='))
t('chapters',[c['start'] for c in d['chapters']]==[0,8,16])
t('subtitles manual+orig auto only',[c['code'] for c in d['subtitles']]==['en','en-orig'])
c=js('/comments/'+it['url'][-11:]);t('comments top-level only',len(c['comments'])==2 and c['comments'][0]['pinned'] and c['comments'][1]['hearted'])
ch=js('/channel/'+'UC'+'a'*22);t('channel',ch['name']=='Nova Labs' and ch['avatarUrl'].endswith('avatar.svg') and len(ch['relatedStreams'])==8 and ch['relatedStreams'][0]['uploaderName']=='Nova Labs')
f=js('/feed/unauthenticated?channels='+','.join(x[1] for x in fixtures.CHS)+',bogus');t('feed merged+sorted',len(f)==8 and all(f[i]['uploaded']>=f[i+1]['uploaded'] for i in range(len(f)-1)))
t('feed short flag from link',any(x['isShort'] for x in f) and any(not x['isShort'] for x in f))
sg=js('/suggestions?query=tiny');t('suggestions',sg[0]=='tiny tutorial')
r=get(d['videoStreams'][0]['url']);t('proxy 200 + CORS',r.status==200 and r.headers['Access-Control-Allow-Origin']=='*' and len(r.read())>1e5)
r=get(d['videoStreams'][0]['url']+'&dl=My%20Video%3A%20test.webm');t('proxy download header',"attachment" in r.headers['Content-Disposition'] and 'My%20Video' in r.headers['Content-Disposition']);r.close()
r=get(d['videoStreams'][0]['url'],{'Range':'bytes=100-199'});b=r.read();t('proxy range 206',r.status==206 and len(b)==100 and r.headers['Content-Range'].startswith('bytes 100-199/'))
try:get('/proxy?u=http%3A%2F%2Fevil.example%2Fx');t('proxy blocks foreign host',False)
except urllib.error.HTTPError as e:t('proxy blocks foreign host',e.code==403)
v=get(d['subtitles'][0]['url']).read().decode();t('subtitle proxy',v.startswith('WEBVTT'))
o=urllib.request.Request(B+'/search?q=x',method='OPTIONS');ro=urllib.request.urlopen(o);t('preflight PNA',ro.status==204 and ro.headers['Access-Control-Allow-Private-Network']=='true')
try:get('/nope');t('404',False)
except urllib.error.HTTPError as e:t('404',e.code==404)
print('FAILURES',ok);sys.exit(1 if ok else 0)
