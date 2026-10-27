import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
 * Yeh main Hero component hai jo pure Hero section ko assemble karta hai.
 * Sabhi sub-parts ko alag-alag modules me divide kiya gaya hai:
 *
 * 1. HeroSliderCard: Left 8-col main interactive slider
 * 2. PopularColorsCard: Right top popular colors filter
 * 3. TacticalDropCard: Right middle trending bottomwear card
 * 4. SpotlightDropCard: Right bottom studio garment showcase
 * 5. HeroSubBento: Bottom 3 micro cards (Archived, Reviews, Hot Radar)
 * 6. HeroTrustStrip: Bottom 4-column trust & service guarantees
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

  // Backend se live popular colors fetch aur sanitize karna
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

        // Agar backend colors empty ho to products se derive karein
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

  // Color click handler: toggle karein ya catalog scroll karein
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

  // Tactical bottomwear cargo product resolve karna
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

  // Spotlight drop product resolve karna (Admin config ke anusaar)
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
    <section className="relative w-full bg-[#F4F4F0] pt-4 md:pt-6 pb-6 md:pb-10 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* UPPER BENTO GRID: Main Slider (8 cols) + Side Stack (4 cols) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* Main Hero Slider (Left 8 Cols) */}
          <HeroSliderCard
            slides={activeSlides}
            current={current}
            onSelectSlide={(idx) => setCurrent(idx)}
            onNextSlide={nextSlide}
            onPrevSlide={prevSlide}
          />

          {/* Right Bento Column Stack (Right 4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-5 lg:h-[600px] xl:h-[610px] justify-between">
            {/* 1. Popular Colors Card */}
            <PopularColorsCard
              colorsList={colorsList}
              activeColorFilter={activeColorFilter}
              onColorClick={handleColorClick}
            />

            {/* 2. Trending Tactical Bottomwear Card */}
            <TacticalDropCard
              cargoImg={cargoImg}
              cargoName={cargoName}
              cargoLink={cargoLink}
            />

            {/* 3. Featured Spotlight Drop Card */}
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
          </div>
        </div>

        {/* ========================================================= */}
        {/* LOWER BENTO SUB-ROW: 3 Micro Bento Cards                   */}
        {/* ========================================================= */}
        <HeroSubBento
          productsCount={products?.length || 0}
          archivedCatalogPreviews={archivedCatalogPreviews}
        />
      </div>

      {/* Trust & Guarantee Strip */}
      <HeroTrustStrip />
    </section>
  );
};

export default Hero;
