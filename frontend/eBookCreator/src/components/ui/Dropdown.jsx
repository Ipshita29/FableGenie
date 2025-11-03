import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg"
          role="menu"
          aria-orientation="vertical"
          tabIndex="-1"
        >
          <div className="py-2">{children}</div>
        </div>
      )}
    </div>
  );
};

// Sub-component for each dropdown item
export const DropdownItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
      role="menuitem"
      tabIndex="-1"
    >
      {children}
    </button>
  );
};

export default Dropdown;
