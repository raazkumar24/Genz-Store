import React, { useState, useEffect, useCallback } from "react";
import { Badge, Button } from "./ui";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Slide Data - Replaced Summer/Winter with generic fashion themes
const heroSlides = [
  {
    image: "/models/model1.png",
    badge: "NEW DROP",
    title: "STREET",
    titleHighlight: "STYLE",
    subtitle: "Bold new looks. Unmatched comfort. Make a statement.",
  },
  {
    image: "/models/model3.png",
    badge: "TRENDING",
    title: "FRESH",
    titleHighlight: "LOOKS",
    subtitle: "Elevate your daily wardrobe with our latest exclusive pieces.",
  },
];

const Hero = () => {
  // State to track the currently active slide
  const [current, setCurrent] = useState(0);
  // Track if hero images are loaded
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === heroSlides.length) {
          setImagesLoaded(true);
        }
      };
      // Fallback in case of error
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === heroSlides.length) setImagesLoaded(true);
      };
    });
  }, []);

  // Function to go to the next slide, wraps around to 0 at the end
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  // Function to go to the previous slide, wraps to the end if at 0
  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-play the slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    // Main Hero Section Container - Responsive height
    <section className="relative w-full bg-[var(--color-bg)] pt-2 pb-4 md:pt-20 md:pb-10 overflow-hidden min-h-[80vh] md:h-[80vh] flex items-center border-b border-[var(--color-border)]">
      {/* Background Marquee Text - Scrolling "GEN-Z FASHION" effect */}
      <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 overflow-hidden whitespace-nowrap opacity-[0.03] select-none pointer-events-none z-0">
        <h2
          className="text-[6rem] sm:text-[10rem] md:text-[20rem] font-black uppercase tracking-tighter"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          GEN-Z FASHION GEN-Z FASHION
        </h2>
      </div>

      {/* Center Wrapper for Hero Content */}
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8 z-10 relative h-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-0 md:gap-8 h-full pt-4 md:pt-0">
          {/* LEFT CONTENT: Text & Buttons */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            {/* CSS Grid is used here to stack all text slides on top of each other flawlessly */}
            <div className="grid">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className="col-start-1 row-start-1 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    // Show only the active slide
                    opacity: index === current ? 1 : 0,
                    transform:
                      index === current ? "translateY(0)" : "translateY(2rem)",
                    pointerEvents: index === current ? "auto" : "none",
                    zIndex: index === current ? 10 : 0,
                  }}
                >
                  {/* Badge Component (e.g. NEW DROP) */}
                  <div className="mb-4 inline-flex">
                    <Badge
                      text={slide.badge}
                      highlightText="HOT"
                      variant="primary"
                    />
                  </div>

                  {/* Main Title with Hollow/Stroke effect for the highlighted word */}
                  <h1
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black leading-[0.85] text-[var(--color-text)] tracking-tighter uppercase"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span className="inline-block mr-3 md:mr-0 md:block">
                      {slide.title}
                    </span>
                    <span
                      className="text-transparent inline-block md:block mt-2 md:mt-0"
                      style={{ WebkitTextStroke: "2px var(--color-primary)" }}
                    >
                      {slide.titleHighlight}
                    </span>
                  </h1>

                  {/* Subtitle / Description */}
                  <p className="mt-6 text-base md:text-lg text-[var(--color-text-muted)] max-w-sm font-medium leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* Call to Action Button */}
                  <div className="mt-8 flex items-center gap-4">
                    <Button
                      to="/shop"
                      variant="primary"
                      size="md"
                      className="group flex items-center justify-center whitespace-nowrap"
                    >
                      <span className="flex items-center gap-2">
                        Shop Now
                        <ArrowRight
                          className="w-5 h-5 transition-transform group-hover:translate-x-1"
                          strokeWidth={2.5}
                        />
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Navigation Controls (Arrows & Dots) */}
            <div className="flex items-center gap-4 mt-2 mb-8 md:mb-0 md:mt-16 relative z-20">
              <button
                onClick={prevSlide}
                className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors p-2 -ml-2"
              >
                <ChevronLeft
                  className="w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={2.5}
                />
              </button>

              <div className="flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-gray-900" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors p-2 -mr-2"
              >
                <ChevronRight
                  className="w-6 h-6 md:w-8 md:h-8"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT: Model Images & Decorative Backgrounds */}
          <div className="w-full md:w-1/2 h-[280px] sm:h-[400px] md:h-full relative flex items-end justify-center -mt-4 md:mt-0 pb-0 md:pb-10">
            {/* Dynamic Gradient Glow */}
            <div className="absolute top-1/4 right-1/4 w-[70%] h-[70%] bg-[var(--color-primary)] opacity-20 blur-[100px] rounded-full z-0 mix-blend-screen animate-pulse"></div>

            {/* Soft trendy background shape (Curved box) */}
            <div className="absolute bottom-0 right-0 w-[85%] md:w-[75%] h-[85%] bg-[var(--color-surface)] rounded-tl-[100px] rounded-br-[40px] z-0 border border-[var(--color-border)]"></div>

            {/* Spinning decorative outline circles */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border border-[var(--color-primary)]/20 animate-[spin_10s_linear_infinite] z-0"></div>
            <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full border border-[var(--color-primary)]/20 animate-[spin_15s_linear_infinite_reverse] scale-110 z-0"></div>

            {/* Images stacked using Grid for perfect alignment inside the right column */}
            <div className="absolute inset-0 grid place-items-end justify-center z-10 pb-0 md:pb-10">
              {/* Skeleton Loader shown while images are downloading */}
              {!imagesLoaded && (
                <div className="col-start-1 row-start-1 w-64 md:w-80 h-[80%] bg-[var(--color-surface)] rounded-3xl animate-pulse flex items-center justify-center border border-[var(--color-border)] mb-10">
                  <div className="w-12 h-12 rounded-full border-2 border-t-[var(--color-primary)] border-gray-200 animate-spin"></div>
                </div>
              )}

              {/* Actual Model Images */}
              {heroSlides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.image}
                  alt={slide.title}
                  className="col-start-1 row-start-1 w-auto max-h-[105%] object-contain object-bottom drop-shadow-xl transition-all duration-700 ease-out"
                  style={{
                    // Animate sliding in and out
                    opacity: imagesLoaded && index === current ? 1 : 0,
                    transform:
                      index === current ? "translateX(0)" : "translateX(3rem)",
                    pointerEvents:
                      imagesLoaded && index === current ? "auto" : "none",
                  }}
                />
              ))}
            </div>

            {/* Vertical trendy text on the far right */}
            <div className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)]/70 z-20 whitespace-nowrap">
              NEW COLLECTION 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
