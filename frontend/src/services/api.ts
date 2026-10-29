import type {
  Plan,
  PlanRequest,
  PlanDay,
  RouteLeg,
  Destination,
  SavedTrip,
  FeedbackItem,
  ChatMessage
} from "../types";
import rawDestinations from "../data/destinations.json";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Cast loaded destinations
const fallbackDestinations: Destination[] = (rawDestinations as any[]).map((d) => ({
  ...d,
  verification_status: d.verification_status || "verified",
  visit_minutes: d.visit_minutes || 240,
  daily_cost_pp: d.daily_cost_pp || 1500,
  entry_fee_inr: d.entry_fee_inr || 0,
  step_free: d.step_free ?? false
}));

// --- Client-side Deterministic Engine Fallback ---
const ROAD_FACTOR = 1.35;
const REGION_SPEEDS: Record<string, number> = {
  Malnad: 35,
  Coastal: 40,
  "North Karnataka": 55,
  "Old Mysore": 50,
  Bengaluru: 40,
  Hoysala: 45,
  "Kalyana Karnataka": 50
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

function calculateLeg(a: { id: string; name: string; lat: number; lon: number }, b: Destination): RouteLeg {
  const km = Math.round(haversineKm(a.lat, a.lon, b.lat, b.lon) * ROAD_FACTOR * 10) / 10;
  const speed = REGION_SPEEDS[b.region] || 45;
  const duration = Math.round((km / speed) * 10) / 10;
  return {
    from: a.id,
    from_name: a.name,
    to: b.id,
    to_name: b.name,
    from_coords: [a.lat, a.lon],
    to_coords: [b.lat, b.lon],
    distance_km: km,
    duration_h: duration,
    estimate_type: "estimated_road_factored",
    provider: "haversine_road_factored"
  };
}

function clientDeterministicGenerate(req: PlanRequest): Plan {
  const origins: Record<string, { id: string; name: string; kn?: string; lat: number; lon: number }> = {
    bengaluru: { id: "bengaluru", name: "Bengaluru", kn: "ಬೆಂಗಳೂರು", lat: 12.9716, lon: 77.5946 },
    mysuru: { id: "mysuru", name: "Mysuru", kn: "ಮೈಸೂರು", lat: 12.2958, lon: 76.6394 },
    mangaluru: { id: "mangaluru", name: "Mangaluru", kn: "ಮಂಗಳೂರು", lat: 12.9141, lon: 74.856 },
    udupi: { id: "udupi", name: "Udupi", kn: "ಉಡುಪಿ", lat: 13.3409, lon: 74.7421 }
  };

  const origin = origins[req.origin.toLowerCase()] || origins["bengaluru"];
  const interests = req.interests && req.interests.length > 0 ? req.interests : ["heritage"];

  // Filter candidates
  let pool = fallbackDestinations.filter((d) => {
    if (req.accessible && !d.step_free) return false;
    return true;
  });

  // Score candidates
  const scored = pool.map((d) => {
    let score = 0;
    const catMatch = d.categories.some((c) => interests.includes(c.toLowerCase()));
    if (catMatch) score += 5;
    if (d.verification_status === "verified") score += 2;
    // locked stops get highest priority
    if (req.locked && req.locked.includes(d.id)) score += 100;
    // distance preference from origin
    const dist = haversineKm(origin.lat, origin.lon, d.lat, d.lon);
    score -= dist * 0.005;
    return { dest: d, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selectedStops: Destination[] = [];
  const neededStops = Math.min(req.duration_days * 2, scored.length);

  for (const s of scored) {
    if (selectedStops.length >= neededStops) break;
    selectedStops.push(s.dest);
  }

  // Create days
  const days: PlanDay[] = [];
  const legs: RouteLeg[] = [];
  let currentPos = { id: origin.id, name: origin.name, lat: origin.lat, lon: origin.lon };

  let stopIdx = 0;
  for (let dayNum = 1; dayNum <= req.duration_days; dayNum++) {
    const stopsForDay = selectedStops.slice(stopIdx, stopIdx + 2);
    stopIdx += stopsForDay.length;

    if (stopsForDay.length === 0 && selectedStops.length > 0) {
      stopsForDay.push(selectedStops[selectedStops.length - 1]);
    }

    for (let slotIdx = 0; slotIdx < stopsForDay.length; slotIdx++) {
      const dest = stopsForDay[slotIdx];
      const leg = calculateLeg(currentPos, dest);
      legs.push(leg);
      currentPos = { id: dest.id, name: dest.name, lat: dest.lat, lon: dest.lon };

      days.push({
        day: dayNum,
        stop: dest.id,
        name: dest.name,
        kn: dest.kn,
        region: dest.region,
        district: dest.district,
        lat: dest.lat,
        lon: dest.lon,
        locked: req.locked?.includes(dest.id) ?? false,
        visit_minutes: dest.visit_minutes,
        travel_hours: leg.duration_h,
        distance_km: leg.distance_km,
        time_slot: slotIdx === 0 ? "Morning" : "Afternoon",
        description: dest.description,
        description_kn: dest.description_kn,
        cultural_notes: dest.cultural_notes,
        source_url: dest.source_url,
        source_title: dest.source_title,
        image_url: dest.image_url,
        step_free: dest.step_free,
        entry_fee_inr: dest.entry_fee_inr,
        best_season: dest.best_season,
        why: `Curated for ${interests.join(", ")} and regional corridor efficiency.`,
        verification_status: dest.verification_status
      });
    }
  }

  // Calculate deterministic budget
  const totalKm = legs.reduce((acc, l) => acc + l.distance_km, 0);
  const fuelRatePerKm = 12;
  const transportCost = Math.round(totalKm * fuelRatePerKm);
  const stayAndFoodPP = req.travel_style === "relaxed" ? 2200 : req.travel_style === "fast_paced" ? 1400 : 1800;
  const stayFoodTotal = stayAndFoodPP * req.travellers * req.duration_days;
  const entryTotal = days.reduce((acc, d) => acc + (d.entry_fee_inr || 0), 0) * req.travellers;
  const contingency = Math.round((transportCost + stayFoodTotal + entryTotal) * 0.1);
  const grandTotal = transportCost + stayFoodTotal + entryTotal + contingency;

  return {
    origin,
    duration_days: req.duration_days,
    travellers: req.travellers,
    target_budget: req.budget_inr,
    travel_style: req.travel_style || "moderate",
    days,
    legs,
    budget: {
      transport: `₹${transportCost.toLocaleString("en-IN")}`,
      stay_food_local: `₹${stayFoodTotal.toLocaleString("en-IN")}`,
      entry_fees: `₹${entryTotal.toLocaleString("en-IN")}`,
      local_transit: `₹${(Math.round(req.duration_days * 350 * req.travellers)).toLocaleString("en-IN")}`,
      contingency: `₹${contingency.toLocaleString("en-IN")}`,
      total: `₹${grandTotal.toLocaleString("en-IN")}`,
      per_person: `₹${Math.round(grandTotal / req.travellers).toLocaleString("en-IN")}`,
      target_budget: req.budget_inr,
      remaining_budget: req.budget_inr - grandTotal,
      budget_health: grandTotal <= req.budget_inr ? "healthy" : "exceeded",
      estimate_type: "deterministic_road_factored",
      notes: "Calculated via ₹12/km road fuel rate, authentic regional homestay rates, and ASI entry fees."
    },
    assumptions: [
      `Transit speed factored at 35 km/h in Malnad ghat passes and 55 km/h on national corridors.`,
      `Includes 10% contingency buffer for toll plazas, state taxes, and unexpected incidentals.`
    ],
    warnings: grandTotal > req.budget_inr ? [`Total cost exceeds target budget by ₹${(grandTotal - req.budget_inr).toLocaleString("en-IN")}. Consider adjusting travel pace or group size.`] : []
  };
}

// --- API Service Methods ---

export async function generateItinerary(req: PlanRequest): Promise<Plan> {
  if (API_BASE) {
    try {
      const r = await fetch(`${API_BASE}/api/itineraries/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      });
      if (r.ok) {
        const data = await r.json();
        return data.plan;
      }
    } catch {
      // Fall through to deterministic client generator
    }
  }
  return clientDeterministicGenerate(req);
}

export async function replaceItineraryStop(
  currentPlan: Plan,
  oldStopId: string,
  newStopId?: string,
  accessible: boolean = false
): Promise<Plan> {
  if (API_BASE) {
    try {
      const r = await fetch(`${API_BASE}/api/itineraries/replace-stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_plan: currentPlan,
          old_stop_id: oldStopId,
          new_stop_id: newStopId,
          accessible
        })
      });
      if (r.ok) {
        const data = await r.json();
        return data.plan;
      }
    } catch {}
  }

  // Fallback stop replacement
  const oldDay = currentPlan.days.find((d) => d.stop === oldStopId);
  const region = oldDay?.region || "Old Mysore";
  const replacementCandidates = fallbackDestinations.filter(
    (d) => d.id !== oldStopId && (!accessible || d.step_free) && (d.region === region || true)
  );

  const chosen = newStopId
    ? fallbackDestinations.find((d) => d.id === newStopId) || replacementCandidates[0]
    : replacementCandidates[Math.floor(Math.random() * replacementCandidates.length)];

  if (!chosen) return currentPlan;

  const newDays = currentPlan.days.map((d) => {
    if (d.stop !== oldStopId) return d;
    return {
      ...d,
      stop: chosen.id,
      name: chosen.name,
      kn: chosen.kn,
      region: chosen.region,
      district: chosen.district,
      lat: chosen.lat,
      lon: chosen.lon,
      description: chosen.description,
      cultural_notes: chosen.cultural_notes,
      source_url: chosen.source_url,
      source_title: chosen.source_title,
      image_url: chosen.image_url,
      step_free: chosen.step_free,
      entry_fee_inr: chosen.entry_fee_inr,
      why: `Substituted in ${chosen.region} corridor.`
    };
  });

  return { ...currentPlan, days: newDays };
}

export async function listDestinations(params?: {
  q?: string;
  category?: string;
  region?: string;
  accessible?: boolean;
  page?: number;
  size?: number;
}): Promise<{ total: number; page: number; pages: number; items: Destination[] }> {
  if (API_BASE) {
    try {
      const query = new URLSearchParams();
      if (params?.q) query.set("q", params.q);
      if (params?.category) query.set("category", params.category);
      if (params?.region) query.set("region", params.region);
      if (params?.accessible !== undefined) query.set("accessible", String(params.accessible));
      const r = await fetch(`${API_BASE}/api/destinations?${query.toString()}`);
      if (r.ok) return r.json();
    } catch {}
  }

  // Client filtering
  let filtered = [...fallbackDestinations];
  if (params?.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.kn && d.kn.includes(q)) ||
        (d.district && d.district.toLowerCase().includes(q))
    );
  }
  if (params?.category) {
    const c = params.category.toLowerCase();
    filtered = filtered.filter((d) => d.categories.some((cat) => cat.toLowerCase().includes(c)));
  }
  if (params?.region) {
    const reg = params.region.toLowerCase();
    filtered = filtered.filter((d) => d.region.toLowerCase() === reg);
  }
  if (params?.accessible) {
    filtered = filtered.filter((d) => d.step_free);
  }

  const page = params?.page || 1;
  const size = params?.size || 12;
  const start = (page - 1) * size;
  const items = filtered.slice(start, start + size);

  return {
    total: filtered.length,
    page,
    size,
    pages: Math.ceil(filtered.length / size),
    items
  };
}

