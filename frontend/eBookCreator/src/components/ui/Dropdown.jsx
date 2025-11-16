import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown container
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    // Add event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          // Enhanced Container Styling: Stronger shadow, better border, modern radius
          className="absolute right-0 mt-2 min-w-[10rem] bg-white border border-gray-100 rounded-xl shadow-2xl z-50 transform origin-top-right animate-in fade-in-0 zoom-in-95"
          role="menu"
          aria-orientation="vertical"
          tabIndex="-1"
        >
          {/* Added padding to the container for a clean look */}
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for each dropdown item
export const DropdownItem = ({ children, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      // Enhanced Item Styling: Pink hover background, slightly larger padding
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150 ${className}`}
      role="menuitem"
      tabIndex="-1"
    >
      {children}
    </button>
  );
};

export default Dropdown;