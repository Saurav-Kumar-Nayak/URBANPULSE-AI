import urllib.request
import concurrent.futures
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

bases = [
    "https://urbanpulse-ai.onrender.com",
    "https://urbanpulse.onrender.com",
    "https://urbanpulse-backend.onrender.com",
    "https://urbanpulse-ai-backend.onrender.com",
    "https://urban-pulse-ai.onrender.com",
    "https://urbanpulse-ai-1.onrender.com",
    "https://urbanpulse-ai-2.onrender.com",
    "https://urbanpulse-ai-web.onrender.com",
    "https://urbanpulse-ai-prod.onrender.com",
    "https://urbanpulse-ai-production.onrender.com",
    "https://urbanpulse-ai-app.onrender.com",
    "https://urbanpulse-ai-service.onrender.com",
    "https://urbanpulse-ai-demo.onrender.com",
    "https://urbanpulse-ai-live.onrender.com"
]

def check(url):
    for path in ["/api/health", "/docs", "/"]:
        full = url + path
        try:
            req = urllib.request.Request(full, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=12, context=ssl_ctx) as resp:
                body = resp.read().decode('utf-8', errors='ignore')
                if resp.status == 200:
                    return f"[FOUND 200!] {full} -> {body[:150]}"
        except urllib.error.HTTPError as e:
            if e.code in [200, 301, 302, 401, 403]:
                return f"[FOUND {e.code}] {full}"
        except Exception:
            pass
    return None

with concurrent.futures.ThreadPoolExecutor(max_workers=15) as ex:
    results = list(ex.map(check, bases))

matches = [r for r in results if r]
print("Found Matches:")
for m in matches:
    print(m)
if not matches:
    print("No active Render instance responding yet.")
