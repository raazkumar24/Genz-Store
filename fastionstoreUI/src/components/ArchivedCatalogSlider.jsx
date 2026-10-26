import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getHeroMasterConfig } from "../services/heroShowcaseService";

/**
 * ArchivedCatalogSlider Component
 * Pixel-perfect Editorial Lookbook Carousel directly matching the user's reference design.
 * Features:
 * - Pure crisp white backdrop (bg-white)
 * - Ultra-tall condensed typography: "THIS SEASON'S WINTER DROPS"
 * - Minimal pill "See All ↗" button
 * - Tall vertical portrait cards with smooth rounded corners
 * - Condensed white titles ("SIMPLE CASUAL", "HANGOUT DRESS", "COZY ANYWHERE")
 * - Floating circular navigation buttons with sleek arrows (← and →)
 */
const ArchivedCatalogSlider = () => {
  const [config, setConfig] = useState(() => getHeroMasterConfig().archivedCatalog);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Listen for live updates from Admin Panel
  useEffect(() => {
    const handleUpdate = (e) => {
      const master = e.detail || getHeroMasterConfig();
      if (master?.archivedCatalog) {
        setConfig(master.archivedCatalog);
      }
    };
    window.addEventListener("heroConfigUpdated", handleUpdate);
    return () => window.removeEventListener("heroConfigUpdated", handleUpdate);
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
      className="relative w-full bg-white py-10 sm:py-14 md:py-18 overflow-hidden scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row matching screenshot */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black uppercase text-neutral-950 tracking-[-0.01em] leading-none"
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            {config.sectionTitle || "THIS SEASON'S WINTER DROPS"}
          </h2>

          <Link
            to={config.seeAllLink || "/new-arrivals"}
            className="group inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-neutral-300 hover:border-neutral-950 bg-white hover:bg-neutral-950 hover:text-white text-xs sm:text-sm font-semibold text-neutral-800 transition-all duration-200 shrink-0 shadow-2xs"
          >
            <span>{config.seeAllText || "See All"}</span>
            <ArrowUpRight
              size={14}
              strokeWidth={2.2}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative group">
          {/* Floating Left Navigation Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className={`absolute -left-2 sm:-left-3 md:-left-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-neutral-200/90 text-neutral-800 hover:bg-neutral-950 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer ${
              canScrollLeft ? "opacity-100" : "opacity-40 hover:opacity-100"
            }`}
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>

          {/* Floating Right Navigation Arrow Button */}
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className={`absolute -right-2 sm:-right-3 md:-right-5 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-neutral-200/90 text-neutral-800 hover:bg-neutral-950 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer ${
              canScrollRight ? "opacity-100" : "opacity-40 hover:opacity-100"
            }`}
          >
            <ArrowRight size={18} strokeWidth={1.8} />
          </button>

          {/* Horizontal Scrollable Row */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-3 px-1"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {cards.map((card, index) => (
              <Link
                key={card.id || index}
                to={card.link || "/new-arrivals"}
                className="group relative shrink-0 w-[270px] sm:w-[310px] md:w-[340px] lg:w-[370px] h-[420px] sm:h-[470px] md:h-[510px] lg:h-[530px] rounded-[24px] md:rounded-[30px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1"
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

                {/* Bottom Dark Gradient Shadow for High-Contrast Clean Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 via-40% to-transparent flex flex-col justify-end p-6 sm:p-7 md:p-8 transition-opacity duration-300">
                  <h3
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-white leading-none drop-shadow-md group-hover:text-amber-300 transition-colors"
                    style={{ fontFamily: "var(--font-condensed)" }}
                  >
                    {card.title}
                  </h3>
                  
                  <p className="text-xs sm:text-[13px] text-white/90 font-normal leading-snug mt-2 drop-shadow line-clamp-2">
                    {card.subtitle || "More than 100+ collection available for all gender"}
                  </p>
                </div>

                {/* Subtle Hover Ring Accent */}
                <div className="absolute inset-0 rounded-[24px] md:rounded-[30px] border border-white/0 group-hover:border-white/30 transition-colors pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchivedCatalogSlider;
