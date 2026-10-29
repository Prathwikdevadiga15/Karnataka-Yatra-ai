# Karnataka Yatra AI — System Architecture

## 1. System Overview

**Karnataka Yatra AI** is an intelligent, culturally grounded, bilingual tourism platform built specifically for Karnataka travel planning and regional exploration. The application combines deterministic itinerary generation, verified evidence retrieval (RAG), geospatial route visualizers, cost optimization, and Kannada-English voice interaction.

Product Tagline: *"Discover Karnataka. Experience More. Travel Smarter."*

```
                                  +-----------------------------+
                                  |   React + Vite + Leaflet    |
                                  |   Frontend (Bilingual UI)   |
                                  +--------------+--------------+
                                                 | REST / JSON
                                                 v
                                  +-----------------------------+
                                  |       FastAPI Backend       |
                                  |  (Modular Monolith Service) |
                                  +--------------+--------------+
                                                 |
             +--------------------+--------------+--------------------+
             |                    |                                   |
             v                    v                                   v
+-------------------------+ +-------------------------+ +-------------------------+
|  Deterministic Planning | |  Cultural RAG & AI Hub  | |   Geospatial & Weather  |
|  - Nearest-neighbor TSP | |  - Verified ASI / KSTDC | |  - Haversine + road leg |
|  - Multi-tier budget    | |  - Dual language engine | |  - District advisories  |
|  - Schedule feasibility | |  - Executable actions   | |  - Azure Maps fallback  |
+-------------------------+ +-------------------------+ +-------------------------+
             |                    |                                   |
             +--------------------+-----------------------------------+
                                  |
                                  v
                      +-------------------------+
                      |   SQLAlchemy 2.0 ORM    |
                      | PostgreSQL / SQLite Dev |
                      +-------------------------+
```

## 2. Core Architectural Components

### 2.1 Deterministic Planning Engine (`app.services.planning.engine`)
- **No Hallucinated Destinations:** Operates strictly on verified Karnataka destinations seeded with official coordinates, district boundaries, entry fees, and categories.
- **Topological Nearest-Neighbor Optimization:** Sequences must-visit (locked) and ranked candidate destinations starting from the selected hub (Bengaluru, Mysuru, Mangaluru, etc.).
- **Terrain-Aware Transit Modeling:** Factors road factors (1.35x haversine) and regional speed limits (35 km/h in Malnad ghat passes, 55 km/h on North Karnataka highway corridors).
- **Multi-Category Budgeting:**
  - Transport (fuel @ ₹12/km)
  - Hospitality & food (`daily_cost_pp` * travellers * days)
  - Verified monument entry tickets (ASI / State Tourism)
  - 10% emergency contingency buffer
- **Schedule Feasibility:** Validates daily driving duration (flags trips exceeding 6 hours of daily driving) and budget overruns.
- **Stop Replacement:** Enables one-click stop swapping with matching regional alternatives without disrupting remaining days.

### 2.2 Cultural Retrieval-Augmented Generation (RAG) (`app.services.retrieval.rag`)
- Evaluates queries against verified destination records containing historical significance, Kannada translations, opening hours, and official source links.
- Emits citations attached directly to factual assertions, preventing hallucinations.

### 2.3 Bilingual AI Assistant & Speech Services (`app.services.ai`, `app.services.speech`)
- Full Kannada (`kn-IN`) and English (`en-IN`) text and voice support.
- Web Speech API integration with Azure AI Speech fallback.
- Detects intent to modify itineraries (e.g., "Add Gokarna to day 2") and provides validated executable actions.

### 2.4 Database & Persistence Layer (`app.models.entities`, `app.db.session`)
- SQLAlchemy 2.0 declarative models supporting PostgreSQL with automatic zero-friction fallback to SQLite for local development.
- Entities: `User`, `Destination`, `DestinationTranslation`, `DestinationSource`, `Trip`, `ItineraryDay`, `ItineraryStop`, `BudgetItem`, `RouteLeg`, `Feedback`, `GenerationLog`.

## 3. Technology Stack Summary

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Leaflet, React Router v6, Lucide Icons |
| Backend | Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn |
| Database | PostgreSQL 16 / SQLite, Alembic migrations |
| Mapping | Leaflet TileLayer & Custom HTML Pins, Azure Maps compatible |
| Speech & AI | Azure AI Speech SDK hooks, Web Speech API, RAG Knowledge Base |
| Testing | pytest, HTTPX, FastAPI TestClient, Vitest / TypeScript compiler |
