"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Users, Home, Phone, Mail, MapPin, User, AlertCircle } from "lucide-react"
import { useApi } from "../contexts/ApiContext"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const BookingModal = ({ package: packageData, isOpen, onClose, onBookingSuccess }) => {
  const { post } = useApi()
  const { currentUser, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Traveler details, 2: Booking details, 3: Review
  const [formData, setFormData] = useState({
    // Customer Information
    customerInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
    // Booking Details
    bookingDetails: {
      startDate: "",
      endDate: "",
      numberOfTravelers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      roomType: "double",
      specialRequests: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  })

  // Initialize form with user data if logged in
  useEffect(() => {
    if (currentUser && isOpen) {
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          firstName: currentUser.firstName || "",
          lastName: currentUser.lastName || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
        }
      }))
    }
  }, [currentUser, isOpen])

  const handleInputChange = (section, field, value, subField = null) => {
    setFormData(prev => {
      const newData = { ...prev }
      if (subField) {
        newData[section][field][subField] = value
      } else {
        newData[section][field] = value
      }
      return newData
    })
  }

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price !== 'string') return 0;
    
    // Handle common price formats
    const priceFormats = [
      // Nigerian format: ₦150,000
      /₦\s*([\d,]+)/,
      // US format: $150,000
      /\$\s*([\d,]+)/,
      // Euro format: €150,000
      /€\s*([\d,]+)/,
      // Plain number with commas: 150,000
      /^([\d,]+)$/,
      // Plain number without commas: 150000
      /^(\d+)$/
    ];
    
    for (const format of priceFormats) {
      const match = price.match(format);
      if (match) {
        const numberString = match[1] || match[0];
        const cleanNumber = numberString.replace(/,/g, '');
        const parsed = parseFloat(cleanNumber);
        if (!isNaN(parsed)) return parsed;
      }
    }
    
    return 0;
  };

  const calculateEstimatedTotal = () => {
    const priceValue = parsePrice(packageData?.price);
    
    if (priceValue <= 0) {
      console.warn('Invalid or missing package price:', packageData?.price);
      return 0;
    }

    const adults = Number(formData.bookingDetails.numberOfTravelers.adults) || 0;
    const children = Number(formData.bookingDetails.numberOfTravelers.children) || 0;
    const infants = Number(formData.bookingDetails.numberOfTravelers.infants) || 0;

    const totalTravelers = adults + children + infants;
    const calculatedTotal = priceValue * totalTravelers;

    // Final validation to ensure we don't return NaN
    return isNaN(calculatedTotal) ? 0 : calculatedTotal;
  }

  const validateStep1 = () => {
    const { firstName, lastName, email, phone } = formData.customerInfo
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all required customer information")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    const { startDate, endDate, numberOfTravelers } = formData.bookingDetails
    if (!startDate || !endDate) {
      toast.error("Please select travel dates")
      return false
    }
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error("End date must be after start date")
      return false
    }
    if (numberOfTravelers.adults < 1) {
      toast.error("At least one adult traveler is required")
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!packageData?._id) {
      toast.error("Package information is missing")
      return
    }

    const estimatedTotal = calculateEstimatedTotal();
    
    // Add validation for estimatedTotal
    if (estimatedTotal <= 0 || isNaN(estimatedTotal)) {
      toast.error("Unable to calculate booking total. Please check the package price.")
      return
    }

    setLoading(true)
    try {
      const bookingData = {
        packageId: packageData._id,
        customerInfo: formData.customerInfo,
        bookingDetails: formData.bookingDetails,
        emergencyContact: formData.emergencyContact,
        estimatedTotal: estimatedTotal,
      }

      const response = await post("/bookings", bookingData)

      if (response.success) {
        toast.success(response.message || "Booking request submitted successfully!")
        onBookingSuccess?.(response.data)
        onClose()
        // Reset form
        setStep(1)
        setFormData({
          customerInfo: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: { street: "", city: "", state: "", zipCode: "", country: "" },
          },
          bookingDetails: {
            startDate: "",
            endDate: "",
            numberOfTravelers: { adults: 1, children: 0, infants: 0 },
            roomType: "double",
            specialRequests: "",
          },
          emergencyContact: { name: "", phone: "", relationship: "" },
        })
        navigate("/bookings")
      }
    } catch (error) {
      console.error("Booking error:", error)
      toast.error(error.response?.data?.message || "Failed to submit booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (typeof price === "string") return price
    if (typeof price === "number") return `₦${price.toLocaleString()}`
    return "Contact for pricing"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Book Package</h3>
              <p className="text-sm text-gray-500">{packageData?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      step >= stepNumber
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-300"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      step >= stepNumber ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {stepNumber === 1 && "Traveler Info"}
                    {stepNumber === 2 && "Booking Details"}
                    {stepNumber === 3 && "Review & Confirm"}
                  </span>
                  {stepNumber < 3 && (
                    <div
                      className={`ml-8 w-16 h-0.5 ${
                        step > stepNumber ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {step === 1 && (
              <Step1
                formData={formData}
                onChange={handleInputChange}
                currentUser={currentUser}
              />
            )}

            {step === 2 && (
              <Step2
                formData={formData}
                onChange={handleInputChange}
                packageData={packageData}
              />
            )}

            {step === 3 && (
              <Step3
                formData={formData}
                packageData={packageData}
                estimatedTotal={calculateEstimatedTotal()}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50">
            <div>
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Confirm Booking"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 1: Traveler Information
const Step1 = ({ formData, onChange, currentUser }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
        <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
        <p className="text-sm text-blue-700">
          {currentUser 
            ? "Your profile information has been pre-filled. Please review and update if needed."
            : "Please provide your contact information. Create an account to save your details for future bookings."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              required
              value={formData.customerInfo.firstName}
              onChange={(e) => onChange("customerInfo", "firstName", e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            required
            value={formData.customerInfo.lastName}
            onChange={(e) => onChange("customerInfo", "lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              required
              value={formData.customerInfo.email}
              onChange={(e) => onChange("customerInfo", "email", e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              required
              value={formData.customerInfo.phone}
              onChange={(e) => onChange("customerInfo", "phone", e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+234 800 000 0000"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => onChange("emergencyContact", "name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Emergency contact name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => onChange("emergencyContact", "phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Emergency contact phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship
            </label>
            <input
              type="text"
              value={formData.emergencyContact.relationship}
              onChange={(e) => onChange("emergencyContact", "relationship", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Spouse, Parent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 2: Booking Details
const Step2 = ({ formData, onChange, packageData }) => {
  const calculateDuration = () => {
    if (!formData.bookingDetails.startDate || !formData.bookingDetails.endDate) return 0
    const start = new Date(formData.bookingDetails.startDate)
    const end = new Date(formData.bookingDetails.endDate)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              required
              value={formData.bookingDetails.startDate}
              onChange={(e) => onChange("bookingDetails", "startDate", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              required
              value={formData.bookingDetails.endDate}
              onChange={(e) => onChange("bookingDetails", "endDate", e.target.value)}
              min={formData.bookingDetails.startDate || new Date().toISOString().split('T')[0]}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {formData.bookingDetails.startDate && formData.bookingDetails.endDate && (
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Trip Duration: {calculateDuration()} days
          </p>
        </div>
      )}

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Number of Travelers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adults (12+ years) *
            </label>
            <select
              value={formData.bookingDetails.numberOfTravelers.adults}
              onChange={(e) => onChange("bookingDetails", "numberOfTravelers", parseInt(e.target.value), "adults")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Children (2-11 years)
            </label>
            <select
              value={formData.bookingDetails.numberOfTravelers.children}
              onChange={(e) => onChange("bookingDetails", "numberOfTravelers", parseInt(e.target.value), "children")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0, 1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Infants (Under 2)
            </label>
            <select
              value={formData.bookingDetails.numberOfTravelers.infants}
              onChange={(e) => onChange("bookingDetails", "numberOfTravelers", parseInt(e.target.value), "infants")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0, 1, 2, 3].map(num => (
                <option key={num} value={num}>{num} Infant{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <select
            value={formData.bookingDetails.roomType}
            onChange={(e) => onChange("bookingDetails", "roomType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="single">Single Room</option>
            <option value="double">Double Room</option>
            <option value="triple">Triple Room</option>
            <option value="family">Family Room</option>
            <option value="suite">Suite</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <textarea
          value={formData.bookingDetails.specialRequests}
          onChange={(e) => onChange("bookingDetails", "specialRequests", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any special requirements or requests..."
        />
      </div>
    </div>
  )
}

// Step 3: Review and Confirm
const Step3 = ({ formData, packageData, estimatedTotal }) => {
  const totalTravelers = 
    formData.bookingDetails.numberOfTravelers.adults +
    formData.bookingDetails.numberOfTravelers.children +
    formData.bookingDetails.numberOfTravelers.infants

  const duration = () => {
    if (!formData.bookingDetails.startDate || !formData.bookingDetails.endDate) return 0
    const start = new Date(formData.bookingDetails.startDate)
    const end = new Date(formData.bookingDetails.endDate)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-lg font-medium text-green-800 mb-2">Booking Summary</h4>
        <p className="text-green-700">Please review your booking details before confirming.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Package Details */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Package Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium">{packageData?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{packageData?.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{duration()} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price per person:</span>
              <span className="font-medium">
                {typeof packageData?.price === 'number' ? `₦${packageData.price.toLocaleString()}` : packageData?.price}
              </span>
            </div>
          </div>
        </div>

        {/* Traveler Details */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Traveler Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">
                {formData.customerInfo.firstName} {formData.customerInfo.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{formData.customerInfo.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{formData.customerInfo.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Travelers:</span>
              <span className="font-medium">{totalTravelers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Travel Dates:</span>
                <span className="font-medium">
                  {new Date(formData.bookingDetails.startDate).toLocaleDateString()} - {' '}
                  {new Date(formData.bookingDetails.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium capitalize">{formData.bookingDetails.roomType}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Adults:</span>
                <span className="font-medium">{formData.bookingDetails.numberOfTravelers.adults}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Children:</span>
                <span className="font-medium">{formData.bookingDetails.numberOfTravelers.children}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Infants:</span>
                <span className="font-medium">{formData.bookingDetails.numberOfTravelers.infants}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      {formData.emergencyContact.name && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{formData.emergencyContact.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{formData.emergencyContact.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Relationship:</span>
              <span className="font-medium">{formData.emergencyContact.relationship}</span>
            </div>
          </div>
        </div>
      )}

      {/* Special Requests */}
      {formData.bookingDetails.specialRequests && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Special Requests</h4>
          <p className="text-gray-600">{formData.bookingDetails.specialRequests}</p>
        </div>
      )}

      {/* Total */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Estimated Total:</span>
          <span className="text-2xl text-blue-600">
            {typeof estimatedTotal === 'number' && estimatedTotal > 0 
              ? `₦${estimatedTotal.toLocaleString()}` 
              : 'Contact for pricing'
            }
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          * This is an estimated total. Final pricing will be confirmed after review.
        </p>
      </div>
    </div>
  )
}

export default BookingModal