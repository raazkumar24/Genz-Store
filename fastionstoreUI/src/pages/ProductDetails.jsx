import React, { useState, useEffect, useMemo } from "react";
import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { Button, BackButton } from "../components/ui";
import {
  Heart,
  ShoppingBag,
  X,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Share2,
  MapPin,
  CheckCircle2,
  Zap,
  Check,
  Layers,
  Eye,
  Star,
  Sparkles,
} from "lucide-react";
import ProductAccordion from "../components/ProductAccordion";
import ProductGallery from "../components/ProductGallery";
import SimilarProducts from "../components/SimilarProducts";


const uniqueValues = (items, key) => [
  ...new Set(items.map((item) => item[key]).filter(Boolean)),
];

const colorMap = {
  black: "#111111",
  white: "#FFFFFF",
  red: "#EF4444",
  crimson: "#EF4444",
  wine: "#EF4444",
  blue: "#2563EB",
  green: "#22C55E",
  yellow: "#EAB308",
  pink: "#EC4899",
  purple: "#A855F7",
  orange: "#F97316",
  gray: "#6B7280",
  grey: "#6B7280",
  brown: "#78350F",
  coffee: "#78350F",
  mocha: "#78350F",
  navy: "#1E3A8A",
  olive: "#4D7C0F",
  beige: "#D4B996",
  cream: "#D4B996",
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
  const { addToCart, isInCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const product = getProductById(productId);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
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
      targetVariant ||
      variants.find((variant) => variant.stock > 0) ||
      variants[0];

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
      if (
        firstAvailableVariant.images &&
        firstAvailableVariant.images.length > 0
      ) {
        setActiveImage(firstAvailableVariant.images[0]);
      } else {
        const anyVariantWithImage = variants.find(
          (v) => v.images && v.images.length > 0,
        );
        setActiveImage(
          anyVariantWithImage ? anyVariantWithImage.images[0] : "",
        );
      }
    }
  }, [product, variants, variantId, sizeParam]);

  const colors = useMemo(() => uniqueValues(variants, "color"), [variants]);

  // Current selected variant
  const selectedVariant = variants.find(
    (v) =>
      (v.size || "")
        .split(",")
        .map((s) => s.trim())
        .includes(selectedSize) && v.color === selectedColor,
  );

  // Helper to find representative image for a specific color variant
  const getColorVariantImage = (colorName) => {
    if (!colorName) return activeImage || "";
    const matchingVariant = variants.find(
      (v) =>
        v.color &&
        v.color.toLowerCase() === colorName.toLowerCase() &&
        v.images &&
        v.images.length > 0,
    );
    if (matchingVariant && matchingVariant.images[0]) {
      return matchingVariant.images[0];
    }
    if (product?.images && product.images.length > 0) {
      return product.images[0];
    }
    return activeImage || product?.image || "/collections/oversized_tees.png";
  };

  // Images to display for current selected variant
  const displayImages = useMemo(() => {
    if (!product) return [];
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      return selectedVariant.images;
    }
    const anyVariantWithImage = variants.find(
      (v) => v.images && v.images.length > 0,
    );
    if (anyVariantWithImage) return anyVariantWithImage.images;
    if (product.images && product.images.length > 0) return product.images;
    return product.image ? [product.image] : [];
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
        (v.size || "")
          .split(",")
          .map((s) => s.trim())
          .includes(size) && v.color === selectedColor,
    );

    if (!isColorValid) {
      const availableVariant =
        variants.find(
          (v) =>
            (v.size || "")
              .split(",")
              .map((s) => s.trim())
              .includes(size) && v.stock > 0,
        ) ||
        variants.find((v) =>
          (v.size || "")
            .split(",")
            .map((s) => s.trim())
            .includes(size),
        );

      setSelectedColor(availableVariant?.color || "");
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const isSizeValid = variants.some(
      (v) =>
        v.color === color &&
        (v.size || "")
          .split(",")
          .map((s) => s.trim())
          .includes(selectedSize),
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
    if (!selectedVariant)
      return addToast("Please select size and color!", "error");
    if (selectedVariant.stock === 0)
      return addToast("This variant is out of stock!", "error");
    if (!selectedSize) return addToast("Please select a size!", "error");

    addToCart(product, selectedVariant, quantity, selectedSize, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!selectedVariant)
      return addToast("Please select size and color!", "error");
    if (selectedVariant.stock === 0)
      return addToast("This variant is out of stock!", "error");
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
      <div className="flex min-h-[80vh] items-center justify-center bg-[#F4F4F0] text-neutral-600">
        <div className="flex items-center gap-3 font-black text-sm uppercase tracking-wider">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent"></div>
          <span>Loading drop details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] bg-[#F4F4F0] flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1
          className="text-3xl font-black text-neutral-900 uppercase"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Product Not Found
        </h1>
        <p className="mt-2 text-sm text-neutral-500 max-w-md">
          The product you are looking for does not exist or has been archived.
        </p>
        <Button
          to="/"
          variant="primary"
          className="mt-6 rounded-none px-6 py-2.5 font-black uppercase text-xs"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const isAddDisabled = !selectedVariant || selectedVariant.stock === 0;

  const originalPrice = Number(selectedVariant?.price || variants[0]?.price || 0);

  const isSaleActive = Boolean(
    (selectedVariant?.isSale || (selectedVariant?.salePrice && Number(selectedVariant.salePrice) > 0)) &&
    Number(selectedVariant?.salePrice) > 0 &&
    Number(selectedVariant?.salePrice) < originalPrice
  );

  const currentPrice = isSaleActive ? Number(selectedVariant.salePrice) : originalPrice;

  const savingsAmount = isSaleActive ? originalPrice - currentPrice : 0;

  const discountPercent =
    isSaleActive && originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  // Check if current variant or size is already in cart
  const isAlreadyInCart = Boolean(
    product &&
      (selectedVariant?._id
        ? isInCart(product._id, selectedVariant._id)
        : (cartItems || []).some(
            (item) =>
              item.productId === product._id && item.size === selectedSize,
          )),
  );

  return (
    <div className="bg-[#F4F4F0] min-h-screen relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-6 pb-28 md:pb-16 relative z-10">
        {/* Top Breadcrumb & SKU Navigation (Matching Image 2) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200/80 pb-3">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <BackButton
              size="sm"
              fallbackPath="/"
              className="rounded-none border-neutral-300"
            />
            <Link to="/" className="hover:text-black transition-colors">
              HOME
            </Link>
            <span>&gt;</span>
            <Link
              to={`/collections/${Array.isArray(product.collection) ? product.collection[0] : product.collection || "oversized-tees"}`}
              className="hover:text-black transition-colors capitalize truncate"
            >
              {Array.isArray(product.collection)
                ? product.collection[0]
                : product.collection || "OVERSIZED TEES"}
            </Link>
            <span>&gt;</span>
            <span className="text-neutral-900 font-black truncate">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-neutral-500 font-mono">
              SKU: GZ-04-
              {product._id ? product._id.slice(-4).toUpperCase() : "AUSK"}
            </span>
            <button
              onClick={handleShare}
              className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-300 bg-white text-neutral-700 hover:bg-black hover:text-white transition-colors cursor-pointer shadow-2xs"
              title="Share Product"
            >
              <Share2 size={13} />
            </button>
          </div>
        </div>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Interactive Product Gallery (7 cols on Desktop) */}
          <div className="lg:col-span-7 xl:col-span-7">
            <ProductGallery
              displayImages={displayImages}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              productName={product.name}
              onOpenLightbox={() => setIsLightboxOpen(true)}
              isWishlisted={Boolean(product && isInWishlist(product._id))}
              onToggleWishlist={() => product && toggleWishlist(product)}
              isSaleActive={isSaleActive}
              discountPercent={discountPercent}
            />
          </div>

          {/* Right Column: Buying Options & Details (5 cols on Desktop - Matching Image 2) */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-5 lg:sticky lg:top-20">
            <div className="rounded-none bg-white p-5 sm:p-7 border border-neutral-200/90 shadow-xs space-y-5">
              {/* Row 1: Badges & Live Viewers (Direct Match to Image 2) */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-none bg-black text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {product.brand || "GENZ ARCHIVE"}
                  </span>
                  <span className="rounded-none bg-[#D1FADF] text-[#027A48] border border-[#A6F4C5] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 status-dot bg-[#027A48]"></span>
                    <span>IN STOCK - READY TO SHIP</span>
                  </span>
                </div>

                <span className="text-[11px] font-mono font-bold text-[#FF3B00] flex items-center gap-1.5">
                  <Eye size={13} className="text-[#FF3B00]" />
                  <span>{liveViewers} viewing this fit</span>
                </span>
              </div>

              {/* Row 2: Product Title (Heavy Extended Typography) */}
              <div>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 leading-none break-words"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {product.name}
                </h1>

                <p className="mt-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 leading-relaxed">
                  {product.brand || "GENZ ARCHIVE"} -{" "}
                  {selectedColor
                    ? `${selectedColor.toUpperCase()} DROP`
                    : "STREETWEAR DROP"}{" "}
                  • {product.gsm || product.productDetails?.gsm || "280 GSM"} •{" "}
                  {product.material ||
                    product.productDetails?.material ||
                    "100% COMBED COTTON"}{" "}
                  • {product.fit || product.productDetails?.fit || "BOXY FIT"}
                </p>
              </div>

              {/* Row 4: Price & Rating Module (Matching Image 2) */}
              <div className="flex items-center justify-between gap-3 pt-2 pb-4 border-y border-neutral-200/80">
                <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-neutral-950 font-mono">
                    ₹{currentPrice}
                  </span>
                  {isSaleActive && originalPrice > currentPrice && (
                    <span className="text-base sm:text-lg font-mono text-neutral-400 line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                  {isSaleActive && discountPercent > 0 && (
                    <span className="rounded-none bg-[#FF3B00] text-white px-2 py-0.5 text-xs font-mono font-black uppercase tracking-wider">
                      {discountPercent}% OFF • SAVE ₹{savingsAmount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-900 shrink-0">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                  </span>
                  <span className="text-neutral-400">(412 Reviews)</span>
                </div>
              </div>

              {/* Row 5: Shade / Color Variant Image Thumbnails (Direct Match to User Screenshot) */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs font-mono tracking-wider">
                  <span className="text-sm font-black uppercase text-neutral-900 tracking-tight">
                    COLOUR:{" "}
                    <span className="text-[#FF3B00] font-black">
                      {selectedColor || "SELECT"}
                    </span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase">
                    {colors.length} {colors.length === 1 ? "SHADE" : "SHADES"}{" "}
                    AVAILABLE
                  </span>
                </div>

                <div className="flex flex-wrap items-start gap-3 sm:gap-4">
                  {colors.map((color) => {
                    const isSelected =
                      selectedColor?.toLowerCase() === color?.toLowerCase();
                    const variantImg = getColorVariantImage(color);
                    const colorHex = getColorHex(color);

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          handleColorSelect(color);
                          const matchingVar = variants.find(
                            (v) =>
                              v.color?.toLowerCase() === color?.toLowerCase() &&
                              v.images &&
                              v.images.length > 0,
                          );
                          if (matchingVar?.images?.[0]) {
                            setActiveImage(matchingVar.images[0]);
                          }
                        }}
                        className="group flex flex-col items-center cursor-pointer focus:outline-none transition-transform active:scale-95"
                        title={`Select ${color}`}
                      >
                        {/* Garment Image Box matching User Reference Image */}
                        <div
                          className={`relative w-14 h-18 sm:w-16 sm:h-20 rounded-2xl overflow-hidden bg-[#F7F7F5] transition-all duration-200 flex items-center justify-center p-1.5 ${
                            isSelected
                              ? "border-2 border-[#FF3B00] shadow-[0_0_0_3px_rgba(255,59,0,0.22)] scale-105"
                              : "border border-neutral-300/80 hover:border-neutral-500 hover:scale-[1.02]"
                          }`}
                        >
                          {variantImg ? (
                            <img
                              src={variantImg}
                              alt={color}
                              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105 select-none"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback =
                                  e.currentTarget.nextElementSibling;
                                if (fallback) fallback.style.display = "block";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full rounded-xl ${
                              variantImg ? "hidden" : "block"
                            }`}
                            style={{ backgroundColor: colorHex }}
                          />
                        </div>

                        {/* Color Name below Image */}
                        <span
                          className={`mt-1.5 block text-[11px] font-mono uppercase tracking-wider text-center max-w-[68px] truncate transition-colors ${
                            isSelected
                              ? "font-black text-[#FF3B00]"
                              : "font-semibold text-neutral-700 group-hover:text-black"
                          }`}
                        >
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Size Selector & Live Dimensions (Direct Match to Image 2) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="text-neutral-900">
                    SELECT SIZE:{" "}
                    <span className="font-black text-black">
                      {selectedSize || "SELECT"}
                    </span>
                  </span>

                  <span className="text-[#FF3B00] flex items-center gap-1 text-[11px] font-bold">
                    <Ruler size={12} /> {selectedSize || "XL"}: Chest 48 in /
                    Length 30.5 in
                  </span>
                </div>

                {/* Sharp Rectangular Size Buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {["S", "M", "L", "XL", "XXL"].map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeSelect(sz)}
                        className={`h-11 rounded-none border text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-black text-white border-black shadow-xs"
                            : "bg-white text-neutral-900 border-neutral-300 hover:border-black"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[11px] font-mono text-neutral-500 pt-0.5 flex items-center gap-1">
                  <Sparkles size={11} className="text-neutral-400 shrink-0" />
                  <span>
                    Model is 6'0" wearing size {selectedSize || "XL"} for an
                    authentic boxy streetwear drape.
                  </span>
                </p>
              </div>

              {/* Row 7: Quantity & Action Buttons (Direct Match to Image 2) */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2">
                  {/* Quantity Stepper (Sharp Rectangle) */}
                  <div className="flex h-12 w-28 items-center justify-between border border-neutral-300 bg-white rounded-none px-3 font-mono shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="h-7 w-7 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer font-bold text-base"
                    >
                      -
                    </button>
                    <span className="text-xs font-black">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="h-7 w-7 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer font-bold text-base"
                    >
                      +
                    </button>
                  </div>

                  {/* Add To Bag Button (Sharp Rectangular with In-Bag & Added Feedback) */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddDisabled}
                    className={`flex-1 h-12 rounded-none font-mono font-black uppercase text-xs sm:text-[13px] tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:bg-neutral-300 disabled:cursor-not-allowed ${
                      justAdded
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : isAlreadyInCart
                          ? "bg-neutral-900 hover:bg-black text-white"
                          : "bg-[#FF3B00] hover:bg-[#e03400] text-white"
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check size={16} strokeWidth={3} />
                        <span>ADDED TO BAG!</span>
                      </>
                    ) : isAlreadyInCart ? (
                      <>
                        <Check
                          size={16}
                          strokeWidth={3}
                          className="text-emerald-400"
                        />
                        <span>
                          IN YOUR BAG • ADD MORE (+₹{currentPrice * quantity})
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>
                          {isAddDisabled
                            ? "SOLD OUT"
                            : `ADD TO BAG - ₹${currentPrice * quantity}`}
                        </span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button (Sharp Square) */}
                  <button
                    type="button"
                    onClick={() => product && toggleWishlist(product)}
                    className="h-12 w-12 flex items-center justify-center rounded-none border border-neutral-300 bg-white hover:border-black transition-colors cursor-pointer shrink-0"
                    title={
                      product && isInWishlist(product._id)
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"
                    }
                  >
                    <Heart
                      size={18}
                      className={
                        product && isInWishlist(product._id)
                          ? "fill-[#FF3B00] text-[#FF3B00]"
                          : "text-neutral-700"
                      }
                    />
                  </button>
                </div>

                {/* Buy It Now Direct Button */}
                {!isAddDisabled && (
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full h-11 px-3 text-xs font-mono font-bold uppercase tracking-wider rounded-none border border-neutral-900 bg-neutral-900 text-white hover:bg-black transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Zap
                      size={14}
                      className="text-amber-400 fill-amber-400 shrink-0"
                    />
                    <span>BUY IT NOW - EXPRESS CHECKOUT</span>
                  </button>
                )}
              </div>

              {/* Row 8: Pincode Delivery Speed Checker */}
              <div className="pt-3 border-t border-neutral-200/80">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-700 mb-2 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#FF3B00]" />
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
                    className="flex-1 rounded-none border border-neutral-300 bg-white px-3 py-2 text-xs font-mono font-semibold text-neutral-900 focus:border-black focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-none bg-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition cursor-pointer"
                  >
                    Check
                  </button>
                </form>

                {pincodeChecked && (
                  <div className="mt-2 flex items-center gap-2 rounded-none bg-emerald-50 p-2 text-xs text-emerald-800 font-mono font-semibold border border-emerald-200">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-600 shrink-0"
                    />
                    <span>
                      Free Express Delivery by{" "}
                      <strong>Tomorrow / 48 hrs</strong> to {pincode}
                    </span>
                  </div>
                )}
              </div>

              {/* 4 Pillars of Streetwear Trust */}
              <div className="grid grid-cols-2 gap-2 border-t pt-3 border-neutral-200/80">
                <div className="flex items-center gap-2 p-2 rounded-none bg-neutral-50 border border-neutral-200/60">
                  <Zap size={14} className="text-[#FF3B00] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-900 leading-tight">
                      Fast Dispatch
                    </p>
                    <p className="text-[9px] text-neutral-500 leading-tight">
                      Within 24-48 Hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-none bg-neutral-50 border border-neutral-200/60">
                  <Layers size={14} className="text-[#FF3B00] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-900 leading-tight">
                      280 GSM Cotton
                    </p>
                    <p className="text-[9px] text-neutral-500 leading-tight">
                      Heavy Combed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-none bg-neutral-50 border border-neutral-200/60">
                  <RotateCcw size={14} className="text-[#FF3B00] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-900 leading-tight">
                      14-Day Exchanges
                    </p>
                    <p className="text-[9px] text-neutral-500 leading-tight">
                      Doorstep Return
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-none bg-neutral-50 border border-neutral-200/60">
                  <ShieldCheck size={14} className="text-[#FF3B00] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono font-bold uppercase text-neutral-900 leading-tight">
                      100% Authentic
                    </p>
                    <p className="text-[9px] text-neutral-500 leading-tight">
                      Genz Streetwear
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Product Specifications & Details Card */}
        <div className="mt-8 md:mt-12 rounded-none bg-white p-5 sm:p-8 border border-neutral-200/90 shadow-xs">
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
            className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-none bg-white/10 text-white hover:bg-white hover:text-black transition cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center max-w-4xl w-full max-h-[90vh]">
            <img
              src={activeImage || displayImages[0]}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/models/model1.png";
              }}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-none shadow-2xl"
            />
            {displayImages.length > 1 && (
              <div className="flex items-center gap-2 mt-6 overflow-x-auto p-2">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 overflow-hidden rounded-none border-2 transition cursor-pointer ${
                      activeImage === img
                        ? "border-[#FF3B00]"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/models/model1.png";
                      }}
                    />
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
          <div className="relative w-full max-w-2xl rounded-none bg-white p-6 sm:p-8 shadow-2xl border border-neutral-300">
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-none bg-neutral-100 text-neutral-600 hover:bg-black hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-center justify-between mb-4 pr-8">
              <div>
                <h3 className="text-xl font-black uppercase text-neutral-900 font-mono">
                  Size & Measurement Guide
                </h3>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Boxy Oversized Streetwear Fit
                </p>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center rounded-none bg-neutral-100 p-1">
                <button
                  onClick={() => setSizeUnit("in")}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-none transition cursor-pointer ${
                    sizeUnit === "in"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-500"
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setSizeUnit("cm")}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-none transition cursor-pointer ${
                    sizeUnit === "cm"
                      ? "bg-black text-white shadow-xs"
                      : "text-neutral-500"
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
                    <th className="p-3 rounded-none">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Length</th>
                    <th className="p-3">Shoulder Drop</th>
                    <th className="p-3 rounded-none">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="p-3 font-black text-neutral-900">S</td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '42"' : "106 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '28"' : "71 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '21"' : "53 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '8.5"' : "21.5 cm"}
                    </td>
                  </tr>
                  <tr className="bg-neutral-50/50">
                    <td className="p-3 font-black text-neutral-900">M</td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '44"' : "112 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '29"' : "73.5 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '22"' : "56 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '9"' : "23 cm"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-neutral-900">L</td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '46"' : "117 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '30"' : "76 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '23"' : "58.5 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '9.5"' : "24 cm"}
                    </td>
                  </tr>
                  <tr className="bg-neutral-50/50">
                    <td className="p-3 font-black text-neutral-900">XL</td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '48"' : "122 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '31"' : "78.5 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '24"' : "61 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '10"' : "25.5 cm"}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-black text-neutral-900">XXL</td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '50"' : "127 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '32"' : "81 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '25"' : "63.5 cm"}
                    </td>
                    <td className="p-3">
                      {sizeUnit === "in" ? '10.5"' : "26.5 cm"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-5 rounded-none bg-neutral-50 p-4 border border-neutral-200 text-xs text-neutral-600 space-y-1.5 font-mono">
              <p className="font-bold text-neutral-900">Fitting Tip:</p>
              <p>
                • Model is 6'1" (185 cm) wearing Size L for an authentic
                drop-shoulder streetwear fit.
              </p>
              <p>
                • For a tailored/regular fit, order one size down from your
                usual size.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sticky Mobile Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-300 px-3.5 py-2.5 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-mono font-black uppercase text-neutral-900 truncate leading-tight">
              {product.name}
            </p>
            <p className="text-sm font-mono font-black text-[#FF3B00]">
              ₹{currentPrice}
            </p>
          </div>
          <button
            type="button"
            onClick={() => product && toggleWishlist(product)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-none border border-neutral-300 bg-white transition-colors cursor-pointer"
            title={
              product && isInWishlist(product._id)
                ? "Remove from Wishlist"
                : "Add to Wishlist"
            }
            aria-label="Wishlist"
          >
            <Heart
              size={18}
              className={
                product && isInWishlist(product._id)
                  ? "fill-[#FF3B00] text-[#FF3B00]"
                  : "text-neutral-700"
              }
            />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddDisabled}
            className="h-10 px-4 text-xs font-mono font-black uppercase tracking-wider bg-[#FF3B00] text-white rounded-none shadow-xs shrink-0 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {isAddDisabled ? "Sold Out" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
