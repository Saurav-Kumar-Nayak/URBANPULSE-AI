import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

db_path = os.getenv("DATABASE_URL")
if not db_path:
    # Use normalized absolute path for SQLite
    normalized_db_path = os.path.join(DATA_DIR, "urbanpulse.db").replace("\\", "/")
    DATABASE_URL = f"sqlite:///{normalized_db_path}"
else:
    DATABASE_URL = db_path

class Settings:
    PROJECT_NAME: str = "UrbanPulse AI - Real-World Urban Data Analytics & Predictive Intelligence Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = DATABASE_URL
    JWT_SECRET: str = os.getenv("JWT_SECRET", "urbanpulse_citizen_auth_secret_key_2026")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    def _get_cors_origins(self) -> list:
        env_cors = os.getenv("CORS_ORIGINS")
        if env_cors:
            if env_cors.startswith("["):
                import json
                try:
                    return json.loads(env_cors)
                except Exception:
                    pass
            return [o.strip() for o in env_cors.split(",") if o.strip()]
        
        frontend_url = os.getenv("FRONTEND_URL")
        if frontend_url:
            return [frontend_url.strip(), "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"]
        
        return [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
            "*"
        ]

    @property
    def CORS_ORIGINS(self) -> list:
        return self._get_cors_origins()

settings = Settings()
