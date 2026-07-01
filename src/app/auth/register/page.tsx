"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { firebaseSignUp } from "@/lib/firebase";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "company">("student");
  
  // Role specific details
  const [college, setCollege] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const extra: any = {};
      if (role === "student") {
        extra.college = college || "CUSAT";
        // Default initial student valuation variables
        extra.cpi = 70; // baseline evaluation pending
        extra.marketValue = 1500; // default starting TT value
        extra.skills = ["React", "TypeScript", "Node.js"];
        extra.cpiDetails = {
          technicalAbility: 70,
          learningVelocity: 75,
          consistency: 60,
          projectOriginality: 65,
          communityContribution: 50,
          behavior: 80,
          adaptability: 75
        };
        extra.valueHistory = [
          { date: "Jan", value: 1000 },
          { date: "Feb", value: 1200 },
          { date: "Mar", value: 1500 }
        ];
        extra.badges = [
          { id: "b1", name: "First Blood", description: "Profile initialized", type: "First Blood", color: "#00ff88", verified: true }
        ];
      } else {
        extra.companyName = companyName;
        extra.tokenBalance = 50000; // initial free trial registration tokens
        extra.activeBids = 0;
        extra.trialInternships = 0;
        extra.followingCandidates = [];
      }

      const user = await firebaseSignUp(email, password, name, role, extra);
      console.log("Registered user:", user);
      
      // Redirect to correct dashboard
      if (user.role === "student") {
        router.push("/student");
      } else {
        router.push("/company");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md glass-panel p-10 relative mt-10 mb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400 mt-2 font-medium">Join the Talent Market</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${
                  role === "student"
                    ? "bg-indigo-600/80 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                Talent
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${
                  role === "company"
                    ? "bg-indigo-600/80 text-white border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                Company
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Secure Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Role dependent details */}
          {role === "student" ? (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">University / College</label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full mt-4 py-4 text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "INITIALIZING..." : "REGISTER"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-400">
          Already registered?{" "}
          <Link href="/auth/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            Log In here
          </Link>
        </div>
      </div>
    </div>
  );
}
