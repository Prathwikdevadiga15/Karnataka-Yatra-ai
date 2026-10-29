import json
import logging
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parents[2]
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from decimal import Decimal
from app.db.session import engine, SessionLocal, Base
from app.models.entities import Destination, DestinationTranslation, DestinationSource


logger = logging.getLogger(__name__)

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "destinations.example.json"


def init_db():
    Base.metadata.create_all(bind=engine)
    seed_destinations()

def seed_destinations():
    if not DATA_PATH.exists():
        logger.warning(f"Data file not found at {DATA_PATH}")
        return

    db = SessionLocal()
    try:
        count = db.query(Destination).count()
        if count > 0:
            logger.info(f"Database already seeded with {count} destinations.")
            return

        items = json.loads(DATA_PATH.read_text(encoding="utf-8"))
        for item in items:
            dest = Destination(
                id=item["id"],
                name=item["name"],
                slug=item["id"],
                region=item.get("region", "Karnataka"),
                district=item.get("district", ""),
                latitude=float(item["lat"]),
                longitude=float(item["lon"]),
                categories=json.dumps(item.get("categories", [])),
                description=item.get("description", ""),
                estimated_visit_duration=item.get("visit_minutes", 300),
                step_free=item.get("step_free", False),
                daily_cost_pp=Decimal(str(item.get("daily_cost_pp", 1500))),
                entry_fee_inr=Decimal(str(item.get("entry_fee_inr", 0))),
                best_season=item.get("best_season", "October to March"),
                opening_hours=item.get("opening_hours", "09:00 - 18:00"),
                cultural_notes=item.get("cultural_notes", ""),
                image_url=item.get("image_url", ""),
                verification_status=item.get("verification_status", "verified")
            )
            db.add(dest)

            # Kannada translation
            if "kn" in item or "description_kn" in item:
                trans = DestinationTranslation(
                    destination_id=item["id"],
                    language_code="kn",
                    translated_name=item.get("kn", item["name"]),
                    translated_description=item.get("description_kn", item.get("description", ""))
                )
                db.add(trans)

            # Source attribution
            if "source_url" in item:
                source = DestinationSource(
                    destination_id=item["id"],
                    source_url=item["source_url"],
                    source_title=item.get("source_title", "Official Karnataka Tourism"),
                    source_type="official_tourism",
                    verification_status=item.get("verification_status", "verified")
                )
                db.add(source)

        db.commit()
        logger.info(f"Successfully seeded {len(items)} destinations with translations and verified sources.")
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding destinations: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database initialization and seed complete.")
