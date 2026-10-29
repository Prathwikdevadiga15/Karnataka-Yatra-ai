import React, { createContext, useContext, useState, useEffect } from "react";
import type { Plan, SavedTrip } from "../types";
import { listSavedTrips, saveTrip as apiSaveTrip, deleteTrip as apiDeleteTrip } from "../services/api";

interface TripContextType {
  currentPlan: Plan | null;
  setCurrentPlan: (plan: Plan | null) => void;
  savedTrips: SavedTrip[];
  reloadSavedTrips: () => Promise<void>;
  saveCurrentTrip: (title?: string) => Promise<string>;
  removeSavedTrip: (id: string) => Promise<void>;
  selectedStopId: string | null;
  setSelectedStopId: (id: string | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlanState] = useState<Plan | null>(() => {
    const cached = localStorage.getItem("karnataka_yatra_active_plan");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const setCurrentPlan = (plan: Plan | null) => {
    setCurrentPlanState(plan);
    if (plan) {
      localStorage.setItem("karnataka_yatra_active_plan", JSON.stringify(plan));
    } else {
      localStorage.removeItem("karnataka_yatra_active_plan");
    }
  };

  const reloadSavedTrips = async () => {
    try {
      const data = await listSavedTrips();
      setSavedTrips(data);
    } catch {
      // Local fallback
      const local = localStorage.getItem("karnataka_yatra_saved_trips");
      if (local) {
        setSavedTrips(JSON.parse(local));
      }
    }
  };

  useEffect(() => {
    reloadSavedTrips();
  }, []);

  const saveCurrentTrip = async (title?: string): Promise<string> => {
    if (!currentPlan) throw new Error("No active itinerary to save.");
    
    const tripTitle = title || `Karnataka Expedition (${currentPlan.duration_days} Days)`;
    try {
      const res = await apiSaveTrip({
        title: tripTitle,
        origin: currentPlan.origin.name,
        duration_days: currentPlan.duration_days,
        traveller_count: currentPlan.travellers,
        budget_inr: currentPlan.target_budget,
        plan: currentPlan
      });
      await reloadSavedTrips();
      return res.id;
    } catch {
      // Offline fallback
      const localTrip: SavedTrip = {
        id: "local-" + Date.now(),
        title: tripTitle,
        origin: currentPlan.origin.name,
        duration_days: currentPlan.duration_days,
        traveller_count: currentPlan.travellers,
        budget_inr: currentPlan.target_budget,
        created_at: new Date().toISOString(),
        plan: currentPlan
      };
      const updated = [localTrip, ...savedTrips];
      setSavedTrips(updated);
      localStorage.setItem("karnataka_yatra_saved_trips", JSON.stringify(updated));
      return localTrip.id;
    }
  };

  const removeSavedTrip = async (id: string) => {
    try {
      await apiDeleteTrip(id);
    } catch {
      // proceed to remove from local
    }
    const updated = savedTrips.filter(t => t.id !== id);
    setSavedTrips(updated);
    localStorage.setItem("karnataka_yatra_saved_trips", JSON.stringify(updated));
  };

  return (
    <TripContext.Provider
      value={{
        currentPlan,
        setCurrentPlan,
        savedTrips,
        reloadSavedTrips,
        saveCurrentTrip,
        removeSavedTrip,
        selectedStopId,
        setSelectedStopId
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
};
