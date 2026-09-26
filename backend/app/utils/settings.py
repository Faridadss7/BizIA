from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[3]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(REPO_ROOT / ".env"),
        extra="ignore",
    )

    api_host: str = "0.0.0.0"
    api_port: int = Field(default=8000, validation_alias=AliasChoices("API_PORT", "PORT"))
    cors_origins: str = "*"
    data_dir: str = "data"
    upload_dir: str = "data/uploads"
    database_path: str = "data/local/bizia.json"
    llm_provider: str = "auto"
    gemini_api_key: str = Field(default="", repr=False)
    gemini_model: str = "gemini-3.5-flash"
    gemini_enrich_analysis: bool = True
    groq_api_key: str = Field(default="", repr=False)
    groq_model: str = "llama-3.3-70b-versatile"
    groq_whisper_model: str = "whisper-large-v3-turbo"
    max_upload_bytes: int = 20 * 1024 * 1024
    default_low_stock_threshold: float = 5
    web_dist: str = "frontend/out"

    # Supabase V2 Configuration
    supabase_url: str = Field(default="", validation_alias=AliasChoices("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"))
    supabase_anon_key: str = Field(default="", repr=False, validation_alias=AliasChoices("SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"))
    supabase_service_role_key: str = Field(default="", repr=False, validation_alias=AliasChoices("SUPABASE_SERVICE_ROLE_KEY"))
    # Clerk Configuration
    clerk_publishable_key: str = Field(default="", validation_alias=AliasChoices("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_PUBLISHABLE_KEY"))
    clerk_secret_key: str = Field(default="", repr=False, validation_alias=AliasChoices("CLERK_SECRET_KEY"))

    secret_key: str = Field(default="bizia_secret_auth_token_key_2026_fata_nexus", validation_alias=AliasChoices("SECRET_KEY", "JWT_SECRET"))

    @property
    def cors_origin_list(self) -> list[str]:
        raw = self.cors_origins.strip()
        if raw == "*":
            return ["*"]
        return [item.strip() for item in raw.split(",") if item.strip()]

    def resolve(self, path: str) -> Path:
        candidate = Path(path)
        if candidate.is_absolute():
            return candidate
        return (REPO_ROOT / candidate).resolve()


settings = Settings()
