"""Deterministic planner: ranking, day packing, budget, validation, and replanning.
Costs are INDICATIVE seed estimates, never live market prices. Distances are
straight-line x road factor and are labelled 'estimated'."""
import json
import math
from decimal import Decimal
from pathlib import Path
from typing import List, Dict, Any, Optional

DATA = Path(__file__).resolve().parents[4] / "data" / "destinations.example.json"
ROAD_FACTOR, AVG_KMPH, MAX_DAY_TRAVEL_H = 1.35, 45, 6

# Regional speed modifiers (Ghat roads are slower, express highways faster)
REGION_SPEEDS = {
    "Malnad": 35,
    "Coastal": 40,
    "North Karnataka": 55,
    "Old Mysore": 50,
    "Bengaluru": 40,
    "Hoysala": 45,
    "Kalyana Karnataka": 50,
}

def load_destinations() -> List[Dict[str, Any]]:
    if not DATA.exists():
        # Fallback to 3 levels up if ran from another structure
        fallback = Path(__file__).resolve().parents[3] / "data" / "destinations.example.json"
        if fallback.exists():
            return json.loads(fallback.read_text(encoding="utf-8"))
    return json.loads(DATA.read_text(encoding="utf-8"))

def haversine_km(a: Dict[str, Any], b: Dict[str, Any]) -> float:
    la1, lo1, la2, lo2 = map(math.radians, (a["lat"], a["lon"], b["lat"], b["lon"]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(h))

def leg(a: Dict[str, Any], b: Dict[str, Any]) -> Dict[str, Any]:
    km = round(haversine_km(a, b) * ROAD_FACTOR, 1)
    region = b.get("region", "Old Mysore")
    avg_speed = REGION_SPEEDS.get(region, AVG_KMPH)
    duration_h = round(km / avg_speed, 1)
    return {
        "from": a["id"],
        "from_name": a.get("name", a["id"]),
        "to": b["id"],
        "to_name": b.get("name", b["id"]),
        "from_coords": [a["lat"], a["lon"]],
        "to_coords": [b["lat"], b["lon"]],
        "distance_km": km,
        "duration_h": duration_h,
        "estimate_type": "estimated_road_factored",
        "provider": "haversine_road_factored"
    }

def score(d: Dict[str, Any], interests: List[str], accessible: bool) -> int:
    if accessible and not d.get("step_free", False):
        return -1
    matched = set(d.get("categories", [])) & set(interests)
    # Give slight bonus to verified destinations
    bonus = 1 if d.get("verification_status") == "verified" else 0
    return len(matched) * 2 + bonus

def rank(interests: List[str], accessible: bool = False, dests: Optional[List[Dict[str, Any]]] = None) -> List[Dict[str, Any]]:
    dests = dests or load_destinations()
    return sorted(
        (d for d in dests if score(d, interests, accessible) >= 0),
        key=lambda d: -score(d, interests, accessible)
    )

def order_nearest(stops: List[Dict[str, Any]], start: Dict[str, Any]) -> List[Dict[str, Any]]:
    out, cur, rest = [], start, list(stops)
    while rest:
        nxt = min(rest, key=lambda d: haversine_km(cur, d))
        rest.remove(nxt)
        out.append(nxt)
        cur = nxt
    return out

def budget(
    stops: List[Dict[str, Any]],
    legs: List[Dict[str, Any]],
    travellers: int,
    days: int,
    fuel_per_km: Decimal = Decimal("12"),
    contingency_rate: Decimal = Decimal("0.10")
) -> Dict[str, Any]:
    q = lambda v: Decimal(str(v)).quantize(Decimal("0.01"))
    
    total_km = sum(Decimal(str(l["distance_km"])) for l in legs) if legs else Decimal("0")
    transport = q(total_km * fuel_per_km)
    
    # Stay, Food & Local transit (per-person daily cost * travellers)
    stay_food = q(sum(Decimal(str(d.get("daily_cost_pp", 1500))) for d in stops) * travellers)
    
    # Entry fees
    entry_fees = q(sum(Decimal(str(d.get("entry_fee_inr", 0))) for d in stops) * travellers)
    
    # Local incidentals
    local_transit = q(Decimal("250") * days * travellers)
    
    subtotal = transport + stay_food + entry_fees + local_transit
    contingency = q(subtotal * contingency_rate)
    total = subtotal + contingency
    
    return {
        "transport": transport,
        "stay_food_local": stay_food,
        "entry_fees": entry_fees,
        "local_transit": local_transit,
        "contingency": contingency,
        "total": total,
        "per_person": q(total / travellers),
        "estimate_type": "indicative",
        "notes": "Estimated seed values based on standard rates. Not real-time commercial pricing."
    }

def validate(plan: Dict[str, Any], budget_inr: int) -> List[str]:
    warns = []
    for day in plan.get("days", []):
        if day.get("travel_hours", 0) > MAX_DAY_TRAVEL_H:
            warns.append(f"Day {day['day']}: {day['travel_hours']}h travel exceeds recommended {MAX_DAY_TRAVEL_H}h daily driving limit.")
    
    total_cost = plan.get("budget", {}).get("total", Decimal("0"))
    if total_cost > Decimal(str(budget_inr)):
        deficit = total_cost - Decimal(str(budget_inr))
        warns.append(f"Estimated cost (₹{total_cost:,.0f}) exceeds budget (₹{budget_inr:,.0f}) by ₹{deficit:,.0f}. Consider fewer stops or shorter duration.")
    
    return warns

def generate(
    origin_id: str,
    days: int,
    travellers: int,
    budget_inr: int,
    interests: List[str],
    accessible: bool = False,
    locked: Optional[List[str]] = None,
    travel_style: str = "moderate"
) -> Dict[str, Any]:
    locked = locked or []
    dests = load_destinations()
    by_id = {d["id"]: d for d in dests}
    
    start = by_id.get(origin_id)
    if start is None:
        raise ValueError(f"Unknown origin '{origin_id}'; please select a recognized Karnataka hub (e.g., Bengaluru, Mysuru, Mangaluru, etc.).")
    
    ranked = [d for d in rank(interests, accessible, dests) if d["id"] != origin_id]
    
    # Must include locked stops first
    chosen = [by_id[i] for i in locked if i in by_id and i != origin_id]
    
    # Fill remaining days up to requested duration
    for d in ranked:
        if len(chosen) >= days:
            break
        if d not in chosen:
            chosen.append(d)
            
    if not chosen:
        raise LookupError("No destinations match the given constraints.")
        
    ordered = order_nearest(chosen, start)
    legs, plan_days = [], []
    prev = start
    
    for n, d in enumerate(ordered, 1):
        l = leg(prev, d)
        legs.append(l)
        prev = d
        
        cats = d.get("categories", [])
        matched_cats = sorted(set(cats) & set(interests))
        why = f"Matches {', '.join(matched_cats)}" if matched_cats else "Scenic regional route fit"
        
        # Schedule slot suggestion
        visit_m = d.get("visit_minutes", 300)
        time_slot = "09:30 - 13:30 (Morning Exploration)" if visit_m <= 240 else "09:00 - 17:00 (Full-day Cultural Immersion)"
        
        plan_days.append({
            "day": n,
            "stop": d["id"],
            "name": d["name"],
            "kn": d.get("kn", d["name"]),
            "region": d.get("region", "Karnataka"),
            "district": d.get("district", ""),
            "lat": d["lat"],
            "lon": d["lon"],
            "locked": d["id"] in locked,
            "visit_minutes": visit_m,
            "travel_hours": l["duration_h"],
            "distance_km": l["distance_km"],
            "time_slot": time_slot,
            "description": d.get("description", ""),
            "description_kn": d.get("description_kn", ""),
            "cultural_notes": d.get("cultural_notes", ""),
            "source_url": d.get("source_url", ""),
            "source_title": d.get("source_title", "Karnataka Tourism"),
            "image_url": d.get("image_url", ""),
            "step_free": d.get("step_free", False),
            "entry_fee_inr": d.get("entry_fee_inr", 0),
            "best_season": d.get("best_season", "October to March"),
            "why": why,
            "verification_status": d.get("verification_status", "verified")
        })
        
    budget_details = budget(ordered, legs, travellers, days)
    total_val = float(budget_details["total"])
    rem_budget = float(budget_inr) - total_val
    budget_details["target_budget"] = budget_inr
    budget_details["remaining_budget"] = round(rem_budget, 2)
    budget_details["budget_health"] = "healthy" if rem_budget >= 0 else "exceeded"
    
    plan = {
        "origin": {
            "id": start["id"],
            "name": start["name"],
            "kn": start.get("kn", start["name"]),
            "lat": start["lat"],
            "lon": start["lon"]
        },
        "duration_days": days,
        "travellers": travellers,
        "target_budget": budget_inr,
        "travel_style": travel_style,
        "days": plan_days,
        "legs": legs,
        "budget": budget_details,
        "assumptions": [
            "Travel times estimated using straight-line distance with regional road terrain factors.",
            "Accommodation and dining rates are indicative regional seasonal estimates.",
            "Fuel calculated at indicative rate of ₹12/km.",
            "Weather conditions and local road closures may affect actual driving durations."
        ],
        "warnings": []
    }
    plan["warnings"] = validate(plan, budget_inr)
    return plan

def replace_stop(
    current_plan: Dict[str, Any],
    old_stop_id: str,
    new_stop_id: Optional[str] = None,
    interests: Optional[List[str]] = None,
    accessible: bool = False
) -> Dict[str, Any]:
    """Replaces a specific stop without disrupting the rest of the itinerary."""
    dests = load_destinations()
    by_id = {d["id"]: d for d in dests}
    
    existing_stops = [d["stop"] for d in current_plan["days"]]
    if old_stop_id not in existing_stops:
        raise ValueError(f"Stop '{old_stop_id}' is not in current itinerary.")
        
    if new_stop_id:
        if new_stop_id not in by_id:
            raise ValueError(f"Target destination '{new_stop_id}' not found.")
        replacement_id = new_stop_id
    else:
        # Find best candidate from the same region or matching interests not already in trip
        old_dest = by_id.get(old_stop_id, {})
        old_region = old_dest.get("region", "")
        candidates = [
            d for d in dests 
            if d["id"] not in existing_stops 
            and d["id"] != current_plan["origin"]["id"]
            and (not accessible or d.get("step_free", False))
        ]
        # Prefer same region
        same_reg = [d for d in candidates if d.get("region") == old_region]
        if same_reg:
            replacement_id = same_reg[0]["id"]
        elif candidates:
            replacement_id = candidates[0]["id"]
        else:
            raise LookupError("No alternative destinations available.")
            
    # Preserve locked flags
    locked = [d["stop"] for d in current_plan["days"] if d.get("locked")]
    if old_stop_id in locked:
        locked.remove(old_stop_id)
    locked.append(replacement_id)
    
    # Regenerate retaining same parameters
    return generate(
        origin_id=current_plan["origin"]["id"],
        days=current_plan["duration_days"],
        travellers=current_plan["travellers"],
        budget_inr=current_plan["target_budget"],
        interests=interests or ["heritage", "nature"],
        accessible=accessible,
        locked=locked,
        travel_style=current_plan.get("travel_style", "moderate")
    )
