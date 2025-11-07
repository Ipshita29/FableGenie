import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";


const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Left - Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center rounded-lg shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800 text-lg">
              FableGenie
            </span>
          </Link>

          {/* Right - Profile Dropdown */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={() => setProfileDropdownOpen(!profileDropdownOpen)}
              avatar={user?.avatar || ""}
              companyName={user?.name || "User"}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
