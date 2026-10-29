import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Compass, ShieldCheck, Heart, ExternalLink, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-forest text-ivory/80 border-t border-forest/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <Compass className="w-6 h-6 text-gold" />
              <span className="text-xl font-bold text-ivory">
                {language === "kn" ? "ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI" : "Karnataka Yatra AI"}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-ivory/70">
              {t("tagline")}
            </p>
            <p className="text-[11px] text-ivory/60">
              Built for National Technology Hackathon. Grounded in authentic Karnataka regional culture, deterministic cost modeling, and Kannada accessibility.
            </p>
          </div>

          {/* Column 2: Regions of Karnataka */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-gold mb-3">
              {language === "kn" ? "ಪ್ರಮುಖ ಪ್ರಾಂತ್ಯಗಳು" : "Explore Regions"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/explore?region=Coastal" className="hover:text-gold transition">Coastal Karnataka (ಕರಾವಳಿ)</Link></li>
              <li><Link to="/explore?region=Malnad" className="hover:text-gold transition">Malnad Ghats (ಮಲೆನಾಡು)</Link></li>
              <li><Link to="/explore?region=Old+Mysore" className="hover:text-gold transition">Old Mysore (ಹಳೆಯ ಮೈಸೂರು)</Link></li>
              <li><Link to="/explore?region=North+Karnataka" className="hover:text-gold transition">North Karnataka (ಉತ್ತರ ಕರ್ನಾಟಕ)</Link></li>
              <li><Link to="/explore?region=Hoysala" className="hover:text-gold transition">Hoysala Heritage (ಹೊಯ್ಸಳ ನಾಡು)</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform Tools */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-gold mb-3">
              {language === "kn" ? "ವೇದಿಕೆಯ ಸೌಲಭ್ಯಗಳು" : "Platform Features"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/planner" className="hover:text-gold transition">AI Itinerary Generator</Link></li>
              <li><Link to="/map" className="hover:text-gold transition">Interactive Route Visualizer</Link></li>
              <li><Link to="/budget" className="hover:text-gold transition">Deterministic Budget Dashboard</Link></li>
              <li><Link to="/assistant" className="hover:text-gold transition">Kannada & English Voice AI</Link></li>
              <li><Link to="/admin" className="hover:text-gold transition">Data Verification Portal</Link></li>
            </ul>
          </div>

          {/* Column 4: Official Attributions & Verification */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-gold mb-3">
              {language === "kn" ? "ಅಧಿಕೃತ ಮೂಲಗಳು" : "Verified Sources"}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://karnatakatourism.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-gold transition"
                >
                  <span>Karnataka Tourism (KSTDC)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://asi.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-gold transition"
                >
                  <span>Archaeological Survey of India</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://whc.unesco.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-gold transition"
                >
                  <span>UNESCO World Heritage</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li className="pt-2 text-[11px] text-ivory/60 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All facts citation-verified; no synthetic pricing claims.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-forest/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50">
          <p>© {new Date().getFullYear()} Karnataka Yatra AI. Crafted with cultural pride for Karnataka.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
