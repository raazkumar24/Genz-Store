import React from "react";

/**
 * ============================================================================
 * Skeleton & ProductSkeleton UI Components
 * ============================================================================
 * Shimmering placeholder components displayed during asynchronous data fetching.
 * Ensures consistent visual feedback across all pages without layout shift.
 * 
 * Props for Skeleton:
 * - className: custom Tailwind classes (height, width, rounded, etc.)
 * 
 * Props for ProductSkeleton:
 * - count: number of skeleton cards to render (default: 1)
 * ============================================================================
 */

export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200 ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductSkeleton = ({ count = 1 }) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          className="rounded-none bg-white border border-neutral-200/90 p-3 sm:p-4 animate-pulse shadow-xs flex flex-col justify-between"
        >
          {/* Product Image Area */}
          <div className="aspect-[3/4] w-full bg-neutral-200/80 rounded-none mb-3" />

          {/* Product Info Lines */}
          <div className="space-y-2.5">
            {/* Category / Brand Pill */}
            <div className="h-3 w-1/3 bg-neutral-200 rounded-none" />

            {/* Title Line */}
            <div className="h-4 w-4/5 bg-neutral-200 rounded-none" />

            {/* Price & Action Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 w-20 bg-neutral-200 rounded-none" />
              <div className="h-7 w-7 bg-neutral-200 rounded-none" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Skeleton;
