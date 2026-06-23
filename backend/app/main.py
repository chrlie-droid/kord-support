from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.api.router import api_router
from backend.app.api.tickets import router as service_desk_router
from backend.app.core.config import get_settings
from backend.app.web import router as web_router
from backend.app.web_desk import router as web_desk_router

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.app_debug,
    version="0.3.0",
    description="Service Desk / CRM / ERP platform for an iiko integrator.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path("/app/uploads").mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory="/app/uploads"), name="uploads")

app.include_router(api_router, prefix="/api")
app.include_router(service_desk_router, prefix="/api")
app.include_router(web_router)
app.include_router(web_desk_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"service": settings.app_name, "status": "running", "crm": "/crm", "service_desk": "/desk", "docs": "/docs", "health": "/api/health"}
