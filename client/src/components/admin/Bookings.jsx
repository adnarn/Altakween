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
  const [statusUpdate, setStatusUpdate] = useState({
    bookingStatus: "",
    adminNotes: "",
    contactedBy: "",
    followUpDate: "",
  })

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "contacted", label: "Contacted" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
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
      adminNote: statusUpdate.adminNotes, // For activity log
      contactedBy: currentUser?.name || statusUpdate.contactedBy,
      followUpDate: statusUpdate.followUpDate,
      currentStatus: selectedBooking.bookingStatus // For activity log
    };

    const response = await put(`/bookings/${selectedBooking._id}/status`, updateData);
    
    if (response.success) {
      setShowStatusModal(false);
      // Refresh the selected booking with updated data including the new activity log
      const updatedBooking = await get(`/bookings/${selectedBooking._id}`);
      if (updatedBooking.success) {
        setSelectedBooking(updatedBooking.data);
      }
      fetchBookings(); // Refresh the bookings list
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
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"

    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "contacted":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "confirmed":
        return `${baseClasses} bg-green-100 text-green-800`
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`
      case "completed":
        return `${baseClasses} bg-purple-100 text-purple-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }
  const [currentUser, setCurrentUser] = useState(null);
useEffect(() => {
  // Fetch current user data from localStorage
  try {
    const storedUser = localStorage.getItem("altaqween_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      // Update the statusUpdate with the user's name
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

  if (loading && bookings.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage customer bookings and follow-up contacts</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={fetchBookings}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate capitalize">{stat._id} Bookings</dt>
                      <dd className="text-lg font-medium text-gray-900">{stat.count}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Required</label>
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                checked={needsFollowUpFilter}
                onChange={(e) => setNeedsFollowUpFilter(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Show only bookings needing follow-up</label>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("")
                setNeedsFollowUpFilter(false)
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || needsFollowUpFilter
                ? "Try adjusting your search criteria."
                : "No bookings have been made yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package & Travelers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimated Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Follow-up
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className={`hover:bg-gray-50 ${needsFollowUp(booking) ? "bg-yellow-50" : ""}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.bookingReference}</div>
                          <div className="text-sm text-gray-500">{formatDate(booking.createdAt)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {booking.customerFullName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {booking.customerInfo.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {booking.customerInfo.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.packageTitle}</div>
                        <div className="text-sm text-gray-500">{booking.totalTravelers} travelers</div>
                        {booking.bookingDetails.startDate && (
                          <div className="text-sm text-gray-500">{formatDate(booking.bookingDetails.startDate)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(booking.estimatedTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={getStatusBadge(booking.bookingStatus)}>{booking.bookingStatus}</span>
                          {needsFollowUp(booking) && (
                            <div className="flex items-center text-xs text-orange-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Needs Follow-up
                            </div>
                          )}
                          {booking.contactedAt && (
                            <div className="text-xs text-gray-500">Contacted: {formatDate(booking.contactedAt)}</div>
                          )}
                          {booking.followUpDate && (
                            <div className="text-xs text-gray-500">Follow-up: {formatDate(booking.followUpDate)}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowDetailsModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
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
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-900"
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

            {/* Mobile Cards */}
            <div className="md:hidden">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`border-b border-gray-200 p-4 ${needsFollowUp(booking) ? "bg-yellow-50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{booking.bookingReference}</span>
                    <div className="flex space-x-1">
                      <span className={getStatusBadge(booking.bookingStatus)}>{booking.bookingStatus}</span>
                      {needsFollowUp(booking) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Follow-up
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span className="font-medium">{booking.customerFullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-medium">{booking.customerInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Package:</span>
                      <span className="font-medium">{booking.packageTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Total:</span>
                      <span className="font-medium">{formatCurrency(booking.estimatedTotal)}</span>
                    </div>
                    {booking.contactedAt && (
                      <div className="flex justify-between">
                        <span>Last Contact:</span>
                        <span className="font-medium">{formatDate(booking.contactedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowDetailsModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
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
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span> ({totalBookings} total bookings)
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Booking Details - {selectedBooking.bookingReference}
              </h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {selectedBooking.customerFullName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {selectedBooking.customerInfo.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedBooking.customerInfo.phone}
                    </p>
                    {selectedBooking.customerInfo.address && (
                      <p>
                        <span className="font-medium">Address:</span> {selectedBooking.customerInfo.address.street},{" "}
                        {selectedBooking.customerInfo.address.city}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Booking Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Package:</span> {selectedBooking.packageTitle}
                    </p>
                    <p>
                      <span className="font-medium">Travelers:</span> {selectedBooking.totalTravelers}
                      <span className="text-gray-500 ml-1">
                        ({selectedBooking.bookingDetails.numberOfTravelers.adults} adults,{" "}
                        {selectedBooking.bookingDetails.numberOfTravelers.children} children,{" "}
                        {selectedBooking.bookingDetails.numberOfTravelers.infants} infants)
                      </span>
                    </p>
                    {selectedBooking.bookingDetails.startDate && (
                      <p>
                        <span className="font-medium">Start Date:</span>{" "}
                        {formatDate(selectedBooking.bookingDetails.startDate)}
                      </p>
                    )}
                    {selectedBooking.bookingDetails.endDate && (
                      <p>
                        <span className="font-medium">End Date:</span>{" "}
                        {formatDate(selectedBooking.bookingDetails.endDate)}
                      </p>
                    )}
                    {selectedBooking.bookingDetails.roomType && (
                      <p>
                        <span className="font-medium">Room Type:</span> {selectedBooking.bookingDetails.roomType}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pricing Information</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span>Package Price:</span>
                    <span>{formatCurrency(selectedBooking.packagePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Travelers:</span>
                    <span>{selectedBooking.totalTravelers}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2 mt-2">
                    <span>Estimated Total:</span>
                    <span>{formatCurrency(selectedBooking.estimatedTotal)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact & Follow-up</h4>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={getStatusBadge(selectedBooking.bookingStatus)}>
                      {selectedBooking.bookingStatus}
                    </span>
                  </div>
                  {selectedBooking.contactedAt && (
                    <div className="flex justify-between">
                      <span>Last Contacted:</span>
                      <span>{formatDate(selectedBooking.contactedAt)}</span>
                    </div>
                  )}
                  {selectedBooking.contactedBy && (
                    <div className="flex justify-between">
                      <span>Contacted By:</span>
                      <span>{selectedBooking.contactedBy}</span>
                    </div>
                  )}
                  {selectedBooking.followUpDate && (
                    <div className="flex justify-between">
                      <span>Follow-up Date:</span>
                      <span>{formatDate(selectedBooking.followUpDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedBooking.bookingDetails.specialRequests && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedBooking.bookingDetails.specialRequests}
                  </p>
                </div>
              )}

              {selectedBooking.emergencyContact && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Emergency Contact</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {selectedBooking.emergencyContact.name}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {selectedBooking.emergencyContact.phone}
                    </p>
                    <p>
                      <span className="font-medium">Relationship:</span> {selectedBooking.emergencyContact.relationship}
                    </p>
                  </div>
                </div>
              )}

              {selectedBooking.adminNotes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Admin Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedBooking.adminNotes}</p>
                </div>
              )}

              {/* Activity Log Section */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Activity Log</h4>
                <div className="space-y-4">
                  {selectedBooking.adminActivityLogs?.length > 0 ? (
                    selectedBooking.adminActivityLogs.map((log, index) => (
                      <div key={index} className="border-l-2 pl-4 py-2 border-blue-200">
                        <div className="flex justify-between items-baseline">
                          <span className="font-medium text-sm">{log.updatedBy}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(log.date).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            log.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            log.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            log.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            log.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {log.status}
                          </span>
                          {log.note && <p className="text-sm text-gray-700">{log.note}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No activity recorded yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Update Booking Status</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                <select
                  value={statusUpdate.bookingStatus}
                  onChange={(e) => setStatusUpdate((prev) => ({ ...prev, bookingStatus: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
  />
  <p className="mt-1 text-xs text-gray-500">Automatically filled with your admin account</p>
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                <input
                  type="date"
                  value={statusUpdate.followUpDate}
                  onChange={(e) => setStatusUpdate((prev) => ({ ...prev, followUpDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <textarea
                  value={statusUpdate.adminNotes}
                  onChange={(e) => setStatusUpdate((prev) => ({ ...prev, adminNotes: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about customer contact, preferences, or booking details..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
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
