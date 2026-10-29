from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/food", tags=["Regional Food & Cuisine Intelligence"])

class FoodItem(BaseModel):
    id: str
    name: str
    kn_name: str
    region: str
    districts: List[str]
    category: str  # breakfast, main_course, sweet, snack
    dietary: str  # vegetarian, vegan, non_vegetarian
    description: str
    cultural_history: str
    key_ingredients: List[str]
    iconic_restaurants: List[str]
    image_url: str
    associated_destinations: List[str]

FOOD_CATALOG: List[FoodItem] = [
    FoodItem(
        id="mysore-masala-dosa",
        name="Mysore Masala Dosa",
        kn_name="ಮೈಸೂರು ಮಸಾಲೆ ದೋಸೆ",
        region="Old Mysore",
        districts=["Mysuru", "Bengaluru Urban", "Mandya"],
        category="breakfast",
        dietary="vegetarian",
        description="Crisp red-golden fermented crepe smeared with an aromatic fiery red garlic-chilli chutney, dollop of fresh white butter, and filled with spiced potato palya.",
        cultural_history="Originated in the royal kitchens of the Wadiyars in Mysuru and popularized by heritage tiffin rooms like Mylari (est. 1938) and Vidyarthi Bhavan (est. 1943).",
        key_ingredients=["Red rice", "Urad dal", "Red chillies & garlic chutney paste", "Potatoes", "Desi Ghee / Butter"],
        iconic_restaurants=["Original Vinayaka Mylari (Mysuru)", "CTR Shri Sagar (Malleswaram, Bengaluru)", "Vidyarthi Bhavan (Gandhi Bazaar, Bengaluru)"],
        image_url="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["mysore-palace", "chamundi-hill", "bangalore-palace"]
    ),
    FoodItem(
        id="neer-dosa",
        name="Neer Dosa & Fish Gassi",
        kn_name="ನೀರ್ ದೋಸೆ ಮತ್ತು ಮೀನು ಗಸ್ಸಿ",
        region="Coastal Karnataka",
        districts=["Dakshina Kannada", "Udupi", "Uttara Kannada"],
        category="main_course",
        dietary="non_vegetarian",
        description="Feather-light, lace-textured rice crepes made from an ultra-thin watery batter, served with spicy Byadagi-coconut coastal fish curry (Meen Gassi) or jaggery-coconut milk.",
        cultural_history="Traditional staple of the Tuluva Bunt and GSB communities along the Karavali Arabian coast, prepared without fermentation.",
        key_ingredients=["Soaked raw rice", "Grated coconut", "Sea fish (Kane/Anjal)", "Byadagi chillies", "Tamarind / Kudampuli"],
        iconic_restaurants=["Machali (Mangaluru)", "Giri Manja's (Mangaluru)", "Mitra Samaj (Udupi)"],
        image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["panambur-beach", "malpe-beach", "maravanthe-beach", "st-marys-island"]
    ),
    FoodItem(
        id="bisi-bele-bath",
        name="Bisi Bele Bath",
        kn_name="ಬಿಸಿ ಬೇಳೆ ಬಾತ್",
        region="Old Mysore",
        districts=["Mysuru", "Bengaluru Urban", "Hassan"],
        category="main_course",
        dietary="vegetarian",
        description="A hearty, hot one-pot comfort meal of rice, toor dal, seasonal vegetables, tamarind, and a royal aromatic 16-spice blend fried in pure ghee, topped with boondi.",
        cultural_history="Traced back over 300 years to the Mysore Royal Palace, where it was served during ceremonial feasts and Navarathri Dasara banquets.",
        key_ingredients=["Sona Masuri rice", "Toor dal", "Nutmeg & Kapok buds (Marathi Moggu)", "Copra", "Pure Ghee", "Khara Boondi"],
        iconic_restaurants=["MTR - Mavalli Tiffin Room (Lalbagh, Bengaluru)", "Maiyas (Jayanagar)", "Dasaprakash (Mysuru)"],
        image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["mysore-palace", "lalbagh-botanical-garden", "somnathpura"]
    ),
    FoodItem(
        id="dharwad-peda",
        name="Dharwad Peda",
        kn_name="ಧಾರವಾಡ ಪೇಡ",
        region="North Karnataka",
        districts=["Dharwad", "Hubballi", "Belagavi"],
        category="sweet",
        dietary="vegetarian",
        description="Caramelised, dark amber milk sweet rolled in fine powdered sugar, boasting a distinctive grainy fudge texture with GI (Geographical Indication) status.",
        cultural_history="Introduced in the early 19th century by Ram Ratan Singh Thakur, who migrated from Unnao during the plague and perfected the slow browning of Dharwari buffalo milk.",
        key_ingredients=["Dharwadi buffalo milk khoya", "Sugar", "Ghee", "Cardamom powder"],
        iconic_restaurants=["Babusingh Thakur Peda (Line Bazaar, Dharwad)", "Mishra Peda (Hubballi)"],
        image_url="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["badami-caves", "pattadakal", "hampi-virupaksha"]
    ),
    FoodItem(
        id="davanagere-benne-dosa",
        name="Davanagere Benne Dosa",
        kn_name="ದಾವಣಗೆರೆ ಬೆಣ್ಣೆ ದೋಸೆ",
        region="Central Karnataka",
        districts=["Davanagere", "Chitradurga", "Haveri"],
        category="breakfast",
        dietary="vegetarian",
        description="Crispy on the exterior yet spongy within, cooked on heavy iron griddles with wood fire and generously basted with fragrant country-churned fresh white butter (benne).",
        cultural_history="Crafted in 1928 by Chennamma in Davanagere using puffed rice (mandakki) in the batter, giving the dosa its signature golden honeycomb crumb.",
        key_ingredients=["Raw rice", "Puffed rice (Mandakki)", "White country butter (Benne)", "Spiced potato smash", "Spicy raw coconut chutney"],
        iconic_restaurants=["Sagar Benne Dosa (Davanagere)", "Guru Kottureshwara Benne Dosa (Davanagere)", "Ravi Benne Dosa (Davanagere)"],
        image_url="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["jog-falls", "chitradurga-fort"]
    ),
    FoodItem(
        id="jolada-rotti",
        name="Jolada Rotti with Yennegayi",
        kn_name="ಜೋಳದ ರೊಟ್ಟಿ ಮತ್ತು ಎಣ್ಣೆಗಾಯಿ",
        region="North Karnataka",
        districts=["Kalaburagi", "Vijayapura", "Bagalkote", "Bidar"],
        category="main_course",
        dietary="vegan",
        description="Unleavened gluten-free sorghum flatbread patted by hand and roasted on clay tawas, served alongside stuffed spiced baby brinjals (Yennegayi) and peanut chutney powder.",
        cultural_history="Ancient nutritional powerhouse of the Deccan Plateau, sustenance of the Rashtrakuta and Bahmani dynasties, packed with minerals and slow-burning energy.",
        key_ingredients=["Jowar flour (Sorghum)", "Baby brinjals", "Roasted peanuts", "Niger seeds (Gurellu)", "Byadagi chilli powder"],
        iconic_restaurants=["Nalapaka (Hubballi)", "Basaveshwara Khanavali (Bagalkote)", "Kamath Khanavali (Bengaluru)"],
        image_url="https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["gol-gumbaz", "bidar-fort", "aihole", "pattadakal"]
    ),
    FoodItem(
        id="coorg-pandi-curry",
        name="Kodava Pandi Curry & Akki Rotti",
        kn_name="ಕೊಡವ ಪಾಂಡಿ ಕರಿ ಮತ್ತು ಅಕ್ಕಿ ರೊಟ್ಟಿ",
        region="Malnad & Coorg",
        districts=["Kodagu", "Chikkamagaluru", "Hassan"],
        category="main_course",
        dietary="non_vegetarian",
        description="Pork braised in dark, aromatic roasted spices and finished with authentic sour Kachampuli (Garcinia gummi-gutta vinegar), paired with soft warm rice rotis.",
        cultural_history="Celebrated ceremonial culinary centrepiece of the martial Kodava community, traditionally served at harvest festivals (Kailpodh) and weddings.",
        key_ingredients=["Meat", "Kachampuli vinegar", "Roasted coriander & cumin dark masala", "Curry leaves", "Cooked rice dough"],
        iconic_restaurants=["Coorg Cuisine (Madikeri)", "Raintree (Madikeri)", "East End Hotel (Virajpet)"],
        image_url="https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["abbey-falls", "rajas-seat", "mullayanagiri"]
    ),
    FoodItem(
        id="ragi-mudde",
        name="Ragi Mudde with Bassaru",
        kn_name="ರಾಗಿ ಮುದ್ದೆ ಮತ್ತು ಬಸ್ಸಾರು",
        region="Old Mysore",
        districts=["Mandya", "Hassan", "Tumakuru", "Ramanagara"],
        category="main_course",
        dietary="vegetarian",
        description="Wholesome steamed finger millet balls swallowed without chewing, paired with nutrient-dense strained greens soup (Bassaru) and spiced lentil palya.",
        cultural_history="The revered rural backbone food of southern Karnataka agrarian families, praised for its low glycemic index and strength-building endurance.",
        key_ingredients=["Finger millet flour (Ragi)", "Dill leaves / Field greens", "Sprouted horse gram (Huruli)", "Garlic & cumin"],
        iconic_restaurants=["Mudde Madappa Mess (Bengaluru)", "Shivalli Restaurant (Bengaluru)", "Hotel Halli Mane (Malleswaram)"],
        image_url="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["shravanabelagola", "ramnagaram-rocks", "br-hills"]
    ),
    FoodItem(
        id="kori-rotti",
        name="Mangalore Kori Rotti",
        kn_name="ಕೋರಿ ರೊಟ್ಟಿ",
        region="Coastal Karnataka",
        districts=["Dakshina Kannada", "Udupi"],
        category="main_course",
        dietary="non_vegetarian",
        description="Sun-dried crisp, wafer-thin rice sheets drenched in boiling-hot spiced coconut chicken gassi, melting into a glorious textural contrast.",
        cultural_history="Bunt community heritage delicacy, served on banana leaves where crisp rotti sheets absorb the intense roasted coconut and Kundapura spice gravy.",
        key_ingredients=["Crisp rice sheets (Rotti)", "Country chicken", "Fresh coconut paste", "Guntur & Byadagi chillies", "Fennel and coriander seeds"],
        iconic_restaurants=["Hotel Narayana (Bunder, Mangaluru)", "Shetty Lunch Home (Kundapura)", "Kori Rotti (Indiranagar, Bengaluru)"],
        image_url="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["kudroli-temple", "kapu-beach", "murudeshwar-temple"]
    ),
    FoodItem(
        id="mangalore-buns",
        name="Mangalore Banana Buns",
        kn_name="ಮಂಗಳೂರು ಬನ್ಸ್",
        region="Coastal Karnataka",
        districts=["Dakshina Kannada", "Udupi"],
        category="breakfast",
        dietary="vegetarian",
        description="Sweet, fluffy golden-fried puris made from a fermented dough of ripe banana, yogurt, and cumin seeds, eaten with spicy coconut chutney.",
        cultural_history="Invented by coastal temple cooks to use surplus ripe Mysore bananas, today the quintessential 4 PM tea-time snack across Karavali.",
        key_ingredients=["Ripe bananas (Elakki/Pachanadan)", "Wheat flour", "Sour curds", "Cumin seeds", "Jaggery / Sugar"],
        iconic_restaurants=["Taj Mahal Cafe (Car Street, Mangaluru)", "Mitra Samaj (Car Street, Udupi)", "Janatha Deluxe (Mangaluru)"],
        image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        associated_destinations=["udupi-krishna-temple", "panambur-beach"]
    )
]

