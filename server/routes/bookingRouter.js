const express = require("express")
const router = express.Router()
const {
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
} = require("../controllers/bookingController")

// Public routes (for customers)
router.post("/", createBooking)
router.get("/reference/:reference", getBookingByReference)
router.get("/customer/:email", getBookingsByCustomer)

// Admin routes (protected - you can add authentication middleware later)
router.get("/", getAllBookings)
router.get("/stats", getBookingStats)
router.get("/:id", getBookingById)
router.put("/:id", updateBooking)
router.put("/:id/status", updateBookingStatus)
router.patch("/:id/cancel", cancelBooking)
router.delete("/:id", deleteBooking)

module.exports = router
