import React from 'react';

/**
 * ProductGallery Component
 * Renders the product image gallery including thumbnails and the main image view.
 */
const ProductGallery = ({ displayImages, activeImage, setActiveImage, productName }) => {
  if (!displayImages || displayImages.length === 0) return null;

  return (
    <section className="grid gap-4 md:grid-cols-[80px_1fr] lg:gap-6">
      {/* Thumbnails */}
      <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible hide-scrollbar pb-2 md:pb-0">
        {displayImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface)] transition-all duration-300 md:w-full md:h-24 ${activeImage === image
                ? "ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg)]"
                : "opacity-70 hover:opacity-100 hover:shadow-md"
              }`}
            aria-label="Select product image"
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
            {activeImage !== image && <div className="absolute inset-0 bg-black/5 transition-colors hover:bg-transparent" />}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="order-1 overflow-hidden rounded-2xl bg-gray-100 md:order-2 shadow-sm border border-gray-200 relative group aspect-[3/4] md:aspect-[4/5]">
        <img
          src={activeImage || displayImages[0]}
          alt={productName}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
    </section>
  );
};

export default ProductGallery;
