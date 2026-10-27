import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatHeroImageUrl } from "../../services/heroShowcaseService";

/**
 * ============================================================================
 * TacticalDropCard Component
 * ============================================================================
 * Editorial Studio Showcase for Trending Bottomwear (Parachute Cargos & Baggy Pants).
 * Symmetrical counterpart to SpotlightDropCard in the Dual-Drop Studio Showcase.
 * 
 * Features:
 * - Studio canvas with radial micro-grid and mix-blend-multiply texture overlay
 * - Strikethrough pricing + silhouette cut description
 * - Direct click-through to collection / product silhouette
 * 
 * @param {Object} props
 * @param {string} [props.cargoImg] - Product garment image URL
 * @param {string} [props.cargoName] - Product display name (defaults to "Parachute Cargos")
 * @param {string} [props.cargoLink] - Destination link (defaults to "/collections/cargos")
 * @param {string} [props.brand] - Brand label (defaults to "GENZ ARCHIVE")
 * @param {string} [props.cargoBadge] - Technical badge spec (e.g., "HEAVYWEIGHT 280 GSM")
 * @param {string} [props.cargoTag] - Category tag pill (e.g., "TRENDING CARGO")
 * @param {string|number} [props.cargoPrice] - Current selling price in INR
 * @param {string|number} [props.cargoOriginalPrice] - MRP / strikethrough price in INR
 * @param {string} [props.cargoSubtitle] - Fabric & fit details (e.g., "RAW ECRU • RELAXED FIT")
 * ============================================================================
 */
export const TacticalDropCard = ({
  cargoImg,
  cargoName = "Parachute Cargos",
  cargoLink = "/collections/cargos",
  brand = "GENZ ARCHIVE",
  cargoBadge = "HEAVYWEIGHT 280 GSM",
  cargoTag = "TRENDING CARGO",
  cargoPrice = "479",
  cargoOriginalPrice = "799",
  cargoSubtitle = "RAW ECRU • RELAXED FIT",
}) => {
  return (
    <Link
      to={cargoLink}
      className="group relative rounded-none border border-neutral-200/90 bg-white text-neutral-950 p-4 sm:p-5 flex-1 min-h-[300px] flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-xs hover:border-black"
    >
      {/* 1. Top Bar: Technical Specification Badge + Category Tag Pill */}
      <div className="flex items-center justify-between gap-2 z-10">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
          <span className="h-1.5 w-1.5 rounded-none bg-[#FF3B00]" />
          {cargoBadge}
        </span>

        <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#FF3B00]">
          {cargoTag}
        </span>
      </div>

      {/* 2. Garment Showcase: Studio Canvas with Radial Grid & Micro-Pills */}
      <div className="relative w-full flex-1 min-h-[150px] max-h-[185px] my-2.5 rounded-none overflow-hidden bg-neutral-50 border border-neutral-200/50 flex items-center justify-center p-0 group/img shadow-2xs">
        {/* Studio Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0000000c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

        <img
          src={formatHeroImageUrl(cargoImg || "/collections/baggy_pants.png")}
          alt={cargoName}
          className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-108 select-none"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/collections/baggy_pants.png";
          }}
        />

        {/* Studio Badge Overlay */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-none bg-neutral-900/90 text-[9px] font-mono font-bold text-white uppercase tracking-wider border border-white/10">
            BOTTOMWEAR RADAR
          </span>
        </div>

        <div className="absolute top-2 right-2 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 rounded-none bg-black text-[9px] font-mono font-black text-white uppercase tracking-wider">
            HOT DROP
          </span>
        </div>
      </div>

      {/* 3. Product Meta: Brand, Headline Title & Pricing / Specs */}
      <div className="flex flex-col space-y-1 z-10">
        <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest truncate">
          {brand} • UNISEX
        </p>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-tight transition-colors line-clamp-1 text-neutral-950 group-hover:text-[#FF3B00]">
          {cargoName}
        </h2>
        <div className="flex items-baseline gap-2.5 pt-0.5">
          <span className="text-lg sm:text-xl font-mono font-black text-[#FF3B00]">
            ₹{cargoPrice}
          </span>
          {cargoOriginalPrice && (
            <span className="text-xs font-mono text-neutral-400 line-through">
              ₹{cargoOriginalPrice}
            </span>
          )}
          {cargoSubtitle && (
            <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase">
              {cargoSubtitle}
            </span>
          )}
        </div>
      </div>

      {/* 4. Bottom Action Strip: Silhouette Inspection CTA + Arrow */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-200 z-10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#FF3B00] transition-colors">
          CLICK TO INSPECT SILHOUETTE
        </span>
        <div className="flex h-7 w-7 items-center justify-center rounded-none bg-black text-white group-hover:bg-[#FF3B00] transition-colors">
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
};

export default TacticalDropCard;
