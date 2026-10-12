# Tube

Mobile app with the real YouTube layout, iOS style glass components and its own ad free engine.

## Engine (automatic, nothing to run)

Tube picks its engine by itself, in this order:

1. **On-device engine** in the Android app. youtubei.js (InnerTube client) runs inside the app and talks to YouTube over the phone's own native HTTP stack, which avoids browser CORS limits and uses your own IP, the same model NewPipe uses. Source in `src/engine-local.js`.
2. **Piped instances** (NewPipe Extractor based) with automatic failover. This is what the Vercel web build uses, because a normal browser tab cannot call YouTube directly.
3. **Demo mode** with offline sample data when nothing is reachable.

`engine/` is an optional yt-dlp server for advanced setups (custom server URL in You > Settings > Engine). It is not needed.

## Get the Android app

Every push to `main` builds a debug APK with GitHub Actions. Open the repo's Releases page, download `Tube.apk` from the `apk-latest` release and install it. Or run the "Build Android APK" workflow manually.

## Web build

`vercel.json` serves the `tube/` folder as a static site. The web build works as a PWA (Add to Home Screen) and uses Piped instances or demo mode.

## Layout

- `tube/` the app (static files, no build step except the engine bundle)
- `src/engine-local.js` the on-device engine source, bundled to `tube/engine-local.js` with `npm run build`
- `android/` Capacitor Android project, `capacitor.config.json`
- `.github/workflows/android.yml` APK build
- `engine/` optional yt-dlp server and its tests

## Features

No ads (ad flagged items are dropped, no ad streams requested), SponsorBlock with markers on the seek bar, Return YouTube Dislike counts, HD playback by syncing separate video and audio streams, quality and speed menus, captions, chapters, double tap to seek, fullscreen, picture in picture (browsers), audio only mode, resume positions, watch history, watch later, liked videos, local subscriptions with an RSS based feed, NewPipe and Takeout subscription import, NewPipe format export, search suggestions, channel pages, comments, Shorts, queue and autoplay. Glass effects have Auto/On/Off with an automatic frame-time governor.

## Development

    npm ci
    npm run build            # bundles the on-device engine
    npx cap sync android     # copies the web app into the Android project

Notes: the Android build needs JDK 21 and the Android SDK (CI has both). Third party YouTube clients can go against YouTube's terms of service. youtubei.js is MIT, Inter is OFL.