@router.get("")
def list_food(
    q: Optional[str] = None,
    region: Optional[str] = None,
    dietary: Optional[str] = None,
    category: Optional[str] = None
):
    results = FOOD_CATALOG
    if q:
        query = q.lower().strip()
        results = [
            f for f in results
            if query in f.name.lower()
            or query in f.kn_name
            or query in f.region.lower()
            or any(query in d.lower() for d in f.districts)
            or any(query in ing.lower() for ing in f.key_ingredients)
        ]
    if region:
        reg_clean = region.lower().strip()
        results = [f for f in results if reg_clean in f.region.lower()]
    if dietary:
        diet_clean = dietary.lower().strip()
        results = [f for f in results if f.dietary.lower() == diet_clean]
    if category:
        cat_clean = category.lower().strip()
        results = [f for f in results if f.category.lower() == cat_clean]
        
    return {"total": len(results), "items": results}

@router.get("/{food_id}")
def get_food_detail(food_id: str):
    for f in FOOD_CATALOG:
        if f.id == food_id:
            return f
    raise HTTPException(status_code=404, detail="Food item not found.")

@router.get("/meta/regions")
def get_food_regions():
    return [
        {"name": "Coastal Karnataka", "count": 4, "highlight": "Neer Dosa, Kane Fry, Kori Rotti, Mangalore Buns"},
        {"name": "Old Mysore", "count": 3, "highlight": "Mysore Masala Dosa, Bisi Bele Bath, Ragi Mudde"},
        {"name": "North Karnataka", "count": 2, "highlight": "Jolada Rotti, Yennegayi, Dharwad Peda"},
        {"name": "Malnad & Coorg", "count": 1, "highlight": "Pandi Curry, Akki Rotti, Kadambuttu"},
        {"name": "Central Karnataka", "count": 1, "highlight": "Davanagere Benne Dosa, Mandakki"}
    ]
