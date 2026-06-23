from pydantic import BaseModel, ConfigDict

from backend.app.models.enums import TicketPriority, TicketStatus


class TicketCreate(BaseModel):
    venue_id: int
    title: str
    description: str
    priority: TicketPriority = TicketPriority.NORMAL


class TicketUpdate(BaseModel):
    venue_id: int | None = None
    title: str | None = None
    description: str | None = None
    status: TicketStatus | None = None
    priority: TicketPriority | None = None


class TicketRead(BaseModel):
    id: int
    venue_id: int
    title: str
    description: str
    status: TicketStatus
    priority: TicketPriority
    pyrus_task_id: str | None = None
    model_config = ConfigDict(from_attributes=True)


class TicketCommentCreate(BaseModel):
    ticket_id: int
    author_name: str
    body: str
    is_internal: bool = False


class TicketCommentRead(BaseModel):
    id: int
    ticket_id: int
    author_name: str
    body: str
    is_internal: bool
    model_config = ConfigDict(from_attributes=True)
