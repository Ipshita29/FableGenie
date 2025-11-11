import React from "react";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ companyName }) => {
  return (
    <Link
      to="/profile"
      className="flex items-center space-x-3 focus:outline-none"
    >
      <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
        {companyName ? companyName.charAt(0).toUpperCase() : "U"}
      </div>
    </Link>
  );
};

export default ProfileDropdown;
