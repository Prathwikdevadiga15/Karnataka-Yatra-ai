import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTrip } from "../context/TripContext";
import { generateItinerary, listDestinations } from "../services/api";
import type { Destination, PlanRequest } from "../types";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Accessibility,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Car,
  Train,
  Bus
} from "lucide-react";

const INTEREST_OPTIONS = [
  { id: "heritage", label: "Heritage & Monuments", kn: "ಐತಿಹಾಸಿಕ ಪರಂಪರೆ" },
  { id: "nature", label: "Nature & Waterfalls", kn: "ಪ್ರಕೃತಿ ಮತ್ತು ಜಲಪಾತ" },
  { id: "beaches", label: "Beaches & Coastal", kn: "ಕಡಲತೀರಗಳು" },
  { id: "temples", label: "Temples & Pilgrimage", kn: "ಪವಿತ್ರ ದೇವಾಲಯಗಳು" },
  { id: "adventure", label: "Adventure & Trekking", kn: "ಸಾಹಸ ಮತ್ತು ಚಾರಣ" },
  { id: "wildlife", label: "Wildlife Safaris", kn: "ವನ್ಯಜೀವಿ ಸಫಾರಿ" },
  { id: "food", label: "Culinary & Regional Food", kn: "ವಿಶಿಷ್ಟ ಪಾಕಪದ್ಧತಿ" },
  { id: "family", label: "Family Activities", kn: "ಕುಟುಂಬ ಸ್ನೇಹಿ" }
];

const ORIGIN_HUBS = [
  { id: "bengaluru", name: "Bengaluru", kn: "ಬೆಂಗಳೂರು", district: "Capital Hub" },
  { id: "mysuru", name: "Mysuru", kn: "ಮೈಸೂರು", district: "Heritage Hub" },
  { id: "mangaluru", name: "Mangaluru", kn: "ಮಂಗಳೂರು", district: "Coastal Hub" },
  { id: "udupi", name: "Udupi", kn: "ಉಡುಪಿ", district: "Coastal Hub" },
  { id: "chikkamagaluru", name: "Chikkamagaluru", kn: "ಚಿಕ್ಕಮಗಳೂರು", district: "Malnad Hub" }
];

