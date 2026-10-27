import React from "react";
import { Star } from "lucide-react";

/**
 * ============================================================================
 * StarRating UI Component
 * ============================================================================
 * Reusable star rating visualization component (e.g. 4.8 ★, 5 gold stars).
 *
 * Props:
 * - rating: Number (e.g. 4.8 or 5)
 * - maxStars: Total stars to display (default: 5)
 * - size: Icon size in pixels (default: 13)
 * - showValue: Boolean, whether to display the numeric rating alongside (default: true)
 * - reviewCount: Optional number of verified reviews to display in parentheses
 * ============================================================================
 */
export const StarRating = ({
  rating = 5,
  maxStars = 5,
  size = 13,
  showValue = true,
  reviewCount = null,
  className = "",
}) => {
  const numericRating = Math.min(Math.max(Number(rating) || 0, 0), maxStars);

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Star Icons */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, idx) => {
          const filled = idx + 1 <= Math.round(numericRating);
          return (
            <Star
              key={idx}
              size={size}
              className={
                filled
                  ? "text-amber-500 fill-amber-500"
                  : "text-neutral-300 fill-neutral-200"
              }
            />
          );
        })}
      </div>

      {/* Numeric Score */}
      {showValue && (
        <span className="text-[11px] font-mono font-bold text-neutral-800">
          {numericRating.toFixed(1)}
        </span>
      )}

      {/* Review Count */}
      {reviewCount !== null && (
        <span className="text-[10px] font-mono text-neutral-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export default StarRating;
