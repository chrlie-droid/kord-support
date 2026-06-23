from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.config import get_settings
from backend.app.db.session import get_db
from backend.app.integrations.pyrus import PyrusClient, PyrusNotConfigured
from backend.app.models import Ticket, TicketComment, Venue

router = APIRouter(prefix="/pyrus", tags=["pyrus"])


def _ticket_summary(ticket: Ticket, venue: Venue | None) -> str:
    venue_text = f"Объект: {venue.name}" if venue else f"Объект ID: {ticket.venue_id}"
    return f"Kord Support · Заявка №{ticket.id}\n\n{venue_text}\nТема: {ticket.title}\nСтатус: {ticket.status}\nПриоритет: {ticket.priority}\n\n{ticket.description}"


@router.post("/tickets/{ticket_id}/sync")
async def sync_ticket_to_pyrus(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    venue = db.get(Venue, ticket.venue_id)
    settings = get_settings()
    client = PyrusClient(settings)

    try:
        if not ticket.pyrus_task_id:
            task_id = await client.create_task(_ticket_summary(ticket, venue))
            ticket.pyrus_task_id = str(task_id)
            db.commit()
            db.refresh(ticket)

        comments = db.scalars(select(TicketComment).where(TicketComment.ticket_id == ticket.id).order_by(TicketComment.created_at)).all()
        if comments:
            text = "\n\n".join([f"{comment.author_name}:\n{comment.body}" for comment in comments])
            await client.add_comment(int(ticket.pyrus_task_id), f"Kord Support chat sync:\n\n{text}")

    except PyrusNotConfigured as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Pyrus sync failed: {exc}") from exc

    return {"ticket_id": ticket.id, "pyrus_task_id": ticket.pyrus_task_id, "status": "synced"}
