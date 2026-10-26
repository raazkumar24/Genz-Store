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
    badge: "DROP 04 - 2026",
    tag: "OVERSIZED FIT",
    title: "Heavyweight Boxy Streetwear.",
    specHeadline: "Clear Silhouettes",
    specDetail:
      "280 GSM combed organic cotton with relaxed drop-shoulder cut and anti-fade reactive dye.",
    primaryCta: "Explore Drop 04",
    primaryLink: "/new-arrivals",
    accentBadge: "100% Supima Cotton",
    stats: "280 GSM • Heavy Combed",
  },
  {
    number: "02",
    image: "/models/model3.png",
    badge: "NEW SEASON",
    tag: "TECHNICAL FLEECE",
    title: "Urban Relaxed T-shirt",
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
  const hues = [
    "#2563EB",
    "#F97316",
    "#84CC16",
    "#EF4444",
    "#4D7C0F",
    "#A855F7",
    "#D4B996",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return hues[Math.abs(hash) % hues.length];
};

const CANONICAL_PALETTES = [
  {
    key: "black",
    name: "Black",
    hex: "#111111",
    keywords: ["black", "noir", "dark", "jet", "pitch"],
  },
  {
    key: "white",
    name: "White",
    hex: "#FFFFFF",
    keywords: ["white", "ivory", "snow", "swanwhite"],
  },
  {
    key: "blue",
    name: "Blue",
    hex: "#2563EB",
    keywords: [
      "blue",
      "navy",
      "cobalt",
      "cyan",
      "teal",
      "indigo",
      "sky",
      "denim",
    ],
  },
  {
    key: "red",
    name: "Red",
    hex: "#EF4444",
    keywords: [
      "red",
      "crimson",
      "wine",
      "maroon",
      "burgundy",
      "ruby",
      "scarlet",
      "cherry",
    ],
  },
  {
    key: "brown",
    name: "Brown",
    hex: "#78350F",
    keywords: ["brown", "coffee", "mocha", "chocolate", "espresso", "cocoa"],
  },
  {
    key: "green",
    name: "Green",
    hex: "#4D7C0F",
    keywords: ["green", "olive", "sage", "forest", "emerald", "lime", "mint"],
  },
  {
    key: "grey",
    name: "Grey",
    hex: "#6B7280",
    keywords: ["grey", "gray", "charcoal", "slate", "ash", "silver"],
  },
  {
    key: "beige",
    name: "Beige",
    hex: "#D4B996",
    keywords: ["beige", "cream", "khaki", "sand", "tan", "nude", "wheat"],
  },
  {
    key: "orange",
    name: "Orange",
    hex: "#F97316",
    keywords: ["orange", "rust", "tangerine", "peach", "coral"],
  },
  {
    key: "purple",
    name: "Purple",
    hex: "#A855F7",
    keywords: ["purple", "lavender", "violet", "lilac", "plum"],
  },
  {
    key: "yellow",
    name: "Yellow",
    hex: "#EAB308",
    keywords: ["yellow", "mustard", "amber", "gold"],
  },
  {
    key: "pink",
    name: "Pink",
    hex: "#EC4899",
    keywords: ["pink", "rose", "fuchsia", "magenta"],
  },
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
    () => getHeroMasterConfig().spotlight || getHeroSpotlightConfig(),
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
                name:
                  canonical?.name ||
                  item.name ||
                  key.charAt(0).toUpperCase() + key.slice(1),
                filter: key,
                hex:
                  item.hex && item.hex !== "#888888" && item.hex !== "#888"
                    ? item.hex
                    : canonical?.hex || resolveColorHex(key),
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

          const derived = CANONICAL_PALETTES.filter(
            (p) => (counts[p.key] || 0) > 0,
          )
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
    setCurrent(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length,
    );
  }, [activeSlides.length]);

  // Automatic slide rotation
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = activeSlides[current % activeSlides.length] || activeSlides[0];

  return (
    <section className="relative w-full bg-[#FAF9F6] pt-4 md:pt-6 pb-6 md:pb-10 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* UPPER BENTO GRID: Main Stage (8 cols) + Side Stack (4 cols) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* ------------------------------------------------------- */}
          {/* MAIN HERO BENTO CARD (Left 8 Cols)                      */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-8 bg-white rounded-none border border-neutral-200/90 p-5 sm:p-8 md:p-10 shadow-xs relative overflow-hidden flex flex-col justify-between h-[560px] sm:h-[580px] md:h-[580px] lg:h-[600px] xl:h-[610px]">
            {/* Top Row: Pill Badges & Slide Number indicator */}
            <div className="flex items-center justify-between gap-3 z-20 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-neutral-100 text-neutral-900 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider border border-neutral-200">
                  {slide.badge}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-black text-white text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider">
                  <Flame size={12} className="text-[#FF3B00] fill-[#FF3B00]" />
                  {slide.tag}
                </span>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-1">
                {activeSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Jump to slide ${idx + 1}`}
                    className={`h-1.5 rounded-none transition-all duration-300 cursor-pointer ${
                      idx === current
                        ? "w-6 bg-black"
                        : "w-2 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Middle Stage: Editorial Copy + Floating Product Cutout */}
            <div className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-6 items-center flex-1 min-h-0 pt-2 pb-1 sm:pt-4 sm:pb-2 z-10 overflow-hidden">
              {/* Left Copy Column (7 cols on md) */}
              <div className="w-full md:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4 md:space-y-5 shrink-0">
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
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-200 tracking-tighter shrink-0 select-none font-mono">
                        {slide.number}
                      </span>
                      <div className="border-l-2 border-neutral-300 pl-3 sm:pl-4 space-y-0.5 sm:space-y-1">
                        <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-neutral-950 font-mono">
                          {slide.specHeadline}
                        </p>
                        <p className="text-[11px] sm:text-xs md:text-sm text-neutral-600 font-medium leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
                          {slide.specDetail}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Sharp Rectangular Buttons (Matching Image 5) */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                      <Link
                        to={slide.primaryLink}
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-none bg-black hover:bg-[#FF3B00] text-white text-xs font-mono font-black uppercase tracking-wider transition-colors shadow-xs"
                      >
                        <span>{slide.primaryCta || "EXPLORE DROP 04"}</span>
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </Link>

                      <Link
                        to="/sale"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-none border border-black bg-white hover:bg-black hover:text-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                      >
                        ARCHIVE SALE (UP TO 50% OFF)
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
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-auto max-h-full max-w-full object-contain object-bottom drop-shadow-xl select-none pointer-events-none"
                    />

                    {/* Floating Micro Spec Pill (Sharp rectangle) */}
                    <div className="absolute bottom-2 right-1 sm:bottom-4 sm:right-4 bg-white/95 border border-neutral-200 px-3 py-1.5 rounded-none shadow-sm text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-none bg-emerald-500" />
                      {slide.accentBadge}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Row: Micro Brand Bar & Slider Arrows */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-neutral-400 z-20">
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-500">
                <span className="text-neutral-900 font-black">GENZ STUDIO</span>
                <span className="mx-2">•</span>
                <span className="text-neutral-400">{slide.stats}</span>
              </div>

              {/* Prev / Next Circular Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-300 bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft size={15} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-300 bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT BENTO STACK (Right 4 Cols - Sharp Rectangles)      */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5 lg:h-[600px] xl:h-[610px] justify-between">
            {/* Card 1: Popular Colors Card */}
            <div className="bg-white rounded-none border border-neutral-200/90 p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-neutral-950 flex items-center gap-1.5">
                  <Palette size={14} className="text-[#FF3B00]" />
                  Popular Colors
                </span>
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-none border border-neutral-200">
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
                      className={`relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center swatch-dot transition-all duration-200 hover:scale-120 cursor-pointer border ${
                        color.hex?.toLowerCase() === "#ffffff" ||
                        color.hex?.toLowerCase() === "#fffdd0"
                          ? "border-neutral-300"
                          : "border-black/10"
                      } ${
                        isActive
                          ? "ring-2 ring-neutral-950 ring-offset-1 scale-110"
                          : "hover:ring-1 hover:ring-neutral-400"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} ${color.count ? `(${color.count} drops)` : ""}`}
                      aria-label={`Filter by ${color.name}`}
                    >
                      {isActive && (
                        <span
                          className={`h-1.5 w-1.5 swatch-dot ${
                            color.hex?.toLowerCase() === "#ffffff" ||
                            color.hex?.toLowerCase() === "#fffdd0"
                              ? "bg-neutral-950"
                              : "bg-white"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Tactical Drop Card (Matching Image 5 Bottom-Right Card) */}
            <Link
              to={cargoLink}
              className="group bg-white rounded-none border border-neutral-200/90 hover:border-black p-4 shadow-xs flex items-center justify-between gap-3 transition-all duration-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-16 w-16 rounded-none bg-neutral-100 border border-neutral-200/80 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={cargoImg}
                    alt={cargoName}
                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/collections/baggy_pants.png";
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-0.5 min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF3B00]">
                    • TRENDING BOTTOMWEAR
                  </span>
                  <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight text-neutral-950 group-hover:text-[#FF3B00] transition-colors truncate">
                    {cargoName}
                  </h2>
                  <p className="text-[11px] font-mono text-neutral-500 font-medium truncate">
                    ₹479{" "}
                    <span className="line-through text-neutral-400">₹799</span>{" "}
                    • Raw Ecru
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-black text-white group-hover:bg-[#FF3B00] transition-colors shrink-0 font-bold text-sm">
                +
              </div>
            </Link>

            {/* Card 3: Spotlight Drop Card (Editorial Studio Showcase) */}
            {(() => {
              const isLightCard = spotlightConfig.cardTheme === "light";
              return (
                <Link
                  to={spotlightLink}
                  className={`group relative rounded-none border p-4 sm:p-5 flex-1 min-h-[280px] flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                    isLightCard
                      ? "bg-white text-neutral-950 border-neutral-200/90 shadow-xs"
                      : "bg-[#0E1013] text-white border-neutral-800 shadow-sm"
                  }`}
                >
                  {/* Top Bar: Specs Badge + Tag Pill */}
                  <div className="flex items-center justify-between gap-2 z-10">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isLightCard
                          ? "bg-neutral-100 text-neutral-800 border border-neutral-200"
                          : "bg-white/10 text-neutral-200 border border-white/10"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-none bg-[#FF3B00]" />
                      {spotlightBadge}
                    </span>

                    <span className="text-[11px] font-mono font-black uppercase tracking-wider text-[#FF3B00]">
                      {spotlightTag}
                    </span>
                  </div>

                  {/* Hero Studio Garment Showcase (Prominent, High-Resolution, No White Square Artifacts) */}
                  <div className="relative w-full flex-1 min-h-[170px] sm:min-h-[190px] my-3 rounded-none overflow-hidden bg-white border border-neutral-200/50 flex items-center justify-center p-3 group/img shadow-2xs">
                    {/* Architectural Studio Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#0000000c_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                    <img
                      src={spotlightImg}
                      alt={spotlightName}
                      className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-108 select-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/models/model1.png";
                      }}
                    />

                    {/* Bottom Technical Pill on Image */}
                    <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-none bg-neutral-900/90 text-[9px] font-mono font-bold text-white uppercase tracking-wider border border-white/10">
                        DROP SPOTLIGHT
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 z-10 pointer-events-none">
                      <span className="px-1.5 py-0.5 rounded-none bg-[#FF3B00] text-[9px] font-mono font-black text-white uppercase tracking-wider">
                        NEW
                      </span>
                    </div>
                  </div>

                  {/* Product Details Section */}
                  <div className="flex flex-col space-y-1 z-10">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest truncate">
                      {featuredSpotlightProduct?.brand || "TAGAS ARCHIVE"} •
                      UNISEX
                    </p>
                    <h2
                      className={`text-sm sm:text-base font-black uppercase tracking-tight transition-colors line-clamp-1 ${
                        isLightCard
                          ? "text-neutral-950 group-hover:text-[#FF3B00]"
                          : "text-white group-hover:text-[#FF3B00]"
                      }`}
                    >
                      {spotlightName}
                    </h2>
                    <div className="flex items-baseline gap-2.5 pt-0.5">
                      <span className="text-lg sm:text-xl font-mono font-black text-[#FF3B00]">
                        ₹{spotlightPrice}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400 font-bold uppercase">
                        280 GSM • RELAXED CUT
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Strip */}
                  <div
                    className={`flex items-center justify-between pt-3 mt-2 border-t z-10 ${
                      isLightCard ? "border-neutral-200" : "border-neutral-800"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 group-hover:text-[#FF3B00] transition-colors">
                      CLICK TO INSPECT SILHOUETTE
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-black group-hover:bg-[#FF3B00] group-hover:text-white transition-colors">
                      <ArrowUpRight size={14} strokeWidth={2.5} />
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
          {/* Sub-Card 1: "More Products / Archived Drops" */}
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
            className="group bg-white rounded-none border border-neutral-200/90 hover:border-black p-4 shadow-xs flex items-center justify-between gap-4 cursor-pointer transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs font-mono font-black uppercase tracking-tight text-neutral-950">
                  Archived Catalog
                </span>
                <Heart size={13} className="text-rose-500 fill-rose-500" />
              </div>
              <p className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                {products?.length
                  ? `${products.length}+ Streetwear Drops`
                  : "460+ Streetwear Pieces"}
              </p>
            </div>

            {/* Dynamic Product Previews */}
            <div className="flex items-center -space-x-2">
              {archivedCatalogPreviews.map((item, idx) => (
                <div
                  key={idx}
                  className="h-10 w-10 rounded-none bg-neutral-100 border border-white overflow-hidden p-0.5 shadow-xs"
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

          {/* Sub-Card 2: "10,400+ Verified Streetwear Heads" (Matching Image 5) */}
          <div className="bg-white rounded-none border border-neutral-200/90 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-black text-white text-[10px] font-mono font-black">
                  10K
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#FF3B00] text-white text-[10px] font-mono font-black">
                  <span className="flex items-center gap-0.5">
                    <span>4.9</span>
                    <Star size={9} className="fill-white text-white" />
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs sm:text-[13px] font-mono font-black text-neutral-950 uppercase tracking-tight leading-none">
                  10,400+ Verified Heads
                </p>
                <p className="text-[10px] font-mono text-neutral-500 font-medium mt-1">
                  4.8/5 Average Fit & Fabric Rating
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 hidden sm:flex">
              <span className="text-[9px] font-mono text-neutral-400 uppercase">
                CORE:
              </span>
              <span className="h-2 w-2 swatch-dot bg-black" />
              <span className="h-2 w-2 swatch-dot bg-[#78350F]" />
              <span className="h-2 w-2 swatch-dot bg-[#EDE6D6]" />
            </div>
          </div>

          {/* Sub-Card 3: "Hot Drop Radar" */}
          <Link
            to="/new-arrivals"
            className="group bg-white rounded-none border border-neutral-200/90 hover:border-black p-4 shadow-xs flex items-center justify-between gap-4 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#FF3B00]/10 text-[#FF3B00] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Flame size={11} className="fill-[#FF3B00]" />
                  Hot Radar
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Worldwide
                </span>
              </div>
              <p className="text-xs font-mono font-black uppercase tracking-tight text-neutral-950 group-hover:text-[#FF3B00] transition-colors">
                Drop 04 Ships in 24 Hours
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-none bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors">
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 mt-5">
        <div className="bg-white rounded-none border border-neutral-200/90 shadow-2xs py-3.5 px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-neutral-900 font-mono">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#FF3B00] shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
              Fast 24-48h Dispatch
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#FF3B00] shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
              280+ GSM Combed Cotton
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw size={14} className="text-[#FF3B00] shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
              14-Day Easy Exchange
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#FF3B00] shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">
              100% Original Streetwear
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
