import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Star,
  Flame,
  Zap,
  ShieldCheck,
  RotateCcw,
  Layers,
} from "lucide-react";
import { fetchPopularColors } from "../services/productService";
import { getHeroSpotlightConfig } from "../services/heroShowcaseService";
import { useProducts } from "../context/ProductContext";

/**
 * Editorial Streetwear Slides Archive
 * Technical specs, fabric weights, and drop numbers
 */
const heroSlides = [
  {
    number: "01",
    image: "/models/model1.png",
    badge: "DROP 04 // 2026",
    tag: "OVERSIZED FIT",
    title: "Heavyweight Boxy Streetwear.",
    specHeadline: "Clear Silhouettes",
    specDetail:
      "280 GSM combed organic cotton with relaxed drop-shoulder cut and anti-fade reactive dye.",
    primaryCta: "View All Products",
    primaryLink: "/new-arrivals",
    accentBadge: "100% Supima Cotton",
    stats: "280 GSM • Heavy Combed",
  },
  {
    number: "02",
    image: "/models/model3.png",
    badge: "NEW SEASON",
    tag: "TECHNICAL FLEECE",
    title: "Urban Relaxed Hoodies & Cargos.",
    specHeadline: "Weatherproof Weave",
    specDetail:
      "Architectural drape with double-needle ribbed hems and ultra-comfortable brushed interior fleece.",
    primaryCta: "Explore Hoodies",
    primaryLink: "/collections/hoodies",
    accentBadge: "Thermal Fleece",
    stats: "380 GSM • Brushed Interior",
  },
  {
    number: "03",
    image: "/models/model2.png",
    badge: "LIMITED RELEASE",
    tag: "STREET ESSENTIALS",
    title: "Tactical Minimal Daily Rotation.",
    specHeadline: "Pre-Shrunk Silhouette",
    specDetail:
      "Engineered boxy cuts that hold their shape through 50+ wash cycles without losing collar structure.",
    primaryCta: "Shop Essentials",
    primaryLink: "/collections/oversized-tees",
    accentBadge: "Signature Cut",
    stats: "Raw Finish • Acid Wash",
  },
];

/**
 * Fallback curated palette swatches for the Bento "Popular Colors" widget
 */
const defaultPopularColors = [
  { name: "Cobalt Blue", hex: "#2563EB", filter: "blue", count: 8 },
  { name: "Sunset Orange", hex: "#F97316", filter: "orange", count: 6 },
  { name: "Acid Lime", hex: "#84CC16", filter: "lime", count: 5 },
  { name: "Signal Crimson", hex: "#EF4444", filter: "red", count: 7 },
  { name: "Pitch Black", hex: "#111111", filter: "black", count: 14 },
];

/**
 * Bento-Grid Hero Component
 * Connected to backend popular colors API with smooth catalog scrolling.
 */
