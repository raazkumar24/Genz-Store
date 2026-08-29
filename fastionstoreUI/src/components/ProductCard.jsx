import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card } from "./ui";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingBag, Check, Heart } from "lucide-react";

// Simple color mapper for swatches
const colorMap = {
  black: "#111111",
  white: "#ffffff",
  swanwhite: "#f8f9fa",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  pink: "#ec4899",
  purple: "#a855f7",
  orange: "#f97316",
  gray: "#6b7280",
  grey: "#6b7280",
  brown: "#92400e",
  navy: "#1e3a8a",
  olive: "#4d7c0f",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  lime: "#84cc16",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  fuchsia: "#d946ef",
  rose: "#f43f5e",
  amber: "#f59e0b",
  sky: "#0284c7",
  "wine red": "#600404",
  gold: "#ffd700",
  silver: "#c0c0c0",
  beige: "#f5f5dc",
  cream: "#fffdd0",
};

const ProductCard = ({ product, highlight: highlightProp = false }) => {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const isFav = isInWishlist(product._id);

  // Active variant resolution
  const activeVariant =
    (selectedVariantId && product.variants?.find((v) => v._id === selectedVariantId)) ||
    product.matchedVariant ||
    product.displayVariant ||
    product.variants?.find((variant) => variant.stock > 0) ||
    product.variants?.[0];

  const isOutOfStock =
    product.variants?.length > 0 &&
    product.variants.every((variant) => variant.stock === 0) &&
    product.stock === 0;

  const displayPrice = activeVariant?.price || product.price || 0;

  const colors = [
    ...new Set((product.variants || []).map((v) => v.color).filter(Boolean)),
  ].slice(0, 5);

  const isProductTrending =
    activeVariant?.isTrending ||
    (activeVariant?.keywords &&
      activeVariant.keywords.some((k) => k.toLowerCase() === "hot"));

  const isHighlight = highlightProp || isProductTrending;

  const isProductSale = activeVariant?.isSale;
  let salePrice = activeVariant?.salePrice || 0;
  if (isProductSale && product.variants) {
    const saleVariants = product.variants.filter(
      (v) => (v.isSale || (v.salePrice && v.salePrice > 0)) && v.salePrice > 0,
    );
    if (saleVariants.length > 0) {
      salePrice = Math.min(...saleVariants.map((v) => v.salePrice));
    }
  }

  const discountPercent =
    isProductSale && salePrice > 0 && displayPrice > salePrice
      ? Math.round(((displayPrice - salePrice) / displayPrice) * 100)
      : 0;

  const primaryImage =
    activeVariant?.images?.length > 0
      ? activeVariant.images[0]
      : "https://placeholder.com/400x500";
  const secondaryImage =
    activeVariant?.images?.length > 1
      ? activeVariant.images[1]
      : primaryImage;

  const productUrl = `/products/${product._id}${
    activeVariant && activeVariant._id ? `?variant=${activeVariant._id}` : ""
  }`;

  const alreadyInCart = activeVariant?._id
    ? isInCart(product._id, activeVariant._id)
    : false;
  const showAdded = alreadyInCart || added;

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col p-2.5 md:p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl md:rounded-[28px] bg-white border border-neutral-100 relative overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-xl md:rounded-[20px] bg-[#f6f6f4]">
        <Link to={productUrl} className="block h-full w-full">
          <img
            src={primaryImage}
            alt={product.name}
            className={`h-full w-full object-cover object-top transition-all duration-700 ease-out ${
              secondaryImage !== primaryImage && isHovered
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100 group-hover:scale-105"
            }`}
            onError={(e) => {
              e.target.src = "https://placeholder.com/400x500";
            }}
          />

          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
              }`}
            />
          )}
        </Link>

        {/* Color Swatches on Bottom Left - Original Overlapping Frosted Pill */}
        {colors.length > 0 && (
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 flex items-center -space-x-1.5 bg-white/75 backdrop-blur-md p-1 md:p-1.5 rounded-full shadow-sm z-20 border border-white/60">
            {colors.map((c, i) => {
              const matchedV = product.variants?.find(
                (v) => v.color?.toLowerCase() === c.toLowerCase()
              );
              const isSelected =
                activeVariant?.color?.toLowerCase() === c.toLowerCase();
              const cleanColor = c.split(/[- ]+/).pop().toLowerCase();
              const directColor = c.replace(/[^a-zA-Z]/g, "").toLowerCase();
              const bgColor =
                colorMap[directColor] || colorMap[cleanColor] || c;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (matchedV?._id) setSelectedVariantId(matchedV._id);
                  }}
                  className={`h-3.5 w-3.5 md:h-4 md:w-4 rounded-full border-[1.5px] border-white shadow-xs transition-all hover:scale-125 hover:z-30 cursor-pointer ${
                    isSelected ? "ring-2 ring-neutral-900 scale-110 z-10" : ""
                  }`}
                  style={{ backgroundColor: bgColor }}
                  title={c}
                />
              );
            })}
          </div>
        )}

        {/* Wishlist / Favorite Heart Button on Top Right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 md:top-3 md:right-3 z-30 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
            isFav
              ? "bg-rose-500 text-white shadow-rose-200"
              : "bg-white/80 text-neutral-700 hover:bg-white hover:text-rose-500 hover:scale-110"
          }`}
          title={isFav ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
        >
          <Heart size={14} className={isFav ? "fill-white" : ""} strokeWidth={2.2} />
        </button>

        {/* Badges on Top Left */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20 flex flex-col gap-1 pointer-events-none">
          {isProductSale && discountPercent > 0 && (
            <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {isHighlight && !isOutOfStock && !discountPercent && (
            <Badge
              variant="primary"
              className="shadow-sm font-bold uppercase tracking-wider text-[9px] md:text-[10px] px-2 py-0.5"
            >
              HOT
            </Badge>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-xs z-10">
            <Badge
              variant="dark"
              className="px-3 py-1 text-[10px] md:text-xs font-black tracking-widest uppercase"
            >
              Sold Out
            </Badge>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 pt-3 md:pt-4 pb-1 px-1">
        {/* Brand & Collection subtitle */}
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          <span className="truncate">{product.brand || "GENZ"}</span>
          <span>{product.gender || "UNISEX"}</span>
        </div>

        {/* Product Name */}
        <Link to={productUrl} className="mt-0.5 group-hover:text-[var(--color-primary)] transition-colors">
          <h2
            className="text-[13px] md:text-[15px] font-bold text-neutral-900 line-clamp-1 leading-tight uppercase tracking-tight"
            title={product.name}
          >
            {product.name}
          </h2>
        </Link>

        {/* Price & Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            {isProductSale && salePrice > 0 ? (
              <>
                <span className="text-sm md:text-base font-extrabold text-[var(--color-primary)]">
                  ₹{salePrice}
                </span>
                <span className="text-[11px] md:text-xs font-bold text-neutral-400 line-through">
                  ₹{displayPrice}
                </span>
              </>
            ) : (
              <span className="text-sm md:text-base font-extrabold text-neutral-900">
                ₹{displayPrice}
              </span>
            )}
          </div>

          {/* Action Button: Quick Add or View Detail */}
          <div className="flex items-center gap-1.5">
            <Link
              to={productUrl}
              className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-bold uppercase tracking-wider text-neutral-800 transition-colors"
            >
              View
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isOutOfStock || !activeVariant || alreadyInCart) return;
                addToCart(product, activeVariant, 1);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
              disabled={isOutOfStock || alreadyInCart}
              className={`flex items-center justify-center h-8 w-8 md:h-9 md:w-9 shrink-0 rounded-full transition-all shadow-xs cursor-pointer ${
                showAdded
                  ? "bg-emerald-500 text-white"
                  : isOutOfStock
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-neutral-900 text-white hover:bg-[var(--color-primary)] hover:shadow-md hover:scale-105"
              }`}
              title={
                isOutOfStock
                  ? "Out of Stock"
                  : alreadyInCart
                  ? "Already in Cart"
                  : "Add to Cart"
              }
              aria-label="Add to Cart"
            >
              {showAdded ? (
                <Check size={15} strokeWidth={2.5} />
              ) : (
                <ShoppingBag size={15} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
