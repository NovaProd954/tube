import os,subprocess,imageio_ffmpeg
d=os.path.join(os.path.dirname(__file__),'media');os.makedirs(d,exist_ok=True)
f=imageio_ffmpeg.get_ffmpeg_exe()
def r(*a):subprocess.check_call([f,'-y','-loglevel','error',*a])
r('-f','lavfi','-i','testsrc2=size=640x360:rate=24','-f','lavfi','-i','sine=frequency=440:sample_rate=48000','-t','24','-c:v','libvpx','-b:v','350k','-deadline','realtime','-cpu-used','8','-g','24','-c:a','libopus','-b:a','64k',d+'/combined360.webm')
r('-f','lavfi','-i','testsrc2=size=1280x720:rate=24','-t','24','-an','-c:v','libvpx','-b:v','900k','-deadline','realtime','-cpu-used','8','-g','24',d+'/video720.webm')
r('-f','lavfi','-i','sine=frequency=440:sample_rate=48000','-t','24','-c:a','libopus','-b:a','96k',d+'/audio.webm')
