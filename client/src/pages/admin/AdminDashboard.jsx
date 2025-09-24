// pages/admin/AdminDashboard.jsx
import React from 'react';
import { FaUsers, FaPlane, FaHotel, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '2,543', change: '+12.5%', icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Total Flights', value: '1,234', change: '+5.2%', icon: FaPlane, color: 'bg-green-500' },
    { title: 'Total Hotels', value: '856', change: '+3.8%', icon: FaHotel, color: 'bg-yellow-500' },
    { title: 'Total Revenue', value: '$45,231', change: '+8.2%', icon: FaMoneyBillWave, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-500 font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add more dashboard components as needed */}
    </div>
  );
};

export default AdminDashboard;