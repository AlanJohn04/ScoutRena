"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUserProfile, firebaseLogout, UserProfile } from "@/lib/firebase";
import { 
  Trophy, 
  Coins, 
  Search, 
  TrendingUp, 
  GraduationCap, 
  Building2, 
  LogOut, 
  User, 
  LineChart,
  UserCheck,
  Zap,
  Globe
} from "lucide-react";
import { getProvider, formatTT, getTalentTokenContract } from "@/lib/blockchain";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("0.0");
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    // Check local storage for authenticated user profile
    const profile = getCurrentUserProfile();
    setUser(profile);

    // If company user, check their wallet balance on localhost chain
    if (profile && profile.walletAddress) {
      setWalletConnected(true);
      setWalletAddress(profile.walletAddress);
      loadBalance(profile.walletAddress);
    }
  }, [pathname]);

  const loadBalance = async (address: string) => {
    try {
      const provider = getProvider();
      const tokenContract = getTalentTokenContract(provider);
      const balance = await tokenContract.balanceOf(address);
      setWalletBalance(parseFloat(formatTT(balance)).toLocaleString());
    } catch (err) {
      console.warn("Failed to load blockchain balance, using simulated balance", err);
      // fallback mock balance
      setWalletBalance("2,500");
    }
  };

  const handleLogout = async () => {
    await firebaseLogout();
    setUser(null);
    router.push("/");
  };

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const provider = getProvider();
        await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletConnected(true);
        setWalletAddress(address);
        
        // update profile wallet address
        if (user) {
          user.walletAddress = address;
          localStorage.setItem("scoutrena_current_user", JSON.stringify(user));
          // update in mock list
          const users = JSON.parse(localStorage.getItem("scoutrena_users") || "{}");
          if (users[user.email]) {
            users[user.email].walletAddress = address;
            localStorage.setItem("scoutrena_users", JSON.stringify(users));
          }
        }
        
        loadBalance(address);
      } else {
        alert("Please install MetaMask or another Web3 browser wallet to connect.");
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  // Base navigation links visible to everyone
  const mainLinks = [
    { name: "Trading Floor", href: "/market", icon: LineChart },
    { name: "Rankings", href: "/market/rankings", icon: Trophy },
  ];

  return (
    <nav className="w-full bg-black border-b border-[#ff2020]/20 z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 glitch-hover">
              <div className="w-8 h-8 bg-[#ff2020] flex items-center justify-center font-bold text-black text-2xl mono-font">
                S
              </div>
              <span className="text-2xl font-bold tracking-widest text-[#ff2020] uppercase mono-font">ScoutRena</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-4 ml-8">
              {mainLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-bold tracking-widest uppercase transition-colors mono-font flex items-center ${
                      active 
                        ? "text-[#ff2020]" 
                        : "text-[#888888] hover:text-[#ffffff] glitch-hover"
                    }`}
                  >
                    {active && <span className="mr-2 animate-pulse text-[#ff2020]">{'>_'}</span>}
                    [{link.name}]
                  </Link>
                );
              })}
              
              {user?.role === "company" && (
                <>
                  <Link href="/company" className={`text-sm font-bold tracking-widest uppercase transition-colors mono-font ${pathname === "/company" ? "text-[#ff2020]" : "text-[#888888] hover:text-[#ffffff]"}`}>
                    [COMPANY_DASHBOARD]
                  </Link>
                  <Link href="/company/discover" className={`text-sm font-bold tracking-widest uppercase transition-colors mono-font ${pathname === "/company/discover" ? "text-[#ff2020]" : "text-[#888888] hover:text-[#ffffff]"}`}>
                    [DISCOVER]
                  </Link>
                </>
              )}

              {user?.role === "student" && (
                <>
                  <Link href="/student" className={`text-sm font-bold tracking-widest uppercase transition-colors mono-font ${pathname === "/student" ? "text-[#ff2020]" : "text-[#888888] hover:text-[#ffffff]"}`}>
                    [DASHBOARD]
                  </Link>
                  <Link href={`/student/${user.uid}`} className={`text-sm font-bold tracking-widest uppercase transition-colors mono-font ${pathname.includes(user.uid) ? "text-[#ff2020]" : "text-[#888888] hover:text-[#ffffff]"}`}>
                    [PUBLIC_PROFILE]
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Section: Auth & User Context */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 mono-font">
                {/* Wallet Info (Company) or CPI (Student) */}
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 border border-[#ff2020]/20 text-xs uppercase font-bold tracking-widest">
                  {user.role === "company" ? (
                    <div className="flex items-center gap-3">
                      <span className="text-[#888888]"><span className="text-[#ff2020] mr-1">TKN:</span>{walletBalance} TT</span>
                      {!walletConnected ? (
                        <button onClick={connectWallet} className="text-[#ff2020] hover:text-white glitch-hover">[CONNECT_WALLET]</button>
                      ) : (
                        <span className="text-[#ffffff]">
                          {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span className="text-[#ffffff]"><span className="text-[#888888] mr-1">CPI:</span>{user.cpi || "..."}</span>
                      <span className="text-[#ffffff]"><span className="text-[#888888] mr-1">VAL:</span>{user.marketValue ? `${user.marketValue}TT` : "..."}</span>
                    </div>
                  )}
                </div>

                {/* Profile Avatar / Logout Dropdown */}
                <div className="flex items-center gap-4 pl-4 border-l border-[#ff2020]/20">
                  <span className="text-[#888888] text-xs font-bold tracking-widest uppercase">
                    USER: {user.role === "student" ? "TALENT" : "CORP"}
                  </span>
                  <button onClick={handleLogout} className="text-[#ff2020] hover:text-white transition-colors text-xs font-bold tracking-widest uppercase glitch-hover" title="Sign Out">
                    [LOGOUT]
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 mono-font">
                <Link href="/auth/login" className="text-sm font-bold text-[#888888] hover:text-[#ffffff] transition-colors glitch-hover">[LOG_IN]</Link>
                <Link href="/auth/register" className="text-sm font-bold bg-[#ff2020] text-black hover:bg-[#ffffff] transition-colors px-3 py-1.5 glitch-hover">[INIT_USER]</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
