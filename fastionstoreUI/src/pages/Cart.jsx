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
      <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-full max-w-md flex justify-start mb-6">
          <BackButton size="sm" />
        </div>
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400 mb-5 shadow-2xs">
          <ShoppingBag size={38} />
        </div>
        <h1
          className="text-3xl font-black text-neutral-900 uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500 font-medium max-w-sm">
          You haven't added any streetwear drops to your bag yet. Flex your fit
          and start exploring!
        </p>
        <Button
          to="/"
          variant="primary"
          size="lg"
          className="mt-6 flex items-center gap-2 rounded-2xl"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Explore Drops
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-3 py-6 sm:px-6 lg:px-8 pb-24 md:pb-16">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton size="sm" />
        </div>

        {/* Header */}
        <div className="mb-6 flex flex-row items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-black text-neutral-900 uppercase break-words"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shopping <span className="text-outline-primary ml-1">Cart</span>
            </h1>
            <p className="mt-0.5 text-xs text-neutral-500 font-medium">
              {cartCount} {cartCount === 1 ? "item" : "items"} currently in your
              bag
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors cursor-pointer"
          >
            Clear Bag
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
                            e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80";
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
