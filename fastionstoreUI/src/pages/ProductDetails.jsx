import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Button, Card, Badge } from "../components/ui";
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
  // Agar colormap mein nahi mila, to raw color string hi return karo (taki hex code aur valid CSS colors kaam karein)
  return colorString;
};

const ProductDetails = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const variantId = searchParams.get('variant');
  const { loading, getProductById, products } = useProducts();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const product = getProductById(productId);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState("");

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "OUT OF STOCK", bg: "bg-red-500/10", dot: "bg-red-500", border: "border-red-200", textCol: "text-red-700 dark:text-red-400" };
    if (stock < 10) return { text: "LIMITED", bg: "bg-orange-500/10", dot: "bg-orange-500 animate-pulse", border: "border-orange-200", textCol: "text-orange-700 dark:text-orange-400" };
    return { text: "AVAILABLE", bg: "bg-green-500/10", dot: "bg-green-500", border: "border-green-200", textCol: "text-green-700 dark:text-green-400" };
  };

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
      setSelectedSize(sizesArray[0] || "");
      setSelectedColor(firstAvailableVariant.color || "");
      if (firstAvailableVariant.images && firstAvailableVariant.images.length > 0) {
        setActiveImage(firstAvailableVariant.images[0]);
      } else {
        const anyVariantWithImage = variants.find(v => v.images && v.images.length > 0);
        setActiveImage(anyVariantWithImage ? anyVariantWithImage.images[0] : "");
      }
    }
  }, [product, variants, variantId]);

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

  // Only show images for the currently selected variant
  const displayImages = useMemo(() => {
    if (!product || variants.length === 0) return [];
    if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    const anyVariantWithImage = variants.find(v => v.images && v.images.length > 0);
    return anyVariantWithImage ? anyVariantWithImage.images : [];
  }, [product, selectedVariant, variants]);

  // Update active image if the current one is not in the display list
  useEffect(() => {
    if (displayImages.length > 0 && !displayImages.includes(activeImage)) {
      setActiveImage(displayImages[0]);
    }
  }, [displayImages, activeImage]);

  // Improved Size Selection Handler
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const isColorValid = variants.some(
      (v) => (v.size || "").split(',').map(s => s.trim()).includes(size) && v.color === selectedColor
    );

    if (!isColorValid) {
      // Pick the first in-stock color for this size, or default to any color
      const availableVariant =
        variants.find((v) => (v.size || "").split(',').map(s => s.trim()).includes(size) && v.stock > 0) ||
        variants.find((v) => (v.size || "").split(',').map(s => s.trim()).includes(size));

      setSelectedColor(availableVariant?.color || "");
    }
  };

  // Improved Color Selection Handler
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const isSizeValid = variants.some(
      (v) => v.color === color && (v.size || "").split(',').map(s => s.trim()).includes(selectedSize)
    );

    if (!isSizeValid) {
      // Pick the first in-stock size for this color, or default to any size
      const availableVariant =
        variants.find((v) => v.color === color && v.stock > 0) ||
        variants.find((v) => v.color === color);

      // Extract the first size from the comma-separated string
      const firstSize = availableVariant?.size ? availableVariant.size.split(',')[0].trim() : "";
      setSelectedSize(firstSize);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return addToast("Kripya size aur colour select karein!", "error");
    if (selectedVariant.stock === 0) return addToast("Ye variant out of stock hai!", "error");
    if (!selectedSize) return addToast("Kripya size select karein!", "error");

    // Use Context's addToCart to safely update cart state
    addToCart(product, selectedVariant, 1, selectedSize, selectedColor);
    addToast(`${product.name} cart me add ho gaya!`, "success");
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[80vh] items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-muted)]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] bg-[var(--color-bg)] flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Product not found
        </h1>
        <Button to="/" variant="primary" className="mt-6">
          Back to Home
        </Button>
      </div>
    );
  }

  const isAddDisabled = !selectedVariant || selectedVariant.stock === 0;

  return (
    <div className="bg-[var(--color-bg)] px-4 py-8 md:px-8 md:py-16 pb-28 md:pb-16">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back to Collection
        </Link>

        <div className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1.1fr] items-start w-full min-w-0">

          {/* Left Column: Image Gallery */}
          <ProductGallery 
            displayImages={displayImages} 
            activeImage={activeImage} 
            setActiveImage={setActiveImage} 
            productName={product.name} 
          />

          {/* Right Column: Sticky Product Info */}
          <section className="sticky top-24 rounded-2xl bg-white p-6 md:p-10 border border-gray-200 shadow-sm">
            
            {/* Stock Badge at the top */}
            {selectedVariant ? (
              <div className="mb-6 flex">
                <Badge variant={getStockStatus(selectedVariant.stock).border === "border-green-500" ? "success" : getStockStatus(selectedVariant.stock).border === "border-yellow-500" ? "warning" : "error"} className="px-3 py-1 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${getStockStatus(selectedVariant.stock).dot}`} />
                  {getStockStatus(selectedVariant.stock).text}
                </Badge>
              </div>
            ) : (
              <div className="mb-6 flex">
                <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  NOT AVAILABLE
                </Badge>
              </div>
            )}

            <div className="mb-2">
              <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {product.collection ? `${product.collection}'s ` : ""}{product.category || "Apparel"}
              </span>
            </div>

            <h1
              className="text-2xl font-black uppercase tracking-tight text-gray-900 md:text-4xl leading-[1.1]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {product.name}
            </h1>
            
            <div className="mt-6 flex items-end gap-4">
              {selectedVariant && selectedVariant.isSale && selectedVariant.salePrice > 0 ? (
                <>
                  <p
                    className="text-4xl font-black text-red-500"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    ₹{selectedVariant.salePrice}
                  </p>
                  <p
                    className="mb-1 text-2xl font-bold text-gray-400 line-through"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    ₹{selectedVariant.price}
                  </p>
                </>
              ) : (
                <p
                  className="text-4xl font-black text-[var(--color-primary)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  ₹{selectedVariant?.price || (variants[0]?.price || 0)}
                </p>
              )}
            </div>

            {/* Structured Product Details */}
            <ProductAccordion product={product} />

            {/* Size Selector */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="text-sm font-bold uppercase tracking-widest text-gray-900"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Select Size
                </span>
                {selectedSize && (
                  <span className="text-sm font-bold text-[var(--color-primary)]">{selectedSize}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
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
                      className={`relative flex min-w-[3.5rem] h-12 items-center justify-center rounded-xl border px-3 text-sm font-bold uppercase transition-all duration-200 ${selectedSize === size
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 shadow-sm"
                        } ${!hasSelectedColor ? "opacity-60" : ""} ${allOutOfStock ? "cursor-not-allowed opacity-40 hover:border-gray-200 bg-gray-50" : ""
                        }`}
                    >
                      {size}
                      {allOutOfStock && (
                        <svg className="absolute inset-0 h-full w-full stroke-gray-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <line x1="0" y1="100" x2="100" y2="0" strokeWidth="2" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colour Selector */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="text-sm font-bold uppercase tracking-widest text-gray-900"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Select Colour
                </span>
                {selectedColor && (
                  <span className="text-sm font-bold text-[var(--color-primary)]">{selectedColor}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                {colors.map((color) => {
                  const hasSelectedSize = availableColorsForSize.includes(color);
                  const colorVariants = variants.filter((v) => v.color === color);
                  const allOutOfStock = colorVariants.every((v) => v.stock === 0);
                  
                  // Extract variant image if present
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
                      className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 transition-all duration-200 ${selectedColor === color
                        ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2"
                        : "border-gray-200 hover:border-gray-300 shadow-sm"
                        } ${!hasSelectedSize ? "opacity-60" : ""} ${allOutOfStock ? "cursor-not-allowed opacity-40 hover:border-transparent" : ""
                        }`}
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

            {/* Desktop Add To Cart Button */}
            <div className="mt-10 hidden md:block">
              <Button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddDisabled}
                variant="primary"
                size="lg"
                fullWidth
              >
                {isAddDisabled ? "SOLD OUT" : "ADD TO BAG"}
              </Button>
            </div>
          </section>
        </div>
      </div>
      
      {/* Similar Products Section */}
      <SimilarProducts currentProduct={product} allProducts={products} />

      {/* Mobile Sticky Add To Cart Footer */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:hidden"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Price</span>
            <span className="text-xl font-black text-gray-900 leading-tight">
              ₹{selectedVariant?.isSale && selectedVariant?.salePrice > 0 ? selectedVariant.salePrice : selectedVariant?.price || (variants[0]?.price || 0)}
            </span>
          </div>
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddDisabled}
            variant="primary"
            size="lg"
            className="flex-1 py-3 text-sm"
          >
            {isAddDisabled ? "SOLD OUT" : "ADD TO BAG"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;