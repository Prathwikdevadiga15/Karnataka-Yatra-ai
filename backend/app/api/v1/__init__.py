from fastapi import APIRouter
from app.api.v1.research import router as research_router
from app.api.v1.food import router as food_router
from app.api.v1.transport import router as transport_router
from app.api.v1.analytics import router as analytics_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(research_router)
api_v1_router.include_router(food_router)
api_v1_router.include_router(transport_router)
api_v1_router.include_router(analytics_router)
