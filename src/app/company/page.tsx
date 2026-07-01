"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserProfile, UserProfile } from "@/lib/firebase";
import { useCandidates } from "@/hooks/useCandidates";
import { mockCompanies } from "@/data/mock-companies";
import { 
  Building2, 
  Coins, 
  Search, 
  Users, 
  Bookmark, 
  AlertTriangle,
  Award,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { getProvider, getScoutRenaMarketContract, getSigner, formatTT, getTalentTokenContract } from "@/lib/blockchain";
import { ethers } from "ethers";

export default function CompanyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Custom states
  const [companyDetails, setCompanyDetails] = useState<any>(null);
  const [followedCandidates, setFollowedCandidates] = useState<any[]>([]);
  const [scoutFeed, setScoutFeed] = useState<any[]>([]);
  const [bidsLog, setBidsLog] = useState<any[]>([]);
  const [reloadingBalance, setReloadingBalance] = useState<boolean>(false);

  const { candidates, loading } = useCandidates();

  useEffect(() => {
    const profile = getCurrentUserProfile();
    if (!profile) {
      router.push("/auth/login");
      return;
    }
    if (profile.role !== "company") {
      router.push("/student");
      return;
    }
    setUser(profile);

    // Load company details from mock list or use defaults
    const comp = mockCompanies.find(c => c.name.toLowerCase() === profile.name.toLowerCase()) || {
      id: profile.uid,
      name: profile.name,
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
      domain: "AI & Search Services",
      tokenBalance: profile.tokenBalance || 50000,
      activeBids: 0,
      trialInternships: 0,
      followingCandidates: []
    };
    setCompanyDetails(comp);
  }, []);

  useEffect(() => {
    if (user && candidates.length > 0) {
      // Load followed candidates list from localStorage
      const followedKey = `followed_${user.uid}`;
      const followedIds = JSON.parse(localStorage.getItem(followedKey) || "[]");
      
      // Default mock followings if none exist to make screen look rich immediately
      const initialFollowedIds = followedIds.length > 0 ? followedIds : ["candidate-1", "candidate-2"];
      if (followedIds.length === 0) {
        localStorage.setItem(followedKey, JSON.stringify(initialFollowedIds));
      }
      
      const followed = candidates.filter(c => initialFollowedIds.includes(c.id));
      setFollowedCandidates(followed);

      // Build real-time scouting progress feed cards for followed candidates
      const feed = [
        { id: 1, name: "Ayush Sharma", action: "Docker & Kubernetes micro-skills verified", valueBoost: "+350 TT", timestamp: "30 mins ago" },
        { id: 2, name: "Priya Nair", action: "Fine-tuned custom transformer model published", valueBoost: "+1,200 TT", timestamp: "2 hours ago" },
        { id: 3, name: "Ayush Sharma", action: "AWS Certified Cloud Practitioner validated", valueBoost: "+500 TT", timestamp: "Yesterday" },
        { id: 4, name: "Rohan Das", action: "Merged 5 PRs in Kubernetes main repo", valueBoost: "+850 TT", timestamp: "2 days ago" }
      ].filter(item => followed.some(c => c.name === item.name));
      setScoutFeed(feed);

      // Load active bids placed by this company from other candidates
      const activeBids = candidates
        .filter(c => c.pendingBids.some(b => b.company.toLowerCase() === user.name.toLowerCase()))
        .map(c => {
          const bid = c.pendingBids.find(b => b.company.toLowerCase() === user.name.toLowerCase())!;
          return {
            candidateId: c.id,
            name: c.name,
            role: c.role,
            amount: bid.amount,
            status: c.highestBidder.toLowerCase() === user.name.toLowerCase() ? "Winning" : "Outbid"
          };
        });
      setBidsLog(activeBids);
    }
  }, [user, candidates]);

  const handleBuyTokens = async () => {
    if (!user) return;
    setReloadingBalance(true);

    try {
      // Execute the blockchain transaction to purchase tokens!
      const provider = getProvider();
      const signer = await getSigner();
      
      const tokenContract = getTalentTokenContract(signer);
      const mintAmount = ethers.parseUnits("10000", 18); // Mint 10,000 TT

      console.log("Minting 10,000 Talent Tokens on local node...");
      const tx = await tokenContract.mint(user.walletAddress || await signer.getAddress(), mintAmount);
      await tx.wait();
      
      console.log("Tokens minted successfully!");

      const addedAmount = 10000;
      const updatedBalance = (companyDetails.tokenBalance || 0) + addedAmount;
      
      const updatedCompany = { ...companyDetails, tokenBalance: updatedBalance };
      setCompanyDetails(updatedCompany);

      // Save back
      user.tokenBalance = updatedBalance;
      localStorage.setItem("scoutrena_current_user", JSON.stringify(user));
      const users = JSON.parse(localStorage.getItem("scoutrena_users") || "{}");
      if (users[user.email]) {
        users[user.email].tokenBalance = updatedBalance;
        localStorage.setItem("scoutrena_users", JSON.stringify(users));
      }

      alert("Successfully purchased 10,000 TT! Minted to your wallet address.");
    } catch (err: any) {
      console.error(err);
      // Fallback in case localhost provider is not running
      const addedAmount = 10000;
      const updatedBalance = (companyDetails.tokenBalance || 0) + addedAmount;
      const updatedCompany = { ...companyDetails, tokenBalance: updatedBalance };
      setCompanyDetails(updatedCompany);
      user.tokenBalance = updatedBalance;
      localStorage.setItem("scoutrena_current_user", JSON.stringify(user));
      const users = JSON.parse(localStorage.getItem("scoutrena_users") || "{}");
      if (users[user.email]) {
        users[user.email].tokenBalance = updatedBalance;
        localStorage.setItem("scoutrena_users", JSON.stringify(users));
      }
      alert("Successfully simulated 10,000 TT purchase (Local node offline).");
    } finally {
      setReloadingBalance(false);
    }
  };

  const cancelMockBid = (candidateId: string) => {
    // refund logic
    const bid = bidsLog.find(b => b.candidateId === candidateId)!;
    const updatedBalance = (companyDetails.tokenBalance || 0) + bid.amount;
    
    // remove from log
    const updatedBids = bidsLog.filter(b => b.candidateId !== candidateId);
    setBidsLog(updatedBids);

    // update token balance
    setCompanyDetails({ ...companyDetails, tokenBalance: updatedBalance });
    user!.tokenBalance = updatedBalance;
    localStorage.setItem("scoutrena_current_user", JSON.stringify(user));

    alert(`Successfully canceled bid. Escrow refund of ${bid.amount} TT returned to wallet.`);
  };

  if (!companyDetails || !user) {
    return <div className="min-h-screen flex items-center justify-center text-indigo-300 text-sm font-semibold tracking-widest uppercase">Loading Recruiter Console...</div>;
  }

  // Find Hidden Gems (candidates with cpi index >80 and valuation <=3500 TT)
  const hiddenGems = candidates.filter(c => c.potentialScore >= 90 && c.currentValue <= 4500);

  return (
    <div className="flex flex-col gap-10 min-h-screen text-white p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[0%] left-[10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6 z-10">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Building2 className="text-indigo-400 w-8 h-8" />
            Recruiter Console
          </h2>
          <p className="text-sm text-indigo-300 font-semibold uppercase tracking-widest mt-2">
            {companyDetails.name} | Bid management & Radar
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 z-10">
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-1">Wallet Balance</span>
            <p className="text-3xl font-bold text-white mono-font">{companyDetails.tokenBalance?.toLocaleString()} TT</p>
          </div>
          <button
            onClick={handleBuyTokens}
            disabled={reloadingBalance}
            className="glass-button mt-4 py-2 w-full text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {reloadingBalance ? "MINTING..." : "BUY TOKENS"}
          </button>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-1">Active Locked Bids</span>
          <p className="text-3xl font-bold text-white mt-1">{bidsLog.length} <span className="text-sm text-indigo-400">CANDIDATES</span></p>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-1">Trial Internships</span>
          <p className="text-3xl font-bold text-white mt-1">{companyDetails.trialInternships} <span className="text-sm text-indigo-400">ACTIVE</span></p>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold mb-1">Followed Candidates</span>
          <p className="text-3xl font-bold text-white mt-1">{followedCandidates.length} <span className="text-sm text-indigo-400">TRACKED</span></p>
        </div>
      </div>

      {/* Hidden Gem Detector Banner */}
      {hiddenGems.length > 0 && (
        <div className="glass-panel p-8 border-indigo-500/50 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 group z-10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-colors"></div>
          <div className="flex gap-4 items-center">
            <Sparkles className="text-yellow-400 w-10 h-10 shrink-0 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">⭐ AI Hidden Gem Detector</h3>
              <p className="text-sm text-slate-300 font-medium mt-1 max-w-2xl leading-relaxed">
                We discovered {hiddenGems.length} candidate(s) currently ranked with high potential but undervalued by the market. Recruit them before they get bid up!
              </p>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            {hiddenGems.map((gem) => (
              <Link
                key={gem.id}
                href={`/student/${gem.id}`}
                className="py-3 px-6 bg-indigo-600/80 text-white hover:bg-indigo-500 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-widest transition-transform hover:-translate-y-1 shadow-lg border border-indigo-400/50"
              >
                Bid {gem.name} ({gem.currentValue} TT)
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Split Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        
        {/* Left 2 Cols: Escrow Bids and Followed candidates grid */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Active Escrow Bids placed */}
          <div className="glass-panel p-8">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6 flex items-center gap-2">
              <Coins className="text-emerald-400 w-5 h-5" /> Active Escrow Bids & Positions
            </h3>

            {bidsLog.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm font-semibold tracking-widest uppercase border border-dashed border-white/10 rounded-xl">
                No active bids placed. Open the scout search to place bids.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bidsLog.map((bid) => (
                  <div key={bid.candidateId} className="flex justify-between items-center p-5 bg-slate-900/60 rounded-xl border border-white/5 text-xs hover:border-indigo-500/50 transition-colors shadow-lg">
                    <div>
                      <h4 className="font-bold text-white text-base">{bid.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">{bid.role}</p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mb-1">Locked Escrow</span>
                        <span className="font-bold text-white mono-font text-sm">{bid.amount} TT</span>
                      </div>
                      <span className={`py-1.5 px-4 font-bold uppercase tracking-widest text-[10px] border rounded-full ${
                        bid.status === "Winning" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}>
                        {bid.status}
                      </span>
                      <button
                        onClick={() => cancelMockBid(bid.candidateId)}
                        className="py-2.5 px-4 bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg border border-white/10 hover:border-rose-500/30 text-[10px] font-bold tracking-widest text-slate-300 uppercase transition-colors"
                      >
                        Cancel & Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Followed Candidates List */}
          <div className="glass-panel p-8">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6 flex items-center gap-2">
              <Users className="text-cyan-400 w-5 h-5" /> Followed Talent DNA Cards
            </h3>
            
            {followedCandidates.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm font-semibold tracking-widest uppercase border border-dashed border-white/10 rounded-xl">
                You are not tracking any candidates. Follow them from their profiles.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {followedCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-5 bg-slate-900/60 rounded-xl border border-white/5 hover:border-indigo-500/50 hover:-translate-y-1 shadow-lg transition-all flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{candidate.name}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-1">{candidate.role}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-cyan-400">{candidate.potentialScore}<span className="text-[10px] text-slate-500">/100</span></span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-4 mt-2">
                      <div>
                        <span className="text-slate-500 font-bold tracking-widest uppercase block mb-1">Valuation</span>
                        <span className="font-bold text-white mono-font text-sm">{candidate.currentValue} TT</span>
                      </div>
                      <Link
                        href={`/student/${candidate.id}`}
                        className="py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/40 rounded-lg border border-indigo-500/30 text-indigo-300 font-bold text-[10px] tracking-widest uppercase transition-colors"
                      >
                        Bid Console
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Followed progress radar updates */}
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-white tracking-wide mb-6 flex items-center gap-2">
            <Activity className="text-indigo-400 w-5 h-5 animate-pulse" /> Radar Feed
          </h3>

          {scoutFeed.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm font-semibold tracking-widest uppercase">
              No recent updates. Follow some candidates to view their live milestones.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {scoutFeed.map((item) => (
                <div key={item.id} className="p-4 bg-slate-900/60 rounded-xl border border-white/5 relative overflow-hidden flex flex-col gap-2 hover:border-indigo-500/30 transition-colors shadow-lg">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-cyan-400"></div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-indigo-400">{item.name}</span>
                    <span className="text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{item.action}</p>
                  <div className="flex justify-end pt-2 mt-2 border-t border-white/5">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">IMPACT: <span className="text-emerald-400">{item.valueBoost}</span></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
