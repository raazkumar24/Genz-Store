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
    return "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80";
  }, [saleVariant, saleProduct]);

  // Price calculations
  const originalPrice = saleVariant?.price || 0;
  const salePrice = saleVariant?.salePrice && Number(saleVariant.salePrice) > 0
    ? Number(saleVariant.salePrice)
    : originalPrice ? Math.round(originalPrice * 0.8) : null;

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-black text-white border-y border-neutral-800">
      {/* Background Texture/Image of the actual product on sale */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-all duration-700 hover:scale-100"
        style={{ backgroundImage: `url('${saleImage}')` }}
      />
      
      {/* Dark gradient overlay for clear contrast & readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40 md:to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Side: Copy & Sale Link Button */}
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 backdrop-blur-md mb-6">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            <span className="text-xs font-black uppercase tracking-widest text-red-400">Summer Clearance Sale</span>
          </div>
          
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.08] mb-5 text-white break-words"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Summer <span className="text-outline-red ml-1">Blowout</span>
          </h2>
          
          <p className="text-white/70 text-base md:text-lg font-medium max-w-md mb-8 leading-relaxed mx-auto md:mx-0">
            {saleProduct 
              ? `Grab massive discounts on "${saleProduct.name}" and top streetwear pieces. Limited stock available!` 
              : "Upgrade your streetwear rotation. Get flat discounts on oversized tees, hoodies and baggy cargos. Valid till stocks last."}
          </p>
          
          {/* Shop The Sale Button linking directly to /sale */}
          <Link 
            to="/sale"
            className="inline-flex items-center justify-center gap-3 whitespace-nowrap bg-red-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-all duration-300 shadow-lg shadow-red-600/30 group"
          >
            <Tag size={18} />
            Shop The Sale 
            <ArrowRight size={18} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Right Side: Featured Sale Product Card Showcase */}
        <div className="relative group shrink-0 w-full md:w-auto flex justify-center">
          <Link to="/sale" className="block relative w-64 md:w-72 aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-neutral-900 group-hover:border-red-500/60 transition-all duration-500">
            <img 
              src={saleImage} 
              alt={saleProduct ? saleProduct.name : "Sale Product"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80";
              }}
            />
            
            {/* Gradient bottom overlay for product info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-5 flex flex-col justify-end">
              <span className="inline-block px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md self-start mb-2 shadow">
                HOT DEAL
              </span>
              <h3 className="text-white text-base font-extrabold uppercase tracking-tight truncate" style={{ fontFamily: "var(--font-heading)" }}>
                {saleProduct ? saleProduct.name : "Featured Sale Fits"}
              </h3>
              {salePrice && (
                <p className="text-red-400 text-sm font-black mt-1">
                  ₹{salePrice} {originalPrice > salePrice && <span className="text-white/40 text-xs font-normal line-through ml-1">₹{originalPrice}</span>}
                </p>
              )}
            </div>

            {/* Floating Sale Badge */}
            <div className="absolute top-3 right-3 flex flex-col items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white shadow-lg animate-pulse">
              <span className="text-xs font-black leading-none" style={{ fontFamily: "var(--font-heading)" }}>SALE</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter">OFF</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
