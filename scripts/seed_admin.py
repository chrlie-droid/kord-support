from sqlalchemy import select

from backend.app.core.security import get_password_hash
from backend.app.db.session import SessionLocal
from backend.app.models import User
from backend.app.models.enums import UserRole

DEFAULT_EMAIL = "admin@kord.local"
DEFAULT_PASSWORD = "admin12345"


def main() -> None:
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
        print(f"Password: {DEFAULT_PASSWORD}")
        print("Change this password before production.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
