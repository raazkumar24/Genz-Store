import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Check, Heart, Star } from "lucide-react";

// Simple color mapper for swatches
const colorMap = {
  black: "#111111",
  "carbon black": "#1A1A1A",
  "pitch black": "#0A0A0A",
  white: "#FFFFFF",
  swanwhite: "#F5F5F0",
  red: "#EF4444",
  crimson: "#DC2626",
  "crimson red": "#DC2626",
  wine: "#7F1D1D",
  "wine red": "#7F1D1D",
  maroon: "#800000",
  "oxblood maroon": "#4A0E17",
  brown: "#78350F",
  coffee: "#4B2E1E",
  "coffee brown": "#4B2E1E",
  mocha: "#5C3A21",
  blue: "#2563EB",
  sky: "#38BDF8",
  "sky blue": "#38BDF8",
  "glacier blue": "#93C5FD",
  navy: "#1E3A8A",
  green: "#22C55E",
  olive: "#4D7C0F",
  yellow: "#EAB308",
  pink: "#EC4899",
  purple: "#A855F7",
  orange: "#FF3B00",
  gray: "#6B7280",
  grey: "#6B7280",
  beige: "#D4B996",
  cream: "#EDE6D6",
  "raw ecru": "#F4F0EA",
};

const ProductCard = ({ product, highlight: highlightProp = false, dark = false }) => {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Sync / reset manual swatch selection when product or active display variant changes
  useEffect(() => {
    setSelectedVariantId(null);
  }, [product._id, product.displayVariant?._id, product.matchedVariant?._id]);

  const isFav = isInWishlist(product._id);

  // Active variant resolution
  const activeVariant =
    (selectedVariantId && product.variants?.find((v) => v._id === selectedVariantId)) ||
    product.displayVariant ||
    product.matchedVariant ||
    product.variants?.find((variant) => variant.stock > 0) ||
    product.variants?.[0];

  const isItemInCart = isInCart(product._id, activeVariant?._id) || isInCart(product._id);

  const isOutOfStock =
    product.variants?.length > 0 &&
    product.variants.every((variant) => variant.stock === 0) &&
    product.stock === 0;

  // Base retail display price
  const displayPrice = Number(activeVariant?.price || product.price || 0);

  const colors = [
    ...new Set((product.variants || []).map((v) => v.color).filter(Boolean)),
  ].slice(0, 5);

  const isProductTrending =
    activeVariant?.isTrending ||
    (activeVariant?.keywords &&
      activeVariant.keywords.some((k) => k.toLowerCase() === "hot"));

  const isHighlight = highlightProp || isProductTrending;

  // Check if active variant has an active discounted salePrice
  const isVariantOnSale = Boolean(
    (activeVariant?.isSale || (activeVariant?.salePrice && Number(activeVariant.salePrice) > 0)) &&
    Number(activeVariant?.salePrice) > 0 &&
    Number(activeVariant?.salePrice) < displayPrice
  );

  // Check if any variant is on sale when no specific variant has been selected
  const hasAnySaleVariant = Boolean(
    !selectedVariantId &&
    (product.variants || []).some(
      (v) => (v.isSale || (v.salePrice && Number(v.salePrice) > 0)) &&
             Number(v.salePrice) > 0 &&
             Number(v.salePrice) < Number(v.price || displayPrice)
    )
  );

  let salePrice = 0;
  if (isVariantOnSale) {
    salePrice = Number(activeVariant.salePrice);
  } else if (hasAnySaleVariant) {
    const saleVariants = (product.variants || []).filter(
      (v) => (v.isSale || (v.salePrice && Number(v.salePrice) > 0)) &&
             Number(v.salePrice) > 0 &&
             Number(v.salePrice) < Number(v.price || displayPrice)
    );
    if (saleVariants.length > 0) {
      salePrice = Math.min(...saleVariants.map((v) => Number(v.salePrice)));
    }
  } else if (
    product.isSale &&
    product.salePrice &&
    Number(product.salePrice) > 0 &&
    Number(product.salePrice) < displayPrice
  ) {
    salePrice = Number(product.salePrice);
  }

  const isSaleActive = Boolean(salePrice > 0 && displayPrice > salePrice);

  // Dynamically calculate exact discount percentage from actual retail price and sale price.
  // Never default or fallback to random 20% discount.
  const discountPercent = isSaleActive
    ? Math.round(((displayPrice - salePrice) / displayPrice) * 100)
    : 0;

  const primaryImage =
    activeVariant?.images?.length > 0
      ? activeVariant.images[0]
      : product.image || "/models/model1.png";
  const secondaryImage =
    activeVariant?.images?.length > 1
      ? activeVariant.images[1]
      : primaryImage;

  const productUrl = `/products/${product._id}${
    activeVariant && activeVariant._id ? `?variant=${activeVariant._id}` : ""
  }`;

  // Active color string
  const activeColorName = activeVariant?.color || colors[0] || "Black";

  // GSM weight detection
  const gsmWeight =
    product.specifications?.find((s) => s.key?.toLowerCase() === "weight")?.value ||
    (product.category?.some((c) => c.toLowerCase().includes("hoodie"))
      ? "380 GSM"
      : product.category?.some((c) => c.toLowerCase().includes("cargo"))
      ? "RIPSTOP"
      : "280 GSM");

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col rounded-none border-none shadow-none bg-transparent relative overflow-hidden transition-all duration-300"
    >
      {/* Editorial Garment Showcase Container - Sharp Rectangle (rounded-none, borderless) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none bg-[#F5F5F3] select-none">
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
              e.target.onerror = null;
              e.target.src = "/models/model1.png";
            }}
          />

          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-500 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
              }`}
            />
          )}
        </Link>

        {/* Top-Left Technical Badges (Compact on mobile so garment artwork stays unobstructed) */}
        <div className="absolute top-2 left-2 md:top-2.5 md:left-2.5 z-20 flex flex-row sm:flex-col items-start gap-1 pointer-events-none max-w-[80%] flex-wrap">
          {isSaleActive && discountPercent > 0 && (
            <span className="rounded-none bg-[#e34234] text-white px-1.5 py-0.5 text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-2xs">
              {discountPercent}% OFF
            </span>
          )}
          <span className="hidden sm:inline-block rounded-none bg-white text-neutral-900 border border-neutral-200/50 px-2 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-2xs">
            {gsmWeight}
          </span>
          {isHighlight && (
            <span className="rounded-none bg-black text-white px-1.5 py-0.5 text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-2xs">
              <span className="sm:hidden">HOT</span>
              <span className="hidden sm:inline">HOT DROP</span>
            </span>
          )}
          {(added || isItemInCart) && (
            <span className="rounded-none bg-emerald-600 text-white px-1.5 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-2xs">
              <Check size={9} strokeWidth={3} />
              <span>{added ? "ADDED" : "IN BAG"}</span>
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right overlay - Sharp Minimal) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-30 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-none bg-white/90 hover:bg-white backdrop-blur-md transition-all shadow-2xs cursor-pointer border border-neutral-200/60"
          title={isFav ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
        >
          <Heart
            size={14}
            className={`transition-all duration-200 ${
              isFav ? "fill-[#e34234] text-[#e34234]" : "text-neutral-700 hover:text-black"
            }`}
            strokeWidth={2.2}
          />
        </button>

        {/* Quick Add Size Bar (Bottom overlay on hover - Direct Match to Image 4) */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-black/95 text-white p-2.5 transition-all duration-300 z-20 flex flex-col gap-1.5 ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider">
            <span className="text-neutral-400 font-bold">
              {added ? "ITEM ADDED TO BAG!" : isItemInCart ? "ALREADY IN BAG • SELECT SIZE:" : "QUICK ADD SIZE:"}
            </span>
            <span className="text-[#e34234] font-black">BOXY DROP-SHOULDER</span>
          </div>

          <div className="grid grid-cols-5 gap-1 pt-0.5">
            {["S", "M", "L", "XL", "XXL"].map((sz) => {
              const szVariant =
                product.variants?.find(
                  (v) =>
                    v.size?.toUpperCase() === sz &&
                    v.color?.toLowerCase() === activeVariant?.color?.toLowerCase()
                ) ||
                product.variants?.find((v) => v.size?.toUpperCase() === sz);

              const isSzInStock = szVariant ? szVariant.stock > 0 : true;
              const isSelectedSz = activeVariant?.size?.toUpperCase() === sz;
              const isSzInCart = szVariant && isInCart(product._id, szVariant._id);

              return (
                <button
                  key={sz}
                  type="button"
                  disabled={!isSzInStock}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetVariant = szVariant || activeVariant;
                    if (targetVariant) {
                      addToCart(product, targetVariant, 1);
                      setAdded(true);
                      setTimeout(() => setAdded(false), 2000);
                    }
                  }}
                  className={`py-1 text-center text-[10px] font-black uppercase rounded-none transition-all cursor-pointer ${
                    isSzInCart
                      ? "bg-emerald-700 text-white shadow-xs font-black"
                      : isSelectedSz
                      ? "bg-[#e34234] text-white shadow-xs"
                      : isSzInStock
                      ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white"
                      : "bg-neutral-900 text-neutral-600 line-through cursor-not-allowed"
                  }`}
                  title={isSzInCart ? `${sz} In Bag` : isSzInStock ? `Quick Add ${sz}` : `${sz} Out of Stock`}
                >
                  {isSzInCart ? `✓ ${sz}` : sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-xs z-15">
            <span className="rounded-none bg-black text-white px-3 py-1 text-[10px] md:text-xs font-black tracking-widest uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content & Specification Section - Borderless, Clean, Sharp */}
      <div className="flex flex-col pt-2.5 pb-1 px-0.5 space-y-1">
        {/* Line 1: Brand & Gender (NO //, clean hyphen or dot) + Rating */}
        <div className={`flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider ${dark ? "text-neutral-400" : "text-neutral-400"}`}>
          <span className="truncate">
            {product.brand || "GENZ ARCHIVE"} - {product.gender || "MEN"}
          </span>
          <span className={`flex items-center gap-1 font-bold shrink-0 ${dark ? "text-neutral-300" : "text-neutral-600"}`}>
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span>4.8</span>
          </span>
        </div>

        {/* Line 2: Product Title & Price Row */}
        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <Link
            to={productUrl}
            className="flex-1 min-w-0 group-hover:text-[#e34234] transition-colors"
          >
            <h2
              className={`text-xs sm:text-[13px] md:text-[14px] font-black uppercase tracking-tight truncate leading-snug ${
                dark ? "text-white" : "text-neutral-950"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
              title={product.name}
            >
              {product.name}
            </h2>
          </Link>

          {/* Price Hierarchy */}
          <div className="flex items-baseline gap-1.5 shrink-0 font-mono">
            {isSaleActive && (
              <>
                <span className={`text-xs sm:text-sm font-black ${dark ? "text-white" : "text-neutral-950"}`}>
                  ₹{salePrice}
                </span>
                <span className={`text-[10px] sm:text-[11px] font-normal line-through ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
                  ₹{displayPrice}
                </span>
              </>
            )}
            {!isSaleActive && (
              <span className={`text-xs sm:text-sm font-black ${dark ? "text-white" : "text-neutral-950"}`}>
                ₹{displayPrice}
              </span>
            )}
          </div>
        </div>

        {/* Line 3: Swatch Dots + Active Color Name Text (Matching Image 4) */}
        {colors.length > 0 && (
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              {colors.map((c, i) => {
                const matchedV = product.variants?.find(
                  (v) => v.color?.toLowerCase() === c.toLowerCase()
                );
                const isSelected =
                  activeVariant?.color?.toLowerCase() === c.toLowerCase();
                const cleanColor = c.split(/[- ]+/).pop().toLowerCase();
                const directColor = c.replace(/[^a-zA-Z]/g, "").toLowerCase();
                const bgColor =
                  colorMap[c.toLowerCase()] ||
                  colorMap[directColor] ||
                  colorMap[cleanColor] ||
                  c;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (matchedV?._id) setSelectedVariantId(matchedV._id);
                    }}
                    className={`h-3 w-3 swatch-dot transition-all cursor-pointer border ${
                      isSelected
                        ? dark
                          ? "ring-1.5 ring-white ring-offset-1 ring-offset-[#0E0E10] border-white scale-110"
                          : "ring-1.5 ring-neutral-950 ring-offset-1 border-white scale-110"
                        : dark
                        ? "border-white/30 hover:scale-120"
                        : "border-black/20 hover:scale-120"
                    }`}
                    style={{ backgroundColor: bgColor }}
                    title={c}
                    aria-label={`Color ${c}`}
                  />
                );
              })}
            </div>

            {/* Selected Color Name Text */}
            <span className={`text-[11px] font-medium capitalize truncate ${dark ? "text-neutral-300" : "text-neutral-500"}`}>
              {activeColorName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
