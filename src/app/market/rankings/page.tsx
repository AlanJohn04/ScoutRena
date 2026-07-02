"use client";
import React, { useState } from "react";
import { mockCandidates } from "@/data/mock-candidates";
import { Trophy, Shield, Award, Zap, Flame } from "lucide-react";
import Link from "next/link";

export default function RankingsLeaderboard() {
  const [activeTab, setActiveTab] = useState<"global" | "college" | "domain" | "rising">("global");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");

  // Ranks calculation
  const sortedGlobal = [...mockCandidates].sort((a, b) => b.cpi - a.cpi);
  const sortedValue = [...mockCandidates].sort((a, b) => b.currentValue - a.currentValue);
  const sortedRising = [...mockCandidates].sort((a, b) => b.growthRate - a.growthRate);

  // Group by college rankings
  const colleges = ["CUSAT", "IIT Madras", "VIT Vellore"];

  // Domains list
  const domains = ["All", "Blockchain Developer", "Machine Learning Engineer", "Fullstack Engineer", "DevOps Engineer"];

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 0: return "bg-gradient-to-r from-yellow-500 to-amber-600 text-[#030616]"; // Gold
      case 1: return "bg-gradient-to-r from-slate-300 to-slate-400 text-[#030616]"; // Silver
      case 2: return "bg-gradient-to-r from-amber-700 to-amber-900 text-white"; // Bronze
      default: return "bg-white/5 text-white/60";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#ff2020]/20 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <Trophy className="text-brand-amber w-6 h-6" />
            GLOBAL TALENT RANKINGS
          </h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Egoists Leaderboard across Colleges, Tech Domains, and Weekly Growth</p>
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <div className="flex gap-2 border-b border-[#ff2020]/20 pb-1">
        <button
          onClick={() => setActiveTab("global")}
          className={`py-2.5 px-6 rounded-t-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "global"
              ? "bg-white/5 border-b-2 border-brand-blue text-brand-blue"
              : "text-white/50 hover:text-white"
          }`}
        >
          Global Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("domain")}
          className={`py-2.5 px-6 rounded-t-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "domain"
              ? "bg-white/5 border-b-2 border-brand-blue text-brand-blue"
              : "text-white/50 hover:text-white"
          }`}
        >
          Domain Rankings
        </button>
        <button
          onClick={() => setActiveTab("college")}
          className={`py-2.5 px-6 rounded-t-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "college"
              ? "bg-white/5 border-b-2 border-brand-blue text-brand-blue"
              : "text-white/50 hover:text-white"
          }`}
        >
          College Rankings
        </button>
        <button
          onClick={() => setActiveTab("rising")}
          className={`py-2.5 px-6 rounded-t-lg text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "rising"
              ? "bg-white/5 border-b-2 border-brand-blue text-brand-blue"
              : "text-white/50 hover:text-white"
          }`}
        >
          Weekly Rising Stars
        </button>
      </div>

      {/* Tab Contents */}
      <div className="terminal-panel p-6">
        
        {/* Global tab */}
        {activeTab === "global" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Top Talent Ranked by CPI potential</h3>
            <div className="flex flex-col gap-2">
              {sortedGlobal.map((candidate, idx) => (
                <div key={candidate.id} className="flex items-center justify-between p-4 rounded-none bg-white/2 border border-[#ff2020]/20 hover:border-brand-blue/20 transition group">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-none flex items-center justify-center font-bold text-xs ${getRankBadgeColor(idx)}`}>
                      #{idx + 1}
                    </span>
                    <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-none object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-blue transition">{candidate.name}</h4>
                      <p className="text-[10px] text-white/40">{candidate.college} | {candidate.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block">CPI Score</span>
                      <span className="text-sm font-bold text-brand-green">{candidate.cpi}/100</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block">Market Value</span>
                      <span className="text-sm font-bold text-brand-blue mono-font">{candidate.currentValue} TT</span>
                    </div>
                    <Link 
                      href={`/student/${candidate.id}`}
                      className="py-1.5 px-4 rounded bg-white/5 hover:bg-brand-blue hover:text-[#030616] text-[10px] font-bold text-white transition"
                    >
                      VIEW PROFILE
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domain rankings */}
        {activeTab === "domain" && (
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 flex-wrap">
              {domains.map((dom) => (
                <button
                  key={dom}
                  onClick={() => setSelectedDomain(dom)}
                  className={`py-1.5 px-4 rounded-none text-[11px] font-bold cursor-pointer transition ${
                    selectedDomain === dom
                      ? "bg-brand-blue text-[#030616]"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {dom === "All" ? "All Domains" : dom}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {sortedValue
                .filter((c) => selectedDomain === "All" || c.role === selectedDomain)
                .map((candidate, idx) => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 rounded-none bg-white/2 border border-[#ff2020]/20 hover:border-brand-blue/20 transition group">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-none flex items-center justify-center font-bold text-xs bg-white/5 text-white/60`}>
                        #{idx + 1}
                      </span>
                      <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-none object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-blue transition">{candidate.name}</h4>
                        <p className="text-[10px] text-white/40">{candidate.college} | {candidate.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest block">Valuation</span>
                        <span className="text-sm font-bold text-brand-blue mono-font">{candidate.currentValue} TT</span>
                      </div>
                      <Link 
                        href={`/student/${candidate.id}`}
                        className="py-1.5 px-4 rounded bg-white/5 hover:bg-brand-blue hover:text-[#030616] text-[10px] font-bold text-white transition"
                      >
                        VIEW PROFILE
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* College rankings */}
        {activeTab === "college" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {colleges.map((college) => {
              const students = [...mockCandidates]
                .filter((c) => c.college === college)
                .sort((a, b) => b.cpi - a.cpi);

              return (
                <div key={college} className="p-4 rounded-none bg-white/2 border border-[#ff2020]/20 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-[#ff2020]/20 pb-2">
                    <Award className="text-brand-purple w-4.5 h-4.5" />
                    <h4 className="text-sm font-bold text-white">{college} Leaderboard</h4>
                  </div>

                  <div className="flex flex-col gap-2">
                    {students.map((student, idx) => (
                      <div key={student.id} className="flex items-center justify-between p-2 rounded-none bg-white/2 hover:bg-white/5 transition text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white/40">#{idx + 1}</span>
                          <span className="font-semibold text-white truncate max-w-[100px]">{student.name}</span>
                        </div>
                        <span className="text-brand-blue mono-font font-bold">{student.currentValue} TT</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rising stars */}
        {activeTab === "rising" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Flame className="text-brand-pink w-4 h-4" /> Top Movers this Week (Percentage Growth)
            </h3>
            <div className="flex flex-col gap-2">
              {sortedRising.map((candidate, idx) => (
                <div key={candidate.id} className="flex items-center justify-between p-4 rounded-none bg-white/2 border border-[#ff2020]/20 hover:border-brand-blue/20 transition group">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-none flex items-center justify-center font-bold text-xs bg-brand-pink/10 text-brand-pink">
                      +{candidate.growthRate}%
                    </span>
                    <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-none object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-brand-blue transition">{candidate.name}</h4>
                      <p className="text-[10px] text-white/40">{candidate.college} | {candidate.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block font-medium">Previous Value</span>
                      <span className="text-xs text-white/60 mono-font">
                        {Math.round(candidate.currentValue / (1 + candidate.growthRate / 100))} TT
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-widest block font-medium">New Value</span>
                      <span className="text-sm font-bold text-brand-blue mono-font">{candidate.currentValue} TT</span>
                    </div>
                    <Link 
                      href={`/student/${candidate.id}`}
                      className="py-1.5 px-4 rounded bg-white/5 hover:bg-brand-blue hover:text-[#030616] text-[10px] font-bold text-white transition"
                    >
                      VIEW PROFILE
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
