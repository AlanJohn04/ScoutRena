"use client";
import React from "react";
import { mockTickerData } from "@/data/mock-market";

export default function LiveTicker() {
  // Double the ticker list to enable continuous looping
  const doubleTicker = [...mockTickerData, ...mockTickerData];

  return (
    <div className="w-full bg-black border-b border-[#ff2020]/20 py-1 overflow-hidden flex items-center select-none z-50">
      <div className="px-4 border-r border-[#ff2020]/20 flex items-center gap-2 text-lg font-bold text-[#ff2020] tracking-widest bg-black z-10 shrink-0">
        <span className="w-1.5 h-1.5 bg-[#ff2020] animate-pulse"></span>
        [DATA_STREAM]
      </div>
      
      <div className="relative w-full overflow-hidden flex items-center">
        <div className="animate-ticker flex items-center gap-10 pl-4">
          {doubleTicker.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 text-lg shrink-0 font-bold tracking-widest mono-font">
              <span className="text-[#888888]">[{item.symbol}]</span>
              <span className="text-[#ffffff]">{item.value}</span>
              <span
                className={
                  item.up ? "text-[#ffffff]" : "text-[#ff2020]"
                }
              >
                {item.up ? "+" : "-"}{item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
