from pydantic import BaseModel, ConfigDict


class PassportSectionCreate(BaseModel):
    venue_id: int
    module_key: str
    title: str
    status: str = "draft"
    summary: str | None = None
    notes: str | None = None


class PassportSectionUpdate(BaseModel):
    title: str | None = None
    status: str | None = None
    summary: str | None = None
    notes: str | None = None


class PassportSectionRead(BaseModel):
    id: int
    venue_id: int
    module_key: str
    title: str
    status: str
    summary: str | None = None
    notes: str | None = None
    model_config = ConfigDict(from_attributes=True)
