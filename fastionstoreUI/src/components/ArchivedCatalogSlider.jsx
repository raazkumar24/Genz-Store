import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  getHeroMasterConfig,
  fetchHeroMasterConfig,
  HERO_CHANNEL_NAME,
} from "../services/heroShowcaseService";

/**
 * ArchivedCatalogSlider Component
 * Editorial Streetwear Campaign Lookbook directly matching Image 1:
 * - Subtitle: "02 - CURATED CAMPAIGN LOOKBOOK" (orange monospace, NO //)
 * - Headline: "THIS SEASON'S" (heavy extended) + "winter drops" (italic serif cursive)
 * - Minimal right link: "VIEW COMPLETE ARCHIVE (09) →"
 * - Borderless sharp rectangular cards (rounded-none)
 * - Badges: "LOOK 01 • MONOCHROME SET", "2 ITEMS IN LOOK"
 * - Action button: "SHOP THIS LOOK ↗" (sharp white button)
 */
const ArchivedCatalogSlider = () => {
  const [config, setConfig] = useState(() => getHeroMasterConfig().archivedCatalog);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Listen for live updates from Admin Panel (same-tab, cross-tab, focus, storage)
  useEffect(() => {
    const syncLookbook = (masterInput) => {
      const master = masterInput || getHeroMasterConfig();
      if (master?.archivedCatalog) {
        setConfig(master.archivedCatalog);
      }
    };

    // 1. Initial check + fetch fresh from backend DB
    syncLookbook();
    fetchHeroMasterConfig().then((fresh) => {
      if (fresh) syncLookbook(fresh);
    });

    // 2. Same-window event
    const handleUpdate = (e) => syncLookbook(e.detail);

    // 3. Cross-tab storage event
    const handleStorage = (e) => {
      if (e.key === "genz_hero_master_config") {
        try {
          syncLookbook(JSON.parse(e.newValue));
        } catch {
          syncLookbook();
        }
      }
    };

    // 4. Cross-tab BroadcastChannel
    let channel;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        channel = new BroadcastChannel(HERO_CHANNEL_NAME);
        channel.onmessage = (e) => {
          if (e.data?.type === "HERO_CONFIG_UPDATED" && e.data?.config) {
            syncLookbook(e.data.config);
          }
        };
      } catch {}
    }

    // 5. Window focus
    const handleFocus = () => syncLookbook();

    window.addEventListener("heroConfigUpdated", handleUpdate);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("heroConfigUpdated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
    };
  }, []);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const cards = config.cards || [];

  return (
    <section
      id="archived-drops"
      className="relative w-full bg-[#F4F4F0] py-10 sm:py-14 md:py-16 overflow-hidden scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Campaign Subtitle Tag (NO //, matching Image 1) */}
        <div className="mb-2">
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-[#FF3B00] uppercase">
            {config.campaignTag || "02 - CURATED CAMPAIGN LOOKBOOK"}
          </span>
        </div>

        {/* Top Header Row matching Image 1 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-neutral-950 tracking-tight leading-none"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {config.sectionTitle || "THIS SEASON'S"}
            </h2>
            <span
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 font-normal lowercase tracking-normal leading-none"
              style={{ fontFamily: "var(--font-serif-italic)" }}
            >
              {config.sectionSubtitle || "winter drops"}
            </span>
          </div>

          <Link
            to={config.seeAllLink || "/new-arrivals"}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wider text-neutral-900 hover:text-[#FF3B00] underline underline-offset-4 transition-colors shrink-0"
          >
            <span>{config.seeAllText || "VIEW COMPLETE ARCHIVE (09)"}</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative group">
          {/* Floating Left Navigation Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className={`absolute -left-2 sm:-left-3 md:-left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-none bg-white shadow-md border border-neutral-200 text-neutral-900 hover:bg-black hover:text-white transition-all cursor-pointer ${
              canScrollLeft ? "opacity-100" : "opacity-30 pointer-events-none"
            }`}
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>

          {/* Floating Right Navigation Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className={`absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-none bg-white shadow-md border border-neutral-200 text-neutral-900 hover:bg-black hover:text-white transition-all cursor-pointer ${
              canScrollRight ? "opacity-100" : "opacity-30 pointer-events-none"
            }`}
          >
            <ArrowRight size={16} strokeWidth={2} />
          </button>

          {/* Horizontal Scrollable Row */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-3 px-0.5"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {cards.map((card, index) => {
              const badgeLeft =
                card.badgeLeft ||
                (index === 0
                  ? "LOOK 01 • MONOCHROME SET"
                  : index === 1
                  ? "LOOK 02 • FLUID DRAPE"
                  : "LOOK 03 • STUDIO");

              const badgeRight =
                card.badgeRight ||
                (index === 0
                  ? "2 ITEMS IN LOOK"
                  : index === 1
                  ? "3 ITEMS IN LOOK"
                  : "LIMITED DROP");

              const isOrangeBadge = index === 2 || badgeLeft.includes("STUDIO");

              return (
                <div
                  key={card.id || index}
                  className="group relative shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[390px] aspect-[3/4.2] rounded-none overflow-hidden bg-neutral-900 shadow-sm transition-all duration-300"
                  style={{ scrollSnapAlign: "start" }}
                >
                  {/* Full-bleed Lookbook Lifestyle Photography */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/models/model1.png";
                    }}
                  />

                  {/* Top Badges (Sharp rectangles matching Image 1, NO //) */}
                  <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
                    <span
                      className={`rounded-none px-2.5 py-1 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isOrangeBadge
                          ? "bg-[#FF3B00] text-white"
                          : "bg-black text-white"
                      }`}
                    >
                      {badgeLeft}
                    </span>

                    {badgeRight && (
                      <span className="rounded-none bg-white text-black px-2.5 py-1 text-[9px] md:text-[10px] font-mono font-black uppercase tracking-wider shadow-2xs">
                        {badgeRight}
                      </span>
                    )}
                  </div>

                  {/* Bottom Dark Gradient Shadow for High-Contrast Clean Typography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 via-50% to-transparent flex flex-col justify-end p-5 sm:p-6 md:p-7 z-10">
                    <h3
                      className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {card.title}
                    </h3>
                    
                    <p className="text-[11px] sm:text-xs text-neutral-200/90 font-medium leading-relaxed mt-1.5 drop-shadow line-clamp-2">
                      {card.subtitle}
                    </p>

                    <Link
                      to={card.link || "/new-arrivals"}
                      className="inline-flex items-center gap-1.5 mt-3.5 px-4 py-2 rounded-none bg-white hover:bg-[#FF3B00] text-neutral-950 hover:text-white text-[11px] font-black uppercase tracking-wider transition-colors max-w-fit shadow-xs"
                    >
                      <span>{card.buttonText || "SHOP THIS LOOK"}</span>
                      <ArrowUpRight size={13} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchivedCatalogSlider;
