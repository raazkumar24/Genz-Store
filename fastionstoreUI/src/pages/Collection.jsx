import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { ArrowRight } from "lucide-react";
import { Badge, Card, Button } from "../components/ui";

// Loading skeleton
const ProductSkeleton = () => (
  <Card className="animate-pulse p-4">
    <div className="aspect-[3/4] w-full rounded-xl bg-gray-200" />
    <div className="mt-4 space-y-3">
      <div className="h-4 w-3/4 rounded bg-[var(--color-surface)]" />
      <div className="h-3 w-1/2 rounded bg-[var(--color-surface)]" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-20 rounded bg-[var(--color-surface)]" />
        <div className="h-8 w-24 rounded-full bg-[var(--color-surface)]" />
      </div>
    </div>
  </Card>
);

const Collection = () => {
  const { collectionName } = useParams();
  const { products, loading } = useProducts();

  // Normalize the collection name for display
  const displayTitle = collectionName 
    ? collectionName.charAt(0).toUpperCase() + collectionName.slice(1) 
    : "Collection";

  // Filter products by collection (flexible subset matching)
  const collectionProducts = useMemo(() => {
    if (!collectionName || !products) return [];
    
    const searchString = collectionName.toLowerCase().replace(/-/g, ' ').trim();
    
    return products.filter((p) => {
      // 1. Gender check for Men / Women collection pages
      if (searchString === 'men' || searchString === 'menswear') {
        if (p.gender === 'Men' || p.gender === 'Unisex') return true;
      }
      if (searchString === 'women' || searchString === 'womenswear') {
        if (p.gender === 'Women' || p.gender === 'Unisex') return true;
      }

      const cols = Array.isArray(p.collection) 
        ? p.collection.map(c => c.toLowerCase().trim()) 
        : [p.collection ? p.collection.toLowerCase().trim() : ''];

      // 2. Alias / Synonym group checks (Cargos, Oversized, Hoodies)
      const isCargosSearch = searchString.includes('cargo') || searchString.includes('baggy') || searchString.includes('pants');
      const isOversizedSearch = searchString.includes('oversized') || searchString.includes('tee');
      const isHoodieSearch = searchString.includes('hoodie');

      if (isCargosSearch) {
        if (cols.some(c => c.includes('cargo') || c.includes('baggy') || c.includes('pant') || c.includes('bottom'))) return true;
      }
      if (isOversizedSearch) {
        if (cols.some(c => c.includes('oversized') || c.includes('tee') || c.includes('tshirt') || c.includes('t-shirt'))) return true;
      }
      if (isHoodieSearch) {
        if (cols.some(c => c.includes('hoodie') || c.includes('sweatshirt'))) return true;
      }

      // 3. General flexible collection tags check
      return cols.some(item => item && (item.includes(searchString) || searchString.includes(item)));
    });
  }, [products, collectionName]);

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      {/* Collection Hero Section */}
      <section className="relative z-10 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] pt-10 pb-10 md:pt-24 md:pb-32 overflow-hidden">
        {/* Huge Background Text for aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none whitespace-nowrap">
          <h1 className="text-[15vw] font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
            {displayTitle}
          </h1>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <span className="text-[var(--color-text)]">Collections</span>
            <span className="opacity-50">/</span>
            <span className="text-[var(--color-primary)]">{displayTitle}</span>
          </nav>

          <Badge variant="primary" className="mb-6 px-4 py-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Season '26
          </Badge>

          <h1
            className="text-4xl font-black uppercase tracking-tight text-gray-900 md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {displayTitle} <span className="text-transparent" style={{ WebkitTextStroke: '1px #111' }}>Edition</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
            Explore the latest drops in our {displayTitle} collection. Handpicked premium streetwear and essentials designed to elevate your everyday aesthetic.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="relative z-10 mx-auto max-w-7xl px-3 py-8 md:py-16 md:px-8 w-full flex-grow">
        
        {/* Toolbar (Results count & Filters stub) */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]/50">
          <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
            {loading ? "Loading..." : `${collectionProducts.length} Products`}
          </h2>
          
          {/* Future filter/sort dropdown could go here */}
          <div className="flex gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text)] shadow-sm border border-[var(--color-border)]">
              Latest First
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : collectionProducts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 uppercase" style={{ fontFamily: "var(--font-heading)" }}>
              Empty Drop
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              We haven't dropped anything in the {displayTitle} collection yet. Check back soon!
            </p>
            <div className="mt-8">
              <Button to="/" variant="primary">
                Back to Shop
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4">
            {collectionProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Collection;
