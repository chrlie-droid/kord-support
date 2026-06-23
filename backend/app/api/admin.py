from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from backend.app.core.config import get_settings
from backend.app.email_delivery import send_email_code

router = APIRouter(prefix="/admin", tags=["admin"])
ENV_PATH = Path("/app/.env")
SMTP_KEYS = [
    "SMTP_ENABLED",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USERNAME",
    "SMTP_PASSWORD",
    "SMTP_FROM",
    "SMTP_STARTTLS",
    "SMTP_SSL",
]


class EmailSettingsUpdate(BaseModel):
    smtp_enabled: bool = False
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from: str | None = None
    smtp_starttls: bool = True
    smtp_ssl: bool = False


class EmailTestRequest(BaseModel):
    email: EmailStr


def _mask(value: str | None) -> str | None:
    if not value:
        return None
    if len(value) <= 4:
        return "****"
    return value[:2] + "****" + value[-2:]


def _read_env_lines() -> list[str]:
    if not ENV_PATH.exists():
        return []
    return ENV_PATH.read_text(encoding="utf-8").splitlines()


def _write_env_values(values: dict[str, str]) -> None:
    lines = _read_env_lines()
    existing_keys = {line.split("=", 1)[0] for line in lines if "=" in line and not line.strip().startswith("#")}
    next_lines: list[str] = []

    for line in lines:
      if "=" not in line or line.strip().startswith("#"):
          next_lines.append(line)
          continue
      key = line.split("=", 1)[0]
      if key in values:
          next_lines.append(f"{key}={values[key]}")
      else:
          next_lines.append(line)

    for key in SMTP_KEYS:
        if key not in existing_keys and key in values:
            next_lines.append(f"{key}={values[key]}")

    ENV_PATH.write_text("\n".join(next_lines).rstrip() + "\n", encoding="utf-8")
    get_settings.cache_clear()


@router.get("/email-settings")
def get_email_settings():
    settings = get_settings()
    return {
        "smtp_enabled": settings.smtp_enabled,
        "smtp_host": settings.smtp_host,
        "smtp_port": settings.smtp_port,
        "smtp_username": settings.smtp_username,
        "smtp_password_set": bool(settings.smtp_password),
        "smtp_password_masked": _mask(settings.smtp_password),
        "smtp_from": settings.smtp_from,
        "smtp_starttls": settings.smtp_starttls,
        "smtp_ssl": settings.smtp_ssl or settings.smtp_port == 465,
    }


@router.put("/email-settings")
def update_email_settings(payload: EmailSettingsUpdate):
    current = get_settings()
    password = payload.smtp_password if payload.smtp_password else current.smtp_password
    values = {
        "SMTP_ENABLED": str(payload.smtp_enabled).lower(),
        "SMTP_HOST": payload.smtp_host or "",
        "SMTP_PORT": str(payload.smtp_port),
        "SMTP_USERNAME": payload.smtp_username or "",
        "SMTP_PASSWORD": password or "",
        "SMTP_FROM": payload.smtp_from or "",
        "SMTP_STARTTLS": str(payload.smtp_starttls).lower(),
        "SMTP_SSL": str(payload.smtp_ssl).lower(),
    }
    try:
        _write_env_values(values)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Cannot write .env: {exc}") from exc
    return get_email_settings()


@router.post("/email-settings/test")
def test_email_settings(payload: EmailTestRequest):
    try:
        send_email_code(payload.email, "123456")
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"SMTP test failed: {exc}") from exc
    return {"status": "sent", "email": payload.email}
