import React, { useState, useRef, useEffect } from "react";
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
  Eye,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Crown,
  Flame,
  Award,
  BookOpen,
  Film,
  Camera,
  Layers,
  Heart
} from "lucide-react";
import { getHeroVideos, getCulturalTraditions } from "../services/api";

interface HeroVideoChannel {
  id: string;
  title: string;
  kn: string;
  subtitle: string;
  video_url: string;
  poster: string;
  category: string;
  badge: string;
}

export default function Home() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalChapterIndex, setModalChapterIndex] = useState(0);

  // Filter state for culture traditions
  const [cultureFilter, setCultureFilter] = useState("all");

  // Quick Search Form State
  const [origin, setOrigin] = useState("bengaluru");
  const [days, setDays] = useState(3);
  const [interest, setInterest] = useState("heritage");

  const heroVideos: HeroVideoChannel[] = [
    {
      id: "jog-falls",
      title: "Cascades of Jog Falls & Western Ghats",
      kn: "ಜೋಗ ಜಲಪಾತ ಮತ್ತು ಮಲೆನಾಡಿನ ವೈಭವ",
      subtitle: "Thunderous 830-foot drops of Raja, Rani, Roarer & Rocket cascading through the misty Sahyadris.",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
      poster: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80",
      category: "Natural Wonder",
      badge: "🌊 Jog Falls Cascades"
    },
    {
      id: "mysuru-dasara",
      title: "Royal Mysuru Dasara & Illumination",
      kn: "ಮೈಸೂರು ಅರಮನೆ ಮತ್ತು ದಸರಾ ವೈಭವ",
      subtitle: "100,000 bulbs illuminating Amba Vilas Palace and 400 years of royal Wadiyar heritage.",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
      poster: "https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=1600&q=80",
      category: "Royal Heritage",
      badge: "👑 Mysuru Dasara"
    },
    {
      id: "hampi-unesco",
      title: "UNESCO Boulders of Hampi & Vijayanagara",
      kn: "ಹಂಪಿಯ ಶಿಲ್ಪಕಲೆ ಮತ್ತು ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ",
      subtitle: "Stone Chariot, Virupaksha, and granite monoliths of the legendary 14th century empire.",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4",
      poster: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1600&q=80",
      category: "UNESCO Monument",
      badge: "🏛️ Hampi Boulders"
    },
    {
      id: "yakshagana-culture",
      title: "Coastal Yakshagana & Folk Lore",
      kn: "ಕರಾವಳಿಯ ಯಕ್ಷಗಾನ ಮತ್ತು ಜಾನಪದ ಸಂಸ್ಕೃತಿ",
      subtitle: "Epic dance drama, colorful Mudi headgear, and sacred Arabian Sea shores.",
      video_url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
      poster: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
      category: "Folk Performing Arts",
      badge: "🎭 Coastal Yakshagana"
    }
  ];

  const [activeChannel, setActiveChannel] = useState<HeroVideoChannel>(heroVideos[0]);

  const selectChannel = (channel: HeroVideoChannel) => {
    setActiveChannel(channel);
    if (videoRef.current) {
      videoRef.current.src = channel.video_url;
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/planner?origin=${origin}&days=${days}&interest=${interest}`);
  };

  const culturalTraditions = [
    {
      id: "yakshagana",
      title: "Yakshagana Dance-Drama",
      kn: "ಯಕ್ಷಗಾನ ಮತ್ತು ರಂಗ ಕಲೆ",
      category: "performing",
      categoryLabel: "Living Performing Art",
      desc: "Ancient coastal theatrical art form combining elaborate headgear (Mudi), vivid facial makeup, heroic dance steps, and thunderous Chande drum rhythms depicting epic lore.",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
      region: "Coastal & Malnad",
      badge: "Intangible Heritage",
      places: "Udupi, Mangaluru, Honnavar"
    },
    {
      id: "mysuru-dasara",
      title: "Mysuru Royal Dasara & Jumboo Savari",
      kn: "ನಾಡಹಬ್ಬ ಮೈಸೂರು ದಸರಾ",
      category: "royalty",
      categoryLabel: "Royal State Festival",
      desc: "400-year-old Naada Habba tradition instituted by Raja Wadiyar in 1610 CE, featuring the 750 kg Golden Howdah Jumboo Savari, Chamundeshwari procession, and 100,000 illuminated palace bulbs.",
      image: "https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=600&q=80",
      region: "Old Mysore",
      badge: "Wadiyar Legacy",
      places: "Mysuru Palace, Chamundi Hills"
    },
    {
      id: "kambala",
      title: "Kambala Buffalo Sprint",
      kn: "ಕರಾವಳಿಯ ವೀರ ಕ್ರೀಡೆ ಕಂಬಳ",
      category: "performing",
      categoryLabel: "Agrarian Heritage Sport",
      desc: "Thrilling twin-track slush racing of sturdy buffalo pairs across Dakshina Kannada and Udupi paddy fields celebrating seasonal harvest fertility and ancestral spirits.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
      region: "Coastal Karnataka",
      badge: "Folk Tradition",
      places: "Moodabidri, Puttur, Bantwal"
    },
    {
      id: "hoysala-architecture",
      title: "Hoysala Star-Shaped Temples",
      kn: "ಹೊಯ್ಸಳ ಶಿಲ್ಪಕಲೆ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪ",
      category: "unesco",
      categoryLabel: "UNESCO World Heritage 2023",
      desc: "12th-century chloritic schist (soapstone) filigree temples of Belur, Halebidu, and Somanathapura carved with mind-boggling precision by master sculptors Ruvari Jakanachari.",
      image: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80",
      region: "Hoysala Heartland",
      badge: "UNESCO Monument",
      places: "Belur, Halebidu, Somanathapura"
    },
    {
      id: "devara-kaadu",
      title: "Sacred Groves (Devara Kaadu)",
      kn: "ದೇವರ ಕಾಡು ಮತ್ತು ನಿಸರ್ಗ ಆರಾಧನೆ",
      category: "nature",
      categoryLabel: "Ecological Tradition",
      desc: "Pristine virgin forest patches across the Western Ghats protected through spiritual taboos, safeguarding rare medicinal herbs, fresh springs, and endemic wildlife.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      region: "Western Ghats & Coorg",
      badge: "Sacred Ecology",
      places: "Kodagu, Chikkamagaluru, Sirsi"
    },
    {
      id: "dollu-kunitha",
      title: "Dollu Kunitha Folk Drum Dance",
      kn: "ಡೊಳ್ಳು ಕುಣಿತ ಮತ್ತು ಜಾನಪದ ಕಲೆ",
      category: "performing",
      categoryLabel: "Kuruba Folk Rhythm",
      desc: "High-energy rhythmic drum dance dedicated to deity Beereshwara, characterized by fast acrobatics, resonant drum strokes, and vocal chants echoing across Karnataka's heartland.",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
      region: "Karnataka Plains",
      badge: "Folk Drum Lore",
      places: "Shivamogga, Chitradurga, Tumakuru"
    }
  ];

  const filteredTraditions =
    cultureFilter === "all"
      ? culturalTraditions
      : culturalTraditions.filter((t) => t.category === cultureFilter);

  const iconicPlaces = [
    {
      id: "jog-falls",
      name: "Jog Falls (Gerosoppa)",
      kn: "ಜೋಗ ಜಲಪಾತ",
      district: "Shivamogga",
      region: "Malnad",
      tag: "Cascades & Rainforests",
      desc: "India's renowned un-tiered plunge waterfall where the Sharavathi river drops 830 feet in 4 distinct streams: Raja, Rani, Roarer, and Rocket.",
      image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "mysuru-palace",
      name: "Mysuru Palace (Amba Vilas)",
      kn: "ಮೈಸೂರು ಅರಮನೆ",
      district: "Mysuru",
      region: "Old Mysore",
      tag: "Royal Grandeur",
      desc: "Architectural masterpiece of the Wadiyars, world-famous for its kaleidoscopic stained glass, golden throne, and Dasara illumination.",
      image: "https://images.unsplash.com/photo-1600100397608-f010e421c4b7?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "hampi",
      name: "Hampi UNESCO Monuments",
      kn: "ಹಂಪಿ",
      district: "Vijayanagara",
      region: "Central Plains",
      tag: "UNESCO Boulders",
      desc: "14th-century capital of the Vijayanagara Empire with stone chariot, Vittala musical pillars, and atmospheric Tungabhadra riverbanks.",
      image: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "belur-halebidu",
      name: "Belur & Halebidu",
      kn: "ಬೇಲೂರು ಮತ್ತು ಹಳೇಬೀಡು",
      district: "Hassan",
      region: "Hoysala Heartland",
      tag: "Filigree Sculptures",
      desc: "Star-shaped soapstone sanctums with world-famous Madanika dancers and battle reliefs, newly inscribed as UNESCO World Heritage in 2023.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "badami",
      name: "Badami Cave Temples",
      kn: "ಬಾದಾಮಿ ಗುಹೆಗಳು",
      district: "Bagalkote",
      region: "North Karnataka",
      tag: "Chalukya Rock-Cut Art",
      desc: "6th-century red sandstone cliff caves overlooking Agastya lake, featuring the 18-armed dancing Nataraja and ancient Jain/Vedic sanctuaries.",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "gokarna",
      name: "Gokarna & Om Beach",
      kn: "ಗೋಕರ್ಣ",
      district: "Uttara Kannada",
      region: "Coastal Karnataka",
      tag: "Sacred Shoreline",
      desc: "Ancient coastal town sacred for Mahabaleshwara Atmalinga, where dramatic granite cliffs tumble into pristine Arabian Sea crescent beaches.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const moodCategories = [
    {
      title: "Chasing Waterfalls",
      kn: "ಜಲಪಾತಗಳು",
      desc: "Jog Falls, Abbey, Shivanasamudra, Sathodi",
      to: "/explore?category=waterfalls",
      icon: Waves,
      bgImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Escaping to the Hills",
      kn: "ಗಿರಿಧಾಮಗಳು",
      desc: "Chikkamagaluru, Coorg, Kudremukh, Agumbe",
      to: "/explore?category=nature",
      icon: Mountain,
      bgImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Ancient Kingdoms",
      kn: "ಐತಿಹಾಸಿಕ ತಾಣಗಳು",
      desc: "Hampi, Badami, Belur, Pattadakal, Bijapur",
      to: "/explore?category=heritage",
      icon: Building,
      bgImage: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Taste Karnataka",
      kn: "ಆಹಾರ ಸಂಸ್ಕೃತಿ",
      desc: "Mysore Masala Dosa, Neer Dosa, Benne Dosa",
      to: "/food",
      icon: Utensils,
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
      {/* 1. Cinematic Hero Section with Embedded Video Background & Live Channel Switcher */}
      <section className="relative rounded-3xl overflow-hidden bg-forest text-ivory shadow-2xl min-h-[660px] flex items-center border border-gold/40">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={activeChannel.poster}
            className="w-full h-full object-cover opacity-50 filter brightness-90 contrast-110 scale-105 transition-all duration-700"
          >
            <source src={activeChannel.video_url} type="video/mp4" />
            <img
              src={activeChannel.poster}
              alt="Karnataka heritage"
              className="w-full h-full object-cover"
            />
          </video>

          {/* Gradient Overlays for Crisp Typographic Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/85 to-forest/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-black/50" />
        </div>

        {/* Top Video Controls & Channel Badge Widget */}
        <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-2">
          {/* Active Stream Indicator */}
          <div className="bg-black/60 backdrop-blur-md text-gold border border-gold/40 rounded-full px-3 py-1 text-[11px] font-bold flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="hidden sm:inline">LIVE CHANNEL:</span>
            <span>{activeChannel.title.split("&")[0]}</span>
          </div>

          <button
            onClick={toggleMute}
            className="bg-black/60 hover:bg-black/80 text-gold border border-gold/40 rounded-full p-2 text-xs font-semibold backdrop-blur-md transition shadow-md"
            title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleVideo}
            className="bg-black/60 hover:bg-black/80 text-gold border border-gold/40 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition shadow-md"
            title="Toggle Background Video Playback"
            aria-label="Toggle Video"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 max-w-4xl px-6 sm:px-12 py-16 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold border border-gold/40 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>National Hackathon 2026 Edition • Smart Tourism & Culture Hub</span>
          </div>

          {/* Requested Exact Hero Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover Karnataka's Living Culture, Heritage & Wild Wonders.
          </h1>

          {/* Requested Exact Hero Subheading */}
          <p className="text-base sm:text-lg text-ivory/90 max-w-2xl leading-relaxed">
            From the thunderous cascades of Jog Falls to the royal grandeur of Mysuru Dasara and the UNESCO boulders of Hampi — experience a deterministic, culturally authentic AI companion engineered for Karnataka.
          </p>

          {/* Video Channel Quick Switcher Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gold/80 block">
              🎥 Select Karnataka Culture & Heritage Video Loop:
            </span>
            <div className="flex flex-wrap gap-2">
              {heroVideos.map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => selectChannel(vid)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border backdrop-blur-md flex items-center space-x-1.5 ${
                    activeChannel.id === vid.id
                      ? "bg-gold text-forest border-gold shadow-md font-bold scale-102"
                      : "bg-black/40 text-stone-200 border-white/20 hover:border-gold/60 hover:text-white"
                  }`}
                >
                  <span>{vid.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero Action CTAs */}
          <div className="flex flex-wrap gap-3.5 pt-3">
            <Link
              to="/planner"
              className="px-6 py-3.5 bg-gold text-forest font-bold text-sm rounded-xl shadow-lg hover:bg-gold/90 transition-all flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <span>{t("plan_my_journey")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setShowVideoModal(true)}
              className="px-5 py-3.5 bg-gold/20 hover:bg-gold/30 text-gold font-bold text-sm rounded-xl border border-gold/50 backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Film className="w-4 h-4 text-gold" />
              <span>Watch 4K Cultural Film</span>
            </button>

            <Link
              to="/assistant"
              className="px-5 py-3.5 bg-black/40 hover:bg-black/60 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center space-x-2"
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

      {/* 2. Interactive 4K Cultural Film Modal with Chapter Navigation */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-forest border border-gold/50 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative text-ivory">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-gold" />
                <h3 className="text-base sm:text-lg font-bold">
                  Incredible Karnataka: Living Culture, Traditions & Wonders
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chapter Selection Pills inside Modal */}
            <div className="flex flex-wrap gap-2 pb-2">
              {heroVideos.map((vid, idx) => (
                <button
                  key={vid.id}
                  onClick={() => setModalChapterIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    modalChapterIndex === idx
                      ? "bg-gold text-forest font-bold"
                      : "bg-white/10 text-stone-300 hover:bg-white/20"
                  }`}
                >
                  <span>Ch {idx + 1}: {vid.title.split("&")[0]}</span>
                </button>
              ))}
            </div>

            {/* Video Player */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-inner">
              <video
                key={heroVideos[modalChapterIndex].id}
                controls
                autoPlay
                className="w-full h-full object-cover"
                poster={heroVideos[modalChapterIndex].poster}
              >
                <source src={heroVideos[modalChapterIndex].video_url} type="video/mp4" />
              </video>
            </div>

            {/* Chapter Details & Cultural Narrative */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gold">
                  {heroVideos[modalChapterIndex].title} ({heroVideos[modalChapterIndex].kn})
                </h4>
                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-md font-semibold">
                  {heroVideos[modalChapterIndex].category}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {heroVideos[modalChapterIndex].subtitle}
              </p>
            </div>

            {/* Cultural Insights Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="font-bold text-gold block mb-1">🎭 Yakshagana & Coastal Lore</span>
                <p className="text-stone-300 text-[11px]">Epic coastal theater, Badagu and Tenku Tittu styles celebrating heroic mythology.</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="font-bold text-gold block mb-1">👑 Mysuru Dasara Grandeur</span>
                <p className="text-stone-300 text-[11px]">400-year royal Wadiyar procession, 750kg Golden Howdah and Chamundi Hill reverence.</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="font-bold text-gold block mb-1">🏛️ Hampi & Western Ghats</span>
                <p className="text-stone-300 text-[11px]">UNESCO boulder architecture meeting misty rainforests and cascades of Jog Falls.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Hackathon Engineering Metric Banner */}
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

      {/* 4. Soul of Karnataka: Culture, Traditions & Living Heritage Showcase */}
      <section className="space-y-6" id="culture-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
              {language === "kn" ? "ಕರ್ನಾಟಕದ ಹೆಮ್ಮೆ" : "Cultural Tapestry"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              {language === "kn"
                ? "ಕರ್ನಾಟಕದ ಜೀವಂತ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಂಪ್ರದಾಯಗಳು"
                : "Soul of Karnataka: Living Culture, Traditions & Heritage"}
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-2xl mt-1">
              Immerse yourself in centuries of performing arts, sacred ecology, royal celebrations, and architectural marvels.
            </p>
          </div>

          {/* Culture Category Filters */}
          <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
            {[
              { id: "all", label: "All Traditions" },
              { id: "performing", label: "Folk & Performing Arts" },
              { id: "royalty", label: "Royal Heritage" },
              { id: "unesco", label: "UNESCO Architecture" },
              { id: "nature", label: "Sacred Nature" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCultureFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  cultureFilter === f.id
                    ? "bg-forest text-gold font-bold shadow-xs"
                    : "bg-stone-100 text-charcoal/70 hover:bg-stone-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Culture Tradition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTraditions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all border border-stone-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <span className="absolute top-3 left-3 bg-forest/90 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-gold/30">
                    {item.badge}
                  </span>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] text-gold font-semibold uppercase tracking-wider block">
                      {item.region}
                    </span>
                    <h3 className="text-base font-bold leading-tight">{item.title}</h3>
                    <p className="text-xs text-stone-300 font-kannada">{item.kn}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest block">
                    {item.categoryLabel}
                  </span>
                  <p className="text-xs text-charcoal/80 leading-relaxed">{item.desc}</p>
                  <div className="pt-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Hubs: </span>
                    {item.places}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/planner?origin=bengaluru&days=3&interest=heritage`}
                  className="w-full py-2 bg-stone-50 hover:bg-forest hover:text-gold text-forest text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Experience in Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Places of Karnataka: Iconic Cultural & Natural Landmarks */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
              Iconic Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Places of Karnataka: Natural Wonders & Sacred Citadels
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-2xl mt-1">
              From the highest waterfalls to UNESCO ancient rock architecture and tranquil Arabian shores.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-forest hover:text-gold flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {iconicPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all border border-stone-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 bg-forest/90 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-gold/30">
                    {place.tag}
                  </span>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] text-gold font-semibold uppercase tracking-wider block">
                      {place.district} • {place.region}
                    </span>
                    <h3 className="text-base font-bold leading-tight">{place.name}</h3>
                    <p className="text-xs text-stone-300 font-kannada">{place.kn}</p>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-charcoal/80 leading-relaxed">{place.desc}</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/planner?origin=bengaluru&days=3&must_visit=${place.id}`}
                  className="w-full py-2 bg-stone-50 hover:bg-forest hover:text-gold text-forest text-xs font-semibold rounded-lg border border-stone-200 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Build Route to {place.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Quick Search / Trip Launcher Card */}
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
            className="w-full py-2.5 bg-forest hover:bg-forest/90 text-gold font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-2 h-[38px] shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Generate Itinerary</span>
          </button>
        </form>
      </section>

      {/* 7. Discover by Mood */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-gold tracking-widest block mb-1">
              Curated Moods
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              {t("discover_by_mood")}
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-2xl mt-1">
              Filter by experience style — from tranquil Western Ghat cascades to ancient Vijayanagara ruins.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-semibold text-forest hover:text-gold flex items-center space-x-1 mt-2 sm:mt-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {moodCategories.map((mood, idx) => {
            const Icon = mood.icon;
            return (
              <Link
                key={idx}
                to={mood.to}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5 border border-stone-200"
              >
                <img
                  src={mood.bgImage}
                  alt={mood.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

                <div className="relative z-10 text-white space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-gold/90 text-forest flex items-center justify-center mb-2 shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base leading-tight flex items-center justify-between">
                    <span>{mood.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                  </h3>
                  <p className="text-xs text-gold font-kannada font-medium">{mood.kn}</p>
                  <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed pt-1">
                    {mood.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 8. Spotlight Modules: AI Webstrapping Studio & Taste Karnataka */}
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

      {/* 9. Distinct Regions Grid */}
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
