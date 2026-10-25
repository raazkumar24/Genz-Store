import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tag, Flame } from "lucide-react";
import { useProducts } from "../context/ProductContext";

/**
 * PromoBanner Component
 * Promotional banner for Summer Blowout.
 * Dynamically displays the exact product and variant image that the user marked on SALE (`isSale: true` or `salePrice > 0`).
 */
const PromoBanner = () => {
  const { products } = useProducts();

  // Find all products that have at least one variant marked on sale
  const saleProducts = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return [];
    return products.filter((p) =>
      p.variants && p.variants.some((v) => v.isSale || (v.salePrice && Number(v.salePrice) > 0))
    );
  }, [products]);

  // Pick the first sale product (or fallback to first product if none marked on sale yet)
  const saleProduct = useMemo(() => {
    if (saleProducts.length > 0) return saleProducts[0];
    if (products && products.length > 0) return products[0];
    return null;
  }, [saleProducts, products]);

  // Extract the exact sale variant
  const saleVariant = useMemo(() => {
    if (!saleProduct || !saleProduct.variants || saleProduct.variants.length === 0) return null;
    
    // First priority: Variant explicitly marked isSale with valid images
    const explicitSaleWithImg = saleProduct.variants.find(
      (v) => (v.isSale || (v.salePrice && Number(v.salePrice) > 0)) && Array.isArray(v.images) && v.images.length > 0
    );
    if (explicitSaleWithImg) return explicitSaleWithImg;

    // Second priority: Variant explicitly marked isSale
    const explicitSale = saleProduct.variants.find((v) => v.isSale || (v.salePrice && Number(v.salePrice) > 0));
    if (explicitSale) return explicitSale;

    // Fallback: First variant
    return saleProduct.variants[0];
  }, [saleProduct]);

  // Extract the image string from variant's images array (variant.images[0])
  const saleImage = useMemo(() => {
    if (saleVariant) {
      if (Array.isArray(saleVariant.images) && saleVariant.images.length > 0 && saleVariant.images[0]) {
        return saleVariant.images[0];
      }
      if (saleVariant.image) {
        return saleVariant.image;
      }
    }
    if (saleProduct && saleProduct.image) {
      return saleProduct.image;
    }
    return "/models/model1.png";
  }, [saleVariant, saleProduct]);

  // Price calculations
  const originalPrice = saleVariant?.price || 0;
  const salePrice = saleVariant?.salePrice && Number(saleVariant.salePrice) > 0
    ? Number(saleVariant.salePrice)
    : originalPrice ? Math.round(originalPrice * 0.8) : null;

  return (
    <section className="relative w-full py-6 md:py-10 bg-[#F3F4F0]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-[#0E0F12] text-white border border-neutral-800 p-8 sm:p-12 md:p-16 shadow-2xl">
          {/* Subtle Technical Grid Lines in Background */}
          <div className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />

          {/* Background Texture with Subtle Luminosity */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-all duration-700 hover:scale-100"
            style={{ backgroundImage: `url('${saleImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0F12] via-[#0E0F12]/90 to-transparent" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Left Side: Editorial & Technical Copy */}
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 backdrop-blur-md mb-6">
                <Flame className="w-3.5 h-3.5 text-[var(--color-primary)] animate-bounce" />
                <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
                  MADEFACT ARCHIVE // SEASON CLEARANCE
                </span>
              </div>
              
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] mb-5 text-white break-words"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Seasonal <span className="text-outline-red ml-1">Blowout</span>
              </h2>
              
              <p className="text-neutral-300 text-sm sm:text-base md:text-lg font-medium max-w-md mb-8 leading-relaxed mx-auto md:mx-0">
                {saleProduct 
                  ? `Grab massive discounts on "${saleProduct.name}" and top streetwear pieces. Limited stock available!` 
                  : "Upgrade your streetwear rotation. Get flat discounts on oversized tees, fleece hoodies, and baggy cargos."}
              </p>
              
              {/* Dribbble-style Bento Pill CTA Button */}
              <Link 
                to="/sale"
                className="group inline-flex items-center gap-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 pl-6 pr-2.5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-[0.98]"
              >
                <span>Shop The Clearance</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white group-hover:bg-[var(--color-primary)] transition-all duration-200">
                  <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>

            {/* Right Side: Featured Sale Product Showcase */}
            <div className="relative group shrink-0 w-full md:w-auto flex justify-center">
              <Link 
                to="/sale" 
                className="block relative w-64 md:w-72 aspect-[3/4] rounded-[24px] overflow-hidden border border-white/20 shadow-2xl bg-neutral-900 group-hover:border-[var(--color-primary)] transition-all duration-500"
              >
                <img 
                  src={saleImage} 
                  alt={saleProduct ? saleProduct.name : "Sale Product"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/models/model1.png";
                  }}
                />
                
                {/* Gradient bottom overlay for product info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end">
                  <span className="inline-block px-2.5 py-1 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-wider rounded-md self-start mb-2 shadow">
                    HOT DROP DEAL
                  </span>
                  <h3 className="text-white text-base font-extrabold uppercase tracking-tight truncate" style={{ fontFamily: "var(--font-heading)" }}>
                    {saleProduct ? saleProduct.name : "Featured Sale Fits"}
                  </h3>
                  {salePrice && (
                    <p className="text-[var(--color-primary)] text-sm font-black mt-1">
                      ₹{salePrice} {originalPrice > salePrice && <span className="text-white/40 text-xs font-normal line-through ml-1">₹{originalPrice}</span>}
                    </p>
                  )}
                </div>

                {/* Floating Sale Pill Badge */}
                <div className="absolute top-3 right-3 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)] text-white shadow-lg animate-pulse">
                  <span className="text-xs font-black leading-none">SALE</span>
                  <span className="text-[8px] font-bold uppercase tracking-tighter">DROP</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
