import React from "react";
import ProductCard from "./ProductCard";

/**
 * SimilarProducts Component
 * Displays up to 4 products from the same category as the current product.
 */
const SimilarProducts = ({ currentProduct, allProducts }) => {
  if (!currentProduct || !allProducts || allProducts.length === 0) return null;

  // Find products in the same category, excluding the current one
  const similarProducts = allProducts
    .filter(
      (p) =>
        p._id !== currentProduct._id && p.category === currentProduct.category,
    )
    .slice(0, 4);

  // If there are no similar products in the same category, we can just show some other products as fallback
  const displayProducts =
    similarProducts.length > 0
      ? similarProducts
      : allProducts.filter((p) => p._id !== currentProduct._id).slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <div className="w-full bg-[var(--color-bg)] py-16 md:py-24 border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-3 md:px-8">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-text)]/10 bg-[var(--color-surface)] px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-text)] mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
              </span>
              You Might Also Like
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-[var(--color-text)] tracking-tight uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Similar{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px var(--color-text)" }}
              >
                Drops
              </span>
            </h2>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarProducts;
