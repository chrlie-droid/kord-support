from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models import Client, ContactPerson, Venue
from backend.app.schemas.crm import (
    ClientCreate,
    ClientRead,
    ClientUpdate,
    ContactCreate,
    ContactRead,
    ContactUpdate,
    VenueCreate,
    VenueRead,
    VenueUpdate,
)

router = APIRouter(prefix="/crm", tags=["crm"])


def _get_or_404(db: Session, model, item_id: int):
    item = db.get(model, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.get("/clients", response_model=list[ClientRead])
def list_clients(db: Session = Depends(get_db)):
    return db.scalars(select(Client).order_by(Client.name)).all()


@router.post("/clients", response_model=ClientRead, status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate, db: Session = Depends(get_db)):
    client = Client(**payload.model_dump())
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.get("/clients/{client_id}", response_model=ClientRead)
def get_client(client_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, Client, client_id)


@router.patch("/clients/{client_id}", response_model=ClientRead)
def update_client(client_id: int, payload: ClientUpdate, db: Session = Depends(get_db)):
    client = _get_or_404(db, Client, client_id)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client


@router.delete("/clients/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = _get_or_404(db, Client, client_id)
    db.delete(client)
    db.commit()
    return None


@router.get("/venues", response_model=list[VenueRead])
def list_venues(client_id: int | None = None, db: Session = Depends(get_db)):
    stmt = select(Venue).order_by(Venue.name)
    if client_id is not None:
        stmt = stmt.where(Venue.client_id == client_id)
    return db.scalars(stmt).all()


@router.post("/venues", response_model=VenueRead, status_code=status.HTTP_201_CREATED)
def create_venue(payload: VenueCreate, db: Session = Depends(get_db)):
    _get_or_404(db, Client, payload.client_id)
    venue = Venue(**payload.model_dump())
    db.add(venue)
    db.commit()
    db.refresh(venue)
    return venue


@router.get("/venues/{venue_id}", response_model=VenueRead)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, Venue, venue_id)


@router.patch("/venues/{venue_id}", response_model=VenueRead)
def update_venue(venue_id: int, payload: VenueUpdate, db: Session = Depends(get_db)):
    venue = _get_or_404(db, Venue, venue_id)
    values = payload.model_dump(exclude_unset=True)
    if "client_id" in values:
        _get_or_404(db, Client, values["client_id"])
    for key, value in values.items():
        setattr(venue, key, value)
    db.commit()
    db.refresh(venue)
    return venue


@router.delete("/venues/{venue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = _get_or_404(db, Venue, venue_id)
    db.delete(venue)
    db.commit()
    return None


@router.get("/contacts", response_model=list[ContactRead])
def list_contacts(client_id: int | None = None, db: Session = Depends(get_db)):
    stmt = select(ContactPerson).order_by(ContactPerson.full_name)
    if client_id is not None:
        stmt = stmt.where(ContactPerson.client_id == client_id)
    return db.scalars(stmt).all()


@router.post("/contacts", response_model=ContactRead, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    _get_or_404(db, Client, payload.client_id)
    contact = ContactPerson(**payload.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/contacts/{contact_id}", response_model=ContactRead)
def get_contact(contact_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, ContactPerson, contact_id)


@router.patch("/contacts/{contact_id}", response_model=ContactRead)
def update_contact(contact_id: int, payload: ContactUpdate, db: Session = Depends(get_db)):
    contact = _get_or_404(db, ContactPerson, contact_id)
    values = payload.model_dump(exclude_unset=True)
    if "client_id" in values:
        _get_or_404(db, Client, values["client_id"])
    for key, value in values.items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = _get_or_404(db, ContactPerson, contact_id)
    db.delete(contact)
    db.commit()
    return None
