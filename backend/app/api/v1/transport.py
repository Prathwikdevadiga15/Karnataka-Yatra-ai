from typing import List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/transport", tags=["Transport & KSRTC Bus Explorer"])

class BusService(BaseModel):
    service_name: str
    service_type: str  # Airavat Club Class, Flybus, Rajahamsa, Karnataka Sarige, Non-AC Sleeper
    departure_time: str
    arrival_time: str
    duration_hours: float
    fare_inr: int
    amenities: List[str]
    booking_url: str

class TransportRoute(BaseModel):
    id: str
    origin: str
    destination: str
    road_distance_km: int
    expressway_name: str
    ghat_pass_involved: bool
    ghat_pass_name: Optional[str] = None
    terrain_condition: str
    avg_travel_time_hours: float
    frequency: str
    fare_range_inr: str
    available_classes: List[str]
    official_provider: str
    official_portal_url: str
    schedule_sample: List[BusService]

KSRTC_ROUTES: List[TransportRoute] = [
    TransportRoute(
        id="blr-mys",
        origin="Bengaluru (Kempegowda / Satellite BS)",
        destination="Mysuru (Suburban Bus Stand)",
        road_distance_km=145,
        expressway_name="Bengaluru-Mysuru Access-Controlled 10-Lane Expressway (NH-275)",
        ghat_pass_involved=False,
        ghat_pass_name=None,
        terrain_condition="Smooth expressway corridor, toll automated",
        avg_travel_time_hours=2.0,
        frequency="Every 10 to 15 minutes (24x7)",
        fare_range_inr="₹180 - ₹480",
        available_classes=["EV PowerPlus Electric AC", "Airavat Club Class", "Karnataka Sarige Express", "Flybus (Direct from BLR Airport)"],
        official_provider="KSRTC (Karnataka State Road Transport Corporation)",
        official_portal_url="https://ksrtc.in",
        schedule_sample=[
            BusService(service_name="EV PowerPlus AC", service_type="Electric Express", departure_time="06:30", arrival_time="08:30", duration_hours=2.0, fare_inr=320, amenities=["Electric Silent Ride", "USB Charging", "Air Suspension"], booking_url="https://ksrtc.in"),
            BusService(service_name="Airavat Club Class", service_type="Multi-Axle Volvo", departure_time="08:00", arrival_time="10:00", duration_hours=2.0, fare_inr=420, amenities=["Reclining Seats", "Snack Pack", "Wifi"], booking_url="https://ksrtc.in"),
            BusService(service_name="Karnataka Sarige", service_type="Express Non-AC", departure_time="08:15", arrival_time="10:45", duration_hours=2.5, fare_inr=195, amenities=["Spacious Seating", "Frequent Stops"], booking_url="https://ksrtc.in"),
            BusService(service_name="Flybus Direct", service_type="Airport Volvo", departure_time="11:00", arrival_time="14:00", duration_hours=3.0, fare_inr=850, amenities=["Airport Direct", "Live Flight Display", "Chemical Toilet"], booking_url="https://ksrtc.in")
        ]
    ),
    TransportRoute(
        id="blr-mng",
        origin="Bengaluru (Majestic / Shantinagar)",
        destination="Mangaluru (KSRTC Bejai Terminal)",
        road_distance_km=352,
        expressway_name="NH-75 via Hassan, Sakleshpur & Shiradi Ghat Corridor",
        ghat_pass_involved=True,
        ghat_pass_name="Shiradi Ghat (Western Ghats pass)",
        terrain_condition="High-altitude scenic ghat hairpin turns. Average speed 35 km/h in pass.",
        avg_travel_time_hours=7.5,
        frequency="Every 30 minutes in evening / night; hourly daytime",
        fare_range_inr="₹450 - ₹1,250",
        available_classes=["Airavat Dream Class Sleeper", "Airavat Club Class", "Rajahamsa Executive", "Corona AC"],
        official_provider="KSRTC",
        official_portal_url="https://ksrtc.in",
        schedule_sample=[
            BusService(service_name="Airavat Dream Class", service_type="Multi-Axle AC Sleeper", departure_time="21:30", arrival_time="05:30", duration_hours=8.0, fare_inr=1150, amenities=["Individual Berth", "Blanket", "Water Bottle", "Charging Dock"], booking_url="https://ksrtc.in"),
            BusService(service_name="Rajahamsa Executive", service_type="Semi-Sleeper Non-AC", departure_time="22:15", arrival_time="06:30", duration_hours=8.25, fare_inr=580, amenities=["2+2 Pushback Seats", "Smooth Air Suspension"], booking_url="https://ksrtc.in"),
            BusService(service_name="Airavat Club Class Day", service_type="Volvo B11R", departure_time="07:00", arrival_time="14:30", duration_hours=7.5, fare_inr=890, amenities=["Panoramic Mountain Views", "Ergonomic Seats"], booking_url="https://ksrtc.in")
        ]
    ),
    TransportRoute(
        id="blr-hampi",
        origin="Bengaluru",
        destination="Hampi (Hospete KSRTC Bus Stand)",
        road_distance_km=340,
        expressway_name="NH-48 / NH-50 corridor via Chitradurga",
        ghat_pass_involved=False,
        ghat_pass_name=None,
        terrain_condition="Smooth 4-lane highway with scenic granite boulder landscape",
        avg_travel_time_hours=6.5,
        frequency="8 daily departures (Overnight sleepers recommended)",
        fare_range_inr="₹420 - ₹1,100",
        available_classes=["Non-AC Sleeper", "Airavat Club Class", "Rajahamsa"],
        official_provider="KSRTC",
        official_portal_url="https://ksrtc.in",
        schedule_sample=[
            BusService(service_name="Non-AC Sleeper Express", service_type="Sleeper", departure_time="22:00", arrival_time="05:00", duration_hours=7.0, fare_inr=680, amenities=["Full Sleeping Berth", "Window Curtains"], booking_url="https://ksrtc.in"),
            BusService(service_name="Airavat Volvo Multi-Axle", service_type="AC Seater", departure_time="23:00", arrival_time="05:30", duration_hours=6.5, fare_inr=920, amenities=["AC Comfort", "Bottle Holder"], booking_url="https://ksrtc.in")
        ]
    ),
    TransportRoute(
        id="blr-coorg",
        origin="Bengaluru",
        destination="Madikeri (Coorg Bus Station)",
        road_distance_km=255,
        expressway_name="NH-275 via Mysuru & Kushalnagar",
        ghat_pass_involved=True,
        ghat_pass_name="Kushalnagar-Madikeri Hill Ascent",
        terrain_condition="Expressway up to Mysuru, winding coffee estate curves into Coorg hills",
        avg_travel_time_hours=5.5,
        frequency="Every 45 minutes",
        fare_range_inr="₹350 - ₹850",
        available_classes=["Airavat Club Class", "Rajahamsa", "Karnataka Sarige"],
        official_provider="KSRTC",
        official_portal_url="https://ksrtc.in",
        schedule_sample=[
            BusService(service_name="Rajahamsa Executive", service_type="Semi-Sleeper", departure_time="07:30", arrival_time="13:00", duration_hours=5.5, fare_inr=480, amenities=["Pushback Comfort", "Luggage Booth"], booking_url="https://ksrtc.in"),
            BusService(service_name="Airavat Club Class", service_type="Volvo AC", departure_time="23:15", arrival_time="05:00", duration_hours=5.75, fare_inr=790, amenities=["Night Blanket", "Reading Lamp"], booking_url="https://ksrtc.in")
        ]
    ),
    TransportRoute(
        id="mng-udupi-gokarna",
        origin="Mangaluru",
        destination="Gokarna (via Udupi, Kundapura, Murudeshwar)",
        road_distance_km=235,
        expressway_name="NH-66 Karavali Coastal Highway Corridor",
        ghat_pass_involved=False,
        ghat_pass_name=None,
        terrain_condition="Scenic coastal coastal bridge crossings and sea-flanked straightaways",
        avg_travel_time_hours=4.5,
        frequency="Every 20 minutes between coastal cities",
        fare_range_inr="₹160 - ₹450",
        available_classes=["Vajra AC", "Karnataka Sarige Express", "Private Coastal Line Express"],
        official_provider="KSRTC & Coastal Transit",
        official_portal_url="https://ksrtc.in",
        schedule_sample=[
            BusService(service_name="Karavali Express", service_type="Sarige Express", departure_time="07:00", arrival_time="11:30", duration_hours=4.5, fare_inr=260, amenities=["Frequent Coastal Stops", "Breeze Windows"], booking_url="https://ksrtc.in"),
            BusService(service_name="Vajra Coastal AC", service_type="Volvo AC", departure_time="09:15", arrival_time="13:30", duration_hours=4.25, fare_inr=420, amenities=["AC Comfort", "Luggage Space"], booking_url="https://ksrtc.in")
        ]
    )
]

