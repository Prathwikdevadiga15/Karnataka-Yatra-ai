import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from decimal import Decimal
from fastapi.testclient import TestClient
from app.main import app
from app.services.planning import engine

c = TestClient(app)
BODY = {
    "origin": "mangaluru",
    "duration_days": 3,
    "travellers": 2,
    "budget_inr": 40000,
    "interests": ["heritage"]
}

def test_health():
    res = c.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_search_pagination():
    r = c.get("/api/destinations?q=mysuru&size=5").json()
    assert r["total"] >= 1
    assert any(item["id"] == "mysuru" for item in r["items"])

def test_destination_detail_with_weather():
    r = c.get("/api/destinations/hampi")
    assert r.status_code == 200
    data = r.json()
    assert data["name"] == "Hampi"
    assert "weather" in data
    assert "temperature_c" in data["weather"]

def test_generate_ok():
    r = c.post("/api/itineraries/generate", json=BODY)
    assert r.status_code == 200
    plan = r.json()["plan"]
    assert len(plan["days"]) == 3
    assert "budget" in plan
    assert "target_budget" in plan["budget"]
    assert "remaining_budget" in plan["budget"]

def test_invalid_input():
    assert c.post("/api/itineraries/generate", json={**BODY, "travellers": 0}).status_code == 422

def test_unknown_origin():
    assert c.post("/api/itineraries/generate", json={**BODY, "origin": "paris"}).status_code == 422

def test_group_size_scales_budget():
    a = engine.generate("mangaluru", 2, 1, 99999, ["heritage"])["budget"]["stay_food_local"]
    b = engine.generate("mangaluru", 2, 4, 99999, ["heritage"])["budget"]["stay_food_local"]
    assert b == a * 4

def test_locked_stop_kept():
    p = engine.generate("mangaluru", 2, 2, 99999, ["beaches"], locked=["hampi"])
    assert any(d["stop"] == "hampi" and d["locked"] for d in p["days"])

def test_budget_warning():
    p = engine.generate("mangaluru", 5, 4, 1000, ["heritage"])
    assert any("exceeds budget" in w for w in p["warnings"])

def test_accessibility_filter():
    plan = engine.generate("mangaluru", 3, 2, 99999, ["heritage"], accessible=True)
    assert all(d["step_free"] is True for d in plan["days"])

def test_replace_stop():
    gen_res = c.post("/api/itineraries/generate", json=BODY).json()
    plan = gen_res["plan"]
    old_stop = plan["days"][0]["stop"]
    rep_res = c.post("/api/itineraries/replace-stop", json={
        "current_plan": plan,
        "old_stop_id": old_stop
    })
    assert rep_res.status_code == 200
    new_plan = rep_res.json()["plan"]
    assert len(new_plan["days"]) == 3

def test_assistant_chat_english_and_kannada():
    r_en = c.post("/api/assistant/chat", json={"message": "Tell me about Hampi ruins", "language": "en"})
    assert r_en.status_code == 200
    assert "Hampi" in r_en.json()["reply"]
    assert len(r_en.json()["sources"]) > 0

    r_kn = c.post("/api/assistant/chat", json={"message": "ಮೈಸೂರು ಅರಮನೆ ಮಾಹಿತಿ ನೀಡಿ", "language": "kn"})
    assert r_kn.status_code == 200
    assert r_kn.json()["language"] == "kn"

def test_feedback_flow():
    post_res = c.post("/api/feedback", json={
        "rating": 5,
        "comment": "Incredible regional accuracy for Karnataka!",
        "category": "heritage"
    })
    assert post_res.status_code == 200
    get_res = c.get("/api/feedback")
    assert get_res.status_code == 200
    assert len(get_res.json()) >= 1
