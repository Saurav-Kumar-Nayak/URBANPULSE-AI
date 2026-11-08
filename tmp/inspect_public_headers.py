import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

url = "https://urban-pulse-ai.onrender.com/"
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
        print("=== HEADERS FOR / ===")
        print("Status:", resp.status)
        for k, v in resp.headers.items():
            print(f"  {k}: {v}")
        body = resp.read().decode('utf-8', errors='ignore')
        print("\n=== HTML TITLE / META PREVIEW ===")
        print(body[:400])
except Exception as e:
    print("Error:", e)
