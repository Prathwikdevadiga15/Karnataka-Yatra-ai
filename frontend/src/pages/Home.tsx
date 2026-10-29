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
  ExternalLink,
  Utensils,
  Terminal,
  Database,
  Bus,
  Search,
  Eye
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

  const moodCategories = [
    {
      title: "Chasing Waterfalls",
      kn: "ಜಲಪಾತಗಳು",
      desc: "Jog Falls, Abbey, Shivanasamudra, Sathodi",
      to: "/explore?category=waterfalls",
      icon: Waves,
      gradient: "from-blue-600 to-cyan-500",
      bgImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Escaping to the Hills",
      kn: "ಗಿರಿಧಾಮಗಳು",
      desc: "Chikkamagaluru, Coorg, Kudremukh, Agumbe",
      to: "/explore?category=nature",
      icon: Mountain,
      gradient: "from-emerald-700 to-teal-600",
      bgImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Ancient Kingdoms",
      kn: "ಐತಿಹಾಸಿಕ ತಾಣಗಳು",
      desc: "Hampi, Badami, Belur, Pattadakal, Bijapur",
      to: "/explore?category=heritage",
      icon: Building,
      gradient: "from-amber-700 to-yellow-600",
      bgImage: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Taste Karnataka",
      kn: "ಆಹಾರ ಸಂಸ್ಕೃತಿ",
      desc: "Mysore Masala Dosa, Neer Dosa, Benne Dosa",
      to: "/food",
      icon: Utensils,
      gradient: "from-rose-600 to-orange-500",
      bgImage: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80"
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
      {/* 1. Cinematic Hackathon Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-forest text-ivory shadow-2xl min-h-[580px] flex items-center border border-gold/30">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=1600&q=80"
            alt="Mysuru Palace at dusk"
            className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/90 to-ocean/50" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 sm:px-12 py-16 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold border border-gold/40 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>National Hackathon 2026 Edition • Smart Tourism Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {language === "kn"
              ? "ಕರ್ನಾಟಕದ ಸೌಂದರ್ಯವನ್ನು ಅನ್ವೇಷಿಸಿ. ಸ್ಮಾರ್ಟ್ ಪ್ರವಾಸ ಮಾಡಿ."
              : "Your Next Great Journey Begins in Karnataka."}
          </h1>

          <p className="text-base sm:text-lg text-ivory/80 max-w-2xl leading-relaxed">
            {language === "kn"
              ? "ದೃಢೀಕೃತ ASI ಪುರಾತತ್ವ ದಾಖಲೆಗಳು, ನಿಖರ ಮಲೆನಾಡು ಘಾಟ್ ಸಂಚಾರ ಅಲ್ಗಾರಿದಮ್‌ಗಳು ಮತ್ತು ಕನ್ನಡ ಭಾಷಾ ಬೆಂಬಲದೊಂದಿಗೆ ಸ್ಮಾರ್ಟ್ ಪ್ರವಾಸ ಯೋಜನೆ."
              : "Discover extraordinary places, experience authentic local flavours, and plan feasible journeys with an intelligent travel companion engineered for Karnataka."}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            <Link
              to="/planner"
              className="px-6 py-3.5 bg-gold text-forest font-bold text-sm rounded-xl shadow-lg hover:bg-gold/90 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <span>{t("plan_my_journey")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/assistant"
              className="px-5 py-3.5 bg-black/30 hover:bg-black/50 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Mic className="w-4 h-4 text-gold" />
              <span>{language === "kn" ? "ಧ್ವನಿ ಸಹಾಯಕ" : "AI Travel Assistant"}</span>
            </Link>

            <Link
              to="/webstrapping"
              className="px-5 py-3.5 bg-forest/80 hover:bg-forest text-gold font-semibold text-sm rounded-xl border border-gold/40 backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4 text-gold" />
              <span>AI Webstrapping Studio</span>
            </Link>

            <Link
              to="/food"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Utensils className="w-4 h-4 text-gold" />
              <span>Taste Karnataka</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Hackathon Engineering Metric Banner */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-charcoal block leading-none">7 Regions</span>
            <span className="text-[11px] text-charcoal/60">Coast to Hoysala & Malnad</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
            <ShieldCheck className="w-5 h-5 text-forest" />
          </div>
          <div>
            <span className="text-xl font-bold text-charcoal block leading-none">50+ ASI Records</span>
            <span className="text-[11px] text-charcoal/60">Verified Heritage Grounding</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-charcoal block leading-none">1.35x Road Factor</span>
            <span className="text-[11px] text-charcoal/60">Realistic Ghat Driving Speeds</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-charcoal block leading-none">ಕನ್ನಡ + English</span>
            <span className="text-[11px] text-charcoal/60">Bilingual Voice & Text AI</span>
          </div>
        </div>
      </section>

      {/* 3. Quick Search / Trip Launcher Card */}
      <section className="relative z-20 max-w-5xl mx-auto px-4">
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
              <option value={2}>2 Days Weekend Getaway</option>
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

      {/* 4. Discover by Mood */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
              Tailored Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Discover Karnataka by Mood
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-forest hover:text-gold flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>View all 50+ Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {moodCategories.map((mood, idx) => {
            const Icon = mood.icon;
            return (
              <Link
                key={idx}
                to={mood.to}
                className="group relative rounded-2xl overflow-hidden p-5 shadow-xs hover:shadow-lg transition-all border border-stone-200 flex flex-col justify-between h-48"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={mood.bgImage}
                    alt={mood.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-lg bg-gold/20 text-gold flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{mood.title}</h3>
                  <span className="text-xs text-gold/90 font-medium block">{mood.kn}</span>
                </div>

                <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-300">
                  <span className="truncate pr-2">{mood.desc}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Destinations */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
              Iconic Karnataka
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Featured Heritage & Wonders
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-forest hover:text-gold flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow border border-stone-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-forest/90 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {dest.tag}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs text-gold/80 block">{dest.region}</span>
                    <h3 className="text-lg font-bold leading-tight">
                      {dest.name} <span className="text-xs font-normal opacity-80 font-kannada">({dest.kn})</span>
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-3">
                    {dest.desc}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/planner?origin=bengaluru&days=3&must_visit=${dest.id}`}
                  className="w-full py-2 bg-stone-50 hover:bg-forest hover:text-gold text-forest text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Build Route to {dest.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Spotlight Modules: AI Webstrapping Studio & Taste Karnataka */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Webstrapping Studio Card */}
        <div className="bg-gradient-to-br from-forest to-forest/90 rounded-2xl p-6 text-ivory border border-gold/40 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold px-2.5 py-1 rounded-full text-xs font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Dedicated Research Workspace</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">AI Webstrapping Studio</h3>
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
              Research destinations from permitted government portals, extract verified ASI facts, identify missing fields, associate image assets, and approve content before publishing to the live catalogue.
            </p>
          </div>
          <Link
            to="/webstrapping"
            className="inline-flex items-center space-x-2 bg-gold text-forest text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-gold/90 transition w-fit"
          >
            <span>Open Webstrapping Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Taste Karnataka Card */}
        <div className="bg-gradient-to-br from-amber-900 via-forest to-stone-900 rounded-2xl p-6 text-ivory border border-gold/40 shadow-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold px-2.5 py-1 rounded-full text-xs font-semibold">
              <Utensils className="w-3.5 h-3.5" />
              <span>Taste Karnataka Culinary Tour</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">Regional Food & Heritage Cuisine</h3>
            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
              Discover Mysore Masala Dosa, Coastal Neer Dosa, Davanagere Benne Dosa, and Dharwad Peda. Grounded in royal palace histories and local culinary culture.
            </p>
          </div>
          <Link
            to="/food"
            className="inline-flex items-center space-x-2 bg-gold text-forest text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-gold/90 transition w-fit"
          >
            <span>Explore Food Trails</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. Distinct Regions Grid */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
            Geographic Diversity
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Explore Karnataka's 7 Distinct Regions
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/70 max-w-2xl mt-1">
            From the golden Arabian sands to mist-shrouded Western Ghats and majestic Chalukyan rock caves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((reg, idx) => (
            <Link
              key={idx}
              to={`/explore?region=${reg.code}`}
              className={`p-5 rounded-2xl border transition-all hover:shadow-md hover:scale-[1.01] flex flex-col justify-between ${reg.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base">{reg.name}</h3>
                  <span className="text-xs font-medium opacity-80">{reg.kn}</span>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">{reg.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-semibold">
                <span>Explore Region</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
