# Tube

Static, dependency-free mobile web app that follows the real YouTube mobile layout with iOS-style glass surfaces. Serve the folder over HTTPS, then Share > Add to Home Screen on iPhone for full-screen mode. Add `?preview` to the URL to see the status bar and home indicator in a desktop browser.

Font: Inter (variable, latin subset) bundled in `fonts/` under the SIL OFL license.

Glass: header, floating tab bar with sliding lens, mini-player, sheets, toast and player controls share one `.gl` component. The blur sits on a pseudo-element behind the content, so scrolling content never invalidates it. A specular rim, soft shadow and saturated blur give the material. Quality levels: full, lite (10px blur, denser tint) and off (solid). Auto mode starts lite on low-memory or low-core devices, and a scroll-frame monitor steps down only if frames run slow. You > Settings > Glass effects: Auto / On / Off. Reduced-transparency and no-backdrop-filter browsers get solid surfaces.

Performance: vanilla JS, one delegated click handler, transform-only animation on glass elements, CSS-driven playback progress, `content-visibility:auto` on cards, thumbnails generated once as cached SVG data URIs, DOM capped at 48 feed items.
