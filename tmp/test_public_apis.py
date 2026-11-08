import urllib.request
import json
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "https://urban-pulse-ai.onrender.com"

results = []

def make_request(path, method="GET", payload=None, token=None):
    url = BASE_URL + path
    headers = {"User-Agent": "Mozilla/5.0", "Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(payload).encode('utf-8') if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
            body = resp.read().decode('utf-8')
            parsed = json.loads(body) if resp.headers.get_content_type() == 'application/json' or body.startswith('{') or body.startswith('[') else body[:150]
            return {"status": resp.status, "path": path, "ok": True, "body": parsed}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        return {"status": e.code, "path": path, "ok": False, "error": err_body[:200]}
    except Exception as e:
        return {"status": 0, "path": path, "ok": False, "error": str(e)}

print(f"--- RUNNING PUBLIC API TESTS ON {BASE_URL} ---")

# 1. Health & Readiness
health = make_request("/api/health")
print("1. Health Check:", health)

readiness = make_request("/api/readiness")
print("2. Readiness Check:", readiness)

# 2. Login
login_res = make_request("/api/auth/login", method="POST", payload={"username": "operator", "password": "password123"})
print("3. Auth Login:", login_res)
token = None
if login_res.get("ok") and isinstance(login_res.get("body"), dict):
    token = login_res["body"].get("access_token")

print(f"Extracted JWT Bearer Token: {token[:20] if token else 'None'}...")

# 3. Authenticated Telemetry Endpoints
endpoints = [
    ("/api/overview", "GET", None),
    ("/api/traffic", "GET", None),
    ("/api/pollution", "GET", None),
    ("/api/locations", "GET", None),
    ("/api/anomalies", "GET", None),
    ("/api/predictions", "GET", None),
    ("/api/predictions/predict", "POST", {"pm25": 145.0, "traffic_density": 320, "hour": 18, "zone_id": "LOC_001"}),
    ("/api/insights", "GET", None),
    ("/api/records", "GET", None)
]

for path, method, payload in endpoints:
    res = make_request(path, method=method, payload=payload, token=token)
    print(f"Endpoint {method} {path} -> Status: {res['status']} | OK: {res['ok']}")
    results.append(res)

print("\n--- PUBLIC API TEST SUITE SUMMARY ---")
print(json.dumps(results, indent=2))
