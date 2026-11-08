import urllib.request
import json
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

base = "https://urban-pulse-ai.onrender.com"
endpoints = [
    "/",
    "/api/health",
    "/api/readiness",
    "/api/overview",
    "/api/anomalies"
]

print("=== FINAL PUBLIC DEPLOYMENT STRICT VERIFICATION ===")
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12, context=ssl_ctx) as resp:
            body = resp.read().decode('utf-8', errors='ignore')
            print(f"\n--- {ep} ---")
            print(f"HTTP STATUS: {resp.status}")
            print(f"RESPONSE BODY PREVIEW:\n{body[:250]}")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        print(f"\n--- {ep} ---")
        print(f"HTTP STATUS: {e.code} ({e.reason})")
        print(f"RESPONSE BODY PREVIEW:\n{err_body[:250]}")
    except Exception as e:
        print(f"\n--- {ep} ---")
        print(f"ERROR: {e}")
