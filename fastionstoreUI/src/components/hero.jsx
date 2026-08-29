import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Flame, ShieldCheck, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "./ui";

const heroSlides = [
  {
    image: "/models/model1.png",
    badge: "DROP 04 // 2026",
    tag: "OVERSIZED FIT",
    titleTop: "HEAVYWEIGHT",
    titleBottom: "STREETWEAR",
    subtitle: "Boxy cuts and drop-shoulder silhouettes crafted from 280 GSM combed organic cotton. Engineered for everyday statement.",
    primaryCta: "Shop Oversized",
    primaryLink: "/collections/oversized",
    accentBadge: "100% Supima Cotton",
  },
  {
    image: "/models/model3.png",
    badge: "NEW SEASON",
    tag: "DROP SHOULDER",
    titleTop: "URBAN RELAXED",
    titleBottom: "HOODIES & TEES",
    subtitle: "Ultra-comfortable fleece hoodies, heavyweight graphic tees, and tactical streetwear designed for modern culture.",
    primaryCta: "Explore Hoodies",
    primaryLink: "/collections/hoodies",
    accentBadge: "Signature Cut",
  },
  {
    image: "/models/model2.png",
    badge: "EXCLUSIVE DROP",
    tag: "STREET ESSENTIALS",
    titleTop: "PREMIUM ESSENTIALS",
    titleBottom: "DAILY ROTATION",
    subtitle: "Clean aesthetics with architectural drape that never loses its shape. Upgrade your wardrobe with timeless fits.",
    primaryCta: "View New Drops",
    primaryLink: "/new-arrivals",
    accentBadge: "Limited Release",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full bg-[#FAFAF8] pt-6 pb-0 overflow-hidden border-b border-neutral-200/80">
      {/* Background Subtle Noise Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,var(--color-text)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pb-8 md:pb-12">
        
        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px] md:min-h-[520px]">
          
          {/* LEFT COLUMN: Editorial Content (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-4 md:space-y-6"
              >
                {/* Header Tag / Pill */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white px-3.5 py-1.5 text-xs font-black uppercase tracking-wider shadow-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
                    </span>
                    <span>{slide.badge}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-200/70 text-neutral-800 text-xs font-black uppercase tracking-wider">
                    <Flame size={13} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
                    {slide.tag}
                  </span>
                </div>

                {/* Main Heading - Clean, High Impact */}
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black uppercase tracking-tight text-neutral-900 leading-[1.02]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <span className="block">{slide.titleTop}</span>
                  <span className="block text-[var(--color-primary)] mt-1">
                    {slide.titleBottom}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base md:text-lg text-neutral-600 max-w-lg font-medium leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Call to Actions */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Button
                    to={slide.primaryLink}
                    variant="primary"
                    size="lg"
                    className="shadow-lg shadow-[var(--color-primary)]/25 px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider"
                    icon={<ArrowRight size={18} />}
                  >
                    {slide.primaryCta}
                  </Button>

                  <Button
                    to="/sale"
                    variant="white"
                    size="lg"
                    className="border border-neutral-300 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-neutral-100 hover:border-neutral-400"
                  >
                    Explore Sale %
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Switcher Controls */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-neutral-200/80 max-w-lg">
              <div className="flex items-center gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === current
                        ? "w-8 bg-[var(--color-primary)] shadow-xs"
                        : "w-2.5 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
                0{current + 1} / 0{heroSlides.length}
              </span>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors cursor-pointer shadow-xs"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors cursor-pointer shadow-xs"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Model Showcase (5 Cols) */}
          <div className="lg:col-span-5 h-[380px] sm:h-[460px] md:h-[500px] lg:h-[530px] relative flex items-end justify-center">
            {/* Model Image with Smooth Crossfade */}
            <div className="relative z-10 h-full w-full flex items-end justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  src={slide.image}
                  alt={slide.titleTop}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full max-h-[98%] w-auto object-contain object-bottom drop-shadow-2xl select-none"
                />
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

      {/* Sleek Native Trust Pillar Badges (100% Styled with Site Aesthetics) */}
      <div className="bg-white border-t border-neutral-200/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
              <Zap size={18} className="text-[var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-tight text-neutral-900 truncate">
                Fast Dispatch
              </p>
              <p className="text-[11px] font-medium text-neutral-500 truncate">
                Ships within 24-48 Hours
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
              <Sparkles size={18} className="text-[var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-tight text-neutral-900 truncate">
                280 GSM Cotton
              </p>
              <p className="text-[11px] font-medium text-neutral-500 truncate">
                Heavyweight Pure Combed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
              <RotateCcw size={18} className="text-[var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-tight text-neutral-900 truncate">
                14-Day Exchanges
              </p>
              <p className="text-[11px] font-medium text-neutral-500 truncate">
                Hassle-Free Doorstep Return
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
              <ShieldCheck size={18} className="text-[var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-tight text-neutral-900 truncate">
                100% Authentic
              </p>
              <p className="text-[11px] font-medium text-neutral-500 truncate">
                Original Genz Streetwear
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
