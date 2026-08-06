import React, { forwardRef } from 'react';

/**
 * Reusable Input Component
 * Clean, standard styling for text inputs.
 * 
 * @param {string} label - Optional label for the input
 * @param {string} error - Optional error message to display
 * @param {string} className - Additional classes for the input element
 */
export const Input = forwardRef(({
  label,
  error,
  icon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-gray-400 z-10 flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${icon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 text-gray-400 z-10 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
