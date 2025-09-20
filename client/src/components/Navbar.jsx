import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.querySelector('nav');
      if (isOpen && !nav.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-0' : 'bg-white/90 backdrop-blur-sm py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMobileMenu}>
              <Navigation className="text-blue-600 h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-blue-600">ALTAKWEEN</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-2">
            <NavLink to="/" onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/services" onClick={closeMobileMenu}>
              Services
            </NavLink>
            <NavLink to="#airlines" onClick={closeMobileMenu} isExternal>
              Airlines
            </NavLink>
            <NavLink to="/about" onClick={closeMobileMenu}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu}>
              Contact
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link 
              to="/register" 
              className="mr-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Register
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Register Button */}
          <div className="hidden md:flex items-center ml-4">
            <Link 
              to="/register" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <MobileNavLink to="/" onClick={closeMobileMenu}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/services" onClick={closeMobileMenu}>
            Services
          </MobileNavLink>
          <MobileNavLink to="#airlines" onClick={closeMobileMenu} isExternal>
            Airlines
          </MobileNavLink>
          <MobileNavLink to="/about" onClick={closeMobileMenu}>
            About
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={closeMobileMenu}>
            Contact
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink component
export const NavLink = ({ to, children, isExternal = false, onClick, className = '' }) => {
  const baseClasses = 'px-3 py-2 text-sm font-medium transition-colors duration-200';
  const activeClasses = 'text-blue-600 border-b-2 border-blue-600';
  const inactiveClasses = 'text-gray-600 hover:text-blue-600';
  
  const isActive = window.location.pathname === to;
  
  if (isExternal) {
    return (
      <a
        href={to}
        className={`${baseClasses} ${inactiveClasses} ${className}`}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  return (
    <Link
      to={to}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// Mobile NavLink component
export const MobileNavLink = ({ to, children, isExternal = false, onClick }) => {
  const baseClasses = 'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200';
  const activeClasses = 'bg-blue-50 text-blue-600';
  const inactiveClasses = 'text-gray-700 hover:bg-gray-100 hover:text-blue-600';
  
  const isActive = window.location.pathname === to;
  
  if (isExternal) {
    return (
      <a
        href={to}
        className={`${baseClasses} ${inactiveClasses}`}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  return (
    <Link
      to={to}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;
