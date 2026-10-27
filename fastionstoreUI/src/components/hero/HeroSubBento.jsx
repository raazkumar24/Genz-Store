import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, Flame, ArrowUpRight } from "lucide-react";

/**
 * ============================================================================
 * HeroSubBento Component
 * ============================================================================
 * Lower 3 Micro Bento Cards:
 * 1. Archived Catalog with mini overlapping previews
 * 2. 10,400+ Verified heads rating & core color dots
 * 3. Hot Drop Radar shipping indicator
 * ============================================================================
 */
export const ArchivedCatalogMiniCard = ({
  productsCount = 0,
  archivedCatalogPreviews = [],
}) => {
  const navigate = useNavigate();

  const handleArchivedClick = (e) => {
    e.preventDefault();
    const el = document.getElementById("archived-drops");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/new-arrivals");
    }
  };

  return (
    <a
      href="#archived-drops"
      onClick={handleArchivedClick}
      className="group bg-white rounded-none border border-neutral-200/90 hover:border-black p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 flex-1 min-h-[140px]"
    >
      <div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-mono font-black uppercase tracking-tight text-neutral-950">
            Archived Catalog
          </span>
          <Heart size={13} className="text-rose-500 fill-rose-500" />
        </div>
        <p className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
          {productsCount > 0
            ? `${productsCount}+ Streetwear Drops`
            : "460+ Streetwear Pieces"}
        </p>
      </div>

      {/* Dynamic Product Previews */}
      <div className="flex items-center -space-x-2">
        {archivedCatalogPreviews.map((item, idx) => (
          <div
            key={idx}
            className="h-10 w-10 rounded-none bg-neutral-100 border border-white overflow-hidden p-0.5 shadow-xs"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/models/model1.png";
              }}
            />
          </div>
        ))}
      </div>
    </a>
  );
};

export const VerifiedRadarComboCard = () => {
  return (
    <div className="bg-white rounded-none border border-neutral-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-3 flex-1 min-h-[140px]">
      {/* Top: 10,400+ Verified Heads */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center -space-x-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-none bg-black text-white text-[9px] font-mono font-black">
              10K
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-none bg-[#FF3B00] text-white text-[9px] font-mono font-black">
              <span className="flex items-center gap-0.5">
                <span>4.9</span>
                <Star size={8} className="fill-white text-white" />
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono font-black text-neutral-950 uppercase tracking-tight leading-none">
              10,400+ Verified Heads
            </p>
            <p className="text-[10px] font-mono text-neutral-500 font-medium mt-0.5">
              4.8/5 Fit & Fabric Rating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 hidden sm:flex">
          <span className="h-2 w-2 rounded-full bg-black" />
          <span className="h-2 w-2 rounded-full bg-[#78350F]" />
          <span className="h-2 w-2 rounded-full bg-[#EDE6D6]" />
        </div>
      </div>

      {/* Bottom: Hot Radar Worldwide Shipping Link */}
      <Link
        to="/new-arrivals"
        className="group/radar flex items-center justify-between gap-2 pt-2.5 border-t border-neutral-100 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none bg-[#FF3B00]/10 text-[#FF3B00] text-[9px] font-mono font-bold uppercase tracking-wider shrink-0">
            <Flame size={10} className="fill-[#FF3B00]" />
            HOT RADAR
          </span>
          <span className="text-[11px] font-mono font-bold text-neutral-900 group-hover/radar:text-[#FF3B00] transition-colors truncate">
            Drop 04 Ships in 24 Hours
          </span>
        </div>

        <div className="flex h-6 w-6 items-center justify-center rounded-none bg-neutral-100 group-hover/radar:bg-black group-hover/radar:text-white transition-colors shrink-0">
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </div>
      </Link>
    </div>
  );
};

export const HeroSubBento = ({
  productsCount = 0,
  archivedCatalogPreviews = [],
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-4 md:mt-5">
      <ArchivedCatalogMiniCard
        productsCount={productsCount}
        archivedCatalogPreviews={archivedCatalogPreviews}
      />
      <div className="bg-white rounded-none border border-neutral-200/90 p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-black text-white text-[10px] font-mono font-black">
              10K
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#FF3B00] text-white text-[10px] font-mono font-black">
              <span className="flex items-center gap-0.5">
                <span>4.9</span>
                <Star size={9} className="fill-white text-white" />
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-[13px] font-mono font-black text-neutral-950 uppercase tracking-tight leading-none">
              10,400+ Verified Heads
            </p>
            <p className="text-[10px] font-mono text-neutral-500 font-medium mt-1">
              4.8/5 Average Fit & Fabric Rating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 hidden sm:flex">
          <span className="text-[9px] font-mono text-neutral-400 uppercase">
            CORE:
          </span>
          <span className="h-2 w-2 rounded-full bg-black" />
          <span className="h-2 w-2 rounded-full bg-[#78350F]" />
          <span className="h-2 w-2 rounded-full bg-[#EDE6D6]" />
        </div>
      </div>

      <Link
        to="/new-arrivals"
        className="group bg-white rounded-none border border-neutral-200/90 hover:border-black p-4 shadow-xs flex items-center justify-between gap-4 transition-colors"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#FF3B00]/10 text-[#FF3B00] text-[10px] font-mono font-bold uppercase tracking-wider">
              <Flame size={11} className="fill-[#FF3B00]" />
              Hot Radar
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Worldwide
            </span>
          </div>
          <p className="text-xs font-mono font-black uppercase tracking-tight text-neutral-950 group-hover:text-[#FF3B00] transition-colors">
            Drop 04 Ships in 24 Hours
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-none bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors">
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </div>
      </Link>
    </div>
  );
};

export default HeroSubBento;
