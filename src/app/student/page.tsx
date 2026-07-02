"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserProfile, updateProfile, UserProfile } from "@/lib/firebase";
import { useCandidates } from "@/hooks/useCandidates";
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
  CheckCircle,
  Lightbulb, 
  BrainCircuit, 
  ArrowUpRight 
} from "lucide-react";
import { parseResume } from "@/lib/ai-engine";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { candidates, loading } = useCandidates();
  
  // Resume uploading states
  const [resumeText, setResumeText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  
  useEffect(() => {
    const profile = getCurrentUserProfile();
    if (!profile) {
      router.push("/auth/login");
      return;
    }
    if (profile.role !== "student") {
      router.push("/company");
      return;
    }
    setUser(profile);
  }, [router]);

  useEffect(() => {
    if (user && candidates.length > 0) {
      const candidateDetails = candidates.find(c => c.name.toLowerCase() === user.name.toLowerCase()) || {
        id: user.uid,
        name: user.name,
        role: "Blockchain Developer",
        college: user.college || "CUSAT",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop",
        cpi: user.cpi || 74,
        potentialScore: 91,
        demandIndex: 85,
        growthRate: 15,
        riskScore: "Low",
        currentValue: user.marketValue || 2500,
        highestBid: 1400,
        highestBidder: "TCS",
        pendingBids: [],
        skills: user.skills || ["React", "TypeScript", "Node.js"],
        cpiDetails: (user as any).cpiDetails || {
          technicalAbility: 70,
          learningVelocity: 75,
          consistency: 60,
          projectOriginality: 65,
          communityContribution: 50,
          behavior: 80,
          adaptability: 75
        },
        valueHistory: (user as any).valueHistory || [
          { date: "Jan", value: 1000 },
          { date: "Feb", value: 1800 },
          { date: "Mar", value: 2500 }
        ],
        badges: (user as any).badges || [
          { id: "b1", name: "First Blood", description: "Profile initialized", type: "First Blood", color: "#6366f1", verified: true }
        ],
        compatibility: {
          "Google": 82,
          "Amazon": 85,
          "Adobe": 89,
          "TCS": 92
        },
        insights: "Profile is successfully initialized. Try pasting your resume in the scanner below to get a real-time Gemini valuation boost!",
        githubStats: {
          commits: 120,
          stars: 12,
          prs: 3,
          streak: 12
        }
      };
      setProfileData(candidateDetails);
    }
  }, [user, candidates]);

  const handleResumeParse = async () => {
    if (!resumeText.trim()) return;
    setParsing(true);
    setParseSuccess(false);

    try {
      // Call our Gemini route
      const aiResult = await parseResume(resumeText);
      console.log("Gemini parse result:", aiResult);

      // Boost valuation based on parsing result
      const parsedValue = 3500 + Math.round(aiResult.ambitionScore * 20);
      
      const updatedValueHistory = [
        ...profileData.valueHistory,
        { date: "Jul", value: parsedValue }
      ];

      const updatedBadges = [
        ...profileData.badges,
        { 
          id: "b-" + Math.random().toString(36).substring(2, 6), 
          name: "GenAI Scanned", 
          description: "Resume parsed & verified by Gemini AI", 
          type: "AI Verification", 
          color: "#2dd4bf", 
          verified: true 
        }
      ];

      // Update state and localStorage
      const updatedDetails = {
        ...profileData,
        cpi: Math.round((aiResult.cpi.technicalAbility + aiResult.cpi.learningVelocity + aiResult.cpi.consistency) / 3),
        potentialScore: aiResult.potentialScore,
        skills: aiResult.skills,
        cpiDetails: aiResult.cpi,
        currentValue: parsedValue,
        valueHistory: updatedValueHistory,
        badges: updatedBadges,
        insights: aiResult.feedback
      };

      setProfileData(updatedDetails);

      // Save back to firebase profile helper
      await updateProfile(user!.uid, {
        cpi: updatedDetails.cpi,
        marketValue: parsedValue,
        skills: aiResult.skills,
        extra: {
          cpiDetails: updatedDetails.cpiDetails,
          valueHistory: updatedDetails.valueHistory,
          badges: updatedDetails.badges
        }
      } as any);

      setParseSuccess(true);
      setResumeText("");
    } catch (err) {
      console.error(err);
      alert("Error scanning resume. Please check console logs.");
    } finally {
      setParsing(false);
    }
  };

  if (!profileData || !user) {
    return <div className="min-h-screen flex items-center justify-center text-[#888888] text-sm font-semibold tracking-widest uppercase">Loading Talent DNA...</div>;
  }

  // Format Recharts CPI radar data
  const radarData = [
    { subject: "Technical", value: profileData.cpiDetails.technicalAbility, fullMark: 100 },
    { subject: "Velocity", value: profileData.cpiDetails.learningVelocity, fullMark: 100 },
    { subject: "Consistency", value: profileData.cpiDetails.consistency, fullMark: 100 },
    { subject: "Originality", value: profileData.cpiDetails.projectOriginality, fullMark: 100 },
    { subject: "Community", value: profileData.cpiDetails.communityContribution, fullMark: 100 },
    { subject: "Behavior", value: profileData.cpiDetails.behavior, fullMark: 100 },
    { subject: "Adaptability", value: profileData.cpiDetails.adaptability, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col gap-10 min-h-screen text-white relative overflow-hidden p-6 md:p-10">
      {/* Decorative Orbs */}
      <div className="absolute top-[0%] right-[10%] w-[40%] h-[40%] bg-black rounded-none blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[0%] left-[10%] w-[40%] h-[40%] bg-black rounded-none blur-[120px] pointer-events-none -z-10"></div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#ff2020]/30 pb-6 gap-6 z-10">
        <div className="flex items-center gap-6">
          <img src={profileData.avatar} alt={profileData.name} className="w-24 h-24 rounded-none object-cover border-2 border-[#ff2020]/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]" />
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">{profileData.name}</h2>
            <p className="text-sm text-[#ff2020] font-semibold tracking-wider uppercase mt-1">
              {profileData.college} • {profileData.role}
            </p>
          </div>
        </div>
        
        {/* Talent Card summary values */}
        <div className="flex items-center gap-8 terminal-panel p-5">
          <div className="text-right">
            <span className="text-[10px] text-[#888888] uppercase tracking-widest font-bold block mb-1">Personal Valuation</span>
            <p className="text-3xl font-bold text-white mono-font">{profileData.currentValue.toLocaleString()} TT</p>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-right">
            <span className="text-[10px] text-[#888888] uppercase tracking-widest font-bold block mb-1">Weekly Growth</span>
            <p className="text-3xl font-bold text-white flex items-center justify-end mono-font">
              <ArrowUpRight className="w-6 h-6 mr-1" />
              {profileData.growthRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        
        {/* Left Col: Stock Chart and Badges */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Recharts Career Stock Chart */}
          <div className="terminal-panel p-8">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6">Career Stock Value History</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={profileData.valueHistory}>
                  <defs>
                    <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", backdropFilter: "blur(10px)" }}
                    labelStyle={{ color: "#cbd5e1", fontSize: "12px", fontWeight: "600" }}
                    itemStyle={{ color: "#818cf8", fontWeight: "bold", fontSize: "16px" }}
                  />
                  <Area type="monotone" dataKey="value" name="Valuation (TT)" stroke="#818cf8" strokeWidth={4} fillOpacity={1} fill="url(#valueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Badges / Soul Bound Tokens */}
          <div className="terminal-panel p-8">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6">Soulbound SBT Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {profileData.badges.map((badge: any, idx: number) => (
                <div 
                  key={idx}
                  className="p-5 bg-black border-[#ff2020]/20 border border-[#ff2020]/20 rounded-none text-center flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform group shadow-none"
                  style={{ borderTop: `2px solid ${badge.color}` }}
                >
                  <Award className="w-8 h-8 transition-transform group-hover:scale-110 drop-shadow-[0_0_10px_currentColor]" style={{ color: badge.color }} />
                  <h4 className="text-sm font-bold text-white">{badge.name}</h4>
                  <p className="text-[10px] text-[#888888] font-semibold">{badge.description}</p>
                  <span className="text-[9px] font-bold text-white bg-white/10 border border-emerald-500/20 px-3 py-1 uppercase tracking-widest mt-2 rounded-none">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini API Resume Scanner Box */}
          <div className="terminal-panel p-8 relative overflow-hidden border-[#ff2020]/30 group">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black rounded-none blur-3xl group-hover:bg-black transition-colors"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <BrainCircuit className="text-[#ff2020] w-6 h-6" />
              <h3 className="text-lg font-bold text-white tracking-wide">Gemini Talent DNA Scanner</h3>
            </div>
            <p className="text-sm text-[#888888] mb-6 font-medium leading-relaxed max-w-2xl">
              Paste your raw resume text here. Gemini AI will evaluate your skills, project originality, and learning velocity to update your CPI index and recalculate your live market valuation.
            </p>

            {parseSuccess && (
              <div className="mb-6 p-4 rounded-none bg-white/10 border border-white/30 text-white text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Resume scanned successfully! Talent DNA profile updated.
              </div>
            )}

            <textarea
              rows={5}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content, projects, achievements, and Github links here..."
              className="w-full bg-black border-[#ff2020]/20 border border-slate-700/50 p-4 rounded-none text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none mb-6 shadow-inner"
            />
            
            <button
              onClick={handleResumeParse}
              disabled={parsing || !resumeText.trim()}
              className="terminal-button w-full py-4 text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              {parsing ? "Parsing & Evaluating..." : "Scan & Evaluate Portfolio"}
            </button>
          </div>

        </div>

        {/* Right Col: CPI Radar and Compatibility heatmap */}
        <div className="flex flex-col gap-8">
          
          {/* CPI Radar Chart */}
          <div className="terminal-panel p-8 flex flex-col items-center">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6 self-start">Potential (CPI) Breakdown</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} fontWeight="600" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.05)" tick={false} />
                  <Radar name={profileData.name} dataKey="value" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-6 border-t border-[#ff2020]/30 pt-6">
              <div className="text-center bg-black border-[#ff2020]/20 rounded-none p-4 border border-[#ff2020]/20 shadow-inner">
                <span className="text-[#888888] block text-[10px] font-bold tracking-widest uppercase mb-1">Future Potential</span>
                <span className="font-bold text-white text-xl mono-font">{profileData.potentialScore}<span className="text-slate-600 text-xs">/100</span></span>
              </div>
              <div className="text-center bg-black border-[#ff2020]/20 rounded-none p-4 border border-[#ff2020]/20 shadow-inner">
                <span className="text-[#888888] block text-[10px] font-bold tracking-widest uppercase mb-1">Velocity</span>
                <span className="font-bold text-white text-xl mono-font">{profileData.cpiDetails.learningVelocity}<span className="text-slate-600 text-xs">/100</span></span>
              </div>
            </div>
          </div>

          {/* AI Advisor Panel */}
          <div className="terminal-panel p-8">
            <h3 className="text-lg font-bold text-white tracking-wide mb-4 flex items-center gap-2">
              <Lightbulb className="text-[#ff2020] w-5 h-5 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" /> AI Advisor Insights
            </h3>
            <p className="text-sm text-[#cccccc] font-medium leading-relaxed bg-black border-[#ff2020]/20 rounded-none border border-[#ff2020]/20 p-5 shadow-inner">
              {profileData.insights}
            </p>
          </div>

          {/* Compatibility Heatmap */}
          <div className="terminal-panel p-8">
            <h3 className="text-lg font-bold text-white tracking-wide mb-6">Company Compatibility</h3>
            <div className="flex flex-col gap-6">
              {Object.entries(profileData.compatibility).map(([companyName, percentage]) => (
                <div key={companyName} className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <span className="text-white font-semibold text-sm">{companyName}</span>
                    <span className="font-bold mono-font text-[#ff2020] text-xs">{percentage as number}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-none h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-none"
                      style={{ width: `${percentage}%` }}
                    ></div>
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
