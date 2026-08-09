import React from 'react';

/**
 * ProductAccordion Component
 * Renders the product details (Highlights, Specifications, Item Details) in a clean, modern accordion layout.
 */
const ProductAccordion = ({ product }) => {
  if (!product) return null;

  return (
    <div className="space-y-4" style={{ fontFamily: "var(--font-body)" }}>
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Product Specifications & Details
        </h3>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
          {product.brand || "GENZ STORE"}
        </span>
      </div>
      
      {product.productDetails?.topHighlights?.length > 0 && (
        <details className="group border-b border-gray-200 pb-4 pt-2" open>
          <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none text-sm md:text-base uppercase tracking-wider [&::-webkit-details-marker]:hidden select-none">
            <span>Top Highlights</span>
            <span className="transition-transform duration-300 group-open:rotate-180 text-gray-500">
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600 pl-4 list-disc">
            {product.productDetails.topHighlights.map((highlight, idx) => (
              <li key={idx} className="leading-relaxed">{highlight}</li>
            ))}
          </ul>
        </details>
      )}

      {(product.productDetails?.specifications?.length > 0 || product.productDetails?.style) && (
        <details className="group border-b border-gray-200 pb-4 pt-2" open>
          <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none text-sm md:text-base uppercase tracking-wider [&::-webkit-details-marker]:hidden select-none">
            <span>Technical Specifications</span>
            <span className="transition-transform duration-300 group-open:rotate-180 text-gray-500">
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          
          {product.productDetails?.specifications?.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
              {product.productDetails.specifications.map((spec, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200/80 shadow-2xs">
                  <span className="font-medium text-gray-500">{spec.key}</span>
                  <span className="font-bold text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-xs md:text-sm text-gray-600">
              <span className="font-medium text-gray-500 pr-2">Style Code:</span>
              <span className="font-bold text-gray-900">{product.productDetails.style}</span>
            </div>
          )}
        </details>
      )}

      <details className="group pt-2">
        <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none text-sm md:text-base uppercase tracking-wider [&::-webkit-details-marker]:hidden select-none">
          <span>Overview & Material Care</span>
          <span className="transition-transform duration-300 group-open:rotate-180 text-gray-500">
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </summary>
        <div className="mt-4 text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-gray-200">
          {product.productDetails?.itemDetails || product.description}
        </div>
      </details>
    </div>
  );
};

export default ProductAccordion;
