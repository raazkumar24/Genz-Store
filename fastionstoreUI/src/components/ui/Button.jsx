import React from "react";
import { Link } from "react-router-dom";

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
    "inline-flex not-wrap items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] active:scale-[0.97] disabled:active:scale-100";

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:brightness-110 shadow-[0_4px_16px_rgba(205,84,100,0.3)] hover:shadow-[0_8px_24px_rgba(205,84,100,0.4)] focus:ring-[var(--color-primary)]",
    secondary:
      "bg-[var(--color-surface)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-primary)]/25 hover:border-[var(--color-primary)] shadow-sm hover:shadow-md focus:ring-[var(--color-primary)]",
    outline:
      "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white border-2 border-[var(--color-primary)] focus:ring-[var(--color-primary)]",
    ghost:
      "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)] focus:ring-[var(--color-primary)]",
    danger:
      "bg-red-500 text-white hover:brightness-110 shadow-lg hover:shadow-xl focus:ring-red-500",
    success:
      "bg-emerald-500 text-white hover:brightness-110 shadow-lg hover:shadow-xl focus:ring-emerald-500",
    accent:
      "bg-[var(--color-accent)] text-[var(--color-text)] hover:brightness-95 shadow-lg hover:shadow-xl focus:ring-[var(--color-accent)]",
    white:
      "bg-white text-[var(--color-text)] hover:bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md focus:ring-[var(--color-primary)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
    md: "px-6 py-2.5 text-base rounded-xl gap-2",
    lg: "px-8 py-3.5 text-lg rounded-xl gap-2",
    xl: "px-10 py-4 text-xl rounded-2xl gap-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const buttonClasses = `
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : "w-fit"}
        ${disabled || loading ? "opacity-60 cursor-not-allowed hover:scale-100" : "cursor-pointer"}
        group
        ${className}
    `;

  const spinner = (
    <svg
      className={`${iconSizes[size]} animate-spin`}
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
        <span className={`${iconSizes[size]} flex-shrink-0`}>{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span
          className={`${iconSizes[size]} flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5`}
        >
          {icon}
        </span>
      )}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={buttonClasses} aria-label={ariaLabel} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        aria-label={ariaLabel}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
