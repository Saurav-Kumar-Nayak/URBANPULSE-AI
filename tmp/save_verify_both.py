import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://urbanpulse-ai-g3mf.onrender.com",
    "https://urban-pulse-ai.onrender.com"
]

endpoints = [
    "/",
    "/api/health",
    "/api/readiness",
    "/api/overview",
    "/api/anomalies"
]

with open("tmp/verify_both_output.txt", "w", encoding="utf-8") as f:
    for base in urls:
        f.write(f"\n==================================================\n")
        f.write(f" TARGET URL: {base}\n")
        f.write(f"==================================================\n")
        for ep in endpoints:
            target = base + ep
            try:
                req = urllib.request.Request(target, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=12, context=ssl_ctx) as resp:
                    body = resp.read().decode('utf-8', errors='ignore')
                    f.write(f"[HTTP {resp.status} OK] {ep} -> {body[:150]}\n")
            except urllib.error.HTTPError as e:
                err_body = e.read().decode('utf-8', errors='ignore')
                f.write(f"[HTTP {e.code} {e.reason}] {ep} -> {err_body[:150]}\n")
            except Exception as e:
                f.write(f"[ERROR] {ep} -> {e}\n")
