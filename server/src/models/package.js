const mongoose = require("mongoose")

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Package category is required"],
      enum: ["pilgrimage", "travel", "tour", "business", "vacation"],
      default: "travel",
    },
    location: {
      type: String,
      required: [true, "Package location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    price: {
      type: String,
      required: [true, "Package price is required"],
      trim: true,
    },
    numericPrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    duration: {
      type: String,
      required: [true, "Package duration is required"],
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    reviews: {
      type: Number,
      min: [0, "Reviews count cannot be negative"],
      default: 0,
    },
    image: {
      type: String,
      trim: true,
      default:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    includes: [
      {
        type: String,
        trim: true,
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    maxCapacity: {
      type: Number,
      min: [1, "Capacity must be at least 1"],
    },
    availableSlots: {
      type: Number,
      min: [0, "Available slots cannot be negative"],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

packageSchema.index({ category: 1 })
packageSchema.index({ status: 1 })
packageSchema.index({ numericPrice: 1 })
packageSchema.index({ rating: -1 })
packageSchema.index({ featured: -1 })
packageSchema.index({ title: "text", description: "text", location: "text" })

packageSchema.pre("save", function (next) {
  if (this.price && typeof this.price === "string") {
    // Extract numeric value from price string (e.g., "₦2,500,000" -> 2500000)
    const numericMatch = this.price.match(/[\d,]+/)
    if (numericMatch) {
      this.numericPrice = Number.parseInt(numericMatch[0].replace(/,/g, ""))
    }
  }
  next()
})

module.exports = mongoose.model("Package", packageSchema)