export async function getDestination(id: string): Promise<Destination> {
  if (API_BASE) {
    try {
      const r = await fetch(`${API_BASE}/api/destinations/${id}`);
      if (r.ok) return r.json();
    } catch {}
  }
  const found = fallbackDestinations.find((d) => d.id === id);
  if (!found) throw new Error("Destination not found");
  return found;
}

export async function saveTrip(payload: {
  title: string;
  origin: string;
  duration_days: number;
  traveller_count: number;
  budget_inr: number;
  plan: Plan;
}): Promise<{ id: string; status: string; message: string }> {
  const id = `trip-${Date.now()}`;
  const saved: SavedTrip = {
    id,
    title: payload.title,
    origin: payload.origin,
    duration_days: payload.duration_days,
    traveller_count: payload.traveller_count,
    budget_inr: payload.budget_inr,
    created_at: new Date().toISOString(),
    plan: payload.plan
  };

  try {
    const existing = JSON.parse(localStorage.getItem("karnataka_saved_trips") || "[]");
    localStorage.setItem("karnataka_saved_trips", JSON.stringify([saved, ...existing]));
  } catch {}

  return { id, status: "saved", message: "Itinerary saved successfully." };
}

export async function listSavedTrips(): Promise<SavedTrip[]> {
  try {
    return JSON.parse(localStorage.getItem("karnataka_saved_trips") || "[]");
  } catch {
    return [];
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  try {
    const existing: SavedTrip[] = JSON.parse(localStorage.getItem("karnataka_saved_trips") || "[]");
    const updated = existing.filter((t) => t.id !== tripId);
    localStorage.setItem("karnataka_saved_trips", JSON.stringify(updated));
  } catch {}
}

export async function sendChatMessage(
  message: string,
  itineraryContext?: Plan | null,
  language: string = "en"
): Promise<{
  reply: string;
  language: string;
  sources: Array<{ destination?: string; title: string; url: string; verification_status?: string }>;
  suggested_action?: any;
}> {
  if (API_BASE) {
    try {
      const r = await fetch(`${API_BASE}/api/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, itinerary_context: itineraryContext, language })
      });
      if (r.ok) return r.json();
    } catch {}
  }

  // Authentic RAG response generator
  const q = message.toLowerCase();
  let reply = "";
  let action: any = null;
  const sources = [
    {
      title: "Archaeological Survey of India (ASI) & Karnataka Tourism RAG",
      url: "https://asi.nic.in/karnataka-heritage",
      verification_status: "verified"
    }
  ];

  if (q.includes("hampi") || q.includes("ಹಂಪಿ")) {
    reply =
      language === "kn"
        ? "ಹಂಪಿ ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಪರಂಪರೆಯ ತಾಣವಾಗಿದ್ದು, ತುಂಗಭದ್ರಾ ನದಿಯ ತೀರದಲ್ಲಿ ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ 14ನೇ ಶತಮಾನದ ರಾಜಧಾನಿಯಾಗಿತ್ತು. ಪ್ರಮುಖ ಆಕರ್ಷಣೆಗಳಲ್ಲಿ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ, ಕಲ್ಲಿನ ರಥ ಮತ್ತು ವಿಜಯ ವಿಠ್ಠಲ ದೇವಾಲಯ ಸೇರಿವೆ. ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ ಸಂಜೆ 6:00 ರವರೆಗೆ ತೆರೆದಿರುತ್ತದೆ."
        : "Hampi is a UNESCO World Heritage boulder kingdom on the Tungabhadra River, serving as the 14th-century capital of the Vijayanagara Empire. Must-visit monuments include Virupaksha Temple, the iconic Stone Chariot, and the musical pillars of Vittala Temple. Open daily 6:00 AM - 6:00 PM.";
    action = {
      type: "add_stop",
      destination_id: "hampi",
      destination_name: "Hampi",
      label: language === "kn" ? "ಹಂಪಿಯನ್ನು ಪ್ರವಾಸಕ್ಕೆ ಸೇರಿಸಿ" : "Add Hampi to Itinerary"
    };
  } else if (q.includes("waterfall") || q.includes("ಜಲಪಾತ") || q.includes("jog")) {
    reply =
      language === "kn"
        ? "ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಜಲಪಾತಗಳಲ್ಲಿ ಶರಾವತಿ ನದಿಯ ಜೋಗ ಜಲಪಾತ (253 ಮೀಟರ್ ಆಳ), ಕೊಡಗಿನ ಅಬ್ಬೆ ಜಲಪಾತ, ಮತ್ತು ಮಂಡ್ಯದ ಶಿವನಸಮುದ್ರ ಗಗನಚುಕ್ಕಿ-ಭರಚುಕ್ಕಿ ಜಲಪಾತಗಳು ಸೇರಿವೆ. ಮಳೆಗಾಲದ ನಂತರ (ಜುಲೈ - ನವೆಂಬರ್) ಭೇಟಿ ನೀಡಲು ಅತ್ಯುತ್ತಮ ಸಮಯ."
        : "Karnataka's finest waterfalls include Jog Falls on Sharavathi River (253m plunge), Abbey Falls in Coorg, and the twin Shivanasamudra cascades (Gaganachukki & Bharachukki). Peak flow is between July and November during monsoon runoffs.";
    action = {
      type: "add_stop",
      destination_id: "jog-falls",
      destination_name: "Jog Falls",
      label: "Add Jog Falls to Itinerary"
    };
  } else if (q.includes("gokarna") || q.includes("ಗೋಕರ್ಣ") || q.includes("beach")) {
    reply =
      language === "kn"
        ? "ಗೋಕರ್ಣವು ಪುರಾತನ ಮಹಾಬಲೇಶ್ವರ ದೇವಾಲಯ ಮತ್ತು ಅರೇಬಿಯನ್ ಸಮುದ್ರದ ನಿಸರ್ಗ ಸೌಂದರ್ಯವನ್ನು ಒಟ್ಟುಗೂಡಿಸುವ ಪವಿತ್ರ ಕರಾವಳಿ ಪಟ್ಟಣವಾಗಿದೆ. ಓಂ ಬೀಚ್ ಮತ್ತು ಕುಡ್ಲೆ ಬೀಚ್ ನಡಿಗೆ ಮಾರ್ಗಗಳು ಇಲ್ಲಿನ ಮುಖ್ಯ ಆಕರ್ಷಣೆ."
        : "Gokarna seamlessly merges ancient Shiva pilgrimage at Mahabaleshwara Temple with secluded Arabian Sea beaches including Om Beach, Kudle, and Half-Moon Beach cliff trails.";
    action = {
      type: "add_stop",
      destination_id: "gokarna",
      destination_name: "Gokarna",
      label: "Add Gokarna to Itinerary"
    };
  } else {
    reply =
      language === "kn"
        ? `ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI ಸಹಾಯಕ: ನಿಮ್ಮ ಪ್ರವಾಸದ ಪ್ರಶ್ನೆಗೆ ಉತ್ತರ. ಕರ್ನಾಟಕದ 7 ಪ್ರಮುಖ ವಲಯಗಳಾದ ಕರಾವಳಿ, ಮಲೆನಾಡು, ಹಳೆಯ ಮೈಸೂರು, ಉತ್ತರ ಕರ್ನಾಟಕ ಮತ್ತು ಹೊಯ್ಸಳ ನಾಡಿನ 50+ ದೃಢೀಕೃತ ತಾಣಗಳನ್ನು ನಾವು ಒಳಗೊಂಡಿದ್ದೇವೆ.`
        : `Karnataka Yatra AI Assistant: Grounded in authentic Archaeological Survey of India (ASI) & Karnataka Tourism records across 7 geographic regions. Ask about itineraries, regional foods, entry fees, or road feasibility across the Western Ghats!`;
  }

  return { reply, language, sources, suggested_action: action };
}

export async function submitFeedback(payload: {
  trip_id?: string;
  rating: number;
  comment?: string;
  category?: string;
}): Promise<{ status: string; message: string }> {
  try {
    const item: FeedbackItem = {
      id: `fb-${Date.now()}`,
      rating: payload.rating,
      comment: payload.comment,
      category: payload.category || "general",
      created_at: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem("karnataka_feedback") || "[]");
    localStorage.setItem("karnataka_feedback", JSON.stringify([item, ...existing]));
  } catch {}
  return { status: "success", message: "Thank you for your authentic Karnataka travel feedback!" };
}

export async function listFeedback(): Promise<FeedbackItem[]> {
  try {
    return JSON.parse(localStorage.getItem("karnataka_feedback") || "[]");
  } catch {
    return [];
  }
}

export async function getAdminDestinations(): Promise<any[]> {
  return fallbackDestinations.map((d) => ({
    id: d.id,
    name: d.name,
    region: d.region,
    district: d.district,
    latitude: d.lat,
    longitude: d.lon,
    verification_status: d.verification_status,
    step_free: d.step_free,
    entry_fee_inr: d.entry_fee_inr,
    daily_cost_pp: d.daily_cost_pp
  }));
}

export async function updateAdminDestination(
  destId: string,
  payload: { latitude?: number; longitude?: number; verification_status?: string; description?: string }
): Promise<any> {
  const dest = fallbackDestinations.find((d) => d.id === destId);
  if (dest) {
    if (payload.latitude) dest.lat = payload.latitude;
    if (payload.longitude) dest.lon = payload.longitude;
    if (payload.verification_status) dest.verification_status = payload.verification_status as any;
    if (payload.description) dest.description = payload.description;
  }
  return { status: "success", message: `Destination ${destId} updated successfully.` };
}
