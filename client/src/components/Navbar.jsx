import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { Navigation, Menu, X, User, LogOut, Package, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = currentUser?.role;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - Left side */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-blue-600">Altakween</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex md:items-center md:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/services" onClick={() => setIsOpen(false)}>
              Services
            </NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)}>
              Contact
            </NavLink>
          </div>

          {/* Profile/Auth - Right side */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-100 hover:border-blue-300 transition-colors">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    <NavDropdownItem
                      to="/profile"
                      icon={<UserIcon className="h-5 w-5" />}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </NavDropdownItem>
                    <NavDropdownItem
                      to="/bookings"
                      icon={<Package className="h-5 w-5" />}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      My Bookings
                    </NavDropdownItem>
                    {userRole === 'admin' && 
                    <NavDropdownItem
                      to="/admin"
                      icon={<Package className="h-5 w-5" />}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Admin
                    </NavDropdownItem>}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Navigation className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <MobileNavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink to="/services" onClick={() => setIsOpen(false)}>
            Services
          </MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>
            About
          </MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </MobileNavLink>

          {currentUser ? (
            <>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center px-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
                <MobileNavLink to="/profile" onClick={() => setIsOpen(false)}>
                  Profile
                </MobileNavLink>
                <MobileNavLink to="/bookings" onClick={() => setIsOpen(false)}>
                  My Bookings
                </MobileNavLink>
                {userRole === 'admin' && 
                <MobileNavLink to="/admin" onClick={() => setIsOpen(false)}>
                  Admin
                </MobileNavLink>}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-200">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md mb-2"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Reusable components
const NavLink = ({ to, onClick, children }) => (
  <RouterNavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'text-blue-600 underline underline-offset-4'
          : 'text-gray-700 hover:text-blue-600'
      }`
    }
  >
    {children}
  </RouterNavLink>
);

const NavDropdownItem = ({ to, icon, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
  >
    <span className="text-gray-400 mr-3">{icon}</span>
    {children}
  </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
  >
    {children}
  </Link>
);

export default Navbar;
