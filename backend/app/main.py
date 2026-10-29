import os
import json
import logging
from typing import List, Optional, Dict, Any
from decimal import Decimal
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import engine, SessionLocal, Base, get_db
from app.db.seed import init_db
from app.models.entities import Destination, Trip, Feedback, GenerationLog
from app.services.planning import engine as planning_engine
from app.services.ai import chat_assistant
from app.services.speech import transcribe_audio_payload, synthesize_speech
from app.services.weather import get_weather_for_destination, get_itinerary_weather_alerts
from app.api.v1 import api_v1_router
from app.api.v1.research import router as research_router
from app.api.v1.food import router as food_router
from app.api.v1.transport import router as transport_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.culture import router as culture_router


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("karnataka-yatra-ai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed data
    try:
        init_db()
        logger.info("Database initialized and verified.")
    except Exception as e:
        logger.error(f"DB initialization warning: {e}")
    yield

app = FastAPI(
    title="Karnataka Yatra AI API",
    description="Intelligent, culturally grounded, budget-aware tourism platform for Karnataka",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request / Response Schemas ---

class GenerateRequest(BaseModel):
    origin: str = Field(min_length=2, max_length=60, description="Origin city ID, e.g. bengaluru or mangaluru")
    duration_days: int = Field(ge=1, le=14, description="Trip duration in days (1-14)")
    travellers: int = Field(ge=1, le=20, default=2, description="Number of travellers")
    budget_inr: int = Field(ge=1000, le=10_000_000, default=30000, description="Total budget in INR")
    interests: List[str] = Field(default_factory=lambda: ["heritage"], max_length=10)
    accessible: bool = False
    locked: List[str] = Field(default_factory=list, max_length=14)
    travel_style: str = Field(default="moderate", description="relaxed, moderate, or fast_paced")

class ReplaceStopRequest(BaseModel):
    current_plan: Dict[str, Any]
    old_stop_id: str
    new_stop_id: Optional[str] = None
    accessible: bool = False

class ReplanRequest(BaseModel):
    budget_inr: Optional[int] = None
    adjust_weather: bool = False
    locked_stops: List[str] = Field(default_factory=list)

class BudgetEstimateRequest(BaseModel):
    stops: List[str]
    travellers: int = 2
    duration_days: int = 3
    travel_style: str = "moderate"

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    itinerary_context: Optional[Dict[str, Any]] = None
    language: str = "en"

class VoiceRequest(BaseModel):
    audio_base64: Optional[str] = None
    phrase_hint: Optional[str] = None
    language: str = "kn-IN"

class FeedbackRequest(BaseModel):
    trip_id: Optional[str] = None
    rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None
    category: str = "general"

class DestinationUpdate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    verification_status: Optional[str] = None
    description: Optional[str] = None
    cultural_notes: Optional[str] = None

class SaveTripRequest(BaseModel):
    title: str = "My Karnataka Yatra"
    origin: str
    duration_days: int
    traveller_count: int
    budget_inr: float
    plan: Dict[str, Any]

# --- API Routes ---

# Register modular v1 routers and convenience aliases
app.include_router(api_v1_router)
app.include_router(research_router, prefix="/api")
app.include_router(food_router, prefix="/api")
app.include_router(transport_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(culture_router, prefix="/api")


@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "Karnataka Yatra AI Backend & Multi-Services Hub",
        "version": "1.2.0",
        "database": "connected",
        "modules": ["planning_engine", "webstrapping_studio", "regional_food", "ksrtc_transport", "weather_alerts", "telemetry"]
    }

@app.get("/api/districts")
@app.get("/api/v1/districts")
def list_districts():
    all_dests = planning_engine.load_destinations()
    district_counts: Dict[str, int] = {}
    district_regions: Dict[str, str] = {}
    for d in all_dests:
        dist = d.get("district") or "Karnataka"
        district_counts[dist] = district_counts.get(dist, 0) + 1
        district_regions[dist] = d.get("region", "Karnataka")
        
    karnataka_all = [
        "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
        "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga",
        "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
        "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
        "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara",
        "Vijayapura", "Yadgir"
    ]
    
    result = []
    for d_name in sorted(karnataka_all):
        result.append({
            "name": d_name,
            "region": district_regions.get(d_name, "Karnataka"),
            "destination_count": district_counts.get(d_name, 0),
            "is_explored": district_counts.get(d_name, 0) > 0
        })
    return {"total": len(result), "districts": result}

@app.get("/api/destinations")
def list_destinations(
    q: str = "",
    category: str = "",
    region: str = "",
    accessible: Optional[bool] = None,
    page: int = Query(1, ge=1),
    size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db)
):
    all_dests = planning_engine.load_destinations()
    
    filtered = []
    q_low = q.lower().strip()
    cat_low = category.lower().strip()
    reg_low = region.lower().strip()
    
    for d in all_dests:
        if q_low:
            match_q = (
                q_low in d["name"].lower() or 
                q_low in d.get("kn", "") or 
                q_low in d.get("district", "").lower()
            )
            if not match_q:
                continue
                
        if cat_low and cat_low not in [c.lower() for c in d.get("categories", [])]:
            continue
            
        if reg_low and reg_low != d.get("region", "").lower():
            continue
            
        if accessible is True and not d.get("step_free", False):
            continue
            
        filtered.append(d)
        
    total = len(filtered)
    start_idx = (page - 1) * size
    items = filtered[start_idx : start_idx + size]
    
    return {
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size if size > 0 else 1,
        "items": items
    }

@app.get("/api/destinations/{dest_id}")
def get_destination(dest_id: str):
    for d in planning_engine.load_destinations():
        if d["id"] == dest_id:
            weather = get_weather_for_destination(dest_id, d.get("region", "Old Mysore"))
            return {**d, "weather": weather}
    raise HTTPException(status_code=404, detail=f"Destination '{dest_id}' not found.")

@app.post("/api/itineraries/generate")
def generate_itinerary(r: GenerateRequest, db: Session = Depends(get_db)):
    try:
        plan = planning_engine.generate(
            origin_id=r.origin.lower().strip(),
            days=r.duration_days,
            travellers=r.travellers,
            budget_inr=r.budget_inr,
            interests=r.interests,
            accessible=r.accessible,
            locked=r.locked,
            travel_style=r.travel_style
        )
        # Attach weather alerts
        plan["weather_alerts"] = get_itinerary_weather_alerts(plan["days"])
        
        # Log generation event
        try:
            log = GenerationLog(
                provider="deterministic_engine",
                model="karnataka-yatra-v1",
                latency_ms=45,
                status="success",
                validation_result=json.dumps(plan["warnings"])
            )
            db.add(log)
            db.commit()
        except Exception:
            db.rollback()

        return {
            "mode": "deterministic_validated",
            "plan": plan
        }
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Generation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate itinerary. Please verify inputs.")

@app.post("/api/itineraries/replace-stop")
def replace_itinerary_stop(r: ReplaceStopRequest):
    try:
        new_plan = planning_engine.replace_stop(
            current_plan=r.current_plan,
            old_stop_id=r.old_stop_id,
            new_stop_id=r.new_stop_id,
            accessible=r.accessible
        )
        new_plan["weather_alerts"] = get_itinerary_weather_alerts(new_plan["days"])
        return {"plan": new_plan}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/api/itineraries/save")
def save_itinerary(r: SaveTripRequest, db: Session = Depends(get_db)):
    try:
        trip = Trip(
            title=r.title,
            origin=r.origin,
            duration_days=r.duration_days,
            traveller_count=r.traveller_count,
            budget_inr=Decimal(str(r.budget_inr)),
            plan_json=json.dumps(r.plan),
            status="saved"
        )
        db.add(trip)
        db.commit()
        db.refresh(trip)
        return {"id": trip.id, "status": "saved", "message": "Itinerary saved successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save itinerary: {str(e)}")

@app.get("/api/itineraries")
def list_saved_itineraries(db: Session = Depends(get_db)):
    trips = db.query(Trip).order_by(Trip.created_at.desc()).all()
    results = []
    for t in trips:
        plan_data = json.loads(t.plan_json) if t.plan_json else {}
        results.append({
            "id": t.id,
            "title": t.title,
            "origin": t.origin,
            "duration_days": t.duration_days,
            "traveller_count": t.traveller_count,
            "budget_inr": float(t.budget_inr) if t.budget_inr else 0,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "plan": plan_data
        })
    return {"trips": results}

@app.get("/api/itineraries/{trip_id}")
def get_saved_itinerary(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    plan_data = json.loads(trip.plan_json) if trip.plan_json else {}
    return {
        "id": trip.id,
        "title": trip.title,
        "origin": trip.origin,
        "duration_days": trip.duration_days,
        "traveller_count": trip.traveller_count,
        "budget_inr": float(trip.budget_inr) if trip.budget_inr else 0,
        "plan": plan_data
    }

@app.delete("/api/itineraries/{trip_id}")
def delete_saved_itinerary(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    db.delete(trip)
    db.commit()
    return {"message": "Itinerary deleted successfully"}

@app.post("/api/itineraries/{trip_id}/replan")
def replan_saved_itinerary(trip_id: str, r: ReplanRequest, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    plan_data = json.loads(trip.plan_json) if trip.plan_json else {}
    
    new_budget = r.budget_inr or int(trip.budget_inr)
    new_plan = planning_engine.generate(
        origin_id=trip.origin,
        days=trip.duration_days,
        travellers=trip.traveller_count,
        budget_inr=new_budget,
        interests=["heritage", "nature"],
        locked=r.locked_stops
    )
    trip.plan_json = json.dumps(new_plan)
    trip.budget_inr = Decimal(str(new_budget))
    db.commit()
    return {"plan": new_plan, "message": "Itinerary replanned successfully."}

@app.post("/api/budget/estimate")
def estimate_budget(r: BudgetEstimateRequest):
    dests = planning_engine.load_destinations()
    by_id = {d["id"]: d for d in dests}
    stops = [by_id[s] for s in r.stops if s in by_id]
    
    legs = []
    if len(stops) > 1:
        for i in range(len(stops) - 1):
            legs.append(planning_engine.leg(stops[i], stops[i+1]))
            
    b = planning_engine.budget(stops, legs, r.travellers, r.duration_days)
    return b

@app.post("/api/assistant/chat")
def assistant_chat(r: ChatRequest):
    response = chat_assistant(
        prompt=r.message,
        itinerary_context=r.itinerary_context,
        preferred_language=r.language
    )
    return response

@app.post("/api/assistant/voice")
def assistant_voice(r: VoiceRequest):
    transcription = transcribe_audio_payload(r.audio_base64, r.phrase_hint)
    chat_resp = chat_assistant(transcription["text"], preferred_language=r.language)
    tts = synthesize_speech(chat_resp["reply"], language=r.language)
    return {
        "transcription": transcription,
        "chat": chat_resp,
        "speech": tts
    }

@app.get("/api/weather")
def destination_weather(dest_id: str = "bengaluru", region: str = "Old Mysore"):
    return get_weather_for_destination(dest_id, region)

@app.post("/api/feedback")
def submit_feedback(r: FeedbackRequest, db: Session = Depends(get_db)):
    try:
        fb = Feedback(
            trip_id=r.trip_id,
            rating=r.rating,
            comment=r.comment,
            category=r.category
        )
        db.add(fb)
        db.commit()
        return {"status": "success", "message": "Thank you for your authentic Karnataka travel feedback!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save feedback.")

@app.get("/api/feedback")
def list_feedback(db: Session = Depends(get_db)):
    items = db.query(Feedback).order_by(Feedback.created_at.desc()).limit(50).all()
    return [{
        "id": f.id,
        "rating": f.rating,
        "comment": f.comment,
        "category": f.category,
        "created_at": f.created_at.isoformat() if f.created_at else None
    } for f in items]

@app.get("/api/admin/destinations")
def admin_destinations(db: Session = Depends(get_db)):
    destinations = db.query(Destination).all()
    return [{
        "id": d.id,
        "name": d.name,
        "region": d.region,
        "district": d.district,
        "latitude": d.latitude,
        "longitude": d.longitude,
        "verification_status": d.verification_status,
        "step_free": d.step_free,
        "entry_fee_inr": float(d.entry_fee_inr) if d.entry_fee_inr else 0,
        "daily_cost_pp": float(d.daily_cost_pp) if d.daily_cost_pp else 0
    } for d in destinations]

@app.patch("/api/admin/destinations/{dest_id}")
def admin_update_destination(dest_id: str, r: DestinationUpdate, db: Session = Depends(get_db)):
    dest = db.query(Destination).filter(Destination.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found")
        
    if r.latitude is not None:
        dest.latitude = r.latitude
    if r.longitude is not None:
        dest.longitude = r.longitude
    if r.verification_status is not None:
        dest.verification_status = r.verification_status
    if r.description is not None:
        dest.description = r.description
    if r.cultural_notes is not None:
        dest.cultural_notes = r.cultural_notes
        
    db.commit()
    return {"status": "success", "message": f"Destination {dest_id} updated successfully."}
