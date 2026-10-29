import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTrip } from "../context/TripContext";
import { useLanguage } from "../context/LanguageContext";
import { listDestinations } from "../services/api";
import type { Destination, PlanDay } from "../types";
import {
  Compass,
  MapPin,
  Clock,
  Car,
  Layers,
  ArrowRight,
  Maximize2,
  Calendar,
  Sparkles
} from "lucide-react";

// Component to dynamically fit bounds of the map to the itinerary
function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords.map((c) => L.latLng(c[0], c[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [coords, map]);
  return null;
}

// Custom modern SVG marker factory
function createCustomMarker(number: number | string, isOrigin: boolean = false, isSelected: boolean = false) {
  const bg = isOrigin ? "#B8924A" : isSelected ? "#059669" : "#1F4D3A";
  const border = isSelected ? "#FDE047" : "#FAF6EC";
  
  const html = `
    <div style="
      background-color: ${bg};
      border: 2px solid ${border};
      color: #FAF6EC;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      font-weight: bold;
      font-size: 11px;
      cursor: pointer;
    ">
      <span style="transform: rotate(45deg);">${number}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-leaflet-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });
}

export default function MapView() {
  const { currentPlan, selectedStopId, setSelectedStopId } = useTrip();
  const { language } = useLanguage();

  const [allDests, setAllDests] = useState<Destination[]>([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | "all">("all");
  const [activeStop, setActiveStop] = useState<PlanDay | null>(null);

  useEffect(() => {
    async function loadFallbackDests() {
      if (!currentPlan) {
        try {
          const res = await listDestinations({ size: 30 });
          setAllDests(res.items);
        } catch (e) {
          console.error(e);
        }
      }
    }
    loadFallbackDests();
  }, [currentPlan]);

  // Set active stop if selected from context
  useEffect(() => {
    if (currentPlan && selectedStopId) {
      const match = currentPlan.days.find((d) => d.stop === selectedStopId);
      if (match) setActiveStop(match);
    }
  }, [currentPlan, selectedStopId]);

  // Determine markers & route points
  let markers: Array<{
    id: string;
    lat: number;
    lon: number;
    title: string;
    label: string | number;
    isOrigin: boolean;
    dayObj?: PlanDay;
  }> = [];

  let routePolyline: [number, number][] = [];

  if (currentPlan) {
    // Add Origin
    markers.push({
      id: currentPlan.origin.id,
      lat: currentPlan.origin.lat,
      lon: currentPlan.origin.lon,
      title: `${currentPlan.origin.name} (Origin)`,
      label: "★",
      isOrigin: true
    });
    routePolyline.push([currentPlan.origin.lat, currentPlan.origin.lon]);

    // Add Plan Days (filtered if day filter selected)
    currentPlan.days.forEach((d) => {
      if (selectedDayFilter === "all" || selectedDayFilter === d.day) {
        markers.push({
          id: d.stop,
          lat: d.lat,
          lon: d.lon,
          title: `Day ${d.day}: ${d.name}`,
          label: d.day,
          isOrigin: false,
          dayObj: d
        });
      }
      routePolyline.push([d.lat, d.lon]);
    });
  } else {
    // Fallback: Show all seeded Karnataka markers
    markers = allDests.map((d, i) => ({
      id: d.id,
      lat: d.lat,
      lon: d.lon,
      title: d.name,
      label: i + 1,
      isOrigin: false
    }));
  }

  const allCoords = markers.map((m) => [m.lat, m.lon] as [number, number]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header & Day Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-gold mb-1">
            <Compass className="w-4 h-4 text-forest" />
            <span>Karnataka Geospatial Route Visualizer</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-forest">
            {currentPlan
              ? `${currentPlan.origin.name} → ${currentPlan.days.length}-Day Expedition Map`
              : "Karnataka Heritage & Regional Map"}
          </h1>
        </div>

        {/* Day Filters */}
        {currentPlan && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedDayFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDayFilter === "all"
                  ? "bg-forest text-ivory shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Days
            </button>
            {currentPlan.days.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDayFilter(d.day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedDayFilter === d.day
                    ? "bg-forest text-ivory shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Day {d.day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Leaflet Map Box */}
        <div className="lg:col-span-3 h-[580px] rounded-3xl overflow-hidden shadow-lg border border-gray-200 relative">
          <MapContainer
            center={[14.5, 75.8]}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Fit bounds automatically */}
            {allCoords.length > 0 && <FitBounds coords={allCoords} />}

            {/* Route Polylines */}
            {currentPlan && routePolyline.length > 1 && (
              <Polyline
                positions={routePolyline}
                pathOptions={{
                  color: "#1F4D3A",
                  weight: 4,
                  opacity: 0.8,
                  dashArray: "6, 6"
                }}
              />
            )}

            {/* Markers */}
            {markers.map((m) => {
              const isSelected = activeStop && activeStop.stop === m.id;
              return (
                <Marker
                  key={m.id}
                  position={[m.lat, m.lon]}
                  icon={createCustomMarker(m.label, m.isOrigin, !!isSelected)}
                  eventHandlers={{
                    click: () => {
                      if (m.dayObj) {
                        setActiveStop(m.dayObj);
                        setSelectedStopId(m.id);
                      }
                    }
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <p className="font-bold text-forest">{m.title}</p>
                      {m.dayObj && (
                        <>
                          <p className="text-gray-600 line-clamp-2 text-[11px]">
                            {m.dayObj.description}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            ~{Math.round(m.dayObj.visit_minutes / 60)}h exploration
                          </p>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Stop / Route Leg Sidebar Drawer */}
        <div className="lg:col-span-1 space-y-4">
          {activeStop ? (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md space-y-4 animate-fadeIn">
              <div className="relative h-32 rounded-xl overflow-hidden bg-forest">
                {activeStop.image_url ? (
                  <img
                    src={activeStop.image_url}
                    alt={activeStop.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <MapPin className="w-8 h-8" />
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-forest text-ivory text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Day {activeStop.day} Stop
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">
                  {activeStop.region}
                </span>
                <h3 className="font-bold text-base text-charcoal">
                  {language === "kn" && activeStop.kn ? activeStop.kn : activeStop.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-3 mt-1 leading-relaxed">
                  {language === "kn" && activeStop.description_kn
                    ? activeStop.description_kn
                    : activeStop.description}
                </p>
              </div>

              <div className="space-y-2 text-xs text-gray-600 border-t pt-3">
                <div className="flex items-center justify-between">
                  <span>Visit Duration:</span>
                  <span className="font-semibold text-charcoal">
                    {Math.round(activeStop.visit_minutes / 60)} hrs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Drive Transit:</span>
                  <span className="font-semibold text-charcoal">
                    {activeStop.travel_hours} hrs (~{activeStop.distance_km} km)
                  </span>
                </div>
                {activeStop.entry_fee_inr > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Entry Fee:</span>
                    <span className="font-semibold text-charcoal">₹{activeStop.entry_fee_inr}</span>
                  </div>
                )}
              </div>

              <Link
                to="/itinerary"
                className="w-full py-2 bg-forest text-ivory text-xs font-semibold rounded-xl hover:bg-forest/90 transition flex items-center justify-center space-x-1"
              >
                <span>View Full Day Schedule</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center space-y-3">
              <MapPin className="w-10 h-10 text-forest/40 mx-auto" />
              <h3 className="font-bold text-sm text-charcoal">Interactive Map</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Click on any marker pin along the route to inspect day schedules, driving duration, and historical notes.
              </p>
              {!currentPlan && (
                <Link
                  to="/planner"
                  className="inline-block mt-2 px-4 py-2 bg-forest text-ivory text-xs font-semibold rounded-lg hover:bg-forest/90 transition"
                >
                  Generate Route
                </Link>
              )}
            </div>
          )}

          {/* Map Legend */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2 text-xs">
            <h4 className="font-bold text-charcoal text-[11px] uppercase tracking-wider">
              Legend
            </h4>
            <div className="space-y-1.5 text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-gold border border-white shrink-0" />
                <span>Trip Origin City (★)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-forest border border-white shrink-0" />
                <span>Scheduled Daily Stop (1, 2, 3...)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-forest shrink-0" />
                <span>Road Transit Corridor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
