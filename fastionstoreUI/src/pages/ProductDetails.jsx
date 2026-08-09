import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { Button, Badge, BackButton } from "../components/ui";
import { 
  Heart, ShoppingBag, X, Star, 
  Truck, ShieldCheck, RotateCcw, Ruler, Plus, Minus, Share2 
} from "lucide-react";
import ProductAccordion from "../components/ProductAccordion";
import ProductGallery from "../components/ProductGallery";
import SimilarProducts from "../components/SimilarProducts";

const uniqueValues = (items, key) => [...new Set(items.map((item) => item[key]).filter(Boolean))];

const colorMap = {
  black: "#111", white: "#fff", red: "#ef4444", blue: "#3b82f6", green: "#22c55e",
  yellow: "#eab308", pink: "#ec4899", purple: "#a855f7", orange: "#f97316",
  gray: "#6b7280", grey: "#6b7280", brown: "#92400e", navy: "#1e3a8a", olive: "#4d7c0f",
  original: "#ddd"
};

const getColorHex = (colorString) => {
  if (!colorString) return '#eee';
  const lowerColor = colorString.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerColor.includes(key)) {
      return value;
    }
  }
  return colorString;
};

const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const variantId = searchParams.get('variant');
  const sizeParam = searchParams.get('size');
  
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

  const variants = useMemo(() => {
    if (!product) return [];
    return product.variants || [];
  }, [product]);

  // Set default state when product loads
  useEffect(() => {
    if (!product || variants.length === 0) return;

    let targetVariant = null;
    if (variantId) {
      targetVariant = variants.find(v => v._id === variantId);
    }

    const firstAvailableVariant =
      targetVariant || variants.find((variant) => variant.stock > 0) || variants[0];

    if (firstAvailableVariant) {
      const sizesArray = (firstAvailableVariant.size || "").split(',').map(s => s.trim()).filter(Boolean);
      
      if (sizeParam && sizesArray.includes(sizeParam)) {
        setSelectedSize(sizeParam);
      } else {
        setSelectedSize(sizesArray[0] || "");
      }
      
      setSelectedColor(firstAvailableVariant.color || "");
      if (firstAvailableVariant.images && firstAvailableVariant.images.length > 0) {
        setActiveImage(firstAvailableVariant.images[0]);
      } else {
        const anyVariantWithImage = variants.find(v => v.images && v.images.length > 0);
        setActiveImage(anyVariantWithImage ? anyVariantWithImage.images[0] : "");
      }
    }
  }, [product, variants, variantId, sizeParam]);

  const sizes = useMemo(() => {
    const allSizes = [];
    variants.forEach(v => {
      if (v.size) {
        v.size.split(',').forEach(s => allSizes.push(s.trim()));
      }
    });
    return [...new Set(allSizes)].filter(Boolean);
  }, [variants]);

  const colors = useMemo(() => uniqueValues(variants, "color"), [variants]);

  // Current selected variant
  const selectedVariant = variants.find(
    (v) => (v.size || "").split(',').map(s => s.trim()).includes(selectedSize) && v.color === selectedColor
  );

  const availableColorsForSize = variants
    .filter((v) => (v.size || "").split(',').map(s => s.trim()).includes(selectedSize))
    .map((v) => v.color);

  const availableSizesForColor = useMemo(() => {
    const s = [];
    variants.filter((v) => v.color === selectedColor).forEach(v => {
      if (v.size) {
        v.size.split(',').forEach(sz => s.push(sz.trim()));
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
    const anyVariantWithImage = variants.find(v => v.images && v.images.length > 0);
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
      (v) => (v.size || "").split(',').map(s => s.trim()).includes(size) && v.color === selectedColor
    );

    if (!isColorValid) {
      const availableVariant =
        variants.find((v) => (v.size || "").split(',').map(s => s.trim()).includes(size) && v.stock > 0) ||
        variants.find((v) => (v.size || "").split(',').map(s => s.trim()).includes(size));

      setSelectedColor(availableVariant?.color || "");
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const isSizeValid = variants.some(
      (v) => v.color === color && (v.size || "").split(',').map(s => s.trim()).includes(selectedSize)
    );

    if (!isSizeValid) {
      const availableVariant =
        variants.find((v) => v.color === color && v.stock > 0) ||
        variants.find((v) => v.color === color);

      const firstSize = availableVariant?.size ? availableVariant.size.split(',')[0].trim() : "";
      setSelectedSize(firstSize);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return addToast("Please select size and color!", "error");
    if (selectedVariant.stock === 0) return addToast("This variant is out of stock!", "error");
    if (!selectedSize) return addToast("Please select a size!", "error");

    addToCart(product, selectedVariant, quantity, selectedSize, selectedColor);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Genz Store!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Product link copied to clipboard!", "info");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-muted)]">
        <div className="flex items-center gap-3 font-semibold text-lg">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent"></div>
          <span>Loading product...</span>
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

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-28 md:pb-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 overflow-hidden font-medium">
            <BackButton size="sm" fallbackPath="/" />
            <span className="text-gray-300">/</span>
            <Link to="/" className="hover:text-gray-900 transition">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-bold truncate">{product.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-[var(--color-primary)] hover:border-gray-300 transition cursor-pointer"
            title="Share Product"
          >
            <Share2 size={16} />
          </button>
        </nav>

        {/* Main Product Layout Grid - Balanced Height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left Column: Interactive Product Gallery (Sticky) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            <ProductGallery
              displayImages={displayImages}
              activeImage={activeImage}
              setActiveImage={setActiveImage}
              productName={product.name}
              onOpenLightbox={() => setIsLightboxOpen(true)}
            />
          </div>

          {/* Right Column: Buying Options & Details */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-gray-200/80 shadow-sm">
              
              {/* Brand & Stock Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
                    {product.brand || "GENZ STORE"}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {product.gender || "Unisex"}
                  </span>
                </div>

                {selectedVariant ? (
                  <Badge 
                    variant={selectedVariant.stock > 10 ? "success" : selectedVariant.stock > 0 ? "warning" : "error"} 
                    className="px-2.5 py-0.5 text-[10px]"
                  >
                    {selectedVariant.stock === 0 ? "OUT OF STOCK" : selectedVariant.stock < 10 ? "LIMITED STOCK" : "IN STOCK"}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px]">UNAVAILABLE</Badge>
                )}
              </div>

              {/* Product Title */}
              <h1
                className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900 leading-snug mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.name}
              </h1>

              {/* Rating Review Trust Snippet */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center text-amber-400">
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                  <Star size={16} className="fill-amber-400" />
                </div>
                <span className="text-xs font-bold text-gray-800">4.9</span>
                <span className="text-xs text-gray-400">(128 Verified Reviews)</span>
              </div>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-gray-100">
                {selectedVariant && selectedVariant.isSale && selectedVariant.salePrice > 0 ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-red-500" style={{ fontFamily: "var(--font-heading)" }}>
                      ₹{selectedVariant.salePrice}
                    </span>
                    <span className="text-xl font-bold text-gray-400 line-through">
                      ₹{selectedVariant.price}
                    </span>
                    <span className="rounded-lg bg-red-100 px-2 py-1 text-xs font-black text-red-600">
                      {Math.round(((selectedVariant.price - selectedVariant.salePrice) / selectedVariant.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                    ₹{selectedVariant?.price || (variants[0]?.price || 0)}
                  </span>
                )}
                <span className="text-[11px] font-semibold text-gray-400 ml-auto">Inclusive of all taxes</span>
              </div>

              {/* Color Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Colour: <span className="font-extrabold text-[var(--color-primary)]">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => {
                    const hasSelectedSize = availableColorsForSize.includes(color);
                    const colorVariants = variants.filter((v) => v.color === color);
                    const allOutOfStock = colorVariants.every((v) => v.stock === 0);
                    const firstVariantWithImage = colorVariants.find(v => v.images && v.images.length > 0);
                    const variantImage = firstVariantWithImage ? firstVariantWithImage.images[0] : null;
                    const bgHex = getColorHex(color);

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        disabled={allOutOfStock}
                        title={color}
                        className={`relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          selectedColor === color
                            ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-md scale-105"
                            : "border-gray-200 hover:border-gray-400"
                        } ${!hasSelectedSize ? "opacity-60" : ""} ${allOutOfStock ? "cursor-not-allowed opacity-40" : ""}`}
                        style={{ backgroundColor: !variantImage ? bgHex : undefined }}
                      >
                        {variantImage && (
                          <img src={variantImage} alt={color} className="h-full w-full object-cover" />
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

              {/* Size Selection & Size Guide Button */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Select Size: <span className="font-extrabold text-[var(--color-primary)]">{selectedSize}</span>
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-[var(--color-primary)] transition cursor-pointer"
                  >
                    <Ruler size={14} />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((size) => {
                    const hasSelectedColor = availableSizesForColor.includes(size);
                    const sizeVariants = variants.filter((v) => (v.size || "").split(',').map(s => s.trim()).includes(size));
                    const allOutOfStock = sizeVariants.every((v) => v.stock === 0);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        disabled={allOutOfStock}
                        className={`relative flex h-12 items-center justify-center rounded-xl border text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                          selectedSize === size
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                            : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
                        } ${!hasSelectedColor ? "opacity-60" : ""} ${allOutOfStock ? "cursor-not-allowed opacity-40 bg-gray-50 text-gray-400" : ""}`}
                      >
                        {size}
                        {allOutOfStock && (
                          <svg className="absolute inset-0 h-full w-full stroke-gray-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="0" y1="100" x2="100" y2="0" strokeWidth="2" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex h-13 items-center rounded-2xl border border-gray-200 bg-gray-50 px-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 hover:bg-white hover:shadow-xs transition cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 hover:bg-white hover:shadow-xs transition cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add To Bag Button */}
                  <Button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAddDisabled}
                    variant="primary"
                    size="lg"
                    icon={!isAddDisabled ? <ShoppingBag size={18} /> : undefined}
                    className="flex-1 h-13 text-sm font-black uppercase tracking-wider rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isAddDisabled ? "SOLD OUT" : "ADD TO BAG"}
                  </Button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => product && toggleWishlist(product)}
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                      product && isInWishlist(product._id)
                        ? "border-red-500 bg-red-500 text-white shadow-md shadow-red-200"
                        : "border-gray-200 bg-white text-gray-700 hover:border-red-500 hover:text-red-500"
                    }`}
                    title={product && isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={22} className={product && isInWishlist(product._id) ? "fill-white" : ""} />
                  </button>
                </div>
              </div>

              {/* Value Proposition Guarantees */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t pt-6 border-gray-100 text-center text-[10px] font-bold uppercase tracking-wider text-gray-600">
                <div className="flex flex-col items-center gap-1.5">
                  <Truck size={18} className="text-[var(--color-primary)]" />
                  <span>Free Express Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <ShieldCheck size={18} className="text-[var(--color-primary)]" />
                  <span>100% Quality Fabric</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <RotateCcw size={18} className="text-[var(--color-primary)]" />
                  <span>7-Day Replacement</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Full Width Product Specifications & Details Card (Below Grid - Eliminates Empty Left Space) */}
        <div className="mt-10 md:mt-14 rounded-3xl bg-white p-6 sm:p-10 border border-gray-200/80 shadow-sm">
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
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`h-16 w-16 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${
                      activeImage === img ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]" : "border-white/20 opacity-60"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100">
            <button
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Ruler className="text-[var(--color-primary)]" size={24} />
              <h3 className="text-xl font-black uppercase text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Size Guide (Inches)
              </h3>
            </div>

            <p className="text-xs text-gray-500 mb-6">Measurements are taken flat across garments. For a standard fit, pick your normal size. For an oversized look, size up.</p>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-center text-xs">
                <thead className="bg-gray-100 text-gray-900 font-extrabold uppercase">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest (in)</th>
                    <th className="p-3">Length (in)</th>
                    <th className="p-3">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                  <tr className={selectedSize === "S" ? "bg-red-50 font-bold text-[var(--color-primary)]" : ""}>
                    <td className="p-3 font-black">S</td>
                    <td className="p-3">38 - 40</td>
                    <td className="p-3">28.0</td>
                    <td className="p-3">19.5</td>
                  </tr>
                  <tr className={selectedSize === "M" ? "bg-red-50 font-bold text-[var(--color-primary)]" : ""}>
                    <td className="p-3 font-black">M</td>
                    <td className="p-3">40 - 42</td>
                    <td className="p-3">29.0</td>
                    <td className="p-3">20.5</td>
                  </tr>
                  <tr className={selectedSize === "L" ? "bg-red-50 font-bold text-[var(--color-primary)]" : ""}>
                    <td className="p-3 font-black">L</td>
                    <td className="p-3">42 - 44</td>
                    <td className="p-3">30.0</td>
                    <td className="p-3">21.5</td>
                  </tr>
                  <tr className={selectedSize === "XL" ? "bg-red-50 font-bold text-[var(--color-primary)]" : ""}>
                    <td className="p-3 font-black">XL</td>
                    <td className="p-3">44 - 46</td>
                    <td className="p-3">31.0</td>
                    <td className="p-3">22.5</td>
                  </tr>
                  <tr className={selectedSize === "XXL" ? "bg-red-50 font-bold text-[var(--color-primary)]" : ""}>
                    <td className="p-3 font-black">XXL</td>
                    <td className="p-3">46 - 48</td>
                    <td className="p-3">32.0</td>
                    <td className="p-3">23.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Button
              onClick={() => setIsSizeChartOpen(false)}
              variant="secondary"
              className="w-full mt-6 rounded-xl py-3 font-bold text-xs uppercase cursor-pointer"
            >
              Close Size Guide
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Add To Bag Footer */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Price</span>
            <span className="text-xl font-black text-gray-900 leading-tight">
              ₹{selectedVariant?.isSale && selectedVariant?.salePrice > 0 ? selectedVariant.salePrice : selectedVariant?.price || (variants[0]?.price || 0)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => product && toggleWishlist(product)}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all cursor-pointer ${
                product && isInWishlist(product._id)
                  ? "border-red-500 bg-red-50 text-red-500"
                  : "border-gray-200 bg-gray-50 text-gray-700"
              }`}
            >
              <Heart size={20} className={product && isInWishlist(product._id) ? "fill-red-500 text-red-500" : ""} />
            </button>
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddDisabled}
              variant="primary"
              size="lg"
              icon={!isAddDisabled ? <ShoppingBag size={16} /> : undefined}
              className="flex-1 h-12 text-xs font-black uppercase tracking-wider rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isAddDisabled ? "SOLD OUT" : "ADD TO BAG"}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;