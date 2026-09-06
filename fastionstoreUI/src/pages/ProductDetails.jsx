import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { Button, Badge, BackButton } from "../components/ui";
import { 
<<<<<<< HEAD
  Heart, ShoppingBag, X, 
  ShieldCheck, RotateCcw, Ruler, Plus, Minus, Share2, 
  MapPin, CheckCircle2, Zap, Check, Flame, Layers
=======
  Heart, ShoppingBag, X, Star, 
  ShieldCheck, RotateCcw, Ruler, Plus, Minus, Share2, 
  MapPin, CheckCircle2, Zap, Check, Flame, Sparkles
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
} from "lucide-react";
import ProductAccordion from "../components/ProductAccordion";
import ProductGallery from "../components/ProductGallery";
import SimilarProducts from "../components/SimilarProducts";

const StarSVG = ({ size = 14, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const uniqueValues = (items, key) => [...new Set(items.map((item) => item[key]).filter(Boolean))];

const colorMap = {
  black: "#111111",
  white: "#FFFFFF",
  red: "#EF4444",
  blue: "#3B82F6",
  green: "#22C55E",
  yellow: "#EAB308",
  pink: "#EC4899",
  purple: "#A855F7",
  orange: "#F97316",
  gray: "#6B7280",
  grey: "#6B7280",
  brown: "#92400E",
  navy: "#1E3A8A",
  olive: "#4D7C0F",
  beige: "#D4B996",
  cream: "#FFFDD0",
  original: "#DDDDDD",
};

const getColorHex = (colorString) => {
  if (!colorString) return "#EEEEEE";
  const lowerColor = colorString.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerColor.includes(key)) {
      return value;
    }
  }
  return colorString;
};