export default function Planner() {
  const { language, t } = useLanguage();
  const { currentPlan, setCurrentPlan } = useTrip();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form State
  const [origin, setOrigin] = useState(searchParams.get("origin") || "bengaluru");
  const [durationDays, setDurationDays] = useState(
    Number(searchParams.get("days")) || (currentPlan ? currentPlan.duration_days : 3)
  );
  const [travellers, setTravellers] = useState(currentPlan ? currentPlan.travellers : 2);
  const [budgetInr, setBudgetInr] = useState(currentPlan ? currentPlan.target_budget : 30000);
  const [travelStyle, setTravelStyle] = useState(currentPlan ? currentPlan.travel_style : "moderate");
  const [interests, setInterests] = useState<string[]>(() => {
    const pInterest = searchParams.get("interest");
    return pInterest ? [pInterest] : ["heritage", "nature"];
  });
  const [accessible, setAccessible] = useState(false);
  const [lockedStops, setLockedStops] = useState<string[]>([]);

  // Destination candidates for locking
  const [allDests, setAllDests] = useState<Destination[]>([]);
  const [loadingDests, setLoadingDests] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCandidates() {
      try {
        setLoadingDests(true);
        const res = await listDestinations({ size: 40 });
        setAllDests(res.items);
      } catch {
        // quiet error
      } finally {
        setLoadingDests(false);
      }
    }
    loadCandidates();
  }, []);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleLock = (destId: string) => {
    setLockedStops((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  // Live budget validation
  const minRequiredBudget = durationDays * travellers * 2000;
  const budgetError =
    budgetInr < 1000
      ? "Minimum budget is ₹1,000"
      : budgetInr < minRequiredBudget
      ? `Budget is tight for ${durationDays} days and ${travellers} travellers (est. min ₹${minRequiredBudget.toLocaleString()}).`
      : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (budgetInr < 1000) {
      setError("Please specify a valid budget (minimum ₹1,000).");
      return;
    }

    if (interests.length === 0) {
      setError("Please select at least one travel interest or theme.");
      return;
    }

    try {
      setIsSubmitting(true);
      const req: PlanRequest = {
        origin,
        duration_days: durationDays,
        travellers,
        budget_inr: budgetInr,
        interests,
        accessible,
        locked: lockedStops,
        travel_style: travelStyle
      };
      const plan = await generateItinerary(req);
      setCurrentPlan(plan);
      navigate("/itinerary");
    } catch (err: any) {
      setError(err.message || "Failed to generate itinerary. Please refine inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold text-gold tracking-widest block">
          Tailored Karnataka Travel
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
          {t("planner_title")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          {t("planner_subtitle")}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center space-x-3 text-red-800 text-xs shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Planning Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-8"
      >
        {/* Section 1: Core Trip Parameters */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-forest border-b pb-2 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-gold" />
            <span>1. Core Journey Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Origin */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-forest" />
                <span>{t("origin_label")}</span>
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none bg-white font-medium"
              >
                {ORIGIN_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.kn}) - {hub.district}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-forest" />
                  <span>{t("duration_label")}: {durationDays} Days</span>
                </span>
                <span className="text-[10px] text-gray-500">1 to 14 days</span>
              </label>
              <input
                type="range"
                min={1}
                max={14}
                value={durationDays}
                onChange={(e) => setDurationDays(+e.target.value)}
                className="w-full accent-forest cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1d (Daytrip)</span>
                <span>3d (Long weekend)</span>
                <span>7d (Grand)</span>
                <span>14d (Epic)</span>
              </div>
            </div>

            {/* Travellers */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-forest" />
                <span>{t("travellers_label")}</span>
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={travellers}
                  onChange={(e) => setTravellers(Math.max(1, +e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-forest focus:outline-none font-medium"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {travellers === 1 ? "Solo Traveller" : `${travellers} Travellers`}
                </span>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center space-x-1">
                <IndianRupee className="w-3.5 h-3.5 text-forest" />
                <span>{t("budget_label")}</span>
              </label>
              <input
                type="number"
                step={1000}
                min={1000}
                value={budgetInr}
                onChange={(e) => setBudgetInr(+e.target.value)}
                className={`w-full text-xs p-3 rounded-xl border focus:ring-2 focus:outline-none font-medium ${
                  budgetError ? "border-amber-400 focus:ring-amber-400" : "border-gray-300 focus:ring-forest"
                }`}
              />
              {budgetError && (
                <p className="text-[11px] text-amber-700 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{budgetError}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Travel Style & Interests */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-forest border-b pb-2 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>2. Style & Cultural Themes</span>
          </h2>

          {/* Travel Pace */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-2">
              {t("travel_style_label")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "relaxed", label: t("style_relaxed"), desc: "Unrushed, ample free time at heritage sites" },
                { id: "moderate", label: t("style_moderate"), desc: "Optimal balance of sightseeing and transit" },
                { id: "fast_paced", label: t("style_fast"), desc: "Cover maximum ground across regions" }
              ].map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setTravelStyle(style.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    travelStyle === style.id
                      ? "border-forest bg-forest/5 ring-2 ring-forest"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <p className="font-bold text-xs text-forest">{style.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-2">
              {t("interests_label")} (Select themes for destination matching)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => {
                const active = interests.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleInterest(opt.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      active
                        ? "bg-forest text-ivory border-forest shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <span>{language === "kn" ? opt.kn : opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Inclusivity & Must-Visit Locks */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-forest border-b pb-2 flex items-center space-x-2">
            <Accessibility className="w-4 h-4 text-gold" />
            <span>3. Accessibility & Must-Visit Stops</span>
          </h2>

          {/* Accessibility Toggle */}
          <div className="p-4 rounded-xl bg-ivory/60 border border-gold/20 flex items-start space-x-3">
            <input
              type="checkbox"
              id="accessible"
              checked={accessible}
              onChange={(e) => setAccessible(e.target.checked)}
              className="mt-1 w-4 h-4 accent-forest cursor-pointer rounded"
            />
            <label htmlFor="accessible" className="text-xs text-charcoal cursor-pointer">
              <span className="font-semibold block">{t("step_free_label")}</span>
              <span className="text-gray-500 text-[11px]">
                Restricts generated schedule to verified destinations with ramp access or flat ground paths (e.g., Mysuru Palace, Lalbagh, Udupi Matha).
              </span>
            </label>
          </div>

          {/* Locked Stops Selection */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-forest" />
              <span>{t("locked_stops_label")} (Optional)</span>
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              Select specific Karnataka landmarks that must be guaranteed in your day-by-day plan.
            </p>

            <div className="max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50/50">
              {allDests.map((d) => {
                const isLocked = lockedStops.includes(d.id);
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => toggleLock(d.id)}
                    className={`p-2 rounded-lg text-left text-xs border flex items-center justify-between transition ${
                      isLocked
                        ? "bg-amber-100/70 border-amber-400 text-amber-900 font-semibold"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span className="truncate">{language === "kn" && d.kn ? d.kn : d.name}</span>
                    {isLocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 ml-1" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generate Action */}
        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-forest text-ivory text-sm font-bold rounded-2xl hover:bg-forest/90 shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-gold animate-pulse" />
            <span>{isSubmitting ? t("generating_btn") : t("generate_btn")}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
