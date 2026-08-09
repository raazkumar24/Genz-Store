import React from "react";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ProductGallery Component
 * Renders the product image gallery including thumbnails, hover zoom, count pill, and full-screen lightbox trigger.
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
    <section className="flex flex-col gap-4 md:grid md:grid-cols-[84px_1fr] lg:grid-cols-[100px_1fr] lg:gap-6 w-full min-w-0">
      
      {/* Thumbnails: Left vertical strip on Desktop, Horizontal scroll on Mobile */}
      <div className="order-2 md:order-1 flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar p-1 md:flex-col md:overflow-y-auto md:max-h-[650px] w-full min-w-0">
        {displayImages.map((image, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`relative h-16 w-16 md:h-24 md:w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-gray-100 border-2 transition-all duration-200 cursor-pointer ${
              activeImage === image
                ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 shadow-md scale-[1.02]"
                : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
            }`}
            aria-label={`Select image ${idx + 1}`}
          >
            <img src={image} alt="" className="h-full w-full object-cover object-center" />
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="order-1 md:order-2 relative overflow-hidden rounded-3xl bg-[#f8f8f7] border border-gray-200/80 shadow-xs group w-full min-h-[420px] sm:min-h-[500px] md:h-[650px] flex items-center justify-center">
        
        {/* Main Photo */}
        <img
          src={activeImage || displayImages[0]}
          alt={productName || "Product"}
          onClick={onOpenLightbox}
          className="h-full w-full max-h-[620px] object-contain object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in p-4"
        />

        {/* Carousel Prev/Next Overlay Buttons (Visible on desktop hover) */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              title="Previous Image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              title="Next Image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Top-Right Expand Lightbox Button */}
        <button
          type="button"
          onClick={onOpenLightbox}
          className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md border border-gray-200 backdrop-blur-md hover:bg-black hover:text-white transition duration-200 cursor-pointer"
          title="Open Lightbox"
        >
          <Maximize2 size={16} />
        </button>

        {/* Bottom Image Counter Pill */}
        <div className="absolute bottom-4 left-4 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white tracking-wider">
          {activeIndex >= 0 ? activeIndex + 1 : 1} / {displayImages.length}
        </div>
      </div>

    </section>
  );
};

export default ProductGallery;
