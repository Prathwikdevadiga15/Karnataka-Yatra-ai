import os
import re
from typing import Dict, Any, List, Optional
from app.services.retrieval.rag import kb

def is_kannada(text: str) -> bool:
    return any(0x0C80 <= ord(c) <= 0x0CFF for c in text)

def chat_assistant(
    prompt: str,
    itinerary_context: Optional[Dict[str, Any]] = None,
    preferred_language: str = "en"
) -> Dict[str, Any]:
    """
    RAG-grounded Cultural & Trip Assistant for Karnataka Yatra AI.
    Handles English & Kannada queries with verified historical evidence
    and actionable itinerary modification recommendations.
    """
    kannada_query = is_kannada(prompt) or preferred_language == "kn"
    lower_prompt = prompt.lower()
    
    # 1. Search knowledge base for relevant destinations
    relevant_dests = kb.search_knowledge(lower_prompt, top_k=2)
    sources = []
    for d in relevant_dests:
        if d.get("source_url"):
            sources.append({
                "destination": d["name"],
                "title": d.get("source_title", "Karnataka Tourism"),
                "url": d.get("source_url"),
                "verification_status": d.get("verification_status", "verified")
            })
            
    suggested_action = None
    
    # 2. Check for action intents (e.g., adding a stop, locking, or budget optimization)
    if "add" in lower_prompt or "ಸೇರಿಸಿ" in prompt or "include" in lower_prompt:
        for d in kb._destinations:
            if d["id"] in lower_prompt or d["name"].lower() in lower_prompt or d.get("kn", "") in prompt:
                suggested_action = {
                    "type": "add_stop",
                    "destination_id": d["id"],
                    "destination_name": d["name"],
                    "destination_kn": d.get("kn", d["name"]),
                    "label": f"Add {d['name']} to Itinerary" if not kannada_query else f"{d.get('kn', d['name'])} ಅನ್ನು ಪ್ರವಾಸಕ್ಕೆ ಸೇರಿಸಿ"
                }
                break

    if "budget" in lower_prompt or "ಬಜೆಟ್" in prompt or "ಕಡಿಮೆ" in prompt or "reduce" in lower_prompt or "save" in lower_prompt:
        suggested_action = {
            "type": "optimize_budget",
            "recommendation": "Switch private cab to KSRTC Rajahamsa / Airavat bus or select homestays to save ~₹4,500.",
            "label": "Apply Budget Savings" if not kannada_query else "ಬಜೆಟ್ ಉಳಿತಾಯ ಕ್ರಮಗಳನ್ನು ಅನ್ವಯಿಸಿ"
        }

    # 3. Formulate RAG-grounded response
    if relevant_dests:
        primary = relevant_dests[0]
        name = primary.get("kn") if kannada_query else primary.get("name")
        desc = primary.get("description_kn") if kannada_query else primary.get("description")
        cultural = primary.get("cultural_notes", "")
        best_time = primary.get("best_season", "October to March")
        entry_fee = primary.get("entry_fee_inr", 0)

        if kannada_query:
            reply = (
                f"{name} ಬಗ್ಗೆ ಮಾಹಿತಿ:\n\n"
                f"{desc}\n\n"
                f"🏛️ ಸಾಂಸ್ಕೃತಿಕ ಮಹತ್ವ: {cultural}\n"
                f"📅 ಉತ್ತಮ ಸಮಯ: {best_time}\n"
                f"🎟️ ಪ್ರವೇಶ ಶುಲ್ಕ: ₹{entry_fee} (ಅಂದಾಜು)\n"
            )
        else:
            reply = (
                f"Here is verified information regarding {name}:\n\n"
                f"{desc}\n\n"
                f"🏛️ Cultural Significance: {cultural}\n"
                f"📅 Best Season: {best_time}\n"
                f"🎟️ Indicative Entry Fee: ₹{entry_fee}\n"
            )
    else:
        # Contextual response about the trip
        if itinerary_context and itinerary_context.get("days"):
            days = itinerary_context["days"]
            stop_names = [d.get("name") for d in days]
            budget_total = itinerary_context.get("budget", {}).get("total", 0)
            if kannada_query:
                reply = (
                    f"ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪ್ರವಾಸ ಯೋಜನೆಯಲ್ಲಿ {len(days)} ದಿನಗಳು ಹಾಗೂ {', '.join(stop_names)} ಸ್ಥಳಗಳಿವೆ. "
                    f"ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ: ₹{budget_total}. ನೀವು ಯಾವುದೇ ಹೊಸ ಸ್ಥಳವನ್ನು ಸೇರಿಸಲು ಅಥವಾ ಬಜೆಟ್ ಸರಿಹೊಂದಿಸಲು ಕೇಳಬಹುದು."
                )
            else:
                reply = (
                    f"Your current itinerary spans {len(days)} days visiting: {', '.join(stop_names)}. "
                    f"The total estimated cost is ₹{budget_total:,.0f}. You can ask me to add new stops, explore regional cuisine, or optimize costs."
                )
        else:
            if kannada_query:
                reply = (
                    "ನಮಸ್ಕಾರ! ನಾನು ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI ಸಹಾಯಕ. ಹಂಪಿ, ಮೈಸೂರು, ಕೊಡಗು, ಗೋಕರ್ಣ ಸೇರಿದಂತೆ ಕರ್ನಾಟಕದ ಯಾವುದೇ ಪ್ರವಾಸಿ ತಾಣಗಳ ಇತಿಹಾಸ, "
                    "ಪ್ರವಾಸ ಯೋಜನೆ, ಮಾರ್ಗಗಳು ಮತ್ತು ಬಜೆಟ್ ಕುರಿತು ನನಗೆ ಕೇಳಬಹುದು."
                )
            else:
                reply = (
                    "Namaskara! I am your Karnataka Yatra AI assistant. Ask me about historical destinations like Hampi, Badami, or Belur, "
                    "coastal beaches in Gokarna & Udupi, coffee trails in Coorg, route feasibility, or budget optimization."
                )

    return {
        "reply": reply,
        "language": "kn" if kannada_query else "en",
        "sources": sources,
        "suggested_action": suggested_action,
        "provider": "Karnataka Cultural RAG Engine"
    }
