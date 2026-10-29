import React, { useState, useEffect } from "react";
import type { Plan, Destination } from "../types";
import { listDestinations, replaceItineraryStop } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { X, RefreshCw, CheckCircle2, MapPin, Sparkles } from "lucide-react";

interface ReplaceStopModalProps {
  currentPlan: Plan;
  stopId: string;
  stopName: string;
  onClose: () => void;
  onSuccess: (newPlan: Plan) => void;
}

export const ReplaceStopModal: React.FC<ReplaceStopModalProps> = ({
  currentPlan,
  stopId,
  stopName,
  onClose,
  onSuccess
}) => {
  const { language } = useLanguage();
  const [candidates, setCandidates] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [replacing, setReplacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const existingStopIds = new Set(currentPlan.days.map((d) => d.stop));

  useEffect(() => {
    async function fetchAlternatives() {
      try {
        setLoading(true);
        const res = await listDestinations({ size: 30 });
        // Exclude origin and destinations already in the trip
        const available = res.items.filter(
          (d) => !existingStopIds.has(d.id) && d.id !== currentPlan.origin.id
        );
        setCandidates(available);
      } catch (err: any) {
        setError("Failed to load alternatives.");
      } finally {
        setLoading(false);
      }
    }
    fetchAlternatives();
  }, [stopId]);

  const handleSelectReplacement = async (newDestId: string) => {
    try {
      setReplacing(true);
      setError(null);
      const updated = await replaceItineraryStop(
        currentPlan,
        stopId,
        newDestId,
        currentPlan.days.some((d) => d.step_free)
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to swap destination.");
    } finally {
      setReplacing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100">
        {/* Header */}
        <div className="p-5 bg-forest text-ivory flex items-center justify-between border-b border-forest/70">
          <div>
            <h3 className="font-bold text-lg flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-gold" />
              <span>Replace Destination</span>
            </h3>
            <p className="text-xs text-ivory/80">
              Replacing: <span className="font-semibold text-gold">{stopName}</span> without losing other days
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of alternative destinations */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500 flex flex-col items-center">
              <RefreshCw className="w-6 h-6 animate-spin text-forest mb-2" />
              <span>Finding matching regional destinations...</span>
            </div>
          ) : candidates.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No additional alternatives found.
            </div>
          ) : (
            candidates.map((dest) => (
              <div
                key={dest.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 hover:border-gold hover:shadow-sm bg-white transition group"
              >
                <div className="flex items-center space-x-3">
                  {dest.image_url ? (
                    <img
                      src={dest.image_url}
                      alt={dest.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm text-charcoal group-hover:text-forest transition">
                      {language === "kn" && dest.kn ? dest.kn : dest.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {dest.region} • {dest.categories.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>

                <button
                  disabled={replacing}
                  onClick={() => handleSelectReplacement(dest.id)}
                  className="px-3.5 py-1.5 bg-forest text-ivory text-xs font-semibold rounded-lg hover:bg-forest/90 disabled:opacity-50 transition flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                  <span>{replacing ? "Swapping..." : "Select"}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
