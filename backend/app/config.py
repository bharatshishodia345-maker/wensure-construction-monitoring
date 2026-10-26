from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field, model_validator
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_FILE = os.path.join(PROJECT_ROOT, "wensure.db").replace("\\", "/")
DEFAULT_DB_URL = f"sqlite+aiosqlite:///{DEFAULT_DB_FILE}"

class Settings(BaseSettings):
    APP_NAME: str = "WENSURE API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    DATABASE_URL: str = DEFAULT_DB_URL

    JWT_SECRET: str = "wensure_dev_secret_key_8f3c7a912e5b4d6a8f1e2c3d4b5a6"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ]

    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE_MB: int = 25

    model_config = {
        "env_file": os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        "extra": "ignore",
    }

    @model_validator(mode="after")
    def validate_settings(self):
        # Resolve relative SQLite database URLs deterministically to PROJECT_ROOT
        if self.DATABASE_URL.startswith("sqlite+aiosqlite:///./"):
            relative_part = self.DATABASE_URL.replace("sqlite+aiosqlite:///./", "")
            resolved_path = os.path.join(PROJECT_ROOT, relative_part).replace("\\", "/")
            self.DATABASE_URL = f"sqlite+aiosqlite:///{resolved_path}"
        elif self.DATABASE_URL.startswith("sqlite:///./"):
            relative_part = self.DATABASE_URL.replace("sqlite:///./", "")
            resolved_path = os.path.join(PROJECT_ROOT, relative_part).replace("\\", "/")
            self.DATABASE_URL = f"sqlite:///{resolved_path}"

        # Production security validation
        if self.APP_ENV == "production":
            insecure_secrets = [
                "wensure_dev_secret_key_8f3c7a912e5b4d6a8f1e2c3d4b5a6",
                "secret",
                "changeme",
                "default_secret",
            ]
            if not self.JWT_SECRET or self.JWT_SECRET in insecure_secrets or len(self.JWT_SECRET) < 32:
                raise ValueError(
                    "Production configuration error: Insecure default or weak JWT_SECRET is not permitted in production mode. "
                    "Configure a strong secret of at least 32 characters via environment variables."
                )
        return self

settings = Settings()
