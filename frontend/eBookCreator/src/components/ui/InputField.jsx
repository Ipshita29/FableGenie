import React from "react";

const InputField = ({ icon: Icon, label, name, ...props }) => {
  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          {...props}
          className={`w-full h-11 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent ${
            Icon ? "pl-10" : ""
          } bg-white text-gray-900`}
        />
      </div>
    </div>
  );
};

export default InputField;
