import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-white to-pink-50/50 border-b border-pink-100/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center rounded-lg shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              FableGenie
            </span>
          </Link>

          {/* Desktop Auth/Profile */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <ProfileDropdown
                companyName={user?.name || ""}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-gray-700 font-medium hover:text-pink-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-300/50 hover:bg-pink-700 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-pink-50 transition"
          >
            {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="lg:hidden px-6 pb-4 space-y-2 bg-pink-50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block py-2 text-gray-700 hover:text-pink-600 transition font-medium"
            >
              {link.name}
            </Link>
          ))}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="block mt-4 px-4 py-2 text-gray-700 font-medium hover:text-pink-600 text-center"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block mt-2 px-4 py-2 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
