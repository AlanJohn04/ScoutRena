"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { firebaseLogin } from "@/lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await firebaseLogin(email, password);
      console.log("Logged in user:", user);
      
      // Redirect to correct dashboard
      if (user.role === "student") {
        router.push("/student");
      } else {
        router.push("/company");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[30%] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md glass-panel p-10 relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-2 font-medium">Access your Talent DNA Platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full mt-4 py-4 text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-400">
          First time here?{" "}
          <Link href="/auth/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
