import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

/**
 * ============================================================================
 * EmptyState UI Component
 * ============================================================================
 * Consistent, premium empty state display for empty lists (e.g. Empty Wishlist,
 * Empty Bag, No Search Results, or Empty Collections).
 *
 * Props:
 * - icon: React node (e.g. <Heart size={32} />, <ShoppingBag size={32} />)
 * - title: Main heading text
 * - description: Helpful guidance text
 * - actionText: Button / CTA label (e.g. "Explore Drops")
 * - actionLink: Link path to navigate to (e.g. "/new-arrivals")
 * - onActionClick: Optional custom click callback (e.g. reset filters)
 * - secondaryAction: Optional secondary button node
 * ============================================================================
 */
export const EmptyState = ({
  icon,
  badgeText,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
  secondaryAction,
  className = "",
}) => {
  return (
    <div
      className={`my-8 flex flex-col items-center justify-center text-center p-8 sm:p-12 md:p-16 rounded-none bg-white border border-neutral-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] max-w-lg mx-auto ${className}`}
    >
      {/* Icon Container */}
      {icon && (
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-none bg-[#F5F6F1] border border-neutral-200/80 flex items-center justify-center mb-5 shadow-xs">
          {icon}
        </div>
      )}

      {/* Optional Badge */}
      {badgeText && (
        <span className="mb-3 px-3 py-1 rounded-none bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold uppercase tracking-wider border border-neutral-200">
          {badgeText}
        </span>
      )}

      {/* Heading */}
      <h3
        className="text-xl sm:text-2xl font-black text-neutral-900 mb-2 uppercase tracking-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-neutral-500 text-xs sm:text-sm mb-6 leading-relaxed font-medium max-w-sm">
          {description}
        </p>
      )}

      {/* Action Button / Link */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {actionLink ? (
          <Link
            to={actionLink}
            className="group inline-flex items-center gap-3 rounded-none bg-neutral-900 hover:bg-black text-white pl-6 pr-2.5 py-2.5 text-xs font-mono font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <span>{actionText || "Explore Catalog"}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-neutral-900 group-hover:bg-[#e34234] group-hover:text-white transition-colors">
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </Link>
        ) : onActionClick ? (
          <button
            type="button"
            onClick={onActionClick}
            className="px-6 py-2.5 rounded-none bg-neutral-900 text-white text-xs font-mono font-black uppercase tracking-wider hover:bg-[#e34234] transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            {actionText || "Reset Filters"}
          </button>
        ) : null}

        {secondaryAction}
      </div>
    </div>
  );
};

export default EmptyState;
