"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useApi } from "../contexts/ApiContext"
import { Calendar, Clock, Users, MapPin, Clock3, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import {Link } from 'react-router-dom'

const Bookings = () => {
  const { currentUser } = useAuth()
  const { get } = useApi()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser?.email) return

      try {
        setLoading(true)
        setError(null)
        const response = await get(`/bookings/customer/${currentUser.email}`)
        if (response.success) {
          setBookings(response.data)
        } else {
          setError(response.message || "Failed to load bookings")
        }
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError("Failed to load bookings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [currentUser, get])

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return

    try {
      setCancellingId(bookingId)
      const response = await get(`/bookings/${bookingId}/cancel`)
      if (response.success) {
        toast.success("Booking cancelled successfully")
        // Update the local state to reflect the cancellation
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, bookingStatus: "cancelled" } 
            : booking
        ))
      } else {
        toast.error(response.message || "Failed to cancel booking")
      }
    } catch (err) {
      console.error("Error cancelling booking:", err)
      toast.error("Failed to cancel booking. Please try again.")
    } finally {
      setCancellingId(null)
    }
  }

  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter(booking => booking.bookingStatus === activeTab)

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      contacted: "bg-purple-100 text-purple-800"
    }

    const statusIcons = {
      pending: <AlertCircle className="h-4 w-4 mr-1" />,
      confirmed: <CheckCircle2 className="h-4 w-4 mr-1" />,
      cancelled: <XCircle className="h-4 w-4 mr-1" />,
      completed: <CheckCircle2 className="h-4 w-4 mr-1" />,
      contacted: <Clock3 className="h-4 w-4 mr-1" />
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusIcons[status] || null}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-2 text-sm text-gray-500">View and manage your travel bookings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {["all", "pending", "confirmed", "contacted", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && (
                  <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab === 'all' 
                      ? bookings.length 
                      : bookings.filter(b => b.bookingStatus === tab).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' 
                ? "You don't have any bookings yet."
                : `You don't have any ${activeTab} bookings.`}
            </p>
            <div className="mt-6">
              <a
                href="/services"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Packages
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {booking.packageTitle}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Booking Reference: {booking.bookingReference}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(booking.bookingStatus)}
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        Travel Dates
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formatDate(booking.bookingDetails?.startDate)} - {formatDate(booking.bookingDetails?.endDate)}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        Travelers
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {booking.bookingDetails?.numberOfTravelers?.adults || 0} Adults,{' '}
                        {booking.bookingDetails?.numberOfTravelers?.children || 0} Children,{' '}
                        {booking.bookingDetails?.numberOfTravelers?.infants || 0} Infants
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        Destination
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {booking.packageId?.location || 'N/A'}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Total Amount
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 font-medium sm:mt-0 sm:col-span-2">
                        {`₦${Number(booking.estimatedTotal).toLocaleString('en-US', {maximumFractionDigits: 0})}`}
                      </dd>
                    </div>
                    {booking.bookingDetails?.specialRequests && (
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Special Requests
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {booking.bookingDetails.specialRequests}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
                  <div className="flex justify-end space-x-3">
                    {booking.bookingStatus !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        {cancellingId === booking._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Cancelling...
                          </>
                        ) : (
                          'Cancel Booking'
                        )}
                      </button>
                    )}
                    <Link
                      to={`/package/${booking.packageId?._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Package
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings
