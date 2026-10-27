import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { formatHeroImageUrl } from "../../services/heroShowcaseService";

/**
 * ============================================================================
 * HeroSliderCard Component (Left 8 Cols)
 * ============================================================================
 * Clean streetwear hero stage:
 * - Solid single color background (#cbb3eb Digital Lilac) - ZERO GRADIENT
 * - FIXED height on every viewport, so changing slides never shifts the page
 * - Heading font auto-scales with title length (full text always visible)
 * - Image lives in a fixed box with object-contain
 * ============================================================================
 */

// Picks a heading size based on how long the title is, so long titles
// shrink instead of wrapping into extra lines and growing the container.
const getTitleSize = (title = "") => {
  const len = title.length;

  if (len > 45) {
    return "text-xl sm:text-3xl md:text-4xl lg:text-[2.4rem] xl:text-[2.75rem]";
  }
  if (len > 28) {
    return "text-2xl sm:text-3xl md:text-4xl lg:text-[2.9rem] xl:text-[3.2rem]";
  }
  return "text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.75rem]";
};

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
  const titleSize = getTitleSize(slide.title);

  return (
    <div className="w-full bg-[#cbb3eb] border-b border-black/15 relative overflow-hidden">
      {/* FIXED height container (no min-h) -> page height never changes */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 relative z-10 flex flex-col justify-between h-[780px] sm:h-[760px] md:h-[640px] lg:h-[590px] xl:h-[620px]">
        {/* Top Row: Pill Badges & Slide Number indicator */}
        <div className="flex items-center justify-between gap-3 z-20 flex-wrap shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-white text-neutral-950 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider border border-black/15 shadow-2xs">
              {slide.badge}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-black text-white text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-wider shadow-2xs">
              <Flame size={12} className="text-[#e34234] fill-[#e34234]" />
              {slide.tag}
            </span>
          </div>

          {/* Slide Counter & Dots */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono font-bold text-neutral-800">
              <span className="text-neutral-950 font-black">
                {currentFormatted}
              </span>
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
                      : "w-2 bg-black/25 hover:bg-black/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle Stage: Editorial Copy + Floating Product Cutout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1 min-h-0 pt-3 pb-2 sm:pt-4 sm:pb-3 z-10">
          {/* Left Copy Column */}
          <div className="w-full lg:col-span-7 flex flex-col justify-start lg:justify-center min-h-0 self-stretch">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current}-${slide.id || current}-${slide.title || ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-3 sm:space-y-4 md:space-y-5"
              >
                {/* Full Unclipped Heading, font scales with length */}
                <h1
                  className={`${titleSize} font-black uppercase tracking-tight text-neutral-950 leading-[1.04] break-words`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {slide.title}
                </h1>

                {/* Spec Label with 01 —— Detail Line */}
                <div className="flex items-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-black/25 tracking-tighter shrink-0 select-none font-mono">
                    {slide.number}
                  </span>
                  <div className="border-l-2 border-black/25 pl-3 sm:pl-4 space-y-1">
                    <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-neutral-950 font-mono">
                      {slide.specHeadline}
                    </p>
                    <p className="text-xs sm:text-sm md:text-[15px] text-neutral-900 font-medium leading-relaxed max-w-xl">
                      {slide.specDetail}
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Sharp Rectangular Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={slide.primaryLink || "/new-arrivals"}
                    className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-none bg-black hover:bg-neutral-900 text-white text-xs font-mono font-black uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <span>{slide.primaryCta || "EXPLORE DROP 04"}</span>
                    <ArrowUpRight size={15} strokeWidth={2.5} />
                  </Link>

                  <Link
                    to="/sale"
                    className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-none border border-black bg-white hover:bg-black hover:text-white text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-2xs"
                  >
                    ARCHIVE SALE (UP TO 50% OFF)
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Cutout Showcase: fixed-size box */}
          <div className="w-full lg:col-span-5 relative h-[340px] sm:h-[280px] md:h-[300px] lg:h-full flex items-center justify-center overflow-hidden shrink-0 lg:shrink">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${current}-${slide.id || current}-${slide.image || ""}`}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative h-full w-full flex items-center justify-center"
              >
                <img
                  src={formatHeroImageUrl(slide.image)}
                  alt={slide.title}
                  className="max-h-full max-w-full w-auto h-auto object-contain object-bottom select-none pointer-events-none"
                />

                {/* Floating Micro Spec Pill */}
                <div className="absolute bottom-2 right-1 sm:bottom-4 sm:right-4 bg-white/95 border border-black/15 px-3.5 py-1.5 rounded-none shadow-sm text-[10px] font-mono font-black uppercase tracking-wider text-neutral-950 flex items-center gap-2 backdrop-blur-xs">
                  <span className="h-2 w-2 rounded-none bg-[#e34234] animate-pulse" />
                  <span>{slide.accentBadge || "100% SUPIMA COTTON"}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Row: Micro Brand Bar & Slider Arrows */}
        <div className="flex items-center justify-between pt-4 border-t border-black/15 text-neutral-700 z-20 shrink-0">
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-800">
            <span className="text-neutral-950 font-black">GENZ STUDIO</span>
            <span className="mx-2">•</span>
            <span className="text-neutral-800 font-bold">{slide.stats}</span>
          </div>

          {/* Prev / Next Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevSlide}
              aria-label="Previous Slide"
              className="flex h-8 w-8 items-center justify-center rounded-none border border-black/25 bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft size={15} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={onNextSlide}
              aria-label="Next Slide"
              className="flex h-8 w-8 items-center justify-center rounded-none border border-black/25 bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer shadow-2xs"
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
