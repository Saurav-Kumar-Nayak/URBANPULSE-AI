import urllib.request
import ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

url = "https://urbanpulse-ai.onrender.com/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
    print("STATUS:", resp.status)
    body = resp.read().decode('utf-8')
    print("BODY LENGTH:", len(body))
    print("BODY PREVIEW:\n", body[:400])
