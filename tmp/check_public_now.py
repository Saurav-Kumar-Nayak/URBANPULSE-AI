import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

base = "https://urban-pulse-ai.onrender.com"
endpoints = ["/", "/api/health", "/api/readiness", "/api/overview", "/api/anomalies"]

for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
            data = resp.read().decode('utf-8', errors='ignore')
            print(f"[{resp.status}] {ep} -> {data[:100]}")
    except urllib.error.HTTPError as e:
        print(f"[{e.code}] {ep} -> {e.reason}")
    except Exception as e:
        print(f"[ERR] {ep} -> {e}")
