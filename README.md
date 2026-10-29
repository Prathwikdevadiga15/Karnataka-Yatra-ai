# Karnataka Yatra AI

**"Discover Karnataka. Experience More. Travel Smarter."**  
*ಕನ್ನಡದಲ್ಲೇ ಪ್ರವಾಸ ಯೋಜನೆ • ಅಧಿಕೃತ ಸಾಂಸ್ಕೃತಿಕ ಮಾಹಿತಿ • ನಿಖರ ಬಜೆಟ್*

- 🌐 **Live Website:** [https://karnataka-yatra-live.vercel.app](https://karnataka-yatra-live.vercel.app)
- 🐙 **GitHub Repository:** [https://github.com/Prathwikdevadiga15/karnataka-yatra-ai](https://github.com/Prathwikdevadiga15/karnataka-yatra-ai)

A production-minded, culturally authentic AI tourism platform engineered for Karnataka travel planning. Built with deterministic feasibility algorithms, verified Archaeological Survey of India (ASI) & Karnataka Tourism RAG grounding, interactive geospatial routing, and native Kannada-English accessibility.

---

## 🌟 Key Features

### 0. Cinematic Hero Section & Living Culture Video Showcase
- **Cinematic Video Hero:** Features rich background video loops with real-time channel switching:
  - 🌊 **Cascades of Jog Falls & Western Ghats:** 830-foot plunge cascades of the Sahyadris.
  - 👑 **Royal Mysuru Dasara & Grandeur:** 100,000 palace lights and 400-year Wadiyar heritage.
  - 🏛️ **UNESCO Boulders of Hampi:** Stone chariot and Vijayanagara granite architecture.
  - 🎭 **Coastal Yakshagana & Folk Lore:** Epic dance drama, vibrant Mudi headgear, and Arabian sea lore.
- **Interactive Controls:** Toggle sound, play/pause video, and watch an interactive 4K cultural documentary film modal with chapter selection.
- **Soul of Karnataka Showcase:** Dedicated filterable exhibition for performing arts, royal heritage, UNESCO architecture, and sacred ecology.
- **Iconic Places Showcase:** Spotlight on Jog Falls, Hampi, Mysuru Palace, Belur & Halebidu, Badami Caves, and Gokarna.
- **Backend Culture API:** `/api/v1/culture/traditions`, `/api/v1/culture/places`, `/api/v1/culture/videos`, and `/api/v1/culture/highlight`.

### 1. Deterministic AI Itinerary Generator
- **Authentic Routing:** Sequences multi-day journeys starting from major Karnataka transit hubs (Bengaluru, Mysuru, Mangaluru, Udupi, Chikkamagaluru).
- **Road & Terrain Factoring:** Incorporates realistic road curvature factors (1.35x) and regional speed limits (35 km/h in Malnad ghat passes vs 55 km/h on national highway corridors).
- **Schedule Feasibility:** Validates daily driving hours (flags schedules exceeding 6 hours/day), budget constraints, and conflicts.
- **Stop Replacement:** Swap any stop in seconds without losing the rest of your itinerary.
- **Lock Controls:** Lock specific must-visit destinations so they are guaranteed in your plan.

### 2. Multi-Category Budget Engine
- **Fuel & Road Transit:** Calculated deterministically from road corridor mileage @ ₹12/km.
- **Hospitality & Food:** Transparent per-person regional rates for authentic homestays & dining.
- **Monument Entry Fees:** Verified ticket prices from ASI and state tourism records.
- **10% Emergency Contingency:** Buffer for toll plazas, state taxes, and unexpected incidentals.
- **Group Size Simulator:** Dynamically models how adding travellers distributes shared road fuel costs.

### 3. Cultural RAG & AI Assistant
- Grounded strictly in verified Karnataka heritage records (ASI, UNESCO, Department of Tourism).
- Dual-language support (English & native ಕನ್ನಡ script).
- Conversational assistant with executable itinerary modification actions.
- Web Speech API and Azure AI Speech integration for voice recognition and speech synthesis.

### 4. Interactive Geospatial Visualizer
- Leaflet interactive map with custom colored and numbered marker pins.
- Polyline route corridors connecting day-by-day stops.
- Day-based filtering ("All Days", "Day 1", "Day 2", etc.) with dynamic bounding.
- Stop details inspection drawer.

### 5. Inclusivity & Regional Coverage
- **7 Geographic Regions:** Coastal Karnataka, Malnad, Old Mysore, North Karnataka, Hoysala, Bengaluru, and Kalyana Karnataka.
- **Step-Free Accessibility Filter:** Highlights wheelchair-accessible landmarks.
- **Live Weather Advisories:** Regional weather cautions for ghat driving, monsoon downpours, and midday heat.
- **Admin Verification Portal:** Edit coordinates, verify sources, and review traveler feedback.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Leaflet, React Router v6, Lucide Icons
- **Backend:** Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn
- **Database:** PostgreSQL 16 / SQLite dev fallback with automatic seeding
- **AI & Speech:** Cultural Knowledge RAG Engine, Web Speech API, Azure Speech / OpenAI provider abstractions
- **Testing:** pytest, HTTPX, FastAPI TestClient

---

## 🚀 Quickstart Guide

### Option A: Local Development

#### 1. Backend
```bash
cd backend
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
python app/db/seed.py
uvicorn app.main:app --reload --port 8000
```
Backend runs at: `http://localhost:8000` (API docs at `http://localhost:8000/docs`)

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173` (proxies `/api` requests to port 8000)

---

### Option B: Docker Compose
```bash
docker-compose up --build
```
Launches PostgreSQL, FastAPI backend, and React frontend with persistent volumes.

---

## 🧪 Testing

Run backend automated test suite:
```bash
python -m pytest backend/tests
```
All 13 comprehensive tests pass covering:
- Health check
- Paginated search & regional filtering
- Destination details with weather advisories
- Deterministic itinerary generation & budget scaling
- Group size budget multipliers
- Locked stop preservation
- Schedule validation and driving duration limits
- One-click stop replacement
- Bilingual RAG assistant queries (English & Kannada)
- Feedback submission and retrieval

Run frontend build check:
```bash
cd frontend
npm run build
```

---

## 📚 Documentation

- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Reference](docs/API.md)
- [Security & Privacy](docs/SECURITY.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Hackathon Demo Walkthrough Script](docs/DEMO_SCRIPT.md)

---

## 📄 License & Attribution

Crafted for the National Technology Hackathon. Grounded in authentic regional heritage from the Archaeological Survey of India (ASI) and the Department of Tourism, Government of Karnataka.
