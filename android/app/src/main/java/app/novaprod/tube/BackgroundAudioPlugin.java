package app.novaprod.tube;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(
    name = "BackgroundAudio",
    permissions = { @Permission(alias = "notifications", strings = { Manifest.permission.POST_NOTIFICATIONS }) }
)
public class BackgroundAudioPlugin extends Plugin {

    @Override
    public void load() {
        PlaybackService.listener = new PlaybackService.Listener() {
            @Override
            public void onAction(String action, double position) {
                JSObject data = new JSObject();
                data.put("action", action);
                data.put("position", position);
                notifyListeners("action", data);
            }
        };
    }

    @PluginMethod
    public void start(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "permissionResult");
            return;
        }
        push(call);
    }

    @PermissionCallback
    private void permissionResult(PluginCall call) {
        push(call);
    }

    @PluginMethod
    public void update(PluginCall call) {
        push(call);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Context ctx = getContext();
        ctx.stopService(new Intent(ctx, PlaybackService.class));
        call.resolve();
    }

    private void push(PluginCall call) {
        String title = call.getString("title", "");
        String artist = call.getString("artist", "");
        boolean playing = call.getBoolean("playing", true);
        double position = call.getDouble("position", 0.0);
        double duration = call.getDouble("duration", 0.0);
        PlaybackService svc = PlaybackService.instance;
        if (svc != null) {
            svc.apply(title, artist, playing, position, duration);
        } else {
            Context ctx = getContext();
            Intent i = new Intent(ctx, PlaybackService.class);
            i.setAction(PlaybackService.A_UPDATE);
            i.putExtra("title", title);
            i.putExtra("artist", artist);
            i.putExtra("playing", playing);
            i.putExtra("position", position);
            i.putExtra("duration", duration);
            ContextCompat.startForegroundService(ctx, i);
        }
        call.resolve();
    }
}
