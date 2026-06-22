import os
import sys
from pathlib import Path

from sqlalchemy import select

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.core.security import get_password_hash
from backend.app.db.session import SessionLocal
from backend.app.models import User
from backend.app.models.enums import UserRole

DEFAULT_EMAIL = os.getenv("SEED_ADMIN_EMAIL", "admin@example.local")
DEFAULT_PASSWORD = os.getenv("SEED_ADMIN_PASSWORD")


def main() -> None:
    if not DEFAULT_PASSWORD:
        raise RuntimeError("Set SEED_ADMIN_PASSWORD before running seed_admin.py")

    db = SessionLocal()
    try:
        existing = db.scalar(select(User).where(User.email == DEFAULT_EMAIL))
        if existing:
            print(f"Admin already exists: {DEFAULT_EMAIL}")
            return

        user = User(
            email=DEFAULT_EMAIL,
            full_name="Kord Administrator",
            hashed_password=get_password_hash(DEFAULT_PASSWORD),
            role=UserRole.ADMIN,
            is_active=True,
        )
        db.add(user)
        db.commit()
        print("Admin created")
        print(f"Email: {DEFAULT_EMAIL}")
        print("Password: value from SEED_ADMIN_PASSWORD")
    finally:
        db.close()


if __name__ == "__main__":
    main()
