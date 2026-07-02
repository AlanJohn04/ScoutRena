"use client";
import React, { useState } from "react";
import { mockCandidates } from "@/data/mock-candidates";
import { Search, Eye, EyeOff, Sparkles, Trophy, TrendingUp, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function CandidateDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "best_now" | "best_future" | "hidden_gem" | "high_risk">("all");
  const [blindMode, setBlindMode] = useState<boolean>(true);

  // Search logic
  const filteredCandidates = mockCandidates.filter(c => {
    const query = searchTerm.toLowerCase();
    const matchesQuery = 
      c.name.toLowerCase().includes(query) || 
      c.role.toLowerCase().includes(query) || 
      c.college.toLowerCase().includes(query) ||
      c.skills.some(s => s.toLowerCase().includes(query));

    if (!matchesQuery) return false;

    // Apply advanced filter buttons
    if (activeFilter === "best_now") {
      return c.cpiDetails.technicalAbility >= 85;
    }
    if (activeFilter === "best_future") {
      return c.potentialScore >= 95;
    }
    if (activeFilter === "hidden_gem") {
      return c.potentialScore >= 90 && c.currentValue <= 4500;
    }
    if (activeFilter === "high_risk") {
      return c.growthRate >= 20 && c.riskScore !== "Low";
    }
    return true;
  });

  // Sort candidates depending on current filter
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (activeFilter === "best_now") {
      return b.cpiDetails.technicalAbility - a.cpiDetails.technicalAbility;
    }
    if (activeFilter === "best_future") {
      return b.potentialScore - a.potentialScore;
    }
    if (activeFilter === "hidden_gem") {
      return a.currentValue - b.currentValue; // lowest valuation first
    }
    return b.currentValue - a.currentValue;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#ff2020]/20 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <Search className="text-brand-blue w-6 h-6" />
            SCOUT & FILTER CONSOLE
          </h2>
          <p className="text-sm text-white/50 uppercase tracking-widest mt-1">Discover talent before anyone else, filtered by AI metrics</p>
        </div>
        
        {/* Blind mode switch */}
        <button
          onClick={() => setBlindMode(!blindMode)}
          className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-none bg-white/5 border border-[#ff2020]/30 hover:bg-white/10 text-sm font-bold text-white transition cursor-pointer"
        >
          {blindMode ? <Eye className="w-4 h-4 text-brand-blue" /> : <EyeOff className="w-4 h-4 text-brand-pink" />}
          {blindMode ? "Disable Blind Mode" : "Enable Blind Mode"}
        </button>
      </div>

      {/* Search and Advanced Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3.5 text-white/40 w-4.5 h-4.5" />
          <input
            type="text"
            placeholder="Search by name, skills, role, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-[#ff2020]/30 rounded-none pl-10 pr-4 py-3 text-base text-white focus:outline-none focus:border-brand-blue transition"
          />
        </div>

        {/* Sorting strategies */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`py-2 px-4 rounded-none text-sm font-bold cursor-pointer transition ${
              activeFilter === "all" ? "bg-white/10 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All Candidates
          </button>
          <button
            onClick={() => setActiveFilter("best_now")}
            className={`py-2 px-4 rounded-none text-sm font-bold cursor-pointer transition flex items-center gap-1 ${
              activeFilter === "best_now" ? "bg-brand-blue text-[#030616]" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> Best Now (Technical)
          </button>
          <button
            onClick={() => setActiveFilter("best_future")}
            className={`py-2 px-4 rounded-none text-sm font-bold cursor-pointer transition flex items-center gap-1 ${
              activeFilter === "best_future" ? "bg-brand-purple text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Best Future (Potential)
          </button>
          <button
            onClick={() => setActiveFilter("hidden_gem")}
            className={`py-2 px-4 rounded-none text-sm font-bold cursor-pointer transition flex items-center gap-1 ${
              activeFilter === "hidden_gem" ? "bg-brand-green text-[#030616]" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            ⭐ Hidden Gem
          </button>
          <button
            onClick={() => setActiveFilter("high_risk")}
            className={`py-2 px-4 rounded-none text-sm font-bold cursor-pointer transition flex items-center gap-1 ${
              activeFilter === "high_risk" ? "bg-brand-pink text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Rising Risk-Takers
          </button>
        </div>
      </div>

      {/* Grid of Results */}
      {sortedCandidates.length === 0 ? (
        <div className="text-center py-20 text-white/40 text-base terminal-panel">
          No candidates match your search query or sorting strategy.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCandidates.map((candidate) => {
            const isWinner = candidate.potentialScore >= 95;
            
            // Blind Mode translates
            const hashedName = `Scout #${candidate.id.split("-")[1].toUpperCase()}`;
            const displayName = blindMode ? hashedName : candidate.name;
            const displayAvatar = blindMode ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop" : candidate.avatar;
            const displayCollege = blindMode ? "Classified (Ivy Tier)" : candidate.college;

            return (
              <div key={candidate.id} className="terminal-panel p-6 flex flex-col justify-between relative group hover:border-brand-blue/30 transition">
                {/* Border highlight for top potential */}
                {isWinner && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-purple"></div>
                )}
                
                <div>
                  {/* Top info and score */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={displayAvatar} alt={displayName} className="w-12 h-12 rounded-none object-cover border border-[#ff2020]/20" />
                      <div>
                        <h4 className="font-extrabold text-white text-lg group-hover:text-brand-blue transition">{displayName}</h4>
                        <span className="text-xs text-white/40 block leading-tight">{displayCollege}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/40 block uppercase">Potential</span>
                      <span className="text-base font-bold text-brand-green">{candidate.potentialScore}</span>
                    </div>
                  </div>

                  <p className="text-sm text-brand-blue font-semibold uppercase tracking-wider mb-3">{candidate.role}</p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {candidate.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="py-1 px-2.5 bg-white/5 text-[10px] text-white/80 font-bold rounded">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="py-1 px-2.5 bg-white/5 text-[10px] text-white/40 font-bold rounded">
                        +{candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing and view buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-[#ff2020]/20 text-sm">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Valuation</span>
                    <span className="font-bold text-brand-amber mono-font">{candidate.currentValue.toLocaleString()} TT</span>
                  </div>
                  <Link
                    href={`/student/${candidate.id}`}
                    className="py-2 px-4 rounded-none bg-brand-blue hover:bg-brand-blue/90 text-[#030616] font-extrabold text-sm transition"
                  >
                    Bid / View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
