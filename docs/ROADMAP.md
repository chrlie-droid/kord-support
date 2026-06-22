# Roadmap

## Sprint 0 — Foundation

Status: done in progress.

- Project structure
- Docker Compose
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Base entities: users, clients, venues, tickets, comments
- Health-check
- Documentation

## Sprint 1 — CRM core

Goal: make the first usable internal CRM.

- Client CRUD
- Venue CRUD
- Contact persons
- Support plans
- Simple web UI
- Admin seed user

## Sprint 2 — Service Desk MVP

Goal: create and process tickets.

- Ticket CRUD
- Ticket statuses
- Ticket comments
- Attachments
- Engineer dashboard
- Client ticket view

## Sprint 3 — Technical passport

Goal: make Kord Support useful for iiko support engineers.

- iiko licenses
- Front/Office configuration
- Fiscal registers
- Terminals
- UTM / EGAIS
- Honest Sign / TS PiOT
- Network and remote access records

## Sprint 4 — Pyrus integration

Goal: keep engineers in Pyrus while clients use Kord Support.

- Create Pyrus task from ticket
- Sync status
- Sync comments
- Webhook receiver

## Sprint 5 — Notifications

- Telegram notifications
- Email notifications
- SLA reminders

## Sprint 6 — Knowledge base

- Articles
- Device-specific instructions
- Recurring incident templates

## Sprint 7 — Monitoring

- Ping/HTTP checks
- UTM availability checks
- SSL checks
- Automatic ticket creation

## Sprint 8 — AI assistant

- Ticket summary
- Suggested answers
- Client context
- Technical passport context
