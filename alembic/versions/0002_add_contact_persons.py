"""add contact persons

Revision ID: 0002_add_contact_persons
Revises: 0001_initial_schema
Create Date: 2026-06-22
"""
from alembic import op
import sqlalchemy as sa

revision = "0002_add_contact_persons"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "contact_persons",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("client_id", sa.Integer(), sa.ForeignKey("clients.id"), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=128), nullable=True),
        sa.Column("phone", sa.String(length=64), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("telegram", sa.String(length=128), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_contact_persons_client_id"), "contact_persons", ["client_id"], unique=False)
    op.create_index(op.f("ix_contact_persons_phone"), "contact_persons", ["phone"], unique=False)
    op.create_index(op.f("ix_contact_persons_email"), "contact_persons", ["email"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_contact_persons_email"), table_name="contact_persons")
    op.drop_index(op.f("ix_contact_persons_phone"), table_name="contact_persons")
    op.drop_index(op.f("ix_contact_persons_client_id"), table_name="contact_persons")
    op.drop_table("contact_persons")
