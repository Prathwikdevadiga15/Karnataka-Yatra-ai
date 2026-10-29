import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import { useLanguage } from "../context/LanguageContext";
import {
  PieChart,
  IndianRupee,
  Car,
  Home,
  Utensils,
  Ticket,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  Users
} from "lucide-react";

export default function BudgetDashboard() {
  const { currentPlan } = useTrip();
  const { language } = useLanguage();

  const [simulatedTravellers, setSimulatedTravellers] = useState(
    currentPlan ? currentPlan.travellers : 2
  );

  if (!currentPlan) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <PieChart className="w-16 h-16 text-forest/40 mx-auto" />
        <h2 className="text-xl font-bold text-charcoal">No Active Trip Budget</h2>
        <p className="text-xs text-gray-500">
          Generate an itinerary to view deterministic budget modeling and cost trade-offs.
        </p>
        <Link
          to="/planner"
          className="inline-block px-6 py-2.5 bg-forest text-ivory text-xs font-bold rounded-xl hover:bg-forest/90 transition shadow-md"
        >
          Plan A Journey
        </Link>
      </div>
    );
  }

  const { budget, legs, duration_days } = currentPlan;
  const transportVal = Number(budget.transport);
  const stayFoodVal = Number(budget.stay_food_local);
  const entryVal = Number(budget.entry_fees || 0);
  const localTransitVal = Number(budget.local_transit || 0);
  const contingencyVal = Number(budget.contingency);
  const totalVal = Number(budget.total);
  const targetBudget = currentPlan.target_budget;

  // Multiplier for simulated group size
  const scale = simulatedTravellers / currentPlan.travellers;
  const simTotal = transportVal + (stayFoodVal + entryVal + localTransitVal) * scale + contingencyVal * scale;
  const simPerPerson = simTotal / simulatedTravellers;

  // Percentage shares
  const pTransport = Math.round((transportVal / totalVal) * 100);
  const pStayFood = Math.round((stayFoodVal / totalVal) * 100);
  const pEntry = Math.round((entryVal / totalVal) * 100);
  const pContingency = Math.round((contingencyVal / totalVal) * 100);

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-gold">
          <PieChart className="w-4 h-4 text-forest" />
          <span>Deterministic Financial Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-forest">
          Trip Budget & Expense Optimizer
        </h1>
        <p className="text-xs text-gray-600 max-w-2xl">
          Transparent, categorized expense modeling distinguishing road fuel, verified monument fees, and indicative regional hospitality rates.
        </p>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Allocated Budget</p>
            <p className="text-2xl font-extrabold text-charcoal">
              ₹{targetBudget.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              ₹{(targetBudget / currentPlan.travellers).toLocaleString("en-IN")} per person target
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Estimated Total Cost</p>
            <p className="text-2xl font-extrabold text-forest">
              ₹{totalVal.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Includes 10% emergency contingency buffer
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Budget Health</p>
            <p
              className={`text-2xl font-extrabold ${
                budget.remaining_budget >= 0 ? "text-emerald-700" : "text-red-600"
              }`}
            >
              ₹{Math.abs(budget.remaining_budget).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              {budget.remaining_budget >= 0 ? "Surplus remaining" : "Deficit (Over budget)"}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              budget.remaining_budget >= 0
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {budget.remaining_budget >= 0 ? "Healthy" : "Overrun"}
          </span>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-forest flex items-center space-x-2">
          <IndianRupee className="w-4 h-4 text-gold" />
          <span>Expense Categories Breakdown</span>
        </h2>

        {/* Visual Progress Bar */}
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden flex shadow-inner">
          <div style={{ width: `${pStayFood}%` }} className="bg-forest" title="Accommodation & Food" />
          <div style={{ width: `${pTransport}%` }} className="bg-amber-600" title="Fuel & Transport" />
          <div style={{ width: `${pEntry}%` }} className="bg-emerald-500" title="Entry & Monument Fees" />
          <div style={{ width: `${pContingency}%` }} className="bg-gray-400" title="Contingency" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Stay & Living */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center space-x-1.5 font-semibold text-charcoal">
                <Home className="w-4 h-4 text-forest" />
                <span>Stay & Dining</span>
              </span>
              <span className="font-bold text-forest">{pStayFood}%</span>
            </div>
            <p className="text-xl font-bold text-charcoal">
              ₹{stayFoodVal.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500">
              Indicative regional homestay & satvik/local dining rates.
            </p>
          </div>

          {/* Transport */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center space-x-1.5 font-semibold text-charcoal">
                <Car className="w-4 h-4 text-amber-600" />
                <span>Fuel & Transit</span>
              </span>
              <span className="font-bold text-amber-700">{pTransport}%</span>
            </div>
            <p className="text-xl font-bold text-charcoal">
              ₹{transportVal.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500">
              {legs.reduce((acc, l) => acc + l.distance_km, 0).toFixed(0)} km road corridor @ ₹12/km.
            </p>
          </div>

          {/* Entry Fees */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center space-x-1.5 font-semibold text-charcoal">
                <Ticket className="w-4 h-4 text-emerald-600" />
                <span>Entry & Activities</span>
              </span>
              <span className="font-bold text-emerald-700">{pEntry}%</span>
            </div>
            <p className="text-xl font-bold text-charcoal">
              ₹{entryVal.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500">
              Verified ASI & Karnataka Tourism monument tickets.
            </p>
          </div>

          {/* Contingency */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center space-x-1.5 font-semibold text-charcoal">
                <ShieldAlert className="w-4 h-4 text-gray-500" />
                <span>10% Contingency</span>
              </span>
              <span className="font-bold text-gray-600">{pContingency}%</span>
            </div>
            <p className="text-xl font-bold text-charcoal">
              ₹{contingencyVal.toLocaleString("en-IN")}
            </p>
            <p className="text-[10px] text-gray-500">
              Safety cushion for toll booths, emergencies & parking.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Group Size Simulator */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-forest flex items-center space-x-2">
              <Users className="w-4 h-4 text-gold" />
              <span>Group Size Cost Simulator</span>
            </h3>
            <p className="text-xs text-gray-500">
              See how adding travellers distributes shared road fuel and reduces per-person expense.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-charcoal">
              Simulate: {simulatedTravellers} Travellers
            </span>
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={10}
          value={simulatedTravellers}
          onChange={(e) => setSimulatedTravellers(+e.target.value)}
          className="w-full accent-forest cursor-pointer"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-ivory rounded-xl border border-gold/20">
            <p className="text-[10px] text-gray-500">Simulated Total</p>
            <p className="text-base font-bold text-forest">₹{simTotal.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-3 bg-ivory rounded-xl border border-gold/20">
            <p className="text-[10px] text-gray-500">Per Person Cost</p>
            <p className="text-base font-bold text-forest">₹{simPerPerson.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-3 bg-ivory rounded-xl border border-gold/20 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-gray-500">Per-Person Savings vs Solo</p>
            <p className="text-base font-bold text-emerald-700">
              {simulatedTravellers > 1 ? `Save ~₹${((transportVal * (1 - 1 / simulatedTravellers))).toFixed(0)} on fuel` : "Standard solo rate"}
            </p>
          </div>
        </div>
      </div>

      {/* Cost Optimization Recommendations */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-3xl border border-emerald-200 space-y-3">
        <h3 className="text-sm font-bold text-emerald-950 flex items-center space-x-2">
          <TrendingDown className="w-4 h-4 text-emerald-700" />
          <span>Regional Budget Optimization Tips</span>
        </h3>
        <ul className="text-xs text-emerald-900 space-y-2 list-disc pl-5">
          <li>
            <strong>Transit Optimization:</strong> Taking a KSRTC Rajahamsa/Airavat luxury bus for long stretches (e.g. Bengaluru to Hampi) cuts private cab transit costs by up to ₹4,500.
          </li>
          <li>
            <strong>Malnad Homestays:</strong> Opting for verified local coffee estate homestays in Coorg and Chikkamagaluru includes authentic home-cooked Malnad meals, reducing incidentals.
          </li>
          <li>
            <strong>Heritage Combination Passes:</strong> Sites like Hampi & Badami allow combined ASI day tickets for Indian nationals at ₹25-40 per complex.
          </li>
        </ul>
      </div>
    </div>
  );
}
