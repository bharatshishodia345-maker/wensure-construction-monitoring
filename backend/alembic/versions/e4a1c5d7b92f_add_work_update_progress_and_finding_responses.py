"""add_work_update_progress_and_finding_responses

Revision ID: e4a1c5d7b92f
Revises: cb927b40f54b
Create Date: 2026-10-13 20:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4a1c5d7b92f'
down_revision: Union[str, Sequence[str], None] = 'cb927b40f54b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add progress_percent to work_updates
    op.add_column('work_updates', sa.Column('progress_percent', sa.Float(), nullable=True, server_default='0.0'))

    # Add contractor response and resolution fields to findings
    op.add_column('findings', sa.Column('contractor_response', sa.Text(), nullable=True))
    op.add_column('findings', sa.Column('rectification_plan', sa.Text(), nullable=True))
    op.add_column('findings', sa.Column('contractor_response_date', sa.DateTime(), nullable=True))
    op.add_column('findings', sa.Column('resolved_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    # Downgrade operations (SQLite batch mode)
    with op.batch_alter_table('findings', schema=None) as batch_op:
        batch_op.drop_column('resolved_at')
        batch_op.drop_column('contractor_response_date')
        batch_op.drop_column('rectification_plan')
        batch_op.drop_column('contractor_response')

    with op.batch_alter_table('work_updates', schema=None) as batch_op:
        batch_op.drop_column('progress_percent')
