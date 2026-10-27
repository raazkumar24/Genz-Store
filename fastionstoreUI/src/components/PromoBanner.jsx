import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useProducts } from "../context/ProductContext";

/**
 * PromoBanner Component
 * Redesigned High-Impact Streetwear Clearance Vault directly matching Image 2:
 * - Borderless sharp black container (rounded-none bg-[#0D0D0D])
 * - Top badge: "LIMITED ARCHIVAL CLEARANCE - FINAL BATCH" (NO //)
 * - Title: "SEASONAL" (bold white) + "clearance" (orange italic serif cursive) + "VAULT." (bold white)
 * - Technical stats grid (40% Markdown, 280-420 GSM, 14-Day Free Exchange)
 * - Action buttons: "COP GIYU TEE FOR ₹399 ↗" & "ENTER BLOWOUT VAULT" (sharp rectangular, rounded-none)
 * - Right featured product frame matching Image 2
 */
const PromoBanner = () => {
  const { products } = useProducts();

  // Find all products that have at least one variant marked on sale
  const saleProducts = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0)
      return [];
    return products.filter(
      (p) =>
        p.variants &&
        p.variants.some(
          (v) => v.isSale || (v.salePrice && Number(v.salePrice) > 0),
        ),
    );
  }, [products]);

  // Pick the first sale product (or fallback)
  const saleProduct = useMemo(() => {
    if (saleProducts.length > 0) return saleProducts[0];
    if (products && products.length > 0) return products[0];
    return null;
  }, [saleProducts, products]);

  // Extract the exact sale variant
  const saleVariant = useMemo(() => {
    if (
      !saleProduct ||
      !saleProduct.variants ||
      saleProduct.variants.length === 0
    )
      return null;

    const explicitSaleWithImg = saleProduct.variants.find(
      (v) =>
        (v.isSale || (v.salePrice && Number(v.salePrice) > 0)) &&
        Array.isArray(v.images) &&
        v.images.length > 0,
    );
    if (explicitSaleWithImg) return explicitSaleWithImg;

    const explicitSale = saleProduct.variants.find(
      (v) => v.isSale || (v.salePrice && Number(v.salePrice) > 0),
    );
    if (explicitSale) return explicitSale;

    return saleProduct.variants[0];
  }, [saleProduct]);

  // Extract the image string from variant's images array
  const saleImage = useMemo(() => {
    if (saleVariant) {
      if (
        Array.isArray(saleVariant.images) &&
        saleVariant.images.length > 0 &&
        saleVariant.images[0]
      ) {
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
  const originalPrice = saleVariant?.price || saleProduct?.price || 1499;
  const salePrice =
    saleVariant?.salePrice && Number(saleVariant.salePrice) > 0
      ? Number(saleVariant.salePrice)
      : originalPrice
        ? Math.round(originalPrice * 0.75)
        : 399;

  const discountPercent =
    originalPrice > salePrice
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 28;

  const productName = saleProduct?.name || "TOMIOKA GIYU OVERSIZED TEE";
  const productUrl = saleProduct ? `/products/${saleProduct._id}` : "/sale";

  return (
    <section className="relative w-full py-8 md:py-12 bg-[#0D0D0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Vault Container - Sharp & Borderless (rounded-none bg-[#0D0D0D]) */}
        <div className="relative rounded-none bg-[#0D0D0D] text-white p-6 sm:p-10 md:p-14 lg:p-16">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
            {/* Left Side: Typography & Copy */}
            <div className="max-w-2xl text-left flex-1 space-y-5">
              {/* Top Pill / Badge (NO //) */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-[#e34234]/40 bg-[#e34234]/10">
                <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-widest text-[#e34234]">
                  LIMITED ARCHIVAL CLEARANCE - FINAL BATCH
                </span>
              </div>

              {/* Headline matching Image 2 */}
              <div className="space-y-1">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  SEASONAL{" "}
                  <span
                    className="font-normal lowercase text-[#e34234] tracking-normal"
                    style={{ fontFamily: "var(--font-serif-italic)" }}
                  >
                    clearance
                  </span>{" "}
                  VAULT.
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed max-w-xl">
                Archival release of our #1 Bestseller: {productName} 280 GSM
                Heavyweight Streetwear Tee. Once this batch sells out, the
                screenprint plates are retired forever.
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 pb-2 border-y border-neutral-800/80">
                <div>
                  <p className="text-base sm:text-xl font-black text-[#e34234] font-mono">
                    UP TO {discountPercent}%
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                    ARCHIVE MARKDOWN
                  </p>
                </div>
                <div>
                  <p className="text-base sm:text-xl font-black text-white font-mono">
                    280-420
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                    HEAVYWEIGHT GSM
                  </p>
                </div>
                <div>
                  <p className="text-base sm:text-xl font-black text-emerald-400 font-mono">
                    14-DAY
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                    FREE EXCHANGE
                  </p>
                </div>
              </div>

              {/* Action Buttons (Sharp Rectangles rounded-none) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={productUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-white hover:bg-[#e34234] text-neutral-950 hover:text-white text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
                >
                  <span>COP DROP FOR ₹{salePrice}</span>
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </Link>

                <Link
                  to="/sale"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-none bg-black hover:bg-neutral-900 text-white border border-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  ENTER BLOWOUT VAULT
                </Link>
              </div>
            </div>

            {/* Right Side: Featured Product Showcase (Matching Image 2) */}
            <div className="w-full lg:w-96 shrink-0">
              <Link
                to={productUrl}
                className="group block rounded-none border border-neutral-800 bg-[#141414] p-3 transition-all duration-300 hover:border-neutral-700"
              >
                {/* Image Frame */}
                <div className="relative aspect-[3/3.8] w-full rounded-none overflow-hidden bg-neutral-900 flex items-center justify-center">
                  <img
                    src={saleImage}
                    alt={productName}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/models/model1.png";
                    }}
                  />

                  {/* Top-Left Badge (NO //) */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-none bg-[#e34234] text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      SAVE {discountPercent}% - ₹{salePrice}
                    </span>
                  </div>

                  {/* Bottom-Right GSM Badge */}
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="rounded-none bg-black text-white px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider border border-white/10">
                      280 GSM TERRY
                    </span>
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="pt-3 pb-1 px-1 flex items-baseline justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      02-04-GIYU - BLACK
                    </p>
                    <h3 className="text-xs sm:text-[13px] font-black uppercase text-white truncate tracking-tight mt-0.5 group-hover:text-[#e34234] transition-colors">
                      {productName}
                    </h3>
                  </div>
                  <span className="text-sm font-mono font-black text-[#e34234] shrink-0">
                    ₹{salePrice}
                  </span>
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
