import React from 'react';

/**
 * ProductAccordion Component
 * Renders the product details (Highlights, Specifications, Item Details) in an accordion layout.
 */
const ProductAccordion = ({ product }) => {
  if (!product) return null;

  return (
    <div className="mt-6 border-t-2 border-b-2 border-dashed border-[var(--color-border)] py-6 space-y-4" style={{ fontFamily: "var(--font-body)" }}>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Product details</h3>
      
      {product.productDetails?.topHighlights?.length > 0 && (
        <details className="group border-b border-gray-100 pb-4">
          <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none [&::-webkit-details-marker]:hidden">
            Top highlights
            <span className="transition group-open:rotate-180 text-gray-500">
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          <ul className="mt-4 list-disc pl-5 text-sm text-[var(--color-text-muted)] space-y-1">
            {product.productDetails.topHighlights.map((highlight, idx) => (
              <li key={idx}>{highlight}</li>
            ))}
          </ul>
        </details>
      )}

      {(product.productDetails?.specifications?.length > 0 || product.productDetails?.style) && (
        <details className="group border-b border-gray-100 pb-4" open>
          <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none [&::-webkit-details-marker]:hidden">
            Specifications
            <span className="transition group-open:rotate-180 text-gray-500">
              <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
            </span>
          </summary>
          
          {product.productDetails?.specifications?.length > 0 ? (
            <div className="mt-4 flex flex-col text-sm border border-gray-100 rounded-xl overflow-hidden bg-white/50">
              {product.productDetails.specifications.map((spec, idx) => (
                <div key={idx} className={`grid grid-cols-2 p-3 ${idx !== product.productDetails.specifications.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="font-medium text-gray-500 pr-4">{spec.key}</span>
                  <span className="font-bold text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-[var(--color-text-muted)]">
              <span className="font-medium text-gray-500 pr-2">Style:</span>
              <span className="font-bold text-gray-900">{product.productDetails.style}</span>
            </div>
          )}
        </details>
      )}

      <details className="group pb-2" open>
        <summary className="flex cursor-pointer items-center justify-between font-bold text-gray-900 list-none [&::-webkit-details-marker]:hidden">
          Item details
          <span className="transition group-open:rotate-180 text-gray-500">
            <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </summary>
        <div className="mt-4 text-sm text-[var(--color-text-muted)] whitespace-pre-line leading-relaxed">
          {product.productDetails?.itemDetails || product.description}
        </div>
      </details>
    </div>
  );
};

export default ProductAccordion;
