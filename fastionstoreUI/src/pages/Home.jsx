import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../components/hero";
import ProductCard from "../components/ProductCard";
import FeauturedProducts from "../components/FeaturedProducts";
import PromoBanner from "../components/PromoBanner";
import { Badge, Card } from "../components/ui";
import { useProducts } from "../context/ProductContext";
import Marquee from "../components/Marquee";
import CategoryScroll from "../components/CategoryScroll";

// Loading skeleton for products to show before data is fetched
const ProductSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
    <div className="aspect-[3/4] w-full rounded-xl bg-[var(--color-surface)]" />
    <div className="mt-4 space-y-3">
      <div className="h-4 w-3/4 rounded bg-[var(--color-surface)]" />
      <div className="h-3 w-1/2 rounded bg-[var(--color-surface)]" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-20 rounded bg-[var(--color-surface)]" />
        <div className="h-8 w-24 rounded-full bg-[var(--color-surface)]" />
      </div>
    </div>
  </div>
);

const Home = () => {
  // Fetching products and loading state from context
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();

  // Extracting search query from URL
  const searchQuery = (searchParams.get("search") || "").trim().toLowerCase();

  // Filtering products based on the search query — name, description, category, keywords bhi check hoga
  // Filtering products based on the search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products
      .map((product) => {
        // Find the specific variant that matches the search (if any)
        const matchedVariant = product.variants?.find((v) => {
          const vHaystack = [v.color, v.size, ...(v.keywords || [])]
            .join(" ")
            .toLowerCase();
          return vHaystack.includes(searchQuery);
        });

        const haystack = [
          product.name,
          product.description,
          product.gender,
          Array.isArray(product.collection) ? product.collection.join(" ") : product.collection,
          ...(product.variants || []).flatMap((v) => v.keywords || []),
        ]
          .join(" ")
          .toLowerCase();

        if (haystack.includes(searchQuery)) {
          return { ...product, matchedVariant: matchedVariant || null };
        }
        return null;
      })
      .filter(Boolean);
  }, [products, searchQuery]);

  // Loading state is now handled inline in the respective sections
  // so the Hero component can render immediately without waiting for products.

  return (
    // Main Container for the Home Page
    <div className="relative w-full min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Background Pattern - Subtle dots */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      {/* Show these sections ONLY when there is no search query */}
      {!searchQuery && (
        <>
          <Marquee
            items={[
              "FREE SHIPPING ON ALL ORDERS OVER ₹999",
              "PREMIUM OVERSIZED TEES",
              "NEW DROPS EVERY FRIDAY",
              "100% SUPIMA COTTON",
            ]}
          />
          <Hero />
          <CategoryScroll />
          <PromoBanner />
        </>
      )}

      {/* Main Product Listing Section */}
      {/* Main Content Area */}
      <section className="relative z-10 mx-auto max-w-7xl px-3 py-8 md:py-16 md:px-8 w-full">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center mt-8">
          <Badge
            variant="primary"
            className="px-4 py-1.5 flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            {searchQuery ? "Search Mode" : "Handpicked for you"}
          </Badge>

          <h2
            className="mt-6 text-4xl font-black uppercase tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {searchQuery ? (
              <>
                Results for{" "}
                <span className="text-[var(--color-primary)]">
                  "{searchQuery}"
                </span>
              </>
            ) : (
              <>
                LATEST{" "}
                <span
                  className="text-transparent"
                  style={{ WebkitTextStroke: "2px #111" }}
                >
                  DROPS
                </span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p className="mt-4 max-w-2xl text-sm font-medium text-gray-500 md:text-base">
            {searchQuery
              ? `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "item" : "items"} that match your search.`
              : "Explore our complete range of fashion essentials. Carefully curated to elevate your everyday style."}
          </p>
        </div>

        {/* Products Grid or Empty State or Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 gap-1 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-[var(--color-primary)]">
              <svg
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No products found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              No matches for "{searchQuery}". Try checking for typos or use a
              broader term.
            </p>
          </Card>
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

export default Home;
