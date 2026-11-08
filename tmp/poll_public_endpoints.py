import urllib.request
import time
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://urban-pulse-ai.onrender.com",
    "https://urbanpulse-ai.onrender.com"
]

endpoints = [
    "/api/health",
    "/api/readiness",
    "/api/overview",
    "/api/anomalies"
]

print("Polling public endpoints after Render redeployment...")
for attempt in range(1, 10):
    print(f"\n--- Attempt {attempt}/10 ---")
    for base in urls:
        for ep in endpoints:
            target = base + ep
            try:
                req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
                    data = resp.read().decode('utf-8')
                    print(f"[SUCCESS {resp.status}] {target} -> {data[:100]}")
            except urllib.error.HTTPError as e:
                print(f"[HTTP {e.code}] {target}")
            except Exception as e:
                print(f"[ERR] {target} -> {e}")
    time.sleep(10)
