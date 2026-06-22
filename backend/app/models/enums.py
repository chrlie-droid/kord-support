from enum import StrEnum


class UserRole(StrEnum):
    ADMIN = "admin"
    ENGINEER = "engineer"
    CLIENT = "client"


class TicketStatus(StrEnum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    WAITING_CLIENT = "waiting_client"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketPriority(StrEnum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    CRITICAL = "critical"


class VenueType(StrEnum):
    BAR = "bar"
    CAFE = "cafe"
    RESTAURANT = "restaurant"
    DARK_KITCHEN = "dark_kitchen"
    FOOD_TRUCK = "food_truck"
    OTHER = "other"
