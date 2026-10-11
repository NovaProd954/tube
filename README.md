# Tube

Mobile web app with the real YouTube layout, iOS style glass and a built in ad free engine layer.

- `tube/` the app (static files, no build step). Serve over HTTPS, then Add to Home Screen.
- `engine/` Tube Engine, a local yt-dlp powered server with a Piped compatible API.

Open `tube/index.html?preview` on a desktop browser for the phone frame.

## Engines

Automatic mode tries, in order: a local Tube Engine on 127.0.0.1:8787, public Piped instances (NewPipe Extractor based, with failover), then demo mode with offline sample data. Custom server URLs work for any Tube Engine or Piped API.

## Features

No ads (feed items flagged as ads are dropped, no ad streams are ever requested), SponsorBlock skipping with markers on the seek bar, Return YouTube Dislike counts, HD playback by syncing separate video and audio streams, quality and speed menus, captions, chapters, double tap to seek, picture in picture, audio only mode with lock screen controls, resume positions, watch history, watch later, liked videos, local subscriptions with an RSS based feed, NewPipe and YouTube Takeout subscription import, NewPipe format export, search suggestions, channel pages, comments, downloads, Shorts feed, queue and autoplay.

## Settings

You > Settings: engine, default quality, SponsorBlock, dislike counts, autoplay, appearance, glass effects (Auto/On/Off), subscription import and export, clear history.

Font: Inter, SIL OFL license, in `tube/fonts/`.
