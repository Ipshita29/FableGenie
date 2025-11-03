// Footer.jsx
import { BookOpen, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    // The footer uses the soft background color 'pink-50' for visual continuity.
    <footer className="bg-pink-50 border-t border-pink-100 mt-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Grid: Logo/Brand and Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Logo and Brand Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            {/* Logo and Name (matches Navbar styling) */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center rounded-lg shadow-md">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                AI eBook Creator
              </span>
            </a>
            <p className="text-gray-600 max-w-xs text-sm">
              Effortlessly design, write, and publish your professional eBooks with the power of AI.
            </p>
          </div>

          {/* Column 2: Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#features" className="hover:text-pink-600 transition text-sm">Features</a></li>
              <li><a href="/pricing" className="hover:text-pink-600 transition text-sm">Pricing</a></li>
              <li><a href="/templates" className="hover:text-pink-600 transition text-sm">Templates</a></li>
              <li><a href="/roadmap" className="hover:text-pink-600 transition text-sm">Roadmap</a></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="/about" className="hover:text-pink-600 transition text-sm">About Us</a></li>
              <li><a href="/careers" className="hover:text-pink-600 transition text-sm">Careers</a></li>
              <li><a href="/blog" className="hover:text-pink-600 transition text-sm">Blog</a></li>
              <li><a href="/contact" className="hover:text-pink-600 transition text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Legal & Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="/faq" className="hover:text-pink-600 transition text-sm">FAQ</a></li>
              <li><a href="/terms" className="hover:text-pink-600 transition text-sm">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-pink-600 transition text-sm">Privacy Policy</a></li>
              <li><a href="/help" className="hover:text-pink-600 transition text-sm">Help Center</a></li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-12 border-t border-pink-200 pt-8">
          
          {/* Bottom Row: Copyright and Social Media */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Copyright */}
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} AI eBook Creator. All rights reserved.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-pink-600 transition">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-pink-600 transition">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-600 transition">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-pink-600 transition">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;