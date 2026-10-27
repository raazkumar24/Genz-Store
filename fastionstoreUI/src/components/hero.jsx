import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Palette, Star, Flame, ArrowUpRight } from "lucide-react";
import ColorSwatch from "./ui/ColorSwatch";
import { fetchPopularColors } from "../services/productService";
import {
  getHeroSpotlightConfig,
  getHeroMasterConfig,
  fetchHeroMasterConfig,
  HERO_CHANNEL_NAME,
} from "../services/heroShowcaseService";
import { useProducts } from "../context/ProductContext";

// Modular Subcomponents aur Constants
import {
  HeroSliderCard,
  PopularColorsCard,
  TacticalDropCard,
  SpotlightDropCard,
  HeroSubBento,
  ArchivedCatalogMiniCard,
  VerifiedRadarComboCard,
  HeroTrustStrip,
  heroSlides,
  defaultPopularColors,
  CANONICAL_PALETTES,
  canonicalizeColor,
  resolveColorHex,
} from "./hero/index";

/**
 * ============================================================================
 * Bento-Grid Hero Orchestrator Component
 * ============================================================================
 * Main storefront Hero orchestrator component assembling the bento grid:
 *
 * 1. HeroSliderCard: Left 8-col main interactive slider
 * 2. PopularColorsCard: Right 4-col curated color palette filters
 * 3. HeroSubBento: Bottom 3 micro cards (Archived Lookbook, Verified Reviews, Hot Radar)
 * 4. Dual-Drop Studio Showcase:
 *    - SpotlightDropCard: Curated featured topwear drop (Hoodies / Tees)
 *    - TacticalDropCard: Trending tactical bottomwear drop (Cargos / Pants)
 * 5. HeroTrustStrip: Bottom 4-column trust & service guarantees
 * ============================================================================
 */
