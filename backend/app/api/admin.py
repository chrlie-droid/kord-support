from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from backend.app.core.config import get_settings
from backend.app.notifications import notification_center

router = APIRouter(prefix="/admin", tags=["admin"])
ENV_PATH = Path("/app/.env")
EMAIL_KEYS = [
    "EMAIL_PROVIDER",
    "EMAIL_FROM",
    "RESEND_API_KEY",
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
    email_provider: str = "smtp"
    email_from: str | None = None
    resend_api_key: str | None = None
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
    if len(value) <= 8:
        return "****"
    return value[:4] + "****" + value[-4:]


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

    for key in EMAIL_KEYS:
        if key not in existing_keys and key in values:
            next_lines.append(f"{key}={values[key]}")

    ENV_PATH.write_text("\n".join(next_lines).rstrip() + "\n", encoding="utf-8")
    get_settings.cache_clear()


@router.get("/email-settings")
def get_email_settings():
    settings = get_settings()
    return {
        "email_provider": settings.email_provider,
        "email_from": settings.email_from,
        "resend_api_key_set": bool(settings.resend_api_key),
        "resend_api_key_masked": _mask(settings.resend_api_key),
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
    resend_api_key = payload.resend_api_key if payload.resend_api_key else current.resend_api_key
    smtp_password = payload.smtp_password if payload.smtp_password else current.smtp_password
    values = {
        "EMAIL_PROVIDER": payload.email_provider or "smtp",
        "EMAIL_FROM": payload.email_from or "",
        "RESEND_API_KEY": resend_api_key or "",
        "SMTP_ENABLED": str(payload.smtp_enabled).lower(),
        "SMTP_HOST": payload.smtp_host or "",
        "SMTP_PORT": str(payload.smtp_port),
        "SMTP_USERNAME": payload.smtp_username or "",
        "SMTP_PASSWORD": smtp_password or "",
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
    result = notification_center.send_email_code(payload.email, "123456")
    return {"status": "sent", "email": payload.email, "provider": result.provider, "delivery": result.mode, "detail": result.detail}
