# Karnataka Yatra AI — API Documentation

Base URL: `http://localhost:8000/api`

---

### 1. System Health
#### `GET /api/health`
Returns system and database connectivity status.
**Response:**
```json
{
  "status": "ok",
  "service": "Karnataka Yatra AI Backend",
  "version": "1.0.0",
  "database": "connected"
}
```

---

### 2. Destinations
#### `GET /api/destinations`
Query parameters:
- `q`: Search substring across names, Kannada text, or districts.
- `category`: Filter by category (heritage, nature, beaches, temples, adventure, wildlife, food, family).
- `region`: Filter by Karnataka region (Coastal, Malnad, Old Mysore, North Karnataka, Hoysala, Bengaluru, Kalyana Karnataka).
- `accessible`: Boolean flag for step-free accessibility.
- `page`: Page index (default: 1).
- `size`: Items per page (default: 12).

#### `GET /api/destinations/{id}`
Returns complete destination details including Kannada descriptions, cultural notes, entrance fees, and live weather advisory.

---

### 3. Itinerary Generation & Replanning
#### `POST /api/itineraries/generate`
Generates a structured, validated, budget-checked itinerary.
**Request:**
```json
{
  "origin": "bengaluru",
  "duration_days": 3,
  "travellers": 2,
  "budget_inr": 35000,
  "interests": ["heritage", "nature"],
  "accessible": false,
  "locked": ["mysuru"],
  "travel_style": "moderate"
}
```
**Response:**
```json
{
  "mode": "deterministic_validated",
  "plan": {
    "origin": { "id": "bengaluru", "name": "Bengaluru", "lat": 12.9716, "lon": 77.5946 },
    "duration_days": 3,
    "travellers": 2,
    "target_budget": 35000,
    "travel_style": "moderate",
    "days": [...],
    "legs": [...],
    "budget": {
      "transport": "2450.00",
      "stay_food_local": "11400.00",
      "entry_fees": "300.00",
      "local_transit": "1500.00",
      "contingency": "1565.00",
      "total": "17215.00",
      "per_person": "8607.50",
      "remaining_budget": 17785.00,
      "budget_health": "healthy"
    },
    "warnings": [],
    "weather_alerts": [...]
  }
}
```

#### `POST /api/itineraries/replace-stop`
Replaces a single stop with a matching candidate without disrupting remaining days.
**Request:**
```json
{
  "current_plan": { ... },
  "old_stop_id": "coorg",
  "new_stop_id": "chikkamagaluru",
  "accessible": false
}
```

#### `POST /api/itineraries/save`
Persists the itinerary to the database.

#### `GET /api/itineraries`
Lists all saved itineraries.

#### `GET /api/itineraries/{id}`
Fetches a single saved itinerary.

#### `DELETE /api/itineraries/{id}`
Deletes a saved itinerary.

---

### 4. Cultural RAG & Assistant
#### `POST /api/assistant/chat`
Conversational RAG assistant query.
**Request:**
```json
{
  "message": "ಹಂಪಿಯ ಇತಿಹಾಸ ತಿಳಿಸಿ",
  "itinerary_context": null,
  "language": "kn"
}
```
**Response:**
```json
{
  "reply": "ಹಂಪಿ ಬಗ್ಗೆ ಮಾಹಿತಿ: ವಿಶ್ವ ಪರಂಪರೆಯ ತಾಣ...",
  "language": "kn",
  "sources": [
    {
      "destination": "Hampi",
      "title": "UNESCO World Heritage Centre - Group of Monuments at Hampi",
      "url": "https://whc.unesco.org/en/list/241/",
      "verification_status": "verified"
    }
  ],
  "suggested_action": null,
  "provider": "Karnataka Cultural RAG Engine"
}
```

#### `POST /api/assistant/voice`
Accepts audio transcription or phrase hints and returns both text and speech synthesis metadata.

---

### 5. Weather Advisories
#### `GET /api/weather`
Query parameters: `dest_id`, `region`.
Returns temperature, humidity, road condition, and ghat/heat travel advisories.

---

### 6. Traveler Feedback & Administration
#### `POST /api/feedback`
Submits star ratings and reviews.

#### `GET /api/feedback`
Retrieves traveler feedback logs.

#### `GET /api/admin/destinations`
Lists destinations for administrative management.

#### `PATCH /api/admin/destinations/{id}`
Updates coordinates, descriptions, and verification status.
