import React from "react";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext";
import { TripProvider } from "../context/TripContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

// Pages
import Home from "../pages/Home";
import Planner from "../pages/Planner";
import ItineraryView from "../pages/ItineraryView";
import Explore from "../pages/Explore";
import MapView from "../pages/MapView";
import BudgetDashboard from "../pages/BudgetDashboard";
import Assistant from "../pages/Assistant";
import MyTrips from "../pages/MyTrips";
import Admin from "../pages/Admin";
import WebstrappingStudio from "../pages/WebstrappingStudio";
import FoodExplorer from "../pages/FoodExplorer";
import TransportExplorer from "../pages/TransportExplorer";

export default function App() {
  return (
    <LanguageProvider>
      <TripProvider>
        <div className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans selection:bg-gold/30 selection:text-forest">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/itinerary" element={<ItineraryView />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/budget" element={<BudgetDashboard />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/webstrapping" element={<WebstrappingStudio />} />
              <Route path="/ai-webstrapping" element={<WebstrappingStudio />} />
              <Route path="/food" element={<FoodExplorer />} />
              <Route path="/transport" element={<TransportExplorer />} />
              <Route path="/stays" element={<TransportExplorer />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </TripProvider>
    </LanguageProvider>
  );
}
