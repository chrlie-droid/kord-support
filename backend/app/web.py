from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.models import Client, ContactPerson, Venue
from backend.app.models.enums import VenueType

router = APIRouter(tags=["web"])


def page(title: str, body: str) -> HTMLResponse:
    return HTMLResponse(
        f"""
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} · Kord Support</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 0; background: #f6f7f9; color: #111827; }}
    header {{ background: #111827; color: white; padding: 18px 32px; }}
    main {{ max-width: 1120px; margin: 24px auto; padding: 0 16px; }}
    a {{ color: #2563eb; text-decoration: none; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }}
    .card {{ background: white; border-radius: 14px; padding: 18px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }}
    input, select, textarea {{ width: 100%; box-sizing: border-box; padding: 10px; margin: 6px 0 12px; border: 1px solid #d1d5db; border-radius: 8px; }}
    button {{ background: #111827; color: white; border: 0; padding: 10px 16px; border-radius: 8px; cursor: pointer; }}
    table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 14px; overflow: hidden; }}
    th, td {{ text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }}
    th {{ background: #f3f4f6; }}
    .muted {{ color: #6b7280; }}
    nav a {{ margin-right: 16px; color: white; }}
  </style>
</head>
<body>
<header>
  <h1>Kord Support</h1>
  <nav><a href="/crm">CRM</a><a href="/docs">API Docs</a><a href="/api/health">Health</a></nav>
</header>
<main>{body}</main>
</body>
</html>
        """
    )


@router.get("/crm", response_class=HTMLResponse)
def crm_home(request: Request, db: Session = Depends(get_db)):
    clients = db.scalars(select(Client).order_by(Client.name)).all()
    venues = db.scalars(select(Venue).order_by(Venue.name)).all()
    contacts = db.scalars(select(ContactPerson).order_by(ContactPerson.full_name)).all()

    client_rows = "".join(
        f"<tr><td>{c.name}</td><td>{c.inn or ''}</td><td>{c.support_plan or ''}</td><td>{c.contract_number or ''}</td></tr>"
        for c in clients
    ) or "<tr><td colspan='4' class='muted'>Клиентов пока нет</td></tr>"

    venue_rows = "".join(
        f"<tr><td>{v.name}</td><td>{v.venue_type}</td><td>{v.address or ''}</td><td>{v.phone or ''}</td></tr>"
        for v in venues
    ) or "<tr><td colspan='4' class='muted'>Заведений пока нет</td></tr>"

    contact_rows = "".join(
        f"<tr><td>{c.full_name}</td><td>{c.role or ''}</td><td>{c.phone or ''}</td><td>{c.email or ''}</td></tr>"
        for c in contacts
    ) or "<tr><td colspan='4' class='muted'>Контактов пока нет</td></tr>"

    client_options = "".join(f"<option value='{c.id}'>{c.name}</option>" for c in clients)
    venue_type_options = "".join(f"<option value='{t.value}'>{t.value}</option>" for t in VenueType)

    body = f"""
<div class="grid">
  <section class="card">
    <h2>Добавить клиента</h2>
    <form method="post" action="/crm/clients">
      <label>Название</label><input name="name" required>
      <label>ИНН</label><input name="inn">
      <label>Договор</label><input name="contract_number">
      <label>Тариф</label><input name="support_plan">
      <label>Заметки</label><textarea name="notes"></textarea>
      <button>Создать</button>
    </form>
  </section>
  <section class="card">
    <h2>Добавить заведение</h2>
    <form method="post" action="/crm/venues">
      <label>Клиент</label><select name="client_id" required>{client_options}</select>
      <label>Название</label><input name="name" required>
      <label>Тип</label><select name="venue_type">{venue_type_options}</select>
      <label>Адрес</label><input name="address">
      <label>Телефон</label><input name="phone">
      <button>Создать</button>
    </form>
  </section>
  <section class="card">
    <h2>Добавить контакт</h2>
    <form method="post" action="/crm/contacts">
      <label>Клиент</label><select name="client_id" required>{client_options}</select>
      <label>ФИО</label><input name="full_name" required>
      <label>Роль</label><input name="role" placeholder="директор, управляющий, бухгалтер">
      <label>Телефон</label><input name="phone">
      <label>Email</label><input name="email">
      <button>Создать</button>
    </form>
  </section>
</div>

<h2>Клиенты</h2>
<table><tr><th>Название</th><th>ИНН</th><th>Тариф</th><th>Договор</th></tr>{client_rows}</table>

<h2>Заведения</h2>
<table><tr><th>Название</th><th>Тип</th><th>Адрес</th><th>Телефон</th></tr>{venue_rows}</table>

<h2>Контакты</h2>
<table><tr><th>ФИО</th><th>Роль</th><th>Телефон</th><th>Email</th></tr>{contact_rows}</table>
"""
    return page("CRM", body)


@router.post("/crm/clients")
def web_create_client(
    name: str = Form(...),
    inn: str | None = Form(None),
    contract_number: str | None = Form(None),
    support_plan: str | None = Form(None),
    notes: str | None = Form(None),
    db: Session = Depends(get_db),
):
    db.add(Client(name=name, inn=inn or None, contract_number=contract_number or None, support_plan=support_plan or None, notes=notes or None))
    db.commit()
    return RedirectResponse("/crm", status_code=303)


@router.post("/crm/venues")
def web_create_venue(
    client_id: int = Form(...),
    name: str = Form(...),
    venue_type: VenueType = Form(VenueType.OTHER),
    address: str | None = Form(None),
    phone: str | None = Form(None),
    db: Session = Depends(get_db),
):
    db.add(Venue(client_id=client_id, name=name, venue_type=venue_type, address=address or None, phone=phone or None))
    db.commit()
    return RedirectResponse("/crm", status_code=303)


@router.post("/crm/contacts")
def web_create_contact(
    client_id: int = Form(...),
    full_name: str = Form(...),
    role: str | None = Form(None),
    phone: str | None = Form(None),
    email: str | None = Form(None),
    db: Session = Depends(get_db),
):
    db.add(ContactPerson(client_id=client_id, full_name=full_name, role=role or None, phone=phone or None, email=email or None))
    db.commit()
    return RedirectResponse("/crm", status_code=303)
