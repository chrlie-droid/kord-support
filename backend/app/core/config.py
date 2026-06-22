from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Kord Support"
    app_env: str = "development"
    app_debug: bool = True
    app_host: str = "0.0.0.0"
    app_port: int = 8085

    database_url: str
    secret_key: str = "change-me-before-production"
    access_token_expire_minutes: int = 1440

    pyrus_enabled: bool = False
    pyrus_login: str | None = None
    pyrus_security_key: str | None = None
    pyrus_form_id: str | None = None
    pyrus_webhook_secret: str | None = None

    telegram_enabled: bool = False
    telegram_bot_token: str | None = None

    cors_origins: str = "http://localhost:8085"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
