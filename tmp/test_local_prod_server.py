import urllib.request
import json
import time

base = "http://127.0.0.1:8000"
endpoints = [
    "/",
    "/api/health",
    "/api/readiness",
    "/api/overview",
    "/api/anomalies"
]

print("--- TESTING LOCAL UNIFIED FASTAPI SERVER ---")
time.sleep(2)

for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read().decode('utf-8')
            print(f"[PASS {resp.status}] {ep} -> {data[:120]}")
    except Exception as e:
        print(f"[FAIL] {ep} -> Error: {e}")
