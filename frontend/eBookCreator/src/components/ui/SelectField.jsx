import React from "react";

const SelectField = ({ icon: Icon, label, name, options, ...props }) => {
  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {/* Select field container */}
      <div className="relative">
        {/* Icon (optional) */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        {/* Select dropdown */}
        <select
          id={name}
          name={name}
          {...props}
          className={`w-full h-11 px-3 py-2 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            Icon ? "pl-10" : ""
          }`}
        >
          {options.map((option) => (
            <option
              key={option.value || option}
              value={option.value || option}
            >
              {option.label || option}
            </option>
          ))}
        </select>

        {/* Dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M7 7l3 3 3-3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectField;
