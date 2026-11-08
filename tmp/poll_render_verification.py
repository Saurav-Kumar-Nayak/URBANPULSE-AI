import urllib.request
import time
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

print("Polling public endpoints after Render deployment push...")
for attempt in range(1, 12):
    print(f"\n--- Poll Attempt {attempt}/12 ---")
    all_200 = True
    for ep in endpoints:
        url = base + ep
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
                data = resp.read().decode('utf-8', errors='ignore')
                print(f"[HTTP {resp.status}] {ep} -> {data[:80]}...")
                if resp.status != 200:
                    all_200 = False
        except urllib.error.HTTPError as e:
            print(f"[HTTP {e.code}] {ep} -> {e.reason}")
            all_200 = False
        except Exception as e:
            print(f"[ERROR] {ep} -> {e}")
            all_200 = False
    
    if all_200:
        print("\n🎉 ALL 5 ENDPOINTS RETURNED HTTP 200 OK!")
        break
    
    time.sleep(10)
