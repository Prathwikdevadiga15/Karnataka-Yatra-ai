import React, { useState, useEffect } from "react";
import { getAdminDestinations, updateAdminDestination, listFeedback } from "../services/api";
import type { FeedbackItem } from "../types";
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Star,
  Save,
  MessageSquare,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export default function Admin() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"destinations" | "feedback">("destinations");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable coordinates state
  const [editCoords, setEditCoords] = useState<Record<string, { lat: number; lon: number; status: string }>>({});

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [dests, fbs] = await Promise.all([
          getAdminDestinations(),
          listFeedback()
        ]);
        setDestinations(dests);
        setFeedbacks(fbs);

        const initialCoords: Record<string, { lat: number; lon: number; status: string }> = {};
        dests.forEach((d) => {
          initialCoords[d.id] = {
            lat: d.latitude,
            lon: d.longitude,
            status: d.verification_status
          };
        });
        setEditCoords(initialCoords);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleUpdate = async (destId: string) => {
    const payload = editCoords[destId];
    if (!payload) return;

    try {
      setSavingId(destId);
      await updateAdminDestination(destId, {
        latitude: payload.lat,
        longitude: payload.lon,
        verification_status: payload.status
      });
      setSuccessMsg(`Updated destination ${destId}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      alert("Failed to update destination.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gold mb-1">
            <ShieldAlert className="w-4 h-4 text-forest" />
            <span>Administrative Governance Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-forest">
            Karnataka Tourism Data & Verification Panel
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("destinations")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "destinations"
                ? "bg-white text-forest shadow-sm"
                : "text-gray-600 hover:text-charcoal"
            }`}
          >
            Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === "feedback"
                ? "bg-white text-forest shadow-sm"
                : "text-gray-600 hover:text-charcoal"
            }`}
          >
            Feedback Logs ({feedbacks.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-500 flex flex-col items-center">
          <RefreshCw className="w-6 h-6 animate-spin text-forest mb-2" />
          <span>Loading administrative records...</span>
        </div>
      ) : activeTab === "destinations" ? (
        /* Destinations Table */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Destination Coordinates & Source Verification
            </h3>
            <span className="text-[11px] text-gray-500">
              Direct database updates via ORM
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b text-gray-500 text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-4">Destination</th>
                  <th className="p-4">Region / District</th>
                  <th className="p-4">Latitude</th>
                  <th className="p-4">Longitude</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {destinations.map((d) => {
                  const editState = editCoords[d.id] || {
                    lat: d.latitude,
                    lon: d.longitude,
                    status: d.verification_status
                  };
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-charcoal">
                        {d.name}
                        <span className="block text-[10px] text-gray-400 font-normal">
                          id: {d.id}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {d.region} • {d.district}
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          step="0.0001"
                          value={editState.lat}
                          onChange={(e) =>
                            setEditCoords({
                              ...editCoords,
                              [d.id]: { ...editState, lat: parseFloat(e.target.value) || 0 }
                            })
                          }
                          className="w-24 p-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-forest"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          step="0.0001"
                          value={editState.lon}
                          onChange={(e) =>
                            setEditCoords({
                              ...editCoords,
                              [d.id]: { ...editState, lon: parseFloat(e.target.value) || 0 }
                            })
                          }
                          className="w-24 p-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-forest"
                        />
                      </td>
                      <td className="p-4">
                        <select
                          value={editState.status}
                          onChange={(e) =>
                            setEditCoords({
                              ...editCoords,
                              [d.id]: { ...editState, status: e.target.value }
                            })
                          }
                          className="p-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-forest bg-white"
                        >
                          <option value="verified">Verified (Official)</option>
                          <option value="unverified_seed">Unverified Seed</option>
                          <option value="community">Community Reported</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          disabled={savingId === d.id}
                          onClick={() => handleUpdate(d.id)}
                          className="px-3 py-1 bg-forest text-ivory text-xs font-semibold rounded-lg hover:bg-forest/90 transition disabled:opacity-50 inline-flex items-center space-x-1"
                        >
                          <Save className="w-3 h-3 text-gold" />
                          <span>{savingId === d.id ? "Saving..." : "Save"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Feedback Logs */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-forest">
              Traveler Feedback & Quality Reviews
            </h3>
            <span className="text-xs text-gray-400">Total logged: {feedbacks.length}</span>
          </div>

          {feedbacks.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">
              No feedback entries logged yet. Users can submit ratings from their itinerary view.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {feedbacks.map((fb, idx) => (
                <div key={idx} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-charcoal capitalize">
                        {fb.category}
                      </span>
                    </div>

                    {fb.created_at && (
                      <span className="text-[10px] text-gray-400">
                        {new Date(fb.created_at).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed italic">
                    "{fb.comment || "No written remarks provided."}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
