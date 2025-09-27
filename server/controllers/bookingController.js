const Booking = require("../models/booking")
const PackageModel = require("../models/package")

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { packageId, customerInfo, bookingDetails, emergencyContact } = req.body

    // Validate package exists
    const packageInfo = await PackageModel.findById(packageId)
    if (!packageInfo) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      })
    }

    const totalTravelers =
      bookingDetails.numberOfTravelers.adults +
      bookingDetails.numberOfTravelers.children +
      bookingDetails.numberOfTravelers.infants
    const estimatedTotal = packageInfo.price * totalTravelers

    // Create booking with simplified structure
    const bookingData = {
      packageId,
      packageTitle: packageInfo.title,
      packagePrice: packageInfo.price,
      customerInfo,
      bookingDetails,
      estimatedTotal,
      emergencyContact,
    }

    const booking = new Booking(bookingData)
    await booking.save()

    // Populate package details
    await booking.populate("packageId", "title category location duration rating image")

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully. We will contact you soon!",
      data: booking,
    })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(400).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    })
  }
}

// Get all bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = "createdAt", sortOrder = "desc", needsFollowUp } = req.query

    // Build filter object
    const filter = {}
    if (status) filter.bookingStatus = status
    if (search) {
      filter.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { "customerInfo.firstName": { $regex: search, $options: "i" } },
        { "customerInfo.lastName": { $regex: search, $options: "i" } },
        { "customerInfo.email": { $regex: search, $options: "i" } },
        { packageTitle: { $regex: search, $options: "i" } },
      ]
    }

    if (needsFollowUp === "true") {
      filter.$or = [{ bookingStatus: "pending" }, { followUpDate: { $lte: new Date() } }]
    }

    // Calculate pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    // Get bookings with pagination
    const bookings = await Booking.find(filter)
      .populate("packageId", "title category location duration rating image")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const totalBookings = await Booking.countDocuments(filter)
    const totalPages = Math.ceil(totalBookings / Number.parseInt(limit))

    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 },
          totalEstimated: { $sum: "$estimatedTotal" },
        },
      },
    ])

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalBookings,
        hasNext: Number.parseInt(page) < totalPages,
        hasPrev: Number.parseInt(page) > 1,
      },
      stats,
    })
  } catch (error) {
    console.error("Get all bookings error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    })
  }
}

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params

    const booking = await Booking.findById(id).populate(
      "packageId",
      "title category location duration rating image includes",
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Get booking by ID error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    })
  }
}

// Get booking by reference
const getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params

    const booking = await Booking.findOne({ bookingReference: reference }).populate(
      "packageId",
      "title category location duration rating image includes",
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Get booking by reference error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    })
  }
}

// Get bookings by customer email
const getBookingsByCustomer = async (req, res) => {
  try {
    const { email } = req.params
    const { page = 1, limit = 10 } = req.query

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const bookings = await Booking.find({ "customerInfo.email": email })
      .populate("packageId", "title category location duration rating image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const totalBookings = await Booking.countDocuments({ "customerInfo.email": email })
    const totalPages = Math.ceil(totalBookings / Number.parseInt(limit))

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalBookings,
        hasNext: Number.parseInt(page) < totalPages,
        hasPrev: Number.parseInt(page) > 1,
      },
    })
  } catch (error) {
    console.error("Get bookings by customer error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer bookings",
      error: error.message,
    })
  }
}

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Remove fields that shouldn't be updated directly
    delete updateData.bookingReference
    delete updateData.createdAt

    const booking = await Booking.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).populate("packageId", "title category location duration rating image")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Update booking error:", error)
    res.status(400).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    })
  }
}

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { bookingStatus, adminNotes, contactedBy, followUpDate } = req.body

    const updateData = { updatedAt: Date.now() }
    if (bookingStatus) {
      updateData.bookingStatus = bookingStatus
      // If status is being changed to "contacted", record the contact time
      if (bookingStatus === "contacted") {
        updateData.contactedAt = Date.now()
        if (contactedBy) updateData.contactedBy = contactedBy
      }
    }
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (followUpDate) updateData.followUpDate = new Date(followUpDate)

    const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(
      "packageId",
      "title category location duration rating image",
    )

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Update booking status error:", error)
    res.status(400).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    })
  }
}

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    const booking = await Booking.findById(id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      })
    }

    // Update booking status
    booking.bookingStatus = "cancelled"
    booking.adminNotes = reason || "Booking cancelled"
    booking.updatedAt = Date.now()

    await booking.save()
    await booking.populate("packageId", "title category location duration rating image")

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    })
  } catch (error) {
    console.error("Cancel booking error:", error)
    res.status(400).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    })
  }
}

// Delete booking (Admin only)
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params

    const booking = await Booking.findByIdAndDelete(id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    })
  } catch (error) {
    console.error("Delete booking error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: error.message,
    })
  }
}

const getFollowUpBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ bookingStatus: "pending" }, { followUpDate: { $lte: new Date() } }],
    })
      .populate("packageId", "title category location duration rating image")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    })
  } catch (error) {
    console.error("Get follow-up bookings error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch follow-up bookings",
      error: error.message,
    })
  }
}

// Get booking statistics
const getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    // Build date filter
    const dateFilter = {}
    if (startDate || endDate) {
      dateFilter.createdAt = {}
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate)
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate)
    }

    // Get overall statistics
    const totalBookings = await Booking.countDocuments(dateFilter)
    const totalEstimated = await Booking.aggregate([
      { $match: { ...dateFilter, bookingStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$estimatedTotal" } } },
    ])

    // Get status breakdown
    const statusStats = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 },
          estimatedRevenue: { $sum: "$estimatedTotal" },
        },
      },
    ])

    // Get bookings needing follow-up
    const needsFollowUp = await Booking.countDocuments({
      ...dateFilter,
      $or: [{ bookingStatus: "pending" }, { followUpDate: { $lte: new Date() } }],
    })

    // Get popular packages
    const popularPackages = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$packageId",
          bookings: { $sum: 1 },
          estimatedRevenue: { $sum: "$estimatedTotal" },
          packageTitle: { $first: "$packageTitle" },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 },
    ])

    res.json({
      success: true,
      data: {
        overview: {
          totalBookings,
          totalEstimated: totalEstimated[0]?.total || 0,
          averageBookingValue: totalBookings > 0 ? (totalEstimated[0]?.total || 0) / totalBookings : 0,
          needsFollowUp,
        },
        statusBreakdown: statusStats,
        popularPackages,
      },
    })
  } catch (error) {
    console.error("Get booking stats error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking statistics",
      error: error.message,
    })
  }
}

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingByReference,
  getBookingsByCustomer,
  updateBooking,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
  getBookingStats,
  getFollowUpBookings, // Added new function
}