@router.get("/routes")
def list_routes(origin: Optional[str] = None, destination: Optional[str] = None):
    results = KSRTC_ROUTES
    if origin:
        orig_clean = origin.lower().strip()
        results = [r for r in results if orig_clean in r.origin.lower()]
    if destination:
        dest_clean = destination.lower().strip()
        results = [r for r in results if dest_clean in r.destination.lower()]
    return {"total": len(results), "routes": results}

@router.get("/routes/{route_id}")
def get_route(route_id: str):
    for r in KSRTC_ROUTES:
        if r.id == route_id:
            return r
    return KSRTC_ROUTES[0]

@router.get("/hubs")
def get_transit_hubs():
    return [
        {"id": "bengaluru", "name": "Bengaluru (Kempegowda Majestic / Shantinagar / Satellite)", "destinations_served": 31, "connectivity": "Air, Rail, Express Bus Network"},
        {"id": "mysuru", "name": "Mysuru (Suburban Bus Stand / City Stand)", "destinations_served": 18, "connectivity": "Expressway, Rail, Heritage Circuit"},
        {"id": "mangaluru", "name": "Mangaluru (KSRTC Bejai Terminal)", "destinations_served": 22, "connectivity": "Port, Airport, Konkan Rail, Coastal NH-66"},
        {"id": "hubballi", "name": "Hubballi-Dharwad (Central Bus Terminal)", "destinations_served": 24, "connectivity": "North Karnataka Gateway, Rail Junction"},
        {"id": "shivamogga", "name": "Shivamogga (KSRTC Bus Terminal)", "destinations_served": 14, "connectivity": "Malnad Gateway, Jog Falls Transit"},
        {"id": "udupi", "name": "Udupi (Service Bus Stand / City Bus Stand)", "destinations_served": 12, "connectivity": "Temple City, Coastal Tourist Hub"}
    ]
