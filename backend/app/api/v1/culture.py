from fastapi import APIRouter, Query
from typing import List, Optional, Dict, Any

router = APIRouter(prefix="/culture", tags=["Culture, Traditions & Places of Karnataka"])

CULTURAL_TRADITIONS_DATA = [
    {
        "id": "yakshagana",
        "title": "Yakshagana Dance-Drama",
        "kn": "ಯಕ್ಷಗಾನ ಮತ್ತು ರಂಗ ಕಲೆ",
        "category": "Living Performing Art",
        "region": "Coastal & Malnad",
        "badge": "Intangible Heritage",
        "desc": "Ancient coastal theatrical art form combining elaborate headgear (Mudi), vivid facial makeup, heroic dance steps, and thunderous Chande drum rhythms depicting epic lore.",
        "image": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
        "key_elements": ["Tenku Tittu", "Badagu Tittu", "Chande drums", "Epics of Mahabharata & Ramayana"],
        "recommended_locations": ["Udupi", "Mangaluru", "Honnavar", "Kundapura"]
    },
    {
        "id": "mysuru-dasara",
        "title": "Mysuru Royal Dasara & Jumboo Savari",
        "kn": "ನಾಡಹಬ್ಬ ಮೈಸೂರು ದಸರಾ ಮತ್ತು ಜಂಬೂ ಸವಾರಿ",
        "category": "Royal State Festival",
        "region": "Old Mysore",
        "badge": "Wadiyar Legacy",
        "desc": "400-year-old Naada Habba tradition instituted by Raja Wadiyar in 1610 CE, featuring the 750 kg Golden Howdah Jumboo Savari, Chamundeshwari procession, and 100,000 illuminated palace bulbs.",
        "image": "https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
        "key_elements": ["Golden Howdah (Chinnada Ambari)", "Durbar Hall", "Kushti (wrestling)", "Torchlight Parade at Bannimantap"],
        "recommended_locations": ["Mysuru Palace", "Chamundi Hills", "Lalitha Mahal"]
    },
    {
        "id": "kambala",
        "title": "Kambala Buffalo Sprint",
        "kn": "ಕರಾವಳಿಯ ವೀರ ಕ್ರೀಡೆ ಕಂಬಳ",
        "category": "Agrarian Heritage Sport",
        "region": "Coastal Karnataka",
        "badge": "Folk Tradition",
        "desc": "Thrilling twin-track slush racing of sturdy buffalo pairs across Dakshina Kannada and Udupi paddy fields celebrating seasonal harvest fertility and ancestral spirits.",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
        "key_elements": ["Kare (slush track)", "Panambur & Moodabidri circuits", "Tuluva heritage", "Speed timing lasers"],
        "recommended_locations": ["Moodabidri", "Puttur", "Bantwal", "Udupi"]
    },
    {
        "id": "hoysala-architecture",
        "title": "Hoysala Star-Shaped Temples",
        "kn": "ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ ಮತ್ತು ವಿಶ್ವ ಪರಂಪರೆ",
        "category": "UNESCO World Heritage",
        "region": "Hoysala Heartland",
        "badge": "UNESCO 2023",
        "desc": "12th-century chloritic schist (soapstone) filigree temples of Belur, Halebidu, and Somanathapura carved with mind-boggling precision by master sculptors Ruvari Jakanachari and Dankanachari.",
        "image": "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
        "key_elements": ["Stellate (star) ground plan", "Madanika dancers", "Friezes of elephants and swans", "Intricate lathe-turned pillars"],
        "recommended_locations": ["Chennakeshava Temple (Belur)", "Hoysaleshwara Temple (Halebidu)", "Keshava Temple (Somanathapura)"]
    },
    {
        "id": "dollu-kunitha",
        "title": "Dollu Kunitha & Folk Rhythms",
        "kn": "ಡೊಳ್ಳು ಕುಣಿತ ಮತ್ತು ಜಾನಪದ ಕಲೆ",
        "category": "Folk Percussion & Dance",
        "region": "Karnataka Plains",
        "badge": "Kuruba Tradition",
        "desc": "Dynamic, high-energy folk drum dance dedicated to deity Beereshwara, characterized by acrobatic movements, synchronised percussive strikes, and vocal choral chants.",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
        "key_elements": ["Heavy wooden drums", "Acrobatic formations", "Devotional worship of Shiva/Beereshwara"],
        "recommended_locations": ["Shivamogga", "Chitradurga", "Tumakuru"]
    },
    {
        "id": "devara-kaadu",
        "title": "Sacred Groves (Devara Kaadu)",
        "kn": "ದೇವರ ಕಾಡು ಮತ್ತು ನಿಸರ್ಗ ಆರಾಧನೆ",
        "category": "Ecological Tradition",
        "region": "Western Ghats & Coorg",
        "badge": "Sacred Ecology",
        "desc": "Pristine virgin forest patches across the Western Ghats protected through spiritual taboos, safeguarding rare medicinal herbs, fresh springs, and endemic wildlife.",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
        "key_elements": ["Nagabanas", "Kodava Jamma traditions", "Endemic tree canopies", "Ancient biodiversity reservoirs"],
        "recommended_locations": ["Kodagu (Coorg)", "Chikkamagaluru", "Uttara Kannada"]
    }
]

