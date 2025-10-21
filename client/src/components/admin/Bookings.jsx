"use client"

import { useState, useEffect } from "react"
import { useApi } from "../../contexts/ApiContext"
import {
  Calendar,
  Search,
  Eye,
  Edit,
  Trash2,
  XCircle,
  Download,
  RefreshCw,
  Phone,
  Mail,
  User,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  CheckCircle,
  X,
  AlertCircle,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp
} from "lucide-react"

const Bookings = () => {
  const { get, put, patch, del } = useApi()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [needsFollowUpFilter, setNeedsFollowUpFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBookings, setTotalBookings] = useState(0)
  const [stats, setStats] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null)
  const [statusUpdate, setStatusUpdate] = useState({
    bookingStatus: "",
    adminNotes: "",
    contactedBy: "",
    followUpDate: "",
  })

  const statusOptions = [
    { value: "", label: "All Status", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "contacted", label: "Contacted", color: "blue" },
    { value: "confirmed", label: "Confirmed", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
    { value: "completed", label: "Completed", color: "purple" },
  ]

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(needsFollowUpFilter && { needsFollowUp: "true" }),
      })

      const response = await get(`/bookings?${params}`)
      if (response.success) {
        setBookings(response.data)
        setTotalPages(response.pagination.totalPages)
        setTotalBookings(response.pagination.totalBookings)
        setStats(response.stats || [])
      }
    } catch (err) {
      setError("Failed to fetch bookings")
      console.error("Fetch bookings error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [currentPage, searchTerm, statusFilter, needsFollowUpFilter])

  const handleStatusUpdate = async () => {
    try {
      const updateData = {
        bookingStatus: statusUpdate.bookingStatus,
        adminNotes: statusUpdate.adminNotes,
        adminNote: statusUpdate.adminNotes,
        contactedBy: currentUser?.name || statusUpdate.contactedBy,
        followUpDate: statusUpdate.followUpDate,
        currentStatus: selectedBooking.bookingStatus
      };

      const response = await put(`/bookings/${selectedBooking._id}/status`, updateData);
      
      if (response.success) {
        setShowStatusModal(false);
        const updatedBooking = await get(`/bookings/${selectedBooking._id}`);
        if (updatedBooking.success) {
          setSelectedBooking(updatedBooking.data);
        }
        fetchBookings();
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError("Failed to update booking status");
    }
  }

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      const response = await patch(`/bookings/${bookingId}/cancel`, { reason })
      if (response.success) {
        fetchBookings()
      }
    } catch (err) {
      console.error("Cancel booking error:", err)
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        const response = await del(`/bookings/${bookingId}`)
        if (response.success) {
          fetchBookings()
        }
      } catch (err) {
        console.error("Delete booking error:", err)
      }
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors"

    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`
      case "contacted":
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`
      case "confirmed":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`
      case "completed":
        return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`
    }
  }

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("altaqween_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        if (user && user.name) {
          setStatusUpdate(prev => ({
            ...prev,
            contactedBy: user.name
          }));
        }
      }
    } catch (err) {
      console.error("Error getting user data from localStorage:", err);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const needsFollowUp = (booking) => {
    if (booking.bookingStatus === "pending") return true
    if (booking.followUpDate && new Date() > new Date(booking.followUpDate)) return true
    return false
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "contacted":
        return <Phone className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-xl w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage customer bookings and follow-up contacts</p>
          </div>
          <div className="flex flex-col xs:flex-row gap-3">
            <button
              onClick={fetchBookings}
              className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      {stat._id === 'confirmed' && <CheckCircle className="h-5 w-5 text-white" />}
                      {stat._id === 'pending' && <Clock className="h-5 w-5 text-white" />}
                      {stat._id === 'cancelled' && <X className="h-5 w-5 text-white" />}
                      {stat._id === 'completed' && <BarChart3 className="h-5 w-5 text-white" />}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 capitalize">{stat._id} Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings by reference, customer, or package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Filters Toggle for Mobile */}
            <div className="block lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </span>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Filters Grid */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={needsFollowUpFilter}
                        onChange={(e) => setNeedsFollowUpFilter(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`block w-12 h-6 rounded-full transition-colors ${
                        needsFollowUpFilter ? 'bg-blue-600' : 'bg-gray-300'
                      }`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        needsFollowUpFilter ? 'transform translate-x-6' : ''
                      }`}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Needs Follow-up</span>
                  </label>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("")
                      setNeedsFollowUpFilter(false)
                      setCurrentPage(1)
                      setShowFilters(false)
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {bookings.length} of {totalBookings} bookings
          </p>
          <div className="lg:hidden">
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Page {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Mobile Cards */}
          <div className="block lg:hidden">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  {searchTerm || statusFilter || needsFollowUpFilter
                    ? "Try adjusting your search criteria."
                    : "No bookings have been made yet."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      needsFollowUp(booking) ? "bg-orange-50 border-l-4 border-l-orange-500" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {booking.bookingReference}
                          </span>
                          <span className={getStatusBadge(booking.bookingStatus)}>
                            {getStatusIcon(booking.bookingStatus)}
                            <span className="ml-1">{booking.bookingStatus}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{booking.customerFullName}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setMobileMenuOpen(mobileMenuOpen === booking._id ? null : booking._id)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {mobileMenuOpen === booking._id && (
                          <div className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowDetailsModal(true)
                                setMobileMenuOpen(null)
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking)
                                setStatusUpdate({
                                  bookingStatus: booking.bookingStatus,
                                  adminNotes: booking.adminNotes || "",
                                  contactedBy: booking.contactedBy || "",
                                  followUpDate: booking.followUpDate
                                    ? new Date(booking.followUpDate).toISOString().split("T")[0]
                                    : "",
                                })
                                setShowStatusModal(true)
                                setMobileMenuOpen(null)
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteBooking(booking._id)
                                setMobileMenuOpen(null)
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Package:</span>
                        <span className="font-medium text-gray-900 truncate ml-2">{booking.packageTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(booking.estimatedTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Travelers:</span>
                        <span className="font-medium text-gray-900">{booking.totalTravelers}</span>
                      </div>
                      {needsFollowUp(booking) && (
                        <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                          <Clock className="h-3 w-3 mr-1" />
                          Needs Follow-up
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-sm text-gray-500">
                  {searchTerm || statusFilter || needsFollowUpFilter
                    ? "Try adjusting your search criteria."
                    : "No bookings have been made yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package & Travelers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className={`hover:bg-gray-50 transition-colors ${
                          needsFollowUp(booking) ? "bg-orange-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{booking.bookingReference}</div>
                            <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              {booking.customerFullName}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {booking.customerInfo.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              {booking.customerInfo.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">{booking.packageTitle}</div>
                          <div className="text-sm text-gray-500">{booking.totalTravelers} travelers</div>
                          {booking.bookingDetails.startDate && (
                            <div className="text-sm text-gray-500">{formatDate(booking.bookingDetails.startDate)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(booking.estimatedTotal)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span className={getStatusBadge(booking.bookingStatus)}>
                              {getStatusIcon(booking.bookingStatus)}
                              <span className="ml-1 capitalize">{booking.bookingStatus}</span>
                            </span>
                            {needsFollowUp(booking) && (
                              <div className="flex items-center text-xs text-orange-600">
                                <Clock className="h-3 w-3 mr-1" />
                                Needs Follow-up
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowDetailsModal(true)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking)
                                setStatusUpdate({
                                  bookingStatus: booking.bookingStatus,
                                  adminNotes: booking.adminNotes || "",
                                  contactedBy: booking.contactedBy || "",
                                  followUpDate: booking.followUpDate
                                    ? new Date(booking.followUpDate).toISOString().split("T")[0]
                                    : "",
                                })
                                setShowStatusModal(true)
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Update status"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span> ({totalBookings} total bookings)
                  </p>
                </div>
                
                {/* Mobile Pagination */}
                <div className="flex justify-center sm:hidden">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ←
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Desktop Pagination */}
                <div className="hidden sm:flex justify-center">
                  <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                            currentPage === pageNumber
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Booking Details - {selectedBooking.bookingReference}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.customerFullName}</p>
                        <p className="text-sm text-gray-500">Full Name</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.customerInfo.email}</p>
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedBooking.customerInfo.phone}</p>
                        <p className="text-sm text-gray-500">Phone</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Booking Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.packageTitle}</p>
                      <p className="text-sm text-gray-500">Package</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedBooking.totalTravelers} travelers</p>
                      <p className="text-sm text-gray-500">
                        ({selectedBooking.bookingDetails.numberOfTravelers.adults} adults,{" "}
                        {selectedBooking.bookingDetails.numberOfTravelers.children} children,{" "}
                        {selectedBooking.bookingDetails.numberOfTravelers.infants} infants)
                      </p>
                    </div>
                    {selectedBooking.bookingDetails.startDate && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(selectedBooking.bookingDetails.startDate)}
                        </p>
                        <p className="text-sm text-gray-500">Start Date</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package Price:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedBooking.packagePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Travelers:</span>
                    <span className="font-medium text-gray-900">{selectedBooking.totalTravelers}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-base">
                      <span className="text-gray-900">Estimated Total:</span>
                      <span className="text-blue-600">{formatCurrency(selectedBooking.estimatedTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
                <div className="space-y-3">
                  {selectedBooking.adminActivityLogs?.length > 0 ? (
                    selectedBooking.adminActivityLogs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-xl">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{log.updatedBy}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.date).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={getStatusBadge(log.status)}>
                              {getStatusIcon(log.status)}
                              <span className="ml-1 capitalize">{log.status}</span>
                            </span>
                            {log.note && <p className="text-sm text-gray-700 mt-1">{log.note}</p>}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">No activity recorded yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Update Booking Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                <select
                  value={statusUpdate.bookingStatus}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, bookingStatus: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                >
                  {statusOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contacted By</label>
                <input
                  type="text"
                  value={statusUpdate.contactedBy || (currentUser?.name || '')}
                  readOnly
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-sm cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Automatically filled with your admin account</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                <input
                  type="date"
                  value={statusUpdate.followUpDate}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, followUpDate: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={statusUpdate.adminNotes}
                  onChange={(e) => setStatusUpdate(prev => ({ ...prev, adminNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                  placeholder="Add notes about customer contact, preferences, or booking details..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 pt-4">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="w-full sm:w-auto px-4 py-2.5 border border-transparent rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings