from fastapi import APIRouter, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models import Ticket, TicketComment, Venue
from backend.app.models.enums import TicketPriority, TicketStatus

router = APIRouter(tags=["service-desk-web"])


def layout(title: str, body: str) -> HTMLResponse:
    return HTMLResponse(f"""
<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Kord Support</title><style>
body{{font-family:Arial,sans-serif;margin:0;background:#f6f7f9;color:#111827}}header{{background:#111827;color:white;padding:18px 32px}}main{{max-width:1120px;margin:24px auto;padding:0 16px}}a{{color:#2563eb;text-decoration:none}}nav a{{margin-right:16px;color:white}}.card{{background:white;border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.08);margin-bottom:16px}}input,select,textarea{{width:100%;box-sizing:border-box;padding:10px;margin:6px 0 12px;border:1px solid #d1d5db;border-radius:8px}}button{{background:#111827;color:white;border:0;padding:10px 16px;border-radius:8px;cursor:pointer}}table{{width:100%;border-collapse:collapse;background:white;border-radius:14px;overflow:hidden}}th,td{{text-align:left;padding:12px;border-bottom:1px solid #e5e7eb;vertical-align:top}}th{{background:#f3f4f6}}.muted{{color:#6b7280}}.badge{{display:inline-block;padding:4px 8px;border-radius:999px;background:#e5e7eb;font-size:12px}}
</style></head><body><header><h1>Kord Support</h1><nav><a href="/crm">CRM</a><a href="/desk">Service Desk</a><a href="/docs">API Docs</a></nav></header><main>{body}</main></body></html>
""")


@router.get("/desk", response_class=HTMLResponse)
def desk_home(db: Session = Depends(get_db)):
    venues = db.scalars(select(Venue).order_by(Venue.name)).all()
    tickets = db.scalars(select(Ticket).order_by(Ticket.created_at.desc())).all()
    venue_by_id = {v.id: v for v in venues}
    venue_options = "".join(f"<option value='{v.id}'>{v.name}</option>" for v in venues)
    priority_options = "".join(f"<option value='{p.value}'>{p.value}</option>" for p in TicketPriority)
    rows = "".join(f"<tr><td><a href='/desk/tickets/{t.id}'>#{t.id}</a></td><td>{t.title}</td><td>{venue_by_id.get(t.venue_id).name if venue_by_id.get(t.venue_id) else ''}</td><td><span class='badge'>{t.status}</span></td><td>{t.priority}</td></tr>" for t in tickets) or "<tr><td colspan='5' class='muted'>Заявок пока нет</td></tr>"
    body = f"""
<section class="card"><h2>Создать заявку</h2><form method="post" action="/desk/tickets">
<label>Заведение</label><select name="venue_id" required>{venue_options}</select>
<label>Тема</label><input name="title" required placeholder="Например: не печатает чек">
<label>Описание</label><textarea name="description" required></textarea>
<label>Приоритет</label><select name="priority">{priority_options}</select>
<button>Создать заявку</button></form></section>
<section class="card"><h2>Заявки</h2><table><tr><th>ID</th><th>Тема</th><th>Заведение</th><th>Статус</th><th>Приоритет</th></tr>{rows}</table></section>
"""
    return layout("Service Desk", body)


@router.post("/desk/tickets")
def web_create_ticket(venue_id: int = Form(...), title: str = Form(...), description: str = Form(...), priority: TicketPriority = Form(TicketPriority.NORMAL), db: Session = Depends(get_db)):
    ticket = Ticket(venue_id=venue_id, title=title, description=description, priority=priority)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return RedirectResponse(f"/desk/tickets/{ticket.id}", status_code=303)
