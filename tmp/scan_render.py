import urllib.request
import json
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

candidates = [
    "https://urbanpulse-backend.onrender.com",
    "https://urbanpulse-ai.onrender.com",
    "https://urbanpulse-ai-backend.onrender.com",
    "https://urban-pulse-ai.onrender.com",
    "https://urbanpulse.onrender.com",
    "https://urbanpulse-ai-1.onrender.com",
    "https://urbanpulse-ai-saurav.onrender.com",
    "https://urbanpulse-saurav.onrender.com",
    "https://urbanpulse-ai-api.onrender.com"
]

found = []
for base in candidates:
    for path in ["/api/health", "/"]:
        url = base + path
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=5, context=ssl_ctx) as resp:
                body = resp.read().decode('utf-8', errors='ignore')
                print(f"[SUCCESS] {url} -> Status {resp.status} | Body preview: {body[:100]}")
                found.append((url, resp.status, body[:200]))
        except urllib.error.HTTPError as e:
            print(f"[HTTP {e.code}] {url} -> {e.reason}")
            if e.code in [200, 301, 302, 401, 403]:
                found.append((url, e.code, e.reason))
        except Exception as e:
            print(f"[ERR] {url} -> {e}")

print("\n--- SUMMARY OF MATCHES ---")
print(found)
