import urllib.request
import json
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

hosts = [
    "https://urban-pulse-ai.onrender.com",
    "https://urbanpulse-backend.onrender.com",
    "https://urbanpulse-ai.onrender.com",
    "https://urbanpulse-ai-backend.onrender.com"
]

def make_req(base, path, method="GET", payload=None, token=None):
    url = base + path
    headers = {"User-Agent": "Mozilla/5.0", "Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = json.dumps(payload).encode('utf-8') if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=12, context=ssl_ctx) as resp:
            body = resp.read().decode('utf-8')
            return {"status": resp.status, "path": path, "ok": True, "body": body[:200]}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        return {"status": e.code, "path": path, "ok": False, "error": err_body[:150]}
    except Exception as e:
        return {"status": 0, "path": path, "ok": False, "error": str(e)}

for host in hosts:
    print(f"\n==========================================")
    print(f" TESTING HOST: {host}")
    print(f"==========================================")
    for path in ["/api/health", "/api/v1/health", "/health", "/docs"]:
        res = make_req(host, path)
        print(f"  {path} -> Status: {res['status']} | OK: {res['ok']} | Body: {res.get('body') or res.get('error')}")
