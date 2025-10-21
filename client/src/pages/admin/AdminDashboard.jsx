// pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaPlane, FaHotel, FaMoneyBillWave, FaCalendarAlt, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { useApi } from '../../contexts/ApiContext';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-3 xs:p-4 sm:p-5 border border-gray-100 h-full">
    <div className="flex items-start justify-between h-full">
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2 truncate">{title}</p>
        <div className="flex items-baseline flex-wrap gap-1 xs:gap-2">
          <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate leading-tight">
            {value}
          </p>
          {change && (
            <span className="text-[10px] xs:text-xs font-medium text-green-500 bg-green-50 px-1.5 xs:px-2 py-0.5 rounded-full whitespace-nowrap flex items-center">
              <span className="mr-0.5">↑</span>
              {change}
            </span>
          )}
        </div>
      </div>
      <div className={`${color} text-white p-2 xs:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ml-1 xs:ml-2`}>
        <Icon className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
      </div>
    </div>
  </div>
);

const BookingRow = ({ booking, formatCurrency }) => (
  <div className="grid grid-cols-1 xs:grid-cols-[1fr_auto] sm:hidden gap-2 p-3 xs:p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs xs:text-sm font-medium text-gray-900 truncate max-w-[120px]">
          {booking.bookingReference}
        </span>
        <span className={`px-2 py-1 text-[10px] xs:text-xs font-semibold rounded-full ${
          booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
          booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {booking.bookingStatus}
        </span>
      </div>
      <p className="text-xs text-gray-600 truncate">
        {booking.customerInfo?.firstName} {booking.customerInfo?.lastName}
      </p>
      <p className="text-xs text-gray-500 truncate hidden xs:block">
        {booking.packageId?.title || 'N/A'}
      </p>
    </div>
    <div className="flex items-center justify-between xs:justify-end xs:flex-col xs:items-end xs:space-y-1">
      <span className="text-sm xs:text-base font-semibold text-gray-900">
        {formatCurrency(booking.estimatedTotal)}
      </span>
      <span className="text-xs text-gray-500 xs:hidden">
        {booking.packageId?.title || 'N/A'}
      </span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { get } = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await get('/dashboard/stats');
      if (response.success) {
        setStats(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const statsData = [
    { 
      title: 'Total Users', 
      value: stats ? formatNumber(stats.totalUsers) : '--', 
      change: '+12%', 
      icon: FaUsers, 
      color: 'bg-blue-500 hover:bg-blue-600 transition-colors' 
    },
    { 
      title: 'Total Bookings', 
      value: stats ? formatNumber(stats.totalBookings) : '--', 
      change: '+8%', 
      icon: FaCalendarAlt, 
      color: 'bg-green-500 hover:bg-green-600 transition-colors' 
    },
    { 
      title: 'Pending', 
      value: stats ? formatNumber(stats.bookingsByStatus?.pending || 0) : '--', 
      change: '+3%', 
      icon: FaHotel, 
      color: 'bg-yellow-500 hover:bg-yellow-600 transition-colors' 
    },
    { 
      title: 'Revenue', 
      value: stats ? formatCurrency(stats.totalRevenue) : '--', 
      change: '+15%', 
      icon: FaMoneyBillWave, 
      color: 'bg-purple-500 hover:bg-purple-600 transition-colors' 
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 max-w-md w-full p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchDashboardStats()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FaSync className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 xs:p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 xs:space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-sm border border-blue-100 p-4 xs:p-5 sm:p-6">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-1 xs:mb-2 leading-tight">
                Welcome back, Admin! 👋
              </h1>
              <p className="text-gray-600 text-sm xs:text-base leading-relaxed">
                Here's what's happening with your business today.
                {stats?.totalBookings > 0 && (
                  <span className="text-blue-600 font-medium ml-1">
                    {stats.totalBookings} bookings this month
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => fetchDashboardStats(true)}
              disabled={refreshing}
              className="w-full xs:w-auto inline-flex items-center justify-center px-4 xs:px-5 py-2.5 xs:py-3 border border-gray-300 shadow-sm text-sm xs:text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''} w-4 h-4`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && stats && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <p className="text-sm text-yellow-800">{error}</p>
                <button
                  onClick={() => fetchDashboardStats(true)}
                  className="mt-2 text-sm text-yellow-700 hover:text-yellow-800 font-medium inline-flex items-center"
                >
                  <FaSync className="mr-1 w-3 h-3" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Bookings */}
        {stats?.recentBookings?.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 xs:px-6 py-4 xs:py-5 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
                <h2 className="text-lg xs:text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {stats.recentBookings.length} bookings
                </span>
              </div>
            </div>
            
            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {stats.recentBookings.map((booking) => (
                <BookingRow key={booking._id} booking={booking} formatCurrency={formatCurrency} />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 xs:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Reference
                        </th>
                        <th scope="col" className="px-4 xs:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Package
                        </th>
                        <th scope="col" className="px-4 xs:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Customer
                        </th>
                        <th scope="col" className="px-4 xs:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Amount
                        </th>
                        <th scope="col" className="px-4 xs:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 xs:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span className="font-mono">{booking.bookingReference}</span>
                          </td>
                          <td className="px-4 xs:px-6 py-4 text-sm text-gray-900 max-w-[200px] 2xl:max-w-[300px]">
                            <span className="truncate block">{booking.packageId?.title || 'N/A'}</span>
                          </td>
                          <td className="px-4 xs:px-6 py-4 text-sm text-gray-900">
                            {booking.customerInfo?.firstName} {booking.customerInfo?.lastName}
                          </td>
                          <td className="px-4 xs:px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                            {formatCurrency(booking.estimatedTotal)}
                          </td>
                          <td className="px-4 xs:px-6 py-4 whitespace-nowrap text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                              booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' :
                              booking.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                              booking.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                              'bg-gray-100 text-gray-800 border border-gray-200'
                            }`}>
                              {booking.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* View All Button */}
            <div className="px-4 xs:px-6 py-3 bg-gray-50 border-t border-gray-200">
              <button className="w-full sm:w-auto text-center sm:text-left text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center justify-center sm:justify-start transition-colors">
                View all bookings
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent bookings</h3>
            <p className="text-gray-600 text-sm max-w-sm mx-auto">
              When customers make bookings, they'll appear here for quick overview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;