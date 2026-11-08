import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

base = "https://urbanpulse-ai.onrender.com"
paths = [
    "/",
    "/docs",
    "/api/health",
    "/api/v1/health",
    "/health",
    "/readiness",
    "/api/readiness",
    "/api/overview",
    "/api/v1/overview"
]

for p in paths:
    url = base + p
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
            print(f"[STATUS {resp.status}] {p} -> {resp.read().decode('utf-8')[:150]}")
    except urllib.error.HTTPError as e:
        print(f"[HTTP {e.code}] {p} -> {e.reason}")
    except Exception as e:
        print(f"[ERR] {p} -> {e}")
