from pydantic import BaseModel, ConfigDict, EmailStr

from backend.app.models.enums import VenueType


class ClientBase(BaseModel):
    name: str
    inn: str | None = None
    kpp: str | None = None
    legal_address: str | None = None
    contract_number: str | None = None
    support_plan: str | None = None
    notes: str | None = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    name: str | None = None
    inn: str | None = None
    kpp: str | None = None
    legal_address: str | None = None
    contract_number: str | None = None
    support_plan: str | None = None
    notes: str | None = None


class ClientRead(ClientBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class VenueBase(BaseModel):
    client_id: int
    name: str
    venue_type: VenueType = VenueType.OTHER
    address: str | None = None
    phone: str | None = None
    work_hours: str | None = None
    notes: str | None = None


class VenueCreate(VenueBase):
    pass


class VenueUpdate(BaseModel):
    client_id: int | None = None
    name: str | None = None
    venue_type: VenueType | None = None
    address: str | None = None
    phone: str | None = None
    work_hours: str | None = None
    notes: str | None = None


class VenueRead(VenueBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ContactBase(BaseModel):
    client_id: int
    full_name: str
    role: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    telegram: str | None = None
    notes: str | None = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    client_id: int | None = None
    full_name: str | None = None
    role: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    telegram: str | None = None
    notes: str | None = None


class ContactRead(ContactBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
