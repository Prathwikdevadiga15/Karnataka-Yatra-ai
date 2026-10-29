import json
from pathlib import Path
from typing import List, Dict, Any, Optional

DATA = Path(__file__).resolve().parents[4] / "data" / "destinations.example.json"

class TourismKnowledgeBase:
    def __init__(self):
        self._destinations = self._load()

    def _load(self) -> List[Dict[str, Any]]:
        if not DATA.exists():
            fallback = Path(__file__).resolve().parents[3] / "data" / "destinations.example.json"
            if fallback.exists():
                return json.loads(fallback.read_text(encoding="utf-8"))
        return json.loads(DATA.read_text(encoding="utf-8"))

    def get_by_id(self, dest_id: str) -> Optional[Dict[str, Any]]:
        for d in self._destinations:
            if d["id"] == dest_id:
                return d
        return None

    def search_knowledge(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        q_tokens = set(query.lower().split())
        scored = []
        for d in self._destinations:
            text = f"{d['name']} {d.get('kn','')} {d.get('region','')} {d.get('district','')} {d.get('description','')} {d.get('cultural_notes','')} {' '.join(d.get('categories',[]))}".lower()
            overlap = sum(1 for tok in q_tokens if tok in text)
            if overlap > 0:
                scored.append((overlap, d))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in scored[:top_k]]

    def get_cultural_evidence(self, dest_id: str, lang: str = "en") -> Dict[str, Any]:
        dest = self.get_by_id(dest_id)
        if not dest:
            return {
                "destination_id": dest_id,
                "found": False,
                "fact": "No verified tourism record available in the official Karnataka knowledge base.",
                "source": None
            }
        
        description = dest.get("description_kn") if lang == "kn" and dest.get("description_kn") else dest.get("description", "")
        name = dest.get("kn") if lang == "kn" and dest.get("kn") else dest.get("name", "")
        
        return {
            "destination_id": dest["id"],
            "found": True,
            "name": name,
            "region": dest.get("region"),
            "district": dest.get("district"),
            "cultural_notes": dest.get("cultural_notes", ""),
            "description": description,
            "best_season": dest.get("best_season", "October to March"),
            "opening_hours": dest.get("opening_hours", "09:00 - 18:00"),
            "source": {
                "url": dest.get("source_url", "https://karnatakatourism.org"),
                "title": dest.get("source_title", "Karnataka Tourism"),
                "verification_status": dest.get("verification_status", "verified")
            }
        }

kb = TourismKnowledgeBase()
