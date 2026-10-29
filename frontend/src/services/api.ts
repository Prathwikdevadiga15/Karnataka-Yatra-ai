import type {
  Plan,
  PlanRequest,
  Destination,
  SavedTrip,
  FeedbackItem,
  ChatMessage
} from "../types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function generateItinerary(req: PlanRequest): Promise<Plan> {
  const r = await fetch(`${API_BASE}/api/itineraries/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(typeof data.detail === "string" ? data.detail : "Failed to generate itinerary. Check your inputs.");
  }
  return data.plan;
}

export async function replaceItineraryStop(
  currentPlan: Plan,
  oldStopId: string,
  newStopId?: string,
  accessible: boolean = false
): Promise<Plan> {
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
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.detail || "Failed to replace stop.");
  return data.plan;
}

export async function listDestinations(params?: {
  q?: string;
  category?: string;
  region?: string;
  accessible?: boolean;
  page?: number;
  size?: number;
}): Promise<{ total: number; page: number; pages: number; items: Destination[] }> {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.region) query.set("region", params.region);
  if (params?.accessible !== undefined) query.set("accessible", String(params.accessible));
  if (params?.page) query.set("page", String(params.page));
  if (params?.size) query.set("size", String(params.size));

  const r = await fetch(`${API_BASE}/api/destinations?${query.toString()}`);
  if (!r.ok) throw new Error("Failed to fetch destinations");
  return r.json();
}

export async function getDestination(id: string): Promise<Destination> {
  const r = await fetch(`${API_BASE}/api/destinations/${id}`);
  if (!r.ok) throw new Error("Destination not found");
  return r.json();
}

export async function saveTrip(payload: {
  title: string;
  origin: string;
  duration_days: number;
  traveller_count: number;
  budget_inr: number;
  plan: Plan;
}): Promise<{ id: string; status: string; message: string }> {
  const r = await fetch(`${API_BASE}/api/itineraries/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error("Failed to save trip to server.");
  return r.json();
}

export async function listSavedTrips(): Promise<SavedTrip[]> {
  const r = await fetch(`${API_BASE}/api/itineraries`);
  if (!r.ok) throw new Error("Failed to load saved trips");
  const data = await r.json();
  return data.trips || [];
}

export async function deleteTrip(tripId: string): Promise<void> {
  const r = await fetch(`${API_BASE}/api/itineraries/${tripId}`, {
    method: "DELETE"
  });
  if (!r.ok) throw new Error("Failed to delete trip");
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
  const r = await fetch(`${API_BASE}/api/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      itinerary_context: itineraryContext,
      language
    })
  });
  if (!r.ok) throw new Error("Assistant response failed");
  return r.json();
}

export async function sendVoiceQuery(
  phraseHint: string,
  language: string = "kn-IN"
): Promise<{
  transcription: { text: string; language: string; confidence: number };
  chat: { reply: string; sources: any[]; suggested_action?: any };
  speech: { text: string; language: string; voice: string };
}> {
  const r = await fetch(`${API_BASE}/api/assistant/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phrase_hint: phraseHint, language })
  });
  if (!r.ok) throw new Error("Voice assistant processing failed");
  return r.json();
}

export async function submitFeedback(payload: {
  trip_id?: string;
  rating: number;
  comment?: string;
  category?: string;
}): Promise<{ status: string; message: string }> {
  const r = await fetch(`${API_BASE}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error("Failed to submit feedback");
  return r.json();
}

export async function listFeedback(): Promise<FeedbackItem[]> {
  const r = await fetch(`${API_BASE}/api/feedback`);
  if (!r.ok) throw new Error("Failed to load feedback");
  return r.json();
}

export async function getAdminDestinations(): Promise<any[]> {
  const r = await fetch(`${API_BASE}/api/admin/destinations`);
  if (!r.ok) throw new Error("Failed to load admin destinations");
  return r.json();
}

export async function updateAdminDestination(
  destId: string,
  payload: { latitude?: number; longitude?: number; verification_status?: string; description?: string }
): Promise<any> {
  const r = await fetch(`${API_BASE}/api/admin/destinations/${destId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error("Failed to update destination");
  return r.json();
}
