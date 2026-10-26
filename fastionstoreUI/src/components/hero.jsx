import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Flame,
  Zap,
  ShieldCheck,
  RotateCcw,
  Layers,
  Palette,
} from "lucide-react";
import { fetchPopularColors } from "../services/productService";
import {
  getHeroSpotlightConfig,
  getHeroMasterConfig,
} from "../services/heroShowcaseService";
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

// Comprehensive Streetwear Hex Map for client-side resolution
const STREET_COLOR_MAP = {
  black: "#111111",
  white: "#FFFFFF",
  gray: "#6B7280",
  grey: "#6B7280",
  charcoal: "#374151",
  slate: "#475569",
  beige: "#D4B996",
  khaki: "#C3B091",
  cream: "#FFFDD0",
  sand: "#E5D3B3",
  olive: "#4D7C0F",
  green: "#22C55E",
  sage: "#8A9A86",
  blue: "#2563EB",
  navy: "#1E3A8A",
  cobalt: "#1D4ED8",
  red: "#EF4444",
  crimson: "#DC2626",
  maroon: "#881337",
  orange: "#F97316",
  rust: "#C2410C",
  yellow: "#EAB308",
  mustard: "#D97706",
  amber: "#F59E0B",
  lime: "#84CC16",
  pink: "#EC4899",
  purple: "#A855F7",
  brown: "#92400E",
  tan: "#D2B48C",
  mocha: "#78350F",
};

const resolveColorHex = (colorString) => {
  if (!colorString) return "#111111";
  const str = String(colorString).trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str)) return str;
  if (STREET_COLOR_MAP[str]) return STREET_COLOR_MAP[str];
  for (const [key, hex] of Object.entries(STREET_COLOR_MAP)) {
    if (str.includes(key)) return hex;
  }
  // Curated diverse hues fallback instead of generic grey
  const hues = ["#2563EB", "#F97316", "#84CC16", "#EF4444", "#4D7C0F", "#A855F7", "#D4B996"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return hues[Math.abs(hash) % hues.length];
};

const CANONICAL_PALETTES = [
  { key: "black", name: "Black", hex: "#111111", keywords: ["black", "noir", "dark", "jet", "pitch"] },
  { key: "white", name: "White", hex: "#FFFFFF", keywords: ["white", "ivory", "snow", "swanwhite"] },
  { key: "blue", name: "Blue", hex: "#2563EB", keywords: ["blue", "navy", "cobalt", "cyan", "teal", "indigo", "sky", "denim"] },
  { key: "red", name: "Red", hex: "#EF4444", keywords: ["red", "crimson", "wine", "maroon", "burgundy", "ruby", "scarlet", "cherry"] },
  { key: "brown", name: "Brown", hex: "#78350F", keywords: ["brown", "coffee", "mocha", "chocolate", "espresso", "cocoa"] },
  { key: "green", name: "Green", hex: "#4D7C0F", keywords: ["green", "olive", "sage", "forest", "emerald", "lime", "mint"] },
  { key: "grey", name: "Grey", hex: "#6B7280", keywords: ["grey", "gray", "charcoal", "slate", "ash", "silver"] },
  { key: "beige", name: "Beige", hex: "#D4B996", keywords: ["beige", "cream", "khaki", "sand", "tan", "nude", "wheat"] },
  { key: "orange", name: "Orange", hex: "#F97316", keywords: ["orange", "rust", "tangerine", "peach", "coral"] },
  { key: "purple", name: "Purple", hex: "#A855F7", keywords: ["purple", "lavender", "violet", "lilac", "plum"] },
  { key: "yellow", name: "Yellow", hex: "#EAB308", keywords: ["yellow", "mustard", "amber", "gold"] },
  { key: "pink", name: "Pink", hex: "#EC4899", keywords: ["pink", "rose", "fuchsia", "magenta"] },
];

