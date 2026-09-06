import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Hero from "../components/hero";
import ProductCard from "../components/ProductCard";
import PromoBanner from "../components/PromoBanner";
import { useProducts } from "../context/ProductContext";
import Marquee from "../components/Marquee";
import CategoryScroll from "../components/CategoryScroll";
import { SlidersHorizontal, ArrowLeft, RefreshCw } from "lucide-react";
import ProductFilters, { applyProductFilters } from "../components/ProductFilters";

// Loading skeleton for products to show before data is fetched
const ProductSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-neutral-200/80 bg-white p-3 space-y-3">
    <div className="aspect-[4/5] w-full rounded-xl bg-neutral-200/60" />
    <div className="space-y-2 pt-1">
      <div className="h-3.5 w-3/4 rounded bg-neutral-200/60" />
      <div className="h-3 w-1/2 rounded bg-neutral-200/60" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-16 rounded bg-neutral-200/60" />
        <div className="h-8 w-8 rounded-full bg-neutral-200/60" />
      </div>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const initialFiltersState = {
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

const Home = () => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState({
    ...initialFiltersState,
    searchQuery: urlSearch,
  });

  // Sync URL search query with filter state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: urlSearch,
    }));
  }, [urlSearch]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFiltersState);
    if (urlSearch) {
      navigate("/");
    }
  };

  // Compute filtered and sorted products
  const filteredProducts = useMemo(() => {
    return applyProductFilters(products, filters);
  }, [products, filters]);

  return (
    <div className="relative w-full min-h-screen bg-[#FBFBFA] flex flex-col">
      {/* Subtle Grid Background Accent */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      {/* Show Hero, Marquee, and Category highlights when not in active search mode */}
      {!urlSearch && (
        <>
          <Marquee
            items={[
              "FREE SHIPPING ON ORDERS OVER ₹999",
              "280 GSM HEAVYWEIGHT COMBED COTTON",
              "DROP 04 IS LIVE WORLDWIDE",
              "14-DAY HASSLE-FREE DOORSTEP EXCHANGE",
              "100% AUTHENTIC STREETWEAR SILHOUETTES",
            ]}
          />
          <Hero />
          <CategoryScroll />
          <PromoBanner />
        </>
      )}

      {/* Main Product Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-14 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-neutral-200/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest mb-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
              </span>
              {urlSearch ? "Search Results" : "Curated Drops"}
            </div>

            <div className="flex items-center gap-3">
              {urlSearch && (
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/80 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                  title="Back to All Drops"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-neutral-900 break-words"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {urlSearch ? (
                  <>
                    Drops For <span className="text-outline-primary ml-1">"{urlSearch}"</span>
                  </>
                ) : (
                  <>
                    Streetwear <span className="text-outline-primary ml-1">Catalog</span>
                  </>
                )}
              </h2>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-500 max-w-md">
              {urlSearch
                ? `Found ${filteredProducts.length} items matching "${urlSearch}".`
                : "Heavyweight 280+ GSM combed cotton, drop-shoulder silhouettes, and boxy fits."}
            </p>
          </div>
        </div>

        {/* Top Filter Controls Component (Toolbar, Tabs & Sort) */}
        <div className="mb-6">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            products={products}
            totalResults={filteredProducts.length}
            showCategoryTabs={!urlSearch}
          />
        </div>

        {/* Full-width Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-white border border-neutral-200/80 p-8 shadow-xs">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <SlidersHorizontal size={28} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>
              No Streetwear Drops Found
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-sm">
              We couldn't find any products matching your selected filters or search query. Try clearing filters or selecting another category.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--color-primary)] transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw size={14} /> Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;
