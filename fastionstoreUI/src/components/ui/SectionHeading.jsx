import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * ============================================================================
 * SectionHeading UI Component
 * ============================================================================
 * Consistent typography header across pages and streetwear showcase sections.
 * Supports badges, main titles, outline accent typography, subtitles,
 * and optional call-to-action navigation links.
 *
 * Props:
 * - badgeText: Small pill text at top (e.g. "HOT RIGHT NOW", "FRESH DROPS")
 * - badgeIcon: Optional icon before badge text
 * - title: Main header text
 * - outlineText: Optional accented outline word (e.g. "DROPS", "ARRIVALS")
 * - subtitle: Description paragraph
 * - actionText: Optional right-aligned link text (e.g. "VIEW ALL")
 * - actionLink: Optional link URL
 * - align: 'left' | 'center' (default: 'left')
 * ============================================================================
 */
export const SectionHeading = ({
  badgeText,
  badgeIcon,
  title,
  outlineText,
  subtitle,
  actionText,
  actionLink,
  align = "left",
  className = "",
}) => {
  const isCentered = align === "center";

  return (
    <div
      className={`flex flex-col ${
        isCentered
          ? "items-center text-center"
          : "md:flex-row md:items-end justify-between"
      } gap-4 mb-8 sm:mb-12 ${className}`}
    >
      <div className={`space-y-2 ${isCentered ? "max-w-2xl" : "max-w-3xl"}`}>
        {/* Top Badge */}
        {badgeText && (
          <div className={`flex ${isCentered ? "justify-center" : "justify-start"}`}>
            <span className="inline-flex items-center gap-2 rounded-none border border-neutral-200 bg-white/80 px-3.5 py-1 text-[11px] font-mono font-black uppercase tracking-wider text-neutral-900 shadow-2xs">
              {badgeIcon}
              {badgeText}
            </span>
          </div>
        )}

        {/* Title */}
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-950 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
          {outlineText && (
            <span className="text-outline-primary ml-2">{outlineText}</span>
          )}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Link */}
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-neutral-900 hover:text-[#e34234] transition-colors shrink-0"
        >
          <span>{actionText}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-none bg-neutral-900 text-white group-hover:bg-[#e34234] transition-colors">
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </span>
        </Link>
      )}
    </div>
  );
};

export default SectionHeading;
