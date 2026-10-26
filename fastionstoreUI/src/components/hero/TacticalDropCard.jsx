import React from "react";
import { Link } from "react-router-dom";

/**
 * ============================================================================
 * TacticalDropCard Component
 * ============================================================================
 * Right bento middle card:
 * Displays trending bottomwear / parachute cargo preview with pricing
 * and quick access button.
 * ============================================================================
 */
export const TacticalDropCard = ({
  cargoImg,
  cargoName,
  cargoLink,
}) => {
  return (
    <Link
      to={cargoLink || "/collections/cargos"}
      className="group bg-white rounded-none border border-neutral-200/90 hover:border-black p-4 shadow-xs flex items-center justify-between gap-3 transition-all duration-300"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-16 w-16 rounded-none bg-neutral-100 border border-neutral-200/80 p-1 shrink-0 flex items-center justify-center">
          <img
            src={cargoImg || "/collections/baggy_pants.png"}
            alt={cargoName || "Parachute Cargos"}
            className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/collections/baggy_pants.png";
            }}
          />
        </div>
        <div className="flex flex-col space-y-0.5 min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3B00]">
            • TRENDING BOTTOMWEAR
          </span>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight text-neutral-950 group-hover:text-[#FF3B00] transition-colors truncate">
            {cargoName || "Parachute Cargos"}
          </h2>
          <p className="text-[11px] font-mono text-neutral-500 font-medium truncate">
            ₹479 <span className="line-through text-neutral-400">₹799</span> • Raw Ecru
          </p>
        </div>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-none bg-black text-white group-hover:bg-[#FF3B00] transition-colors shrink-0 font-bold text-sm">
        +
      </div>
    </Link>
  );
};

export default TacticalDropCard;
