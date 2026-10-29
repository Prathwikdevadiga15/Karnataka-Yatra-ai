import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_culture_traditions_endpoint():
    res = client.get("/api/v1/culture/traditions")
    assert res.status_code == 200
    data = res.json()
    assert "traditions" in data
    assert data["total"] >= 5
    ids = [t["id"] for t in data["traditions"]]
    assert "yakshagana" in ids
    assert "mysuru-dasara" in ids

def test_culture_videos_endpoint():
    res = client.get("/api/v1/culture/videos")
    assert res.status_code == 200
    data = res.json()
    assert "videos" in data
    assert len(data["videos"]) >= 3

def test_culture_places_endpoint():
    res = client.get("/api/v1/culture/places")
    assert res.status_code == 200
    data = res.json()
    assert "places" in data
    assert any(p["id"] == "jog-falls" for p in data["places"])
    assert any(p["id"] == "hampi" for p in data["places"])

def test_culture_highlight_endpoint():
    res = client.get("/api/v1/culture/highlight")
    assert res.status_code == 200
    data = res.json()
    assert "hero_heading" in data
    assert "Jog Falls" in data["hero_subheading"]
    assert "active_video" in data
