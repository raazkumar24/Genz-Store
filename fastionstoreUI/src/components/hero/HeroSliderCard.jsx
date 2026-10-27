import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { formatHeroImageUrl } from "../../services/heroShowcaseService";

/**
 * ============================================================================
 * HeroSliderCard Component (Left 8 Cols)
 * ============================================================================
 * Main Hero Stage:
 * - Top Row: Drop badge, Hot flame tag, and Slide indicators
 * - Middle Row: Title with drop specs, Explore Drop CTA & Sale button,
 *   plus floating streetwear product cutout image
 * - Bottom Row: Brand bar & Prev/Next slide navigation controls
 * ============================================================================
 */
export const HeroSliderCard = ({
  slides = [],
  current = 0,
  onSelectSlide,
  onNextSlide,
  onPrevSlide,
}) => {
  const slide = slides[current % slides.length] || slides[0];
  if (!slide) return null;

  const currentFormatted = String(current + 1).padStart(2, "0");
  const totalFormatted = String(slides.length).padStart(2, "0");

  return (
    <div className="w-full bg-white border-b border-neutral-200/90 relative overflow-hidden">
      {/* Full-Bleed Studio Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 relative z-10 flex flex-col justify-between min-h-[520px] md:min-h-[560px] lg:h-[590px] xl:h-[620px]">
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

        {/* Slide Counter & Dots */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono font-bold text-neutral-400">
            <span className="text-neutral-950 font-black">{currentFormatted}</span>
            <span className="mx-1">/</span>
            <span>{totalFormatted}</span>
          </span>

          <div className="flex items-center gap-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSlide(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`h-1.5 rounded-none transition-all duration-300 cursor-pointer ${
                  idx === current
                    ? "w-7 bg-black"
                    : "w-2 bg-neutral-300 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Middle Stage: Editorial Copy + Floating Product Cutout (Full Width Grid) */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 min-h-0 pt-3 pb-2 sm:pt-4 sm:pb-3 z-10 overflow-hidden">
        {/* Left Copy Column (7 cols on lg) */}
        <div className="w-full lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6 shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current}-${slide.id || current}-${slide.title || ""}-${slide.badge || ""}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-3 sm:space-y-4 md:space-y-5"
            >
              {/* Big Streetwear Heading */}
              <h1
                className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black uppercase tracking-tight text-neutral-950 leading-[1.02] break-words"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {slide.title}
              </h1>

              {/* Spec Label with 01 —— Detail Line */}
              <div className="flex items-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-200 tracking-tighter shrink-0 select-none font-mono">
                  {slide.number}
                </span>
                <div className="border-l-2 border-neutral-300 pl-3 sm:pl-4 space-y-1">
                  <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-950 font-mono">
                    {slide.specHeadline}
                  </p>
                  <p className="text-xs sm:text-sm md:text-[15px] text-neutral-600 font-medium leading-relaxed max-w-xl">
                    {slide.specDetail}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Sharp Rectangular Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={slide.primaryLink || "/new-arrivals"}
                  className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-none bg-black hover:bg-[#FF3B00] text-white text-xs font-mono font-black uppercase tracking-wider transition-colors shadow-xs"
                >
                  <span>{slide.primaryCta || "EXPLORE DROP 04"}</span>
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </Link>

                <Link
                  to="/sale"
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-none border border-black bg-white hover:bg-black hover:text-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                >
                  ARCHIVE SALE (UP TO 50% OFF)
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Cutout Showcase (5 cols on lg) */}
        <div className="w-full lg:col-span-5 relative flex-1 min-h-[220px] sm:min-h-[280px] md:h-[340px] lg:h-[420px] xl:h-[460px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current}-${slide.id || current}-${slide.image || ""}`}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative h-full w-full flex items-center justify-center"
            >
              <img
                src={formatHeroImageUrl(slide.image)}
                alt={slide.title}
                className="h-full w-auto max-h-full max-w-full object-contain object-bottom drop-shadow-2xl select-none pointer-events-none"
              />

              {/* Floating Micro Spec Pill */}
              <div className="absolute bottom-2 right-1 sm:bottom-4 sm:right-4 bg-white/95 border border-neutral-200 px-3.5 py-1.5 rounded-none shadow-sm text-[10px] font-mono font-black uppercase tracking-wider text-neutral-950 flex items-center gap-2 backdrop-blur-xs">
                <span className="h-2 w-2 rounded-none bg-emerald-500 animate-pulse" />
                <span>{slide.accentBadge || "100% SUPIMA COTTON"}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Row: Micro Brand Bar & Slider Arrows */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-neutral-400 z-20">
        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-500">
          <span className="text-neutral-950 font-black">GENZ STUDIO</span>
          <span className="mx-2">•</span>
          <span className="text-neutral-400">{slide.stats}</span>
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevSlide}
            aria-label="Previous Slide"
            className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-300 bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft size={15} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={onNextSlide}
            aria-label="Next Slide"
            className="flex h-8 w-8 items-center justify-center rounded-none border border-neutral-300 bg-white hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default HeroSliderCard;
