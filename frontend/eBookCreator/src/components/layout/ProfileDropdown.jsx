import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, LogOut } from "lucide-react";

const ProfileDropdown = ({ companyName }) => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
          {companyName ? companyName.charAt(0).toUpperCase() : "U"}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <Link
            to="/profile"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} className="mr-3 text-gray-500" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={16} className="mr-3 text-gray-500" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