const canonicalizeColor = (colorString) => {
  if (!colorString) return null;
  const str = String(colorString).trim().toLowerCase();
  for (const pal of CANONICAL_PALETTES) {
    if (pal.key === str || pal.keywords.some((kw) => str.includes(kw))) {
      return pal;
    }
  }
  return null;
};

/**
 * Fallback curated palette swatches for the Bento "Popular Colors" widget
 */
const defaultPopularColors = [
  { name: "Black", hex: "#111111", filter: "black", count: 14 },
  { name: "White", hex: "#FFFFFF", filter: "white", count: 9 },
  { name: "Blue", hex: "#2563EB", filter: "blue", count: 8 },
  { name: "Orange", hex: "#F97316", filter: "orange", count: 6 },
  { name: "Red", hex: "#EF4444", filter: "red", count: 7 },
  { name: "Green", hex: "#4D7C0F", filter: "olive", count: 5 },
  { name: "Grey", hex: "#6B7280", filter: "grey", count: 4 },
  { name: "Beige", hex: "#D4B996", filter: "beige", count: 4 },
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
  const activeColorFilter = searchParams.get("color")?.toLowerCase() || "";

  const [masterConfig, setMasterConfig] = useState(getHeroMasterConfig);
  const [spotlightConfig, setSpotlightConfig] = useState(
    () => getHeroMasterConfig().spotlight || getHeroSpotlightConfig()
  );

  // Listen for live master config & spotlight updates from Admin panel
  useEffect(() => {
    const handleMasterUpdate = (e) => {
      const cfg = e.detail || getHeroMasterConfig();
      setMasterConfig(cfg);
      if (cfg?.spotlight) {
        setSpotlightConfig(cfg.spotlight);
      }
    };

    const handleSpotlightUpdate = (e) => {
      setSpotlightConfig(e.detail || getHeroSpotlightConfig());
    };

    window.addEventListener("heroConfigUpdated", handleMasterUpdate);
    window.addEventListener("heroSpotlightUpdated", handleSpotlightUpdate);
    return () => {
      window.removeEventListener("heroConfigUpdated", handleMasterUpdate);
      window.removeEventListener("heroSpotlightUpdated", handleSpotlightUpdate);
    };
  }, []);

  const { products } = useProducts();

  // Fetch dynamic popular colors from backend and sanitize hex values with canonical deduplication
  useEffect(() => {
    let isMounted = true;

    const loadColors = () => {
      fetchPopularColors().then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Enforce canonical normalization & deduplication so duplicate color circles are NEVER created
          const seenKeys = new Set();
          const unique = [];
          data.forEach((item) => {
            const raw = item.filter || item.color || item.name;
            const canonical = canonicalizeColor(raw);
            const key = canonical?.key || String(raw).toLowerCase().trim();
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              unique.push({
                name: canonical?.name || item.name || (key.charAt(0).toUpperCase() + key.slice(1)),
                filter: key,
                hex: item.hex && item.hex !== "#888888" && item.hex !== "#888" 
                  ? item.hex 
                  : (canonical?.hex || resolveColorHex(key)),
                count: item.count || 0,
              });
            }
          });
          if (unique.length > 0) {
            setColorsList(unique.slice(0, 8));
            return;
          }
        }

        if (isMounted && products && products.length > 0) {
          // Extract live colors from products context with canonical grouping
          const counts = {};
          products.forEach((p) => {
            const productColors = new Set();
            (p.variants || []).forEach((v) => {
              if (v.color) {
                const canonical = canonicalizeColor(v.color);
                if (canonical?.key) {
                  productColors.add(canonical.key);
                }
              }
            });
            productColors.forEach((k) => {
              counts[k] = (counts[k] || 0) + 1;
            });
          });

          const derived = CANONICAL_PALETTES
            .filter((p) => (counts[p.key] || 0) > 0)
            .map((p) => ({
              name: p.name,
              filter: p.key,
              hex: p.hex,
              count: counts[p.key],
            }))
            .sort((a, b) => b.count - a.count);

          if (derived.length > 0) {
            setColorsList(derived.slice(0, 8));
          }
        }
      });
    };

    loadColors();

    const handleCatalogUpdate = () => {
      loadColors();
    };
    window.addEventListener("catalogUpdated", handleCatalogUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("catalogUpdated", handleCatalogUpdate);
    };
  }, [products]);

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
        const text = [p.name, ...(p.category || []), ...(p.collection || [])]
          .join(" ")
          .toLowerCase();
        return (
          text.includes("tee") ||
          text.includes("t-shirt") ||
          text.includes("tshirt")
        );
      });
      if (tee) return tee;
    }
    // 3. If admin picked targetCategory "cargo":
    if (spotlightConfig.targetCategory === "cargo") {
      const cargo = products.find((p) => {
        const text = [p.name, ...(p.category || []), ...(p.collection || [])]
          .join(" ")
          .toLowerCase();
        return (
          text.includes("cargo") ||
          text.includes("pant") ||
          text.includes("baggy")
        );
      });
      if (cargo) return cargo;
    }
    // 4. Default: hoodie / technical fleece
    return (
      products.find((p) => {
        const text = [p.name, ...(p.category || []), ...(p.collection || [])]
          .join(" ")
          .toLowerCase();
        return (
          text.includes("hoodie") ||
          text.includes("sweatshirt") ||
          text.includes("fleece")
        );
      }) || products[0]
    );
  }, [products, spotlightConfig]);

  const spotlightImg =
    spotlightConfig.customImage ||
    featuredSpotlightProduct?.variants?.find(
      (v) => v.images && v.images.length > 0,
    )?.images?.[0] ||
    featuredSpotlightProduct?.variants?.[0]?.images?.[0] ||
    featuredSpotlightProduct?.image ||
    (spotlightConfig.targetCategory === "tee"
      ? "/models/model1.png"
      : "/models/model3.png");

  const spotlightName =
    spotlightConfig.title ||
    featuredSpotlightProduct?.name ||
    "Signature Drop Showcase";

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

  const activeSlides =
    masterConfig?.slides && masterConfig.slides.length > 0
      ? masterConfig.slides
      : heroSlides;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Automatic slide rotation
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = activeSlides[current % activeSlides.length] || activeSlides[0];

  return (
    <section className="relative w-full bg-[#F6F7F9] pt-4 md:pt-6 pb-6 md:pb-10 overflow-hidden">
      {/* Background Subtle Gradient & Micro Texture */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:32px_32px] opacity-[0.025]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* UPPER BENTO GRID: Main Stage (8 cols) + Side Stack (4 cols) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* ------------------------------------------------------- */}
          {/* MAIN HERO BENTO CARD (Left 8 Cols)                      */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-8 bg-white rounded-[32px] md:rounded-[36px] border border-neutral-200/90 hover:border-neutral-300/90 p-5 sm:p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.07)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[560px] sm:h-[580px] md:h-[580px] lg:h-[600px] xl:h-[610px]">
            {/* Top Row: Pill Badges & Slide Number indicator */}
            <div className="flex items-center justify-between gap-3 z-20 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-neutral-100/90 text-neutral-800 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-neutral-200/80 shadow-2xs">
                  {slide.badge}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-neutral-950 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Flame size={12} className="text-amber-400 fill-amber-400" />
                  {slide.tag}
                </span>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5 bg-neutral-100/70 p-1 rounded-full border border-neutral-200/60">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Jump to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === current
                        ? "w-6 bg-neutral-950"
                        : "w-2 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Middle Stage: Editorial Copy + Floating Product Cutout */}
            <div className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-6 items-center flex-1 min-h-0 pt-2 pb-1 sm:pt-4 sm:pb-2 z-10 overflow-hidden">
              {/* Left Copy Column (7 cols on md) */}
              <div className="w-full md:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4 md:space-y-6 shrink-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="space-y-2.5 sm:space-y-4"
                  >
                    {/* Big Streetwear Heading */}
                    <h1
                      className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.25rem] font-black uppercase tracking-tight text-neutral-950 leading-[1.05] line-clamp-2 md:line-clamp-none"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {slide.title}
                    </h1>

                    {/* Spec Label with 01 —— Detail Line */}
                    <div className="flex items-start gap-3 sm:gap-4 pt-0.5 sm:pt-1">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-200 tracking-tighter shrink-0 select-none">
                        {slide.number}
                      </span>
                      <div className="border-l-2 border-neutral-200 pl-3 sm:pl-4 space-y-0.5 sm:space-y-1">
                        <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-950">
                          {slide.specHeadline}
                        </p>
                        <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 font-medium leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
                          {slide.specDetail}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Dribbble-style Bento Pill Button */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1.5 sm:pt-2.5">
                      <Link
                        to={slide.primaryLink}
                        className="group inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-neutral-950 hover:bg-black text-white pl-5 sm:pl-6 pr-2 py-2 sm:pr-2.5 sm:py-2.5 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-md shadow-black/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>{slide.primaryCta}</span>
                        <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white text-neutral-950 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-200 shadow-2xs">
                          <ArrowUpRight
                            size={15}
                            strokeWidth={2.5}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                      </Link>

                      <Link
                        to="/sale"
                        className="inline-flex items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white text-neutral-800 px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-2xs"
                      >
                        Sale %
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Cutout Showcase (5 cols on md) */}
              <div className="w-full md:col-span-5 relative flex-1 min-h-[170px] max-h-[220px] sm:max-h-[260px] md:max-h-none md:h-[340px] lg:h-[390px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.94, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative h-full w-full flex items-center justify-center"
                  >
                    {/* Soft Backdrop Radial Aura */}
                    <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-tr from-neutral-100 to-neutral-200/60 filter blur-xl -z-10" />

                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-auto max-h-full max-w-full object-contain object-bottom drop-shadow-2xl select-none pointer-events-none"
                    />

                    {/* Floating Micro Spec Pill */}
                    <div className="absolute bottom-2 right-1 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md border border-neutral-200/90 px-3 py-1.5 rounded-full shadow-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
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
                <span className="text-neutral-900 font-black">GENZ STUDIO</span>
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
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT BENTO STACK (Right 4 Cols)                         */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5 lg:h-[600px] xl:h-[610px] justify-between">
            {/* Card 1: Popular Colors Card (Refined borders, pill labels, active ring offset) */}
            <div className="bg-white rounded-[28px] md:rounded-[32px] border border-neutral-200/90 hover:border-neutral-300/90 p-5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.03)] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                  <Palette size={14} className="text-[var(--color-primary)]" />
                  Popular Colors
                </span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/60">
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
                      className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-120 cursor-pointer shadow-xs border ${
                        color.hex?.toLowerCase() === "#ffffff" || color.hex?.toLowerCase() === "#fffdd0"
                          ? "border-neutral-300"
                          : "border-black/10"
                      } ${
                        isActive
                          ? "ring-2 ring-neutral-950 ring-offset-2 scale-110 shadow-md"
                          : "hover:ring-2 hover:ring-neutral-400 hover:ring-offset-1"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} ${color.count ? `(${color.count} drops)` : ""}`}
                      aria-label={`Filter by ${color.name}`}
                    >
                      {isActive && (
                        <span className={`h-2 w-2 rounded-full shadow-xs ${
                          color.hex?.toLowerCase() === "#ffffff" || color.hex?.toLowerCase() === "#fffdd0"
                            ? "bg-neutral-950"
                            : "bg-white"
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Tactical Drop Card (Clean border, rotating circular button) */}
            <Link
              to={cargoLink}
              className="group bg-white rounded-[28px] md:rounded-[32px] border border-neutral-200/90 hover:border-neutral-300/90 p-5 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                  Tactical Drop
                </span>
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-950 group-hover:text-[var(--color-primary)] transition-colors truncate">
                  {cargoName}
                </h2>
                <p className="text-xs text-neutral-500 font-medium truncate">
                  Multi-Pocket Baggy Fit
                </p>
              </div>

              {/* Thumbnail + Arrow Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-neutral-50 overflow-hidden border border-neutral-200/80 p-1.5 flex items-center justify-center shadow-inner">
                  <img
                    src={cargoImg}
                    alt={cargoName}
                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/collections/baggy_pants.png";
                    }}
                  />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white group-hover:bg-[var(--color-primary)] group-hover:scale-110 group-hover:rotate-45 transition-all duration-200 shadow-sm">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </Link>

            {/* Card 3: Redesigned High-Impact Oversized Box / Signature Drop Card */}
            {(() => {
              const isLightCard = spotlightConfig.cardTheme === "light";
              return (
                <Link
                  to={spotlightLink}
                  className={`group relative rounded-[28px] md:rounded-[32px] border p-5 sm:p-6 flex-1 min-h-[180px] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    isLightCard
                      ? "bg-gradient-to-br from-white via-neutral-50 to-neutral-100 text-neutral-950 border-neutral-200/90 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.03)]"
                      : "bg-gradient-to-br from-[#121418] via-[#0E1013] to-[#08090A] text-white border-neutral-800/90 shadow-xl"
                  }`}
                >
                  {/* Subtle Ambient Radial Lighting */}
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full filter blur-3xl transition-opacity duration-500 ${
                      isLightCard
                        ? "bg-[var(--color-primary)]/10 opacity-70 group-hover:opacity-100"
                        : "bg-[var(--color-primary)]/20 opacity-80 group-hover:opacity-100"
                    }`}
                  />
                  <div
                    className={`pointer-events-none absolute -left-8 -bottom-8 h-36 w-36 rounded-full filter blur-2xl transition-opacity duration-500 ${
                      isLightCard ? "bg-amber-400/10" : "bg-amber-400/15"
                    }`}
                  />

                  {/* Top Bar: Specs Badge + Live Pulse */}
                  <div className="flex items-center justify-between gap-2 z-10 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isLightCard
                          ? "bg-neutral-100 text-neutral-800 border border-neutral-200/90 shadow-2xs"
                          : "bg-white/10 text-neutral-200 border border-white/10 backdrop-blur-md"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] animate-ping" />
                      {spotlightBadge}
                    </span>

                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        isLightCard ? "text-[var(--color-primary)]" : "text-amber-400"
                      }`}
                    >
                      {spotlightTag}
                    </span>
                  </div>

                  {/* Middle Content & Garment Showcase */}
                  <div className="flex items-center justify-between gap-3 z-10 flex-1 my-1">
                    <div className="flex flex-col space-y-1 min-w-0 flex-1">
                      <h2
                        className={`text-base sm:text-lg font-black uppercase tracking-tight transition-colors line-clamp-1 ${
                          isLightCard
                            ? "text-neutral-950 group-hover:text-[var(--color-primary)]"
                            : "text-white group-hover:text-amber-300"
                        }`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {spotlightName}
                      </h2>
                      <p
                        className={`text-xs font-medium line-clamp-1 ${
                          isLightCard ? "text-neutral-500" : "text-neutral-400"
                        }`}
                      >
                        {spotlightSubtitle}
                      </p>
                      <div className="flex items-baseline gap-2 pt-1.5">
                        <span
                          className={`text-base sm:text-lg font-black tracking-tight ${
                            isLightCard ? "text-neutral-950" : "text-white"
                          }`}
                        >
                          ₹{spotlightPrice}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Pre-Shrunk 280 GSM
                        </span>
                      </div>
                    </div>

                    {/* Elevated Floating Product Preview with Ambient Backdrop */}
                    <div className="relative shrink-0 flex items-center justify-center">
                      <div
                        className={`relative h-24 w-24 sm:h-26 sm:w-26 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                          isLightCard
                            ? "bg-white/90 border border-neutral-200/80 shadow-xs"
                            : "bg-white/[0.07] backdrop-blur-md border border-white/10 shadow-inner"
                        }`}
                      >
                        <img
                          src={spotlightImg}
                          alt={spotlightName}
                          className={`h-full w-full object-contain p-2 ${
                            isLightCard ? "mix-blend-multiply" : "drop-shadow-lg"
                          }`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/models/model1.png";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Strip: Quick Explore Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      Explore Boxy Silhouette
                    </span>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                        isLightCard
                          ? "bg-neutral-950 text-white group-hover:bg-[var(--color-primary)] group-hover:scale-110 shadow-xs"
                          : "bg-white text-neutral-950 group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:scale-110 shadow-md"
                      }`}
                    >
                      <ArrowUpRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })()}
          </div>
        </div>

        {/* ========================================================= */}
        {/* LOWER BENTO SUB-ROW: 3 Micro Bento Cards                   */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-4 md:mt-5">
          {/* Sub-Card 1: "More Products / Archived Drops" - Smooth scrolls to Lookbook carousel */}
          <a
            href="#archived-drops"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("archived-drops");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate("/new-arrivals");
              }
            }}
            className="group bg-white rounded-[28px] md:rounded-[30px] border border-neutral-200/90 hover:border-neutral-400 p-4 sm:p-5 shadow-[0_6px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-black uppercase tracking-tight text-neutral-950">
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
          </a>

          {/* Sub-Card 2: "12k+ Community • ★ 4.9 Reviews" */}
          <div className="bg-white rounded-[28px] md:rounded-[30px] border border-neutral-200/90 hover:border-neutral-400 p-4 sm:p-5 shadow-[0_6px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Member Initials Avatar Cluster (No external image links) */}
              <div className="flex items-center -space-x-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-neutral-950 text-white text-[11px] font-black shadow-xs ring-1 ring-black/5">
                  RA
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[var(--color-primary)] text-white text-[11px] font-black shadow-xs ring-1 ring-black/5">
                  SK
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-neutral-800 text-amber-300 text-[11px] font-black shadow-xs ring-1 ring-black/5">
                  JD
                </div>
              </div>

              <div>
                <p className="text-sm font-black text-neutral-950 tracking-tight leading-none">
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
            className="group bg-white rounded-[28px] md:rounded-[30px] border border-neutral-200/90 hover:border-neutral-400 p-4 sm:p-5 shadow-[0_6px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4"
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
              <p className="text-xs font-black uppercase tracking-tight text-neutral-950 group-hover:text-[var(--color-primary)] transition-colors">
                Drop 04 Ships in 24 Hours
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 group-hover:bg-neutral-950 group-hover:text-white group-hover:rotate-45 transition-all duration-200 shadow-2xs">
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 mt-5">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl md:rounded-3xl border border-neutral-200/90 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.02)] hover:shadow-md transition-all py-3.5 px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-neutral-800">
          <div className="flex items-center gap-2.5">
            <Zap size={16} className="text-[var(--color-primary)] shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider truncate">
              Fast 24-48h Dispatch
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Layers
              size={16}
              className="text-[var(--color-primary)] shrink-0"
            />
            <span className="text-xs font-black uppercase tracking-wider truncate">
              280+ GSM Combed Cotton
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw
              size={16}
              className="text-[var(--color-primary)] shrink-0"
            />
            <span className="text-xs font-black uppercase tracking-wider truncate">
              14-Day Easy Exchange
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck
              size={16}
              className="text-[var(--color-primary)] shrink-0"
            />
            <span className="text-xs font-black uppercase tracking-wider truncate">
              100% Original Streetwear
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
