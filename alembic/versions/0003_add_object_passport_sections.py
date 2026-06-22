"""add object passport sections

Revision ID: 0003_add_object_passport_sections
Revises: 0002_add_contact_persons
Create Date: 2026-06-23
"""
from alembic import op
import sqlalchemy as sa

revision = "0003_add_object_passport_sections"
down_revision = "0002_add_contact_persons"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "object_passport_sections",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("venue_id", sa.Integer(), sa.ForeignKey("venues.id"), nullable=False),
        sa.Column("module_key", sa.String(length=64), nullable=False),
        sa.Column("title", sa.String(length=128), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="draft"),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("venue_id", "module_key", name="uq_object_passport_section_venue_module"),
    )
    op.create_index(op.f("ix_object_passport_sections_venue_id"), "object_passport_sections", ["venue_id"], unique=False)
    op.create_index(op.f("ix_object_passport_sections_module_key"), "object_passport_sections", ["module_key"], unique=False)
    op.create_index(op.f("ix_object_passport_sections_status"), "object_passport_sections", ["status"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_object_passport_sections_status"), table_name="object_passport_sections")
    op.drop_index(op.f("ix_object_passport_sections_module_key"), table_name="object_passport_sections")
    op.drop_index(op.f("ix_object_passport_sections_venue_id"), table_name="object_passport_sections")
    op.drop_table("object_passport_sections")
