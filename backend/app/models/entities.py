import datetime
import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, Numeric
)
from sqlalchemy.orm import relationship
from app.db.session import Base

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(120), unique=True, index=True, nullable=True)
    display_name = Column(String(100), nullable=True)
    preferred_language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")
    feedbacks = relationship("Feedback", back_populates="user")

class Destination(Base):
    __tablename__ = "destinations"
    id = Column(String(60), primary_key=True)
    name = Column(String(120), nullable=False, index=True)
    slug = Column(String(120), unique=True, index=True)
    region = Column(String(60), index=True)
    district = Column(String(60), index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    categories = Column(Text, default="[]")  # JSON-encoded array of categories
    description = Column(Text, nullable=True)
    estimated_visit_duration = Column(Integer, default=300) # minutes
    accessibility_information = Column(Text, nullable=True)
    step_free = Column(Boolean, default=False)
    daily_cost_pp = Column(Numeric(10, 2), default=1500)
    entry_fee_inr = Column(Numeric(10, 2), default=0)
    best_season = Column(String(100), nullable=True)
    opening_hours = Column(String(100), nullable=True)
    cultural_notes = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    verification_status = Column(String(40), default="verified") # verified, unverified_seed, community

    translations = relationship("DestinationTranslation", back_populates="destination", cascade="all, delete-orphan")
    sources = relationship("DestinationSource", back_populates="destination", cascade="all, delete-orphan")

class DestinationTranslation(Base):
    __tablename__ = "destination_translations"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    destination_id = Column(String(60), ForeignKey("destinations.id"), nullable=False)
    language_code = Column(String(10), nullable=False) # kn, en, etc.
    translated_name = Column(String(150), nullable=False)
    translated_description = Column(Text, nullable=True)

    destination = relationship("Destination", back_populates="translations")

class DestinationSource(Base):
    __tablename__ = "destination_sources"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    destination_id = Column(String(60), ForeignKey("destinations.id"), nullable=False)
    source_url = Column(Text, nullable=False)
    source_title = Column(String(200), nullable=False)
    source_type = Column(String(50), default="official_tourism")
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)
    verification_status = Column(String(40), default="verified")

    destination = relationship("Destination", back_populates="sources")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(150), default="Karnataka Expedition")
    origin = Column(String(100), nullable=False)
    start_date = Column(String(30), nullable=True)
    end_date = Column(String(30), nullable=True)
    duration_days = Column(Integer, default=3)
    traveller_count = Column(Integer, default=2)
    budget_inr = Column(Numeric(12, 2), default=30000)
    preferred_language = Column(String(10), default="en")
    travel_style = Column(String(50), default="moderate")
    status = Column(String(30), default="draft")
    plan_json = Column(Text, nullable=True) # Full structured itinerary snapshot
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="trips")
    days = relationship("ItineraryDay", back_populates="trip", cascade="all, delete-orphan")
    budget_items = relationship("BudgetItem", back_populates="trip", cascade="all, delete-orphan")
    route_legs = relationship("RouteLeg", back_populates="trip", cascade="all, delete-orphan")

class ItineraryDay(Base):
    __tablename__ = "itinerary_days"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    trip_id = Column(String(36), ForeignKey("trips.id"), nullable=False)
    day_number = Column(Integer, nullable=False)
    date = Column(String(30), nullable=True)
    estimated_cost_inr = Column(Numeric(10, 2), default=0)

    trip = relationship("Trip", back_populates="days")
    stops = relationship("ItineraryStop", back_populates="day", cascade="all, delete-orphan")

class ItineraryStop(Base):
    __tablename__ = "itinerary_stops"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    itinerary_day_id = Column(String(36), ForeignKey("itinerary_days.id"), nullable=False)
    destination_id = Column(String(60), ForeignKey("destinations.id"), nullable=False)
    arrival_time = Column(String(20), nullable=True)
    visit_duration_minutes = Column(Integer, default=180)
    estimated_cost_inr = Column(Numeric(10, 2), default=0)
    user_locked = Column(Boolean, default=False)

    day = relationship("ItineraryDay", back_populates="stops")
    destination = relationship("Destination")

class BudgetItem(Base):
    __tablename__ = "budget_items"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    trip_id = Column(String(36), ForeignKey("trips.id"), nullable=False)
    category = Column(String(50), nullable=False) # transport, accommodation, food, attractions, contingency
    estimated_amount_inr = Column(Numeric(10, 2), nullable=False)
    estimate_type = Column(String(40), default="indicative_seed")
    source_reference = Column(String(200), nullable=True)

    trip = relationship("Trip", back_populates="budget_items")

class RouteLeg(Base):
    __tablename__ = "route_legs"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    trip_id = Column(String(36), ForeignKey("trips.id"), nullable=False)
    origin_coordinates = Column(String(60), nullable=False)
    destination_coordinates = Column(String(60), nullable=False)
    distance_meters = Column(Float, default=0.0)
    duration_seconds = Column(Float, default=0.0)
    provider = Column(String(50), default="haversine_road_factored")
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    trip = relationship("Trip", back_populates="route_legs")

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    trip_id = Column(String(36), ForeignKey("trips.id"), nullable=True)
    rating = Column(Integer, nullable=False) # 1 - 5 stars
    comment = Column(Text, nullable=True)
    category = Column(String(50), default="general")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")

class GenerationLog(Base):
    __tablename__ = "generation_logs"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    trip_id = Column(String(36), nullable=True)
    provider = Column(String(50), default="deterministic_baseline")
    model = Column(String(60), default="karnataka-engine-v1")
    latency_ms = Column(Integer, default=0)
    status = Column(String(30), default="success")
    validation_result = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
