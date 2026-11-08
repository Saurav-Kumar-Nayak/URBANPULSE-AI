import urllib.request
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
    "/api/alerts"
]

print(f"=== TESTING CLAIMED URL: {base} ===")
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
            body = resp.read().decode('utf-8', errors='ignore')
            print(f"HTTP {resp.status} {ep} -> Length: {len(body)} | Body Preview: {body[:150]}")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        print(f"HTTP {e.code} {ep} -> Reason: {e.reason} | Body Preview: {err_body[:150]}")
    except Exception as e:
        print(f"ERROR {ep} -> {e}")
