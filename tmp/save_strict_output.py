import urllib.request
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

with open("tmp/strict_output.txt", "w", encoding="utf-8") as f:
    f.write("=== FINAL PUBLIC DEPLOYMENT STRICT VERIFICATION REPORT ===\n\n")
    for ep in endpoints:
        url = base + ep
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=12, context=ssl_ctx) as resp:
                body = resp.read().decode('utf-8', errors='ignore')
                f.write(f"ENDPOINT: {ep}\n")
                f.write(f"HTTP STATUS: {resp.status} OK\n")
                f.write(f"RESPONSE BODY:\n{body[:200]}\n")
                f.write("-" * 50 + "\n")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='ignore')
            f.write(f"ENDPOINT: {ep}\n")
            f.write(f"HTTP STATUS: {e.code} {e.reason}\n")
            f.write(f"RESPONSE BODY:\n{err_body[:200]}\n")
            f.write("-" * 50 + "\n")
        except Exception as e:
            f.write(f"ENDPOINT: {ep}\n")
            f.write(f"ERROR: {e}\n")
            f.write("-" * 50 + "\n")