const Hero = () => {
  // 1. Slider State
  const [current, setCurrent] = useState(0);

  // 2. Colors State
  const [colorsList, setColorsList] = useState(defaultPopularColors);

  // 3. Routing & Active Filters
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeColorFilter = searchParams.get("color")?.toLowerCase() || "";

  // 4. Live Master & Spotlight Config (from Admin panel & LocalStorage)
  const [masterConfig, setMasterConfig] = useState(getHeroMasterConfig);
  const [spotlightConfig, setSpotlightConfig] = useState(
    () => getHeroMasterConfig().spotlight || getHeroSpotlightConfig(),
  );

  const { products } = useProducts();

  // Multi-channel storefront sync (same-tab, cross-tab, window focus, storage)
  useEffect(() => {
    const syncConfig = (cfgInput) => {
      const cfg = cfgInput || getHeroMasterConfig();
      if (cfg) {
        setMasterConfig(cfg);
        if (cfg.spotlight) {
          setSpotlightConfig(cfg.spotlight);
        }
      }
    };

    // 1. Initial sync on mount from cache + live fetch from backend DB
    syncConfig();
    fetchHeroMasterConfig().then((fresh) => {
      if (fresh) syncConfig(fresh);
    });

    // 2. Same-window custom events (from admin panel in same tab)
    const handleMasterUpdate = (e) => syncConfig(e.detail);
    const handleSpotlightUpdate = (e) => {
      setSpotlightConfig(e.detail || getHeroSpotlightConfig());
    };

    // 3. Cross-tab storage event (when admin saves in another tab)
    const handleStorage = (e) => {
      if (
        e.key === "genz_hero_master_config" ||
        e.key === "genz_hero_spotlight_config"
      ) {
        try {
          const parsed = JSON.parse(e.newValue);
          syncConfig(parsed);
        } catch {
          syncConfig();
        }
      }
    };

    // 4. Cross-tab BroadcastChannel for zero-latency instant updates
    let channel;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel(HERO_CHANNEL_NAME);
        channel.onmessage = (e) => {
          if (e.data?.type === "HERO_CONFIG_UPDATED" && e.data?.config) {
            syncConfig(e.data.config);
          }
        };
      } catch {}
    }

    // 5. Window focus (when user switches back to this storefront tab)
    const handleFocus = () => syncConfig();

    window.addEventListener("heroConfigUpdated", handleMasterUpdate);
    window.addEventListener("heroSpotlightUpdated", handleSpotlightUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("heroConfigUpdated", handleMasterUpdate);
      window.removeEventListener("heroSpotlightUpdated", handleSpotlightUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
    };
  }, []);

  // Fetch and sanitize popular colors from backend
  useEffect(() => {
    let isMounted = true;

    const loadColors = () => {
      fetchPopularColors().then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
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

        // Derive colors from active catalog products if backend colors are empty
        if (isMounted && products && products.length > 0) {
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

  // Handle color selection: toggle filter or navigate to catalog view
  const handleColorClick = (colorFilter) => {
    const isCurrentlyActive = activeColorFilter === colorFilter.toLowerCase();
    if (isCurrentlyActive) {
      navigate("/");
    } else {
      navigate(`/?color=${encodeURIComponent(colorFilter)}#catalog`);
    }

    setTimeout(() => {
      const el = document.getElementById("catalog");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 120);
  };

  // Active slides list
  const activeSlides =
    masterConfig?.slides && masterConfig.slides.length > 0
      ? masterConfig.slides
      : heroSlides;

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrent(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length,
    );
  }, [activeSlides.length]);

  // Automatic slide rotation (7 seconds)
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Resolve trending bottomwear cargo product from catalog
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

  const tacticalConfig = masterConfig?.tactical || {};

  const cargoImg =
    tacticalConfig.image ||
    cargoItem?.variants?.[0]?.images?.[0] ||
    cargoItem?.image ||
    "/collections/baggy_pants.png";

  const cargoName =
    tacticalConfig.title || cargoItem?.name || "Parachute Cargos";

  const cargoLink =
    tacticalConfig.link ||
    (cargoItem ? `/products/${cargoItem._id}` : "/collections/cargos");

  const cargoBadge =
    tacticalConfig.badgeText || "HEAVYWEIGHT 280 GSM";

  const cargoTag =
    tacticalConfig.tag || "TRENDING CARGO";

  const cargoBrand =
    tacticalConfig.brand || cargoItem?.brand || "GENZ ARCHIVE";

  const cargoPrice =
    tacticalConfig.price ||
    cargoItem?.variants?.[0]?.salePrice ||
    cargoItem?.variants?.[0]?.price ||
    "479";

  const cargoOriginalPrice =
    tacticalConfig.originalPrice ||
    (cargoItem?.variants?.[0]?.salePrice ? cargoItem?.variants?.[0]?.price : "799");

  const cargoSubtitle =
    tacticalConfig.subtitle || "RAW ECRU • RELAXED FIT";

  // Resolve spotlight showcase product based on admin configuration
  const featuredSpotlightProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    if (spotlightConfig.productId) {
      const found = products.find((p) => p._id === spotlightConfig.productId);
      if (found) return found;
    }
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

  const spotlightTag = spotlightConfig.tagPill || "Signature Fit";

  const spotlightLink = featuredSpotlightProduct
    ? `/products/${featuredSpotlightProduct._id}`
    : spotlightConfig.targetCategory === "tee"
      ? "/collections/oversized-tees"
      : "/collections/hoodies";

  // Archived drops ke 3 preview images
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

  return (
    <div className="relative w-full flex flex-col">
      {/* 1. Full-Width Edge-to-Edge Hero Slider (NO Box!) */}
      <HeroSliderCard
        slides={activeSlides}
        current={current}
        onSelectSlide={(idx) => setCurrent(idx)}
        onNextSlide={nextSlide}
        onPrevSlide={prevSlide}
      />

      {/* 2. Full-Width Seamless Quick-Filter & Discovery Toolbar (NO Box!) */}
      <div className="w-full bg-[#FAFAF8] border-b border-neutral-200/90 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 flex-wrap">
          {/* Popular Colors Quick Swatches */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[11px] font-mono font-black uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
              <Palette size={13} className="text-[#FF3B00]" />
              POPULAR PALETTES:
            </span>
            <div className="flex items-center gap-2">
              {colorsList.map((color) => {
                const isActive =
                  activeColorFilter === color.filter?.toLowerCase();
                return (
                  <ColorSwatch
                    key={color.filter}
                    hex={color.hex}
                    name={color.name}
                    count={color.count}
                    isActive={isActive}
                    onClick={() => handleColorClick(color.filter)}
                  />
                );
              })}
            </div>
          </div>

          {/* Social Proof, 24h Worldwide Shipping, & Archive Link */}
          <div className="flex items-center gap-4 text-[11px] font-mono font-bold text-neutral-600 flex-wrap">
            <span className="flex items-center gap-1 text-neutral-900">
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="font-black">4.9/5</span>
              </span>
              <span>• 10,400+ VERIFIED HEADS</span>
            </span>

            <span className="hidden sm:inline text-neutral-300">•</span>

            <span className="flex items-center gap-1 text-[#FF3B00]">
              <Flame size={12} className="fill-[#FF3B00]" />
              <span>DROP 04 SHIPS IN 24H</span>
            </span>

            <span className="hidden sm:inline text-neutral-300">•</span>

            <a
              href="#archived-drops"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("archived-drops");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else navigate("/new-arrivals");
              }}
              className="text-neutral-900 hover:text-[#FF3B00] transition-colors flex items-center gap-1 font-black"
            >
              <span>ARCHIVED CATALOG (460+ DROPS)</span>
              <ArrowUpRight size={12} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Curated Dual-Drop Editorial Showcase (Studio Spotlight & Trending Bottomwear) */}
      <section className="w-full bg-[#F5F5F1] py-8 sm:py-12 border-b border-neutral-200/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-[#FF3B00]">
                01 - STUDIO CURATED SHOWCASE
              </span>
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-neutral-950 mt-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                FEATURED TOPWEAR & TACTICAL BOTTOMWEAR
              </h2>
            </div>

            <Link
              to="/collections/hoodies"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 hover:text-[#FF3B00] transition-colors"
            >
              <span>EXPLORE ALL DROPS</span>
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
            {/* Featured Studio Topwear Drop */}
            <SpotlightDropCard
              spotlightConfig={spotlightConfig}
              spotlightLink={spotlightLink}
              spotlightImg={spotlightImg}
              spotlightName={spotlightName}
              spotlightPrice={spotlightPrice}
              spotlightBadge={spotlightBadge}
              spotlightTag={spotlightTag}
              brand={featuredSpotlightProduct?.brand}
            />

            {/* Featured Studio Bottomwear Drop */}
            <TacticalDropCard
              cargoImg={cargoImg}
              cargoName={cargoName}
              cargoLink={cargoLink}
              brand={cargoBrand}
              cargoBadge={cargoBadge}
              cargoTag={cargoTag}
              cargoPrice={cargoPrice}
              cargoOriginalPrice={cargoOriginalPrice}
              cargoSubtitle={cargoSubtitle}
            />
          </div>
        </div>
      </section>

      {/* 4. Full-Width Trust & Service Guarantee Strip */}
      <HeroTrustStrip />
    </div>
  );
};

export default Hero;
