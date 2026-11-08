import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

tile_urls = [
    ("CartoDB Dark", "https://a.basemaps.cartocdn.com/dark_all/13/4661/3610.png"),
    ("CartoDB Voyager", "https://a.basemaps.cartocdn.com/rastertiles/voyager/13/4661/3610.png"),
    ("Esri World Imagery", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3610/4661"),
    ("Esri Street Map", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/13/3610/4661"),
    ("OpenStreetMap Standard", "https://a.tile.openstreetmap.org/13/4661/3610.png"),
]

print("=== TESTING MAP TILE SERVER RESPONSES ===")
for name, url in tile_urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=5, context=ssl_ctx) as resp:
            data = resp.read()
            print(f"[{resp.status} OK] {name} -> size: {len(data)} bytes, content-type: {resp.headers.get('Content-Type')}")
    except urllib.error.HTTPError as e:
        print(f"[{e.code} {e.reason}] {name} -> {url}")
    except Exception as e:
        print(f"[ERROR] {name} -> {e}")
