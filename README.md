# Kord Support

Kord Support is an internal Service Desk / CRM / ERP platform for an iiko integrator.

The goal is not just a ticket form. The goal is a single operational system for:

- clients and venues;
- iiko licenses and technical passports;
- support tickets;
- engineer work history;
- Pyrus integration;
- Telegram and email notifications;
- monitoring;
- knowledge base;
- future AI assistant.

## Sprint 0 status

Sprint 0 creates the foundation:

- FastAPI backend;
- PostgreSQL database;
- SQLAlchemy models;
- Alembic migrations;
- Docker Compose;
- environment-based configuration;
- health-check endpoint;
- baseline project structure;
- documentation.

## Quick start

```bash
cp .env.example .env
docker compose up -d --build
```

Open:

```text
http://localhost:8085
http://localhost:8085/docs
```

## Default stack

- Python 3.12
- FastAPI
- SQLAlchemy 2
- Alembic
- PostgreSQL 16
- Docker Compose
- Jinja2 / HTMX planned for the web UI

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
