import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { useLanguage } from "../context/LanguageContext";
import type { SavedTrip } from "../types";
import {
  BookmarkCheck,
  Calendar,
  IndianRupee,
  MapPin,
  Trash2,
  Copy,
  Share2,
  ArrowRight,
  ExternalLink,
  Printer,
  Sparkles
} from "lucide-react";

export default function MyTrips() {
  const { savedTrips, setCurrentPlan, removeSavedTrip, saveCurrentTrip } = useTrip();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const handleOpenTrip = (trip: SavedTrip) => {
    setCurrentPlan(trip.plan);
    navigate("/itinerary");
  };

  const handleDuplicateTrip = async (trip: SavedTrip) => {
    setCurrentPlan(trip.plan);
    await saveCurrentTrip(`${trip.title} (Copy)`);
    setShareToast("Trip duplicated successfully!");
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    await removeSavedTrip(id);
    setDeleteConfirmId(null);
  };

  const handleShare = (trip: SavedTrip) => {
    const url = window.location.origin + "/planner?origin=" + trip.plan.origin.id + "&days=" + trip.duration_days;
    navigator.clipboard.writeText(url);
    setShareToast("Shareable link copied to clipboard!");
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gold mb-1">
            <BookmarkCheck className="w-4 h-4 text-forest" />
            <span>Persisted Itineraries</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
            {language === "kn" ? "ನನ್ನ ಉಳಿಸಿದ ಪ್ರವಾಸಗಳು" : "My Saved Karnataka Expeditions"}
          </h1>
        </div>

        <Link
          to="/planner"
          className="px-5 py-2.5 bg-forest text-ivory text-xs font-bold rounded-xl hover:bg-forest/90 transition shadow-sm self-start sm:self-auto"
        >
          Plan New Journey
        </Link>
      </div>

      {shareToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-2xl animate-fadeIn">
          {shareToast}
        </div>
      )}

      {/* Trips Grid */}
      {savedTrips.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <BookmarkCheck className="w-16 h-16 text-forest/40 mx-auto" />
          <h2 className="text-lg font-bold text-charcoal">No Saved Trips Yet</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Generate an itinerary on the planner and click "Save Trip" to keep your customized Karnataka travel schedules here.
          </p>
          <Link
            to="/planner"
            className="inline-block px-6 py-2.5 bg-forest text-ivory text-xs font-bold rounded-xl hover:bg-forest/90 transition shadow-md"
          >
            Create Your First Itinerary
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
                      {trip.origin} Hub • {trip.duration_days} Days
                    </span>
                    <h3 className="font-extrabold text-lg text-charcoal mt-0.5">
                      {trip.title}
                    </h3>
                  </div>

                  <span className="text-xs font-extrabold text-forest bg-forest/10 px-2.5 py-1 rounded-lg">
                    ₹{Number(trip.budget_inr).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Stops Summary */}
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-gray-500">Scheduled Stops:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trip.plan.days.map((d) => (
                      <span
                        key={d.day}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded-md font-medium"
                      >
                        Day {d.day}: {language === "kn" && d.kn ? d.kn : d.name}
                      </span>
                    ))}
                  </div>
                </div>

                {trip.created_at && (
                  <p className="text-[10px] text-gray-400">
                    Saved on: {new Date(trip.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="border-t pt-4 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenTrip(trip)}
                  className="px-4 py-2 bg-forest text-ivory text-xs font-bold rounded-xl hover:bg-forest/90 transition flex items-center space-x-1"
                >
                  <span>Open Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleDuplicateTrip(trip)}
                    className="p-2 text-gray-500 hover:text-forest hover:bg-gray-100 rounded-lg transition"
                    title="Duplicate Trip"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleShare(trip)}
                    className="p-2 text-gray-500 hover:text-forest hover:bg-gray-100 rounded-lg transition"
                    title="Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === trip.id ? (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDelete(trip.id)}
                        className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-gray-400 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(trip.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
