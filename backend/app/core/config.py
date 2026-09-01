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
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
