import React from "react";
import { Zap, Layers, RotateCcw, ShieldCheck } from "lucide-react";

/**
 * ============================================================================
 * HeroTrustStrip Component
 * ============================================================================
 * Bottom trust & guarantee bar:
 * Fast dispatch, 280+ GSM combed cotton, 14-day easy exchange, 100% original.
 * ============================================================================
 */
export const HeroTrustStrip = () => {
  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 mt-5">
      <div className="bg-white rounded-none border border-neutral-200/90 shadow-2xs py-3.5 px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-neutral-900 font-mono">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#FF3B00] shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider truncate">
            Fast 24-48h Dispatch
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#FF3B00] shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider truncate">
            280+ GSM Combed Cotton
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw size={14} className="text-[#FF3B00] shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider truncate">
            14-Day Easy Exchange
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#FF3B00] shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider truncate">
            100% Original Streetwear
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroTrustStrip;
