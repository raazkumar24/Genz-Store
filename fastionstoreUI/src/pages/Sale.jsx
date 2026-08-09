import React, { useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { Badge, Card, BackButton } from "../components/ui";

const ProductSkeleton = () => (
  <Card className="animate-pulse p-4">
    <div className="aspect-[3/4] w-full rounded-[16px] bg-gray-200" />
    <div className="mt-4 space-y-3">
      <div className="h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-1/2 rounded bg-gray-200" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-20 rounded bg-gray-200" />
        <div className="h-8 w-24 rounded-full bg-gray-200" />
      </div>
    </div>
  </Card>
);

const Sale = () => {
  const { products, loading } = useProducts();

  const saleProducts = useMemo(() => {
    const saleItems = [];
    products.forEach((product) => {
      if (product.variants) {
        product.variants.forEach((v, index) => {
          if (v.isSale) {
            saleItems.push({
              ...product,
              displayVariant: v,
              _uniqueId: `${product._id}_${index}`,
            });
          }
        });
      }
    });
    return saleItems;
  }, [products]);

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-bg)] flex flex-col pt-4 md:pt-10">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-3 py-6 md:py-12 md:px-8 w-full">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="mb-12 flex flex-col items-center text-center">
          <Badge
            variant="error"
            className="px-4 py-1.5 flex items-center gap-2 text-white"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Limited Time
          </Badge>

          <h2
            className="mt-6 text-4xl font-black uppercase tracking-tight text-red-500 sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Clearance{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1px #111" }}
            >
              Sale
            </span>
          </h2>

          <p className="mt-4 max-w-2xl text-sm font-medium text-gray-500 md:text-base">
            Cop these fits before they're gone. Massive discounts on your
            favorite pieces.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : saleProducts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500">
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
              No sales right now
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Everything is selling out too fast. Keep an eye out for the next
              drop!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-4">
            {saleProducts.map((product) => (
              <div
                key={product._uniqueId || product._id}
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
