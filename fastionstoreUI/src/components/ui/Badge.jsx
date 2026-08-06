import React from 'react';

const Badge = ({ 
  children, 
  text, 
  highlightText, 
  variant = "primary", 
  className = '' 
}) => {
  // If children are provided, use the generic wrapper behavior (used heavily by AI generated pages)
  if (children) {
    const variants = {
      primary: "bg-[var(--color-primary)] text-white",
      success: "bg-green-100 text-green-800 border border-green-200",
      error: "bg-red-100 text-red-800 border border-red-200",
      neutral: "bg-gray-100 text-gray-800 border border-gray-200",
      dark: "bg-gray-900 text-white"
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${variants[variant] || variants.primary} ${className}`}>
        {children}
      </span>
    );
  }

  // Otherwise use the user's original detailed badge behavior
  const baseClass = "inline-flex items-center gap-2 rounded-full border px-3 py-1 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md";
  const variants = {
    primary: "border-[var(--color-primary)]/20 bg-[var(--color-surface)]/80 text-[var(--color-text-muted)]",
    secondary: "border-[var(--color-border)] bg-white/80 text-[var(--color-text)]",
  };

  return (
    <div className={`${baseClass} ${variants[variant]} ${className}`}>
      {highlightText && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        </span>
      )}
      <p className="text-[10px] font-bold uppercase tracking-[0.15em]">
        {text}
      </p>
      {highlightText && (
        <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_2px_10px_rgba(239,108,87,0.3)]">
          {highlightText}
        </span>
      )}
    </div>
  );
};

export default Badge;
