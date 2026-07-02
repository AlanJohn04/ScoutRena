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
  ArrowRight,
  Download
} from "lucide-react";
import Link from "next/link";
import { getProvider, getScoutRenaMarketContract, getSigner, formatTT, getTalentTokenContract } from "@/lib/blockchain";
import { ethers } from "ethers";
import * as XLSX from "xlsx";

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

    // Fetch actual wallet balance
    const fetchWalletData = async () => {
      try {
        const signer = await getSigner();
        const address = await signer.getAddress();
        const tokenContract = getTalentTokenContract(signer);
        const balance = await tokenContract.balanceOf(address);
        setCompanyDetails((prev: any) => ({ ...prev, tokenBalance: Number(formatTT(balance)) }));
      } catch (error) {
        console.error("Could not fetch wallet balance", error);
      }
    };
    fetchWalletData();
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

      const newBalance = await tokenContract.balanceOf(await signer.getAddress());
      const updatedBalance = Number(formatTT(newBalance));
      
      const updatedCompany = { ...companyDetails, tokenBalance: updatedBalance };
      setCompanyDetails(updatedCompany);

      // Save back to cache
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

  const handleExportRankings = () => {
    if (candidates.length === 0) return;

    // Rank candidates based on a combination of Potential Score and Current Market Value
    const rankedCandidates = [...candidates].sort((a, b) => {
      // 60% weight to potential score, 40% weight to normalized market value
      const scoreA = (a.potentialScore * 0.6) + ((a.currentValue / 10000) * 100 * 0.4);
      const scoreB = (b.potentialScore * 0.6) + ((b.currentValue / 10000) * 100 * 0.4);
      return scoreB - scoreA;
    });

    const exportData = rankedCandidates.map((c, index) => ({
      Rank: index + 1,
      Name: c.name,
      Role: c.role,
      "Talent Value (TT)": c.currentValue,
      "Future Potential (CPI)": c.potentialScore,
      "Problem Solving": c.cpiDetails.problemSolving || c.cpiDetails.technicalAbility,
      "Engineering": c.cpiDetails.engineering || c.cpiDetails.consistency,
      "Learning Agility": c.cpiDetails.learningAgility || c.cpiDetails.learningVelocity,
      "Innovation": c.cpiDetails.innovation || c.cpiDetails.projectOriginality,
      "Collaboration": c.cpiDetails.collaboration || c.cpiDetails.behavior,
      "Delivery": c.cpiDetails.delivery || c.cpiDetails.adaptability,
      "Domain Expertise": c.cpiDetails.domainExpertise || c.cpiDetails.communityContribution,
      "Blue Lock Insight": c.insights
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const wscols = [
      {wch: 6}, {wch: 20}, {wch: 25}, {wch: 18}, {wch: 22}, 
      {wch: 15}, {wch: 15}, {wch: 16}, {wch: 15}, {wch: 15}, 
      {wch: 15}, {wch: 18}, {wch: 50}
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidate Rankings");
    
    XLSX.writeFile(workbook, "ScoutRena_Talent_Rankings.xlsx");
  };


  if (!companyDetails || !user) {
    return <div className="min-h-screen flex items-center justify-center text-[#888888] text-base font-semibold tracking-widest uppercase">Loading Recruiter Console...</div>;
  }

  // Find Hidden Gems (candidates with cpi index >80 and valuation <=3500 TT)
  const hiddenGems = candidates.filter(c => c.potentialScore >= 90 && c.currentValue <= 4500);

  return (
    <div className="flex flex-col gap-10 min-h-screen text-white p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[0%] left-[10%] w-[50%] h-[50%] bg-black rounded-none blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-black rounded-none blur-[120px] pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#ff2020]/30 pb-6 z-10 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Building2 className="text-[#ff2020] w-8 h-8" />
            Recruiter Console
          </h2>
          <p className="text-base text-[#888888] font-semibold uppercase tracking-widest mt-2">
            {companyDetails.name} | Bid management & Radar
          </p>
        </div>
        
        <button
          onClick={handleExportRankings}
          className="terminal-button flex items-center gap-2 py-3 px-6 shadow-none text-white font-bold uppercase tracking-widest bg-[#10b981]/10 border-[#10b981]/40 hover:bg-[#10b981]/20 hover:border-[#10b981]"
        >
          <Download className="w-5 h-5" />
          Export Rankings (XLSX)
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 z-10">
        <div className="terminal-panel p-6 flex flex-col justify-between">
          <div>
            <span className="text-sm text-[#888888] uppercase tracking-widest block font-bold mb-1">Wallet Balance</span>
            <p className="text-4xl font-bold text-white mono-font">{companyDetails.tokenBalance?.toLocaleString()} TT</p>
          </div>
          <button
            onClick={handleBuyTokens}
            disabled={reloadingBalance}
            className="terminal-button mt-4 py-2 w-full text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {reloadingBalance ? "MINTING..." : "BUY TOKENS"}
          </button>
        </div>

        <div className="terminal-panel p-6 flex flex-col justify-center">
          <span className="text-sm text-[#888888] uppercase tracking-widest block font-bold mb-1">Active Locked Bids</span>
          <p className="text-4xl font-bold text-white mt-1">{bidsLog.length} <span className="text-base text-[#ff2020]">CANDIDATES</span></p>
        </div>

        <div className="terminal-panel p-6 flex flex-col justify-center">
          <span className="text-sm text-[#888888] uppercase tracking-widest block font-bold mb-1">Trial Internships</span>
          <p className="text-4xl font-bold text-white mt-1">{companyDetails.trialInternships} <span className="text-base text-[#ff2020]">ACTIVE</span></p>
        </div>

        <div className="terminal-panel p-6 flex flex-col justify-center">
          <span className="text-sm text-[#888888] uppercase tracking-widest block font-bold mb-1">Followed Candidates</span>
          <p className="text-4xl font-bold text-white mt-1">{followedCandidates.length} <span className="text-base text-[#ff2020]">TRACKED</span></p>
        </div>
      </div>

      {/* Hidden Gem Detector Banner */}
      {hiddenGems.length > 0 && (
        <div className="terminal-panel p-8 border-[#ff2020]/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 group z-10 ">
          <div className="absolute top-0 right-0 w-40 h-40 bg-black rounded-none blur-3xl group-hover:bg-[#ff2020]/10 transition-colors"></div>
          <div className="flex gap-4 items-center">
            <Sparkles className="text-[#ff2020] w-10 h-10 shrink-0 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">⭐ AI Hidden Gem Detector</h3>
              <p className="text-base text-[#cccccc] font-medium mt-1 max-w-2xl leading-relaxed">
                We discovered {hiddenGems.length} candidate(s) currently ranked with high potential but undervalued by the market. Recruit them before they get bid up!
              </p>
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            {hiddenGems.map((gem) => (
              <Link
                key={gem.id}
                href={`/student/${gem.id}`}
                className="terminal-button flex items-center gap-2 shadow-none"
              >
                [ BID_{gem.name.toUpperCase().replace(/\s+/g, '_')} : {gem.currentValue}_TT ]
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
          <div className="terminal-panel p-8">
            <h3 className="text-xl font-bold text-white tracking-wide mb-6 flex items-center gap-2">
              <Coins className="text-white w-5 h-5" /> Active Escrow Bids & Positions
            </h3>

            {bidsLog.length === 0 ? (
              <div className="text-center py-12 text-[#888888] text-base font-semibold tracking-widest uppercase border border-dashed border-[#ff2020]/30 rounded-none">
                No active bids placed. Open the scout search to place bids.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bidsLog.map((bid) => (
                  <div key={bid.candidateId} className="flex justify-between items-center p-5 bg-black border-[#ff2020]/20 rounded-none border border-[#ff2020]/20 text-sm hover:border-[#ff2020]/40 transition-colors shadow-none">
                    <div>
                      <h4 className="font-bold text-white text-lg">{bid.name}</h4>
                      <p className="text-xs text-[#888888] font-semibold uppercase tracking-widest mt-1">{bid.role}</p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <span className="text-xs text-[#888888] font-bold tracking-widest uppercase block mb-1">Locked Escrow</span>
                        <span className="font-bold text-white mono-font text-base">{bid.amount} TT</span>
                      </div>
                      <span className={`py-1.5 px-4 font-bold uppercase tracking-widest text-xs border rounded-none ${
                        bid.status === "Winning" ? "bg-white/10 border-white/30 text-white" : "bg-[#ff2020]/10 border-[#ff2020]/30 text-[#ff2020]"
                      }`}>
                        {bid.status}
                      </span>
                      <button
                        onClick={() => cancelMockBid(bid.candidateId)}
                        className="terminal-button text-xs py-2 px-3"
                      >
                        [ CANCEL_REFUND ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Followed Candidates List */}
          <div className="terminal-panel p-8">
            <h3 className="text-xl font-bold text-white tracking-wide mb-6 flex items-center gap-2">
              <Users className="text-[#ff2020] w-5 h-5" /> Followed Talent DNA Cards
            </h3>
            
            {followedCandidates.length === 0 ? (
              <div className="text-center py-12 text-[#888888] text-base font-semibold tracking-widest uppercase border border-dashed border-[#ff2020]/30 rounded-none">
                You are not tracking any candidates. Follow them from their profiles.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {followedCandidates.map((candidate) => (
                  <div key={candidate.id} className="p-5 bg-black border-[#ff2020]/20 rounded-none border border-[#ff2020]/20 hover:border-[#ff2020]/40 hover:-translate-y-1 shadow-none transition-all flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-none object-cover border border-[#ff2020]/30" />
                        <div>
                          <h4 className="text-base font-bold text-white">{candidate.name}</h4>
                          <p className="text-xs text-[#888888] font-semibold tracking-widest uppercase mt-1">{candidate.role}</p>
                        </div>
                      </div>
                      <span className="text-base font-bold text-[#ff2020]">{candidate.potentialScore}<span className="text-xs text-[#888888]">/100</span></span>
                    </div>

                    <div className="flex justify-between items-center text-xs border-t border-[#ff2020]/20 pt-4 mt-2">
                      <div>
                        <span className="text-[#888888] font-bold tracking-widest uppercase block mb-1">Valuation</span>
                        <span className="font-bold text-white mono-font text-base">{candidate.currentValue} TT</span>
                      </div>
                      <Link
                        href={`/student/${candidate.id}`}
                        className="py-2.5 px-4 bg-black hover:bg-[#ff2020]/20 rounded-none border border-[#ff2020]/30 text-[#888888] font-bold text-xs tracking-widest uppercase transition-colors"
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
        <div className="terminal-panel p-8">
          <h3 className="text-xl font-bold text-white tracking-wide mb-6 flex items-center gap-2">
            <Activity className="text-[#ff2020] w-5 h-5 animate-pulse" /> Radar Feed
          </h3>

          {scoutFeed.length === 0 ? (
            <div className="text-center py-10 text-[#888888] text-base font-semibold tracking-widest uppercase">
              No recent updates. Follow some candidates to view their live milestones.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {scoutFeed.map((item) => (
                <div key={item.id} className="p-4 bg-black border-[#ff2020]/20 rounded-none border border-[#ff2020]/20 relative overflow-hidden flex flex-col gap-2 hover:border-[#ff2020]/30 transition-colors shadow-none">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-cyan-400"></div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-[#ff2020]">{item.name}</span>
                    <span className="text-[#888888]">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-[#cccccc] font-medium leading-relaxed">{item.action}</p>
                  <div className="flex justify-end pt-2 mt-2 border-t border-[#ff2020]/20">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">IMPACT: <span className="text-white">{item.valueBoost}</span></span>
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
