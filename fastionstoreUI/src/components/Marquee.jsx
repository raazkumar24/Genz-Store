import React from 'react';

/**
 * Marquee Component
 * Displays a smooth, infinitely scrolling text banner.
 * Used for highlighting premium features or announcements on the home page.
 */
const Marquee = ({ items }) => {
  return (
    <div className="relative flex overflow-x-hidden bg-[var(--color-text)] text-[var(--color-bg)] py-3">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-bold tracking-widest uppercase text-xs sm:text-sm">
        {/* Render items multiple times to create a seamless infinite loop effect */}
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            {items.map((item, index) => (
              <span key={`${i}-${index}`} className="flex items-center">
                {item}
                <span className="mx-6 md:mx-12 opacity-50">•</span>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
