from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import Depends

from backend.app.core.config import get_settings
from backend.app.db.session import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("select 1"))
    settings = get_settings()
    return {"status": "ok", "service": settings.app_name, "env": settings.app_env}
