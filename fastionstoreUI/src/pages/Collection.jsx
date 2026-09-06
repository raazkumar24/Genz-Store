import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { Badge, Card, Button, BackButton } from "../components/ui";
<<<<<<< HEAD
import { SlidersHorizontal } from "lucide-react";
=======
import { SlidersHorizontal, Sparkles } from "lucide-react";
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
import ProductFilters, { applyProductFilters } from "../components/ProductFilters";

// Loading skeleton
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

const Collection = () => {
  const { collectionName } = useParams();
  const { products, loading } = useProducts();

  // Normalize the collection name for display
  const displayTitle = collectionName 
    ? collectionName.charAt(0).toUpperCase() + collectionName.slice(1).replace(/-/g, ' ')
    : "Collection";

  const collectionPills = [
    { label: "All Drops", path: "/new-arrivals" },
    { label: "Oversized Tees", path: "/collections/oversized-tees" },
    { label: "Baggy Cargos", path: "/collections/cargos" },
    { label: "Hoodies & Sweats", path: "/collections/hoodies" },
    { label: "Men's Collection", path: "/collections/men" },
    { label: "Women's Fits", path: "/collections/women" },
    { label: "Clearance Sale", path: "/sale" },
  ];

  const initialFilters = {
    searchQuery: "",
    category: collectionName || "all",
    gender: "all",
    priceRange: "all",
<<<<<<< HEAD
    minPrice: 0,
    maxPrice: Infinity,
=======
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
    size: "all",
    color: "all",
    inStockOnly: false,
    onSaleOnly: false,
    sortBy: "latest",
  };

  const [filters, setFilters] = useState(initialFilters);

  // Sync category filter when collectionName param changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: collectionName || "all",
    }));
  }, [collectionName]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      ...initialFilters,
      category: collectionName || "all",
    });
  };

  // 1. Base collection product subset
  const baseCollectionProducts = useMemo(() => {
    if (!collectionName || !products) return [];
    const searchString = collectionName.toLowerCase().replace(/-/g, ' ').trim();

    return products.filter((p) => {
      if (searchString === 'men' || searchString === 'menswear') {
        return p.gender === 'Men' || p.gender === 'Unisex';
      }
      if (searchString === 'women' || searchString === 'womenswear') {
        return p.gender === 'Women' || p.gender === 'Unisex';
      }

      const cols = Array.isArray(p.collection) 
        ? p.collection.map(c => c.toLowerCase().trim()) 
        : [p.collection ? p.collection.toLowerCase().trim() : ''];

      const isCargosSearch = searchString.includes('cargo') || searchString.includes('baggy') || searchString.includes('pants');
      const isOversizedSearch = searchString.includes('oversized') || searchString.includes('tee');
      const isHoodieSearch = searchString.includes('hoodie');

      if (isCargosSearch) {
        if (cols.some(c => c.includes('cargo') || c.includes('baggy') || c.includes('pant') || c.includes('bottom')) || p.name.toLowerCase().includes('cargo') || p.name.toLowerCase().includes('pant')) return true;
      }
      if (isOversizedSearch) {
        if (cols.some(c => c.includes('oversized') || c.includes('tee') || c.includes('tshirt') || c.includes('t-shirt')) || p.name.toLowerCase().includes('oversized') || p.name.toLowerCase().includes('tee')) return true;
      }
      if (isHoodieSearch) {
        if (cols.some(c => c.includes('hoodie') || c.includes('sweatshirt')) || p.name.toLowerCase().includes('hoodie')) return true;
      }

      return cols.some(item => item && (item.includes(searchString) || searchString.includes(item))) || p.name.toLowerCase().includes(searchString);
    });
  }, [products, collectionName]);

  // 2. Apply dynamic filters (price, size, color, stock, sort)
  const filteredProducts = useMemo(() => {
<<<<<<< HEAD
=======
    // We already filtered by collection in baseCollectionProducts, so pass category: "all" to filter engine
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
    return applyProductFilters(baseCollectionProducts, { ...filters, category: "all" });
  }, [baseCollectionProducts, filters]);

  return (
    <div className="relative w-full min-h-screen bg-[#FBFBFA] flex flex-col">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      {/* Collection Hero Section */}
      <section className="relative z-10 border-b border-neutral-200/80 bg-neutral-100/60 pt-6 pb-8 md:pt-12 md:pb-14 overflow-hidden">
        {/* Subtle Background Watermark Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none whitespace-nowrap select-none">
          <span className="text-[14vw] font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
            {displayTitle}
          </span>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Back Button */}
          <div className="self-start mb-4">
            <BackButton size="sm" />
          </div>

          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
            <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-neutral-700">Collections</span>
            <span className="opacity-50">/</span>
            <span className="text-[var(--color-primary)]">{displayTitle}</span>
          </nav>

          <Badge variant="primary" className="mb-3 px-3 py-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider">
<<<<<<< HEAD
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
=======
            <Sparkles size={13} className="text-white" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
            Streetwear Drop
          </Badge>

          <h1
<<<<<<< HEAD
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-900 break-words max-w-full"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {displayTitle} <span className="text-outline-primary ml-1">Collection</span>
=======
            className="text-3xl font-black uppercase tracking-tight text-neutral-900 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {displayTitle} <span className="text-[var(--color-primary)]">Collection</span>
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
          </h1>
          
          <p className="mt-3 max-w-xl text-xs sm:text-sm text-neutral-600 font-medium md:text-base">
            Heavyweight pure combed cotton, boxy drop-shoulder silhouettes, and signature {displayTitle.toLowerCase()} aesthetics.
          </p>

          {/* Quick Collection Navigation Pills */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-2xl">
            {collectionPills.map((pill, idx) => (
              <Link
                key={idx}
                to={pill.path}
                className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 text-xs font-black uppercase tracking-wider text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors shadow-2xs"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative z-10 mx-auto max-w-7xl px-3 py-6 md:py-10 md:px-8 w-full flex-grow">
        {/* Filter Toolbar */}
        <div className="mb-6">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
<<<<<<< HEAD
            products={baseCollectionProducts}
            totalResults={filteredProducts.length}
            showCategoryTabs={false}
=======
            totalResults={filteredProducts.length}
            showCategoryTabs={false}
            hideCategoryInDrawer={true}
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
          />
        </div>

        {/* Full-width Products Grid */}
        {loading ? (
<<<<<<< HEAD
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
=======
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-white border border-neutral-200 p-8 shadow-xs">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              <SlidersHorizontal size={28} />
            </div>
            <h3 className="text-xl font-black text-neutral-900 uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              No Drops Found
            </h3>
            <p className="mt-2 max-w-sm text-xs text-neutral-500 font-medium">
              No products in {displayTitle} match your active filters. Try clearing your filters or exploring all drops.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
<<<<<<< HEAD
                className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-black uppercase text-neutral-800 hover:bg-neutral-100 cursor-pointer"
=======
                className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-black uppercase text-neutral-800 hover:bg-neutral-100"
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
              >
                Reset Filters
              </button>
              <Button to="/new-arrivals" variant="primary" size="sm">
                View All Drops
              </Button>
            </div>
          </Card>
        ) : (
<<<<<<< HEAD
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
=======
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
            {filteredProducts.map((product) => (
              <div key={product._id} className="transition-transform duration-300 hover:-translate-y-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Collection;
