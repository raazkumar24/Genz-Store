import React from "react";

/**
 * ============================================================================
 * ColorSwatch UI Component
 * ============================================================================
 * Color filter ya product variant color swatch dot.
 * White aur light colors ke liye border automatically handle karta hai
 * aur active state par double ring effect deta hai.
 *
 * Props:
 * - hex: Color hex code (e.g. "#111111", "#FFFFFF")
 * - name: Color name (e.g. "Black", "Off White")
 * - isActive: Boolean, whether this swatch is selected
 * - count: Optional count of items (e.g. 14 drops)
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - onClick: Click handler callback
 * - onMouseEnter: Hover start handler
 * - onMouseLeave: Hover end handler
 * ============================================================================
 */
export const ColorSwatch = ({
  hex = "#111111",
  name = "",
  isActive = false,
  count = null,
  size = "md",
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "",
}) => {
  const isLight =
    hex?.toLowerCase() === "#ffffff" ||
    hex?.toLowerCase() === "#fffdd0" ||
    hex?.toLowerCase() === "#fdfbf7" ||
    hex?.toLowerCase() === "#ede6d6";

  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7 sm:h-8 sm:w-8",
    lg: "h-9 w-9 sm:h-10 sm:w-10",
  }[size] || "h-7 w-7";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer border ${sizeClasses} ${
        isLight ? "border-neutral-300" : "border-black/10"
      } ${
        isActive
          ? "ring-2 ring-neutral-950 ring-offset-2 scale-110"
          : "hover:scale-115 hover:ring-1 hover:ring-neutral-400"
      } ${className}`}
      style={{ backgroundColor: hex }}
      title={`${name}${count !== null ? ` (${count} items)` : ""}`}
      aria-label={`Select color ${name}`}
    >
      {isActive && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isLight ? "bg-neutral-950" : "bg-white"
          }`}
        />
      )}
    </button>
  );
};

export default ColorSwatch;
