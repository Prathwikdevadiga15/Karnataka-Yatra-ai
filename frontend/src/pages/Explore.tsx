import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { listDestinations } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import type { Destination } from "../types";
import { DestinationModal } from "../components/DestinationModal";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  Accessibility,
  ArrowRight,
  Sparkles,
  Layers
} from "lucide-react";

const CATEGORIES = [
  "heritage",
  "nature",
  "beaches",
  "temples",
  "adventure",
  "wildlife",
  "food",
  "family"
];

const REGIONS = [
  "Coastal",
  "Malnad",
  "Old Mysore",
  "North Karnataka",
  "Hoysala",
  "Bengaluru",
  "Kalyana Karnataka"
];

export default function Explore() {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get("region") || "");
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const res = await listDestinations({
          q: query,
          category: selectedCategory,
          region: selectedRegion,
          accessible: accessibleOnly ? true : undefined,
          size: 50
        });
        setDestinations(res.items);
        setTotalCount(res.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [query, selectedCategory, selectedRegion, accessibleOnly]);

  const handlePlanWithDest = (destId: string) => {
    navigate(`/planner?origin=${destId}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold text-gold tracking-widest block">
          Curated Destination Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
          {language === "kn" ? "ಕರ್ನಾಟಕದ ತಾಣಗಳ ಅನ್ವೇಷಣೆ" : "Explore Karnataka"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Search through authentic regional destinations across all 7 geographic zones of Karnataka.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === "kn"
                ? "ಸ್ಥಳ, ಜಿಲ್ಲೆ ಅಥವಾ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ (ಉದಾ: ಹಂಪಿ, ಮೈಸೂರು)..."
                : "Search destination or district (e.g., Hampi, Badami, Coorg, Gokarna)..."
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-forest focus:outline-none"
          />
        </div>

        {/* Filter Rows */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Region Dropdown */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-forest bg-white"
          >
            <option value="">All Regions (ಎಲ್ಲಾ ಪ್ರಾಂತ್ಯಗಳು)</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-forest bg-white"
          >
            <option value="">All Categories (ಎಲ್ಲಾ ವಿಭಾಗಗಳು)</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>

          {/* Accessible Checkbox */}
          <label className="flex items-center space-x-1.5 text-xs text-charcoal cursor-pointer ml-auto">
            <input
              type="checkbox"
              checked={accessibleOnly}
              onChange={(e) => setAccessibleOnly(e.target.checked)}
              className="accent-forest w-3.5 h-3.5 cursor-pointer rounded"
            />
            <span className="font-semibold flex items-center space-x-1">
              <Accessibility className="w-3.5 h-3.5 text-forest" />
              <span>Step-Free Only</span>
            </span>
          </label>
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Found {totalCount} verified destinations</span>
          {(query || selectedCategory || selectedRegion || accessibleOnly) && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedCategory("");
                setSelectedRegion("");
                setAccessibleOnly(false);
              }}
              className="text-forest hover:text-gold font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500 flex flex-col items-center">
            <Layers className="w-8 h-8 animate-spin text-forest mb-2" />
            <span>Loading Karnataka destinations...</span>
          </div>
        ) : destinations.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-500 bg-white rounded-2xl border border-gray-200">
            No destinations found matching your criteria. Try adjusting filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Photo & Badges */}
                <div className="relative h-48 overflow-hidden bg-forest">
                  {d.image_url ? (
                    <img
                      src={d.image_url}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <MapPin className="w-12 h-12" />
                    </div>
                  )}

                  <span className="absolute top-3 left-3 bg-forest/85 backdrop-blur-md text-ivory text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {d.region}
                  </span>

                  {d.verification_status === "verified" && (
                    <span className="absolute bottom-3 left-3 bg-emerald-600/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-base text-charcoal group-hover:text-forest transition">
                        {language === "kn" && d.kn ? d.kn : d.name}
                      </h3>
                      {d.entry_fee_inr > 0 ? (
                        <span className="text-xs font-semibold text-gray-600">
                          ₹{d.entry_fee_inr}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Free Entry
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {language === "kn" && d.description_kn
                        ? d.description_kn
                        : d.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                      {d.categories.map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 capitalize"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <button
                      onClick={() => setSelectedDest(d)}
                      className="text-xs font-semibold text-forest hover:text-gold transition flex items-center space-x-1"
                    >
                      <span>Evidence & Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handlePlanWithDest(d.id)}
                      className="px-3 py-1 bg-forest text-ivory text-xs font-medium rounded-lg hover:bg-forest/90 transition shadow-sm"
                    >
                      Plan From Here
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedDest && (
        <DestinationModal
          destination={selectedDest}
          onClose={() => setSelectedDest(null)}
        />
      )}
    </div>
  );
}
