import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Button, BackButton } from "../components/ui";

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    cartCount,
    cartQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "GENZ10" || code === "FIRST10") {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      addToast("10% Discount Applied Successfully!", "success");
    } else if (code === "STREET20" && cartTotal >= 1999) {
      setDiscountPercent(20);
      setAppliedCoupon(code);
      addToast("20% Streetwear VIP Discount Applied!", "success");
    } else if (code === "STREET20" && cartTotal < 1999) {
      addToast("STREET20 requires a minimum cart value of ₹1,999", "error");
    } else {
      addToast("Invalid or expired promo code", "error");
    }
  };

  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F3F4F0] flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
        {/* Background Subtle Grid Accent */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:32px_32px]" />
        </div>

        <div className="relative z-10 w-full max-w-md flex justify-start mb-6">
          <BackButton size="sm" />
        </div>

        <div className="relative z-10 bg-white rounded-[32px] border border-neutral-200/90 p-8 sm:p-12 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col items-center max-w-md w-full">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#F5F6F1] border border-neutral-200/80 text-neutral-800 mb-5 shadow-xs">
            <ShoppingBag size={34} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-medium max-w-sm leading-relaxed">
            You haven't added any streetwear drops to your bag yet. Check our new arrivals and drop-shoulder silhouettes!
          </p>
          <Link
            to="/new-arrivals"
            className="mt-6 group inline-flex items-center gap-3 rounded-full bg-neutral-900 hover:bg-black text-white pl-6 pr-2.5 py-2.5 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <span>Explore Drops</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-neutral-900 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
              <ArrowRight size={14} strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F0] px-3 py-6 sm:px-6 lg:px-8 pb-24 md:pb-16 relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Back Button */}
        <div className="mb-4 flex items-center justify-between">
          <BackButton size="sm" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            CHECKOUT // BAG
          </span>
        </div>

        {/* Bento Header */}
        <div className="bg-white rounded-[28px] border border-neutral-200/90 p-6 md:p-8 mb-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-row items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 uppercase break-words"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shopping <span className="text-outline-primary ml-1">Bag</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
              {cartCount} {cartCount === 1 ? "drop" : "drops"} reserved in your rotation
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 hover:text-red-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
          {/* Cart Items List */}
          <div className="space-y-3.5">
            {cartItems.map((item) => {
              const displaySize = item.size
                ? item.size.split(",")[0].trim()
                : "";
              let productUrl = `/products/${item.productId}`;
              const params = new URLSearchParams();
              if (item.variantId) params.append("variant", item.variantId);
              if (item.size) params.append("size", item.size);
              if (params.toString()) {
                productUrl += `?${params.toString()}`;
              }

              return (
                <div
                  key={`${item.productId}-${item.variantId}-${item.size}`}
                  className="rounded-3xl bg-white p-4 sm:p-5 border border-neutral-200/80 shadow-2xs hover:border-neutral-300 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      to={productUrl}
                      className="relative h-22 w-22 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-[#f8f8f7] hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/models/model1.png";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag size={24} className="text-neutral-300" />
                        </div>
                      )}
                    </Link>

                    {/* Product Info & Controls */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={productUrl}
                            className="font-black text-neutral-900 text-sm sm:text-base leading-snug line-clamp-1 hover:text-[var(--color-primary)] transition-colors uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {item.name}
                          </Link>

                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {item.color && (
                              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-black uppercase text-neutral-700">
                                {item.color}
                              </span>
                            )}
                            {displaySize && (
                              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-black uppercase text-neutral-700">
                                Size: {displaySize}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove Trash Button */}
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.productId,
                              item.variantId,
                              item.size,
                            )
                          }
                          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Price & Quantity Bar */}
                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-100">
                        <span className="text-base sm:text-lg font-black text-neutral-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 px-1 py-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-600 hover:bg-white disabled:opacity-30 transition cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            disabled={
                              item.maxStock && item.quantity >= item.maxStock
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-600 hover:bg-white transition cursor-pointer disabled:opacity-30"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Box */}
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Promo Code Card */}
            <div className="rounded-3xl bg-white p-5 border border-neutral-200/80 shadow-2xs">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-900 block mb-2.5 flex items-center gap-1.5">
                <Tag size={13} className="text-[var(--color-primary)]" />
                Apply Promo Code
              </span>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Try: GENZ10"
                  className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-bold text-neutral-900 uppercase focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-black uppercase text-white hover:bg-[var(--color-primary)] transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 font-bold border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Check size={13} className="text-emerald-600" />
                    Code {appliedCoupon} applied ({discountPercent}% OFF)
                  </span>
                  <button
                    onClick={() => {
                      setDiscountPercent(0);
                      setAppliedCoupon("");
                    }}
                    className="text-xs text-emerald-700 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="rounded-3xl bg-white p-6 border border-neutral-200/80 shadow-2xs">
              <h2
                className="text-base font-black text-neutral-900 uppercase tracking-wide mb-4 pb-3 border-b border-neutral-100"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs font-semibold">
                <div className="flex justify-between text-neutral-600">
                  <span>Bag Subtotal ({cartQuantity ?? cartCount} {(cartQuantity ?? cartCount) === 1 ? "item" : "items"})</span>
                  <span className="font-bold text-neutral-900">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Express Shipping</span>
                  <span className="font-black text-emerald-600 uppercase">
                    FREE
                  </span>
                </div>

                <div className="border-t border-neutral-100 pt-3 flex justify-between text-base font-black text-neutral-900">
                  <span>Grand Total</span>
                  <span className="text-lg text-[var(--color-primary)]">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                fullWidth
                variant="primary"
                size="lg"
                className="mt-5 h-12 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                onClick={() =>
                  addToast("Proceeding to secure checkout...", "info")
                }
              >
                Proceed to Checkout
              </Button>

              <Link
                to="/"
                className="mt-3 flex items-center justify-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors py-1"
              >
                ← Continue Browsing Drops
              </Link>

              {/* Guarantees */}
              <div className="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center text-[9px] font-black uppercase text-neutral-500">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={14} className="text-neutral-700" />
                  <span>Secure SSL</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck size={14} className="text-neutral-700" />
                  <span>Free Express</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw size={14} className="text-neutral-700" />
                  <span>14-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
