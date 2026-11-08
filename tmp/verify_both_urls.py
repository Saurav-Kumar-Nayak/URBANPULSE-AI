import urllib.request
import json
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://urbanpulse-ai-g3mf.onrender.com",
    "https://urban-pulse-ai.onrender.com"
]

endpoints = [
    "/",
    "/api/health",
    "/api/readiness",
    "/api/overview",
    "/api/anomalies"
]

print("=== VERIFYING RENDER PRODUCTION WEB SERVICE ENDPOINTS ===")
for base in urls:
    print(f"\n==================================================")
    print(f" TARGET URL: {base}")
    print(f"==================================================")
    for ep in endpoints:
        target = base + ep
        try:
            req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=12, context=ssl_ctx) as resp:
                body = resp.read().decode('utf-8', errors='ignore')
                print(f"[HTTP {resp.status} OK] {ep} -> {body[:120]}")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='ignore')
            print(f"[HTTP {e.code} {e.reason}] {ep} -> {err_body[:100]}")
        except Exception as e:
            print(f"[ERROR] {ep} -> {e}")
