"""change back_text to array

Revision ID: 5c4a96804bed
Revises: 4c9c64a5c2fd
Create Date: 2026-09-18 04:09:24.665327

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '5c4a96804bed'
down_revision: Union[str, None] = '4c9c64a5c2fd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "flashcard",
        "back_text",
        existing_type=sa.String(),
        type_=postgresql.ARRAY(sa.String()),
        existing_nullable=True,
        postgresql_using="back_text::character varying[]",
    )


def downgrade() -> None:
    op.alter_column(
        "flashcard",
        "back_text",
        existing_type=postgresql.ARRAY(sa.String()),
        type_=sa.String(),
        existing_nullable=True,
        postgresql_using="back_text::character varying",
    )