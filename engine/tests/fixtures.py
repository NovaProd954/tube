import json,os,sys,threading,re
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..'))
import tube_engine as te
M='http://127.0.0.1:8124/'
def fmt(fid,ext,vc,ac,h=0,fps=0,tbr=0,abr=0,url=None,proto='https',note='',lang=None):
    return {'format_id':fid,'ext':ext,'vcodec':vc,'acodec':ac,'height':h,'width':int(h*16/9) if h else 0,'fps':fps,'tbr':tbr,'abr':abr,'url':url,'protocol':proto,'format_note':note,'language':lang,'filesize':1234567}
def video_info(vid):
    return {'id':vid,'title':'Fixture: Building a tiny language model','description':'Chapters and notes.\nSecond line with <b>html</b>.','channel':'Nova Labs','channel_id':'UC'+'a'*22,'channel_follower_count':1800000,'channel_is_verified':True,'view_count':1234567,'like_count':48000,'duration':24,'upload_date':'20260501','timestamp':1777593600,'categories':['Science & Technology'],'tags':['ml','tiny'],'is_live':False,
    'chapters':[{'title':'Intro','start_time':0},{'title':'Training','start_time':8},{'title':'Results','start_time':16}],
    'formats':[fmt('18','webm','vp8','opus',360,24,500,url=M+'combined360.webm'),fmt('136','webm','vp8','none',720,24,900,url=M+'video720.webm'),fmt('140','webm','none','opus',tbr=129,abr=128,url=M+'audio.webm',note='medium'),fmt('sb0','mhtml','none','none',url='http://x/sb',proto='mhtml'),fmt('hls1','mp4','avc1','mp4a',360,url='http://x/a.m3u8',proto='m3u8_native')],
    'subtitles':{'en':[{'ext':'vtt','url':'http://127.0.0.1:8124/en.vtt','name':'English'}]},'automatic_captions':{'en-orig':[{'ext':'vtt','url':'http://127.0.0.1:8124/en.vtt','name':'English (Original)'}],'fr':[{'ext':'vtt','url':'http://127.0.0.1:8124/en.vtt','name':'French'}]},
    'comments':[{'id':'c1','text':'Great walkthrough, subscribed!','author':'Ana','author_id':'UC'+'b'*22,'author_thumbnail':None,'like_count':2100,'_time_text':'2 days ago','parent':'root','is_pinned':True},{'id':'c2','text':'Reply should be dropped','author':'Bob','parent':'c1'},{'id':'c3','text':'Chapter 3 is the best part.','author':'Cy','author_id':'UC'+'c'*22,'like_count':412,'_time_text':'1 day ago','parent':'root','is_favorited':True}]}
def ent(i,title,ch,cid,d,views,live=None):
    return {'id':'fixture%04d'%i if False else ('fx'+str(i).zfill(9))[:11],'title':title,'channel':ch,'channel_id':cid,'duration':d,'view_count':views,'live_status':live,'url':'https://www.youtube.com/watch?v='+('fx'+str(i).zfill(9))[:11]}
CHS=[('Nova Labs','UC'+'a'*22),('Quiet Kitchen','UC'+'d'*22),('Trail & Tide','UC'+'e'*22),('Pixel Pioneers','UC'+'f'*22)]
TITLES=['Training a Tiny Language Model on a Phone','The 15-Minute Pasta That Changed My Weeknights',"Walking Japan's Coast: 12 Days, One Backpack",'Why Your Phone Feels Slow (And How to Fix It)','Build a Weather App in One Evening','Quick tip: faster builds','Live: Midnight Synth Set','Silicon Explained in 10 Minutes']
def search_res():
    es=[]
    for i,t in enumerate(TITLES):
        c=CHS[i%4];d=[1122,547,1935,38,52,45,0,603][i]
        es.append(ent(i,t,c[0],c[1],d,[1200000,845000,2400000,3100000,612000,90000,8200,2700000][i],'is_live' if i==6 else None))
    es.append({'id':'bad','title':'dropped: invalid id'})
    return {'entries':es}
