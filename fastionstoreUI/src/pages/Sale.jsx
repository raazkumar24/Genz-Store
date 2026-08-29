import React, { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { Badge, Card, BackButton } from "../components/ui";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import ProductFilters, { applyProductFilters } from "../components/ProductFilters";

const ProductSkeleton = () => (
  <Card className="animate-pulse p-4 rounded-2xl md:rounded-[28px] bg-white border border-neutral-100">
    <div className="aspect-square md:aspect-[4/5] w-full rounded-xl md:rounded-[20px] bg-neutral-200" />
    <div className="mt-4 space-y-3">
      <div className="h-4 w-3/4 rounded bg-neutral-200" />
      <div className="h-3 w-1/2 rounded bg-neutral-200" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-20 rounded bg-neutral-200" />
        <div className="h-8 w-24 rounded-full bg-neutral-200" />
      </div>
    </div>
  </Card>
);

const initialFilters = {
  searchQuery: "",
  category: "all",
  gender: "all",
  priceRange: "all",
  size: "all",
  color: "all",
  inStockOnly: false,
  onSaleOnly: true,
  sortBy: "latest",
};

const Sale = () => {
  const { products, loading } = useProducts();
  const [filters, setFilters] = useState(initialFilters);

  const baseSaleProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const hasSaleVariant = p.variants?.some((v) => v.isSale || (v.salePrice && v.salePrice > 0));
      return hasSaleVariant || p.isSale;
    });
  }, [products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredProducts = useMemo(() => {
    return applyProductFilters(baseSaleProducts, { ...filters, onSaleOnly: false });
  }, [baseSaleProducts, filters]);

  return (
    <div className="relative w-full min-h-screen bg-[#FBFBFA] flex flex-col pt-4 md:pt-8">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-3 py-4 md:py-8 md:px-8 w-full">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton size="sm" />
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <Badge
            variant="error"
            className="px-3.5 py-1 flex items-center gap-2 text-white text-xs font-black uppercase tracking-wider"
          >
            <Flame size={14} className="fill-white animate-pulse" />
            Clearance Flash Deals
          </Badge>

          <h2
            className="mt-4 text-3xl font-black uppercase tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Clearance <span className="text-red-500">Sale</span>
          </h2>

          <p className="mt-3 max-w-xl text-xs sm:text-sm font-medium text-neutral-600 md:text-base">
            Cop these fits before they're gone forever. Heavy discounts on seasonal drops and limited archival inventory.
          </p>

          {/* Quick Categories Bar */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/collections/oversized-tees" className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs">
              Oversized Tees
            </Link>
            <Link to="/collections/cargos" className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-900 hover:text-white transition shadow-2xs">
              Cargos
            </Link>
            <Link to="/new-arrivals" className="px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-black uppercase tracking-wider hover:bg-[var(--color-primary)] transition shadow-2xs">
              Fresh Drops
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-6">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
            showCategoryTabs={true}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-white border border-neutral-200 p-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Flame size={28} />
            </div>
            <h3
              className="text-xl font-black text-neutral-900 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No active sale deals matching filters
            </h3>
            <p className="mt-2 max-w-sm text-xs text-neutral-500 font-medium">
              Try adjusting your active filters or clear them to see all clearance items.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-black uppercase text-neutral-800 hover:bg-neutral-100"
              >
                Reset Filters
              </button>
              <Link to="/new-arrivals" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-neutral-900 text-white font-black text-xs uppercase tracking-wider hover:bg-[var(--color-primary)] transition shadow-sm">
                Shop New Arrivals
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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

export default Sale;
