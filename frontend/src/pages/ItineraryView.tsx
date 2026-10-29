import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTrip } from "../context/TripContext";
import type { PlanDay, Plan } from "../types";
import { DestinationModal } from "../components/DestinationModal";
import { ReplaceStopModal } from "../components/ReplaceStopModal";
import { FeedbackModal } from "../components/FeedbackModal";
import {
  Compass,
  Calendar,
  Clock,
  Car,
  IndianRupee,
  Lock,
  Unlock,
  RefreshCw,
  ShieldCheck,
  Bookmark,
  Share2,
  Printer,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  CloudSun
} from "lucide-react";

export default function ItineraryView() {
  const { language, t } = useLanguage();
  const { currentPlan, setCurrentPlan, saveCurrentTrip, setSelectedStopId } = useTrip();
  const navigate = useNavigate();

  // Modal States
  const [selectedDayStop, setSelectedDayStop] = useState<PlanDay | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<{ id: string; name: string } | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!currentPlan) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <Compass className="w-16 h-16 text-forest/40 mx-auto" />
        <h2 className="text-xl font-bold text-charcoal">No Active Itinerary</h2>
        <p className="text-xs text-gray-500">
          Create a personalized journey with our deterministic AI planner.
        </p>
        <Link
          to="/planner"
          className="inline-block px-6 py-2.5 bg-forest text-ivory text-xs font-bold rounded-xl hover:bg-forest/90 transition shadow-md"
        >
          {t("plan_my_journey")}
        </Link>
      </div>
    );
  }

  const { days, budget, legs, assumptions, warnings, weather_alerts } = currentPlan;

  const handleToggleLock = (destId: string) => {
    const updatedDays = currentPlan.days.map((d) =>
      d.stop === destId ? { ...d, locked: !d.locked } : d
    );
    const updatedPlan: Plan = { ...currentPlan, days: updatedDays };
    setCurrentPlan(updatedPlan);
    if (selectedDayStop && selectedDayStop.stop === destId) {
      setSelectedDayStop({ ...selectedDayStop, locked: !selectedDayStop.locked });
    }
  };

  const handleSaveTrip = async () => {
    try {
      setSaving(true);
      const tripId = await saveCurrentTrip();
      setSavedSuccess("Trip successfully saved to your account!");
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (err: any) {
      alert("Failed to save trip: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentPlan, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `karnataka-yatra-${currentPlan.origin.id}-${currentPlan.duration_days}days.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gold mb-1">
            <span>Origin: {currentPlan.origin.name}</span>
            <span>•</span>
            <span>{currentPlan.duration_days} Days / {currentPlan.travellers} Travellers</span>
            <span>•</span>
            <span className="capitalize">{currentPlan.travel_style} Pace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
            {t("itinerary_title")}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveTrip}
            disabled={saving}
            className="px-4 py-2 bg-forest text-ivory text-xs font-semibold rounded-xl hover:bg-forest/90 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Bookmark className="w-3.5 h-3.5 text-gold" />
            <span>{saving ? "Saving..." : t("save_trip")}</span>
          </button>

          <Link
            to="/map"
            className="px-4 py-2 bg-ivory text-forest border border-gold/40 text-xs font-semibold rounded-xl hover:bg-gold/20 transition flex items-center space-x-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t("view_on_map")}</span>
          </Link>

          <Link
            to="/budget"
            className="px-4 py-2 bg-ivory text-forest border border-gold/40 text-xs font-semibold rounded-xl hover:bg-gold/20 transition flex items-center space-x-1.5"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Budget Details</span>
          </Link>

          <button
            onClick={handlePrint}
            className="p-2 text-gray-600 hover:text-forest bg-gray-100 rounded-xl transition"
            title="Print Itinerary"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportJson}
            className="p-2 text-gray-600 hover:text-forest bg-gray-100 rounded-xl transition"
            title="Download JSON Export"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* 2. Budget & Warnings KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estimated Cost */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500">{t("total_est_cost")}</p>
            <p className="text-xl font-extrabold text-forest">
              ₹{Number(budget.total).toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              ₹{Number(budget.per_person).toLocaleString("en-IN")} per person
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        {/* Budget Health */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500">{t("remaining_balance")}</p>
            <p
              className={`text-xl font-extrabold ${
                budget.remaining_budget >= 0 ? "text-emerald-700" : "text-red-600"
              }`}
            >
              ₹{Number(Math.abs(budget.remaining_budget)).toLocaleString("en-IN")}{" "}
              {budget.remaining_budget < 0 ? "Deficit" : "Surplus"}
            </p>
            <span
              className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 ${
                budget.remaining_budget >= 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {budget.remaining_budget >= 0 ? t("budget_healthy") : t("budget_exceeded")}
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              budget.remaining_budget >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}
          >
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Total Road Distance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500">Total Driving Transit</p>
            <p className="text-xl font-extrabold text-charcoal">
              {legs.reduce((acc, l) => acc + l.distance_km, 0).toFixed(0)} km
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              ~{legs.reduce((acc, l) => acc + l.duration_h, 0).toFixed(1)} hrs total travel
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Warnings & Weather Alerts */}
      {(warnings.length > 0 || (weather_alerts && weather_alerts.length > 0)) && (
        <div className="space-y-2">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl flex items-center space-x-3 text-amber-900 text-xs shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{w}</span>
            </div>
          ))}

          {weather_alerts &&
            weather_alerts.map((alert, idx) => (
              <div
                key={`weather-${idx}`}
                className="p-3.5 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl flex items-center space-x-3 text-blue-900 text-xs shadow-sm"
              >
                <CloudSun className="w-4 h-4 shrink-0 text-blue-600" />
                <span>
                  <strong>Weather Note (Day {alert.day} - {alert.stop}):</strong> {alert.advisory}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* 3. Day-by-Day Timeline */}
      <div className="space-y-6">
        <h2 className="text-xl font-extrabold text-forest flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gold" />
          <span>Day-by-Day Journey Schedule</span>
        </h2>

        <div className="space-y-6">
          {days.map((day, idx) => {
            const legToThis = legs[idx];
            const isLocked = day.locked;

            return (
              <div key={day.day} className="space-y-3">
                {/* Connecting Transit Leg Indicator */}
                {legToThis && (
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-xs text-gray-500">
                    <Car className="w-4 h-4 text-forest" />
                    <span>
                      Drive from <strong>{legToThis.from_name || legToThis.from}</strong> to{" "}
                      <strong>{legToThis.to_name || day.name}</strong>: ~{legToThis.distance_km} km (
                      {legToThis.duration_h}h estimated)
                    </span>
                  </div>
                )}

                {/* Day Attraction Card */}
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row">
                  {/* Image & Badges */}
                  <div className="relative md:w-72 h-52 md:h-auto overflow-hidden bg-forest">
                    {day.image_url ? (
                      <img
                        src={day.image_url}
                        alt={day.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-ivory/40">
                        <MapPin className="w-12 h-12" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-forest/90 backdrop-blur-md text-ivory text-xs font-bold px-3 py-1 rounded-full shadow">
                      {t("day")} {day.day}
                    </span>
                    {day.verification_status === "verified" && (
                      <span className="absolute bottom-3 left-3 bg-emerald-600/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{t("verified_badge")}</span>
                      </span>
                    )}
                  </div>

                  {/* Details Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 text-xs font-semibold text-gold">
                            <span>{day.region}</span>
                            {day.district && <span>• {day.district}</span>}
                          </div>
                          <h3 className="text-xl font-extrabold text-charcoal">
                            {language === "kn" && day.kn ? day.kn : day.name}
                          </h3>
                        </div>

                        {/* Lock / Unlock Toggle */}
                        <button
                          onClick={() => handleToggleLock(day.stop)}
                          className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg border font-semibold transition ${
                            isLocked
                              ? "bg-amber-100 border-amber-300 text-amber-900"
                              : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={isLocked ? "Stop is locked" : "Lock this stop"}
                        >
                          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          <span>{isLocked ? "Locked" : "Lock"}</span>
                        </button>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                        {language === "kn" && day.description_kn
                          ? day.description_kn
                          : day.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-500">
                        <span className="px-2.5 py-1 rounded-md bg-ivory border border-gold/30 text-forest font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{day.time_slot}</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                          ~{Math.round(day.visit_minutes / 60)}h exploration
                        </span>
                        {day.entry_fee_inr > 0 ? (
                          <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                            ₹{day.entry_fee_inr} entry pp
                          </span>
                        ) : null}
                        {day.step_free && (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-medium">
                            Step-Free Accessible
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions for Stop */}
                    <div className="flex flex-wrap items-center justify-between border-t pt-3 gap-2">
                      <button
                        onClick={() => setSelectedDayStop(day)}
                        className="text-xs font-semibold text-forest hover:text-gold transition flex items-center space-x-1"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{t("learn_more")}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStopId(day.stop);
                            navigate("/map");
                          }}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:text-forest bg-gray-100 rounded-lg transition"
                        >
                          View Map
                        </button>

                        <button
                          onClick={() => setReplaceTarget({ id: day.stop, name: day.name })}
                          className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{t("replace_stop")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Assumptions & Transparency Notes */}
      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-forest uppercase tracking-wider">
          Verification & Mathematical Assumptions
        </h3>
        <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-5">
          {assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
          <li>
            Cultural facts verified against Archaeological Survey of India (ASI) & Karnataka Tourism records.
          </li>
        </ul>

        <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setFeedbackOpen(true)}
            className="text-xs text-forest hover:text-gold font-semibold transition"
          >
            How was this itinerary? Leave Feedback ⭐
          </button>

          <Link
            to="/planner"
            className="text-xs font-semibold text-gray-600 hover:text-forest flex items-center space-x-1"
          >
            <span>Modify Plan Parameters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Modals */}
      {selectedDayStop && (
        <DestinationModal
          destination={selectedDayStop}
          onClose={() => setSelectedDayStop(null)}
          onLockToggle={handleToggleLock}
        />
      )}

      {replaceTarget && (
        <ReplaceStopModal
          currentPlan={currentPlan}
          stopId={replaceTarget.id}
          stopName={replaceTarget.name}
          onClose={() => setReplaceTarget(null)}
          onSuccess={(newPlan) => setCurrentPlan(newPlan)}
        />
      )}

      {feedbackOpen && (
        <FeedbackModal onClose={() => setFeedbackOpen(false)} />
      )}
    </div>
  );
}
