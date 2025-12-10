import React from "react";
import { cn } from "../../lib/utils"; // make sure this exists

export const Button = ({ children, variant = "default", className = "", ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium border transition-colors";
  const variantClasses = variant === "default"
    // ? "bg-blue-700 text-white hover:bg-blue-700 border-blue-700"
    ? "px-3 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-700"
    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300";

  return (
    <button className={cn(baseClasses, variantClasses, className)} {...props}>
      {children}
    </button>
  );
};