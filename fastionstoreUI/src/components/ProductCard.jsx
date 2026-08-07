import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "./ui";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Check } from "lucide-react";

// Simple color mapper for swatches
const colorMap = {
  // --- Original & Common Colors ---
  black: "#111111",
  white: "#ffffff",
  swanwhite: "#f8f9fa", // Added: Off-white / Swan white shade
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

  // --- Extended Shades (Popular CSS & TailWind Colors) ---
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

  // --- Metallic & Earthy Tones ---
  gold: "#ffd700",
  silver: "#c0c0c0",
  bronze: "#cd7f32",
  maroon: "#800000",
  beige: "#f5f5dc",
  cream: "#fffdd0",
  coral: "#ff7f50",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  mint: "#a7f3d0",
  turquoise: "#40e0d0",
  magenta: "#ff00ff",
};

const ProductCard = ({ product, isFeatured = false }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [added, setAdded] = useState(false); // Cart add feedback state

  const primaryVariant =
    product.matchedVariant ||
    product.displayVariant ||
    product.variants?.find((variant) => variant.stock > 0) ||
    product.variants?.[0];

  const isOutOfStock =
    product.variants?.length > 0 &&
    product.variants.every((variant) => variant.stock === 0) &&
    product.stock === 0;

  const displayPrice = primaryVariant?.price || 0;

  const colors = [
    ...new Set((product.variants || []).map((v) => v.color).filter(Boolean)),
  ].slice(0, 4);

  // If we pass isFeatured as true, or if it's trending, we apply the special style
  const isProductTrending =
    primaryVariant?.isTrending ||
    (primaryVariant?.keywords &&
      primaryVariant.keywords.some((k) => k.toLowerCase() === "hot"));

  const highlight = isFeatured || isProductTrending;

  const isProductSale = primaryVariant?.isSale;
  let salePrice = primaryVariant?.salePrice || 0;
  if (isProductSale && product.variants) {
    const saleVariants = product.variants.filter(
      (v) => (v.isSale || (v.salePrice && v.salePrice > 0)) && v.salePrice > 0,
    );
    if (saleVariants.length > 0) {
      salePrice = Math.min(...saleVariants.map((v) => v.salePrice));
    }
  }

  const productUrl = `/products/${product._id}${primaryVariant && primaryVariant._id ? `?variant=${primaryVariant._id}` : ""}`;

  return (
    <Card
      className="group flex flex-col p-2 md:p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl md:rounded-[32px] bg-white border border-gray-100"
    >
      {/* Image Container */}
      <Link
        to={productUrl}
        className="relative block aspect-square md:aspect-[4/5] w-full overflow-hidden rounded-xl md:rounded-[24px] bg-[#f6f6f6]"
      >
        <img
          src={
            primaryVariant?.images?.length > 0
              ? primaryVariant.images[0]
              : "https://placeholder.com/400x500"
          }
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(event) => {
            event.target.src = "https://placeholder.com/400x500";
          }}
        />

        {/* Color Swatches on Top Right */}
        {colors.length > 0 && (
          <div className="absolute top-1.5 right-1.5 md:top-4 md:right-4 flex items-center -space-x-1.5 bg-white/50 backdrop-blur-md p-1 md:p-1.5 rounded-full shadow-sm z-20">
            {colors.map((c, i) => {
              const cleanColor = c.split(/[- ]+/).pop().toLowerCase();
              const directColor = c.replace(/[^a-zA-Z]/g, "").toLowerCase();
              const bgColor =
                colorMap[directColor] || colorMap[cleanColor] || c;
              return (
                <div
                  key={i}
                  className="h-3 w-3 md:h-4 md:w-4 rounded-full border-[1.5px] border-white shadow-sm transition-transform hover:scale-110 hover:z-30 relative"
                  style={{ backgroundColor: bgColor }}
                  title={c}
                />
              );
            })}
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-sm z-10">
            <Badge
              variant="dark"
              className="px-2 py-1 md:px-4 md:py-2 text-[10px] md:text-xs font-bold tracking-widest uppercase"
            >
              Sold Out
            </Badge>
          </div>
        )}

        {/* Featured / Hot Badge */}
        {highlight && !isOutOfStock && (
          <div className="absolute top-1.5 left-1.5 md:top-4 md:left-4 z-10">
            <Badge
              variant="primary"
              className="shadow-sm font-bold uppercase tracking-wider text-[9px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1"
            >
              Hot
            </Badge>
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="flex flex-col flex-1 pt-3 md:pt-5 pb-1 md:pb-2 px-1 md:px-2">
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 md:gap-4">
          <h2
            className="text-[13px] md:text-[15px] font-bold text-gray-900 line-clamp-2 md:line-clamp-1 flex-1 leading-tight"
            title={product.name}
          >
            {product.name.split(" ").slice(0, 2).join(" ")}
          </h2>
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-0 shrink-0">
            {isProductSale && salePrice > 0 ? (
              <div className="flex flex-row md:flex-row items-center gap-1.5">
                <span className="text-[11px] md:text-[13px] font-bold text-gray-400 line-through">
                  ₹{displayPrice}
                </span>
                <span className="text-[13px] md:text-[15px] font-bold text-red-500">
                  ₹{salePrice}
                </span>
              </div>
            ) : (
              <span className="text-[13px] md:text-[15px] font-bold text-gray-900">
                ₹{displayPrice}
              </span>
            )}
          </div>
        </div>

        <div className="mt-0.5 md:mt-1">
          <div className="text-[11px] md:text-[13px] font-medium text-gray-500 truncate" title={`${product.gender || 'Men'} | ${(Array.isArray(product.collection) ? product.collection : [product.collection]).filter(Boolean).join(', ')}`}>
            {product.brand && <span className="font-bold text-gray-700 mr-1">{product.brand} •</span>}
            <span className="font-semibold text-gray-800">{product.gender || 'Men'}</span>
            {(() => {
              const genderLower = (product.gender || 'men').toLowerCase();
              const rawCols = Array.isArray(product.collection) ? product.collection : [product.collection].filter(Boolean);
              const filteredCols = rawCols.filter(c => {
                const item = c.toLowerCase().trim();
                return item !== genderLower && item !== 'men' && item !== 'women' && item !== 'unisex';
              });
              if (filteredCols.length === 0) return null;
              return <span className="text-gray-400"> | {filteredCols.slice(0, 2).join(", ")}</span>;
            })()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2">
          <Link
            to={productUrl}
            className="flex-1 flex items-center justify-center h-8 md:h-10 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-900 transition-colors"
          >
            <span className="hidden sm:inline">More Detail</span>
            <span className="sm:hidden">View</span>
          </Link>

          {(() => {
            const alreadyInCart = primaryVariant?._id
              ? isInCart(product._id, primaryVariant._id)
              : false;
            const showAdded = alreadyInCart || added;

            return (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (isOutOfStock || !primaryVariant || alreadyInCart) return;
                  addToCart(product, primaryVariant, 1);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
                disabled={isOutOfStock || alreadyInCart}
                className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full transition-all shadow-sm ${
                  showAdded
                    ? "bg-green-500 text-white"
                    : isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md hover:scale-105"
                }`}
                title={
                  isOutOfStock
                    ? "Out of Stock"
                    : alreadyInCart
                      ? "Already in Cart"
                      : "Add to Cart"
                }
              >
                {showAdded ? (
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className="md:w-4 md:h-4"
                  />
                ) : (
                  <ShoppingBag size={14} className="md:w-4 md:h-4" />
                )}
              </button>
            );
          })()}
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
