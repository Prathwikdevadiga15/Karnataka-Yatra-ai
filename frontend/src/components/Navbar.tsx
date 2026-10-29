import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTrip } from "../context/TripContext";
import {
  Compass,
  MapPin,
  Calendar,
  Layers,
  Map,
  PieChart,
  MessageSquare,
  BookmarkCheck,
  ShieldAlert,
  Globe,
  Menu,
  X,
  Sparkles
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { currentPlan } = useTrip();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/", label: t("nav_home"), icon: Compass },
    { to: "/planner", label: t("nav_plan"), icon: Calendar },
    { to: "/explore", label: t("nav_explore"), icon: Layers },
    { to: "/map", label: t("nav_map"), icon: Map },
    { to: "/budget", label: t("nav_budget"), icon: PieChart },
    { to: "/assistant", label: t("nav_assistant"), icon: MessageSquare },
    { to: "/trips", label: t("nav_my_trips"), icon: BookmarkCheck },
    { to: "/admin", label: t("nav_admin"), icon: ShieldAlert },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-forest text-ivory border-b border-forest/60 shadow-md backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none"
            aria-label="Karnataka Yatra AI Homepage"
          >
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-tight text-ivory">
                {language === "kn" ? "ಕರ್ನಾಟಕ ಯಾತ್ರಾ AI" : "Karnataka Yatra AI"}
              </span>
              <span className="text-[10px] text-gold/80 block uppercase tracking-widest font-semibold">
                Smarter Regional Travel
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    active
                      ? "bg-forest/80 text-gold border-b-2 border-gold shadow-inner"
                      : "text-ivory/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Active Trip Badge */}
            {currentPlan && (
              <Link
                to="/planner"
                className="hidden sm:flex items-center space-x-1.5 bg-gold/15 text-gold border border-gold/40 text-xs px-2.5 py-1 rounded-full hover:bg-gold/25 transition-colors"
                title="View active plan"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold">
                  {currentPlan.duration_days}d Plan Active
                </span>
              </Link>
            )}

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 bg-black/20 hover:bg-black/40 border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all text-ivory focus:ring-2 focus:ring-gold"
              aria-label="Toggle language between English and Kannada"
            >
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>{language === "en" ? "ಕನ್ನಡ" : "English"}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-ivory hover:bg-white/10 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-forest/98 border-t border-white/10 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium ${
                  active ? "bg-white/15 text-gold font-semibold" : "text-ivory/90 hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5 text-gold" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
