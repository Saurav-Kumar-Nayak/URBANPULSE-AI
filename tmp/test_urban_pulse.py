import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://urban-pulse-ai.onrender.com/",
    "https://urban-pulse-ai.onrender.com/api/health",
    "https://urbanpulse-backend.onrender.com/api/health"
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
            print(f"[STATUS {resp.status}] {url} -> {resp.read().decode('utf-8')[:200]}")
    except Exception as e:
        print(f"[ERR] {url} -> {e}")
