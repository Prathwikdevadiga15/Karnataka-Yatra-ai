import React from "react";
import type { Destination, PlanDay } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useTrip } from "../context/TripContext";
import {
  X,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  ExternalLink,
  Accessibility,
  CloudSun,
  Lock,
  PlusCircle
} from "lucide-react";

interface DestinationModalProps {
  destination: Destination | PlanDay | null;
  onClose: () => void;
  onLockToggle?: (destId: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onLockToggle
}) => {
  const { language, t } = useLanguage();
  const { currentPlan } = useTrip();

  if (!destination) return null;

  const isDay = "stop" in destination;
  const destId = isDay ? (destination as PlanDay).stop : (destination as Destination).id;
  const isLocked = isDay ? (destination as PlanDay).locked : false;

  const displayName = language === "kn" && destination.kn ? destination.kn : destination.name;
  const displayDesc = language === "kn" && destination.description_kn ? destination.description_kn : destination.description;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        {/* Modal Header & Image */}
        <div className="relative h-56 sm:h-64 w-full bg-forest overflow-hidden">
          {destination.image_url ? (
            <img
              src={destination.image_url}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ivory/40">
              <MapPin className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-all focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and tags in header */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center space-x-2 text-xs font-semibold text-gold mb-1">
              <span>{destination.region}</span>
              {destination.district && <span>• {destination.district}</span>}
              {destination.verification_status === "verified" && (
                <span className="bg-emerald-600/80 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {displayName}
            </h2>
            {language !== "kn" && destination.kn && (
              <p className="text-ivory/80 text-sm font-medium">{destination.kn}</p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-ivory/70 rounded-xl border border-gold/20 text-xs text-charcoal">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-forest" />
              <div>
                <p className="text-[10px] text-gray-500">Visit Duration</p>
                <p className="font-semibold">{Math.round(destination.visit_minutes / 60)} hrs</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-forest" />
              <div>
                <p className="text-[10px] text-gray-500">Indicative Entry</p>
                <p className="font-semibold">{destination.entry_fee_inr ? `₹${destination.entry_fee_inr}` : "Free / Included"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Accessibility className="w-4 h-4 text-forest" />
              <div>
                <p className="text-[10px] text-gray-500">Step-free</p>
                <p className="font-semibold">{destination.step_free ? "Yes (Accessible)" : "Steps / Uneven"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CloudSun className="w-4 h-4 text-forest" />
              <div>
                <p className="text-[10px] text-gray-500">Best Season</p>
                <p className="font-semibold">{destination.best_season || "Oct - Mar"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-forest uppercase tracking-wider mb-1">
              Overview
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {displayDesc}
            </p>
          </div>

          {/* Cultural Notes */}
          {destination.cultural_notes && (
            <div className="p-4 bg-amber-50/60 border-l-4 border-gold rounded-r-lg">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                Authentic Heritage & Cultural Significance
              </h3>
              <p className="text-xs leading-relaxed text-amber-950">
                {destination.cultural_notes}
              </p>
            </div>
          )}

          {/* Sourced Reference */}
          {destination.source_url && (
            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Source: {destination.source_title || "Official Tourism Database"}</span>
              </div>
              <a
                href={destination.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest hover:text-gold flex items-center space-x-1 font-medium transition"
              >
                <span>Official Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
          {onLockToggle && isDay ? (
            <button
              onClick={() => onLockToggle(destId)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                isLocked
                  ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLocked ? "Stop Locked (Preserved)" : "Lock This Stop"}</span>
            </button>
          ) : (
            <span className="text-xs text-gray-400">Regional Destination</span>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-forest text-ivory text-xs font-semibold rounded-lg hover:bg-forest/90 transition"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};
