import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Globe,
  Search,
  Sparkles,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Link as LinkIcon,
  Eye,
  Database,
  ArrowRight,
  ShieldCheck,
  Filter,
  Bookmark,
  Share2,
  Trash2,
  Edit3
} from "lucide-react";

interface ResearchSource {
  id: string;
  title: string;
  url: string;
  type: "Official ASI" | "Karnataka Tourism" | "KSRTC" | "Field Record" | "Academic";
  retrievalDate: string;
  reliability: "High" | "Medium" | "Pending Review";
  extractedFactsCount: number;
}

interface ResearchItem {
  id: string;
  query: string;
  district: string;
  category: string;
  status: "Draft" | "Researching" | "Needs Review" | "Approved" | "Published";
  timestamp: string;
  facts: string[];
  missingFields: string[];
  sources: ResearchSource[];
  imageUrl?: string;
  suggestedTags: string[];
}

export default function WebstrappingStudio() {
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<"workspace" | "imageResearch" | "sources">("workspace");
  const [selectedTask, setSelectedTask] = useState<string>("task-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock research items for studio demonstration
  const [researchTasks, setResearchTasks] = useState<ResearchItem[]>([
    {
      id: "task-1",
      query: "Jog Falls & Western Ghats Waterfalls Intake",
      district: "Shivamogga",
      category: "Waterfalls",
      status: "Needs Review",
      timestamp: "Today, 10:45 AM",
      facts: [
        "Segmented waterfall on Sharavathi River with 4 cascades: Raja, Roarer, Rocket, Rani.",
        "Total drop height: 253 meters (830 ft) — second highest plunge waterfall in India.",
        "Best flow season: July to November during South-West monsoons.",
        "Nearest railhead: Talaguppa (14 km), Hub: Sagara (30 km)."
      ],
      missingFields: ["Wheelchair step-free ramp clearance to bottom view point", "Latest seasonal parking fee"],
      sources: [
        {
          id: "s1",
          title: "Karnataka State Tourism Development Corporation (KSTDC) Official Listing",
          url: "https://karnatakatourism.org/destinations/jog-falls/",
          type: "Karnataka Tourism",
          retrievalDate: "2026-10-28",
          reliability: "High",
          extractedFactsCount: 4
        },
        {
          id: "s2",
          title: "Archaeological & Environmental Survey of Western Ghats Rivers",
          url: "https://asi.nic.in/karnataka-heritage",
          type: "Academic",
          retrievalDate: "2026-10-27",
          reliability: "High",
          extractedFactsCount: 2
        }
      ],
      imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
      suggestedTags: ["Sharavathi", "Shivamogga", "Plunge Waterfall", "Monsoon Peak"]
    },
    {
      id: "task-2",
      query: "Badami & Pattadakal Chalukyan Architecture",
      district: "Bagalkote",
      category: "Heritage",
      status: "Approved",
      timestamp: "Yesterday, 3:20 PM",
      facts: [
        "Capital of Early Chalukyas (6th to 8th century CE) carved out of red sandstone cliffs.",
        "Cave 1 dedicated to Shiva with 18-armed Nataraja carving displaying 81 dance poses.",
        "Pattadakal UNESCO site features synthesis of Dravidian and Nagara temple architectural styles."
      ],
      missingFields: ["Audio guide language roster"],
      sources: [
        {
          id: "s3",
          title: "ASI Dharwad Circle Monograph Series",
          url: "https://asi.nic.in/badami-caves",
          type: "Official ASI",
          retrievalDate: "2026-10-26",
          reliability: "High",
          extractedFactsCount: 5
        }
      ],
      imageUrl: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80",
      suggestedTags: ["Chalukya", "Bagalkote", "Rock-Cut Caves", "UNESCO"]
    },
    {
      id: "task-3",
      query: "Udupi & Malpe Coastal Culinary Origins",
      district: "Udupi",
      category: "Food & Culture",
      status: "Draft",
      timestamp: "Oct 27, 2026",
      facts: [
        "Origin hub of Satvik vegetarian Udupi cuisine linked to Sri Krishna Temple Madhwa tradition.",
        "Coastal coastal seafood heritage includes Neer Dosa with Kane (Ladyfish) curry."
      ],
      missingFields: ["Verified local heritage kitchen hours", "Traditional spice ratio records"],
      sources: [
        {
          id: "s4",
          title: "Regional Food Heritage Archive — Coastal Karnataka",
          url: "https://karnatakatourism.org/cuisine",
          type: "Field Record",
          retrievalDate: "2026-10-27",
          reliability: "Medium",
          extractedFactsCount: 3
        }
      ],
      suggestedTags: ["Udupi", "Neer Dosa", "Satvik", "Coastal Culinary"]
    }
  ]);

  const activeItem = researchTasks.find((t) => t.id === selectedTask) || researchTasks[0];

  const handleRunResearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      const newTask: ResearchItem = {
        id: `task-${Date.now()}`,
        query: searchQuery,
        district: "Karnataka State",
        category: "Destination Research",
        status: "Needs Review",
        timestamp: "Just now",
        facts: [
          `Identified 3 verified regional publications matching "${searchQuery}".`,
          "Extracted geographical coordinates, elevation markers, and accessibility notes.",
          "Cross-referenced Archaeological Survey of India (ASI) database for heritage authenticity."
        ],
        missingFields: ["Community feedback verification", "Seasonal transit frequency"],
        sources: [
          {
            id: `s-${Date.now()}`,
            title: `Verified Open Web Source — ${searchQuery}`,
            url: urlInput || "https://karnatakatourism.org",
            type: "Karnataka Tourism",
            retrievalDate: new Date().toISOString().split("T")[0],
            reliability: "High",
            extractedFactsCount: 3
          }
        ],
        suggestedTags: [searchQuery.split(" ")[0] || "Karnataka", "Regional", "Verified"]
      };

      setResearchTasks([newTask, ...researchTasks]);
      setSelectedTask(newTask.id);
      setSearchQuery("");
      setUrlInput("");
      setIsProcessing(false);
    }, 1200);
  };

  const handleUpdateStatus = (status: ResearchItem["status"]) => {
    setResearchTasks((prev) =>
      prev.map((item) => (item.id === activeItem.id ? { ...item, status } : item))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest via-forest/90 to-ocean p-6 sm:p-8 rounded-2xl text-ivory shadow-lg border border-gold/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-gold/20 text-gold text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Destination Intelligence Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Webstrapping Studio
            </h1>
            <p className="text-sm sm:text-base text-ivory/80 max-w-2xl mt-1">
              {language === "kn"
                ? "ದೃಢೀಕೃತ ಮೂಲಗಳಿಂದ ಕರ್ನಾಟಕ ಪ್ರವಾಸೋದ್ಯಮ ಮಾಹಿತಿ ಸಂಶೋಧಿಸಿ, ವಿಶ್ಲೇಷಿಸಿ, ಮತ್ತು ಪರಿಶೀಲಿಸಿ."
                : "Research, ingest, structure, and verify authentic Karnataka tourism intelligence before publishing to the live platform."}
            </p>
          </div>

          {/* Quick Mode Switcher */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("workspace")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "workspace" ? "bg-gold text-forest shadow" : "text-ivory/70 hover:text-white"
              }`}
            >
              Research Workspace
            </button>
            <button
              onClick={() => setActiveTab("imageResearch")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "imageResearch" ? "bg-gold text-forest shadow" : "text-ivory/70 hover:text-white"
              }`}
            >
              Image Intelligence
            </button>
            <button
              onClick={() => setActiveTab("sources")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "sources" ? "bg-gold text-forest shadow" : "text-ivory/70 hover:text-white"
              }`}
            >
              Source Library
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Panel Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Panel: Research Queue & Intake */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-stone-200 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal/70 flex items-center space-x-1.5">
                <Bookmark className="w-3.5 h-3.5 text-forest" />
                <span>Research Tasks ({researchTasks.length})</span>
              </span>
              <span className="text-[11px] bg-forest/10 text-forest px-2 py-0.5 rounded font-semibold">
                Auto-Synced
              </span>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {researchTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t.id)}
                  className={`p-3 rounded-lg cursor-pointer transition border text-left ${
                    selectedTask === t.id
                      ? "bg-forest/5 border-forest text-forest shadow-xs"
                      : "bg-stone-50/50 hover:bg-stone-100/60 border-transparent text-charcoal"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                    <span className="text-gold/90 bg-forest/80 px-1.5 py-0.5 rounded text-[10px]">
                      {t.category}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        t.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : t.status === "Needs Review"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold line-clamp-1 text-charcoal">{t.query}</h4>
                  <div className="flex items-center justify-between text-[10px] text-charcoal/60 mt-1">
                    <span>{t.district}</span>
                    <span>{t.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Intake Trigger */}
          <div className="pt-3 border-t border-stone-100 mt-4">
            <div className="text-[11px] text-charcoal/60 flex items-center justify-between">
              <span>RAG Engine:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> ASI Grounded
              </span>
            </div>
          </div>
        </div>

        {/* Center Panel: Research Canvas & Extractor */}
        <div className="lg:col-span-6 bg-white rounded-xl shadow-sm border border-stone-200 p-5 flex flex-col">
          {/* Query Bar */}
          <form onSubmit={handleRunResearch} className="space-y-3 pb-4 border-b border-stone-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Enter research request (e.g. Research waterfalls in Shivamogga with ASI entry gates)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-24 py-2.5 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-forest focus:outline-none"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-forest hover:bg-forest/90 text-gold text-xs px-3 rounded-md font-semibold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isProcessing ? (
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Run Intake</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
                <input
                  type="url"
                  placeholder="Optional Source URL to scrape & verify (karnatakatourism.org, asi.nic.in)..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-md border border-stone-200 text-[11px] focus:outline-none focus:border-forest"
                />
              </div>
              <span className="text-[10px] text-charcoal/50 whitespace-nowrap">
                Strict Robots.txt Compliant
              </span>
            </div>
          </form>

          {/* Active Canvas Body */}
          <div className="flex-1 py-4 space-y-4 overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-forest uppercase tracking-wider">
                  Active Canvas: {activeItem.district} District
                </span>
                <h3 className="text-base font-extrabold text-charcoal">{activeItem.query}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleUpdateStatus("Approved")}
                  className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus("Published")}
                  className="px-2.5 py-1 rounded bg-forest text-gold hover:bg-forest/90 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Database className="w-3.5 h-3.5" /> Publish to Live
                </button>
              </div>
            </div>

            {/* Extracted Facts */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-charcoal/80 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-forest" />
                <span>Extracted Factual Claims ({activeItem.facts.length})</span>
              </h4>
              <div className="space-y-1.5">
                {activeItem.facts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-xs text-charcoal flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-forest/10 text-forest text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="flex-1 leading-relaxed">{fact}</p>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium shrink-0">
                      ASI Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Fields / Conflict Alert */}
            {activeItem.missingFields.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Information Deficits Identified Prior to Production</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-amber-900/80 space-y-0.5">
                  {activeItem.missingFields.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Database Field Mapping Preview */}
            <div className="bg-stone-900 text-stone-200 p-3 rounded-lg text-xs font-mono">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-800 text-[10px] text-stone-400">
                <span>SQL RELATIONAL MAPPING PREVIEW</span>
                <span>TABLE: destinations_staging</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-emerald-400 overflow-x-auto">
{`INSERT INTO destinations (name, district, category, verification_status)
VALUES ('${activeItem.query.slice(0, 24)}', '${activeItem.district}', '${activeItem.category}', '${activeItem.status.toLowerCase()}');`}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Panel: Source Inspector & Image Intelligence */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-stone-200 p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/70 flex items-center space-x-1.5 pb-2 border-b border-stone-100">
              <Eye className="w-3.5 h-3.5 text-forest" />
              <span>Source & Media Inspector</span>
            </span>

            {/* Source Card */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-charcoal">Grounding Sources ({activeItem.sources.length})</h5>
              {activeItem.sources.map((src) => (
                <div key={src.id} className="p-2.5 rounded-lg border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal text-[11px] line-clamp-1">
                      {src.title}
                    </span>
                  </div>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-forest hover:underline truncate block"
                  >
                    {src.url}
                  </a>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                    <span>{src.type}</span>
                    <span className="text-emerald-600 font-bold">{src.reliability}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Research Preview */}
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-charcoal flex items-center justify-between">
                <span>Visual Asset Association</span>
                <span className="text-[10px] text-forest cursor-pointer hover:underline">Change</span>
              </h5>
              {activeItem.imageUrl ? (
                <div className="rounded-lg overflow-hidden border border-stone-200 relative group">
                  <img
                    src={activeItem.imageUrl}
                    alt={activeItem.query}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-[10px]">
                    <p className="font-semibold truncate">{activeItem.query}</p>
                    <span className="text-stone-300 text-[9px]">License: Verified CC / Tourism Domain</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center text-stone-400 space-y-1">
                  <ImageIcon className="w-6 h-6 mx-auto opacity-50" />
                  <p className="text-[11px]">No image assigned yet</p>
                  <button className="text-[10px] bg-forest text-gold px-2 py-0.5 rounded font-semibold">
                    Upload Asset
                  </button>
                </div>
              )}
            </div>

            {/* Tags / Categories */}
            <div className="space-y-1.5">
              <h5 className="text-[11px] font-bold text-charcoal">Suggested District Tags</h5>
              <div className="flex flex-wrap gap-1">
                {activeItem.suggestedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-stone-100 text-charcoal/80 px-2 py-0.5 rounded-full border border-stone-200 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Workflow Action */}
          <div className="pt-3 border-t border-stone-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-charcoal/70">
              <span>Publishing Status:</span>
              <span className="text-forest font-bold">{activeItem.status}</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  activeItem.status === "Published"
                    ? "w-full bg-emerald-500"
                    : activeItem.status === "Approved"
                    ? "w-3/4 bg-blue-500"
                    : activeItem.status === "Needs Review"
                    ? "w-1/2 bg-amber-500"
                    : "w-1/4 bg-stone-400"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
