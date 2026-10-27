import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatHeroImageUrl } from "../../services/heroShowcaseService";

/**
 * ============================================================================
 * SpotlightDropCard Component
 * ============================================================================
 * Editorial Studio Showcase for Featured Topwear (Hoodies, Sweatshirts & Tees).
 * Symmetrical counterpart to TacticalDropCard in the Dual-Drop Studio Showcase.
 * 
 * Features:
 * - Studio grid background with mix-blend-multiply garment rendering
 * - Supports dynamic dark/light theme switching via Admin Hero Showcase
 * - Direct click-through to product silhouette / details
 * 
 * @param {Object} props
 * @param {Object} [props.spotlightConfig] - Master hero config (theme, custom fields)
 * @param {string} [props.spotlightLink] - Destination link (/collections/hoodies or product URL)
 * @param {string} [props.spotlightImg] - Product garment image URL
 * @param {string} [props.spotlightName] - Product display name
 * @param {string|number} [props.spotlightPrice] - Selling price in INR
 * @param {string} [props.spotlightBadge] - Technical badge spec (e.g., "HEAVYWEIGHT 380 GSM")
 * @param {string} [props.spotlightTag] - Top tag pill (e.g., "SIGNATURE FIT")
 * @param {string} [props.brand] - Brand label (defaults to "TAGAS ARCHIVE")
 * ============================================================================
 */
export const SpotlightDropCard = ({
  spotlightConfig = {},
  spotlightLink,
  spotlightImg,
  spotlightName,
  spotlightPrice,
  spotlightBadge,
  spotlightTag,
  brand = "TAGAS ARCHIVE",
}) => {
  const isLightCard = spotlightConfig.cardTheme === "light";

  return (
    <Link
      to={spotlightLink || "/collections/hoodies"}
      className={`group relative rounded-none border p-4 sm:p-5 flex-1 min-h-[280px] flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isLightCard
          ? "bg-white text-neutral-950 border-neutral-200/90 shadow-xs"
          : "bg-[#0E1013] text-white border-neutral-800 shadow-sm"
      }`}
    >
      {/* 1. Top Bar: Technical Specification Badge + Category Tag Pill */}
      <div className="flex items-center justify-between gap-2 z-10">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider ${
            isLightCard
              ? "bg-neutral-100 text-neutral-800 border border-neutral-200"
              : "bg-white/10 text-neutral-200 border border-white/10"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-none bg-[#FF3B00]" />
          {spotlightBadge}
        </span>

        <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#FF3B00]">
          {spotlightTag}
        </span>
      </div>

      {/* 2. Garment Showcase: Studio Canvas with Radial Grid & Micro-Pills */}
      <div className="relative w-full flex-1 min-h-[150px] max-h-[185px] my-2.5 rounded-none overflow-hidden bg-white border border-neutral-200/50 flex items-center justify-center p-0 group/img shadow-2xs">
        {/* Studio Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0000000c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        <img
          src={formatHeroImageUrl(spotlightImg)}
          alt={spotlightName}
          className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-108 select-none"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/models/model1.png";
          }}
        />

        {/* Studio Badge Overlay */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-none bg-neutral-900/90 text-[9px] font-mono font-bold text-white uppercase tracking-wider border border-white/10">
            DROP SPOTLIGHT
          </span>
        </div>

        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded-none bg-[#FF3B00] text-[9px] font-mono font-black text-white uppercase tracking-wider">
            NEW
          </span>
        </div>
      </div>

      {/* 3. Product Meta: Brand, Headline Title & GSM Spec */}
      <div className="flex flex-col space-y-1 z-10">
        <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest truncate">
          {brand} • UNISEX
        </p>
        <h2
          className={`text-sm sm:text-base font-black uppercase tracking-tight transition-colors line-clamp-1 ${
            isLightCard
              ? "text-neutral-950 group-hover:text-[#FF3B00]"
              : "text-white group-hover:text-[#FF3B00]"
          }`}
        >
          {spotlightName}
        </h2>
        <div className="flex items-baseline gap-2.5 pt-0.5">
          <span className="text-lg sm:text-xl font-mono font-black text-[#FF3B00]">
            ₹{spotlightPrice}
          </span>
          <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase">
            280 GSM • RELAXED CUT
          </span>
        </div>
      </div>

      {/* 4. Bottom Action Strip: Silhouette Inspection CTA + Arrow */}
      <div
        className={`flex items-center justify-between pt-3 mt-2 border-t z-10 ${
          isLightCard ? "border-neutral-200" : "border-neutral-800"
        }`}
      >
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#FF3B00] transition-colors">
          CLICK TO INSPECT SILHOUETTE
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-black group-hover:bg-[#FF3B00] group-hover:text-white transition-colors">
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
};

export default SpotlightDropCard;
