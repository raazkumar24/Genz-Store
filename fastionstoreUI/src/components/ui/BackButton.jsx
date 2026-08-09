import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Standardized BackButton Component
 * Consistent across all pages with smooth micro-animations and history fallback.
 */
const BackButton = ({
  text = 'Back',
  fallbackPath = '/',
  variant = 'default', // 'default' | 'ghost' | 'pill' | 'dark' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  onClick,
  showIcon = true,
  ...props
}) => {
  const navigate = useNavigate();

  const handleBack = (e) => {
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) return;
    }
    
    // If there is navigation history, go back; otherwise use fallbackPath
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  const variantClasses = {
    default:
      'bg-white/90 text-gray-700 border border-gray-200/80 shadow-xs hover:bg-gray-50 hover:text-black hover:border-gray-300 active:scale-95',
    ghost:
      'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 active:scale-95',
    pill:
      'bg-black/5 backdrop-blur-md text-gray-800 border border-black/10 rounded-full hover:bg-black/10 hover:border-black/20 active:scale-95',
    dark:
      'bg-black/70 backdrop-blur-md text-white border border-white/20 hover:bg-black hover:border-white/40 active:scale-95',
    outline:
      'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:scale-95',
  };

  const isRoundedFull = variant === 'pill';

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`group inline-flex items-center font-semibold transition-all duration-200 cursor-pointer select-none ${
        isRoundedFull ? 'rounded-full' : 'rounded-xl'
      } ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
      aria-label={typeof text === 'string' ? text : 'Go back'}
      {...props}
    >
      {showIcon && (
        <ArrowLeft
          className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
          size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
        />
      )}
      {text && <span>{text}</span>}
    </button>
  );
};

export default BackButton;
