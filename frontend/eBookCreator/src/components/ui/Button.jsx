import React from "react";
import { Loader2 } from "lucide-react"; // Use a modern Lucide icon for loading

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  icon: Icon,
  className = "", // Added className prop for easy overriding
  ...props
}) => {
  // Define style variants
  const variants = {
    // Primary: Pink Gradient with deep shadow
    primary: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-300/50",
    
    // Secondary: Light gray background with a touch of pink on hover
    secondary: "bg-gray-100 hover:bg-pink-50 text-gray-700 border border-gray-200",
    
    // Ghost: Transparent with prominent pink text on hover
    ghost: "bg-transparent hover:bg-pink-50 text-pink-600 hover:text-pink-700",
    
    // Danger (Optional, but useful for delete actions)
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-300/50"
  };

  // Define sizes
  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8 rounded-lg",
    md: "px-4 py-2.5 text-base h-11 rounded-xl", // Increased text size slightly
    lg: "px-6 py-3 text-lg h-12 rounded-xl",     // Increased text size and padding
  };

  // Base styling for all buttons
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap";

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        // Use the Loader2 icon from Lucide for a cleaner spinner
        <Loader2 className={`w-5 h-5 animate-spin ${variant === 'secondary' || variant === 'ghost' ? 'text-pink-600' : 'text-white'}`} />
      ) : (
        <>
          {/* Increased icon size for better visibility */}
          {Icon && <Icon className="w-5 h-5 mr-2" />} 
          {children}
        </>
      )}
    </button>
  );
};

export default Button;