const ProductDetails = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const variantId = searchParams.get("variant");
  const sizeParam = searchParams.get("size");

  const { loading, getProductById, products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const product = getProductById(productId);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState("400001");
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [sizeUnit, setSizeUnit] = useState("in"); // "in" or "cm"
  const [liveViewers] = useState(() => Math.floor(Math.random() * 14) + 12);

  const variants = useMemo(() => {
    if (!product) return [];
    return product.variants || [];
  }, [product]);

  // Set default state when product loads
  useEffect(() => {
    if (!product || variants.length === 0) return;

    let targetVariant = null;
    if (variantId) {
      targetVariant = variants.find((v) => v._id === variantId);
    }

    const firstAvailableVariant =
      targetVariant || variants.find((variant) => variant.stock > 0) || variants[0];

    if (firstAvailableVariant) {
      const sizesArray = (firstAvailableVariant.size || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (sizeParam && sizesArray.includes(sizeParam)) {
        setSelectedSize(sizeParam);
      } else {
        setSelectedSize(sizesArray[0] || "");
      }

      setSelectedColor(firstAvailableVariant.color || "");
      if (firstAvailableVariant.images && firstAvailableVariant.images.length > 0) {
        setActiveImage(firstAvailableVariant.images[0]);
      } else {
        const anyVariantWithImage = variants.find((v) => v.images && v.images.length > 0);
        setActiveImage(anyVariantWithImage ? anyVariantWithImage.images[0] : "");
      }
    }
  }, [product, variants, variantId, sizeParam]);

  const sizes = useMemo(() => {
    const allSizes = [];
    variants.forEach((v) => {
      if (v.size) {
        v.size.split(",").forEach((s) => allSizes.push(s.trim()));
      }
    });
    return [...new Set(allSizes)].filter(Boolean);
  }, [variants]);

  const colors = useMemo(() => uniqueValues(variants, "color"), [variants]);

  // Current selected variant
  const selectedVariant = variants.find(
    (v) =>
      (v.size || "").split(",").map((s) => s.trim()).includes(selectedSize) &&
      v.color === selectedColor
  );

  const availableColorsForSize = variants
    .filter((v) => (v.size || "").split(",").map((s) => s.trim()).includes(selectedSize))
    .map((v) => v.color);

  const availableSizesForColor = useMemo(() => {
    const s = [];
    variants
      .filter((v) => v.color === selectedColor)
      .forEach((v) => {
        if (v.size) {
          v.size.split(",").forEach((sz) => s.push(sz.trim()));
        }
      });
    return s;
  }, [variants, selectedColor]);

  // Images to display for current selected variant
  const displayImages = useMemo(() => {
    if (!product || variants.length === 0) return [];
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    const anyVariantWithImage = variants.find((v) => v.images && v.images.length > 0);
    return anyVariantWithImage ? anyVariantWithImage.images : [];
  }, [product, selectedVariant, variants]);

  useEffect(() => {
    if (displayImages.length > 0 && !displayImages.includes(activeImage)) {
      setActiveImage(displayImages[0]);
    }
  }, [displayImages, activeImage]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const isColorValid = variants.some(
      (v) =>
        (v.size || "").split(",").map((s) => s.trim()).includes(size) &&
        v.color === selectedColor
    );

    if (!isColorValid) {
      const availableVariant =
        variants.find(
          (v) => (v.size || "").split(",").map((s) => s.trim()).includes(size) && v.stock > 0
        ) ||
        variants.find((v) => (v.size || "").split(",").map((s) => s.trim()).includes(size));

      setSelectedColor(availableVariant?.color || "");
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const isSizeValid = variants.some(
      (v) =>
        v.color === color &&
        (v.size || "").split(",").map((s) => s.trim()).includes(selectedSize)
    );

    if (!isSizeValid) {
      const availableVariant =
        variants.find((v) => v.color === color && v.stock > 0) ||
        variants.find((v) => v.color === color);

      const firstSize = availableVariant?.size
        ? availableVariant.size.split(",")[0].trim()
        : "";
      setSelectedSize(firstSize);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return addToast("Please select size and color!", "error");
    if (selectedVariant.stock === 0) return addToast("This variant is out of stock!", "error");
    if (!selectedSize) return addToast("Please select a size!", "error");

    addToCart(product, selectedVariant, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return addToast("Please select size and color!", "error");
    if (selectedVariant.stock === 0) return addToast("This variant is out of stock!", "error");
    if (!selectedSize) return addToast("Please select a size!", "error");

    addToCart(product, selectedVariant, quantity, selectedSize, selectedColor);
    navigate("/cart");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on Genz Store!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Product link copied to clipboard!", "info");
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length >= 5) {
      setPincodeChecked(true);
      addToast("Pincode verified! Free Express delivery available.", "success");
    } else {
      addToast("Please enter a valid 6-digit pincode", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-muted)]">
        <div className="flex items-center gap-3 font-semibold text-lg">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent"></div>
          <span>Loading drop details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] bg-[var(--color-bg)] flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
          Product Not Found
        </h1>
        <p className="mt-2 text-gray-500 max-w-md">The product you are looking for does not exist or has been removed.</p>
        <Button to="/" variant="primary" className="mt-6">
          Back to Home
        </Button>
      </div>
    );
  }

  const isAddDisabled = !selectedVariant || selectedVariant.stock === 0;

  const currentPrice = selectedVariant?.isSale && selectedVariant?.salePrice > 0
    ? selectedVariant.salePrice
    : selectedVariant?.price || variants[0]?.price || 0;

  const originalPrice = selectedVariant?.price || variants[0]?.price || 0;
  const isSaleActive = selectedVariant?.isSale && selectedVariant?.salePrice > 0;
  const discountPercent = isSaleActive && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const savingsAmount = isSaleActive && originalPrice > currentPrice ? originalPrice - currentPrice : 0;

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 md:py-8 pb-36 md:pb-20">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 text-xs md:text-sm text-neutral-500 overflow-hidden font-medium">
            <BackButton size="sm" fallbackPath="/" />
            <span className="text-neutral-300">/</span>
            <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <span className="text-neutral-300">/</span>
            {product.collection && (
              <>
                <Link 
                  to={`/collections/${Array.isArray(product.collection) ? product.collection[0] : product.collection}`} 
                  className="hover:text-neutral-900 transition-colors capitalize truncate hidden sm:inline"
                >
                  {Array.isArray(product.collection) ? product.collection[0] : product.collection}
                </Link>
                <span className="text-neutral-300 hidden sm:inline">/</span>
              </>
            )}
            <span className="text-neutral-900 font-bold truncate">{product.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-[var(--color-primary)] hover:border-neutral-300 transition-colors cursor-pointer shadow-2xs"
              title="Share Product"
            >
              <Share2 size={15} />
            </button>
          </div>
        </nav>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* Left Column: Interactive Product Gallery (Sticky on desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <ProductGallery
              displayImages={displayImages}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              productName={product.name}
              onOpenLightbox={() => setIsLightboxOpen(true)}
            />
          </div>

          {/* Right Column: Buying Options & Streetwear Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-white p-5 sm:p-7 border border-neutral-200/80 shadow-xs">
              
              {/* Header Badges: Brand, Drop & Stock Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest">
                    <Flame size={11} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
                    {product.brand || "GENZ STREETWEAR"}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {product.gender || "UNISEX FIT"}
                  </span>
                </div>

                {selectedVariant ? (
                  <Badge 
                    variant={selectedVariant.stock > 10 ? "success" : selectedVariant.stock > 0 ? "warning" : "error"} 
                    className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider"
                  >
                    {selectedVariant.stock === 0 ? "OUT OF STOCK" : selectedVariant.stock < 10 ? "LOW STOCK" : "IN STOCK"}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] font-black">UNAVAILABLE</Badge>
                )}
              </div>

              {/* Product Title */}
              <h1
<<<<<<< HEAD
                className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-neutral-900 leading-tight mb-2.5 break-words"
=======
                className="text-2xl sm:text-3xl lg:text-[2rem] font-black uppercase tracking-tight text-neutral-900 leading-tight mb-2.5"
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.name}
              </h1>

              {/* Live Demand & Rating Pulse */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
<<<<<<< HEAD
                    <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                    <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                    <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                    <StarSVG size={14} className="fill-amber-400 text-amber-400" />
                    <StarSVG size={14} className="fill-amber-400 text-amber-400" />
=======
                    <Star size={14} className="fill-amber-400" />
                    <Star size={14} className="fill-amber-400" />
                    <Star size={14} className="fill-amber-400" />
                    <Star size={14} className="fill-amber-400" />
                    <Star size={14} className="fill-amber-400" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                  </div>
                  <span className="text-xs font-black text-neutral-900">4.9</span>
                  <span className="text-xs font-medium text-neutral-400">(142 Reviews)</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>{liveViewers} people viewing this fit</span>
                </div>
              </div>

              {/* Price Module */}
              <div className="space-y-1.5 pb-5 border-b border-neutral-100">
<<<<<<< HEAD
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                  {isSaleActive ? (
                    <>
                      <span className="text-2xl sm:text-4xl font-black text-red-500" style={{ fontFamily: "var(--font-heading)" }}>
                        ₹{currentPrice}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-neutral-400 line-through">
=======
                <div className="flex items-baseline gap-3">
                  {isSaleActive ? (
                    <>
                      <span className="text-3xl sm:text-4xl font-black text-red-500" style={{ fontFamily: "var(--font-heading)" }}>
                        ₹{currentPrice}
                      </span>
                      <span className="text-lg font-bold text-neutral-400 line-through">
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                        ₹{originalPrice}
                      </span>
                      {discountPercent > 0 && (
                        <span className="rounded-lg bg-red-100 px-2.5 py-0.5 text-xs font-black text-red-600">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </>
                  ) : (
<<<<<<< HEAD
                    <span className="text-2xl sm:text-4xl font-black text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>
                      ₹{currentPrice}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-neutral-400 ml-auto hidden xs:inline">Inclusive of all taxes</span>
=======
                    <span className="text-3xl sm:text-4xl font-black text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>
                      ₹{currentPrice}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-neutral-400 ml-auto">Inclusive of all taxes</span>
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                </div>

                {savingsAmount > 0 && (
                  <p className="text-xs font-bold text-emerald-600">
                    ⚡ You save ₹{savingsAmount} on this limited streetwear drop!
                  </p>
                )}
              </div>

              {/* Color Swatch Picker */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Colour: <span className="font-extrabold text-[var(--color-primary)] capitalize">{selectedColor || "Select"}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color) => {
                    const hasSelectedSize = availableColorsForSize.includes(color);
                    const colorVariants = variants.filter((v) => v.color === color);
                    const allOutOfStock = colorVariants.every((v) => v.stock === 0);
                    const firstVariantWithImage = colorVariants.find((v) => v.images && v.images.length > 0);
                    const variantImage = firstVariantWithImage ? firstVariantWithImage.images[0] : null;
                    const bgHex = getColorHex(color);
                    const isSelected = selectedColor === color;

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        disabled={allOutOfStock}
                        title={color}
                        className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25 shadow-sm scale-105"
                            : "border-neutral-200 hover:border-neutral-400"
                        } ${!hasSelectedSize ? "opacity-60" : ""} ${allOutOfStock ? "cursor-not-allowed opacity-40" : ""}`}
                        style={{ backgroundColor: !variantImage ? bgHex : undefined }}
                      >
                        {variantImage ? (
                          <img src={variantImage} alt={color} className="h-full w-full object-cover" />
                        ) : (
                          isSelected && (
                            <Check size={14} className={bgHex === "#FFFFFF" || bgHex === "#FFFDD0" ? "text-neutral-900" : "text-white"} strokeWidth={3} />
                          )
                        )}
                        {allOutOfStock && (
                          <svg className="absolute inset-0 h-full w-full stroke-red-500 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="0" y1="100" x2="100" y2="0" strokeWidth="4" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector & Guide */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Select Size: <span className="font-extrabold text-[var(--color-primary)]">{selectedSize || "Select"}</span>
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <Ruler size={13} />
                    <span>Size Guide & Fit</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((size) => {
                    const hasSelectedColor = availableSizesForColor.includes(size);
                    const sizeVariants = variants.filter((v) =>
                      (v.size || "").split(",").map((s) => s.trim()).includes(size)
                    );
                    const allOutOfStock = sizeVariants.every((v) => v.stock === 0);
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        disabled={allOutOfStock}
                        className={`relative flex h-11 items-center justify-center rounded-xl border text-xs font-black uppercase transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-xs"
                            : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                        } ${!hasSelectedColor ? "opacity-60" : ""} ${
                          allOutOfStock ? "cursor-not-allowed opacity-40 bg-neutral-50 text-neutral-400" : ""
                        }`}
                      >
                        {size}
                        {allOutOfStock && (
                          <svg className="absolute inset-0 h-full w-full stroke-neutral-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="0" y1="100" x2="100" y2="0" strokeWidth="2" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <p className="mt-2 text-[11px] font-medium text-neutral-500 flex items-center gap-1">
<<<<<<< HEAD
                  <Flame size={12} className="text-[var(--color-primary)]" />
=======
                  <Sparkles size={12} className="text-amber-500" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                  <span><strong>Fit Advice:</strong> Relaxed boxy streetwear silhouette. Order true size for relaxed look.</span>
                </p>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2.5">
                  {/* Quantity Stepper */}
                  <div className="flex h-12 items-center rounded-xl border border-neutral-200 bg-neutral-50 px-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-white hover:shadow-2xs transition cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-black text-neutral-900 text-xs">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-white hover:shadow-2xs transition cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Add To Bag Button */}
                  <Button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddDisabled}
                    variant="primary"
                    size="lg"
                    icon={!isAddDisabled ? <ShoppingBag size={17} /> : undefined}
                    className="flex-1 h-12 text-xs font-black uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isAddDisabled ? "SOLD OUT" : "ADD TO BAG"}
                  </Button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => product && toggleWishlist(product)}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                      product && isInWishlist(product._id)
                        ? "border-red-500 bg-red-500 text-white shadow-xs"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-red-500 hover:text-red-500"
                    }`}
                    title={product && isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={20} className={product && isInWishlist(product._id) ? "fill-white" : ""} />
                  </button>
                </div>

                {/* Buy Now Direct Button */}
                {!isAddDisabled && (
                  <Button
                    type="button"
                    onClick={handleBuyNow}
                    variant="white"
                    size="lg"
                    className="w-full h-12 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    icon={<Zap size={16} className="text-amber-400 fill-amber-400" />}
                  >
                    BUY IT NOW — EXPRESS CHECKOUT
                  </Button>
                )}
              </div>

              {/* Delivery Pincode Checker */}
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <p className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[var(--color-primary)]" />
                  Check Delivery Speed & Cash on Delivery
                </p>
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ""));
                      setPincodeChecked(false);
                    }}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-black uppercase tracking-wider text-white hover:bg-neutral-800 transition cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {pincodeChecked && (
                  <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 font-semibold border border-emerald-200">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Free Express Delivery by <strong>Tomorrow / 48 hrs</strong> to {pincode}</span>
                  </div>
                )}
              </div>

              {/* 4 Pillars of Trust (Aligned to Site Streetwear Brand) */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 border-t pt-5 border-neutral-100">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <Zap size={16} className="text-[var(--color-primary)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-neutral-900">Fast Dispatch</p>
                    <p className="text-[10px] text-neutral-500">Ships within 24-48 Hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
<<<<<<< HEAD
                  <Layers size={16} className="text-[var(--color-primary)] shrink-0" />
=======
                  <Sparkles size={16} className="text-[var(--color-primary)] shrink-0" />
>>>>>>> 7081665a6d106e8c80164200e2652d9cda3ac5f8
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-neutral-900">280 GSM Cotton</p>
                    <p className="text-[10px] text-neutral-500">Heavyweight Pure Combed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <RotateCcw size={16} className="text-[var(--color-primary)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-neutral-900">14-Day Exchanges</p>
                    <p className="text-[10px] text-neutral-500">Hassle-Free Doorstep Return</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                  <ShieldCheck size={16} className="text-[var(--color-primary)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase text-neutral-900">100% Authentic</p>
                    <p className="text-[10px] text-neutral-500">Original Genz Streetwear</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Full Width Product Specifications & Details Card */}
        <div className="mt-8 md:mt-12 rounded-3xl bg-white p-5 sm:p-8 border border-neutral-200/80 shadow-xs">
          <ProductAccordion product={product} />
        </div>

      </div>

      {/* Similar Products Recommendation */}
      <SimilarProducts currentProduct={product} allProducts={products} />

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center max-w-4xl w-full max-h-[90vh]">
            <img
              src={activeImage || displayImages[0]}
              alt={product.name}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
            {displayImages.length > 1 && (
              <div className="flex items-center gap-3 mt-6 overflow-x-auto p-2">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                      activeImage === img ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center justify-between mb-4 pr-8">
              <div>
                <h3 className="text-xl font-black uppercase text-neutral-900" style={{ fontFamily: "var(--font-heading)" }}>
                  Size & Measurement Guide
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Boxy Oversized Streetwear Fit</p>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center rounded-xl bg-neutral-100 p-1">
                <button
                  onClick={() => setSizeUnit("in")}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition cursor-pointer ${
                    sizeUnit === "in" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setSizeUnit("cm")}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition cursor-pointer ${
                    sizeUnit === "cm" ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500"
                  }`}
                >
                  CM
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-neutral-700">
                <thead className="bg-neutral-100 text-neutral-900 uppercase font-black">
                  <tr>
                    <th className="p-3 rounded-l-xl">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Shoulder Drop</th>
                    <th className="p-3 rounded-r-xl">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="p-3 font-black text-neutral-900">S</td>
                    <td className="p-3">{sizeUnit === "in" ? '42"' : "106 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '28"' : "71 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '21"' : "53 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '8.5"' : "21.5 cm"}</td>
                  </tr>
                  <tr className="bg-neutral-50/50">
                    <td className="p-3 font-black text-neutral-900">M</td>
                    <td className="p-3">{sizeUnit === "in" ? '44"' : "112 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '29"' : "73.5 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '22"' : "56 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '9"' : "23 cm"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-neutral-900">L</td>
                    <td className="p-3">{sizeUnit === "in" ? '46"' : "117 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '30"' : "76 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '23"' : "58.5 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '9.5"' : "24 cm"}</td>
                  </tr>
                  <tr className="bg-neutral-50/50">
                    <td className="p-3 font-black text-neutral-900">XL</td>
                    <td className="p-3">{sizeUnit === "in" ? '48"' : "122 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '31"' : "78.5 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '24"' : "61 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '10"' : "25.5 cm"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-neutral-900">XXL</td>
                    <td className="p-3">{sizeUnit === "in" ? '50"' : "127 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '32"' : "81 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '25"' : "63.5 cm"}</td>
                    <td className="p-3">{sizeUnit === "in" ? '10.5"' : "26.5 cm"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5 rounded-2xl bg-neutral-50 p-4 border border-neutral-100 text-xs text-neutral-600 space-y-1.5">
              <p className="font-bold text-neutral-900">Fitting Tip:</p>
              <p>• Model is 6'1" (185 cm) wearing Size L for an authentic drop-shoulder streetwear fit.</p>
              <p>• For a tailored/regular fit, order one size down from your usual size.</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sticky Mobile Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-neutral-900 truncate">{product.name}</p>
            <p className="text-base font-black text-[var(--color-primary)]">₹{currentPrice}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAddDisabled}
            variant="primary"
            size="md"
            className="flex-1 text-xs font-black uppercase tracking-wider py-3 shadow-md"
          >
            {isAddDisabled ? "Sold Out" : "Add to Bag"}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
