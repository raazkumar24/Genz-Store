import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { Heart, ArrowLeft } from "lucide-react";
import { Button, Badge } from "../components/ui";

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-[var(--color-bg)] flex flex-col pb-24">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-3 py-6 md:py-12 md:px-8 w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="primary" className="mb-3 inline-flex items-center gap-1.5 px-3 py-1">
                <Heart size={14} className="fill-white" />
                Your Favorites
              </Badge>
              <h1
                className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Saved Wishlist
              </h1>
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"} Saved
            </p>
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="my-12 flex flex-col items-center justify-center text-center p-8 md:p-16 rounded-3xl bg-white border border-gray-100 shadow-sm max-w-lg mx-auto">
            <div className="h-20 w-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6">
              <Heart size={36} strokeWidth={1.5} />
            </div>
            <h2
              className="text-2xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Explore our drops and tap the heart icon on any product to save your favorite streetwear pieces here.
            </p>
            <Button to="/" variant="primary" className="px-8 py-3 rounded-full font-bold">
              Explore Drops
            </Button>
          </div>
        ) : (
          /* Grid of Saved Products - Exactly matching Home / Collection / Sale product grid */
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
