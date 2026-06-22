# Architecture

Kord Support is designed as a modular operational platform for an iiko integrator.

## Main modules

1. CRM: clients, contacts, venues, contracts.
2. Technical passport: iiko, POS equipment, fiscal registers, UTM, networks, passwords, remote access.
3. Service Desk: tickets, comments, attachments, statuses, SLA.
4. Integrations: Pyrus, Telegram, email, monitoring.
5. Knowledge base: instructions, devices, recurring incidents.
6. Planning: engineer visits, updates, scheduled works.
7. Finance: subscription plans, additional works, invoices.
8. AI assistant: context-aware help based on client history and technical passport.

## Current Sprint 0 architecture

```text
Client / Engineer Browser
        |
        v
FastAPI application
        |
        v
PostgreSQL
```

## Backend

- FastAPI provides REST API and later server-rendered pages.
- SQLAlchemy is the ORM.
- Alembic handles migrations.
- Pydantic Settings reads configuration from `.env`.

## Data ownership

Kord Support will be the main operational database for clients, venues, technical passports and local ticket state.

Pyrus will be integrated as an internal task engine, but clients should not need to see Pyrus directly.

## Deployment target

Initial deployment target:

```text
VDS
Docker Compose
support.koard.ru / dev.support.koard.ru
```

## Security principles

- No secrets in Git.
- All credentials through `.env`.
- Role-based access: admin, engineer, client.
- Password hashing before real user login is enabled.
- Attachments stored outside the database.
