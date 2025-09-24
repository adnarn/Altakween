// components/admin/Navbar.jsx
import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <FaBell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <FaUserCircle className="w-6 h-6" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;