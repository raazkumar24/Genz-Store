import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";
import { Heart, ShoppingBag, ArrowRight, Trash2, ArrowUpRight } from "lucide-react";
import { Button, BackButton } from "../components/ui";

/**
 * Senior Developer Note:
 * Wishlist / Saved Fits Page.
 * Designed with contemporary Bento-Grid container styling, tactile interactions,
 * and bulk "Add All to Cart" capability for quick checkout conversion.
 */
const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddAllToCart = () => {
    let addedCount = 0;
    wishlist.forEach((product) => {
      const activeVar = product.variants?.find((v) => v.stock > 0) || product.variants?.[0];
      if (activeVar) {
        addToCart(product, activeVar, 1);
        addedCount++;
      }
    });
    if (addedCount > 0) {
      addToast(`Added ${addedCount} saved fits to your bag!`, "success");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#F3F4F0] flex flex-col pb-24 pt-4 md:pt-8">
      {/* Background Subtle Grid Accent */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-3 py-4 md:py-8 md:px-8 w-full">
        {/* Navigation & Back Action */}
        <div className="mb-5 flex items-center justify-between">
          <BackButton size="sm" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            GENZ ARCHIVE - SAVED
          </span>
        </div>

        {/* Bento Header Container */}
        <div className="bg-white rounded-none border border-neutral-200/90 p-6 md:p-8 mb-6 md:mb-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-rose-50 text-rose-600 border border-rose-200/60 text-[10px] font-black uppercase tracking-wider mb-2">
              <Heart size={12} className="fill-rose-500 text-rose-500" />
              <span>Personal Vault</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 uppercase break-words"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Saved <span className="text-outline-primary ml-1">Wishlist</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-neutral-500">
              {wishlist.length === 0
                ? "Your streetwear curation is waiting for its first drop."
                : `You have ${wishlist.length} curated silhouette${wishlist.length > 1 ? "s" : ""} saved in your rotation.`}
            </p>
          </div>

          {/* Quick Actions (Add All & Clear) */}
          {wishlist.length > 0 && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="group inline-flex items-center gap-2.5 rounded-none bg-neutral-900 hover:bg-black text-white pl-5 pr-2 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>Add All To Bag</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-neutral-900 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <ShoppingBag size={13} />
                </span>
              </button>

              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 hover:text-red-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                title="Clear Wishlist"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Empty State Card */}
        {wishlist.length === 0 ? (
          <div className="my-10 flex flex-col items-center justify-center text-center p-8 md:p-14 rounded-none bg-white border border-neutral-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] max-w-lg mx-auto">
            <div className="h-20 w-20 rounded-none bg-[#F5F6F1] border border-neutral-200/80 text-rose-500 flex items-center justify-center mb-5 shadow-xs">
              <Heart size={34} className="fill-rose-500/20 text-rose-500" />
            </div>
            <h2
              className="text-xl md:text-2xl font-black text-neutral-900 mb-2 uppercase tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Wishlist is Empty
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mb-6 leading-relaxed font-medium max-w-sm">
              Discover 280+ GSM heavyweight tees, relaxed fleece hoodies, and parachute cargos. Tap the heart icon on any drop to save it here.
            </p>
            <Link
              to="/new-arrivals"
              className="group inline-flex items-center gap-3 rounded-none bg-neutral-900 hover:bg-black text-white pl-6 pr-2.5 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <span>Explore Streetwear Drops</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-neutral-900 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        ) : (
          /* Grid of Saved Products with Bento Styling */
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
