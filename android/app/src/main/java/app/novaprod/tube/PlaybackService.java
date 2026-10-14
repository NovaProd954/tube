package app.novaprod.tube;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.drawable.Icon;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

public class PlaybackService extends Service {
    public interface Listener {
        void onAction(String action, double position);
    }

    static final String CHANNEL = "tube_playback";
    static final int NOTIFICATION_ID = 7;
    public static final String A_UPDATE = "app.novaprod.tube.UPDATE";
    public static final String A_PLAY = "app.novaprod.tube.PLAY";
    public static final String A_PAUSE = "app.novaprod.tube.PAUSE";
    public static final String A_NEXT = "app.novaprod.tube.NEXT";
    public static final String A_PREV = "app.novaprod.tube.PREV";
    public static final String A_STOP = "app.novaprod.tube.STOP";

    public static Listener listener;
    public static PlaybackService instance;

    private MediaSession session;
    private PowerManager.WakeLock wakeLock;
    private String title = "";
    private String artist = "";
    private boolean playing = true;
    private double position = 0;
    private double duration = 0;

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(CHANNEL, "Playback", NotificationManager.IMPORTANCE_LOW);
            channel.setShowBadge(false);
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.createNotificationChannel(channel);
            }
        }
        session = new MediaSession(this, "Tube");
        session.setCallback(new MediaSession.Callback() {
            @Override
            public void onPlay() {
                emit("play", 0);
            }

            @Override
            public void onPause() {
                emit("pause", 0);
            }

            @Override
            public void onSkipToNext() {
                emit("next", 0);
            }

            @Override
            public void onSkipToPrevious() {
                emit("previous", 0);
            }

            @Override
            public void onSeekTo(long pos) {
                emit("seekto", pos / 1000.0);
            }

            @Override
            public void onStop() {
                emit("stop", 0);
            }
        });
        session.setActive(true);
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Tube:playback");
            wakeLock.setReferenceCounted(false);
        }
    }

    private void emit(String action, double pos) {
        Listener l = listener;
        if (l != null) {
            l.onAction(action, pos);
        }
    }

    private PendingIntent actionIntent(String action, int code) {
        Intent i = new Intent(this, PlaybackService.class);
        i.setAction(action);
        return PendingIntent.getService(this, code, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private Notification.Action action(int icon, String label, String action, int code) {
        return new Notification.Action.Builder(Icon.createWithResource(this, icon), label, actionIntent(action, code)).build();
    }

    private Notification buildNotification() {
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(this, CHANNEL) : new Notification.Builder(this);
        Intent open = new Intent(this, MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent content = PendingIntent.getActivity(this, 0, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        b.setSmallIcon(android.R.drawable.ic_media_play);
        b.setContentTitle(title.length() > 0 ? title : "Tube");
        b.setContentText(artist);
        b.setContentIntent(content);
        b.setOngoing(playing);
        b.setShowWhen(false);
        b.addAction(action(android.R.drawable.ic_media_previous, "Previous", A_PREV, 1));
        if (playing) {
            b.addAction(action(android.R.drawable.ic_media_pause, "Pause", A_PAUSE, 2));
        } else {
            b.addAction(action(android.R.drawable.ic_media_play, "Play", A_PLAY, 3));
        }
        b.addAction(action(android.R.drawable.ic_media_next, "Next", A_NEXT, 4));
        b.setStyle(new Notification.MediaStyle().setMediaSession(session.getSessionToken()).setShowActionsInCompactView(0, 1, 2));
        return b.build();
    }

    private void updateSession() {
        MediaMetadata.Builder md = new MediaMetadata.Builder();
        md.putString(MediaMetadata.METADATA_KEY_TITLE, title);
        md.putString(MediaMetadata.METADATA_KEY_ARTIST, artist);
        md.putLong(MediaMetadata.METADATA_KEY_DURATION, (long) (duration * 1000));
        session.setMetadata(md.build());
        long actions = PlaybackState.ACTION_PLAY | PlaybackState.ACTION_PAUSE | PlaybackState.ACTION_PLAY_PAUSE | PlaybackState.ACTION_SKIP_TO_NEXT | PlaybackState.ACTION_SKIP_TO_PREVIOUS | PlaybackState.ACTION_SEEK_TO | PlaybackState.ACTION_STOP;
        PlaybackState.Builder ps = new PlaybackState.Builder();
        ps.setActions(actions);
        ps.setState(playing ? PlaybackState.STATE_PLAYING : PlaybackState.STATE_PAUSED, (long) (position * 1000), playing ? 1.0f : 0.0f);
        session.setPlaybackState(ps.build());
    }

    private void goForeground() {
        Notification n = buildNotification();
        if (Build.VERSION.SDK_INT >= 29) {
            startForeground(NOTIFICATION_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(NOTIFICATION_ID, n);
        }
        if (wakeLock != null) {
            if (playing && !wakeLock.isHeld()) {
                wakeLock.acquire();
            } else if (!playing && wakeLock.isHeld()) {
                wakeLock.release();
            }
        }
    }

    public void apply(String t, String a, boolean p, double pos, double dur) {
        title = t == null ? "" : t;
        artist = a == null ? "" : a;
        playing = p;
        position = pos;
        duration = dur;
        updateSession();
        goForeground();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String act = intent == null ? null : intent.getAction();
        if (act == null || A_UPDATE.equals(act)) {
            if (intent != null) {
                apply(intent.getStringExtra("title"), intent.getStringExtra("artist"), intent.getBooleanExtra("playing", true), intent.getDoubleExtra("position", 0), intent.getDoubleExtra("duration", 0));
            } else {
                goForeground();
            }
            return START_NOT_STICKY;
        }
        goForeground();
        if (A_PLAY.equals(act)) {
            emit("play", 0);
        } else if (A_PAUSE.equals(act)) {
            emit("pause", 0);
        } else if (A_NEXT.equals(act)) {
            emit("next", 0);
        } else if (A_PREV.equals(act)) {
            emit("previous", 0);
        } else if (A_STOP.equals(act)) {
            emit("stop", 0);
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        instance = null;
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        if (session != null) {
            session.setActive(false);
            session.release();
            session = null;
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
