import React from "react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";
import { Button, Badge, BackButton } from "../components/ui";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-bg)] flex flex-col pb-24 pt-4 md:pt-8">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-3 py-4 md:py-8 md:px-8 w-full">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton size="sm" />
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8 pb-4 border-b border-neutral-200/80">
          <div className="flex flex-row items-center justify-between gap-4">
            <div>
              <Badge variant="primary" className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider">
                <Heart size={13} className="fill-white" />
                Saved Fits
              </Badge>
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 uppercase break-words"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Saved <span className="text-outline-primary ml-1">Wishlist</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-neutral-500 uppercase tracking-wider">
              {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} Saved
            </p>
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="my-10 flex flex-col items-center justify-center text-center p-8 md:p-14 rounded-3xl bg-white border border-neutral-200/80 shadow-2xs max-w-md mx-auto">
            <div className="h-18 w-18 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
              <Heart size={32} className="fill-red-500" />
            </div>
            <h2
              className="text-xl font-black text-neutral-900 mb-1.5 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Wishlist is Empty
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mb-6 leading-relaxed font-medium">
              Explore our fresh streetwear drops and tap the heart icon to save your favorite fits right here.
            </p>
            <Button to="/new-arrivals" variant="primary" size="md" className="px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider">
              Explore Drops
            </Button>
          </div>
        ) : (
          /* Grid of Saved Products */
          <div className="grid grid-cols-2 gap-1 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
