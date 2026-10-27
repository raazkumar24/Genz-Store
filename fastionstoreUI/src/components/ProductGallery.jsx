import React from "react";
import { Maximize2, Heart } from "lucide-react";

const LOOKBOOK_TAGS = [
  "01 - BACK GRAPHIC ARTWORK",
  "02 - BOXY DRAPE FIT",
  "03 - DETAIL CLOSEUP",
  "04 - STREETWEAR SILHOUETTE",
  "05 - ARCHIVAL PROFILE",
];

/**
 * ProductGallery Component
 * Directly redesigned to match User Reference Image 2:
 * - Editorial multi-photo showcase (side-by-side dual columns on desktop)
 * - Sharp rectangular borderless framing (rounded-none)
 * - Technical bottom-left badges on photos (e.g. "01 - BACK GRAPHIC ARTWORK", "02 - BOXY DRAPE FIT" with NO //)
 * - Click to open high-res lightbox
 */
const ProductGallery = ({
  displayImages,
  setActiveImage,
  productName,
  onOpenLightbox,
  isWishlisted = false,
  onToggleWishlist,
  isSaleActive = false,
  discountPercent = 0,
}) => {
  if (!displayImages || displayImages.length === 0) return null;

  // Ensure at least 2 images for the dual-lookbook layout
  const primaryImages = displayImages.slice(0, 4);

  return (
    <section className="w-full flex flex-col gap-3">
      {/* Dual / Multi-Column Image Grid matching Image 2 */}
      <div className={`grid gap-3 ${primaryImages.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        {primaryImages.map((image, idx) => {
          const badgeText = LOOKBOOK_TAGS[idx] || `0${idx + 1} - ARCHIVAL FIT`;
          return (
            <div
              key={idx}
              className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-neutral-100 overflow-hidden rounded-none border border-neutral-200/80 group cursor-zoom-in"
              onClick={() => {
                if (setActiveImage) setActiveImage(image);
                if (onOpenLightbox) onOpenLightbox();
              }}
            >
              <img
                src={image}
                alt={`${productName} view ${idx + 1}`}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 select-none"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/models/model1.png";
                }}
              />

              {/* Bottom-Left Archival Tag Badge (Direct Match to Image 2, NO //) */}
              <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                <span className="rounded-none bg-black/90 text-white px-2.5 py-1 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                  {badgeText}
                </span>
              </div>

              {/* Wishlist Button on First Image (Top-Left, Sharp Rectangular) */}
              {idx === 0 && onToggleWishlist && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist();
                  }}
                  className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-none bg-white/90 hover:bg-white backdrop-blur-md transition-all cursor-pointer shadow-xs border border-neutral-200/50"
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  aria-label="Wishlist"
                >
                  <Heart
                    size={15}
                    className={`transition-colors ${
                      isWishlisted ? "fill-[#FF3B00] text-[#FF3B00]" : "text-neutral-800"
                    }`}
                    strokeWidth={2.2}
                  />
                </button>
              )}

              {/* Top-Right Dynamic Discount Badge (Only when sale is active) */}
              {idx === 0 && isSaleActive && discountPercent > 0 && (
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                  <span className="rounded-none bg-[#FF3B00] text-white px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider shadow-sm">
                    {discountPercent}% OFF
                  </span>
                </div>
              )}

              {/* Bottom-Right Expand Icon */}
              <div className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-none bg-white/90 text-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs shadow-xs">
                <Maximize2 size={13} strokeWidth={2.4} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Thumbnails Strip if there are more than 4 images */}
      {displayImages.length > 4 && (
        <div className="flex gap-2 overflow-x-auto py-1 hide-scrollbar">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (setActiveImage) setActiveImage(img);
                if (onOpenLightbox) onOpenLightbox();
              }}
              className="h-16 w-16 shrink-0 rounded-none overflow-hidden border border-neutral-300 hover:border-black cursor-pointer"
            >
              <img src={img} alt="" className="h-full w-full object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductGallery;
