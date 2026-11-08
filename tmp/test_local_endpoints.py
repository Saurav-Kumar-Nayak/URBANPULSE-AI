import urllib.request
import json

base = "http://localhost:8000"
endpoints = [
    "/api/health",
    "/api/readiness",
    "/api/overview",
    "/api/anomalies"
]

print("--- TESTING LOCAL BACKEND ENDPOINTS ---")
for ep in endpoints:
    url = base + ep
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read().decode('utf-8')
            print(f"[PASS] {ep} -> Status: {resp.status} | Data preview: {data[:120]}")
    except Exception as e:
        print(f"[FAIL] {ep} -> Error: {e}")
