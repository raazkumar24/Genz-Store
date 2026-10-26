import React, { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { BackButton, ProductSkeleton, EmptyState } from "../components/ui";
import { SlidersHorizontal } from "lucide-react";
import ProductFilters, { applyProductFilters } from "../components/ProductFilters";

/**
 * ============================================================================
 * NewArrivals Page Component
 * ============================================================================
 * Fresh streetwear drops catalog with filtering, category pills,
 * reusable ProductSkeleton during loading, aur EmptyState jab koi filter match na ho.
 * ============================================================================
 */

const initialFilters = {
  searchQuery: "",
  category: "all",
  gender: "all",
  priceRange: "all",
  minPrice: 0,
  maxPrice: Infinity,
  size: "all",
  color: "all",
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: "latest",
};

const NewArrivals = () => {
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState(initialFilters);

  // Fresh drops ki base list
  const baseArrivals = useMemo(() => {
    if (!products) return [];
    const items = [];
    products.forEach((product) => {
      if (product.variants && product.variants.some((v) => v.isNewArrival)) {
        items.push(product);
      } else {
        items.push(product);
      }
    });
    return items;
  }, [products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredProducts = useMemo(() => {
    return applyProductFilters(baseArrivals, filters);
  }, [baseArrivals, filters]);

  return (
    <div className="relative w-full min-h-screen bg-[#F4F4F0] flex flex-col pt-4 md:pt-8">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-3 py-4 md:py-8 md:px-8 w-full">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton size="sm" />
        </div>

        {/* Section Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-none bg-neutral-900 text-white px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-widest mb-2 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            </span>
            <span>FRESH STREETWEAR DROPS</span>
          </div>

          <h1
            className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-950 break-words max-w-full"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            New <span className="text-outline-primary ml-1">Arrivals</span>
          </h1>

          <p className="mt-3 max-w-xl text-xs sm:text-sm font-medium text-neutral-600 md:text-base leading-relaxed">
            Be the first to flex. Limited batch cuts, heavyweight 280+ GSM cotton, and oversized statement fits.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-6">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            products={baseArrivals}
            totalResults={filteredProducts.length}
            showCategoryTabs={true}
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-1 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <ProductSkeleton count={8} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={<SlidersHorizontal size={30} className="text-neutral-500" />}
            title="No Drops Matching Filters"
            description="Try adjusting your active filters or reset them to view all fresh streetwear pieces."
            actionText="Reset Filters"
            onActionClick={handleResetFilters}
          />
        ) : (
          <div className="grid grid-cols-2 gap-1 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewArrivals;
