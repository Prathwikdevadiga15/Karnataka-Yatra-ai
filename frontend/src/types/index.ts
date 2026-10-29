export type Language = "en" | "kn";

export interface Destination {
  id: string;
  name: string;
  kn?: string;
  region: string;
  district?: string;
  lat: number;
  lon: number;
  categories: string[];
  description: string;
  description_kn?: string;
  cultural_notes?: string;
  visit_minutes: number;
  step_free: boolean;
  daily_cost_pp: number;
  entry_fee_inr: number;
  best_season?: string;
  opening_hours?: string;
  source_url?: string;
  source_title?: string;
  verification_status: "verified" | "unverified_seed" | "community";
  image_url?: string;
  weather?: {
    temperature_c: number;
    humidity_percent: number;
    condition: string;
    condition_kn?: string;
    advisory?: string;
    severity?: string;
    last_updated: string;
    provider: string;
  };
}

export interface PlanDay {
  day: number;
  stop: string;
  name: string;
  kn?: string;
  region: string;
  district?: string;
  lat: number;
  lon: number;
  locked: boolean;
  visit_minutes: number;
  travel_hours: number;
  distance_km: number;
  time_slot: string;
  description: string;
  description_kn?: string;
  cultural_notes?: string;
  source_url?: string;
  source_title?: string;
  image_url?: string;
  step_free: boolean;
  entry_fee_inr: number;
  best_season?: string;
  why: string;
  verification_status: string;
}

export interface RouteLeg {
  from: string;
  from_name?: string;
  to: string;
  to_name?: string;
  from_coords?: [number, number];
  to_coords?: [number, number];
  distance_km: number;
  duration_h: number;
  estimate_type: string;
  provider?: string;
}

export interface BudgetDetails {
  transport: string | number;
  stay_food_local: string | number;
  entry_fees: string | number;
  local_transit: string | number;
  contingency: string | number;
  total: string | number;
  per_person: string | number;
  target_budget: number;
  remaining_budget: number;
  budget_health: "healthy" | "exceeded";
  estimate_type: string;
  notes: string;
}

export interface WeatherAlert {
  day: number;
  stop: string;
  condition: string;
  advisory: string;
  severity: string;
}

export interface Plan {
  origin: {
    id: string;
    name: string;
    kn?: string;
    lat: number;
    lon: number;
  };
  duration_days: number;
  travellers: number;
  target_budget: number;
  travel_style: string;
  days: PlanDay[];
  legs: RouteLeg[];
  budget: BudgetDetails;
  assumptions: string[];
  warnings: string[];
  weather_alerts?: WeatherAlert[];
}

export interface PlanRequest {
  origin: string;
  duration_days: number;
  travellers: number;
  budget_inr: number;
  interests: string[];
  accessible: boolean;
  locked?: string[];
  travel_style?: string;
}

export interface SavedTrip {
  id: string;
  title: string;
  origin: string;
  duration_days: number;
  traveller_count: number;
  budget_inr: number;
  created_at?: string;
  plan: Plan;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  sources?: Array<{
    destination?: string;
    title: string;
    url: string;
    verification_status?: string;
  }>;
  suggestedAction?: {
    type: string;
    destination_id?: string;
    destination_name?: string;
    destination_kn?: string;
    recommendation?: string;
    label: string;
  };
  timestamp: string;
}

export interface FeedbackItem {
  id?: string;
  rating: number;
  comment?: string;
  category?: string;
  created_at?: string;
}
