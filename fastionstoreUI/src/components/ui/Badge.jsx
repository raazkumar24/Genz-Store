import React from 'react';

const Badge = ({ 
  children, 
  text, 
  highlightText, 
  variant = "primary", 
  className = '' 
}) => {
  if (children) {
    const variants = {
      primary: "bg-[var(--color-primary)] text-white shadow-xs shadow-[var(--color-primary)]/20",
      secondary: "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)]",
      success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      error: "bg-red-50 text-red-700 border border-red-200",
      neutral: "bg-neutral-100 text-neutral-800 border border-neutral-200",
      dark: "bg-[#0D0D11] text-white shadow-xs",
      outline: "bg-transparent text-[var(--color-text)] border border-[var(--color-border)]",
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${variants[variant] || variants.primary} ${className}`}>
        {children}
      </span>
    );
  }

  const baseClass = "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 shadow-xs";
  const variants = {
    primary: "border-[var(--color-primary)]/20 bg-[var(--color-primary-light)]/60 text-[var(--color-primary)]",
    secondary: "border-[var(--color-border)] bg-white/90 text-[var(--color-text)]",
    dark: "border-neutral-800 bg-neutral-900 text-white",
  };

  return (
    <div className={`${baseClass} ${variants[variant] || variants.primary} ${className}`}>
      {highlightText && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        </span>
      )}
      <span>{text}</span>
      {highlightText && (
        <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
          {highlightText}
        </span>
      )}
    </div>
  );
};

export default Badge;
