# Kord Support

Kord Support is an internal Service Desk / CRM platform for an iiko integrator.

The goal is not just a ticket form. The goal is a compact operational system for:

- clients and venues;
- contact persons;
- technical passports;
- support tickets;
- engineer work history;
- Pyrus integration;
- knowledge base;
- future AI assistant.

## Product focus

Kord Support 1.0 intentionally stays compact:

- CRM;
- Service Desk;
- Object Passport;
- Knowledge Base.

## Quick start

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app alembic upgrade head
docker compose exec app sh -lc 'cd /app && PYTHONPATH=/app SEED_ADMIN_PASSWORD="change-this-local-password" python /app/scripts/seed_admin.py'
```

Open locally:

```text
http://localhost:3000
http://localhost:3000/crm
http://localhost:8085/docs
http://localhost:8085/api/health
```

Do not commit real domains, IP addresses, customer names, passwords, tokens, logs or database dumps.

## API examples

Create a demo client:

```bash
curl -X POST http://localhost:8085/api/crm/clients \
  -H 'Content-Type: application/json' \
  -d '{"name":"Demo Client","inn":"0000000000","support_plan":"Demo Plan"}'
```

Create a demo venue:

```bash
curl -X POST http://localhost:8085/api/crm/venues \
  -H 'Content-Type: application/json' \
  -d '{"client_id":1,"name":"Demo Venue","venue_type":"bar","address":"Demo Address"}'
```

## Default stack

- Python 3.12
- FastAPI
- SQLAlchemy 2
- Alembic
- PostgreSQL 16
- Docker Compose
- Next.js
- Tailwind CSS

## Repository structure

```text
backend/        FastAPI application
frontend/       Next.js application
alembic/        Database migrations
docs/           Architecture and roadmap
scripts/        Helper scripts
docker-compose.yml
Dockerfile
.env.example
```