def extract(url,**o):
    if url.startswith('ytsearch'):return search_res()
    m=re.search(r'watch\?v=([\w-]{11})',url)
    if m:return video_info(m.group(1))
    if '/channel/' in url:
        r=search_res();r['channel']='Nova Labs';r['channel_follower_count']=1800000;r['description']='Small models, big ideas.';r['thumbnails']=[{'id':'avatar_uncropped','url':'http://127.0.0.1:8124/avatar.svg'},{'id':'banner_uncropped','url':'http://127.0.0.1:8124/banner.svg'}];r['title']='Nova Labs - Videos'
        for e in r['entries']:e.pop('channel',None);e.pop('channel_id',None)
        return r
    raise RuntimeError('no fixture')
FEED='''<?xml version="1.0" encoding="UTF-8"?><feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom"><yt:channelId>%s</yt:channelId><title>%s</title><author><name>%s</name></author>%s</feed>'''
ENTRY='''<entry><yt:videoId>%s</yt:videoId><yt:channelId>%s</yt:channelId><title>%s</title><link rel="alternate" href="https://www.youtube.com/%s"/><author><name>%s</name></author><published>%s</published><media:group><media:community><media:statistics views="%d"/></media:community></media:group></entry>'''
def fake_get(u,t=15):
    if '127.0.0.1' in u:
        import urllib.request
        return urllib.request.urlopen(u,timeout=5).read()
    if 'feeds/videos.xml' in u:
        cid=u.split('channel_id=')[1];n=[c for c in CHS if c[1]==cid]
        name=n[0][0].replace('&','&amp;') if n else 'Chan'
        es=ENTRY%('feed'+cid[2:3]+'000001',cid,'New upload from '+name,'watch?v=x',name,'2026-09-2%sT10:00:00+00:00'%(ord(cid[2])%9),1000)+ENTRY%('feed'+cid[2:3]+'000002',cid,'A short from '+name,'shorts/x',name,'2026-09-15T10:00:00+00:00',5)
        return (FEED%(cid,name,name,es)).encode()
    if 'suggestqueries' in u:
        q=u.split('q=')[1]
        return json.dumps([q,[q+' tutorial',q+' explained',q+' 2026']]).encode()
    raise RuntimeError('no fixture for '+u)
VTT=b'WEBVTT\n\n00:00:01.000 --> 00:00:04.000\nHello from the fixture subtitles\n\n00:00:05.000 --> 00:00:08.000\n<c>Second</c> caption line\n'
def media_server():
    from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
    root=os.path.join(os.path.dirname(__file__),'media')
    class R(BaseHTTPRequestHandler):
        protocol_version='HTTP/1.1'
        def log_message(self,*a):pass
        def do_GET(self):
            n=self.path.split('?')[0].lstrip('/')
            if n=='en.vtt':b=VTT;ct='text/vtt'
            elif n in('avatar.svg','banner.svg'):b=b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="#3b82f6"/></svg>';ct='image/svg+xml'
            else:
                p=os.path.join(root,n)
                if not os.path.isfile(p):self.send_response(404);self.send_header('Content-Length','0');self.end_headers();return
                b=open(p,'rb').read();ct='video/webm'
            rg=self.headers.get('Range');code=200;hd=[]
            if rg:
                m=re.match(r'bytes=(\d*)-(\d*)',rg);s=int(m.group(1) or 0);e=int(m.group(2)) if m.group(2) else len(b)-1;e=min(e,len(b)-1)
                hd.append(('Content-Range',f'bytes {s}-{e}/{len(b)}'));b=b[s:e+1];code=206
            self.send_response(code);self.send_header('Content-Type',ct);self.send_header('Content-Length',str(len(b)));self.send_header('Accept-Ranges','bytes');self.send_header('Access-Control-Allow-Origin','*')
            for k,v in hd:self.send_header(k,v)
            self.end_headers()
            try:self.wfile.write(b)
            except Exception:pass
    s=ThreadingHTTPServer(('127.0.0.1',8124),R);s.daemon_threads=True;return s
def start():
    os.environ['TUBE_ALLOW_HOSTS']='127.0.0.1'
    te.EXTRA[:]=['127.0.0.1'];te.EXTRACT=extract;te.http_get=fake_get
    threading.Thread(target=media_server().serve_forever,daemon=True).start()
    s=te.serve('127.0.0.1',8787);threading.Thread(target=s.serve_forever,daemon=True).start();return s
if __name__=='__main__':
    start();print('fixture engine on 8787, media on 8124',flush=True)
    threading.Event().wait()
