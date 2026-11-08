import urllib.request
import json
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

url = "https://urbanpulse-backend.onrender.com/api/health"
print(f"Connecting to {url} with 60s timeout...")
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60, context=ssl_ctx) as resp:
        body = resp.read().decode('utf-8')
        print(f"SUCCESS: {resp.status}")
        print(body)
except Exception as e:
    print(f"ERROR: {e}")
