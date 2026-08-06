import React from "react";

/**
 * ProductGallery Component
 * Renders the product image gallery including thumbnails and the main image view.
 */
const ProductGallery = ({
  displayImages,
  activeImage,
  setActiveImage,
  productName,
}) => {
  if (!displayImages || displayImages.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 md:grid md:grid-cols-[90px_1fr] lg:gap-8 w-full min-w-0">
      {/* Mobile: Main Image appears first, Desktop: Main Image is second column */}
      <div className="order-1 md:order-2 overflow-hidden rounded-2xl bg-[#f8f8f8] shadow-sm border border-gray-100 relative group w-full h-[55vh] md:h-[70vh] lg:h-[80vh]">
        <img
          src={activeImage || displayImages[0]}
          alt={productName}
          className="absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails: Horizontal scroll on mobile, Vertical on desktop */}
      <div className="order-2 md:order-1 flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar p-1 md:p-2 md:flex-col md:overflow-y-auto w-full min-w-0">
        {displayImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`relative h-16 w-16 shrink-0 snap-center overflow-hidden rounded-xl bg-gray-100 transition-all duration-300 md:h-24 md:w-24 lg:h-28 lg:w-full ${
              activeImage === image
                ? "ring-2 ring-[var(--color-primary)] ring-offset-2"
                : "opacity-60 hover:opacity-100 hover:shadow-sm"
            }`}
            aria-label="Select product image"
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
            {activeImage !== image && (
              <div className="absolute inset-0 bg-black/5 transition-colors hover:bg-transparent" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProductGallery;
