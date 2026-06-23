from fastapi import APIRouter

from backend.app.api.crm import router as crm_router
from backend.app.api.health import router as health_router
from backend.app.api.passport import router as passport_router
from backend.app.api.tickets import router as tickets_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(crm_router)
api_router.include_router(passport_router)
api_router.include_router(tickets_router)
