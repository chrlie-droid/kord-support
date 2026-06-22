from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models import ObjectPassportSection, Venue
from backend.app.schemas.passport import PassportSectionCreate, PassportSectionRead, PassportSectionUpdate

router = APIRouter(prefix="/passport", tags=["passport"])


def _get_or_404(db: Session, model, item_id: int):
    item = db.get(model, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.get("/venues/{venue_id}/sections", response_model=list[PassportSectionRead])
def list_sections(venue_id: int, db: Session = Depends(get_db)):
    _get_or_404(db, Venue, venue_id)
    stmt = select(ObjectPassportSection).where(ObjectPassportSection.venue_id == venue_id).order_by(ObjectPassportSection.module_key)
    return db.scalars(stmt).all()


@router.post("/sections", response_model=PassportSectionRead, status_code=status.HTTP_201_CREATED)
def create_section(payload: PassportSectionCreate, db: Session = Depends(get_db)):
    _get_or_404(db, Venue, payload.venue_id)
    existing = db.scalar(
        select(ObjectPassportSection).where(
            ObjectPassportSection.venue_id == payload.venue_id,
            ObjectPassportSection.module_key == payload.module_key,
        )
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Section already exists")

    section = ObjectPassportSection(**payload.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.patch("/sections/{section_id}", response_model=PassportSectionRead)
def update_section(section_id: int, payload: PassportSectionUpdate, db: Session = Depends(get_db)):
    section = _get_or_404(db, ObjectPassportSection, section_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(section, key, value)
    db.commit()
    db.refresh(section)
    return section
