# Karnataka Yatra AI — Hackathon Live Demonstration Script

Target Duration: **3 Minutes**

---

### Step 1: The Problem & Regional Mission (0:00 - 0:30)
- **Voiceover:** *"Generic travel planners hallucinate fake prices, recommend impossible driving times across the Western Ghats, and lack authentic regional cultural context for Karnataka. Today we present **Karnataka Yatra AI** — an intelligent, culturally grounded, bilingual tourism platform for Karnataka."*
- **Action:** Open Homepage (`http://localhost:5173`). Toggle the language switch at the top right to **ಕನ್ನಡ** to show full native Kannada UI rendering, then toggle back to English.
- **Highlight:** Show the 7 distinct regions (Coastal, Malnad, Old Mysore, North Karnataka, Hoysala) and official tourism citations.

---

### Step 2: Deterministic AI Journey Planning (0:30 - 1:15)
- **Action:** Click **"Plan My Journey"** or use the quick form.
  - Origin: *Bengaluru*
  - Duration: *3 Days*
  - Travellers: *2*
  - Budget: *₹35,000*
  - Themes: *Heritage & Nature*
  - Check *Step-free / Accessible routes* or choose *Must-visit: Mysuru*.
- **Click:** *"Generate Itinerary"*.
- **Highlight:**
  - Show Day-by-Day timeline with Morning and Afternoon slots.
  - Notice the **transit legs**: road distance calculated with ghat-speed adjustments and road factors (e.g. 1.35x haversine).
  - Inspect the **Deterministic Cost Strip**: Transport (fuel @ ₹12/km), Homestays/Dining, and verified ASI entry tickets.
  - Click on **"Replace Stop"**: Show how a user can swap Coorg for Chikkamagaluru with 1 click without losing the rest of the schedule!

---

### Step 3: Interactive Geospatial Map (1:15 - 1:45)
- **Action:** Click **"View on Map"** or navigate to `/map`.
- **Highlight:**
  - Custom themed pins (Gold for origin, Forest green numbered pins for daily stops).
  - Dashed route polyline connecting the itinerary corridor.
  - Click any marker to open the inspection drawer showing visit hours and drive times.
  - Filter by **"Day 1"**, **"Day 2"**, or **"All Days"** with dynamic bounds fitting.

---

### Step 4: Cultural RAG & Kannada Voice Assistant (1:45 - 2:30)
- **Action:** Navigate to `/assistant`.
- **Highlight:**
  - Click a sample prompt chip: *"Tell me about Hampi's UNESCO ruins and history"*.
  - Show the response: grounded in verified ASI records with clickable source links.
  - Click **"Listen (Speak)"**: Web Speech synthesis articulates the response.
  - Click the **Mic** button to demonstrate voice input.
  - Type: *"Add Gokarna to my itinerary"* — assistant returns a one-click actionable button *"Add Gokarna to Itinerary"*.

---

### Step 5: Persistence, Budget Optimizer & Governance (2:30 - 3:00)
- **Action:**
  - Open `/budget`: Show the category progress bar and drag the **Group Size Simulator** slider to demonstrate shared fuel savings!
  - Open `/trips`: Show saved itineraries, duplicate, and export JSON.
  - Open `/admin`: Show destination coordinates management and traveler feedback logs.
- **Closing:** *"With authentic Kannada accessibility, deterministic budget modeling, verified ASI sources, and zero hallucinated pricing, Karnataka Yatra AI sets a new standard for regional travel technology."*
