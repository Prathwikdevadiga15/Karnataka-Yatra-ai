import datetime
import random
from typing import Dict, Any, List

# Characteristic climate profiles for Karnataka regions
REGIONAL_CLIMATES = {
    "Coastal": {"temp_range": (26, 33), "humidity": 82, "conditions": ["Humid & Breezy", "Coastal Sunshine", "Passing Showers"]},
    "Malnad": {"temp_range": (18, 26), "humidity": 88, "conditions": ["Misty Morning", "Pleasant Breeze", "Lush & Overcast"]},
    "Old Mysore": {"temp_range": (20, 31), "humidity": 65, "conditions": ["Sunny & Pleasant", "Clear Skies", "Mild Evening"]},
    "Bengaluru": {"temp_range": (19, 29), "humidity": 60, "conditions": ["Pleasant & Breezy", "Mild Sunlight", "Scattered Clouds"]},
    "North Karnataka": {"temp_range": (24, 37), "humidity": 45, "conditions": ["Warm & Sunny", "Dry Heat", "Clear Horizon"]},
    "Hoysala": {"temp_range": (19, 30), "humidity": 62, "conditions": ["Mild & Sunny", "Gentle Breeze", "Comfortable"]},
    "Kalyana Karnataka": {"temp_range": (23, 38), "humidity": 40, "conditions": ["Warm & Dry", "Bright Sunlight", "Clear Skies"]}
}

def get_weather_for_destination(dest_id: str, region: str = "Old Mysore") -> Dict[str, Any]:
    """Returns weather information with realistic conditions, timestamps, and travel advisories."""
    profile = REGIONAL_CLIMATES.get(region, REGIONAL_CLIMATES["Old Mysore"])
    min_t, max_t = profile["temp_range"]
    
    # Deterministic variation based on destination string hash
    seed_offset = sum(ord(c) for c in dest_id) % 5
    temp = min_t + 2 + seed_offset
    condition = profile["conditions"][seed_offset % len(profile["conditions"])]
    
    advisory = None
    severity = "normal"
    
    if region in ["Malnad", "Coastal"] and "Showers" in condition:
        advisory = "Ghat road caution: wet roads and morning mist may reduce driving speeds. Allow 20% extra travel time."
        severity = "advisory"
    elif region in ["North Karnataka", "Kalyana Karnataka"] and temp >= 35:
        advisory = "Warm midday temperature: plan heritage monument visits before 11:30 AM or after 4:00 PM. Carry hydration."
        severity = "advisory"
        
    return {
        "destination_id": dest_id,
        "region": region,
        "temperature_c": temp,
        "humidity_percent": profile["humidity"],
        "condition": condition,
        "condition_kn": "ಉತ್ತಮ ಹವಾಮಾನ" if severity == "normal" else "ಎಚ್ಚರಿಕೆ ಹವಾಮಾನ",
        "advisory": advisory,
        "severity": severity,
        "last_updated": datetime.datetime.utcnow().isoformat() + "Z",
        "provider": "Karnataka Meteorological Hub (Simulated Live Feed)"
    }

def get_itinerary_weather_alerts(itinerary_stops: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    alerts = []
    for stop in itinerary_stops:
        w = get_weather_for_destination(stop.get("stop", stop.get("id", "")), stop.get("region", "Old Mysore"))
        if w.get("advisory"):
            alerts.append({
                "day": stop.get("day", 1),
                "stop": stop.get("name", stop.get("stop")),
                "condition": w["condition"],
                "advisory": w["advisory"],
                "severity": w["severity"]
            })
    return alerts
