import urllib.request
import json

urls = [
    'https://urbanpulse-ai.onrender.com',
    'https://urbanpulse-ai-backend.onrender.com',
    'https://urbanpulse.onrender.com',
    'https://urbanpulse-backend.onrender.com',
    'https://urbanpulse-ai-platform.onrender.com'
]

for url in urls:
    try:
        req = urllib.request.Request(url + '/api/health', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read().decode('utf-8')
            print(f"[FOUND] {url} -> Status: {resp.status} | Output: {data[:120]}")
    except Exception as e:
        print(f"[NOT FOUND] {url} -> {e}")
