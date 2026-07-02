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
    <div className="min-h-screen flex items-center justify-center py-10 relative overflow-hidden mono-font">
      <div className="w-full max-w-2xl terminal-panel p-12 relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ff2020]"></div>
        
        <div className="mb-12 border-b border-[#ff2020]/30 pb-6">
          <span className="text-xs text-[#ff2020] font-bold tracking-widest uppercase mb-2 block">[ SYSTEM_REGISTRATION ]</span>
          <h2 className="text-4xl font-black text-white tracking-widest uppercase">Initialize Entity</h2>
          <p className="text-sm text-[#888888] mt-2 font-bold tracking-widest uppercase">Join the Talent Market</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-[#ff2020]/10 text-[#ff2020] text-sm font-bold uppercase tracking-widest text-center">
            [ERR]: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label className="block text-xs font-bold text-[#ff2020] uppercase tracking-widest mb-3">{'>'} DEFINE_ROLE:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors border ${
                  role === "student"
                    ? "bg-[#ff2020] text-black border-[#ff2020]"
                    : "bg-transparent text-[#888888] border-[#ff2020]/30 hover:border-[#ff2020] hover:text-white"
                }`}
              >
                [ TALENT ]
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`py-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors border ${
                  role === "company"
                    ? "bg-[#ff2020] text-black border-[#ff2020]"
                    : "bg-transparent text-[#888888] border-[#ff2020]/30 hover:border-[#ff2020] hover:text-white"
                }`}
              >
                [ COMPANY ]
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#ff2020] uppercase tracking-widest mb-2">{'>'} FULL_NAME:</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="terminal-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#ff2020] uppercase tracking-widest mb-2">{'>'} EMAIL_ADDRESS:</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="terminal-input w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#ff2020] uppercase tracking-widest mb-2">{'>'} SECURE_PASSWORD:</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="terminal-input w-full"
            />
          </div>

          {/* Role dependent details */}
          {role === "student" ? (
            <div>
              <label className="block text-xs font-bold text-[#ff2020] uppercase tracking-widest mb-2">{'>'} UNIVERSITY_COLLEGE:</label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="terminal-input w-full"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#ff2020] uppercase tracking-widest mb-2">{'>'} COMPANY_NAME:</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Corp"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="terminal-input w-full"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="terminal-button w-full mt-6 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center disabled:opacity-30 "
          >
            {loading ? "[ PROCESSING_INITIALIZATION... ]" : "[ EXECUTE_REGISTRATION ]"}
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-bold text-[#888888] tracking-widest uppercase">
          ENTITY ALREADY EXISTS?{" "}
          <Link href="/auth/login" className="text-[#ff2020] hover:text-white transition-colors underline underline-offset-4">
            [ AUTHENTICATE_HERE ]
          </Link>
        </div>
      </div>
    </div>
  );
}
