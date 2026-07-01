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
    <div className="min-h-screen flex items-center justify-center py-10 relative overflow-hidden mono-font">
      <div className="w-full max-w-md terminal-panel p-12 relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#ff2020]"></div>
        
        <div className="mb-12 border-b border-[#ff2020]/30 pb-6">
          <span className="text-[10px] text-[#ff2020] font-bold tracking-widest uppercase mb-2 block">[ SYSTEM_LOGIN ]</span>
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">Authenticate</h2>
          <p className="text-xs text-[#888888] mt-2 font-bold tracking-widest uppercase">Access your Talent DNA Platform</p>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-[#ff2020] bg-[#ff2020]/10 text-[#ff2020] text-xs font-bold uppercase tracking-widest text-center">
            [ERR]: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label className="block text-[10px] font-bold text-[#ff2020] uppercase tracking-widest mb-2">{'>'} EMAIL_ADDRESS:</label>
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
            <label className="block text-[10px] font-bold text-[#ff2020] uppercase tracking-widest mb-2">{'>'} SECURE_PASSWORD:</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="terminal-input w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="terminal-button w-full mt-6 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center disabled:opacity-30 border border-[#ff2020] hover:bg-[#ff2020] hover:text-black transition-colors"
          >
            {loading ? "[ AUTHENTICATING... ]" : "[ EXECUTE_LOGIN ]"}
          </button>
        </form>

        <div className="mt-10 text-center text-xs font-bold text-[#888888] tracking-widest uppercase">
          NEW ENTITY?{" "}
          <Link href="/auth/register" className="text-[#ff2020] hover:text-white transition-colors underline underline-offset-4">
            [ INITIALIZE_ACCOUNT ]
          </Link>
        </div>
      </div>
    </div>
  );
}
