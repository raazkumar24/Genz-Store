import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Flame, ShieldCheck, Zap } from "lucide-react";
import { useProducts } from "../context/ProductContext";

/**
 * PromoBanner Component
 * Redesigned High-Impact Streetwear Clearance Vault.
 * Features MADEFACT ARCHIVE // SEASON CLEARANCE with technical badges and dynamic backend product integration.
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
    
    const explicitSaleWithImg = saleProduct.variants.find(
      (v) => (v.isSale || (v.salePrice && Number(v.salePrice) > 0)) && Array.isArray(v.images) && v.images.length > 0
    );
    if (explicitSaleWithImg) return explicitSaleWithImg;

    const explicitSale = saleProduct.variants.find((v) => v.isSale || (v.salePrice && Number(v.salePrice) > 0));
    if (explicitSale) return explicitSale;

    return saleProduct.variants[0];
  }, [saleProduct]);

  // Extract the image string from variant's images array
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
  const originalPrice = saleVariant?.price || (saleProduct?.price || 1499);
  const salePrice = saleVariant?.salePrice && Number(saleVariant.salePrice) > 0
    ? Number(saleVariant.salePrice)
    : originalPrice ? Math.round(originalPrice * 0.75) : 999;

  const discountPercent = originalPrice > salePrice 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) 
    : 30;

  return (
    <section className="relative w-full py-8 md:py-14 bg-[#F3F4F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden bg-gradient-to-br from-[#0B0C0E] via-[#0E1014] to-[#07080A] text-white border border-neutral-800/90 p-7 sm:p-10 md:p-14 lg:p-16 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
          {/* Subtle Technical Grid Lines in Background */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

          {/* Ambient Radial Lights */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-80 w-80 rounded-full bg-[var(--color-primary)]/20 filter blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-blue-600/15 filter blur-3xl" />

          {/* Background Blurred Silhouette Texture */}
          <div 
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity scale-110 filter blur-sm"
            style={{ backgroundImage: `url('${saleImage}')` }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/95 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            {/* Left Side: Editorial & Technical Copy */}
            <div className="max-w-2xl text-center lg:text-left flex-1">
              {/* Terminal Header Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 backdrop-blur-md mb-5 shadow-xs">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-red-400">
                  MADEFACT ARCHIVE // SEASON CLEARANCE
                </span>
                <span className="text-[10px] font-mono text-neutral-400 pl-2 border-l border-white/20 hidden sm:inline">
                  VAULT 2026
                </span>
              </div>
              
              {/* Headline */}
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black uppercase tracking-tight leading-[1.04] mb-4 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Seasonal <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 bg-clip-text text-transparent">Clearance</span> Vault
              </h2>
              
              <p className="text-neutral-300 text-sm sm:text-base font-medium max-w-xl mb-6 leading-relaxed mx-auto lg:mx-0">
                {saleProduct 
                  ? `Archive release of "${saleProduct.name}" and heavy combed cotton drops. Once the batch sells out, it will not be restocked.` 
                  : "Upgrade your streetwear rotation with flat blowout discounts on oversized tees, fleece hoodies, and parachute cargos."}
              </p>

              {/* 3 Value Props Micro-Strip */}
              <div className="grid grid-cols-3 gap-2.5 max-w-lg mb-8 mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs">
                  <span className="text-xs sm:text-sm font-black text-white">UP TO 60%</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Archived Steals</span>
                </div>
                <div className="flex flex-col items-center lg:items-start p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs">
                  <span className="text-xs sm:text-sm font-black text-amber-300">280-400 GSM</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Combed Fleece</span>
                </div>
                <div className="flex flex-col items-center lg:items-start p-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-xs">
                  <span className="text-xs sm:text-sm font-black text-emerald-400">14-DAY</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Free Exchange</span>
                </div>
              </div>
              
              {/* Dribbble-style Bento Pill CTA Button */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link 
                  to="/sale"
                  className="group inline-flex items-center gap-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 pl-6 pr-2.5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xl active:scale-[0.98]"
                >
                  <span>Shop The Clearance Archive</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white group-hover:bg-[var(--color-primary)] transition-all duration-200">
                    <ArrowRight size={16} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>

                <Link
                  to="/new-arrivals"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-white/5 hover:bg-white/10 text-neutral-200 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors"
                >
                  Explore New Drops
                </Link>
              </div>
            </div>

            {/* Right Side: Featured Luxury Streetwear Card */}
            <div className="relative group shrink-0 w-full sm:w-auto flex justify-center">
              <Link 
                to={saleProduct ? `/products/${saleProduct._id}` : "/sale"} 
                className="block relative w-72 sm:w-80 aspect-[3/4] rounded-[28px] overflow-hidden border border-white/15 shadow-2xl bg-[#14161B] group-hover:border-red-500/60 transition-all duration-500 hover:shadow-red-500/10 hover:-translate-y-1"
              >
                {/* Product Image */}
                <img 
                  src={saleImage} 
                  alt={saleProduct ? saleProduct.name : "Sale Product"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/models/model1.png";
                  }}
                />
                
                {/* Floating Top Badges */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5">
                  <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md flex items-center gap-1">
                    <Flame size={12} className="fill-white" />
                    -{discountPercent}% OFF
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5 z-20">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white/90 text-[9px] font-mono uppercase tracking-wider rounded-full border border-white/20">
                    LIMITED
                  </span>
                </div>
                
                {/* Bottom Glassmorphic Overlay for Product Info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-5 pt-12 flex flex-col justify-end z-20">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                    MADEFACT ARCHIVE PIECE
                  </span>
                  <h3 
                    className="text-white text-base sm:text-lg font-extrabold uppercase tracking-tight truncate group-hover:text-red-300 transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {saleProduct ? saleProduct.name : "Featured Clearance Drop"}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                    <div className="flex items-baseline gap-2">
                      <span className="text-white text-lg font-black tracking-tight">
                        ₹{salePrice}
                      </span>
                      {originalPrice > salePrice && (
                        <span className="text-neutral-400 text-xs font-semibold line-through">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-white group-hover:text-red-400 transition-colors">
                      Claim Fit <ArrowUpRight size={14} strokeWidth={2.5} />
                    </span>
                  </div>
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
