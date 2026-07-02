import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LiveTicker from "@/components/LiveTicker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScoutRena | AI-Powered Talent Transfer Market",
  description: "Bloomberg + Blue Lock for developers. Bid on talent, track index valuations, and match via Candidate Potential Index (CPI).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white selection:bg-[#ff2020]/30 selection:text-white">
        
        {/* Terminal Diagnostic Overlays (Utopia Tokyo inspired) */}
        <div className="fixed top-0 left-0 h-full w-12 border-r border-[#ff2020]/20 hidden md:flex flex-col justify-between items-center py-8 z-50 pointer-events-none mix-blend-screen">
          <span className="text-[10px] text-[#ff2020] font-bold tracking-widest rotate-90 whitespace-nowrap opacity-70">[SYS_LOADING]</span>
          <span className="text-[10px] text-[#ff2020] font-bold opacity-70">U</span>
          <span className="text-[10px] text-[#ff2020] font-bold opacity-70">P</span>
          <span className="text-[10px] text-[#ff2020] font-bold opacity-70">T</span>
          <span className="text-[10px] text-[#ff2020] font-bold tracking-widest -rotate-90 whitespace-nowrap opacity-70">[VERSION 1.0]</span>
        </div>
        
        <div className="fixed top-0 right-0 h-full w-12 border-l border-[#ff2020]/20 hidden md:flex flex-col justify-between items-center py-8 z-50 pointer-events-none mix-blend-screen">
          <span className="text-[10px] text-[#ff2020] font-bold tracking-widest rotate-90 whitespace-nowrap opacity-70">[COORDS_OK]</span>
          <span className="text-[10px] text-[#ff2020] font-bold opacity-70">0</span>
          <span className="text-[10px] text-[#ff2020] font-bold opacity-70">A</span>
          <span className="text-[10px] text-[#ff2020] font-bold opacity-70">0</span>
          <div className="w-4 h-4 border border-[#ff2020] opacity-50 relative">
            <div className="absolute top-0 left-0 w-1 h-1 bg-[#ff2020]"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#ff2020]"></div>
          </div>
          <span className="text-[10px] text-[#ff2020] font-bold tracking-widest -rotate-90 whitespace-nowrap opacity-70">[ACTIVE]</span>
        </div>

        {/* Central Application Window wrapper */}
        <div className="w-full max-w-[1280px] mx-auto min-h-screen bg-black border-x border-[#ff2020]/30 flex flex-col relative shadow-[0_0_150px_rgba(255,32,32,0.05)]">
          {/* Bloomberg-style scrolling tickers at the top (Refined) */}
          <LiveTicker />
          
          {/* Top Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 relative">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
