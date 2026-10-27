import React, { useState } from "react";
import { Palette } from "lucide-react";
import ColorSwatch from "../ui/ColorSwatch";

/**
 * ============================================================================
 * PopularColorsCard Component
 * ============================================================================
 * Right bento top card:
 * Displays popular streetwear color swatches with hover tooltips and dynamic counts.
 * Clicking a swatch toggles color filtering and smooth-scrolls to the catalog.
 * ============================================================================
 */
export const PopularColorsCard = ({
  colorsList = [],
  activeColorFilter = "",
  onColorClick,
}) => {
  const [hoveredColor, setHoveredColor] = useState(null);

  return (
    <div className="bg-white rounded-none border border-neutral-200/90 p-4 sm:p-5 shadow-xs flex-1 flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
          <Palette size={14} className="text-[#e34234]" />
          Popular Colors
        </span>
        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-none border border-neutral-200">
          {hoveredColor
            ? hoveredColor.name
            : activeColorFilter
              ? `Filter: ${activeColorFilter}`
              : "Click To Filter"}
        </span>
      </div>

      {/* Swatch Circles using reusable ColorSwatch component */}
      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
        {colorsList.map((color) => {
          const isActive =
            activeColorFilter === color.filter?.toLowerCase();
          return (
            <ColorSwatch
              key={color.filter}
              hex={color.hex}
              name={color.name}
              count={color.count}
              isActive={isActive}
              onClick={() => onColorClick(color.filter)}
              onMouseEnter={() => setHoveredColor(color)}
              onMouseLeave={() => setHoveredColor(null)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PopularColorsCard;
