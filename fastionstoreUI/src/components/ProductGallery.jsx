import React from "react";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ProductGallery Component
 * Renders the product image gallery including thumbnails, hover zoom, count pill, swipe navigation, and full-screen lightbox trigger.
 */
const ProductGallery = ({
  displayImages,
  activeImage,
  setActiveImage,
  productName,
  onOpenLightbox,
}) => {
  if (!displayImages || displayImages.length === 0) return null;

  const activeIndex = displayImages.indexOf(activeImage);

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevIndex = (activeIndex - 1 + displayImages.length) % displayImages.length;
    setActiveImage(displayImages[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIndex = (activeIndex + 1) % displayImages.length;
    setActiveImage(displayImages[nextIndex]);
  };

  return (
    <section className="flex flex-col gap-3 md:grid md:grid-cols-[80px_1fr] lg:grid-cols-[96px_1fr] lg:gap-5 w-full min-w-0">
      
      {/* Thumbnails: Left vertical strip on Desktop, Horizontal scroll on Mobile */}
      <div className="order-2 md:order-1 flex gap-2.5 overflow-x-auto snap-x snap-mandatory hide-scrollbar py-1 px-0.5 md:flex-col md:overflow-y-auto md:max-h-[600px] w-full min-w-0">
        {displayImages.map((image, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`relative h-16 w-16 md:h-22 md:w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-neutral-100 border-2 transition-all duration-200 cursor-pointer ${
              activeImage === image
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25 shadow-xs scale-[1.02]"
                : "border-transparent opacity-70 hover:opacity-100 hover:border-neutral-300"
            }`}
            aria-label={`Select image ${idx + 1}`}
          >
            <img src={image} alt="" className="h-full w-full object-cover object-center" />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="order-1 md:order-2 relative overflow-hidden rounded-3xl bg-[#f8f8f7] border border-neutral-200/80 shadow-xs group w-full min-h-[380px] sm:min-h-[460px] md:h-[600px] flex items-center justify-center">
        
        {/* Main Photo */}
        <img
          src={activeImage || displayImages[0]}
          alt={productName || "Product"}
          onClick={onOpenLightbox}
          className="h-full w-full max-h-[580px] object-contain object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in p-4 sm:p-6"
        />

        {/* Carousel Prev/Next Overlay Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              title="Previous Image"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              title="Next Image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Top-Right Expand Lightbox Button */}
        <button
          type="button"
          onClick={onOpenLightbox}
          className="absolute top-3.5 right-3.5 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm border border-neutral-200 backdrop-blur-md hover:bg-neutral-900 hover:text-white transition duration-200 cursor-pointer"
          title="Open Lightbox"
        >
          <Maximize2 size={15} />
        </button>

        {/* Bottom Image Counter Pill */}
        <div className="absolute bottom-3.5 left-3.5 rounded-full bg-neutral-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-black text-white tracking-wider">
          {activeIndex >= 0 ? activeIndex + 1 : 1} / {displayImages.length}
        </div>
      </div>

    </section>
  );
};

export default ProductGallery;
