import React from "react";
import { Maximize2, ChevronLeft, ChevronRight, Heart } from "lucide-react";

/**
 * ProductGallery Component
 * Renders the product image gallery including thumbnails, hover zoom, count pill, swipe navigation, lightbox trigger, and quick wishlist.
 */
const ProductGallery = ({
  displayImages,
  activeImage,
  setActiveImage,
  productName,
  onOpenLightbox,
  isWishlisted = false,
  onToggleWishlist,
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
      <div className="order-2 md:order-1 flex gap-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar py-1 px-0.5 md:flex-col md:overflow-y-auto md:max-h-[600px] w-full min-w-0">
        {displayImages.map((image, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`relative h-14 w-14 sm:h-16 sm:w-16 md:h-22 md:w-full shrink-0 snap-center overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 border-2 transition-all duration-200 cursor-pointer ${
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
      <div className="order-1 md:order-2 relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f8f8f7] border border-neutral-200/80 shadow-xs group w-full min-h-[340px] sm:min-h-[440px] md:h-[600px] flex items-center justify-center">
        
        {/* Main Photo */}
        <img
          src={activeImage || displayImages[0]}
          alt={productName || "Product"}
          onClick={onOpenLightbox}
          className="h-full w-full max-h-[580px] object-contain object-center transition-transform duration-500 group-hover:scale-105 cursor-zoom-in p-3 sm:p-6"
        />

        {/* Top-Left Wishlist Heart Button on Image */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`absolute top-3 left-3 z-10 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-neutral-200 transition duration-200 cursor-pointer ${
              isWishlisted ? "text-red-500" : "text-neutral-700 hover:text-red-500"
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label="Wishlist"
          >
            <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
          </button>
        )}

        {/* Carousel Prev/Next Overlay Buttons */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              title="Previous Image"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-white cursor-pointer"
              title="Next Image"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Top-Right Expand Lightbox Button */}
        <button
          type="button"
          onClick={onOpenLightbox}
          className="absolute top-3 right-3 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm border border-neutral-200 backdrop-blur-md hover:bg-neutral-900 hover:text-white transition duration-200 cursor-pointer"
          title="Open Lightbox"
          aria-label="Open Lightbox"
        >
          <Maximize2 size={15} />
        </button>

        {/* Bottom Image Counter Pill */}
        <div className="absolute bottom-3 left-3 rounded-full bg-neutral-900/80 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] font-black text-white tracking-wider">
          {activeIndex >= 0 ? activeIndex + 1 : 1} / {displayImages.length}
        </div>
      </div>

    </section>
  );
};

export default ProductGallery;
