import React from "react";

/**
 * Senior Developer Note:
 * Bento-style Card Container inspired by contemporary streetwear & tech apparel design.
 * Provides consistent border radius (rounded-[26px] / rounded-[30px]), micro-borders,
 * and tactile drop shadows without looking like a cookie-cutter bootstrap template.
 */
export const Card = ({
  children,
  variant = "default", // "default" | "subtle" | "ghost" | "dark"
  className = "",
  padding = "p-3 md:p-4",
  hoverEffect = true,
  ...props
}) => {
  const variantStyles = {
    default: "bg-white border border-neutral-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)]",
    subtle: "bg-[#F5F6F1] border border-neutral-200/60 shadow-none",
    dark: "bg-[#0E0F12] text-white border border-neutral-800 shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
    ghost: "bg-transparent border border-neutral-200/80",
  };

  const hoverClass = hoverEffect
    ? "transition-all duration-300 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
    : "";

  return (
    <div
      className={`rounded-[24px] md:rounded-[28px] ${variantStyles[variant] || variantStyles.default} ${hoverClass} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
