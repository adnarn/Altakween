const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  // Package Information
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  packageTitle: {
    type: String,
    required: true,
  },
  packagePrice: {
    type: String,
    required: true,
  },

  // Reference to the user who made the booking
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Customer Information
  customerInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },

  // Booking Details
  bookingDetails: {
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    numberOfTravelers: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
      infants: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    roomType: {
      type: String,
      enum: ["single", "double", "triple", "family", "suite"],
      default: "double",
    },
    specialRequests: {
      type: String,
      maxlength: 500,
    },
  },

  estimatedTotal: {
    type: String,
    required: true,
  },

  bookingStatus: {
    type: String,
    enum: ["pending", "contacted", "confirmed", "cancelled", "completed"],
    default: "pending",
  },

  // Booking Reference
  bookingReference: {
    type: String,
    unique: true,
  },

  emergencyContact: {
    name: String,
    phone: String,
    relationship: String,
  },

  adminNotes: {
    type: String,
    maxlength: 1000,
  },
  adminActivityLogs: [
    {
      updatedBy: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ["pending", "contacted", "confirmed", "cancelled", "completed"],
      },
      note: {
        type: String,
        maxlength: 1000,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  contactedAt: {
    type: Date,
  },
  contactedBy: {
    type: String,
  },
  followUpDate: {
    type: Date,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Generate booking reference before saving
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    this.bookingReference = `BK${timestamp}${random}`.toUpperCase()
  }
  this.updatedAt = Date.now()
  next()
})

// Calculate total travelers
bookingSchema.virtual("totalTravelers").get(function () {
  return (
    this.bookingDetails.numberOfTravelers.adults +
    this.bookingDetails.numberOfTravelers.children +
    this.bookingDetails.numberOfTravelers.infants
  )
})

// Calculate booking duration in days
bookingSchema.virtual("duration").get(function () {
  const start = new Date(this.bookingDetails.startDate)
  const end = new Date(this.bookingDetails.endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Customer full name
bookingSchema.virtual("customerFullName").get(function () {
  return `${this.customerInfo.firstName} ${this.customerInfo.lastName}`
})

bookingSchema.virtual("needsFollowUp").get(function () {
  if (this.bookingStatus === "pending") return true
  if (this.followUpDate && new Date() > this.followUpDate) return true
  return false
})

// Indexes for better query performance
bookingSchema.index({ bookingReference: 1 })
bookingSchema.index({ "customerInfo.email": 1 })
bookingSchema.index({ packageId: 1 })
bookingSchema.index({ bookingStatus: 1 })
bookingSchema.index({ createdAt: -1 })
bookingSchema.index({ followUpDate: 1 })

// Ensure virtual fields are serialized
bookingSchema.set("toJSON", { virtuals: true })
bookingSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Booking", bookingSchema)
