import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import {
  Utensils,
  MapPin,
  Sparkles,
  Heart,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight
} from "lucide-react";

interface Dish {
  id: string;
  name: string;
  kn: string;
  region: string;
  district: string;
  category: "Breakfast" | "Meals & Curries" | "Sweets & Snacks" | "Breads";
  desc: string;
  culturalNote: string;
  famousEateries: string[];
  image: string;
  veg: boolean;
  priceEstimate: string;
}

export default function FoodExplorer() {
  const { language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const dishes: Dish[] = [
    {
      id: "mysore-masala-dosa",
      name: "Mysore Masala Dosa",
      kn: "ಮೈಸೂರು ಮಸಾಲ ದೋಸೆ",
      region: "Old Mysore",
      district: "Mysuru",
      category: "Breakfast",
      desc: "Crispy red-rice fermented crepe smeared with signature fiery red garlic-chilli chutney and stuffed with spiced potato mash.",
      culturalNote: "Perfected in the royal kitchens of the Wadiyar dynasty during the early 20th century.",
      famousEateries: ["Mylari Hotel (Mysuru)", "CTR Shri Sagar (Bengaluru)", "Vidyarthi Bhavan"],
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
      veg: true,
      priceEstimate: "₹70 - ₹120"
    },
    {
      id: "neer-dosa",
      name: "Neer Dosa with Gassi",
      kn: "ನೀರು ದೋಸೆ ಮತ್ತು ಗಸಿ",
      region: "Coastal",
      district: "Udupi & Mangaluru",
      category: "Breakfast",
      desc: "Delicate, lace-thin gluten-free crepes made from unfermented rice batter, paired with coconut-rich chicken/veg gassi.",
      culturalNote: "An essential staple of Tuluva culture across Dakshina Kannada and Udupi households.",
      famousEateries: ["Machali (Mangaluru)", "Mitra Samaj (Udupi)", "Giri Manja's"],
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      veg: false,
      priceEstimate: "₹90 - ₹180"
    },
    {
      id: "bisi-bele-bath",
      name: "Bisi Bele Bath",
      kn: "ಬಿಸಿ ಬೇಳೆ ಬಾತ್",
      region: "Old Mysore",
      district: "Mysuru / Bengaluru",
      category: "Meals & Curries",
      desc: "Traditional slow-cooked harmony of rice, toor dal, assorted vegetables, and 18-spice roasted blend garnished with boondi.",
      culturalNote: "Originated in the palace kitchens of Mysore Palace over 300 years ago as a royal noon offering.",
      famousEateries: ["Maiyas (Jayanagar)", "MTR Lalbagh (Bengaluru)", "Hotel Dasaprakash"],
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
      veg: true,
      priceEstimate: "₹80 - ₹140"
    },
    {
      id: "ragi-mudde",
      name: "Ragi Mudde with Saaru",
      kn: "ರಾಗಿ ಮುದ್ದೆ ಮತ್ತು ಸಾರು",
      region: "Old Mysore / Mandya",
      district: "Mandya / Hassan",
      category: "Meals & Curries",
      desc: "Steamed finger-millet globes paired with Bassaru or spicy country chicken curry, swallowed whole with rich aroma.",
      culturalNote: "The nutritional fuel of Southern Karnataka farmers and agrarian workers for centuries.",
      famousEateries: ["Mudde Mane (Bengaluru)", "Hotel RRR (Mysuru)", "Shankara Mess (Mandya)"],
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
      veg: true,
      priceEstimate: "₹100 - ₹220"
    },
    {
      id: "davanagere-benne-dosa",
      name: "Davanagere Benne Dosa",
      kn: "ದಾವಣಗೆರೆ ಬೆಣ್ಣೆ ದೋಸೆ",
      region: "Central Karnataka",
      district: "Davanagere",
      category: "Breakfast",
      desc: "Spongy yet crispy golden dosa cooked on wood-fired cast-iron tavas generously lathered with fresh white churning butter.",
      culturalNote: "Crafted by Chennamma in 1928, now a registered geographic culinary specialty of Davanagere.",
      famousEateries: ["Ravi Benne Dosa (Davanagere)", "Shanthappa Dosa Camp", "Sri Guru Kottureshwara"],
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
      veg: true,
      priceEstimate: "₹60 - ₹110"
    },
    {
      id: "jolada-rotti",
      name: "Jolada Rotti with Yennegai",
      kn: "ಜೋಳದ ರೊಟ್ಟಿ ಮತ್ತು ಎಣ್ಣೆಗಾಯಿ",
      region: "North Karnataka",
      district: "Hubballi / Dharwad / Belagavi",
      category: "Breads",
      desc: "Hand-patted unleavened sorghum flatbread served with stuffed baby brinjal gravy, shenga (peanut) chutney, and curd.",
      culturalNote: "The wholesome cornerstone of North Karnataka's dry-zone culinary civilization.",
      famousEateries: ["Basaveshwara Khanavali (Hubballi)", "Kamat Khanavali (Dharwad)"],
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      veg: true,
      priceEstimate: "₹90 - ₹150"
    },
    {
      id: "dharwad-peda",
      name: "Dharwad Peda",
      kn: "ಧಾರವಾಡ ಪೇಡ",
      region: "North Karnataka",
      district: "Dharwad",
      category: "Sweets & Snacks",
      desc: "Caramelized buffalo milk sweet infused with aromatic cardamom and dusted with fine powdered caster sugar.",
      culturalNote: "Originated by the Thakur family in the 19th century; holds an official Geographical Indication (GI) tag.",
      famousEateries: ["Babusingh Thakur Peda (Line Bazaar, Dharwad)", "Mishra Peda"],
      image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
      veg: true,
      priceEstimate: "₹180 - ₹350"
    },
    {
      id: "mysore-pak",
      name: "Royal Mysore Pak",
      kn: "ಮೈಸೂರು ಪಾಕ್",
      region: "Old Mysore",
      district: "Mysuru",
      category: "Sweets & Snacks",
      desc: "Melt-in-mouth confection made of roasted gram flour, generous pure ghee, and clarified sugar syrup.",
      culturalNote: "Invented by royal chef Kakasura Madappa in 1935 at the Ambavilas Palace for Krishnaraja Wadiyar IV.",
      famousEateries: ["Guru Sweet Mart (Devaraja Market, Mysuru)", "Mahalakshmi Sweets"],
      image: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
      veg: true,
      priceEstimate: "₹150 - ₹300"
    },
    {
      id: "pandi-curry",
      name: "Coorg Pandi Curry & Kadambuttu",
      kn: "ಕೊಡಗು ಪಾಂಡಿ ಕರಿ ಮತ್ತು ಕದಂಬುಟ್ಟು",
      region: "Malnad",
      district: "Kodagu",
      category: "Meals & Curries",
      desc: "Slow-braised spiced meat simmered in tart Kachampuli (dark Garcinia gummi-gutta vinegar) paired with steamed rice balls.",
      culturalNote: "The ceremonial centerpiece of Kodava harvest festivals (Kailpodh & Puthari).",
      famousEateries: ["Raintree Restaurant (Madikeri)", "Coorg Cuisine", "Taste of Coorg"],
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      veg: false,
      priceEstimate: "₹220 - ₹380"
    }
  ];

  const regions = ["All", "Old Mysore", "Coastal", "Malnad", "North Karnataka", "Central Karnataka"];

  const filteredDishes = dishes.filter((dish) => {
    const matchesRegion = selectedRegion === "All" || dish.region === selectedRegion;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.kn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-forest via-forest/90 to-amber-900/90 text-ivory p-8 rounded-2xl shadow-xl border border-gold/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            <span>Taste Karnataka • ಅಧಿಕೃತ ಸುವಾಸನೆಗಳು</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Karnataka Food & Culinary Explorer
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed">
            {language === "kn"
              ? "ಮೈಸೂರು ಮಸಾಲ ದೋಸೆಯಿಂದ ಕರಾವಳಿಯ ನೀರು ದೋಸೆ, ಮಲೆನಾಡಿನ ಅಕ್ಕಿ ರೊಟ್ಟಿ ಮತ್ತು ಉತ್ತರ ಕರ್ನಾಟಕದ ಜೋಳದ ರೊಟ್ಟಿಯವರೆಗೆ ಅಧಿಕೃತ ಪಾಕಪದ್ಧತಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ."
              : "From the wood-fired benne dosas of Davanagere to the coastal neer dosas and royal Mysore Pak — discover authentic regional delicacies grounded in centuries of heritage."}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        {/* Region Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedRegion === reg
                  ? "bg-forest text-gold shadow-xs"
                  : "bg-stone-100 text-charcoal/80 hover:bg-stone-200"
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search dishes or districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-xs focus:ring-2 focus:ring-forest focus:outline-none"
          />
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image & Tags */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-forest/90 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {dish.region}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      dish.veg ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                    }`}
                  >
                    {dish.veg ? "Veg" : "Non-Veg"}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                  <h3 className="text-base font-bold leading-tight">{dish.name}</h3>
                  <p className="text-xs text-gold/90 font-medium">{dish.kn}</p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-charcoal/80 leading-relaxed">{dish.desc}</p>

                {/* Cultural Heritage Note */}
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[11px] text-amber-900">
                  <span className="font-bold block text-[10px] text-amber-800 uppercase tracking-wide mb-0.5">
                    Culinary Heritage
                  </span>
                  {dish.culturalNote}
                </div>

                {/* Famous Eateries */}
                <div>
                  <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-wider block mb-1">
                    Authentic Places to Taste:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {dish.famousEateries.map((eatery, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-stone-100 text-charcoal px-2 py-0.5 rounded border border-stone-200 font-medium"
                      >
                        {eatery}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-charcoal/60 block">Price Range</span>
                <span className="text-xs font-bold text-forest">{dish.priceEstimate}</span>
              </div>
              <Link
                to={`/planner?interest=food&origin=bengaluru&days=2`}
                className="inline-flex items-center gap-1 bg-forest hover:bg-forest/90 text-gold text-xs px-3 py-1.5 rounded-md font-semibold transition"
              >
                <span>Plan Food Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
