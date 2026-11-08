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
    "/api/anomalies"
]

results = {}
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
            results[ep] = f"HTTP {resp.status}"
    except urllib.error.HTTPError as e:
        results[ep] = f"HTTP {e.code}"
    except Exception as e:
        results[ep] = f"ERROR {e}"

for ep, res in results.items():
    print(f"{ep} -> {res}")
