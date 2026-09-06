import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  href,
  to,
  onClick,
  className = "",
  disabled = false,
  ariaLabel,
  icon,
  iconPosition = "right",
  fullWidth = false,
  type = "button",
  loading = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer whitespace-nowrap";

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-md shadow-[var(--color-primary)]/25 hover:shadow-lg hover:shadow-[var(--color-primary)]/35 focus:ring-[var(--color-primary)]",
    dark:
      "bg-[#0D0D11] text-white hover:bg-neutral-800 shadow-md shadow-black/10 focus:ring-neutral-900",
    secondary:
      "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] shadow-xs focus:ring-neutral-400",
    outline:
      "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white border-2 border-[var(--color-text)] focus:ring-[var(--color-text)]",
    outlinePrimary:
      "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white border-2 border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
    ghost:
      "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] focus:ring-neutral-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/20 focus:ring-red-500",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20 focus:ring-emerald-500",
    white:
      "bg-white text-[var(--color-text)] hover:bg-neutral-100 border border-[var(--color-border)] shadow-xs focus:ring-neutral-300",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-[11px] rounded-full gap-1.5",
    sm: "px-4 py-2 text-xs rounded-full gap-1.5",
    md: "px-6 py-2.5 text-xs md:text-sm rounded-full gap-2",
    lg: "px-8 py-3.5 text-sm md:text-base rounded-full gap-2.5",
    xl: "px-10 py-4 text-base md:text-lg rounded-full gap-3",
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-4 h-4 md:w-5 md:h-5",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? "w-full" : "w-auto"}
    ${className}
  `;

  const spinner = (
    <svg
      className={`${iconSizes[size] || "w-4 h-4"} animate-spin`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const content = (
    <>
      {loading && <span className="mr-1">{spinner}</span>}
      {!loading && icon && iconPosition === "left" && (
        <span className={`${iconSizes[size]} shrink-0`}>{icon}</span>
      )}
      <span className="truncate">{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span
          className={`${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:translate-x-1`}
        >
          {icon}
        </span>
      )}
    </>
  );

  if (to && !disabled && !loading) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        aria-label={ariaLabel}
        {...props}
      >
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="inline-flex items-center justify-center gap-2 w-full"
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  if (href && !disabled && !loading) {
    return (
      <a
        href={href}
        className={buttonClasses}
        aria-label={ariaLabel}
        {...props}
      >
        <motion.span
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="inline-flex items-center justify-center gap-2 w-full"
        >
          {content}
        </motion.span>
      </a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;
