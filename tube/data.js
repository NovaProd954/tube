const CH=[['Nova Labs',210,'NL','1.8M'],['Quiet Kitchen',24,'QK','920K'],['Trail & Tide',160,'TT','2.6M'],['Pixel Pioneers',280,'PP','3.4M'],['Dev Hour',250,'DH','740K'],['Studio Mono',340,'SM','1.1M'],['Orbit Daily',190,'OD','5.2M'],['Coffee Cinema',35,'CC','610K'],['Iron Basics',0,'IB','2.2M'],['Loop Sound',300,'LS','8.1M']];
const CATS=['All','Tech','Cooking','Travel','Music','Film','Fitness'];
const PR={0:15,3:62,5:88,8:30},LIVE={14:'8.2K'};
const V=[
[0,'Tech','Training a Tiny Language Model on a Phone','TINY\nLLM','1.2M','3 days ago','18:42'],
[1,'Cooking','The 15-Minute Pasta That Changed My Weeknights','15 MIN\nPASTA','845K','1 week ago','9:07'],
[2,'Travel',"Walking Japan's Coast: 12 Days, One Backpack",'COAST\nWALK','2.4M','2 weeks ago','32:15'],
[3,'Tech','Why Your Phone Feels Slow (And How to Fix It)','FIX\nLAG','3.1M','5 days ago','11:20'],
[4,'Tech','Build a Weather App in One Evening','WEATHER\nAPP','612K','2 days ago','24:51'],
[5,'Film','How Great Films Use Color to Tell Stories','COLOR\nIN FILM','1.8M','1 month ago','21:33'],
[6,'Tech','Inside the Next Moon Mission','MOON\nBOUND','4.6M','4 days ago','14:08'],
[7,'Film','The Last Cinema on the Coast','LAST\nCINEMA','529K','6 days ago','27:40'],
[8,'Fitness','Strength Basics: 4 Lifts, 30 Minutes','4 LIFTS','2.0M','3 weeks ago','30:02'],
[9,'Music','Lo-fi Beats for Deep Focus','LO-FI\nFOCUS','7.9M','2 months ago','1:02:11'],
[1,'Cooking','Sourdough for Complete Beginners','SOURDOUGH\n101','1.1M','2 weeks ago','16:29'],
[2,'Travel','Night Train Across the Alps','NIGHT\nTRAIN','960K','1 day ago','19:55'],
[3,'Tech','Silicon Explained in 10 Minutes','SILICON','2.7M','8 days ago','10:03'],
[8,'Fitness','A Calm 20-Minute Morning Mobility Flow','MORNING\nFLOW','1.4M','4 weeks ago','20:11'],
[9,'Music','Live Session: Midnight Synth Set','SYNTH\nLIVE','833K','12 hours ago','41:36'],
[5,'Film','Shooting a Short Film With Only Natural Light','NATURAL\nLIGHT','371K','5 hours ago','13:48'],
[4,'Tech','Make Your Website Feel Like a Native App','APP\nFEEL','1.5M','2 days ago','15:26'],
[7,'Film','Ten Scenes That Taught Me to Love Movies','10\nSCENES','2.2M','3 months ago','23:17']
].map((r,i)=>({id:i,ch:r[0],cat:r[1],title:r[2],tt:r[3],views:r[4],age:r[5],dur:r[6],pr:PR[i],live:LIVE[i],sec:LIVE[i]?3600:r[6].split(':').reduce((a,b)=>a*60+ +b,0)}));
const SH=[[1,'Cooking','Perfect crispy rice trick','482K','1.2K'],[2,'Travel','Sunrise over the ridge','1.1M','3.4K'],[8,'Fitness','One-minute stretch routine','903K','2.1K'],[9,'Music','Bass line in 30 seconds','2.4M','5.6K'],[4,'Tech','CSS trick nobody told you','716K','980'],[1,'Cooking','Tiny kitchen, big flavor','351K','640'],[9,'Music','Street piano at midnight','3.9M','8.2K'],[6,'Tech','Zero-gravity coffee','1.6M','2.9K']].map((r,i)=>({id:100+i,ch:r[0],cat:r[1],cap:r[2],likes:r[3],cm:r[4]}));
const CM=[[3,'This is the cleanest walkthrough I have seen. Subscribed!','2.1K','2 days ago'],[5,'The pacing here is perfect, never felt rushed.','864','1 day ago'],[7,'Watched this twice already. Chapter 3 hits different.','412','18 hours ago'],[1,'Anyone else rewinding for the part at the end?','233','9 hours ago'],[9,'Great work, please make a part two.','187','5 hours ago'],[2,'Saving this for the weekend.','96','2 hours ago']];
