"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-06-22
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.Enum("ADMIN", "ENGINEER", "CLIENT", name="userrole"), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "clients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("inn", sa.String(length=32), nullable=True),
        sa.Column("kpp", sa.String(length=32), nullable=True),
        sa.Column("legal_address", sa.Text(), nullable=True),
        sa.Column("contract_number", sa.String(length=128), nullable=True),
        sa.Column("support_plan", sa.String(length=128), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_clients_name"), "clients", ["name"], unique=False)
    op.create_index(op.f("ix_clients_inn"), "clients", ["inn"], unique=False)

    op.create_table(
        "venues",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("client_id", sa.Integer(), sa.ForeignKey("clients.id"), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("venue_type", sa.Enum("BAR", "CAFE", "RESTAURANT", "DARK_KITCHEN", "FOOD_TRUCK", "OTHER", name="venuetype"), nullable=False),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("phone", sa.String(length=64), nullable=True),
        sa.Column("work_hours", sa.String(length=255), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_venues_client_id"), "venues", ["client_id"], unique=False)
    op.create_index(op.f("ix_venues_name"), "venues", ["name"], unique=False)

    op.create_table(
        "tickets",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("venue_id", sa.Integer(), sa.ForeignKey("venues.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", sa.Enum("NEW", "IN_PROGRESS", "WAITING_CLIENT", "RESOLVED", "CLOSED", name="ticketstatus"), nullable=False),
        sa.Column("priority", sa.Enum("LOW", "NORMAL", "HIGH", "CRITICAL", name="ticketpriority"), nullable=False),
        sa.Column("pyrus_task_id", sa.String(length=128), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_tickets_venue_id"), "tickets", ["venue_id"], unique=False)
    op.create_index(op.f("ix_tickets_status"), "tickets", ["status"], unique=False)
    op.create_index(op.f("ix_tickets_priority"), "tickets", ["priority"], unique=False)
    op.create_index(op.f("ix_tickets_pyrus_task_id"), "tickets", ["pyrus_task_id"], unique=False)

    op.create_table(
        "ticket_comments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("ticket_id", sa.Integer(), sa.ForeignKey("tickets.id"), nullable=False),
        sa.Column("author_name", sa.String(length=255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("is_internal", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_ticket_comments_ticket_id"), "ticket_comments", ["ticket_id"], unique=False)


def downgrade() -> None:
    op.drop_table("ticket_comments")
    op.drop_table("tickets")
    op.drop_table("venues")
    op.drop_table("clients")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS ticketpriority")
    op.execute("DROP TYPE IF EXISTS ticketstatus")
    op.execute("DROP TYPE IF EXISTS venuetype")
    op.execute("DROP TYPE IF EXISTS userrole")
