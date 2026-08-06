import React from "react";

/**
 * Reusable Card Component
 * Clean white container with soft shadow and rounded corners.
 */
export const Card = ({
  children,
  className = "",
  padding = "p-2",
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-sm ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
