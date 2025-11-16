import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, BookOpen, Zap, PenTool, Layout, Gift, Facebook, Twitter, Instagram, Linkedin, MessageSquare, CheckCircle, Menu, X } from 'lucide-react';
import ProfileDropdown from '../components/layout/ProfileDropdown';
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.png"
import ebookToolkitBg from '../assets/ebookToolkitBg.png'; 
const EnhancedFeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-500 border border-pink-100 transform hover:-translate-y-1 group relative z-10">
    <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mb-6 ring-4 ring-pink-100 group-hover:bg-pink-100 transition">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-extrabold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-700 text-base">{description}</p>
  </div>
);

const EnhancedStepCard = ({ number, title, description }) => (
  <div className="flex gap-4 p-5 md:p-6 bg-white rounded-xl shadow-md border-l-4 border-pink-500 transition duration-300 hover:shadow-lg">
    <div className="w-10 h-10 min-w-[2.5rem] bg-pink-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-md">
      {number}
    </div>
    <div className="flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const footerNavigation = {
    solution: [
      { name: 'AI Writing', href: '#' },
      { name: 'Design Editor', href: '#' },
      { name: 'Export Formats', href: '#' },
      { name: 'Cover Creator', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    legal: [
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Security', href: '#' },
    ],
  };

  return (
    <div className="bg-white min-h-screen">

      <header className="bg-gradient-to-r from-white to-pink-50/50 border-b border-pink-100/70 sticky top-0 z-40">
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-pink-50 transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden px-6 pb-4 space-y-2 bg-pink-50 absolute w-full shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-2 text-gray-700 hover:text-pink-600 transition font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block mt-4 px-4 py-2 text-gray-700 font-medium hover:text-pink-600 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block mt-2 px-4 py-2 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        )}
      </header>

      <main>
        {/* 🚀 Hero Section */}
        <section className="bg-gradient-to-br from-white via-pink-50 to-white pt-10 sm:pt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-16">

            {/* Text Content */}
            <div className="flex-1 space-y-6 lg:max-w-xl">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-pink-200">
                <Sparkles className="w-4 h-4 animate-bounce" />
                The Future of Book Creation
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Design and Launch <span className="text-pink-600">eBooks</span> Effortlessly
              </h1>

              <p className="text-gray-600 text-lg lg:text-xl max-w-xl pt-2">
                From initial idea to a professionally designed book, our platform handles the writing, formatting, and export in minutes.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/signup"}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-pink-600 text-white rounded-xl font-bold text-lg shadow-2xl shadow-pink-400/50 hover:bg-pink-700 transition transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-pink-300"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Your Book Free"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Image Mockup */}
            <div className="flex-1 relative order-first lg:order-last w-full max-w-lg lg:max-w-none">
              <img
                src={image1}
                alt="AI Ebook Creator Dashboard Mockup"
                className="w-full rounded-3xl shadow-3xl object-cover ring-8 ring-white transform hover:scale-[1.01] transition duration-500 shadow-pink-300/60"
              />
              
              {/* Callout/Badge */}
              <div className="absolute bottom-8 md:bottom-12 left-8 md:left-12 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 border border-pink-200 backdrop-blur-sm hidden sm:flex">
                <div className="w-14 h-14 bg-pink-200 flex items-center justify-center rounded-xl">
                  <CheckCircle className="w-7 h-7 text-pink-600" />
                </div>
                <div>
                  <div className="text-gray-900 font-extrabold text-lg">Instant Publishing</div>
                  <div className="text-gray-500 text-sm font-medium">PDF & ePub Optimized</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Section 2: Features (with Background Image) --- */}
        <section
          className="py-24 relative overflow-hidden"
          style={{
            backgroundImage: `url(${ebookToolkitBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed' // Makes the background parallax scroll
          }}
        >
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black opacity-40 z-0"></div> 
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0"></div> 


          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"> {/* z-10 for content to be above overlay */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg"> {/* Text white with shadow */}
                Your Complete Ebook Creation Toolkit
              </h2>
              <p className="text-xl text-pink-100 mt-4 max-w-4xl mx-auto drop-shadow"> {/* Lighter pink text with shadow */}
                We eliminate the busywork so you can focus 100% on sharing your message with the world.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <EnhancedFeatureCard
                icon={PenTool}
                title="AI Co-Pilot"
                description="Overcome writer's block instantly. Our smart AI suggests content, rewrites passages, and expands your ideas."
              />
              <EnhancedFeatureCard
                icon={Layout}
                title="Intuitive Design Editor"
                description="Customize professional templates with drag-and-drop ease. No design skills or coding necessary."
              />
              <EnhancedFeatureCard
                icon={Zap}
                title="Instant Formatting"
                description="Converts your work into clean, industry-standard ePub and PDF files, optimized for all reading devices."
              />
              <EnhancedFeatureCard
                icon={Gift}
                title="Built-in Cover Designer"
                description="Access a library of cover templates and design tools to create a captivating book cover in minutes."
              />
            </div>
          </div>
        </section>

        <hr className="border-pink-100" />

        {/* --- Section 3: Process Steps --- */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              <div className="order-last lg:order-first">
                {/* Image display */}
                <div className="relative p-4 bg-gray-100 rounded-3xl">
                  <img
                      src={image2}
                      alt="Ebook content editing interface"
                      className="w-full rounded-2xl shadow-2xl shadow-pink-300/50"
                    />
                </div>
              </div>
              
              <div className="space-y-10">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                  Publishing Simplified in 3 Steps
                </h2>
                <p className="text-xl text-gray-600 max-w-md">
                  Follow our streamlined process to take your book from draft to digital storefront faster than ever.
                </p>
                
                <div className="space-y-6">
                  <EnhancedStepCard
                    number={1}
                    title="Input Your Concept"
                    description="Give us a brief topic or upload your existing draft. Our AI structures your manuscript automatically."
                  />
                  <EnhancedStepCard
                    number={2}
                    title="Review & Polish"
                    description="Use the intuitive editor to refine the AI's output, adjust the design, and add your personal touch."
                  />
                  <EnhancedStepCard
                    number={3}
                    title="Export & Share"
                    description="Generate flawless PDF and ePub files instantly, ready for sale on major platforms like Amazon KDP."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <hr className="border-pink-100" />

      <footer className="bg-pink-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          
          {/* Main Grid: Logo/Brand and Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
            
            {/* Column 1: Logo and Brand Info */}
            <div className="col-span-2 lg:col-span-2 space-y-4">
              <a href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center rounded-lg shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                  AI eBook Creator
                </span>
              </a>
              <p className="text-gray-600 max-w-xs text-sm">
                Effortlessly design, write, and publish your professional eBooks with the power of AI.
              </p>
            </div>

            {/* Navigation Columns */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Solution</h3>
              <ul role="list" className="space-y-3">
                {footerNavigation.solution.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-base text-gray-600 hover:text-pink-600 transition">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
              <ul role="list" className="space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-base text-gray-600 hover:text-pink-600 transition">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className='col-span-2 md:col-span-1 lg:col-span-1'>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Legal</h3>
              <ul role="list" className="space-y-3">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-base text-gray-600 hover:text-pink-600 transition">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Separator */}
          <div className="mt-16 border-t border-pink-200 pt-8">
            
            {/* Bottom Row: Copyright and Social Media */}
            <div className="flex flex-col md:flex-row items-center justify-between">
              
              {/* Copyright */}
              <p className="text-gray-500 text-sm mb-6 md:mb-0">
                &copy; {new Date().getFullYear()} AI eBook Creator. All rights reserved.
              </p>

              {/* Social Media Links */}
              <div className="flex space-x-5">
                <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-pink-600 transition hover:scale-110">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-pink-600 transition hover:scale-110">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-600 transition hover:scale-110">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-pink-600 transition hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Support" className="text-gray-500 hover:text-pink-600 transition hover:scale-110">
                  <MessageSquare className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;