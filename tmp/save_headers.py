import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

url = "https://urban-pulse-ai.onrender.com/"
with open("tmp/headers.txt", "w", encoding="utf-8") as f:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
            f.write(f"STATUS: {resp.status}\n")
            for k, v in resp.headers.items():
                f.write(f"{k}: {v}\n")
    except Exception as e:
        f.write(f"ERROR: {e}\n")
