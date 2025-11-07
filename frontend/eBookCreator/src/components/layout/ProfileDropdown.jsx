import React from "react";
import { Link } from "react-router-dom";
import { LogOut, User, Mail } from "lucide-react";

const ProfileDropdown = ({ isOpen, onToggle, avatar, companyName, email, onLogout }) => {
  return (
    <div className="relative">
      {/* Avatar and Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <img
          src={avatar || "/default-avatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
        />

        <div className="hidden sm:block text-left">
          <p className="font-medium text-gray-800">{companyName}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white shadow-lg rounded-xl border border-gray-100 py-2 z-20">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-semibold text-gray-800">{companyName}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>

          <ul className="mt-2">
            <li className="px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer">
              <Link to="/profile" className="flex items-center space-x-2">
                <User size={18} />
                <span>View Profile</span>
              </Link>
            </li>
            <li
              onClick={onLogout}
              className="px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer text-red-500"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