HERO_VIDEOS_DATA = [
    {
        "id": "jog-falls",
        "title": "Cascades of Jog Falls & Western Ghats",
        "kn": "ಜೋಗ ಜಲಪಾತ ಮತ್ತು ಮಲೆನಾಡಿನ ವೈಭವ",
        "subtitle": "Thunderous 830-foot drops of Raja, Rani, Roarer & Rocket in the Sahyadris.",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
        "poster": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
        "category": "Natural Cascades",
        "duration": "0:30 (Loop)"
    },
    {
        "id": "mysuru-dasara",
        "title": "Royal Mysuru Dasara & Illumination",
        "kn": "ಮೈಸೂರು ಅರಮನೆ ಮತ್ತು ದಸರಾ ವೈಭವ",
        "subtitle": "100,000 bulbs illuminating Amba Vilas Palace and 400 years of royal heritage.",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
        "poster": "https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=1600&q=80",
        "category": "Royal Grandeur",
        "duration": "0:35 (Loop)"
    },
    {
        "id": "hampi-unesco",
        "title": "UNESCO Boulders of Hampi & Vijayanagara",
        "kn": "ಹಂಪಿಯ ಶಿಲ್ಪಕಲೆ ಮತ್ತು ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ",
        "subtitle": "Stone Chariot, Virupaksha, and granite monoliths of the 14th century empire.",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
        "poster": "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1600&q=80",
        "category": "Ancient Architecture",
        "duration": "0:40 (Loop)"
    },
    {
        "id": "yakshagana-culture",
        "title": "Coastal Yakshagana & Folk Arts",
        "kn": "ಕರಾವಳಿಯ ಯಕ್ಷಗಾನ ಮತ್ತು ಜಾನಪದ ಸಂಸ್ಕೃತಿ",
        "subtitle": "Epic dance drama, colorful Mudi headgear, and sacred Arabian Sea shores.",
        "video_url": "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
        "poster": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
        "category": "Living Performing Arts",
        "duration": "0:30 (Loop)"
    }
]

HERO_HERITAGE_PLACES = [
    {
        "id": "jog-falls",
        "name": "Jog Falls",
        "kn": "ಜೋಗ ಜಲಪಾತ",
        "district": "Shivamogga",
        "region": "Malnad",
        "significance": "Second highest plunge waterfall in India, powered by Sharavathi River plunging 253 meters.",
        "image": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "hampi",
        "name": "Hampi (Vijayanagara)",
        "kn": "ಹಂಪಿ",
        "district": "Vijayanagara",
        "region": "Central Plains",
        "significance": "UNESCO World Heritage site with boulder-strewn terrain and ruins of the Vijayanagara Empire.",
        "image": "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "mysuru-palace",
        "name": "Mysuru Palace (Amba Vilas)",
        "kn": "ಮೈಸೂರು ಅರಮನೆ",
        "district": "Mysuru",
        "region": "Old Mysore",
        "significance": "Indo-Saracenic royal seat of the Wadiyar dynasty, epicenter of royal Dasara festivities.",
        "image": "https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "badami-pattadakal",
        "name": "Badami, Aihole & Pattadakal",
        "kn": "ಬಾದಾಮಿ ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು",
        "district": "Bagalkote",
        "region": "North Karnataka",
        "significance": "Cradle of Indian temple architecture: 6th-century rock-cut cave temples and UNESCO monuments.",
        "image": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "belur-halebidu",
        "name": "Belur & Halebidu",
        "kn": "ಬೇಲೂರು ಮತ್ತು ಹಳೇಬೀಡು",
        "district": "Hassan",
        "region": "Hoysala Heartland",
        "significance": "Sacred Ensembles of the Hoysalas inscribed as UNESCO World Heritage in 2023.",
        "image": "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "gokarna",
        "name": "Gokarna & Om Beach",
        "kn": "ಗೋಕರ್ಣ",
        "district": "Uttara Kannada",
        "region": "Coastal Karnataka",
        "significance": "Atmospheric pilgrimage town with Atmalinga of Lord Shiva meeting Arabian Sea cliffs.",
        "image": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
    }
]

@router.get("/traditions")
def get_cultural_traditions(category: Optional[str] = None):
    """Retrieve detailed cultural traditions and heritage practices of Karnataka."""
    if category:
        return [t for t in CULTURAL_TRADITIONS_DATA if category.lower() in t["category"].lower()]
    return {"total": len(CULTURAL_TRADITIONS_DATA), "traditions": CULTURAL_TRADITIONS_DATA}

@router.get("/videos")
def get_hero_videos():
    """Retrieve curated hero video streams and background loops for Karnataka culture & places."""
    return {"total": len(HERO_VIDEOS_DATA), "videos": HERO_VIDEOS_DATA}

@router.get("/places")
def get_heritage_places():
    """Retrieve iconic heritage and sacred natural places of Karnataka."""
    return {"total": len(HERO_HERITAGE_PLACES), "places": HERO_HERITAGE_PLACES}

@router.get("/highlight")
def get_culture_highlight():
    """Aggregated hero culture payload for fast frontend bootstrapping."""
    return {
        "hero_heading": "Discover Karnataka's Living Culture, Heritage & Wild Wonders.",
        "hero_subheading": "From the thunderous cascades of Jog Falls to the royal grandeur of Mysuru Dasara and the UNESCO boulders of Hampi — experience a deterministic, culturally authentic AI companion engineered for Karnataka.",
        "active_video": HERO_VIDEOS_DATA[0],
        "all_videos": HERO_VIDEOS_DATA,
        "featured_traditions": CULTURAL_TRADITIONS_DATA[:3],
        "key_places": HERO_HERITAGE_PLACES
    }
