"use client";
import React, { useState, useEffect } from "react";
import { mockMarketIndices, mockTransactions } from "@/data/mock-market";
import { useCandidates } from "@/hooks/useCandidates";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  Database,
  ShieldCheck,
  Zap 
} from "lucide-react";
import Link from "next/link";

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  
  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [value]);

  return <motion.span>{prefix}<motion.span>{rounded}</motion.span>{suffix}</motion.span>;
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function MarketTradingFloor() {
  const { candidates, loading } = useCandidates();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-indigo-300 font-semibold uppercase tracking-widest text-base">Loading Market Data...</div>;
  }

  // Calculate market cap stats
  const totalValuation = candidates.reduce((sum, c) => sum + c.currentValue, 0);
  const averagePotential = Math.round(
    candidates.reduce((sum, c) => sum + c.potentialScore, 0) / (candidates.length || 1)
  );
  
  // Sort candidates by growth rate to get rising stars
  const risingStars = [...candidates]
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-10 min-h-screen text-white p-6 relative overflow-hidden mono-font"
    >
      {/* Page Header - Terminal Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#ff2020]/30 pb-8 gap-6 z-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-widest flex items-center gap-3 uppercase glitch-hover">
            <Activity className="text-[#ff2020] w-6 h-6 animate-pulse" />
            [ LIVE_MARKET_TERMINAL ]
          </h2>
          <p className="text-sm text-[#888888] font-bold mt-1 tracking-widest uppercase">SYS_LOG: Real-time supply/demand metrics and candidate valuations</p>
        </div>
        <div className="flex items-center gap-8 border border-[#ff2020]/30 py-3 px-6 bg-black">
          <div className="text-right">
            <span className="text-xs text-[#ff2020] uppercase font-bold tracking-widest block mb-1">[TOTAL_CAP]</span>
            <p className="text-3xl font-bold text-white tracking-tight">
              <AnimatedCounter value={totalValuation * 10} suffix=" TT" />
            </p>
          </div>
          <div className="w-px h-10 bg-[#ff2020]/30"></div>
          <div className="text-right">
            <span className="text-xs text-[#ff2020] uppercase font-bold tracking-widest block mb-1">[AVG_POTENTIAL]</span>
            <p className="text-3xl font-bold text-white tracking-tight">
              <AnimatedCounter value={averagePotential} suffix="/100" />
            </p>
          </div>
        </div>
      </div>

      {/* Domain Indices & Multipliers */}
      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 z-10 border border-[#ff2020]/30"
      >
        {mockMarketIndices.map((idx, index) => (
          <motion.div variants={listItemVariants} key={idx.id} className={`p-6 flex flex-col justify-between hover:bg-[#ff2020]/10 transition-colors cursor-crosshair border-b lg:border-b-0 ${index !== mockMarketIndices.length - 1 ? 'lg:border-r border-[#ff2020]/30' : ''}`}>
            <div>
              <span className="text-xs text-[#ff2020] font-bold uppercase tracking-widest block mb-2">[ {idx.name} ]</span>
              <p className="text-4xl font-bold text-white tracking-tight transition-colors">
                <AnimatedCounter value={idx.multiplier} suffix="x" />
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#ff2020]/30 text-sm">
              <span className="text-[#888888] font-bold">S:{idx.supply} | D:{idx.demand}</span>
              <span className={`font-bold flex items-center ${
                idx.trend === "up" ? "text-emerald-400" : "text-[#ff2020]"
              }`}>
                {idx.trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                {idx.growthRate}%
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Split Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        
        {/* Left 2 Columns: Rising Stars and Active Domain Leaders */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Rising Stars Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-[#ff2020]/30 p-8 bg-black relative"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#ff2020]"></div>
            
            <h3 className="text-base font-bold text-white tracking-widest mb-6 flex items-center gap-2 uppercase">
              <Zap className="text-[#ff2020] w-5 h-5 fill-[#ff2020]" />
              [ RISING_ASSETS ]
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {risingStars.map((candidate) => (
                <div key={candidate.id} className="p-6 border border-[#ff2020]/30 bg-black hover:bg-[#ff2020]/10 transition-colors flex flex-col gap-5 relative group cursor-crosshair">
                  <div className="absolute top-4 right-4 text-[#ff2020] text-xs font-bold px-2 py-1 uppercase tracking-widest border border-[#ff2020]/50">
                    +{candidate.growthRate}%
                  </div>
                  <div className="flex items-center gap-4">
                    <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-none object-cover border border-[#ff2020]/50 grayscale group-hover:grayscale-0 transition-all" />
                    <div>
                      <h4 className="text-base font-bold text-white tracking-widest uppercase">{candidate.name}</h4>
                      <p className="text-xs text-[#ff2020] font-bold uppercase tracking-widest mt-1">[{candidate.role}]</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mt-2 pt-5 border-t border-[#ff2020]/30">
                    <div>
                      <span className="text-[#888888] block text-[10px] font-bold uppercase tracking-widest mb-1">Valuation</span>
                      <span className="font-bold text-white text-base">{candidate.currentValue} TT</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#888888] block text-[10px] font-bold uppercase tracking-widest mb-1">Score</span>
                      <span className="font-bold text-white text-base">{candidate.potentialScore}/100</span>
                    </div>
                  </div>

                  <Link 
                    href={`/student/${candidate.id}`}
                    className="w-full text-center py-2.5 bg-transparent border border-white hover:bg-white hover:text-black text-sm font-bold text-white uppercase tracking-widest transition-colors mt-2"
                  >
                    [ VIEW_DOSSIER ]
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active Candidates List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-[#ff2020]/30 p-8 bg-black relative"
          >
            <div className="absolute top-0 right-0 w-2 h-full bg-[#ff2020]"></div>
            
            <h3 className="text-base font-bold text-white tracking-widest mb-6 flex items-center gap-2 uppercase">
              <Database className="text-[#ff2020] w-5 h-5" />
              [ MARKET_REGISTRY ]
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#ff2020]/30 text-xs text-[#ff2020] uppercase font-bold tracking-widest">
                    <th className="pb-4 pl-2">Asset_ID</th>
                    <th className="pb-4">Class</th>
                    <th className="pb-4">Vector_Score</th>
                    <th className="pb-4 text-right">Mkt_Value</th>
                    <th className="pb-4 text-right pr-2">Top_Bid</th>
                  </tr>
                </thead>
                <motion.tbody 
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-[#ff2020]/20"
                >
                  {candidates.map((c) => (
                    <motion.tr variants={listItemVariants} key={c.id} className="hover:bg-[#ff2020]/10 transition-colors group cursor-crosshair">
                      <td className="py-4 pl-2 flex items-center gap-4">
                        <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-none object-cover border border-[#ff2020]/30 grayscale group-hover:grayscale-0" />
                        <div>
                          <p className="text-base font-bold text-white tracking-widest uppercase">{c.name}</p>
                          <span className="text-xs text-[#888888] font-bold uppercase tracking-widest">[{c.college}]</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-bold text-white uppercase tracking-widest">{c.role}</td>
                      <td className="py-4 text-base font-bold">
                        <span className="text-white">{c.potentialScore}</span>
                        <span className="text-[#888888] text-xs">/100</span>
                      </td>
                      <td className="py-4 text-right text-base font-bold text-white">
                        {c.currentValue.toLocaleString()} TT
                      </td>
                      <td className="py-4 text-right pr-2">
                        <span className="inline-block text-xs text-[#ff2020] py-1 px-2 font-bold tracking-widest uppercase border border-[#ff2020]/30">
                          {c.highestBidder}:{c.highestBid}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right 1 Column: Real-time Blockchain Ledger */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="border border-[#ff2020]/30 p-8 bg-black flex flex-col justify-between relative"
        >
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ff2020]"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ff2020]"></div>
          
          <div>
            <h3 className="text-base font-bold text-white tracking-widest mb-6 flex items-center gap-2 uppercase">
              <ShieldCheck className="text-[#ff2020] w-5 h-5" />
              [ ESCROW_LOG ]
            </h3>
            
            <motion.div 
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-0 border border-[#ff2020]/30"
            >
              {mockTransactions.map((tx, idx) => (
                <motion.div variants={listItemVariants} key={idx} className={`p-4 bg-black flex flex-col gap-3 relative hover:bg-[#ff2020]/10 transition-colors border-b border-[#ff2020]/30 ${idx === mockTransactions.length - 1 ? 'border-b-0' : ''}`}>
                  <div className="flex justify-between items-center text-xs font-bold tracking-widest uppercase">
                    <span className="text-[#ff2020]">[{tx.type}]</span>
                    <span className="text-[#888888]">{tx.timestamp}</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-relaxed">{tx.details}</p>
                  <div className="flex justify-between items-center text-[10px] text-[#888888] font-bold tracking-widest uppercase mt-2 pt-3 border-t border-[#ff2020]/30">
                    <span className="truncate max-w-[140px]">SRC:{tx.from}</span>
                    <span className="hover:text-white cursor-crosshair transition-colors">HSH:{tx.hash}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#ff2020]/30 flex flex-col gap-3 text-center text-xs font-bold tracking-widest uppercase">
            <span className="text-[#888888]">SYS_PWR: TALEGO_PROTOCOL</span>
            <span className="text-[#ff2020] hover:text-white cursor-crosshair transition-colors glitch-hover">[ VIEW_EXPLORER ]</span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
