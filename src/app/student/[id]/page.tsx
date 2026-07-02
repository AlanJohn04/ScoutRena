"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockCandidates, Candidate } from "@/data/mock-candidates";
import { getCurrentUserProfile, UserProfile, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { 
  Award, 
  EyeOff, 
  Eye, 
  Coins, 
  ArrowUpRight, 
  TrendingUp, 
  UserCheck, 
  Briefcase,
  GitBranch,
  Play
} from "lucide-react";
import { getProvider, getSigner, getScoutRenaMarketContract, getTalentTokenContract, parseTT, formatTT } from "@/lib/blockchain";

export default function PublicStudentProfile() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  
  // Custom states
  const [blindMode, setBlindMode] = useState<boolean>(true);
  const [following, setFollowing] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<string>("500");
  const [bidding, setBidding] = useState<boolean>(false);
  const [bidsList, setBidsList] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    // Load current user profile
    const profile = getCurrentUserProfile();
    setCurrentUser(profile);

    if (profile && profile.role === "company") {
      const fetchBalance = async () => {
        try {
          const signer = await getSigner();
          const address = await signer.getAddress();
          const tokenContract = getTalentTokenContract(signer);
          const balance = await tokenContract.balanceOf(address);
          setWalletBalance(Number(formatTT(balance)));
        } catch (error) {
          console.error("Could not fetch wallet balance", error);
        }
      };
      fetchBalance();
    }

    // Load candidate based on URL id parameter
    const id = params.id as string;
    const c = mockCandidates.find(item => item.id === id);
    if (c) {
      setCandidate(c);
      setBidsList(c.pendingBids);
      
      // Check if following
      if (profile && profile.role === "company") {
        const followed = localStorage.getItem(`followed_${profile.uid}`) || "[]";
        const followedList = JSON.parse(followed);
        setFollowing(followedList.includes(c.id));
      }
    }
  }, [params.id]);

  const handleFollowToggle = () => {
    if (!currentUser || currentUser.role !== "company") {
      alert("Only companies can follow candidates.");
      return;
    }
    
    const key = `followed_${currentUser.uid}`;
    const followed = localStorage.getItem(key) || "[]";
    let followedList = JSON.parse(followed);

    if (following) {
      followedList = followedList.filter((id: string) => id !== candidate!.id);
      setFollowing(false);
    } else {
      followedList.push(candidate!.id);
      setFollowing(true);
    }
    localStorage.setItem(key, JSON.stringify(followedList));
  };

  const handlePlaceBid = async () => {
    if (!currentUser || currentUser.role !== "company") {
      alert("Only registered companies can bid on talent.");
      return;
    }

    const amount = parseInt(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive bid amount.");
      return;
    }

    // Check token balance from chain or fallback
    const currentBalance = walletBalance !== null ? walletBalance : (currentUser.tokenBalance || 0);
    if (currentBalance < amount) {
      alert("Insufficient Talent Token balance in your wallet. Purchase more tokens from your console.");
      return;
    }

    setBidding(true);

    try {
      // Execute the real Solidity contract transaction on our local node!
      const provider = getProvider();
      const signer = await getSigner();
      
      const tokenContract = getTalentTokenContract(signer);
      const marketContract = getScoutRenaMarketContract(signer);

      console.log(`Approving ${amount} tokens for market contract...`);
      // Approve tokens
      const parsedAmount = parseTT(amount.toString());
      const approveTx = await tokenContract.approve(await marketContract.getAddress(), parsedAmount);
      await approveTx.wait();

      console.log(`Placing bid of ${amount} tokens on candidate...`);
      // Place bid
      const bidTx = await marketContract.placeBid(candidate!.id, parsedAmount);
      await bidTx.wait();
      
      console.log("Blockchain transaction complete!");

      // Update state and deduct tokens
      const updatedBids = [
        ...bidsList,
        { company: currentUser.name, amount, timestamp: new Date().toISOString().split("T")[0] }
      ];
      setBidsList(updatedBids);
      
      // Update candidate mock values
      const updatedCandidate = {
        ...candidate!,
        highestBid: Math.max(candidate!.highestBid, amount),
        highestBidder: amount > candidate!.highestBid ? currentUser.name : candidate!.highestBidder,
        currentValue: candidate!.currentValue + Math.round(amount * 0.5),
        pendingBids: updatedBids
      };
      setCandidate(updatedCandidate);
      
      if (db) {
        await setDoc(doc(db, "candidates", candidate!.id), updatedCandidate);
      }

      // Update local wallet balance state
      setWalletBalance(currentBalance - amount);

      // Deduct from company balance in localStorage (as a fallback/cache)
      const newBalance = currentBalance - amount;
      currentUser.tokenBalance = newBalance;
      localStorage.setItem("scoutrena_current_user", JSON.stringify(currentUser));
      
      const users = JSON.parse(localStorage.getItem("scoutrena_users") || "{}");
      if (users[currentUser.email]) {
        users[currentUser.email].tokenBalance = newBalance;
        localStorage.setItem("scoutrena_users", JSON.stringify(users));
      }

      alert(`Successfully placed a bid of ${amount} TT! Blockchain transaction ledger updated.`);
    } catch (err: any) {
      console.error(err);
      // Fallback in case localhost provider is not running
      const updatedBids = [
        ...bidsList,
        { company: currentUser.name, amount, timestamp: new Date().toISOString().split("T")[0] }
      ];
      setBidsList(updatedBids);
      const updatedCandidate = {
        ...candidate!,
        highestBid: Math.max(candidate!.highestBid, amount),
        highestBidder: amount > candidate!.highestBid ? currentUser.name : candidate!.highestBidder,
        currentValue: candidate!.currentValue + Math.round(amount * 0.5),
        pendingBids: updatedBids
      };
      setCandidate(updatedCandidate);
      
      if (db) {
        await setDoc(doc(db, "candidates", candidate!.id), updatedCandidate);
      }
      const newBalance = currentBalance - amount;
      currentUser.tokenBalance = newBalance;
      localStorage.setItem("scoutrena_current_user", JSON.stringify(currentUser));
      const users = JSON.parse(localStorage.getItem("scoutrena_users") || "{}");
      if (users[currentUser.email]) {
        users[currentUser.email].tokenBalance = newBalance;
        localStorage.setItem("scoutrena_users", JSON.stringify(users));
      }
      alert(`Bid simulated at ${amount} TT (Node offline fallback). Ledger updated.`);
    } finally {
      setBidding(false);
    }
  };

  if (!candidate) {
    return <div className="text-center py-20 text-white/50">Candidate not found.</div>;
  }

  const radarData = [
    { subject: "Problem Solving", value: candidate.cpiDetails.problemSolving, fullMark: 100 },
    { subject: "Engineering", value: candidate.cpiDetails.engineering, fullMark: 100 },
    { subject: "Learning Agility", value: candidate.cpiDetails.learningAgility, fullMark: 100 },
    { subject: "Innovation", value: candidate.cpiDetails.innovation, fullMark: 100 },
    { subject: "Collaboration", value: candidate.cpiDetails.collaboration, fullMark: 100 },
    { subject: "Delivery", value: candidate.cpiDetails.delivery, fullMark: 100 },
    { subject: "Domain Expertise", value: candidate.cpiDetails.domainExpertise, fullMark: 100 },
  ];

  // Blind Mode translations
  const hashedName = `Scout #${candidate.id.split("-")[1].toUpperCase() || "ABCD"}`;
  const displayAvatar = blindMode ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop" : candidate.avatar;
  const displayName = blindMode ? hashedName : candidate.name;
  const displayCollege = blindMode ? "Classified (Ivy Tier)" : candidate.college;

  return (
    <div className="flex flex-col gap-8">
      {/* Action Header */}
      <div className="flex justify-between items-center border-b border-[#ff2020]/20 pb-6">
        <div>
          <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Talent Transfer Market Profile</span>
          <h2 className="text-4xl font-bold text-white tracking-tight mt-1">
            {displayName} Console
          </h2>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBlindMode(!blindMode)}
            className="terminal-button flex items-center gap-2"
          >
            {blindMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {blindMode ? "DISABLE_BLIND_MODE" : "ENABLE_BLIND_MODE"}
          </button>

          {currentUser?.role === "company" && (
            <button
              onClick={handleFollowToggle}
              className={`terminal-button flex items-center gap-2 ${
                following ? "opacity-50" : ""
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {following ? "[ TRACKING_ACTIVE ]" : "[ INITIATE_TRACKING ]"}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Details and Charts */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Card Hero details */}
          <div className="terminal-panel p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
            {/* Subtle glow behind avatar */}
            <div className="absolute top-1/2 left-12 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 rounded-none blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <img src={displayAvatar} alt={displayName} className="w-28 h-28 rounded-2xl object-cover border border-[#ff2020]/30 shadow-none relative z-10" />
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <h3 className="text-3xl font-bold text-white tracking-tight">{displayName}</h3>
              <p className="text-base text-[#ff2020] font-medium mt-1">
                {displayCollege} • {candidate.role}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-5">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="py-1.5 px-3 bg-zinc-800/80 border border-[#ff2020]/20 text-sm text-zinc-300 font-medium rounded-none whitespace-nowrap">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full md:w-auto p-5 rounded-2xl bg-zinc-900/50 border border-[#ff2020]/20 text-center shrink-0 relative z-10">
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Market Value</span>
              <p className="text-4xl font-bold text-white tracking-tight mono-font mt-1">{candidate.currentValue.toLocaleString()} TT</p>
              <span className="text-xs text-white font-medium uppercase tracking-wider mt-2">
                Max Bid: {candidate.highestBid} TT ({candidate.highestBidder})
              </span>
            </div>
          </div>

          {/* Value History Chart */}
          <div className="terminal-panel p-6">
            <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">CAREER VALUE TREND (LIVE STOCK CHART)</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={candidate.valueHistory}>
                  <defs>
                    <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0c1033", borderColor: "rgba(255,255,255,0.08)", borderRadius: "8px" }}
                    labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
                    itemStyle={{ color: "#00d4ff", fontWeight: "bold", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2} fillOpacity={1} fill="url(#pubGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Soul Bound Badges */}
          <div className="terminal-panel p-6">
            <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">VERIFIED SOULBOUND (SBT) BADGES</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {candidate.badges.map((badge) => (
                <div key={badge.id} className="p-3.5 rounded-none bg-black border-[#ff2020]/20 border border-slate-700/50 flex flex-col items-center gap-2 text-center" style={{ borderTop: `2px solid ${badge.color}` }}>
                  <Award className="w-8 h-8" style={{ color: badge.color }} />
                  <h4 className="text-sm font-bold text-white">{badge.name}</h4>
                  <p className="text-xs text-white/50 leading-tight">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Bidding and Radar Charts */}
        <div className="flex flex-col gap-6">
          
          {/* Bidding Panel */}
          <div className="terminal-panel p-6 flex flex-col gap-4 border-brand-amber/20">
            <h3 className="text-base font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              <Coins className="text-amber-500 w-4.5 h-4.5" /> Place Strategic Bid
            </h3>

            <div className="bg-black border-[#ff2020]/20 p-3 rounded-none border border-slate-700/50 flex flex-col gap-1">
              <div className="flex justify-between text-sm text-white/50">
                <span>Highest Bid:</span>
                <span className="font-bold text-white">{candidate.highestBid} TT</span>
              </div>
              <div className="flex justify-between text-sm text-white/50">
                <span>By Company:</span>
                <span className="font-bold text-white">{candidate.highestBidder}</span>
              </div>
            </div>

            {candidate.acceptedOffer ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-center text-xs font-bold uppercase tracking-wider">
                🎉 POSITION SECURED AT {candidate.acceptedOffer.company.toUpperCase()} FOR {candidate.acceptedOffer.amount} TT [OFFER ACCEPTED]
              </div>
            ) : currentUser?.role === "company" ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Bid Amount (TT)</label>
                  <input
                    type="number"
                    min={candidate.highestBid + 100}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="terminal-input w-full px-3 py-2 font-semibold mono-font"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">
                    Your Wallet: {walletBalance !== null ? walletBalance.toLocaleString() : currentUser.tokenBalance?.toLocaleString()} TT
                  </span>
                </div>

                <button
                  onClick={handlePlaceBid}
                  disabled={bidding}
                  className="terminal-button w-full flex items-center justify-center gap-2"
                >
                  {bidding ? "[ TRANSACTING_ON_CHAIN... ]" : "[ SUBMIT_TRANSFER_BID ]"}
                </button>
              </div>
            ) : (
              <div className="p-3 text-center text-sm text-white/40 bg-black border-[#ff2020]/20 rounded-none border border-slate-700/50">
                Register a company account to bid with Talent Tokens on this candidate.
              </div>
            )}
          </div>

          {/* Radar chart */}
          <div className="terminal-panel p-6 flex flex-col items-center">
            <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4 self-start">POTENTIAL (CPI) RADAR</h3>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" tick={false} />
                  <Radar name={displayName} dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bids Log */}
          <div className="terminal-panel p-6">
            <h3 className="text-base font-bold text-white uppercase tracking-widest mb-3">Pending Bids History</h3>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {bidsList.map((bid, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm p-2 rounded bg-black border-[#ff2020]/20 border border-slate-700/50">
                  <span className="font-semibold text-white/70">{bid.company}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#ff2020] mono-font">{bid.amount} TT</span>
                    <span className="text-xs text-white/30">{bid.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
