# Kord Support

Kord Support is an internal Service Desk / CRM / ERP platform for an iiko integrator.

The goal is not just a ticket form. The goal is a single operational system for:

- clients and venues;
- contact persons;
- iiko licenses and technical passports;
- support tickets;
- engineer work history;
- Pyrus integration;
- Telegram and email notifications;
- monitoring;
- knowledge base;
- future AI assistant.

## Sprint 1 status

Sprint 1 adds the first usable CRM core:

- client API;
- venue API;
- contact person API;
- simple web CRM page;
- contact person model and migration;
- admin seed script;
- password hashing helpers.

## Quick start

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app alembic upgrade head
docker compose exec app python -m scripts.seed_admin
```

Open:

```text
http://localhost:8085
http://localhost:8085/crm
http://localhost:8085/docs
http://localhost:8085/api/health
```

Default seed admin for future login implementation:

```text
Email: admin@kord.local
Password: admin12345
```

Change this password before production.

## API examples

Create client:

```bash
curl -X POST http://localhost:8085/api/crm/clients \
  -H 'Content-Type: application/json' \
  -d '{"name":"ПивБар","inn":"5750000000","support_plan":"Абонентское сопровождение"}'
```

Create venue:

```bash
curl -X POST http://localhost:8085/api/crm/venues \
  -H 'Content-Type: application/json' \
  -d '{"client_id":1,"name":"ПивБар Центр","venue_type":"bar","address":"Орел"}'
```

## Default stack

- Python 3.12
- FastAPI
- SQLAlchemy 2
- Alembic
- PostgreSQL 16
- Docker Compose
- Server-rendered HTML first, HTMX later

## Repository structure

```text
backend/        FastAPI application
alembic/        Database migrations
docs/           Architecture and roadmap
scripts/        Helper scripts
docker-compose.yml
Dockerfile
.env.example
```
