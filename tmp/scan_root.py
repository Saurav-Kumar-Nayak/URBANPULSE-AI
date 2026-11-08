import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

candidates = [
    "https://urbanpulse-ai.onrender.com",
    "https://urbanpulse-backend.onrender.com",
    "https://urbanpulse-ai-backend.onrender.com",
    "https://urbanpulse.onrender.com",
    "https://urbanpulse-ai-1.onrender.com",
    "https://urbanpulse-ai-saurav.onrender.com",
    "https://urbanpulse-saurav.onrender.com",
    "https://urbanpulse-ai-api.onrender.com",
    "https://urbanpulse-ai-web.onrender.com",
    "https://urbanpulse-ai-service.onrender.com"
]

for base in candidates:
    url = base + "/"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
            body = resp.read().decode('utf-8', errors='ignore')
            print(f"[FOUND 200 OK] {url} -> Length: {len(body)} | Title: {body[:300]}")
    except urllib.error.HTTPError as e:
        print(f"[HTTP {e.code}] {url}")
    except Exception as e:
        print(f"[ERR] {url} -> {e}")
