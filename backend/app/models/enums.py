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


class TicketCategory(StrEnum):
    VENUE_DOWN = "venue_down"
    CASH_REGISTER = "cash_register"
    PAYMENT = "payment"
    PRINTER = "printer"
    IIKO = "iiko"
    EGAIS = "egais"
    CHESTNY_ZNAK = "chestny_znak"
    EQUIPMENT = "equipment"
    SETTINGS = "settings"
    CONSULTATION = "consultation"
    DOCUMENTS = "documents"
    OTHER = "other"


class VenueType(StrEnum):
    BAR = "bar"
    CAFE = "cafe"
    RESTAURANT = "restaurant"
    DARK_KITCHEN = "dark_kitchen"
    FOOD_TRUCK = "food_truck"
    OTHER = "other"
