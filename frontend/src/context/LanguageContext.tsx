import React, { createContext, useContext, useState, useEffect } from "react";
import type { Language } from "../types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    brand: "Karnataka Yatra AI",
    tagline: "Discover Karnataka. Experience More. Travel Smarter.",
    nav_home: "Home",
    nav_plan: "Plan Trip",
    nav_explore: "Explore",
    nav_map: "Interactive Map",
    nav_budget: "Budget",
    nav_assistant: "AI Assistant",
    nav_my_trips: "My Trips",
    nav_admin: "Admin",

    // Home
    hero_title: "Discover Karnataka. Experience More. Travel Smarter.",
    hero_subtitle: "Culturally authentic, budget-optimized journeys across the heritage, coasts, and rainforests of Karnataka.",
    plan_my_journey: "Plan My Journey",
    voice_assistant_btn: "Plan with Voice",
    explore_destinations: "Explore Destinations",
    featured_places: "Featured Heritage & Wonders",
    regional_title: "Explore Karnataka's Distinct Regions",
    regional_desc: "From the golden Arabian sands to mist-shrouded Western Ghats and majestic Chalukyan rock caves.",
    benefits_title: "Why Karnataka Yatra AI?",
    benefit_1_title: "Culturally Grounded RAG",
    benefit_1_desc: "Verified historical citations directly from ASI and Department of Tourism, free of generic AI hallucinations.",
    benefit_2_title: "Deterministic Budgeting",
    benefit_2_desc: "Exact road-factored fuel costs, realistic homestay rates, and transparent entry fees.",
    benefit_3_title: "Bilingual Accessibility",
    benefit_3_desc: "Native Kannada and English voice and text interactions with step-free accessibility filters.",

    // Planner
    planner_title: "AI Journey Planner",
    planner_subtitle: "Custom-crafted itineraries matching your pace, budget, and cultural interests.",
    origin_label: "Starting Point (Origin)",
    duration_label: "Duration (Days)",
    travellers_label: "Travellers",
    budget_label: "Total Budget (INR)",
    travel_style_label: "Travel Pace",
    style_relaxed: "Relaxed (1-2 stops/day)",
    style_moderate: "Balanced (2 stops/day)",
    style_fast: "Explorer (Full days)",
    interests_label: "Interests & Themes",
    step_free_label: "Step-free / Wheelchair accessible routes only",
    locked_stops_label: "Must-Visit Destinations (Lock in plan)",
    generate_btn: "Generate Itinerary",
    generating_btn: "Crafting Your Karnataka Journey...",

    // Itinerary Results
    itinerary_title: "Your Tailored Itinerary",
    total_est_cost: "Total Estimated Cost",
    remaining_balance: "Remaining Budget",
    budget_healthy: "Within Budget",
    budget_exceeded: "Budget Overrun",
    day: "Day",
    visit_duration: "Visit Duration",
    drive_time: "Drive Time",
    lock_stop: "Lock Stop",
    unlock_stop: "Unlock",
    replace_stop: "Replace Stop",
    learn_more: "Cultural Evidence",
    save_trip: "Save Trip",
    replan_trip: "Replan Trip",
    export_trip: "Export Summary",
    view_on_map: "View On Map",

    // Common
    verified_badge: "Verified Sourced",
    step_free_badge: "Step-Free Accessible",
    inr: "₹",
    close: "Close"
  },
  kn: {
    // Nav
    brand: "ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI",
    tagline: "ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ. ಹೊಸ ಅನುಭವ ಪಡೆಯಿರಿ. ಸ್ಮಾರ್ಟ್ ಆಗಿ ಪ್ರಯಾಣಿಸಿ.",
    nav_home: "ಮುಖಪುಟ",
    nav_plan: "ಪ್ರವಾಸ ಯೋಜನೆ",
    nav_explore: "ತಾಣಗಳ ಅನ್ವೇಷಣೆ",
    nav_map: "ನಕ್ಷೆ",
    nav_budget: "ಬಜೆಟ್",
    nav_assistant: "AI ಸಹಾಯಕ",
    nav_my_trips: "ನನ್ನ ಪ್ರವಾಸಗಳು",
    nav_admin: "ನಿರ್ವಾಹಕ",

    // Home
    hero_title: "ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ. ಅನುಭವ ಪಡೆಯಿರಿ. ಸ್ಮಾರ್ಟ್ ಆಗಿ ಪ್ರಯಾಣಿಸಿ.",
    hero_subtitle: "ಕರ್ನಾಟಕದ ಐತಿಹಾಸಿಕ ಪರಂಪರೆ, ಕಡಲತೀರಗಳು ಮತ್ತು ಮಲೆನಾಡಿನ ಮಂಜಿನ ಬೆಟ್ಟಗಳ ಅತ್ಯುತ್ತಮ ಪ್ರವಾಸ ಮಾರ್ಗದರ್ಶಿ.",
    plan_my_journey: "ಪ್ರವಾಸ ರೂಪಿಸಿ",
    voice_assistant_btn: "ಧ್ವನಿ ಮೂಲಕ ಯೋಜನೆ",
    explore_destinations: "ತಾಣಗಳನ್ನು ನೋಡಿ",
    featured_places: "ಪ್ರಮುಖ ತಾಣಗಳು ಮತ್ತು ವಿಸ್ಮಯಗಳು",
    regional_title: "ಕರ್ನಾಟಕದ ವಿಶಿಷ್ಟ ಪ್ರಾಂತ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    regional_desc: "ಕರಾವಳಿಯ ಬಂಗಾರದ ಮರಳಿನಿಂದ ಹಿಡಿದು, ಮಲೆನಾಡಿನ ಹಸಿರು ಬೆಟ್ಟಗಳು ಹಾಗೂ ಬಾದಾಮಿ, ಹಂಪಿಯ ಕಲ್ಲಿನ ಕಲೆಯವರೆಗೆ.",
    benefits_title: "ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI ವಿಶೇಷತೆಗಳೇನು?",
    benefit_1_title: "ಅಧಿಕೃತ ಸಾಂಸ್ಕೃತಿಕ ಮಾಹಿತಿ",
    benefit_1_desc: "ಪುರಾತತ್ವ ಇಲಾಖೆ ಹಾಗೂ ಪ್ರವಾಸೋದ್ಯಮ ಇಲಾಖೆಯ ಅಧಿಕೃತ ಮೂಲಗಳ ಆಧಾರಿತ ಮಾಹಿತಿ.",
    benefit_2_title: "ನಿಖರ ಬಜೆಟ್ ಲೆಕ್ಕಾಚಾರ",
    benefit_2_desc: "ರಸ್ತೆ ದೂರಕ್ಕೆ ತಕ್ಕ ಇಂಧನ ವೆಚ್ಚ, ವಾಸ್ತವ್ಯ ಹಾಗೂ ಪ್ರವೇಶ ಶುಲ್ಕಗಳ ಪಾರದರ್ಶಕ ಅಂದಾಜು.",
    benefit_3_title: "ಕನ್ನಡದಲ್ಲೇ ಧ್ವನಿ ಮತ್ತು ಸಂವಹನ",
    benefit_3_desc: "ಸಂಪೂರ್ಣ ಕನ್ನಡ ಭಾಷಾ ಬೆಂಬಲ ಹಾಗೂ ವೀಲ್‌ಚೇರ್ ಸ್ನೇಹಿ ಪ್ರವಾಸ ಶೋಧನೆ.",

    // Planner
    planner_title: "AI ಪ್ರವಾಸ ಯೋಜಕ",
    planner_subtitle: "ನಿಮ್ಮ ಬಜೆಟ್, ಆಸಕ್ತಿ ಮತ್ತು ಸಮಯಕ್ಕೆ ತಕ್ಕಂತೆ ಕಸ್ಟಮ್ ಪ್ರವಾಸ ಪಟ್ಟಿ ಸಿದ್ಧಪಡಿಸಿ.",
    origin_label: "ಪ್ರಾರಂಭಿಕ ಊರು",
    duration_label: "ದಿನಗಳ ಸಂಖ್ಯೆ",
    travellers_label: "ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ",
    budget_label: "ಒಟ್ಟು ಬಜೆಟ್ (ರೂ.)",
    travel_style_label: "ಪ್ರವಾಸ ಶೈಲಿ",
    style_relaxed: "ಶಾಂತ (ದಿನಕ್ಕೆ ೧-೨ ತಾಣ)",
    style_moderate: "ಮಧ್ಯಮ (ದಿನಕ್ಕೆ ೨ ತಾಣ)",
    style_fast: "ವೇಗದ ಪರಿಶೋಧನೆ",
    interests_label: "ಆಸಕ್ತಿಯ ಕ್ಷೇತ್ರಗಳು",
    step_free_label: "ವೀಲ್‌ಚೇರ್ / ಮೆಟ್ಟಿಲು ರಹಿತ ಸುಲಭ ಪ್ರವೇಶ ತಾಣಗಳು ಮಾತ್ರ",
    locked_stops_label: "ಖಡ್ಡಾಯವಾಗಿ ಭೇಟಿ ನೀಡಬೇಕಾದ ಸ್ಥಳಗಳು (ಲಾಕ್ ಮಾಡಿ)",
    generate_btn: "ಪ್ರವಾಸ ಪಟ್ಟಿ ರಚಿಸಿ",
    generating_btn: "ಪ್ರವಾಸ ಸಿದ್ಧಗೊಳ್ಳುತ್ತಿದೆ...",

    // Itinerary Results
    itinerary_title: "ನಿಮ್ಮ ವಿಶೇಷ ಪ್ರವಾಸ ಪಟ್ಟಿ",
    total_est_cost: "ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ",
    remaining_balance: "ಉಳಿದ ಬಜೆಟ್",
    budget_healthy: "ಬಜೆಟ್ ಮಿತಿಯಲ್ಲಿದೆ",
    budget_exceeded: "ಬಜೆಟ್ ಮೀರಿದೆ",
    day: "ದಿನ",
    visit_duration: "ಭೇಟಿ ಸಮಯ",
    drive_time: "ಪ್ರಯಾಣ ಸಮಯ",
    lock_stop: "ಸ್ಥಳ ಲಾಕ್ ಮಾಡಿ",
    unlock_stop: "ಅನ್‌ಲಾಕ್",
    replace_stop: "ಸ್ಥಳ ಬದಲಾಯಿಸಿ",
    learn_more: "ಇತಿಹಾಸ ಮತ್ತು ಮೂಲ",
    save_trip: "ಪ್ರವಾಸ ಉಳಿಸಿ",
    replan_trip: "ಮರು ಯೋಜನೆ",
    export_trip: "ಪ್ರವಾಸ ರಫ್ತು",
    view_on_map: "ನಕ್ಷೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ",

    // Common
    verified_badge: "ಪರಿಶೀಲಿತ ಮೂಲ",
    step_free_badge: "ಸುಲಭ ಪ್ರವೇಶ",
    inr: "₹",
    close: "ಮುಚ್ಚಿ"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("karnataka_yatra_lang") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("karnataka_yatra_lang", lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "kn" : "en");
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