const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [colorsList, setColorsList] = useState(defaultPopularColors);
  const [hoveredColor, setHoveredColor] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [spotlightConfig, setSpotlightConfig] = useState(getHeroSpotlightConfig);

  // Listen for live spotlight updates from Admin panel
  useEffect(() => {
    const handleUpdate = (e) => {
      setSpotlightConfig(e.detail || getHeroSpotlightConfig());
    };
    window.addEventListener("heroSpotlightUpdated", handleUpdate);
    return () => window.removeEventListener("heroSpotlightUpdated", handleUpdate);
  }, []);

  // Fetch dynamic popular colors from backend on mount
  useEffect(() => {
    let isMounted = true;
    fetchPopularColors().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setColorsList(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleColorClick = (colorFilter) => {
    const isCurrentlyActive = activeColorFilter === colorFilter.toLowerCase();
    if (isCurrentlyActive) {
      // Toggle off filter
      navigate("/");
    } else {
      // Navigate to color filter and smooth-scroll to catalog
      navigate(`/?color=${encodeURIComponent(colorFilter)}#catalog`);
    }

    setTimeout(() => {
      const el = document.getElementById("catalog");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  const { products } = useProducts();

  // Dynamically resolve real tactical cargo item from backend products
  const cargoItem = useMemo(() => {
    if (!products || products.length === 0) return null;
    return (
      products.find((p) => {
        const text = [p.name, ...(p.category || []), ...(p.collection || [])]
          .join(" ")
          .toLowerCase();
        return (
          text.includes("cargo") ||
          text.includes("pant") ||
          text.includes("baggy")
        );
      }) ||
      products[1] ||
      products[0]
    );
  }, [products]);

  const cargoImg =
    cargoItem?.variants?.[0]?.images?.[0] ||
    cargoItem?.image ||
    "/collections/baggy_pants.png";
  const cargoName = cargoItem?.name || "Parachute Cargos";
  const cargoLink = cargoItem
    ? `/products/${cargoItem._id}`
    : "/collections/cargos";

  // Dynamically resolve Spotlight drop based on Admin Panel Configuration (Tee, Hoodie, or Cargo)
  const featuredSpotlightProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    // 1. If admin explicitly picked a product ID:
    if (spotlightConfig.productId) {
      const found = products.find((p) => p._id === spotlightConfig.productId);
      if (found) return found;
    }
    // 2. If admin picked targetCategory "tee":
    if (spotlightConfig.targetCategory === "tee") {
      const tee = products.find((p) => {
        const text = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
        return text.includes("tee") || text.includes("t-shirt") || text.includes("tshirt");
      });
      if (tee) return tee;
    }
    // 3. If admin picked targetCategory "cargo":
    if (spotlightConfig.targetCategory === "cargo") {
      const cargo = products.find((p) => {
        const text = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
        return text.includes("cargo") || text.includes("pant") || text.includes("baggy");
      });
      if (cargo) return cargo;
    }
    // 4. Default: hoodie / technical fleece
    return (
      products.find((p) => {
        const text = [p.name, ...(p.category || []), ...(p.collection || [])].join(" ").toLowerCase();
        return text.includes("hoodie") || text.includes("sweatshirt") || text.includes("fleece");
      }) || products[0]
    );
  }, [products, spotlightConfig]);

  const spotlightImg =
    spotlightConfig.customImage ||
    featuredSpotlightProduct?.variants?.find((v) => v.images && v.images.length > 0)?.images?.[0] ||
    featuredSpotlightProduct?.variants?.[0]?.images?.[0] ||
    featuredSpotlightProduct?.image ||
    (spotlightConfig.targetCategory === "tee" ? "/models/model1.png" : "/models/model3.png");

  const spotlightName =
    spotlightConfig.title || featuredSpotlightProduct?.name || "Signature Drop Showcase";

  const spotlightPrice =
    spotlightConfig.customPrice ||
    featuredSpotlightProduct?.variants?.[0]?.salePrice ||
    featuredSpotlightProduct?.variants?.[0]?.price ||
    1499;

  const spotlightBadge =
    spotlightConfig.badgeText ||
    (spotlightConfig.targetCategory === "tee"
      ? "HEAVYWEIGHT 240 GSM TEE"
      : "HEAVYWEIGHT 380 GSM HOODIE");

  const spotlightSubtitle =
    spotlightConfig.subtitle || "Drop shoulder & double-needle ribbed hem.";

  const spotlightTag = spotlightConfig.tagPill || "Signature Fit";

  const spotlightLink = featuredSpotlightProduct
    ? `/products/${featuredSpotlightProduct._id}`
    : spotlightConfig.targetCategory === "tee"
    ? "/collections/oversized-tees"
    : "/collections/hoodies";

  // Dynamically extract first 3 product images for archived catalog
  const archivedCatalogPreviews = useMemo(() => {
    if (products && products.length >= 3) {
      return products.slice(0, 3).map((p, idx) => ({
        name: p.name,
        image:
          p.variants?.[0]?.images?.[0] ||
          p.image ||
          `/models/model${(idx % 3) + 1}.png`,
      }));
    }
    return [
      { name: "Oversized Tees", image: "/collections/oversized_tees.png" },
      { name: "Baggy Pants", image: "/collections/baggy_pants.png" },
      { name: "Street Gear", image: "/collections/accessories.png" },
    ];
  }, [products]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Automatic slide rotation
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full bg-[#F3F4F0] pt-4 md:pt-6 pb-6 md:pb-10 overflow-hidden">
      {/* Background Micro Noise Texture */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:28px_28px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* UPPER BENTO GRID: Main Stage (8 cols) + Side Stack (4 cols) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* ------------------------------------------------------- */}
          {/* MAIN HERO BENTO CARD (Left 8 Cols)                      */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-8 bg-white rounded-[28px] md:rounded-[34px] border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between min-h-[500px] md:min-h-[560px]">
            {/* Top Row: Pill Badges & Slide Number indicator */}
            <div className="flex items-center justify-between gap-3 z-20 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-bold uppercase tracking-wider border border-neutral-200/60">
                  <Sparkles size={12} className="text-[var(--color-primary)]" />
                  {slide.badge}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-black uppercase tracking-wider">
                  <Flame size={11} className="text-amber-400 fill-amber-400" />
                  {slide.tag}
                </span>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Jump to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === current
                        ? "w-7 bg-neutral-900"
                        : "w-2 bg-neutral-200 hover:bg-neutral-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Middle Stage: Editorial Copy + Floating Product Cutout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto pt-6 pb-4 z-10">
              {/* Left Copy Column (7 cols on md) */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-4 md:space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-4"
                  >
                    {/* Big Streetwear Heading */}
                    <h1
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black uppercase tracking-tight text-neutral-900 leading-[1.04]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {slide.title}
                    </h1>

                    {/* Spec Label with 01 —— Detail Line */}
                    <div className="flex items-start gap-3.5 pt-1">
                      <span className="text-2xl sm:text-3xl font-black text-neutral-300 tracking-tighter shrink-0 select-none">
                        {slide.number}
                      </span>
                      <div className="border-l-2 border-neutral-200 pl-3.5 space-y-1">
                        <p className="text-xs font-black uppercase tracking-wider text-neutral-900">
                          {slide.specHeadline}
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed max-w-sm">
                          {slide.specDetail}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Dribbble-style Bento Pill Button */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <Link
                        to={slide.primaryLink}
                        className="group inline-flex items-center gap-3 rounded-full bg-neutral-900 hover:bg-black text-white pl-6 pr-2.5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-black/10 active:scale-[0.98]"
                      >
                        <span>{slide.primaryCta}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-900 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-200">
                          <ArrowUpRight
                            size={16}
                            strokeWidth={2.5}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      </Link>

                      <Link
                        to="/sale"
                        className="inline-flex items-center justify-center rounded-full border border-neutral-300/90 bg-white hover:bg-neutral-100 text-neutral-800 px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-2xs"
                      >
                        Sale %
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Cutout Showcase (5 cols on md) */}
              <div className="md:col-span-5 relative flex items-center justify-center h-[260px] sm:h-[320px] md:h-[360px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative h-full w-full flex items-center justify-center"
                  >
                    {/* Soft Backdrop Radial Aura */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-neutral-100 to-neutral-200/50 filter blur-xl -z-10" />

                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-auto object-contain object-bottom drop-shadow-2xl select-none"
                    />

                    {/* Floating Micro Spec Pill */}
                    <div className="absolute bottom-4 right-2 sm:right-4 bg-white/90 backdrop-blur-md border border-neutral-200/80 px-3 py-1.5 rounded-full shadow-md text-[10px] font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5 animate-bounce">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      {slide.accentBadge}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Row: Micro Brand Bar & Slider Arrows */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-neutral-400 z-20">
              <div className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                <span>GENZ STUDIO</span>
                <span className="mx-2">•</span>
                <span className="text-neutral-400 font-mono">
                  {slide.stats}
                </span>
              </div>

              {/* Prev / Next Circular Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT BENTO STACK (Right 4 Cols)                         */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5">
            {/* Card 1: Popular Colors Card (Direct homage to Dribbble shot & backend connected) */}
            <div className="bg-white rounded-[28px] border border-neutral-200/90 p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Popular Colors
                </span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {hoveredColor
                    ? hoveredColor.name
                    : activeColorFilter
                      ? `Filter: ${activeColorFilter}`
                      : "Click To Filter"}
                </span>
              </div>

              {/* Swatch Circles */}
              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                {colorsList.map((color) => {
                  const isActive =
                    activeColorFilter === color.filter.toLowerCase();
                  return (
                    <button
                      key={color.filter}
                      type="button"
                      onClick={() => handleColorClick(color.filter)}
                      onMouseEnter={() => setHoveredColor(color)}
                      onMouseLeave={() => setHoveredColor(null)}
                      className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-120 cursor-pointer shadow-xs ${
                        isActive
                          ? "ring-2 ring-neutral-900 ring-offset-2 scale-110 shadow-md"
                          : "hover:ring-2 hover:ring-neutral-400 hover:ring-offset-1"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} ${color.count ? `(${color.count} drops)` : ""}`}
                      aria-label={`Filter by ${color.name}`}
                    >
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Spotlight Drop Card with Circular Arrow Button */}
            <Link
              to={cargoLink}
              className="group bg-white rounded-[28px] border border-neutral-200/90 p-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                  Tactical Drop
                </span>
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-neutral-900 group-hover:text-[var(--color-primary)] transition-colors truncate">
                  {cargoName}
                </h2>
                <p className="text-xs text-neutral-500 font-medium truncate">
                  Multi-Pocket Baggy Fit
                </p>
              </div>

              {/* Thumbnail + Arrow Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-16 w-16 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200/70 p-1 flex items-center justify-center">
                  <img
                    src={cargoImg}
                    alt={cargoName}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/collections/baggy_pants.png";
                    }}
                  />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white group-hover:bg-[var(--color-primary)] group-hover:scale-110 transition-all duration-200">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            {/* Card 3: Featured Technical Outerwear Showcase (Configurable from Admin Panel) */}
            <Link
              to={spotlightLink}
              className="group relative bg-[#0E0F12] text-white rounded-[28px] border border-neutral-800 p-5 shadow-lg flex-1 min-h-[160px] flex items-center justify-between gap-4 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              {/* Subtle background glow */}
              <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-[var(--color-primary)]/15 filter blur-2xl" />

              <div className="flex flex-col justify-between h-full space-y-2 min-w-0 flex-1 z-10">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[10px] font-black uppercase tracking-wider mb-1.5">
                    {spotlightBadge}
                  </span>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors truncate">
                    {spotlightName}
                  </h2>
                  <p className="text-xs text-neutral-400 font-medium line-clamp-1 mt-0.5">
                    {spotlightSubtitle}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm font-black text-amber-400">
                    ₹{spotlightPrice}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {spotlightTag}
                  </span>
                </div>
              </div>

              {/* Product Image Preview + Arrow Button */}
              <div className="flex items-center gap-3 shrink-0 z-10">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-neutral-900 border border-neutral-700/80 overflow-hidden p-1 flex items-center justify-center">
                  <img
                    src={spotlightImg}
                    alt={spotlightName}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/models/model1.png";
                    }}
                  />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:scale-110 transition-all duration-200">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LOWER BENTO SUB-ROW: 3 Micro Bento Cards                   */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-4 md:mt-5">
          {/* Sub-Card 1: "More Products / Archived Drops" */}
          <Link
            to="/new-arrivals"
            className="group bg-white rounded-[26px] border border-neutral-200/90 p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-black uppercase tracking-tight text-neutral-900">
                  Archived Catalog
                </span>
                <Heart size={13} className="text-rose-500 fill-rose-500" />
              </div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                {products?.length
                  ? `${products.length}+ Streetwear Drops`
                  : "460+ Streetwear Pieces"}
              </p>
            </div>

            {/* Dynamic Product Previews from Backend Data */}
            <div className="flex items-center -space-x-2">
              {archivedCatalogPreviews.map((item, idx) => (
                <div
                  key={idx}
                  className="h-10 w-10 rounded-xl bg-neutral-100 border-2 border-white overflow-hidden p-0.5 shadow-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/models/model1.png";
                    }}
                  />
                </div>
              ))}
            </div>
          </Link>

          {/* Sub-Card 2: "12k+ Community • ★ 4.9 Reviews" */}
          <div className="bg-white rounded-[26px] border border-neutral-200/90 p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Member Initials Avatar Cluster (No external image links) */}
              <div className="flex items-center -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-white text-[11px] font-black shadow-xs">
                  RA
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] text-white text-[11px] font-black shadow-xs">
                  SK
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-neutral-700 text-amber-300 text-[11px] font-black shadow-xs">
                  JD
                </div>
              </div>

              <div>
                <p className="text-sm font-black text-neutral-900 tracking-tight leading-none">
                  12k+ Community
                </p>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-500">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>4.9 / 5.0 Rating</span>
                </div>
              </div>
            </div>

            <span
              className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
              title="Live Community"
            />
          </div>

          {/* Sub-Card 3: "Hot Drop Radar" */}
          <Link
            to="/new-arrivals"
            className="group bg-white rounded-[26px] border border-neutral-200/90 p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex items-center justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-[10px] font-black uppercase tracking-wider">
                  <Flame size={11} className="fill-[var(--color-primary)]" />
                  Hot Radar
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Worldwide
                </span>
              </div>
              <p className="text-xs font-black uppercase tracking-tight text-neutral-900 group-hover:text-[var(--color-primary)] transition-colors">
                Drop 04 Ships in 24 Hours
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 mt-5">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 py-3 px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-neutral-700">
          <div className="flex items-center gap-2.5">
            <Zap size={16} className="text-[var(--color-primary)] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider truncate">
              Fast 24-48h Dispatch
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Layers
              size={16}
              className="text-[var(--color-primary)] shrink-0"
            />
            <span className="text-xs font-bold uppercase tracking-wider truncate">
              280+ GSM Combed Cotton
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw
              size={16}
              className="text-[var(--color-primary)] shrink-0"
            />
            <span className="text-xs font-bold uppercase tracking-wider truncate">
              14-Day Easy Exchange
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck
              size={16}
              className="text-[var(--color-primary)] shrink-0"
            />
            <span className="text-xs font-bold uppercase tracking-wider truncate">
              100% Original Streetwear
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
