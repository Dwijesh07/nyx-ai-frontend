import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.png';

export default function Layout() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/tools", label: "Tools" },
    { path: "/about", label: "About" },
    { path: "/pricing", label: "Pricing" },
    { path: "/account", label: "Account" }
  ];

  return (
    <div className="min-h-screen bg-primary-dark text-body">
      {/* Fixed Navbar */}
      <header className={`fixed top-0 left-0 w-full bg-primary-dark/95 backdrop-blur-lg 
                         border-b border-primary-light/20 z-50 transition-transform duration-300 
                         ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center group transition-all duration-300 hover:scale-105"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Nyx AI Logo"
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text">
                  Nyx AI
                </span>
                <span className="text-xs text-body">Intelligent Assistance</span>
              </div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 
                         items-center space-x-8 hidden md:flex">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-accent-blue hover:text-accent-blue-light transition-colors z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay - COMPLETELY FIXED */}
        <div className={`md:hidden fixed inset-0 bg-primary-dark/95 backdrop-blur-lg z-40 
                        transition-all duration-300 ease-in-out
                        ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          
          {/* Mobile Navigation - Fixed positioning and layout */}
          <div className="h-full w-full flex flex-col items-center justify-start pt-24 px-4 overflow-y-auto">
            
            {/* Menu Items Container */}
            <div className="w-full max-w-sm mx-auto space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block w-full text-center py-4 px-6 rounded-xl text-xl font-medium 
                             transition-all duration-300
                             ${isActive(item.path) 
                               ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30' 
                               : 'text-body hover:bg-primary-light/30 hover:text-accent-blue'
                             }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Get in touch section */}
            <div className="w-full max-w-sm mx-auto mt-12 pt-8 border-t border-primary-light/20">
              <div className="text-center">
                <div className="text-sm text-body mb-4">Get in touch</div>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center 
                               text-body hover:text-accent-blue hover:bg-primary-light/50 
                               transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-primary-light/30 flex items-center justify-center 
                               text-body hover:text-accent-blue hover:bg-primary-light/50 
                               transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-medium border-t border-primary-light/20 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Brand - Neural Network Style Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-blue-dark 
                              rounded-md flex items-center justify-center interactive-glow relative overflow-hidden">
                {/* Circuit pattern background */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 32 32">
                  <line x1="4" y1="4" x2="28" y2="28" stroke="white" strokeWidth="1"/>
                  <line x1="28" y1="4" x2="4" y2="28" stroke="white" strokeWidth="1"/>
                  <circle cx="8" cy="8" r="2" fill="white"/>
                  <circle cx="24" cy="24" r="2" fill="white"/>
                  <circle cx="24" cy="8" r="2" fill="white"/>
                  <circle cx="8" cy="24" r="2" fill="white"/>
                </svg>
                {/* AI symbol */}
                <span className="text-white font-bold text-sm relative z-10"></span>
              </div>
              <div>
                <div className="font-bold text-lg gradient-text">
                  Nyx AI
                </div>
                <div className="text-xs text-body">Advanced AI Solutions</div>
              </div>
            </div>
            
            {/* Links */}
            <div className="flex flex-wrap justify-center gap-4 text-body text-sm">
              <Link to="/privacy" className="hover:text-accent-blue transition-colors duration-300">
                Privacy Policy
              </Link>
              <span className="text-primary-light">•</span>
              <Link to="/terms" className="hover:text-accent-blue transition-colors duration-300">
                Terms & Conditions
              </Link>
              <span className="text-primary-light">•</span>
              <Link to="/contact" className="hover:text-accent-blue transition-colors duration-300">
                Contact
              </Link>
            </div>
            
            {/* Copyright */}
            <div className="text-body text-sm">
              © 2024 Nyx AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}