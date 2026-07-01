"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Coins, 
  BrainCircuit, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">
      
      {/* Main hero typography - Red Box Utopia Tokyo Style */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-[#ff2020] p-12 md:p-20 flex flex-col items-center justify-center text-center relative shadow-[0_0_50px_rgba(255,32,32,0.3)] z-10 glitch-hover"
      >
        <span className="absolute top-4 left-4 text-black text-[10px] font-bold tracking-widest mono-font">[SYSTEM_INIT]</span>
        <span className="absolute top-4 right-4 text-black text-[10px] font-bold tracking-widest mono-font">[V.1.0]</span>
        
        <span className="py-1 px-3 border border-black text-[10px] font-bold tracking-widest text-black uppercase mb-8 mono-font">
          [ INTRODUCING SCOUTRENA ENTERPRISE ]
        </span>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black leading-tight uppercase font-sans">
          Don't search <br/> for talent.
        </h1>

        <p className="text-sm md:text-base text-black font-semibold max-w-lg leading-relaxed mt-8 mono-font">
          ScoutRena is the world's first AI-powered Talent Platform. Turn skills, experience, and potential into dynamic market valuations securely via smart contracts.
        </p>

        {/* Action triggers */}
        <div className="flex flex-col sm:flex-row gap-6 mt-12 w-full justify-center mono-font">
          <Link
            href="/auth/register"
            className="py-3 px-8 text-white bg-black hover:bg-[#222] font-bold text-xs uppercase tracking-widest border border-black transition-colors flex items-center justify-center gap-2"
          >
            [ GET_STARTED ] <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/market"
            className="py-3 px-8 text-black bg-transparent hover:bg-black hover:text-white font-bold text-xs uppercase tracking-widest border border-black transition-colors"
          >
            [ EXPLORE_MARKET ]
          </Link>
        </div>
        
        <span className="absolute bottom-4 left-4 text-black text-[10px] font-bold tracking-widest mono-font">[STATUS: AWAITING_INPUT]</span>
        <span className="absolute bottom-4 right-4 text-black text-[10px] font-bold tracking-widest mono-font">[READY]</span>
      </motion.div>

      {/* Corporate-style stats and pillars - Terminal Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 w-full max-w-6xl mt-32 z-10 border border-[#ff2020]/30 mono-font">
        
        <div className="p-8 flex flex-col gap-4 hover:bg-[#ff2020]/10 border-b md:border-b-0 md:border-r border-[#ff2020]/30 transition-colors group">
          <BrainCircuit className="text-[#ff2020] w-6 h-6 group-hover:animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Scoring</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Move beyond keywords. Gemini AI scores talent across distinct vector potentials: velocity, adaptability, drive, consistency.
          </p>
        </div>

        <div className="p-8 flex flex-col gap-4 hover:bg-[#ff2020]/10 border-b md:border-b-0 md:border-r border-[#ff2020]/30 transition-colors group">
          <TrendingUp className="text-[#ff2020] w-6 h-6 group-hover:animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Valuations</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Watch candidate market valuations fluctuate in real-time based on verified skills, commits, and competing token bids.
          </p>
        </div>

        <div className="p-8 flex flex-col gap-4 hover:bg-[#ff2020]/10 border-b md:border-b-0 md:border-r border-[#ff2020]/30 transition-colors group">
          <Coins className="text-[#ff2020] w-6 h-6 group-hover:animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Smart Contracts</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Recruiters use Talent Tokens to place transparent bids, securing talent via automated blockchain escrow.
          </p>
        </div>

        <div className="p-8 flex flex-col gap-4 hover:bg-[#ff2020]/10 transition-colors group">
          <ShieldCheck className="text-[#ff2020] w-6 h-6 group-hover:animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Verified Proof</h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            Tamper-proof integrations lock verified certificates, repositories, and achievements directly to candidate profiles.
          </p>
        </div>

      </div>

    </div>
  );
}
