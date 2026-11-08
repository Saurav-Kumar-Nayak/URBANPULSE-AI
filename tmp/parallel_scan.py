import urllib.request
import concurrent.futures
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://urbanpulse-ai.onrender.com",
    "https://urbanpulse-backend.onrender.com",
    "https://urbanpulse.onrender.com",
    "https://urbanpulse-ai-1.onrender.com",
    "https://urbanpulse-ai-backend.onrender.com",
    "https://urban-pulse-ai.onrender.com",
    "https://urbanpulse-ai-platform.onrender.com",
    "https://urbanpulse-ai-service.onrender.com",
    "https://urbanpulse-app.onrender.com"
]

def check_url(base):
    for path in ["/api/health", "/"]:
        target = base + path
        try:
            req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30, context=ssl_ctx) as resp:
                data = resp.read().decode('utf-8', errors='ignore')
                return f"[MATCH FOUND!] {target} -> Status {resp.status} | Body: {data[:120]}"
        except urllib.error.HTTPError as e:
            if e.code in [200, 301, 302, 401, 403]:
                return f"[HTTP MATCH] {target} -> Status {e.code}"
        except Exception:
            pass
    return f"[NO RESPONSE] {base}"

print("Scanning Render URLs in parallel...")
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(check_url, u) for u in urls]
    for future in concurrent.futures.as_completed(futures):
        res = future.result()
        print(res)
