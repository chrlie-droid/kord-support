from pydantic import BaseModel, ConfigDict

from backend.app.models.enums import TicketCategory, TicketPriority, TicketStatus


class TicketCreate(BaseModel):
    venue_id: int
    author_contact_id: int | None = None
    title: str
    description: str
    category: TicketCategory = TicketCategory.OTHER
    priority: TicketPriority = TicketPriority.NORMAL


class TicketUpdate(BaseModel):
    venue_id: int | None = None
    author_contact_id: int | None = None
    title: str | None = None
    description: str | None = None
    category: TicketCategory | None = None
    status: TicketStatus | None = None
    priority: TicketPriority | None = None


class TicketRead(BaseModel):
    id: int
    venue_id: int
    author_contact_id: int | None = None
    title: str
    description: str
    category: TicketCategory
    status: TicketStatus
    priority: TicketPriority
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
