# Tube Engine

A small local server that gives Tube real YouTube data without ads, accounts or Google APIs. It runs yt-dlp (the most actively maintained extractor) and answers with the same JSON shape as the Piped API, so Tube talks to it exactly like it talks to a Piped instance (which is NewPipe Extractor under the hood).

## Run it

    pip install -U yt-dlp
    python3 tube_engine.py            # http://127.0.0.1:8787

Termux on Android:

    pkg install python
    pip install -U yt-dlp
    python3 tube_engine.py

Open Tube. In Automatic mode it looks for the engine on 127.0.0.1:8787 first, then falls back to public Piped instances, then to demo mode. You can also set a custom URL in You > Settings > Engine.

Run it on the same device or network you watch on. YouTube ties stream links to the requesting IP and blocks most datacenter IPs (Colab, cloud VMs). A phone or home connection is the reliable place for it.

Options: `--host`, `--port`, `--no-proxy` (return direct googlevideo links instead of proxied ones). Set `TUBE_HOME_QUERY` to change what the Home tab shows. Keep yt-dlp updated: `pip install -U yt-dlp`.

## Endpoints

/healthcheck, /trending, /search?q=, /suggestions?query=, /streams/ID, /comments/ID, /channel/UC..., /feed/unauthenticated?channels=UC..,UC.. (RSS based subscription feed), /proxy?u= (range requests, only YouTube/Google media hosts), /subtitle?u=.

## Tests

    python3 tests/make_media.py && python3 tests/test_engine.py

The tests run the real server against fixture data and real local media. They do not contact YouTube, so live extraction depends on your yt-dlp version.

## Notes

The proxy only forwards googlevideo, ytimg, ggpht, youtube and googleusercontent hosts. Do not expose the server to the internet. Using third party clients can go against YouTube's terms of service. yt-dlp is Unlicense, Piped is AGPL, NewPipe Extractor is GPLv3: Tube only talks to them over HTTP and contains none of their code.
