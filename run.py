import os
import sys
import subprocess

root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")
frontend_dir = os.path.join(root_dir, "frontend")
dist_index = os.path.join(frontend_dir, "dist", "index.html")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    import uvicorn
    import fastapi
    import sqlalchemy
    import pydantic
    import sklearn
    import pandas
except ImportError as e:
    print("\n" + "=" * 66)
    print(" ⚠️  MISSING PYTHON DEPENDENCY DETECTED ")
    print("=" * 66)
    print(f" Error: {e}")
    print("\n Please install all required backend packages by running:")
    print("    pip install -r backend/requirements.txt")
    print("=" * 66 + "\n")
    sys.exit(1)

def ensure_frontend_built():
    if not os.path.exists(dist_index):
        print("[Startup] Frontend build missing. Building React frontend for single-server deployment...")
        npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
        try:
            subprocess.run([npm_cmd, "run", "build"], cwd=frontend_dir, check=True)
            print("[Startup] React frontend built successfully!")
        except Exception as e:
            print(f"[Warning] Automatic frontend build failed: {e}")
            print("Please build manually by running: cd frontend && npm run build")

import socket

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    ensure_frontend_built()
    local_ip = get_local_ip()
    print("==================================================================")
    print(" URBANPULSE AI — UNIFIED SINGLE-SERVER PLATFORM (FRONTEND + BACKEND) ")
    print("==================================================================")
    print(" Local Browser URL:                      http://127.0.0.1:8000")
    print(f" Mobile / LAN Network Link:              http://{local_ip}:8000")
    print(" API Documentation (OpenAPI):           http://127.0.0.1:8000/docs")
    print("==================================================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False, app_dir=backend_dir)

