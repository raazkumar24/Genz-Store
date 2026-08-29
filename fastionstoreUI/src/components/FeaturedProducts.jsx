import React from "react";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

// Featured Products Section Component
const FeaturedProducts = ({ products, loading }) => {
  // Skeleton Loader for this section specifically
  if (loading) {
    return (
      <div className="w-full bg-[var(--color-bg-secondary)] px-3 md:px-8 py-20 border-y border-[var(--color-border)]">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-48 bg-[var(--color-surface)] rounded animate-pulse mb-10"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--color-surface)] animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no products available (fallback)
  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full bg-[var(--color-bg-secondary)] px-3 py-20 md:py-28 md:px-8 overflow-hidden border-y border-[var(--color-border)]">
      
      {/* Decorative large background text */}
      <div className="absolute -left-10 top-10 opacity-[0.02] pointer-events-none rotate-90 origin-left">
        <h2 className="text-[6rem] md:text-[10rem] font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
          TRENDING
        </h2>
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-text)]/10 bg-white/50 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text)] backdrop-blur-sm mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
              </span>
              Hot Right Now
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              Featured <span className="text-[var(--color-primary)]">Drops</span>
            </h2>
          </div>

          <a href="/shop" className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
            View All
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-[var(--color-border)] transition-transform group-hover:scale-110 group-hover:border-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._uniqueId || product._id} product={product} isFeatured={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
