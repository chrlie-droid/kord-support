from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models import Ticket, TicketComment, Venue
from backend.app.schemas.tickets import TicketCommentCreate, TicketCommentRead, TicketCreate, TicketRead, TicketUpdate

router = APIRouter(prefix="/tickets", tags=["tickets"])


def _get_or_404(db: Session, model, item_id: int):
    item = db.get(model, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.get("", response_model=list[TicketRead])
def list_tickets(status_filter: str | None = None, venue_id: int | None = None, db: Session = Depends(get_db)):
    stmt = select(Ticket).order_by(Ticket.created_at.desc())
    if venue_id is not None:
        stmt = stmt.where(Ticket.venue_id == venue_id)
    if status_filter is not None:
        stmt = stmt.where(Ticket.status == status_filter)
    return db.scalars(stmt).all()


@router.post("", response_model=TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    _get_or_404(db, Venue, payload.venue_id)
    ticket = Ticket(**payload.model_dump())
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("/{ticket_id}", response_model=TicketRead)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return _get_or_404(db, Ticket, ticket_id)


@router.patch("/{ticket_id}", response_model=TicketRead)
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    ticket = _get_or_404(db, Ticket, ticket_id)
    values = payload.model_dump(exclude_unset=True)
    if "venue_id" in values:
        _get_or_404(db, Venue, values["venue_id"])
    for key, value in values.items():
        setattr(ticket, key, value)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("/{ticket_id}/comments", response_model=list[TicketCommentRead])
def list_comments(ticket_id: int, db: Session = Depends(get_db)):
    _get_or_404(db, Ticket, ticket_id)
    stmt = select(TicketComment).where(TicketComment.ticket_id == ticket_id).order_by(TicketComment.created_at)
    return db.scalars(stmt).all()


@router.post("/{ticket_id}/comments", response_model=TicketCommentRead, status_code=status.HTTP_201_CREATED)
def create_comment(ticket_id: int, payload: TicketCommentCreate, db: Session = Depends(get_db)):
    _get_or_404(db, Ticket, ticket_id)
    data = payload.model_dump()
    data["ticket_id"] = ticket_id
    comment = TicketComment(**data)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
