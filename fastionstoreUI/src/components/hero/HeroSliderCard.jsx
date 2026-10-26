import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Flame } from "lucide-react";

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

  return (
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
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSlide(idx)}
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

              {/* Action Buttons: Sharp Rectangular Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                <Link
                  to={slide.primaryLink || "/new-arrivals"}
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

              {/* Floating Micro Spec Pill */}
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
  );
};

export default HeroSliderCard;
