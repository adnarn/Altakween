// components/admin/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTh, 
  FaUsers, 
  FaPlane, 
  FaHotel, 
  FaMoneyBillWave, 
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';


const Sidebar = ({ expanded, onToggle }) => {
  const [usersOpen, setUsersOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const location = useLocation();
  const { onLogout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-white/10' : '';
  };

  return (
    <aside
      className={`${
        expanded ? 'w-64' : 'w-20'
      } fixed h-full bg-[#0e2238] text-white flex flex-col transition-all duration-300 z-20`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 h-16">
        {expanded && <span className="text-xl font-bold">Altakween</span>}
        <button
          onClick={onToggle}
          className="p-2 text-gray-300 hover:bg-white/10 rounded-lg"
        >
          <FaTh className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {/* Dashboard */}
          <li>
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors ${isActive('/admin')}`}
            >
              <FaTh className="w-5 h-5 flex-shrink-0" />
              {expanded && <span>Dashboard</span>}
            </Link>
          </li>

          {/* Users */}
          <li>
            <button
              onClick={() => setUsersOpen(!usersOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FaUsers className="w-5 h-5 flex-shrink-0" />
                {expanded && <span>Users</span>}
              </div>
              {expanded && (
                <span className="text-sm">
                  {usersOpen ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              )}
            </button>
            {expanded && usersOpen && (
              <ul className="mt-1 ml-10 space-y-1">
                <li>
                  <Link
                    to="/admin/users"
                    className={`block px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors ${isActive('/admin/users')}`}
                  >
                    All Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/users/new"
                    className="block px-3 py-2 text-sm rounded hover:bg-white/10 transition-colors"
                  >
                    Add New User
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Add more navigation items as needed */}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition-colors"
        >
          <FaSignOutAlt className="w-4 h-4 flex-shrink-0" />
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;