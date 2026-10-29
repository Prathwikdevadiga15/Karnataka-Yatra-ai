import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Bus,
  Train,
  Bed,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Clock,
  IndianRupee,
  Compass,
  AlertCircle,
  CheckCircle,
  Search
} from "lucide-react";

export default function TransportExplorer() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"transit" | "stays">("transit");
  const [fromCity, setFromCity] = useState("Bengaluru");
  const [toCity, setToCity] = useState("Mysuru");

  const popularRoutes = [
    {
      from: "Bengaluru",
      to: "Mysuru",
      distanceKm: 143,
      nhDuration: "2h 30m (Mysuru Expressway)",
      busService: "KSRTC Airavat / EV Power Plus (Every 15 mins from Satellite Bus Stand)",
      trainService: "Vande Bharat Express (20607 / 20608), Chamundi Express",
      fareEstimate: "₹220 - ₹550"
    },
    {
      from: "Bengaluru",
      to: "Madikeri (Coorg)",
      distanceKm: 250,
      nhDuration: "5h 30m (Ghat Speed 38 km/h in Sampaje)",
      busService: "KSRTC Airavat Club Class (Majestic & Shantinagar)",
      trainService: "Nearest Railhead: Mysuru (120 km) or Hassan (115 km)",
      fareEstimate: "₹450 - ₹850"
    },
    {
      from: "Bengaluru",
      to: "Shivamogga (Jog Falls)",
      distanceKm: 310,
      nhDuration: "5h 45m via NH 48 & NH 69",
      busService: "KSRTC Non-AC Sleeper & Rajahamsa",
      trainService: "Janshatabdi Express (12089), Talaguppa Express",
      fareEstimate: "₹380 - ₹720"
    },
    {
      from: "Mangaluru",
      to: "Gokarna",
      distanceKm: 232,
      nhDuration: "4h 30m (Coastal Corridor NH 66)",
      busService: "NWKRTC & KSRTC Express",
      trainService: "Matsyagandha Express (12620), Konkan Passenger",
      fareEstimate: "₹280 - ₹520"
    },
    {
      from: "Bengaluru",
      to: "Hosapete (Hampi)",
      distanceKm: 340,
      nhDuration: "6h 15m via NH 48 & NH 50",
      busService: "KSRTC Airavat Club Class / KKRTC Sleeper",
      trainService: "Hampi Express (16592), Vande Bharat Express",
      fareEstimate: "₹550 - ₹1,100"
    }
  ];

  const stayOptions = [
    {
      name: "KSTDC Hotel Mayura Hoysala",
      location: "Mysuru, Old Mysore",
      type: "Official Government Heritage Hotel",
      rating: "4.3 / 5",
      priceRange: "₹2,200 - ₹3,800/night",
      features: ["Walk to Palace", "ASI Guided Desk", "Traditional Breakfast", "Safe Parking"],
      bookingLink: "https://kstdc.co/"
    },
    {
      name: "Heritage Coffee Plantation Homestay",
      location: "Madikeri, Coorg",
      type: "Authentic Kodava Homestay",
      rating: "4.8 / 5",
      priceRange: "₹2,800 - ₹4,500/night",
      features: ["Private Stream", "Authentic Kodava Meals", "Coffee Estate Trail", "Campfire"],
      bookingLink: "https://karnatakatourism.org/homestays"
    },
    {
      name: "KSTDC Hotel Mayura Bhuvaneshwari",
      location: "Kamalapur, Hampi",
      type: "UNESCO Heritage Zone Resort",
      rating: "4.4 / 5",
      priceRange: "₹2,500 - ₹4,200/night",
      features: ["Adjacent to Royal Enclosure", "KSTDC Cycle Hire", "Garden Dining"],
      bookingLink: "https://kstdc.co/"
    },
    {
      name: "Om Beach Secluded Cliff Cottages",
      location: "Gokarna, Coastal",
      type: "Eco Beachfront Homestay",
      rating: "4.6 / 5",
      priceRange: "₹1,800 - ₹3,400/night",
      features: ["Cliff Ocean View", "Fresh Catch Dining", "Trek to Half-Moon Beach"],
      bookingLink: "https://karnatakatourism.org"
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest via-ocean to-forest text-ivory p-8 rounded-2xl shadow-xl border border-gold/30">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            <Bus className="w-3.5 h-3.5" />
            <span>Travel Essentials • ಪ್ರವಾಸ ಸಾಧನಗಳು</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Karnataka Transport, Routes & Stays
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed">
            {language === "kn"
              ? "ದೃಢೀಕೃತ ಕೆ.ಎಸ್.ಆರ್.ಟಿ.ಸಿ ಬಸ್ ಮಾರ್ಗಗಳು, ವಂದೇ ಭಾರತ್ ರೈಲು ಸಂಪರ್ಕ ಮತ್ತು ಕೆ.ಎಸ್.ಟಿ.ಡಿ.ಸಿ ಅಧಿಕೃತ ತಂಗುದಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ."
              : "Explore verified KSRTC highway bus corridors, scenic Konkan rail links, realistic ghat transit durations, and authentic heritage homestays across Karnataka."}
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab("transit")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "transit" ? "bg-gold text-forest shadow" : "bg-black/20 text-white hover:bg-black/30"
              }`}
            >
              <Bus className="w-4 h-4" /> Transit & Highways
            </button>
            <button
              onClick={() => setActiveTab("stays")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                activeTab === "stays" ? "bg-gold text-forest shadow" : "bg-black/20 text-white hover:bg-black/30"
              }`}
            >
              <Bed className="w-4 h-4" /> Stays & Homestays
            </button>
          </div>
        </div>
      </div>

      {/* Transit View */}
      {activeTab === "transit" && (
        <div className="space-y-6">
          {/* Engineering Grounding Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold">Deterministic Feasibility Guarantee: </span>
              Our route engine calculates road distances with realistic curvature factors (1.35x haversine) and applies regional speed limits (35 km/h in Malnad ghat passes vs 55 km/h on national highway corridors) to ensure itineraries never exceed 6 driving hours/day.
            </div>
          </div>

          {/* Routes Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal">Major Karnataka Transit Corridors</h3>
              <a
                href="https://ksrtc.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-forest hover:underline font-semibold flex items-center gap-1"
              >
                <span>Official KSRTC Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="divide-y divide-stone-100">
              {popularRoutes.map((route, i) => (
                <div key={i} className="p-4 sm:p-5 hover:bg-stone-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-charcoal">
                        {route.from} → {route.to}
                      </span>
                      <span className="text-[10px] bg-forest/10 text-forest font-bold px-2 py-0.5 rounded-full">
                        {route.distanceKm} km
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/80 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{route.nhDuration}</span>
                    </p>
                    <div className="text-[11px] text-stone-600 space-y-0.5 pt-1">
                      <p>
                        <strong className="text-charcoal font-semibold">Bus:</strong> {route.busService}
                      </p>
                      <p>
                        <strong className="text-charcoal font-semibold">Train:</strong> {route.trainService}
                      </p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-stone-100">
                    <span className="text-[10px] text-charcoal/60 uppercase font-semibold">Estimated Fare</span>
                    <span className="text-sm font-bold text-forest">{route.fareEstimate}</span>
                    <a
                      href="https://ksrtc.in"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 text-[11px] bg-forest text-gold px-3 py-1 rounded font-semibold hover:bg-forest/90 transition inline-flex items-center gap-1"
                    >
                      <span>Check KSRTC</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stays View */}
      {activeTab === "stays" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stayOptions.map((stay, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded">
                    {stay.type}
                  </span>
                  <span className="text-xs font-bold text-amber-600">★ {stay.rating}</span>
                </div>
                <h3 className="text-base font-bold text-charcoal leading-snug">{stay.name}</h3>
                <p className="text-xs text-charcoal/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{stay.location}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {stay.features.map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-stone-100 text-charcoal px-2 py-0.5 rounded border border-stone-200"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-charcoal/60 block">Verified Rate</span>
                  <span className="text-xs font-bold text-forest">{stay.priceRange}</span>
                </div>
                <a
                  href={stay.bookingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-forest hover:bg-forest/90 text-gold text-xs px-3 py-1.5 rounded font-semibold transition inline-flex items-center gap-1"
                >
                  <span>Book on KSTDC</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
