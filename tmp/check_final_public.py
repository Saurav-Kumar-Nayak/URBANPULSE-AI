import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://urban-pulse-ai.onrender.com/api/health",
    "https://urban-pulse-ai.onrender.com/api/readiness",
    "https://urban-pulse-ai.onrender.com/api/overview",
    "https://urban-pulse-ai.onrender.com/api/anomalies",
    "https://urbanpulse-ai.onrender.com/api/health"
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
            data = resp.read().decode('utf-8')
            print(f"[STATUS {resp.status}] {url} -> {data[:120]}")
    except urllib.error.HTTPError as e:
        print(f"[STATUS {e.code}] {url} -> HTTP Error: {e.reason}")
    except Exception as e:
        print(f"[ERROR] {url} -> {e}")
