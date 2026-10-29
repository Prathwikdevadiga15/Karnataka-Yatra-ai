import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  Compass,
  MapPin,
  Calendar,
  IndianRupee,
  Mic,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Mountain,
  Waves,
  Building,
  Coffee,
  CheckCircle,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Quick Search Form State
  const [origin, setOrigin] = useState("bengaluru");
  const [days, setDays] = useState(3);
  const [interest, setInterest] = useState("heritage");

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/planner?origin=${origin}&days=${days}&interest=${interest}`);
  };

  const featuredDestinations = [
    {
      id: "hampi",
      name: "Hampi",
      kn: "ಹಂಪಿ",
      region: "Kalyana Karnataka",
      desc: "UNESCO World Heritage boulder kingdom of Vijayanagara on the Tungabhadra River.",
      image: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80",
      tag: "UNESCO Heritage"
    },
    {
      id: "coorg",
      name: "Coorg (Madikeri)",
      kn: "ಕೊಡಗು",
      region: "Malnad",
      desc: "Misty Western Ghats coffee plantations, Abbey Falls, and rich Kodava martial culture.",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
      tag: "Coffee & Nature"
    },
    {
      id: "gokarna",
      name: "Gokarna",
      kn: "ಗೋಕರ್ಣ",
      region: "Coastal",
      desc: "Ancient Mahabaleshwara temple town meeting secluded Arabian Sea beaches and cliff trails.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
      tag: "Coastal Haven"
    },
    {
      id: "mysuru",
      name: "Mysuru",
      kn: "ಮೈಸೂರು",
      region: "Old Mysore",
      desc: "The royal cultural capital celebrated for the illuminated Amba Vilas Palace and Chamundi Hill.",
      image: "https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=600&q=80",
      tag: "Royal Heritage"
    }
  ];

  const regions = [
    {
      name: "Coastal Karnataka",
      kn: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
      code: "Coastal",
      desc: "Gokarna, Udupi, Mangaluru, Murudeshwar - pristine beaches, ancient temples, seafood, Yakshagana.",
      color: "bg-blue-50 border-blue-200 text-blue-900"
    },
    {
      name: "Malnad & Ghats",
      kn: "ಮಲೆನಾಡು",
      code: "Malnad",
      desc: "Coorg, Chikkamagaluru, Jog Falls, Dandeli - rainforests, mist peaks, coffee trails, river rafting.",
      color: "bg-emerald-50 border-emerald-200 text-emerald-900"
    },
    {
      name: "Old Mysore Region",
      kn: "ಹಳೆಯ ಮೈಸೂರು",
      code: "Old Mysore",
      desc: "Mysuru, Bandipur, Kabini, Chitradurga - royal palaces, tiger reserves, silk, sandalwood.",
      color: "bg-amber-50 border-amber-200 text-amber-900"
    },
    {
      name: "North Karnataka & Chalukya",
      kn: "ಉತ್ತರ ಕರ್ನಾಟಕ",
      code: "North Karnataka",
      desc: "Badami, Pattadakal, Vijayapura - 6th century sandstone cave temples, Gol Gumbaz.",
      color: "bg-orange-50 border-orange-200 text-orange-900"
    },
    {
      name: "Hoysala Heartland",
      kn: "ಹೊಯ್ಸಳ ನಾಡು",
      code: "Hoysala",
      desc: "Belur, Halebidu, Shravanabelagola - UNESCO soapstone filigree architecture.",
      color: "bg-stone-50 border-stone-200 text-stone-900"
    },
    {
      name: "Bengaluru Metropolis",
      kn: "ಬೆಂಗಳೂರು",
      code: "Bengaluru",
      desc: "Garden city, Lalbagh, Bengaluru Palace, iconic South Indian culinary heritage.",
      color: "bg-purple-50 border-purple-200 text-purple-900"
    }
  ];

  return (
    <div className="space-y-16 pb-16 animate-fadeIn">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-forest text-ivory shadow-xl min-h-[520px] flex items-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=1600&q=80"
            alt="Mysuru Palace at dusk"
            className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 sm:px-12 py-16 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold border border-gold/40 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>National Hackathon 2026 Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t("hero_title")}
          </h1>

          <p className="text-base sm:text-lg text-ivory/80 max-w-2xl leading-relaxed">
            {t("hero_subtitle")}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/planner"
              className="px-6 py-3.5 bg-gold text-forest font-bold text-sm rounded-xl shadow-lg hover:bg-gold/90 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <span>{t("plan_my_journey")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/assistant"
              className="px-6 py-3.5 bg-black/30 hover:bg-black/50 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Mic className="w-4 h-4 text-gold" />
              <span>{t("voice_assistant_btn")}</span>
            </Link>

            <Link
              to="/explore"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-all"
            >
              {t("explore_destinations")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Search / Trip Launcher Card */}
      <section className="-mt-10 relative z-20 max-w-5xl mx-auto px-4">
        <form
          onSubmit={handleQuickPlan}
          className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-forest" />
              <span>Starting Origin</span>
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none"
            >
              <option value="bengaluru">Bengaluru (ಬೆಂಗಳೂರು)</option>
              <option value="mysuru">Mysuru (ಮೈಸೂರು)</option>
              <option value="mangaluru">Mangaluru (ಮಂಗಳೂರು)</option>
              <option value="udupi">Udupi (ಉಡುಪಿ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-forest" />
              <span>Duration</span>
            </label>
            <select
              value={days}
              onChange={(e) => setDays(+e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none"
            >
              <option value={2}>2 Days Weekend Gateway</option>
              <option value={3}>3 Days Classic Trail</option>
              <option value={5}>5 Days Regional Discovery</option>
              <option value={7}>7 Days Grand Karnataka Yatra</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-forest" />
              <span>Primary Interest</span>
            </label>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none"
            >
              <option value="heritage">Heritage & History</option>
              <option value="nature">Nature & Hill Stations</option>
              <option value="beaches">Beaches & Coastal</option>
              <option value="temples">Sacred Temples</option>
              <option value="adventure">Wildlife & Adventure</option>
              <option value="food">Culinary & Food</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-forest text-ivory text-xs font-bold rounded-lg hover:bg-forest/90 transition flex items-center justify-center space-x-2 shadow-md"
          >
            <span>Plan Instant Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </button>
        </form>
      </section>

      {/* 3. Featured Destinations */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
              Iconic Karnataka
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">
              {t("featured_places")}
            </h2>
          </div>
          <Link
            to="/explore"
            className="mt-2 sm:mt-0 text-xs font-semibold text-forest hover:text-gold flex items-center space-x-1 transition"
          >
            <span>View All 20+ Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-forest/85 backdrop-blur-md text-ivory text-[10px] font-semibold px-2.5 py-1 rounded-full border border-forest/50">
                  {d.tag}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                  {d.region}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-charcoal group-hover:text-forest transition">
                    {language === "kn" ? d.kn : d.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
                <Link
                  to={`/explore?q=${d.id}`}
                  className="text-xs font-semibold text-forest hover:text-gold flex items-center space-x-1"
                >
                  <span>Explore Cultural Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Distinct Karnataka Regions */}
      <section className="space-y-6 bg-ivory/80 -mx-4 sm:-mx-8 px-4 sm:px-8 py-12 rounded-3xl border border-gold/15">
        <div className="max-w-3xl">
          <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
            Regional Heritage
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">
            {t("regional_title")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {t("regional_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((reg) => (
            <Link
              key={reg.code}
              to={`/explore?region=${encodeURIComponent(reg.code)}`}
              className={`p-5 rounded-2xl border ${reg.color} hover:shadow-md transition-all group`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">
                  {language === "kn" ? reg.kn : reg.name}
                </h3>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                {reg.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Product Pillars & Architectural Highlights */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
            Engineered For Excellence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest">
            {t("benefits_title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-forest" />
            </div>
            <h3 className="font-bold text-base text-charcoal">
              {t("benefit_1_title")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t("benefit_1_desc")}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-base text-charcoal">
              {t("benefit_2_title")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t("benefit_2_desc")}
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-base text-charcoal">
              {t("benefit_3_title")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t("benefit_3_desc")}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Ready to Travel CTA */}
      <section className="bg-gradient-to-r from-forest to-forest/90 text-ivory rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold">
          {language === "kn"
            ? "ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸವನ್ನು ಇಂದೇ ಯೋಜಿಸಿ"
            : "Ready to Experience Authentic Karnataka?"}
        </h2>
        <p className="text-xs sm:text-sm text-ivory/80 max-w-xl mx-auto leading-relaxed">
          {language === "kn"
            ? "ನಿಖರವಾದ ಬಜೆಟ್, ನೈಜ ಮಾರ್ಗ ಸಮಯ ಮತ್ತು ಅಧಿಕೃತ ಪರಂಪರೆಯ ವಿವರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಕಸ್ಟಮ್ ಪ್ರವಾಸ ಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಿ."
            : "Generate your custom, budget-checked, culturally verified itinerary in seconds with step-free accessibility support."}
        </p>
        <div className="pt-2">
          <Link
            to="/planner"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gold text-forest font-bold text-sm rounded-xl hover:bg-gold/90 transition shadow-lg"
          >
            <span>{t("plan_my_journey")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
