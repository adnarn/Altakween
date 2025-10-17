import { useState, useEffect, useMemo } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { format } from 'date-fns';
import { Download, Search, RefreshCw } from 'lucide-react';

const Reports = () => {
  const { get } = useApi();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Fetch reports from the API
  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await get('/reports/stats');
      if (response.success) {
        setReports(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.message || 'Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Generate report statistics
  const stats = useMemo(() => {
    if (!reports) return { total: 0, resolved: 0, pending: 0, inProgress: 0, totalRevenue: 0, totalUsers: 0 };
    
    const { stats: reportStats = {} } = reports;
    const { bookingsByStatus = {} } = reportStats;
    
    return {
      total: reportStats.totalBookings || 0,
      resolved: bookingsByStatus.completed || 0,
      pending: bookingsByStatus.pending || 0,
      inProgress: bookingsByStatus.confirmed || 0,
      totalRevenue: reportStats.totalRevenue || 0,
      totalUsers: reportStats.totalUsers || 0
    };
  }, [reports]);

  // Filter and search reports
  const filteredReports = useMemo(() => {
    if (!reports?.recentBookings) return [];
    
    return reports.recentBookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        booking.bookingReference?.toLowerCase().includes(searchLower) ||
        booking.packageId?.title?.toLowerCase().includes(searchLower) ||
        `${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}`.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === 'all' || booking.bookingStatus === statusFilter;
      
      const bookingDate = new Date(booking.createdAt);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      const matchesDate = !fromDate || !toDate || 
                         (bookingDate >= fromDate && bookingDate <= toDate);
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reports, searchTerm, statusFilter, dateRange]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  // Export reports to CSV
  const exportToCSV = () => {
    if (!filteredReports.length) return;
    
    const headers = ['Reference', 'Package', 'Customer', 'Amount', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredReports.map(booking => [
        `"${booking.bookingReference || 'N/A'}"`,
        `"${booking.packageId?.title || 'N/A'}"`,
        `"${booking.customerInfo?.firstName} ${booking.customerInfo?.lastName}"`,
        formatCurrency(booking.estimatedTotal),
        booking.bookingStatus,
        format(new Date(booking.createdAt), 'PPpp')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bookings-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
      failed: { label: 'Failed', className: 'bg-gray-100 text-gray-800' }
    };
    
    const { label, className } = statusMap[status?.toLowerCase()] || { 
      label: status || 'Unknown', 
      className: 'bg-gray-100 text-gray-800' 
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    );
  };

  // Stats display configuration
  const statsDisplay = [
    { 
      title: 'Total Bookings',
      value: formatNumber(stats.total),
      icon: '📊',
      color: 'text-blue-500',
      description: 'All bookings'
    },
    { 
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: '💰',
      color: 'text-green-500',
      description: 'Total earnings'
    },
    { 
      title: 'Completed',
      value: formatNumber(stats.resolved),
      icon: '✅',
      color: 'text-green-500',
      description: 'Completed bookings'
    },
    { 
      title: 'In Progress',
      value: formatNumber(stats.inProgress),
      icon: '🔄',
      color: 'text-yellow-500',
      description: 'In progress'
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-500 text-sm">
            View and manage booking reports and analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={exportToCSV}
            disabled={loading || filteredReports.length === 0}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium ${
              loading || filteredReports.length === 0 
                ? 'text-gray-400 bg-gray-50 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button 
            onClick={fetchReports} 
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsDisplay.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
            <p className="text-sm text-gray-500">
              {filteredReports.length} {filteredReports.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchReports}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="mr-1 h-3 w-3" /> Try Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length > 0 ? (
                  filteredReports.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.bookingReference || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.packageId?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.customerInfo?.firstName} {booking.customerInfo?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(booking.estimatedTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.bookingStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(booking.createdAt), 'PPpp')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || statusFilter !== 'all' || dateRange.from || dateRange.to 
                            ? 'Try adjusting your search or filter criteria'
                            : 'No bookings have been made yet'}
                        </p>
                        {(searchTerm || statusFilter !== 'all' || dateRange.from || dateRange.to) && (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchTerm('');
                              setStatusFilter('all');
                              setDateRange({ from: '', to: '' });
                            }}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;