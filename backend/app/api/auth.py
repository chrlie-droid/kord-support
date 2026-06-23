from datetime import datetime, timedelta, timezone
from random import SystemRandom

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr

from backend.app.email_delivery import send_email_code

router = APIRouter(prefix="/auth", tags=["auth"])

_CODE_TTL_MINUTES = 10
_rng = SystemRandom()
_codes: dict[str, dict[str, object]] = {}


class EmailCodeRequest(BaseModel):
    email: EmailStr


class EmailCodeVerify(BaseModel):
    email: EmailStr
    code: str


@router.post("/email/request-code")
def request_email_code(payload: EmailCodeRequest):
    email = payload.email.lower()
    code = f"{_rng.randint(0, 999999):06d}"
    _codes[email] = {
        "code": code,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=_CODE_TTL_MINUTES),
        "attempts": 0,
    }
    send_email_code(email, code)
    return {"status": "sent", "ttl_minutes": _CODE_TTL_MINUTES}


@router.post("/email/verify-code")
def verify_email_code(payload: EmailCodeVerify):
    email = payload.email.lower()
    entry = _codes.get(email)

    if not entry:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code not found")

    if datetime.now(timezone.utc) > entry["expires_at"]:
        _codes.pop(email, None)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code expired")

    entry["attempts"] = int(entry.get("attempts", 0)) + 1
    if int(entry["attempts"]) > 5:
        _codes.pop(email, None)
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many attempts")

    if str(entry["code"]) != payload.code.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid code")

    _codes.pop(email, None)
    return {"verified": True, "email": email}
