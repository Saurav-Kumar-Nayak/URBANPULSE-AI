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

print(f"--- FINAL VERIFICATION ON {base} ---")
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=12, context=ssl_ctx) as resp:
            body = resp.read().decode('utf-8', errors='ignore')
            print(f"URL: {url} -> STATUS: {resp.status} | BODY: {body[:120]}")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        print(f"URL: {url} -> STATUS: {e.code} | REASON: {e.reason} | BODY: {err_body[:120]}")
    except Exception as e:
        print(f"URL: {url} -> ERROR: {e}")
